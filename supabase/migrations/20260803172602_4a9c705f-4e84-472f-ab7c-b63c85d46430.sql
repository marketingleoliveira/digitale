CREATE OR REPLACE FUNCTION public.generate_fake_topic_suggestions()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

  -- Bases temáticas (assunto central)
  bases text[] := ARRAY[
    'Custos de energia na malharia nacional',
    'Alta do dólar e o preço dos fios importados',
    'Reforma tributária para confecções de pequeno porte',
    'Crédito e financiamento de maquinário têxtil',
    'Inflação e o consumo de moda fitness',
    'Marketing de conteúdo B2B para indústria têxtil',
    'WhatsApp Business como canal de venda de tecidos',
    'Branding sensorial e o toque do tecido',
    'Press kits e amostras para a imprensa de moda',
    'Comunicação interna em fábricas de confecção',
    'Geração Z e roupas funcionais',
    'Athleisure no dia a dia do brasileiro',
    'Modelagem inclusiva e body positivity',
    'O novo perfil do comprador atacadista de tecidos',
    'Consumo de moda praia no Nordeste',
    'Cores Pantone aplicadas à moda fitness',
    'Estampas digitais na próxima temporada',
    'Moda praia verão 2026/2027',
    'Quiet luxury em tecidos premium brasileiros',
    'Gorpcore e tecidos técnicos no streetwear',
    'PET reciclado na confecção brasileira',
    'Certificações ambientais na compra B2B',
    'Tingimento com baixo consumo de água',
    'Greenwashing no setor têxtil',
    'Algodão regenerativo como matéria-prima',
    'Inteligência artificial no desenvolvimento de tecidos',
    'Tecidos inteligentes com sensores biométricos',
    'Automação na malharia',
    'Rastreabilidade digital da cadeia têxtil',
    'Softwares de PCP para confecções',
    'Compradores de tecido fitness no Brasil',
    'Mercado de moda íntima: dados e oportunidades',
    'E-commerce B2B de tecidos',
    'Exportação de moda praia brasileira',
    'Concorrência asiática no mercado têxtil nacional',
    'Polos têxteis brasileiros em ascensão'
  ];

  -- Ângulos editoriais (garantem variação de recorte)
  angles text[] := ARRAY[
    'o que muda para quem produz em pequena escala',
    'um guia prático para compradores',
    'com números e projeções para 2026',
    'erros comuns e como evitá-los',
    'estudo de caso de confecções brasileiras',
    'checklist para quem está começando',
    'impacto direto na margem de lucro',
    'comparativo entre fornecedores nacionais e importados',
    'o que os grandes players já estão fazendo',
    'perguntas que todo lojista deveria fazer',
    'tendências para os próximos 5 anos',
    'como isso afeta o prazo de entrega',
    'na visão de quem trabalha no chão de fábrica',
    'oportunidades para marcas independentes'
  ];

  msg_open text[] := ARRAY[
    'Seria ótimo ver esse assunto destrinchado',
    'Tenho acompanhado esse tema de perto',
    'Sinto falta de conteúdo sério sobre isso',
    'Esse ponto aparece direto nas minhas conversas com clientes',
    'Tenho dúvidas recorrentes sobre esse assunto',
    'Acho que faltam dados confiáveis sobre isso no Brasil'
  ];
  msg_reason text[] := ARRAY[
    'porque decide muito na hora de fechar pedido',
    'porque impacta direto no custo final da peça',
    'porque a maioria dos conteúdos fica só na superfície',
    'porque muita gente do setor ainda toma decisão no achismo',
    'porque afeta bastante quem trabalha com pronta-entrega',
    'porque influencia a escolha do fornecedor'
  ];
  msg_close text[] := ARRAY[
    'Se puderem trazer exemplos reais, ajuda muito.',
    'Uma entrevista com especialista cairia bem.',
    'Adoraria ver isso com gráficos e números.',
    'Um passo a passo prático seria perfeito.',
    'Vale até virar uma série de edições.',
    'Conto com vocês nessa pauta!'
  ];

  base_txt text;
  angle_txt text;
  topic_text text;
  message_text text;
  fname text;
  lname text;
  fname_norm text;
  lname_norm text;
  email_user text;
  email_domain text;
  email_full text;
  attempts int := 0;
  exists_topic boolean;
BEGIN
  -- Apenas horário comercial estendido (8h-22h BRT)
  IF hour_local < 8 OR hour_local > 22 THEN
    RETURN;
  END IF;

  -- Quota diária determinística entre 4 e 6, variando de um dia para o outro
  target_today := 4 + (abs(hashtext('radar_sug_' || today_date::text)) % 3);

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

  IF random() > prob THEN
    RETURN;
  END IF;

  -- Monta um tema inédito (base + ângulo), tentando até 40 vezes
  LOOP
    attempts := attempts + 1;
    base_txt := bases[1 + (random() * (array_length(bases,1) - 1))::int];
    angle_txt := angles[1 + (random() * (array_length(angles,1) - 1))::int];
    topic_text := base_txt || ': ' || angle_txt;

    SELECT EXISTS (
      SELECT 1 FROM public.radar_topic_suggestions WHERE lower(topic) = lower(topic_text)
    ) INTO exists_topic;

    EXIT WHEN NOT exists_topic OR attempts >= 40;
  END LOOP;

  IF exists_topic THEN
    RETURN; -- evita duplicar tema
  END IF;

  -- Nome e e-mail inéditos
  attempts := 0;
  LOOP
    attempts := attempts + 1;
    fname := first_names[1 + (random() * (array_length(first_names,1) - 1))::int];
    lname := last_names[1 + (random() * (array_length(last_names,1) - 1))::int];

    fname_norm := lower(translate(fname,
      'áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ',
      'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC'));
    lname_norm := lower(translate(lname,
      'áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ',
      'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC'));

    email_user := CASE (random() * 5)::int
      WHEN 0 THEN fname_norm || '.' || lname_norm
      WHEN 1 THEN fname_norm || lname_norm || (10 + (random() * 89)::int)::text
      WHEN 2 THEN substr(fname_norm, 1, 1) || lname_norm
      WHEN 3 THEN fname_norm || '_' || lname_norm
      WHEN 4 THEN fname_norm || lname_norm
      ELSE fname_norm || '.' || lname_norm || (1980 + (random() * 25)::int)::text
    END;
    email_domain := email_domains[1 + (random() * (array_length(email_domains,1) - 1))::int];
    email_full := email_user || '@' || email_domain;

    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.radar_topic_suggestions WHERE lower(email) = lower(email_full)
    ) OR attempts >= 30;
  END LOOP;

  -- Mensagem única (60% das vezes)
  IF random() < 0.6 THEN
    message_text :=
      msg_open[1 + (random() * (array_length(msg_open,1) - 1))::int] || ', ' ||
      msg_reason[1 + (random() * (array_length(msg_reason,1) - 1))::int] || '. ' ||
      msg_close[1 + (random() * (array_length(msg_close,1) - 1))::int];
  ELSE
    message_text := NULL;
  END IF;

  jitter_seconds := -(random() * 2700)::int;
  candidate_ts := now() + (jitter_seconds || ' seconds')::interval;

  INSERT INTO public.radar_topic_suggestions (
    topic, name, email, message, page_url, status, created_at
  ) VALUES (
    topic_text,
    fname || ' ' || lname,
    email_full,
    message_text,
    'seed://fake-suggestion',
    'new',
    candidate_ts
  );
END;
$function$;