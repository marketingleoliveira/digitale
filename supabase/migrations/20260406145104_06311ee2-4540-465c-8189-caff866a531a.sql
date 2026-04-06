
CREATE TABLE public.fabric_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fabric_id UUID REFERENCES public.fabrics(id) ON DELETE SET NULL,
  fabric_name TEXT NOT NULL,
  fabric_slug TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.fabric_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit fabric leads"
ON public.fabric_leads
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can manage fabric leads"
ON public.fabric_leads
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role));

CREATE POLICY "Admins can view all fabric leads"
ON public.fabric_leads
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role));

CREATE TRIGGER update_fabric_leads_updated_at
BEFORE UPDATE ON public.fabric_leads
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
