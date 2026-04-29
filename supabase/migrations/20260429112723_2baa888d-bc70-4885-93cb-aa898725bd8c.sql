
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
  num_leads int;
  i int;
  idx int;
  fab record;
  ddd text;
  whatsapp text;
  brt_now timestamptz := now();
  brt_local timestamp := (now() AT TIME ZONE 'America/Sao_Paulo');
  hour_local int;
  dow int;
BEGIN
  hour_local := EXTRACT(HOUR FROM brt_local)::int;
  dow := EXTRACT(DOW FROM brt_local)::int; -- 0=domingo, 6=sábado

  -- Não gera leads fora do horário comercial (8h-18h BRT) nem em fins de semana
  IF hour_local < 8 OR hour_local >= 18 OR dow = 0 OR dow = 6 THEN
    RETURN;
  END IF;

  num_leads := 2 + (random() * 1.5)::int;

  FOR i IN 1..num_leads LOOP
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

    -- created_at sempre = agora (passado/presente, nunca futuro)
    INSERT INTO public.fabric_leads (
      fabric_id, fabric_name, fabric_slug,
      cnpj, whatsapp, email, status, created_at
    ) VALUES (
      fab.id, fab.name, fab.slug,
      public.gen_fake_cnpj(),
      whatsapp,
      companies[idx][2],
      'new',
      brt_now
    );
  END LOOP;
END;
$function$;

-- Remove quaisquer leads com data futura (segurança)
DELETE FROM public.fabric_leads WHERE created_at > now();
