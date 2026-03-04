
-- Radar Digitale categories
CREATE TABLE public.radar_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Radar Digitale editions (newsletter issues)
CREATE TABLE public.radar_editions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.radar_categories(id) ON DELETE SET NULL,
  edition_date DATE NOT NULL DEFAULT CURRENT_DATE,
  cover_image_url TEXT,
  file_url TEXT NOT NULL,
  description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.radar_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radar_editions ENABLE ROW LEVEL SECURITY;

-- Public read for active categories
CREATE POLICY "Anyone can view active radar categories"
  ON public.radar_categories FOR SELECT
  USING (is_active = true);

-- Public read for published editions
CREATE POLICY "Anyone can view published radar editions"
  ON public.radar_editions FOR SELECT
  USING (is_published = true);

-- Admin/dev full access to categories
CREATE POLICY "Admins manage radar categories"
  ON public.radar_categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'desenvolvedor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'desenvolvedor'));

-- Admin/dev full access to editions
CREATE POLICY "Admins manage radar editions"
  ON public.radar_editions FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'desenvolvedor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'desenvolvedor'));

-- Insert some default categories
INSERT INTO public.radar_categories (name, slug, display_order) VALUES
  ('Tendência', 'tendencia', 1),
  ('Sustentabilidade', 'sustentabilidade', 2),
  ('Tecnologia', 'tecnologia', 3),
  ('Mercado', 'mercado', 4);
