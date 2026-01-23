-- Create fabrics table for product details
CREATE TABLE public.fabrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  image_url TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '{}'::jsonb,
  applications TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fabrics ENABLE ROW LEVEL SECURITY;

-- Public can view active fabrics
CREATE POLICY "Active fabrics are viewable by everyone"
ON public.fabrics
FOR SELECT
USING (is_active = true);

-- Admins and editors can manage fabrics
CREATE POLICY "Admins and editors can manage fabrics"
ON public.fabrics
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_fabrics_updated_at
BEFORE UPDATE ON public.fabrics
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert default fabrics
INSERT INTO public.fabrics (name, slug, short_description, description, features, specifications, applications, display_order) VALUES
(
  'Milano',
  'milano',
  'Tecido de alta compressão, ideal para leggings e shorts fitness com excelente suporte muscular.',
  'O Milano é o tecido premium da Digitale para moda fitness. Com alto poder de compressão e recuperação elástica excepcional, oferece suporte muscular ideal para treinos intensos. Sua composição exclusiva garante conforto térmico e durabilidade superior.',
  '["Alto poder de compressão", "Recuperação elástica excepcional", "Proteção UV 50+", "Tecnologia antibacteriana", "Secagem rápida", "Zero transparência"]'::jsonb,
  '{"composicao": "88% Poliamida, 12% Elastano", "gramatura": "280g/m²", "largura": "1,50m", "cores": "40+ opções"}'::jsonb,
  ARRAY['Leggings', 'Shorts', 'Tops esportivos', 'Macacões fitness'],
  1
),
(
  'Lyon',
  'lyon',
  'Malha com toque suave e caimento perfeito, versátil para diversas aplicações esportivas.',
  'O Lyon combina suavidade e performance em uma malha versátil. Seu toque aveludado e caimento fluido o tornam perfeito para peças que exigem conforto e elegância. Ideal para quem busca versatilidade sem abrir mão da qualidade.',
  '["Toque aveludado", "Caimento fluido", "Alta respirabilidade", "Secagem rápida", "Resistente a pilling", "Fácil manutenção"]'::jsonb,
  '{"composicao": "92% Poliamida, 8% Elastano", "gramatura": "220g/m²", "largura": "1,50m", "cores": "35+ opções"}'::jsonb,
  ARRAY['Blusas', 'Vestidos esportivos', 'Saias', 'Conjuntos casual'],
  2
),
(
  'Aerodry',
  'aerodry',
  'Tecnologia dry fit avançada com secagem ultra-rápida e alta respirabilidade.',
  'O Aerodry é a escolha ideal para atletas de alta performance. Com tecnologia dry fit de última geração, proporciona secagem até 3x mais rápida que tecidos convencionais. Perfeito para atividades de alto impacto e treinos intensos.',
  '["Secagem 3x mais rápida", "Tecnologia Dry Fit", "Ultra respirável", "Controle de odor", "Leve e confortável", "Proteção UV"]'::jsonb,
  '{"composicao": "100% Poliéster texturizado", "gramatura": "150g/m²", "largura": "1,60m", "cores": "50+ opções"}'::jsonb,
  ARRAY['Camisetas', 'Regatas', 'Bermudas', 'Uniformes esportivos'],
  3
),
(
  'Veneza',
  'veneza',
  'Acabamento acetinado premium com brilho sofisticado para peças elegantes.',
  'O Veneza traz sofisticação ao universo esportivo. Seu acabamento acetinado confere brilho elegante e toque luxuoso. Ideal para peças que transitam entre o esporte e o lifestyle, mantendo performance e estilo.',
  '["Brilho acetinado", "Toque luxuoso", "Caimento elegante", "Alta durabilidade", "Cores vibrantes", "Fácil costura"]'::jsonb,
  '{"composicao": "85% Poliamida, 15% Elastano", "gramatura": "240g/m²", "largura": "1,50m", "cores": "30+ opções"}'::jsonb,
  ARRAY['Bodys', 'Macacões', 'Peças premium', 'Moda praia'],
  4
);