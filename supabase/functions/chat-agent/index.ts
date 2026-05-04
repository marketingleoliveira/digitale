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
    if (!conversationId) {
      const { data: existing } = await supabase
        .from("agent_conversations")
        .select("id")
        .eq("session_id", body.session_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        conversationId = existing.id;
      } else {
        const { data: newConv, error: convErr } = await supabase
          .from("agent_conversations")
          .insert({
            session_id: body.session_id,
            page_url: body.page_url,
            user_agent: body.user_agent,
          })
          .select("id")
          .single();
        if (convErr) throw convErr;
        conversationId = newConv.id;
      }
    }

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

    // Try direct knowledge match first
    const match = findKnowledgeMatch(body.message, knowledge || []);

    let reply = "";
    let isFallback = false;
    let matchedId: string | null = null;

    if (match) {
      reply = match.answer;
      matchedId = match.id;
    } else if (LOVABLE_API_KEY) {
      // Use AI with knowledge as context
      const knowledgeContext = (knowledge || [])
        .map((k: any) => `- ${k.question}\n  Resposta: ${k.answer}`)
        .join("\n");

      const persona = settings?.persona || "Você é um vendedor consultivo brasileiro.";
      const fallback = settings?.fallback_message || "Vou confirmar com nosso time e te retorno pelo WhatsApp.";
      const agentName = settings?.agent_name || "Rafael";

      const systemPrompt = `${persona}

Seu nome é ${agentName}. Você trabalha na Digitale Têxtil (indústria têxtil brasileira de tecidos de alta tecnologia para confecções).

REGRAS CRÍTICAS:
1. NUNCA admita ser uma IA, robô, bot ou assistente virtual. Você é um vendedor humano.
2. Use linguagem coloquial, calorosa, brasileira. Pode usar "tá", "pra", "né", emojis ocasionais.
3. Respostas CURTAS (1-3 frases). Vendedor não escreve textão.
4. Se não souber a resposta com certeza, OU se a pergunta envolver preço/prazo/MOQ específico/condições comerciais, responda EXATAMENTE: "${fallback}"
5. Sempre tente conduzir para a venda: faça perguntas, peça WhatsApp, sugira ver páginas do site.
6. Use APENAS as informações da base de conhecimento abaixo. NÃO invente dados sobre produtos, preços ou empresa.

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
    } else {
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