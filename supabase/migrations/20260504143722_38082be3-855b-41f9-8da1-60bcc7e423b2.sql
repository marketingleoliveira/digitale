-- Settings table (single row keyed by 'main')
CREATE TABLE public.agent_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL DEFAULT 'main',
  agent_name text NOT NULL DEFAULT 'Rafael',
  greeting text NOT NULL DEFAULT 'Oi! Tudo bem? Sou o Rafael, consultor da Digitale Têxtil. Em que posso te ajudar hoje?',
  persona text NOT NULL DEFAULT 'Você é um vendedor consultivo brasileiro experiente da Digitale Têxtil. Use linguagem coloquial, calorosa e direta — como um vendedor de verdade falando. Evite respostas longas, formais ou robóticas. Use no máximo 2-3 frases por resposta. Trate o cliente com gentileza, faça perguntas para entender a necessidade e conduza para uma venda. Nunca diga que é uma IA.',
  fallback_message text NOT NULL DEFAULT 'Boa pergunta! Deixa eu confirmar isso direitinho com nosso time comercial. Me passa seu WhatsApp que te retorno em alguns minutos com a resposta certinha, pode ser?',
  is_enabled boolean NOT NULL DEFAULT true,
  typing_speed_ms integer NOT NULL DEFAULT 30,
  min_typing_delay_ms integer NOT NULL DEFAULT 800,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view agent settings"
ON public.agent_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can manage agent settings"
ON public.agent_settings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role));

CREATE TRIGGER agent_settings_updated_at
BEFORE UPDATE ON public.agent_settings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

INSERT INTO public.agent_settings (key) VALUES ('main') ON CONFLICT DO NOTHING;

-- Knowledge base
CREATE TABLE public.agent_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'geral',
  question text NOT NULL,
  answer text NOT NULL,
  keywords text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_knowledge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active knowledge"
ON public.agent_knowledge FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage knowledge"
ON public.agent_knowledge FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role));

CREATE TRIGGER agent_knowledge_updated_at
BEFORE UPDATE ON public.agent_knowledge
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Seed knowledge
INSERT INTO public.agent_knowledge (category, question, answer, keywords, display_order) VALUES
('produtos', 'Quais tecidos vocês fabricam?', 'A gente trabalha com tecidos de alta tecnologia para moda fitness, esportiva, íntima, praia e profissional. Tem como você dar uma olhada na nossa página de Tecidos pra conhecer a linha completa! Quer que eu te ajude a encontrar algum tipo específico?', 'tecido,tecidos,produtos,linha,catalogo,catálogo', 1),
('produtos', 'Vocês fazem estampas?', 'Fazemos sim! Temos um catálogo gigante de estampas exclusivas e também produzimos estampas personalizadas pra sua marca. Dá uma olhada em Estampas no menu pra ver as opções!', 'estampa,estampas,print,prints,personalizada', 2),
('comercial', 'Qual o pedido mínimo?', 'O pedido mínimo varia conforme o tecido e a estampa. Posso te conectar com nosso comercial pra passar todos os detalhes do tecido que você se interessou. Me conta qual você está olhando?', 'minimo,mínimo,pedido,quantidade,mq', 3),
('comercial', 'Vocês vendem para pessoa física?', 'A gente atende confecções e marcas (B2B). Pra pessoa física, infelizmente não temos venda direta. Você é de uma confecção?', 'pessoa fisica,pessoa física,varejo,unidade,uma peça', 4),
('contato', 'Como falar com vocês?', 'Pode falar comigo aqui mesmo! Se preferir falar direto com nosso time comercial, é só clicar no botão verde do WhatsApp aqui do lado. Atendimento rápido e personalizado!', 'contato,falar,telefone,whatsapp,atendimento', 5),
('empresa', 'Onde vocês ficam?', 'Somos a Digitale Têxtil, indústria brasileira especializada em tecidos de alta tecnologia. Quer saber mais sobre nossa história? Tem uma página completa em Sobre Nós!', 'onde,localização,localizacao,endereço,endereco,empresa,quem', 6),
('produtos', 'Vocês trabalham com sustentabilidade?', 'Trabalhamos sim, e isso é coisa séria pra gente! Temos linha de tecidos sustentáveis e processos com baixo impacto ambiental. Tem uma página só sobre isso no nosso site, vale conferir!', 'sustentabilidade,sustentavel,sustentável,ecologico,ecológico,verde', 7),
('produtos', 'Quais segmentos vocês atendem?', 'Atendemos moda fitness, esportiva, praia, íntima, profissional, infantil e mais! Cada segmento tem tecidos específicos. Qual segmento você trabalha?', 'segmento,segmentos,nicho,mercado,publico,público', 8);

-- Conversations
CREATE TABLE public.agent_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  visitor_name text,
  visitor_whatsapp text,
  status text NOT NULL DEFAULT 'active',
  needs_followup boolean NOT NULL DEFAULT false,
  page_url text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_conversations_session ON public.agent_conversations(session_id);
CREATE INDEX idx_agent_conversations_created ON public.agent_conversations(created_at DESC);

ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create conversations"
ON public.agent_conversations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update own session conversation"
ON public.agent_conversations FOR UPDATE
USING (true);

CREATE POLICY "Anyone can view own session conversation"
ON public.agent_conversations FOR SELECT
USING (true);

CREATE POLICY "Admins manage conversations"
ON public.agent_conversations FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role));

CREATE TRIGGER agent_conversations_updated_at
BEFORE UPDATE ON public.agent_conversations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Messages
CREATE TABLE public.agent_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.agent_conversations(id) ON DELETE CASCADE,
  role text NOT NULL,
  content text NOT NULL,
  matched_knowledge_id uuid,
  is_fallback boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_messages_conv ON public.agent_messages(conversation_id, created_at);

ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert messages"
ON public.agent_messages FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view messages"
ON public.agent_messages FOR SELECT
USING (true);

CREATE POLICY "Admins manage messages"
ON public.agent_messages FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role));