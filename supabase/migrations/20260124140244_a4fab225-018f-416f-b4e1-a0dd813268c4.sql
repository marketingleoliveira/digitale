-- Create print_categories table with support for subcategories
CREATE TABLE public.print_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES public.print_categories(id) ON DELETE CASCADE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.print_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public viewing
CREATE POLICY "Active print categories are viewable by everyone" 
ON public.print_categories 
FOR SELECT 
USING (is_active = true);

-- Create policies for admin/editor management
CREATE POLICY "Admins and editors can manage print categories" 
ON public.print_categories 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_print_categories_updated_at
BEFORE UPDATE ON public.print_categories
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add category_id foreign key to prints table (replacing the text category field)
ALTER TABLE public.prints 
ADD COLUMN category_id UUID REFERENCES public.print_categories(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_prints_category_id ON public.prints(category_id);
CREATE INDEX idx_print_categories_parent_id ON public.print_categories(parent_id);