import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatRequest {
  conversation_id?: string;
  session_id: string;
  message: string;
  page_url?: string;
  user_agent?: string;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .trim();
}

function findKnowledgeMatch(message: string, knowledge: any[]): any | null {
  const norm = normalize(message);
  let best: { item: any; score: number } | null = null;

  for (const item of knowledge) {
    const keywords = (item.keywords || "")
      .split(",")
      .map((k: string) => normalize(k))
      .filter(Boolean);
    let score = 0;
    for (const kw of keywords) {
      if (kw && norm.includes(kw)) score += kw.length;
    }
    const qNorm = normalize(item.question);
    const qWords = qNorm.split(/\s+/).filter((w) => w.length > 3);
    for (const w of qWords) {
      if (norm.includes(w)) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { item, score };
    }
  }
  return best && best.score >= 4 ? best.item : null;
}

// Extract phone (BR) and CNPJ from a free-text message
function extractContactData(text: string): { whatsapp?: string; cnpj?: string } {
  const result: { whatsapp?: string; cnpj?: string } = {};
  const onlyDigits = (s: string) => s.replace(/\D/g, "");

  // CNPJ: 14 digits
  const cnpjMatch = text.match(/\d{2}[.\s-]?\d{3}[.\s-]?\d{3}[.\s-]?\d{4}[.\s-]?\d{2}/);
  if (cnpjMatch) {
    const d = onlyDigits(cnpjMatch[0]);
    if (d.length === 14) result.cnpj = d;
  } else {
    const allDigits = onlyDigits(text);
    if (allDigits.length === 14) result.cnpj = allDigits;
  }

  // WhatsApp BR: 10 or 11 digits, optional +55
  const phoneRegex = /(?:\+?55\s?)?\(?\d{2}\)?\s?9?\s?\d{4}[\s-]?\d{4}/g;
  const matches = text.match(phoneRegex);
  if (matches) {
    for (const m of matches) {
      const d = onlyDigits(m).replace(/^55/, "");
      if (d.length === 10 || d.length === 11) {
        result.whatsapp = d;
        break;
      }
    }
  }
  return result;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const body: ChatRequest = await req.json();
    if (!body.session_id || !body.message?.trim()) {
      return new Response(JSON.stringify({ error: "missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load settings + knowledge
    const [{ data: settings }, { data: knowledge }] = await Promise.all([
      supabase.from("agent_settings").select("*").eq("key", "main").maybeSingle(),
      supabase.from("agent_knowledge").select("*").eq("is_active", true),
    ]);

    if (settings && settings.is_enabled === false) {
      return new Response(JSON.stringify({ error: "agent disabled" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get/create conversation
    let conversationId = body.conversation_id;
    let conversation: any = null;
    if (!conversationId) {
      const { data: existing } = await supabase
        .from("agent_conversations")
        .select("*")
        .eq("session_id", body.session_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        conversationId = existing.id;
        conversation = existing;
      } else {
        const { data: newConv, error: convErr } = await supabase
          .from("agent_conversations")
          .insert({
            session_id: body.session_id,
            page_url: body.page_url,
            user_agent: body.user_agent,
          })
          .select("*")
          .single();
        if (convErr) throw convErr;
        conversationId = newConv.id;
        conversation = newConv;
      }
    } else {
      const { data: c } = await supabase
        .from("agent_conversations")
        .select("*")
        .eq("id", conversationId)
        .maybeSingle();
      conversation = c;
    }

    // Try to extract WhatsApp/CNPJ from this user message and persist
    const extracted = extractContactData(body.message);
    const updateData: any = {};
    if (extracted.whatsapp && !conversation?.visitor_whatsapp) {
      updateData.visitor_whatsapp = extracted.whatsapp;
    }
    if (extracted.cnpj && !conversation?.visitor_cnpj) {
      updateData.visitor_cnpj = extracted.cnpj;
    }
    if (Object.keys(updateData).length) {
      await supabase.from("agent_conversations").update(updateData).eq("id", conversationId);
      Object.assign(conversation, updateData);
    }

    // Detect handoff: when we now have BOTH whatsapp and cnpj → transfer to human
    const hasContact = !!(conversation?.visitor_whatsapp && conversation?.visitor_cnpj);
    const justQualified = hasContact && !conversation?.handoff_at;

    // Save user message
    await supabase.from("agent_messages").insert({
      conversation_id: conversationId,
      role: "user",
      content: body.message,
    });

    // Load recent history
    const { data: history } = await supabase
      .from("agent_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(20);

    let reply = "";
    let isFallback = false;
    let matchedId: string | null = null;

    // If lead just provided contact, send handoff message immediately (skip AI/KB)
    if (justQualified) {
      const agentName = settings?.agent_name || "Rafael";
      reply = `Perfeito! 🙌 Recebi seu WhatsApp e CNPJ. Vou transferir pro representante especialista no seu segmento agora — ele vai te chamar no WhatsApp em alguns minutos com tudo certinho. Muito obrigado pelo contato!`;
      isFallback = false;
      await supabase
        .from("agent_conversations")
        .update({
          handoff_at: new Date().toISOString(),
          interest_level: "quente",
          needs_followup: true,
          status: "handoff",
        })
        .eq("id", conversationId);
    }

    // Try direct knowledge match (only if not handoff)
    const match = !justQualified ? findKnowledgeMatch(body.message, knowledge || []) : null;

    if (!justQualified && match) {
      reply = match.answer;
      matchedId = match.id;
    } else if (!justQualified && LOVABLE_API_KEY) {
      // Use AI with knowledge as context
      const knowledgeContext = (knowledge || [])
        .map((k: any) => `- ${k.question}\n  Resposta: ${k.answer}`)
        .join("\n");

      const persona = settings?.persona || "Você é um vendedor consultivo brasileiro.";
      const fallback = settings?.fallback_message || "Vou confirmar com nosso time e te retorno pelo WhatsApp.";
      const agentName = settings?.agent_name || "Rafael";

      const haveWhats = !!conversation?.visitor_whatsapp;
      const haveCnpj = !!conversation?.visitor_cnpj;
      const stage = haveWhats && haveCnpj
        ? "FECHAMENTO"
        : haveWhats || haveCnpj
        ? "COLETANDO_DADOS"
        : "QUALIFICACAO";

      const systemPrompt = `${persona}

Seu nome é ${agentName}. Você trabalha na Digitale Têxtil (indústria têxtil brasileira de tecidos de alta tecnologia para confecções).

ETAPA ATUAL DESTA CONVERSA: ${stage}
- WhatsApp já recebido? ${haveWhats ? "SIM (" + conversation.visitor_whatsapp + ")" : "NÃO"}
- CNPJ já recebido? ${haveCnpj ? "SIM (" + conversation.visitor_cnpj + ")" : "NÃO"}

SEU FLUXO COMO VENDEDOR (siga sempre):
1. APRESENTAÇÃO: Já se apresentou na saudação inicial. Não repita.
2. DESCOBERTA: Faça perguntas curtas pra entender — qual segmento (fitness, moda íntima, esportivo, praia, profissional, etc), que tipo de tecido procura, se já tem confecção/marca, volume aproximado.
3. INTERESSE: Use a base de conhecimento pra responder dúvidas sobre produtos.
4. QUALIFICAÇÃO: Quando perceber INTERESSE REAL DE COMPRA (ele perguntou sobre preço, prazo, MOQ, amostras, ou demonstrou que tem uma marca/confecção), DIGA NATURALMENTE algo como: "Show! Pra eu te conectar com o representante certo do seu segmento, me passa seu WhatsApp e o CNPJ da sua confecção?". Peça os DOIS dados juntos.
5. Se ele já passou só um dos dois (WhatsApp OU CNPJ), peça o que falta de forma educada e curta.
6. Após receber AMBOS, o sistema fará o encerramento automaticamente — não tente fechar você mesmo.

REGRAS CRÍTICAS:
1. NUNCA admita ser uma IA, robô, bot ou assistente virtual. Você é um vendedor humano do time comercial.
2. Use linguagem coloquial, calorosa, brasileira. Pode usar "tá", "pra", "né", emojis ocasionais.
3. Respostas CURTAS (1-3 frases). Vendedor não escreve textão.
4. NÃO invente dados (preço, MOQ, prazo, condições). Pra esses, peça WhatsApp+CNPJ e diga que o representante passa os detalhes.
5. Use APENAS as informações da base de conhecimento abaixo pra responder sobre produtos/empresa.
6. NUNCA forneça preços, MOQ, prazos de produção, condições de pagamento — sempre redirecione pro representante humano via WhatsApp.
7. Faça UMA pergunta por vez. Não despeje várias perguntas juntas.

BASE DE CONHECIMENTO DA EMPRESA:
${knowledgeContext}

PÁGINAS DO SITE: Tecidos, Estampas, Segmentos, Sustentabilidade, Sobre Nós, RADAR DIGITALE, Trabalhe Conosco.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...(history || []).map((m: any) => ({
          role: m.role === "bot" ? "assistant" : "user",
          content: m.content,
        })),
      ];

      const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages,
          temperature: 0.7,
        }),
      });

      if (aiRes.status === 429 || aiRes.status === 402) {
        reply = fallback;
        isFallback = true;
      } else if (!aiRes.ok) {
        reply = fallback;
        isFallback = true;
      } else {
        const aiData = await aiRes.json();
        reply = aiData.choices?.[0]?.message?.content?.trim() || fallback;
        if (reply.toLowerCase().includes(fallback.substring(0, 30).toLowerCase())) {
          isFallback = true;
        }
      }
    } else if (!justQualified) {
      reply = settings?.fallback_message || "Vou confirmar com nosso time e te retorno pelo WhatsApp.";
      isFallback = true;
    }

    // Save bot reply
    await supabase.from("agent_messages").insert({
      conversation_id: conversationId,
      role: "bot",
      content: reply,
      matched_knowledge_id: matchedId,
      is_fallback: isFallback,
    });

    if (isFallback) {
      await supabase
        .from("agent_conversations")
        .update({ needs_followup: true })
        .eq("id", conversationId);
    }

    return new Response(
      JSON.stringify({
        conversation_id: conversationId,
        reply,
        is_fallback: isFallback,
        typing_speed_ms: settings?.typing_speed_ms ?? 30,
        min_typing_delay_ms: settings?.min_typing_delay_ms ?? 800,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("chat-agent error", err);
    return new Response(JSON.stringify({ error: err.message || "internal" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});