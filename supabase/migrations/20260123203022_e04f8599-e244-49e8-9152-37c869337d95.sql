-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_company TEXT,
  author_photo_url TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  years_partnership TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Testimonials are viewable by everyone"
ON public.testimonials
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins and editors can manage testimonials"
ON public.testimonials
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_testimonials_updated_at
BEFORE UPDATE ON public.testimonials
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial testimonials data
INSERT INTO public.testimonials (quote, author_name, author_company, rating, years_partnership, display_order) VALUES
('Sou estilista há mais de 10 anos e sempre trabalhei com as malhas da digitale. O que mais me agrada nas malhas são as tecnologias como Aloe Vera, além da qualidade que agregam muito valor as minhas criações.', 'Loreine', 'LB Criação', 5, '10+ anos de parceria', 1),
('O Milano é o melhor tecido para leggings que já usei, sem transparência e com ótima elasticidade. Minhas vendas só crescem!', 'Simone Mecias da Silva', 'Empreendedora Fitness', 5, '5 anos de parceria', 2),
('Estamos a 15 anos no mercado e trabalhamos com a Digitale a quase 10 anos! Digitale é nosso principal fornecedor, pela qualidade de suas estampas e parceria nos prazos.', 'Juliana Hermans', 'Abacaxiclub', 5, '10 anos de parceria', 3),
('Encontrei a Digitale pesquisando e a experiência superou todas as expectativas. Comprei os tecidos e fiquei impressionada com a qualidade e o acabamento.', 'Jussara', 'Designer de Moda', 5, '3 anos de parceria', 4),
('São mais de 10 anos de parceria com uma equipe fantástica. Entregam qualidade, beleza e segurança em cada metro de tecido.', 'Viviane', 'Mar & Sol', 5, '10+ anos de parceria', 5);