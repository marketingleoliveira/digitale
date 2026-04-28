-- Habilita cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Função que calcula DV de CNPJ
CREATE OR REPLACE FUNCTION public.gen_fake_cnpj()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base int[] := ARRAY[]::int[];
  digits int[];
  weights1 int[] := ARRAY[5,4,3,2,9,8,7,6,5,4,3,2];
  weights2 int[] := ARRAY[6,5,4,3,2,9,8,7,6,5,4,3,2];
  s int;
  d1 int;
  d2 int;
  i int;
  result text := '';
BEGIN
  FOR i IN 1..8 LOOP
    base := array_append(base, (random()*9)::int);
  END LOOP;
  digits := base || ARRAY[0,0,0,1];

  s := 0;
  FOR i IN 1..12 LOOP
    s := s + digits[i] * weights1[i];
  END LOOP;
  d1 := CASE WHEN s % 11 < 2 THEN 0 ELSE 11 - (s % 11) END;
  digits := digits || ARRAY[d1];

  s := 0;
  FOR i IN 1..13 LOOP
    s := s + digits[i] * weights2[i];
  END LOOP;
  d2 := CASE WHEN s % 11 < 2 THEN 0 ELSE 11 - (s % 11) END;
  digits := digits || ARRAY[d2];

  FOR i IN 1..14 LOOP
    result := result || digits[i]::text;
  END LOOP;
  RETURN result;
END;
$$;

-- Função principal que gera leads fictícios
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
  num_leads int;
  i int;
  idx int;
  fab record;
  ddd text;
  whatsapp text;
BEGIN
  -- Gera entre 2 e 3 leads por execução (média ~2.5 × 6 slots/dia = 15)
  num_leads := 2 + (random() * 1.5)::int;

  FOR i IN 1..num_leads LOOP
    -- Sorteia empresa
    idx := 1 + (random() * (array_length(companies, 1) - 1))::int;

    -- Sorteia tecido ativo
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
      cnpj, whatsapp, email, status
    ) VALUES (
      fab.id, fab.name, fab.slug,
      public.gen_fake_cnpj(),
      whatsapp,
      companies[idx][2],
      'new'
    );
  END LOOP;
END;
$$;

-- Remove agendamento anterior se existir
DO $$
BEGIN
  PERFORM cron.unschedule('generate-fake-fabric-leads');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Agenda: a cada 2 horas das 11h às 21h UTC (8h-18h horário Brasília)
SELECT cron.schedule(
  'generate-fake-fabric-leads',
  '0 11,13,15,17,19,21 * * *',
  $$ SELECT public.generate_fake_fabric_leads(); $$
);