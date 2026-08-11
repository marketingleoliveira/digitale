-- Update "Super Brilho" to "Estamparia Digital HD"
UPDATE public.technologies
SET 
  name = 'Estamparia Digital HD',
  slug = 'estamparia-digital-hd',
  short_description = 'Alta definição e cores vibrantes.',
  description = 'Tecnologia de estamparia digital de alta definição que garante cores vibrantes, nitidez excepcional nos detalhes e durabilidade superior, permitindo infinitas possibilidades de cores e desenhos.'
WHERE name ILIKE '%Super Brilho%';

-- Ensure 4 Way Stretch exists
INSERT INTO public.technologies (name, slug, short_description, icon, is_active, display_order)
SELECT '4 Way Stretch', '4-way-stretch', 'Elasticidade multidirecional.', 'Maximize', true, 10
WHERE NOT EXISTS (SELECT 1 FROM public.technologies WHERE name = '4 Way Stretch');

-- Ensure Zero Transparência exists
INSERT INTO public.technologies (name, slug, short_description, icon, is_active, display_order)
SELECT 'Zero Transparência', 'zero-transparencia', 'Segurança total no uso.', 'EyeOff', true, 11
WHERE NOT EXISTS (SELECT 1 FROM public.technologies WHERE name = 'Zero Transparência');
