
-- Add likes column to radar_editions
ALTER TABLE public.radar_editions ADD COLUMN likes integer NOT NULL DEFAULT 0;

-- Create table to track likes by IP
CREATE TABLE public.radar_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  edition_id uuid NOT NULL REFERENCES public.radar_editions(id) ON DELETE CASCADE,
  ip_address text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(edition_id, ip_address)
);

-- Enable RLS
ALTER TABLE public.radar_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can view likes
CREATE POLICY "Anyone can view radar likes"
ON public.radar_likes FOR SELECT
USING (true);

-- Anyone can insert a like
CREATE POLICY "Anyone can insert radar likes"
ON public.radar_likes FOR INSERT
WITH CHECK (true);

-- Admins can manage all likes
CREATE POLICY "Admins manage radar likes"
ON public.radar_likes FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role));
