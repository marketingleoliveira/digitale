ALTER TABLE public.agent_conversations
  ADD COLUMN IF NOT EXISTS visitor_cnpj text,
  ADD COLUMN IF NOT EXISTS interest_level text DEFAULT 'frio',
  ADD COLUMN IF NOT EXISTS handoff_at timestamptz,
  ADD COLUMN IF NOT EXISTS qualification_summary text;