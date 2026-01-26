-- Atualizar TODAS as políticas RLS para incluir desenvolvedor com direitos totais

-- blog_posts
DROP POLICY IF EXISTS "Admins and editors can manage posts" ON public.blog_posts;
CREATE POLICY "Admins and editors can manage posts" 
ON public.blog_posts FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- blog_categories
DROP POLICY IF EXISTS "Admins and editors can manage categories" ON public.blog_categories;
CREATE POLICY "Admins and editors can manage categories" 
ON public.blog_categories FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- fabrics
DROP POLICY IF EXISTS "Admins and editors can manage fabrics" ON public.fabrics;
CREATE POLICY "Admins and editors can manage fabrics" 
ON public.fabrics FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- fabric_categories
DROP POLICY IF EXISTS "Admins and editors can manage fabric categories" ON public.fabric_categories;
CREATE POLICY "Admins and editors can manage fabric categories" 
ON public.fabric_categories FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- prints
DROP POLICY IF EXISTS "Admins and editors can manage prints" ON public.prints;
CREATE POLICY "Admins and editors can manage prints" 
ON public.prints FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- print_categories
DROP POLICY IF EXISTS "Admins and editors can manage print categories" ON public.print_categories;
CREATE POLICY "Admins and editors can manage print categories" 
ON public.print_categories FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- testimonials
DROP POLICY IF EXISTS "Admins and editors can manage testimonials" ON public.testimonials;
CREATE POLICY "Admins and editors can manage testimonials" 
ON public.testimonials FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'editor'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- carousel_slides
DROP POLICY IF EXISTS "Admins can manage slides" ON public.carousel_slides;
CREATE POLICY "Admins can manage slides" 
ON public.carousel_slides FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- contact_submissions
DROP POLICY IF EXISTS "Admins can manage submissions" ON public.contact_submissions;
CREATE POLICY "Admins can manage submissions" 
ON public.contact_submissions FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

DROP POLICY IF EXISTS "Admins can view all submissions" ON public.contact_submissions;
CREATE POLICY "Admins can view all submissions" 
ON public.contact_submissions FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- newsletter_subscribers
DROP POLICY IF EXISTS "Admins can manage subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can manage subscribers" 
ON public.newsletter_subscribers FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

DROP POLICY IF EXISTS "Admins can view all subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can view all subscribers" 
ON public.newsletter_subscribers FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- site_settings
DROP POLICY IF EXISTS "Only admins can modify settings" ON public.site_settings;
CREATE POLICY "Only admins can modify settings" 
ON public.site_settings FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- user_roles
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" 
ON public.user_roles FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" 
ON public.user_roles FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- permissions
DROP POLICY IF EXISTS "Only admins can manage permissions" ON public.permissions;
CREATE POLICY "Only admins can manage permissions" 
ON public.permissions FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);

-- role_permissions
DROP POLICY IF EXISTS "Only admins can manage role permissions" ON public.role_permissions;
CREATE POLICY "Only admins can manage role permissions" 
ON public.role_permissions FOR ALL 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR
  has_role(auth.uid(), 'desenvolvedor'::app_role)
);