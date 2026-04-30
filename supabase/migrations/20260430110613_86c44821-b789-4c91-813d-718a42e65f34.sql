CREATE TABLE public.lead_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fabric_lead_id uuid NOT NULL UNIQUE REFERENCES public.fabric_leads(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending', -- pending | validating | qualified | suspicious | rejected | error
  score integer NOT NULL DEFAULT 0, -- 0-100
  cnpj_valid boolean,
  cnae_match boolean,
  email_domain_ok boolean,
  whatsapp_format_ok boolean,
  company_analysis text,
  risk_signals jsonb DEFAULT '[]'::jsonb,
  positive_signals jsonb DEFAULT '[]'::jsonb,
  recommendation text, -- Curto: "Contatar agora" | "Avaliar depois" | "Descartar"
  ai_summary text,
  validated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lead_validations_status ON public.lead_validations(status);
CREATE INDEX idx_lead_validations_score ON public.lead_validations(score DESC);

ALTER TABLE public.lead_validations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage lead validations"
  ON public.lead_validations
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role));

CREATE TRIGGER trg_lead_validations_updated_at
  BEFORE UPDATE ON public.lead_validations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();