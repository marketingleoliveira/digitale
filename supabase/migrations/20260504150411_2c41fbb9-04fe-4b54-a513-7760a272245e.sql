
CREATE TABLE IF NOT EXISTS public.agent_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES public.agent_conversations(id) ON DELETE SET NULL,
  visitor_name text,
  whatsapp text,
  cnpj text,
  email text,
  segment text,
  interest_summary text,
  interest_level text NOT NULL DEFAULT 'morno',
  status text NOT NULL DEFAULT 'new',
  page_url text,
  source text DEFAULT 'agente',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert agent leads"
  ON public.agent_leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage agent leads"
  ON public.agent_leads FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role));

CREATE TRIGGER trg_agent_leads_updated_at
  BEFORE UPDATE ON public.agent_leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS idx_agent_leads_created ON public.agent_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_leads_conv ON public.agent_leads(conversation_id);
