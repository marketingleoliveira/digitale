
ALTER TABLE public.agent_settings
  ADD COLUMN IF NOT EXISTS qualification_questions jsonb NOT NULL DEFAULT '[
    "Qual segmento da sua marca/confecção (fitness, moda íntima, praia, esportivo, profissional)?",
    "Você já produz hoje ou está começando agora?",
    "Qual volume aproximado de metros/mês você costuma comprar?"
  ]'::jsonb,
  ADD COLUMN IF NOT EXISTS reply_in_blocks boolean NOT NULL DEFAULT true;
