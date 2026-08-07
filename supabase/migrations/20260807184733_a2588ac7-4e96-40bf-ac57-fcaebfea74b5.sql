CREATE TABLE public.fabric_category_assignments (
    fabric_id uuid REFERENCES public.fabrics(id) ON DELETE CASCADE,
    category_id uuid REFERENCES public.fabric_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (fabric_id, category_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.fabric_category_assignments TO authenticated;
GRANT ALL ON public.fabric_category_assignments TO service_role;
GRANT SELECT ON public.fabric_category_assignments TO anon;

ALTER TABLE public.fabric_category_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select" ON public.fabric_category_assignments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access" ON public.fabric_category_assignments FOR ALL TO authenticated USING (true);

-- Migrar dados existentes da coluna category_id para a nova tabela
INSERT INTO public.fabric_category_assignments (fabric_id, category_id)
SELECT id, category_id FROM public.fabrics WHERE category_id IS NOT NULL;
