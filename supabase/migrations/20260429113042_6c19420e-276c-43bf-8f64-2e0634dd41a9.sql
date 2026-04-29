
CREATE POLICY "Admins can delete fabric leads"
ON public.fabric_leads
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role));
