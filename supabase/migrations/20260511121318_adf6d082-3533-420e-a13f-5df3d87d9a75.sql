
CREATE TABLE public.radar_topic_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic TEXT NOT NULL,
  name TEXT,
  email TEXT,
  message TEXT,
  page_url TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.radar_topic_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit topic suggestions"
ON public.radar_topic_suggestions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view topic suggestions"
ON public.radar_topic_suggestions FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role));

CREATE POLICY "Admins can manage topic suggestions"
ON public.radar_topic_suggestions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role));

CREATE TRIGGER update_radar_topic_suggestions_updated_at
BEFORE UPDATE ON public.radar_topic_suggestions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
