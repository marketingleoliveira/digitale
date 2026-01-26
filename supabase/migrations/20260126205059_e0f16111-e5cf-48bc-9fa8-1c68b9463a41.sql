-- Create segments table
CREATE TABLE public.segments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'waves',
  hero_image TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  long_description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  fabrics JSONB DEFAULT '[]'::jsonb,
  subcategories JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.segments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Active segments are viewable by everyone"
ON public.segments
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins and editors can manage segments"
ON public.segments
FOR ALL
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role) OR 
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- Create trigger for updated_at
CREATE TRIGGER update_segments_updated_at
BEFORE UPDATE ON public.segments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial data
INSERT INTO public.segments (slug, name, icon, description, long_description, features, fabrics, subcategories, benefits, display_order) VALUES
(
  'praia',
  'Praia',
  'waves',
  'Tecidos de alta performance para moda praia, com proteção UV, secagem rápida e cores vibrantes.',
  'Nossa linha de tecidos para moda praia foi desenvolvida pensando nas necessidades específicas deste segmento. Com tecnologias exclusivas de proteção UV, resistência ao cloro e secagem ultra-rápida, nossos tecidos garantem durabilidade, conforto e cores vibrantes que não desbotam mesmo após exposição prolongada ao sol e água salgada.',
  '["Proteção UV 50+", "Secagem Rápida", "Resistente ao Cloro", "Cores Vibrantes", "Alta Elasticidade", "Antibacteriano"]',
  '[{"name": "Oceanic", "slug": "oceanic"}, {"name": "Oceanic Eco", "slug": "oceanic-eco"}, {"name": "Softskin", "slug": "softskin"}, {"name": "Intense", "slug": "intense"}, {"name": "Caribe", "slug": "caribe"}]',
  '[{"name": "Biquínis", "description": "Tecidos com alta elasticidade e resistência ao cloro e sal, perfeitos para criar peças que mantêm a forma e as cores por muito mais tempo.", "features": ["Alta elasticidade", "Resistência ao sal", "Secagem rápida"]}, {"name": "Maiôs", "description": "Malhas com compressão modeladora e secagem ultra-rápida, ideais para peças que valorizam o corpo com conforto.", "features": ["Compressão modeladora", "Toque suave", "Durabilidade"]}, {"name": "Sungas", "description": "Tecidos resistentes com excelente caimento, desenvolvidos para oferecer liberdade de movimento e durabilidade.", "features": ["Excelente caimento", "Resistência", "Conforto"]}, {"name": "Saídas de Praia", "description": "Tecidos leves e fluidos com proteção UV, perfeitos para criar peças elegantes e funcionais.", "features": ["Leveza", "Fluidez", "Proteção UV"]}, {"name": "Camisetas Proteção UV", "description": "Malhas com FPU 50+ e tecnologia antibacteriana, essenciais para proteção solar com estilo.", "features": ["FPU 50+", "Antibacteriano", "Respirável"]}, {"name": "Infantil", "description": "Tecidos macios e seguros para a pele sensível das crianças, com todas as tecnologias de proteção.", "features": ["Toque macio", "Hipoalergênico", "Proteção total"]}]',
  '[{"title": "Durabilidade Superior", "description": "Tecidos que resistem a centenas de lavagens sem perder cor ou elasticidade."}, {"title": "Conforto Térmico", "description": "Tecnologia que regula a temperatura e mantém o corpo fresco."}, {"title": "Sustentabilidade", "description": "Opções eco-friendly com fibras recicladas e certificação GRS."}]',
  1
),
(
  'esportivo',
  'Esportivo',
  'dumbbell',
  'Malhas tecnológicas para alta performance esportiva, com elasticidade superior e conforto térmico.',
  'Nossa linha esportiva foi desenvolvida para atletas e entusiastas do fitness que exigem o máximo de performance. Com tecnologias de compressão, gestão de umidade e antibacteriano, nossos tecidos oferecem suporte muscular, conforto térmico e liberdade de movimento para qualquer tipo de atividade física.',
  '["Zero Transparência", "Alta Elasticidade", "Antibacteriano", "Conforto Térmico", "Compressão", "Secagem Rápida"]',
  '[{"name": "Milano", "slug": "milano"}, {"name": "Aerodry", "slug": "aerodry"}, {"name": "Lyon", "slug": "lyon"}, {"name": "Velocity", "slug": "velocity"}, {"name": "Flow", "slug": "flow"}]',
  '[{"name": "Academia", "description": "Tecidos com compressão e respirabilidade para treinos intensos, oferecendo suporte muscular e conforto.", "features": ["Compressão", "Respirabilidade", "Zero transparência"]}, {"name": "Natação", "description": "Malhas hidrodinâmicas resistentes ao cloro, desenvolvidas para performance na água.", "features": ["Hidrodinâmico", "Resistente ao cloro", "Secagem rápida"]}, {"name": "Corrida", "description": "Tecidos ultraleves com gestão de umidade, perfeitos para longas distâncias.", "features": ["Ultraleve", "Gestão de umidade", "Termorregulação"]}, {"name": "Beach Tennis", "description": "Proteção UV com secagem rápida, ideal para esportes de praia.", "features": ["Proteção UV", "Secagem rápida", "Leveza"]}, {"name": "Ciclismo", "description": "Tecidos aerodinâmicos com alta elasticidade, projetados para performance sobre duas rodas.", "features": ["Aerodinâmico", "Alta elasticidade", "Conforto prolongado"]}]',
  '[{"title": "Performance Superior", "description": "Tecidos que acompanham cada movimento sem restrição."}, {"title": "Recuperação Muscular", "description": "Compressão graduada que auxilia na recuperação pós-treino."}, {"title": "Anti-odor", "description": "Tecnologia antibacteriana que mantém a roupa fresca por mais tempo."}]',
  2
);