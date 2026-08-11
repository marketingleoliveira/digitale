-- Atualiza tecnologias existentes para uppercase
UPDATE public.technologies SET name = 'PROTEÇÃO UV 50+' WHERE name ILIKE '%Proteção UV%';
UPDATE public.technologies SET name = 'DRY FAST' WHERE name ILIKE '%Dry Fast%';
UPDATE public.technologies SET name = 'ANTIBACTERIANO' WHERE name ILIKE '%Antibacteriano%';
UPDATE public.technologies SET name = 'COMPRESSÃO INTELIGENTE' WHERE name ILIKE '%Compressão Inteligente%';
UPDATE public.technologies SET name = 'Fio Reciclado PET' WHERE name ILIKE '%Fio Reciclado%';
UPDATE public.technologies SET name = '4 WAY STRETCH' WHERE name ILIKE '%4 Way Stretch%';
UPDATE public.technologies SET name = 'ZERO TRANSPARÊNCIA' WHERE name ILIKE '%Zero Transparência%';

-- Garante que slugs estejam corretos
UPDATE public.technologies SET slug = 'estamparia-digital-hd' WHERE name = 'ESTAMPARIA DIGITAL HD';
UPDATE public.technologies SET slug = '4-way-stretch' WHERE name = '4 WAY STRETCH';
UPDATE public.technologies SET slug = 'zero-transparencia' WHERE name = 'ZERO TRANSPARÊNCIA';
