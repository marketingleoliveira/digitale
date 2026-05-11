
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE TABLE IF NOT EXISTS public.radar_view_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  edition_id UUID,
  increment INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.radar_view_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view radar view log"
ON public.radar_view_log FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'desenvolvedor'::app_role));

CREATE INDEX IF NOT EXISTS idx_radar_view_log_created_at ON public.radar_view_log (created_at);

CREATE OR REPLACE FUNCTION public.increment_radar_views_auto()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  brt_local timestamp := (now() AT TIME ZONE 'America/Sao_Paulo');
  today_date date := brt_local::date;
  today_total int;
  remaining int;
  amount int;
  target_edition uuid;
BEGIN
  SELECT COALESCE(SUM(increment), 0) INTO today_total
  FROM public.radar_view_log
  WHERE (created_at AT TIME ZONE 'America/Sao_Paulo')::date = today_date;

  remaining := 150 - today_total;
  IF remaining <= 0 THEN
    RETURN;
  END IF;

  amount := 30 + floor(random() * 21)::int;
  IF amount > remaining THEN
    amount := remaining;
  END IF;

  SELECT id INTO target_edition
  FROM public.radar_editions
  WHERE is_published = true
  ORDER BY edition_date DESC, random()
  LIMIT 1
  OFFSET floor(random() * LEAST(5, GREATEST(1,
    (SELECT COUNT(*) FROM public.radar_editions WHERE is_published = true)
  )))::int;

  IF target_edition IS NULL THEN
    SELECT id INTO target_edition
    FROM public.radar_editions
    WHERE is_published = true
    ORDER BY random()
    LIMIT 1;
  END IF;

  IF target_edition IS NULL THEN
    RETURN;
  END IF;

  UPDATE public.radar_editions
  SET views = views + amount
  WHERE id = target_edition;

  INSERT INTO public.radar_view_log (edition_id, increment)
  VALUES (target_edition, amount);
END;
$$;
