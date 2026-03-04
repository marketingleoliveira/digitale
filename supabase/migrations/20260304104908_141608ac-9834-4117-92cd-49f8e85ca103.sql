
-- Drop restrictive old policies and create unified ones for all buckets
-- Allow all authenticated users with admin/editor/desenvolvedor roles to do everything

-- Carousel: add desenvolvedor
DROP POLICY IF EXISTS "Admins can upload carousel images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update carousel images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete carousel images" ON storage.objects;

CREATE POLICY "Admin roles can upload carousel images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'carousel' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'desenvolvedor')));

CREATE POLICY "Admin roles can update carousel images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'carousel' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'desenvolvedor')));

CREATE POLICY "Admin roles can delete carousel images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'carousel' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'desenvolvedor')));

-- Testimonials: add desenvolvedor
DROP POLICY IF EXISTS "Admins can upload testimonial photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update testimonial photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete testimonial photos" ON storage.objects;

CREATE POLICY "Admin roles can upload testimonial photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'testimonials' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'desenvolvedor')));

CREATE POLICY "Admin roles can update testimonial photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'testimonials' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'desenvolvedor')));

CREATE POLICY "Admin roles can delete testimonial photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'testimonials' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'desenvolvedor')));

-- Resumes: add desenvolvedor to view/delete
DROP POLICY IF EXISTS "Admins can view resumes" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete resumes" ON storage.objects;

CREATE POLICY "Admin roles can view resumes"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'resumes' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'desenvolvedor')));

CREATE POLICY "Admin roles can delete resumes"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'resumes' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'desenvolvedor')));

-- Prints: add desenvolvedor
DROP POLICY IF EXISTS "Admins and editors can upload print images" ON storage.objects;
DROP POLICY IF EXISTS "Admins and editors can update print images" ON storage.objects;
DROP POLICY IF EXISTS "Admins and editors can delete print images" ON storage.objects;

CREATE POLICY "Admin roles can upload print images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'prints' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'desenvolvedor')));

CREATE POLICY "Admin roles can update print images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'prints' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'desenvolvedor')));

CREATE POLICY "Admin roles can delete print images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'prints' AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor') OR public.has_role(auth.uid(), 'desenvolvedor')));

-- Uploads: allow all authenticated to upload + update
DROP POLICY IF EXISTS "Authenticated users can upload to uploads" ON storage.objects;

CREATE POLICY "Authenticated users can upload to uploads bucket"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can update uploads"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'uploads');

-- Public read for uploads
DROP POLICY IF EXISTS "Public read access for uploads" ON storage.objects;
CREATE POLICY "Public can read uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');
