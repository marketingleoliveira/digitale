-- Create storage policies for fabrics bucket uploads
CREATE POLICY "Allow authenticated users to upload fabric images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'fabrics' 
  AND (
    public.has_role(auth.uid(), 'admin'::app_role) 
    OR public.has_role(auth.uid(), 'editor'::app_role) 
    OR public.has_role(auth.uid(), 'desenvolvedor'::app_role)
  )
);

CREATE POLICY "Allow authenticated users to update fabric images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'fabrics' 
  AND (
    public.has_role(auth.uid(), 'admin'::app_role) 
    OR public.has_role(auth.uid(), 'editor'::app_role) 
    OR public.has_role(auth.uid(), 'desenvolvedor'::app_role)
  )
);

CREATE POLICY "Allow authenticated users to delete fabric images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'fabrics' 
  AND (
    public.has_role(auth.uid(), 'admin'::app_role) 
    OR public.has_role(auth.uid(), 'editor'::app_role) 
    OR public.has_role(auth.uid(), 'desenvolvedor'::app_role)
  )
);

CREATE POLICY "Anyone can view fabric images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'fabrics');