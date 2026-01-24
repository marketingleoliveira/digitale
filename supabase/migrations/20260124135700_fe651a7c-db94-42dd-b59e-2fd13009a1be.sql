-- Create prints table for managing print patterns
CREATE TABLE public.prints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.prints ENABLE ROW LEVEL SECURITY;

-- Create policies for public viewing
CREATE POLICY "Active prints are viewable by everyone" 
ON public.prints 
FOR SELECT 
USING (is_active = true);

-- Create policies for admin/editor management
CREATE POLICY "Admins and editors can manage prints" 
ON public.prints 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Create trigger for automatic timestamp updates using existing function
CREATE TRIGGER update_prints_updated_at
BEFORE UPDATE ON public.prints
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for prints if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('prints', 'prints', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for prints bucket
CREATE POLICY "Print images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'prints');

CREATE POLICY "Admins and editors can upload print images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'prints' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

CREATE POLICY "Admins and editors can update print images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'prints' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

CREATE POLICY "Admins and editors can delete print images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'prints' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));