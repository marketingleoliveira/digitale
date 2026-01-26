-- Atualizar políticas para incluir o cargo desenvolvedor

-- job_openings
DROP POLICY IF EXISTS "Admins and editors can manage job openings" ON public.job_openings;
CREATE POLICY "Admins and editors can manage job openings" 
ON public.job_openings 
FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- job_applications - permitir que admin/editor/desenvolvedor vejam
DROP POLICY IF EXISTS "Admins can manage job applications" ON public.job_applications;
CREATE POLICY "Admins can manage job applications" 
ON public.job_applications 
FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

DROP POLICY IF EXISTS "Admins can view all job applications" ON public.job_applications;
CREATE POLICY "Admins can view all job applications" 
ON public.job_applications 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);