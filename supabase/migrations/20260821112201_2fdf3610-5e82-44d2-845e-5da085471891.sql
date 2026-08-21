
-- Function to increment/decrement a single count field
CREATE OR REPLACE FUNCTION public.increment_radar_count(
  row_id UUID,
  field_name TEXT,
  amount INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('UPDATE public.radar_editions SET %I = GREATEST(0, %I + ($1)) WHERE id = $2', field_name, field_name)
  USING amount, row_id;
END;
$$;

-- Function to handle switching reactions (increment one, decrement other)
CREATE OR REPLACE FUNCTION public.increment_radar_counts(
  row_id UUID,
  incr_field TEXT,
  decr_field TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('UPDATE public.radar_editions SET %I = GREATEST(0, %I + 1), %I = GREATEST(0, %I - 1) WHERE id = $1', incr_field, incr_field, decr_field, decr_field)
  USING row_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_radar_count TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_radar_counts TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_radar_count TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_radar_counts TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_radar_count TO anon;
GRANT EXECUTE ON FUNCTION public.increment_radar_counts TO anon;
