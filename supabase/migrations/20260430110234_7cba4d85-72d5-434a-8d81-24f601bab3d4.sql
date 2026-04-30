-- Adiciona coluna opcional para CNAE (valida origem do lead)
ALTER TABLE public.fabric_leads
  ADD COLUMN IF NOT EXISTS cnae text;

-- Função: gera CNPJ falso válido associado a um CNAE têxtil/confecção
CREATE OR REPLACE FUNCTION public.gen_textile_cnae()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  cnaes text[] := ARRAY[
    '1311-1/00', -- Preparação e fiação de fibras de algodão
    '1321-9/00', -- Tecelagem de fios de algodão
    '1330-8/00', -- Fabricação de tecidos de malha
    '1340-5/01', -- Estamparia e texturização em fios, tecidos
    '1411-8/01', -- Confecção de roupas íntimas
    '1412-6/01', -- Confecção de peças do vestuário
    '1412-6/02', -- Confecção, sob medida, de peças do vestuário
    '1413-4/01', -- Confecção de roupas profissionais
    '1422-3/00'  -- Fabricação de artigos do vestuário em malharias
  ];
BEGIN
  RETURN cnaes[1 + (random() * (array_length(cnaes,1) - 1))::int];
END;
$$;

-- Substitui a função de geração de leads para usar SEMPRE o "agora"
CREATE OR REPLACE FUNCTION public.generate_fake_fabric_leads()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  idx int;
  fab record;
  ddd text;
  whatsapp text;
  brt_now timestamptz := now();
  brt_local timestamp := (now() AT TIME ZONE 'America/Sao_Paulo');
  hour_local int;
  dow int;
  last_created timestamptz;
  candidate_ts timestamptz;
  jitter_seconds int;
BEGIN
  hour_local := EXTRACT(HOUR FROM brt_local)::int;
  dow := EXTRACT(DOW FROM brt_local)::int;

  -- Apenas horário comercial (8h-18h BRT) em dias úteis
  IF hour_local < 8 OR hour_local >= 18 OR dow = 0 OR dow = 6 THEN
    RETURN;
  END IF;

  -- Garante mínimo de 17 min entre leads (verificado contra agora real, não acumulado)
  SELECT MAX(created_at) INTO last_created FROM public.fabric_leads;
  IF last_created IS NOT NULL AND brt_now - last_created < INTERVAL '17 minutes' THEN
    RETURN;
  END IF;

  -- Pequeno deslocamento aleatório (-3 a +3 min) em torno do agora, sem cair no futuro
  jitter_seconds := -180 + (random() * 360)::int;
  candidate_ts := brt_now + (jitter_seconds || ' seconds')::interval;
  IF candidate_ts > brt_now THEN
    candidate_ts := brt_now;
  END IF;

  -- Garante que não fica a menos de 17 min do anterior após jitter
  IF last_created IS NOT NULL AND candidate_ts - last_created < INTERVAL '17 minutes' THEN
    candidate_ts := last_created + INTERVAL '17 minutes' + (random() * 180 || ' seconds')::interval;
    IF candidate_ts > brt_now THEN
      candidate_ts := brt_now;
    END IF;
  END IF;

  idx := 1 + (random() * (array_length(companies, 1) - 1))::int;

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
$$;

-- Insere 7 leads para ontem e 3 para hoje, espaçados em horário comercial
DO $$
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
    ['Indústria de Roupas Bella', 'vendas@bellaroupas.com.br', '47']
  ];
  yesterday date := (now() AT TIME ZONE 'America/Sao_Paulo')::date - 1;
  today_d date := (now() AT TIME ZONE 'America/Sao_Paulo')::date;
  now_local timestamp := (now() AT TIME ZONE 'America/Sao_Paulo');
  hour_now int := EXTRACT(HOUR FROM (now() AT TIME ZONE 'America/Sao_Paulo'))::int;
  ts timestamptz;
  fab record;
  idx int;
  ddd text;
  i int;
  -- Horários para ontem (7 leads, espaçados)
  yesterday_times time[] := ARRAY[
    '09:12'::time, '10:43'::time, '11:28'::time, '13:51'::time,
    '14:37'::time, '15:54'::time, '17:08'::time
  ];
  -- Horários para hoje (3 leads em horário comercial, mas não no futuro)
  today_times time[] := ARRAY['09:24'::time, '10:47'::time, '11:36'::time];
BEGIN
  -- ONTEM
  FOR i IN 1..array_length(yesterday_times,1) LOOP
    SELECT id, name, slug INTO fab FROM public.fabrics WHERE is_active = true ORDER BY random() LIMIT 1;
    IF fab.id IS NULL THEN RETURN; END IF;
    idx := 1 + (random() * (array_length(companies,1) - 1))::int;
    ddd := companies[idx][3];
    ts := ((yesterday::text || ' ' || yesterday_times[i]::text)::timestamp AT TIME ZONE 'America/Sao_Paulo');

    INSERT INTO public.fabric_leads (fabric_id, fabric_name, fabric_slug, cnpj, whatsapp, email, status, created_at, cnae)
    VALUES (
      fab.id, fab.name, fab.slug,
      public.gen_fake_cnpj(),
      ddd || '9' || lpad((10000000 + (random()*89999999)::bigint)::text, 8, '0'),
      companies[idx][2], 'new', ts, public.gen_textile_cnae()
    );
  END LOOP;

  -- HOJE (apenas horários já passados)
  FOR i IN 1..array_length(today_times,1) LOOP
    -- Só insere se o horário já passou
    IF today_times[i] <= now_local::time THEN
      SELECT id, name, slug INTO fab FROM public.fabrics WHERE is_active = true ORDER BY random() LIMIT 1;
      IF fab.id IS NULL THEN RETURN; END IF;
      idx := 1 + (random() * (array_length(companies,1) - 1))::int;
      ddd := companies[idx][3];
      ts := ((today_d::text || ' ' || today_times[i]::text)::timestamp AT TIME ZONE 'America/Sao_Paulo');

      INSERT INTO public.fabric_leads (fabric_id, fabric_name, fabric_slug, cnpj, whatsapp, email, status, created_at, cnae)
      VALUES (
        fab.id, fab.name, fab.slug,
        public.gen_fake_cnpj(),
        ddd || '9' || lpad((10000000 + (random()*89999999)::bigint)::text, 8, '0'),
        companies[idx][2], 'new', ts, public.gen_textile_cnae()
      );
    END IF;
  END LOOP;
END $$;