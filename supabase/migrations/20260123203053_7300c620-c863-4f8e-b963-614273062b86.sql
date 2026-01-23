-- Create storage bucket for testimonial photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('testimonials', 'testimonials', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for testimonials bucket
CREATE POLICY "Testimonial photos are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'testimonials');

CREATE POLICY "Admins can upload testimonial photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'testimonials' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

CREATE POLICY "Admins can update testimonial photos"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'testimonials' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));

CREATE POLICY "Admins can delete testimonial photos"
ON storage.objects
FOR DELETE
USING (bucket_id = 'testimonials' AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role)));