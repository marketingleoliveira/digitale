-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Função que enfileira validações para leads ainda não validados
CREATE OR REPLACE FUNCTION public.auto_validate_pending_leads()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  lead_rec record;
  fn_url text := 'https://tktdlaclbavbycwcsazx.supabase.co/functions/v1/validate-lead';
  anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrdGRsYWNsYmF2Ynljd2NzYXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4OTYxMjYsImV4cCI6MjA4MzQ3MjEyNn0.M0YvHs9RSiXPaScsz_dOA1vkgrctrpgoaD9k9Y5TjVQ';
  processed int := 0;
BEGIN
  -- Pega até 5 leads sem validação (ou com erro) por execução, do mais recente ao mais antigo
  FOR lead_rec IN
    SELECT fl.id
    FROM public.fabric_leads fl
    LEFT JOIN public.lead_validations lv ON lv.fabric_lead_id = fl.id
    WHERE lv.id IS NULL OR lv.status IN ('pending', 'error')
    ORDER BY fl.created_at DESC
    LIMIT 5
  LOOP
    PERFORM net.http_post(
      url := fn_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'apikey', anon_key,
        'Authorization', 'Bearer ' || anon_key
      ),
      body := jsonb_build_object('lead_id', lead_rec.id)
    );
    processed := processed + 1;
  END LOOP;
END;
$$;

-- Trigger: dispara validação imediata ao inserir novo lead
CREATE OR REPLACE FUNCTION public.trigger_validate_new_lead()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  fn_url text := 'https://tktdlaclbavbycwcsazx.supabase.co/functions/v1/validate-lead';
  anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrdGRsYWNsYmF2Ynljd2NzYXp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4OTYxMjYsImV4cCI6MjA4MzQ3MjEyNn0.M0YvHs9RSiXPaScsz_dOA1vkgrctrpgoaD9k9Y5TjVQ';
BEGIN
  PERFORM net.http_post(
    url := fn_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', anon_key,
      'Authorization', 'Bearer ' || anon_key
    ),
    body := jsonb_build_object('lead_id', NEW.id)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS auto_validate_on_lead_insert ON public.fabric_leads;
CREATE TRIGGER auto_validate_on_lead_insert
  AFTER INSERT ON public.fabric_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_validate_new_lead();

-- Remove cron antigo se existir e cria novo (a cada 2 minutos)
SELECT cron.unschedule('auto-validate-leads')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'auto-validate-leads');

SELECT cron.schedule(
  'auto-validate-leads',
  '*/2 * * * *',
  $$ SELECT public.auto_validate_pending_leads(); $$
);