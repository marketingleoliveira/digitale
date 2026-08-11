CREATE TABLE public.technologies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text,
  description text,
  image_url text,
  icon text,
  benefits jsonb NOT NULL DEFAULT '[]'::jsonb,
  applications jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.technologies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.technologies TO authenticated;
GRANT ALL ON public.technologies TO service_role;

ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active technologies"
ON public.technologies FOR SELECT
USING (is_active = true OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'desenvolvedor') OR public.has_role(auth.uid(), 'editor'));

CREATE POLICY "Admins can manage technologies"
ON public.technologies FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'desenvolvedor') OR public.has_role(auth.uid(), 'editor'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'desenvolvedor') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER update_technologies_updated_at
BEFORE UPDATE ON public.technologies
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_technologies_active_order ON public.technologies (is_active, display_order);