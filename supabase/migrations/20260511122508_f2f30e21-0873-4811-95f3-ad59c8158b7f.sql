
CREATE OR REPLACE FUNCTION public.generate_fake_topic_suggestions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  brt_local timestamp := (now() AT TIME ZONE 'America/Sao_Paulo');
  today_date date := brt_local::date;
  hour_local int := EXTRACT(HOUR FROM brt_local)::int;
  today_count int;
  target_today int;
  remaining int;
  remaining_hours int;
  prob numeric;
  jitter_seconds int;
  candidate_ts timestamptz;

  first_names text[] := ARRAY[
    'Ana','Beatriz','Camila','Daniela','Eduarda','Fernanda','Gabriela','Helena',
    'Isabela','Juliana','Karina','Larissa','Mariana','Natália','Patrícia','Renata',
    'Sabrina','Tatiana','Vanessa','Lúcia','Bruna','Carolina','Letícia','Amanda',
    'Lucas','Marcos','Pedro','Rafael','Bruno','Felipe','Gustavo','Rodrigo',
    'Thiago','André','Diego','Eduardo','Fábio','Vinícius','Leonardo','Matheus',
    'Otávio','Ricardo','Sérgio','Henrique','Caio','Murilo','Igor','Davi'
  ];
  last_names text[] := ARRAY[
    'Silva','Santos','Oliveira','Souza','Pereira','Costa','Rodrigues','Almeida',
    'Nascimento','Lima','Araújo','Fernandes','Carvalho','Gomes','Martins','Ribeiro',
    'Alves','Monteiro','Mendes','Barbosa','Cardoso','Rocha','Dias','Teixeira',
    'Moreira','Cavalcanti','Freitas','Ramos','Pinto','Andrade'
  ];
  email_domains text[] := ARRAY[
    'gmail.com','gmail.com','gmail.com',
    'hotmail.com','hotmail.com',
    'outlook.com','outlook.com',
    'yahoo.com.br','icloud.com','bol.com.br','uol.com.br'
  ];

  cat_ids uuid[];
  cat_names text[];
  picked_idx int;
  topic_text text;
  message_text text;
  fname text;
  lname text;
  fname_norm text;
  lname_norm text;
  email_user text;
  email_domain text;

  topics_economia text[] := ARRAY[
    'Impacto da alta do dólar nos custos da indústria têxtil',
    'Como a Selic afeta os investimentos em maquinário industrial',
    'Inflação e o reflexo no consumo de moda fitness',
    'Cenário macroeconômico do Brasil para o setor têxtil em 2026',
    'Custos de energia e a competitividade da malharia nacional',
    'Importação de fios: oportunidades e gargalos cambiais',
    'PIB do agronegócio do algodão e o futuro da cadeia têxtil',
    'Reforma tributária e seus efeitos na confecção brasileira'
  ];
  topics_comunicacao text[] := ARRAY[
    'Storytelling de marcas têxteis no Instagram',
    'Como pequenas confecções estão usando WhatsApp Business para vender mais',
    'Branding sensorial: o papel do toque do tecido na percepção da marca',
    'Marketing de conteúdo B2B para indústria têxtil',
    'Influenciadores fitness e o boom dos tecidos tecnológicos',
    'Comunicação interna em fábricas de confecção',
    'Press kits e amostras: como encantar a imprensa de moda'
  ];
  topics_comportamento text[] := ARRAY[
    'Geração Z e a busca por roupas funcionais',
    'O retorno do conforto: athleisure no dia a dia do brasileiro',
    'Body positivity e a demanda por modelagem inclusiva',
    'Hábitos de consumo no pós-pandemia em moda íntima',
    'Comportamento do consumidor de moda praia em 2026',
    'O novo perfil do comprador atacadista de tecidos',
    'Bem-estar e a procura por tecidos antibacterianos'
  ];
  topics_tendencia text[] := ARRAY[
    'Cores Pantone 2026 aplicadas à moda fitness',
    'Estampas digitais: o que vem por aí na próxima temporada',
    'Tendências de moda praia para o verão 2026/2027',
    'Y2K revival nos tecidos brilhantes e holográficos',
    'Quiet luxury e os tecidos premium brasileiros',
    'Tendências de modelagem para roupas íntimas em 2026',
    'Gorpcore e o uso de tecidos técnicos no streetwear'
  ];
  topics_sustentabilidade text[] := ARRAY[
    'Tecidos feitos com PET reciclado: vale a pena para confecções?',
    'Certificações ambientais que pesam na hora da compra B2B',
    'Economia circular na cadeia da moda brasileira',
    'Tingimento sustentável: tecnologias que economizam água',
    'Greenwashing no setor têxtil: como identificar',
    'Algodão regenerativo: o futuro da matéria-prima',
    'ESG aplicado à indústria têxtil de pequeno e médio porte'
  ];
  topics_tecnologia text[] := ARRAY[
    'Inteligência artificial aplicada ao desenvolvimento de tecidos',
    'Tecidos inteligentes com sensores biométricos',
    'Impressão 3D em moldes para confecção sob medida',
    'Automação na malharia: o que esperar nos próximos 5 anos',
    'Realidade aumentada para experimentação de roupas',
    'Blockchain na rastreabilidade da cadeia têxtil',
    'Softwares de PCP que estão transformando confecções brasileiras'
  ];
  topics_mercado text[] := ARRAY[
    'Quem são os maiores compradores de tecido fitness no Brasil',
    'Mercado de moda íntima: dados, players e oportunidades',
    'Crescimento do e-commerce B2B de tecidos no Brasil',
    'Exportação de moda praia brasileira para os EUA',
    'Análise da concorrência chinesa no mercado têxtil nacional',
    'Marketplaces especializados em tecidos: vale a pena estar?',
    'Polos têxteis brasileiros em ascensão em 2026'
  ];
BEGIN
  -- Apenas horário comercial estendido (8h-22h BRT)
  IF hour_local < 8 OR hour_local > 22 THEN
    RETURN;
  END IF;

  -- Quota diária determinística por data (8 a 13)
  target_today := 8 + (abs(hashtext(today_date::text)) % 6);

  -- Conta apenas as sugestões fake já criadas hoje
  SELECT COUNT(*) INTO today_count
  FROM public.radar_topic_suggestions
  WHERE page_url = 'seed://fake-suggestion'
    AND (created_at AT TIME ZONE 'America/Sao_Paulo')::date = today_date;

  remaining := target_today - today_count;
  IF remaining <= 0 THEN
    RETURN;
  END IF;

  remaining_hours := GREATEST(1, 22 - hour_local + 1);
  prob := LEAST(1.0, remaining::numeric / remaining_hours::numeric);

  -- Sorteia se insere agora ou pula esta hora
  IF random() > prob THEN
    RETURN;
  END IF;

  -- Carrega categorias ativas
  SELECT array_agg(id ORDER BY display_order), array_agg(slug ORDER BY display_order)
  INTO cat_ids, cat_names
  FROM public.radar_categories
  WHERE is_active = true;

  IF cat_ids IS NULL OR array_length(cat_ids, 1) = 0 THEN
    RETURN;
  END IF;

  -- Escolhe categoria aleatória
  picked_idx := 1 + (random() * (array_length(cat_ids, 1) - 1))::int;

  -- Escolhe um tópico baseado na categoria
  topic_text := CASE cat_names[picked_idx]
    WHEN 'economia' THEN topics_economia[1 + (random() * (array_length(topics_economia,1) - 1))::int]
    WHEN 'comunicacao' THEN topics_comunicacao[1 + (random() * (array_length(topics_comunicacao,1) - 1))::int]
    WHEN 'comportamento' THEN topics_comportamento[1 + (random() * (array_length(topics_comportamento,1) - 1))::int]
    WHEN 'tendencia' THEN topics_tendencia[1 + (random() * (array_length(topics_tendencia,1) - 1))::int]
    WHEN 'sustentabilidade' THEN topics_sustentabilidade[1 + (random() * (array_length(topics_sustentabilidade,1) - 1))::int]
    WHEN 'tecnologia' THEN topics_tecnologia[1 + (random() * (array_length(topics_tecnologia,1) - 1))::int]
    WHEN 'mercado' THEN topics_mercado[1 + (random() * (array_length(topics_mercado,1) - 1))::int]
    ELSE topics_mercado[1 + (random() * (array_length(topics_mercado,1) - 1))::int]
  END;

  -- Gera nome
  fname := first_names[1 + (random() * (array_length(first_names,1) - 1))::int];
  lname := last_names[1 + (random() * (array_length(last_names,1) - 1))::int];

  -- Normaliza para email (sem acento, minúsculo)
  fname_norm := lower(translate(fname,
    'áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ',
    'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC'));
  lname_norm := lower(translate(lname,
    'áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ',
    'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC'));

  -- Formato variado de email
  email_user := CASE (random() * 5)::int
    WHEN 0 THEN fname_norm || '.' || lname_norm
    WHEN 1 THEN fname_norm || lname_norm || (10 + (random() * 89)::int)::text
    WHEN 2 THEN substr(fname_norm, 1, 1) || lname_norm
    WHEN 3 THEN fname_norm || '_' || lname_norm
    WHEN 4 THEN fname_norm || lname_norm
    ELSE fname_norm || '.' || lname_norm || (1980 + (random() * 25)::int)::text
  END;
  email_domain := email_domains[1 + (random() * (array_length(email_domains,1) - 1))::int];

  -- Mensagem opcional (50% das vezes)
  IF random() < 0.5 THEN
    message_text := CASE (random() * 5)::int
      WHEN 0 THEN 'Adoraria ler uma matéria mais aprofundada sobre isso!'
      WHEN 1 THEN 'Acho que esse tema pode ajudar muito quem está começando no setor.'
      WHEN 2 THEN 'Tenho essa dúvida há tempos, seria ótimo ter um conteúdo só sobre isso.'
      WHEN 3 THEN 'Vocês trazem ótimos conteúdos, esse aqui faria muito sucesso.'
      ELSE 'Sugestão para uma próxima edição, acho super relevante hoje em dia.'
    END;
  ELSE
    message_text := NULL;
  END IF;

  -- Pequeno jitter no created_at (até -45 min para parecer espontâneo)
  jitter_seconds := -(random() * 2700)::int;
  candidate_ts := now() + (jitter_seconds || ' seconds')::interval;

  INSERT INTO public.radar_topic_suggestions (
    topic, name, email, message, page_url, status, created_at
  ) VALUES (
    topic_text,
    fname || ' ' || lname,
    email_user || '@' || email_domain,
    message_text,
    'seed://fake-suggestion',
    'new',
    candidate_ts
  );
END;
$$;
