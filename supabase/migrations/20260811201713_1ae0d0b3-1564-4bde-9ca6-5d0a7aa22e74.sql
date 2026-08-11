
-- Adicionando tecnologias faltantes e atualizando as existentes para o novo layout visual
-- Inserir tecnologias faltantes
INSERT INTO public.technologies (name, slug, short_description, description, icon, display_order, is_active, benefits)
VALUES 
(
  'SUPER BLACK', 
  'super-black', 
  'Com máxima solidez e transferência zero, garantimos tons mais profundos e duradouros. Ideal para tecidos escuros sem causar migração de cor ou desbotamento.',
  'Desenvolvido para atender às exigências de cores intensas, o Super Black oferece uma profundidade de cor inigualável.',
  'Shield', 
  7, 
  true, 
  '["Máxima solidez", "Transferência zero", "Tons profundos", "Resistente ao desbotamento"]'::jsonb
),
(
  'CREORA® HIGHCLO', 
  'creora-highclo', 
  'Elastano com super resistência ao cloro, protegendo o tecido do desgaste e do amarelamento causado pela ação química da água e mantendo sua elasticidade.',
  'Tecnologia de elastano desenvolvida para superar a degradação pelo cloro, mantendo a elasticidade e durabilidade por muito mais tempo.',
  'Waves', 
  8, 
  true, 
  '["Resistência ao cloro", "Protege do amarelamento", "Alta durabilidade", "Mantém a elasticidade"]'::jsonb
),
(
  'ALOE VERA', 
  'aloe-vera', 
  'As microcápsulas de Aloe Vera hidratam, regeneram e combatem os radicais livres na pele durante o uso, proporcionando cuidado e frescor em contato com o tecido.',
  'Tratamento com microcápsulas que liberam ativos hidratantes durante o uso da peça, cuidando da pele de forma contínua.',
  'Leaf', 
  9, 
  true, 
  '["Hidratação da pele", "Combate radicais livres", "Frescor no contato", "Regeneração"]'::jsonb
),
(
  'DIGITALE ECO', 
  'digitale-eco', 
  'A linha eco da Digitale têxtil é produzida com corantes de fontes renováveis, proteção UV e acabamento antibacteriano, com certificação ECO CERTIFIED Recycling Standard.',
  'Linha sustentável que utiliza processos e materiais eco-friendly sem abrir mão da performance e tecnologia.',
  'Recycle', 
  10, 
  true, 
  '["Fontes renováveis", "Certificação ECO CERTIFIED", "Processo sustentável", "Alto desempenho"]'::jsonb
)
ON CONFLICT (slug) DO UPDATE 
SET 
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  benefits = EXCLUDED.benefits;

-- Atualizar nomes e descrições das tecnologias existentes para alinhar com a referência
UPDATE public.technologies SET 
  name = 'PROTEÇÃO UV 50+', 
  short_description = 'Proteção permanente contra os raios ultravioletas. Nossa proteção vem do fio, o que assegura que ela seja confiável e permaneça mesmo após as lavagens.',
  display_order = 1
WHERE slug = 'protecao-uv-50';

UPDATE public.technologies SET 
  name = 'ANTIBACTERIANO MICRO-STOP', 
  short_description = 'Uma tecnologia que inibe o crescimento de bactérias e odores desagradáveis, controlando fungos e bactérias. Isso proporciona uma sensação de frescor e conforto no seu dia a dia.',
  display_order = 2
WHERE slug = 'antibacteriano';

UPDATE public.technologies SET 
  name = 'ESTAMPARIA DIGITAL HD', 
  short_description = 'Tecnologia de estamparia digital de alta definição que proporciona cores vibrantes, detalhes precisos e excelente resolução. Garante fidelidade nas estampas, toque macio e alta fixação.',
  display_order = 11
WHERE slug = 'estamparia-digital';
