-- Create storage bucket for blog posts
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies for blog bucket
CREATE POLICY "Blog images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog');

CREATE POLICY "Authenticated users can upload blog images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'blog' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update blog images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'blog' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete blog images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'blog' AND auth.role() = 'authenticated');