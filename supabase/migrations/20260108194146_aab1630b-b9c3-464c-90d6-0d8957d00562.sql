-- Create carousel_slides table
CREATE TABLE public.carousel_slides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  link_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.carousel_slides ENABLE ROW LEVEL SECURITY;

-- Public can view active slides
CREATE POLICY "Anyone can view active slides" 
ON public.carousel_slides 
FOR SELECT 
USING (is_active = true);

-- Admins can manage all slides
CREATE POLICY "Admins can manage slides" 
ON public.carousel_slides 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_carousel_slides_updated_at
BEFORE UPDATE ON public.carousel_slides
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for carousel images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('carousel', 'carousel', true);

-- Storage policies for carousel bucket
CREATE POLICY "Carousel images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'carousel');

CREATE POLICY "Admins can upload carousel images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'carousel' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update carousel images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'carousel' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete carousel images"
ON storage.objects FOR DELETE
USING (bucket_id = 'carousel' AND has_role(auth.uid(), 'admin'::app_role));