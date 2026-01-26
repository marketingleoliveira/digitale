-- Create permissions table
CREATE TABLE public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  category text NOT NULL DEFAULT 'geral',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create role_permissions table (using text for role to avoid enum issues)
CREATE TABLE public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  permission_id uuid REFERENCES public.permissions(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(role, permission_id)
);

-- Enable RLS on new tables
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for permissions table (read-only for authenticated)
CREATE POLICY "Permissions are viewable by authenticated users"
ON public.permissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage permissions"
ON public.permissions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for role_permissions table
CREATE POLICY "Role permissions are viewable by authenticated users"
ON public.role_permissions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only admins can manage role permissions"
ON public.role_permissions FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default permissions
INSERT INTO public.permissions (name, description, category) VALUES
-- Tecidos
('fabrics.view', 'Visualizar tecidos', 'tecidos'),
('fabrics.create', 'Criar tecidos', 'tecidos'),
('fabrics.edit', 'Editar tecidos', 'tecidos'),
('fabrics.delete', 'Excluir tecidos', 'tecidos'),
-- Estampas
('prints.view', 'Visualizar estampas', 'estampas'),
('prints.create', 'Criar estampas', 'estampas'),
('prints.edit', 'Editar estampas', 'estampas'),
('prints.delete', 'Excluir estampas', 'estampas'),
-- Blog
('posts.view', 'Visualizar posts', 'blog'),
('posts.create', 'Criar posts', 'blog'),
('posts.edit', 'Editar posts', 'blog'),
('posts.delete', 'Excluir posts', 'blog'),
-- Contatos
('contacts.view', 'Visualizar contatos', 'contatos'),
('contacts.manage', 'Gerenciar contatos', 'contatos'),
-- Vagas
('jobs.view', 'Visualizar vagas', 'vagas'),
('jobs.create', 'Criar vagas', 'vagas'),
('jobs.edit', 'Editar vagas', 'vagas'),
('jobs.delete', 'Excluir vagas', 'vagas'),
-- Candidaturas
('applications.view', 'Visualizar candidaturas', 'candidaturas'),
('applications.manage', 'Gerenciar candidaturas', 'candidaturas'),
-- Depoimentos
('testimonials.view', 'Visualizar depoimentos', 'depoimentos'),
('testimonials.create', 'Criar depoimentos', 'depoimentos'),
('testimonials.edit', 'Editar depoimentos', 'depoimentos'),
('testimonials.delete', 'Excluir depoimentos', 'depoimentos'),
-- Carrossel
('carousel.view', 'Visualizar carrossel', 'carrossel'),
('carousel.manage', 'Gerenciar carrossel', 'carrossel'),
-- Newsletter
('newsletter.view', 'Visualizar newsletter', 'newsletter'),
('newsletter.manage', 'Gerenciar newsletter', 'newsletter'),
-- Usuários
('users.view', 'Visualizar usuários', 'usuarios'),
('users.create', 'Criar usuários', 'usuarios'),
('users.edit', 'Editar usuários', 'usuarios'),
('users.delete', 'Excluir usuários', 'usuarios'),
-- Configurações
('settings.view', 'Visualizar configurações', 'configuracoes'),
('settings.manage', 'Gerenciar configurações', 'configuracoes');

-- Create function to check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(_user_id uuid, _permission text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON rp.role = ur.role::text
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE ur.user_id = _user_id
      AND p.name = _permission
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'desenvolvedor')
  )
$$;