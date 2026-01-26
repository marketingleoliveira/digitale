-- Add is_featured column to fabrics table
ALTER TABLE public.fabrics 
ADD COLUMN is_featured boolean NOT NULL DEFAULT false;

-- Add index for faster queries
CREATE INDEX idx_fabrics_is_featured ON public.fabrics (is_featured) WHERE is_featured = true;