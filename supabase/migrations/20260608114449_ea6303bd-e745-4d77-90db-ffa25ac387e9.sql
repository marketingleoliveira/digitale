CREATE OR REPLACE FUNCTION public.generate_fake_fabric_leads()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  companies text[][] := ARRAY[
    ['Confecções Vitória Régia', 'vendas@vitoriaregia.com.br', '11'],
    ['Malharia Bela Vista', 'compras@belavistamalhas.com.br', '11'],
    ['Indústria Têxtil Aurora', 'contato@auroratextil.com.br', '47'],
    ['Confecções Solaris', 'diretoria@solarisconfeccoes.com.br', '11'],
    ['Athletic Wear Brasil', 'compras@athleticwearbr.com.br', '11'],
    ['Moda Íntima Florença', 'vendas@florencaintima.com.br', '47'],
    ['Confecções Dom Pedro', 'comercial@dompedroconfec.com.br', '31'],
    ['Sportwear Premium', 'compras@sportwearpremium.com.br', '41'],
    ['Malharia São Lucas', 'diretor@saolucasmalha.com.br', '11'],
    ['Indústria de Roupas Bella', 'vendas@bellaroupas.com.br', '47'],
    ['Confecções Miragem', 'comercial@miragemconfec.com.br', '11'],
    ['Tecnomoda Indústria', 'compras@tecnomoda.com.br', '31'],
    ['Confecções Santa Clara', 'contato@santaclaraconf.com.br', '11'],
    ['Active Brasil Têxtil', 'vendas@activebrasil.com.br', '11'],
    ['Malharia Cinco Estrelas', 'compras@5estrelasmalhas.com.br', '21'],
    ['Confecções Atlântico Sul', 'diretoria@atlanticosul.com.br', '48'],
    ['Indústria Fashion Milena', 'vendas@milenaindustria.com.br', '11'],
    ['Confecções Jardim das Flores', 'comercial@jardimflores.com.br', '11'],
    ['Sport Line Confecções', 'compras@sportlinebr.com.br', '47'],
    ['Malharia Capivari', 'vendas@capivarimalhas.com.br', '19'],
    ['Confecções Estrela Guia', 'contato@estrelaguia.com.br', '11'],
    ['Têxtil Itamaraty', 'compras@itamaratytextil.com.br', '31'],
    ['Indústria Brasileira de Moda', 'diretoria@ibmoda.com.br', '11'],
    ['Confecções Pôr do Sol', 'vendas@pordsolconfec.com.br', '62'],
    ['Malharia União Operária', 'compras@uniaomalha.com.br', '11'],
    ['Active Pro Confecções', 'comercial@activeproconfec.com.br', '47'],
    ['Confecções Real Brasil', 'vendas@realbrasilconfec.com.br', '11'],
    ['Indústria Têxtil Diamantina', 'compras@diamantinatex.com.br', '31'],
    ['Confecções Monte Verde', 'diretoria@monteverdeconf.com.br', '11'],
    ['Malharia Santa Helena', 'vendas@stahelenamalhas.com.br', '47'],
    ['Sportech Indústria', 'compras@sportechind.com.br', '41'],
    ['Confecções Riviera', 'comercial@rivieraconfec.com.br', '11'],
    ['Indústria de Moda Praiana', 'vendas@praianamoda.com.br', '85'],
    ['Confecções Flor de Liz', 'compras@flordelizconf.com.br', '11'],
    ['Malharia Premium Plus', 'diretoria@premiumplusmalha.com.br', '11'],
    ['Confecções Boa Esperança', 'vendas@boaesperancaconf.com.br', '31'],
    ['Tecidos & Cia Brasil', 'comercial@tecidosciabr.com.br', '11'],
    ['Confecções Nova Era', 'vendas@novaeraconf.com.br', '11'],
    ['Indústria Veste Bem', 'compras@vestebem.com.br', '47'],
    ['Malharia Horizonte', 'diretoria@horizontemalha.com.br', '31']
  ];
  brt_now timestamptz := now();
  brt_local timestamp := (now() AT TIME ZONE 'America/Sao_Paulo');
  today_date date := brt_local::date;
  hour_local int := EXTRACT(HOUR FROM brt_local)::int;
  dow int := EXTRACT(DOW FROM brt_local)::int;
  today_count int;
  target_today int;
  remaining int;
  remaining_hours int;
  prob numeric;
  idx int;
  attempts int := 0;
  fab record;
  ddd text;
  whatsapp text;
  jitter_seconds int;
  candidate_ts timestamptz;
  chosen_company text[];
  recent_email text;
BEGIN
  -- Apenas horário comercial (8h-18h BRT) em dias úteis
  IF hour_local < 8 OR hour_local >= 18 OR dow = 0 OR dow = 6 THEN
    RETURN;
  END IF;

  -- Quota diária determinística entre 1 e 5
  target_today := 1 + (abs(hashtext('fabric_leads_' || today_date::text)) % 5);

  -- Conta leads de hoje (todos, para não exceder e parecer realista)
  SELECT COUNT(*) INTO today_count
  FROM public.fabric_leads
  WHERE (created_at AT TIME ZONE 'America/Sao_Paulo')::date = today_date;

  remaining := target_today - today_count;
  IF remaining <= 0 THEN
    RETURN;
  END IF;

  -- Distribui pela janela restante de horas úteis (até 18h)
  remaining_hours := GREATEST(1, 18 - hour_local);
  prob := LEAST(1.0, remaining::numeric / remaining_hours::numeric);

  IF random() > prob THEN
    RETURN;
  END IF;

  -- Escolhe empresa que não tenha sido usada nos últimos 4 dias
  LOOP
    attempts := attempts + 1;
    idx := 1 + (random() * (array_length(companies, 1) - 1))::int;
    chosen_company := companies[idx:idx][1:3];

    SELECT email INTO recent_email
    FROM public.fabric_leads
    WHERE email = companies[idx][2]
      AND created_at >= brt_now - INTERVAL '4 days'
    LIMIT 1;

    EXIT WHEN recent_email IS NULL OR attempts >= 20;
    recent_email := NULL;
  END LOOP;

  IF recent_email IS NOT NULL THEN
    RETURN;
  END IF;

  SELECT id, name, slug INTO fab
  FROM public.fabrics
  WHERE is_active = true
  ORDER BY random()
  LIMIT 1;

  IF fab.id IS NULL THEN
    RETURN;
  END IF;

  ddd := companies[idx][3];
  whatsapp := ddd || '9' || lpad((10000000 + (random() * 89999999)::bigint)::text, 8, '0');

  jitter_seconds := -180 + (random() * 360)::int;
  candidate_ts := brt_now + (jitter_seconds || ' seconds')::interval;
  IF candidate_ts > brt_now THEN
    candidate_ts := brt_now;
  END IF;

  INSERT INTO public.fabric_leads (
    fabric_id, fabric_name, fabric_slug,
    cnpj, whatsapp, email, status, created_at, cnae
  ) VALUES (
    fab.id, fab.name, fab.slug,
    public.gen_fake_cnpj(),
    whatsapp,
    companies[idx][2],
    'new',
    candidate_ts,
    public.gen_textile_cnae()
  );
END;
$function$;