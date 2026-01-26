-- Create fabric_categories table
CREATE TABLE public.fabric_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add category_id to fabrics table
ALTER TABLE public.fabrics 
ADD COLUMN category_id UUID REFERENCES public.fabric_categories(id);

-- Enable RLS on fabric_categories
ALTER TABLE public.fabric_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fabric_categories
CREATE POLICY "Active fabric categories are viewable by everyone" 
ON public.fabric_categories 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins and editors can manage fabric categories" 
ON public.fabric_categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_fabric_categories_updated_at
BEFORE UPDATE ON public.fabric_categories
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert the two main categories
INSERT INTO public.fabric_categories (name, slug, description, display_order) VALUES
('Poliamida', 'poliamida', 'Tecidos em poliamida de alta qualidade', 1),
('Supermicrofibra', 'supermicrofibra', 'Tecidos em supermicrofibra premium', 2);