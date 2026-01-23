-- Add color_variants column to fabrics table
ALTER TABLE public.fabrics 
ADD COLUMN IF NOT EXISTS color_variants jsonb DEFAULT '[]'::jsonb;

-- Create storage bucket for fabric images
INSERT INTO storage.buckets (id, name, public)
VALUES ('fabrics', 'fabrics', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for fabric images
CREATE POLICY "Fabric images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'fabrics');

CREATE POLICY "Admins and editors can upload fabric images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'fabrics' 
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Admins and editors can update fabric images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'fabrics' 
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
);

CREATE POLICY "Admins and editors can delete fabric images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'fabrics' 
  AND (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
);

-- Update existing fabrics with sample color variants
UPDATE public.fabrics SET color_variants = '[
  {"name": "Preto", "hex": "#1a1a1a"},
  {"name": "Branco", "hex": "#ffffff"},
  {"name": "Azul Marinho", "hex": "#1e3a5f"},
  {"name": "Vermelho", "hex": "#c41e3a"}
]'::jsonb WHERE slug = 'milano';

UPDATE public.fabrics SET color_variants = '[
  {"name": "Grafite", "hex": "#4a4a4a"},
  {"name": "Bege", "hex": "#d4c5b5"},
  {"name": "Verde Militar", "hex": "#4b5320"},
  {"name": "Bordô", "hex": "#722f37"}
]'::jsonb WHERE slug = 'lyon';

UPDATE public.fabrics SET color_variants = '[
  {"name": "Preto", "hex": "#0a0a0a"},
  {"name": "Cinza Claro", "hex": "#b0b0b0"},
  {"name": "Azul Royal", "hex": "#4169e1"},
  {"name": "Verde Neon", "hex": "#39ff14"}
]'::jsonb WHERE slug = 'aerodry';

UPDATE public.fabrics SET color_variants = '[
  {"name": "Off-White", "hex": "#faf9f6"},
  {"name": "Rosa Blush", "hex": "#de9a9a"},
  {"name": "Lavanda", "hex": "#b57edc"},
  {"name": "Champagne", "hex": "#f7e7ce"}
]'::jsonb WHERE slug = 'veneza';