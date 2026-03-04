
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload to uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'uploads');

-- Public read
CREATE POLICY "Public read access for uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- Admin/dev can delete
CREATE POLICY "Admins can delete uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'uploads' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'desenvolvedor')));
