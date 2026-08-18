ALTER TABLE public.radar_editions
  ADD COLUMN IF NOT EXISTS happy_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sad_count integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.radar_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id uuid NOT NULL REFERENCES public.radar_editions(id) ON DELETE CASCADE,
  ip_address text NOT NULL,
  reaction text NOT NULL CHECK (reaction IN ('happy','sad')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (edition_id, ip_address)
);

CREATE INDEX IF NOT EXISTS idx_radar_reactions_edition ON public.radar_reactions(edition_id);

GRANT ALL ON public.radar_reactions TO service_role;

ALTER TABLE public.radar_reactions ENABLE ROW LEVEL SECURITY;