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
    'Trabalho com confecção há alguns anos e esse assunto sempre volta',
    'Acompanho o Radar desde as primeiras edições',
    'Estou montando minha marca agora',
    'Sou compradora de uma rede de lojas',
    'Trabalho na produção e vejo isso de perto todo dia',
    'Sou representante comercial e ouço isso dos clientes',
    'Estudo o setor têxtil na faculdade',
    'Faço parte do time de estilo de uma confecção',
    'Toco uma facção pequena aqui na região',
    'Cuido das compras de matéria-prima da empresa',
    'Tenho uma loja de atacado há doze anos',
    'Comecei recentemente no setor e ainda estou aprendendo',
    'Sou modelista e converso muito com fornecedores',
    'Minha família tem uma malharia desde os anos 90',
    'Atuo com moda praia no litoral',
    'Presto consultoria para pequenas confecções',
    'Trabalho no financeiro de uma indústria têxtil',
    'Sou designer de estampas freelancer',
    'Gerencio o e-commerce de uma marca fitness',
    'Vendo tecido no varejo e sou muito questionada sobre isso'
  ];
  msg_reason text[] := ARRAY[
    'e sinto falta de material sério em português sobre o tema',
    'e nunca encontro dados atualizados do mercado brasileiro',
    'e vejo muita gente decidindo no achismo por falta de informação',
    'e isso pesa demais no custo final da peça',
    'e a maioria dos conteúdos para na superfície',
    'e muda totalmente a negociação com fornecedor',
    'e a diferença aparece direto na margem no fim do mês',
    'e influencia até o prazo de entrega que consigo prometer',
    'e é o tipo de coisa que ninguém explica direito',
    'e afeta bastante quem trabalha com pronta-entrega',
    'e percebo que cada fornecedor dá uma explicação diferente',
    'e acabo aprendendo na tentativa e erro, o que sai caro',
    'e sinto que o mercado brasileiro está atrasado nesse ponto',
    'e reflete direto na escolha da malha para cada coleção',
    'e volta e meia perco venda por não saber responder',
    'e as informações que acho são todas de fora do Brasil',
    'e minha equipe vive travando decisão por causa disso',
    'e isso define se compro nacional ou importado',
    'e nunca sei se o preço que me passam está justo',
    'e impacta muito no planejamento da próxima temporada'
  ];
  msg_close text[] := ARRAY[
    'Se der para trazer exemplos reais de empresas, ajuda muito.',
    'Uma entrevista com alguém da área cairia super bem.',
    'Adoraria ver com gráficos e números comparativos.',
    'Um passo a passo prático seria perfeito.',
    'Acho que renderia até uma série de edições.',
    'Pode ser algo curto, mas com informação concreta.',
    'Se citarem fontes e estudos, melhor ainda.',
    'Uma comparação antes e depois ilustraria bem.',
    'Um infográfico resumindo já resolveria muita dúvida.',
    'Fico no aguardo, seria leitura obrigatória por aqui.',
    'Se puderem incluir uma planilha de referência, seria ótimo.',
    'Gostaria de ver a opinião de quem já passou por isso na prática.',
    'Vale muito abrir espaço para perguntas dos leitores no fim.',
    'Se tiver um resumo em tópicos no início, facilita bastante.',
    'Uma linha do tempo mostrando a evolução seria interessante.',
    'Compartilharia na hora com o resto da equipe.',
    'Se der para separar por porte de empresa, ajuda a aplicar.',
    'Um comparativo de custos deixaria tudo mais claro.',
    'Seria ótimo ter indicação de onde buscar esses dados depois.',
    'Qualquer recorte regional já seria muito útil para nós.'
  ];

  base_txt text;
  angle_txt text;
  topic_text text;
  message_text text;
  open_txt text;
  reason_txt text;
  fname text;
  lname text;
  fname_norm text;
  lname_norm text;
  email_user text;
  email_domain text;
  email_full text;
  attempts int := 0;
  exists_topic boolean;
  exists_msg boolean;
BEGIN
  IF hour_local < 8 OR hour_local > 22 THEN
    RETURN;
  END IF;

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

  LOOP
    attempts := attempts + 1;
    base_txt := bases[1 + floor(random() * array_length(bases,1))::int];
    angle_txt := angles[1 + floor(random() * array_length(angles,1))::int];
    topic_text := base_txt || ': ' || angle_txt;

    SELECT EXISTS (
      SELECT 1 FROM public.radar_topic_suggestions WHERE lower(topic) = lower(topic_text)
    ) INTO exists_topic;

    EXIT WHEN NOT exists_topic OR attempts >= 60;
  END LOOP;

  IF exists_topic THEN
    RETURN;
  END IF;

  attempts := 0;
  LOOP
    attempts := attempts + 1;
    fname := first_names[1 + floor(random() * array_length(first_names,1))::int];
    lname := last_names[1 + floor(random() * array_length(last_names,1))::int];

    fname_norm := lower(translate(fname,
      'áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ',
      'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC'));
    lname_norm := lower(translate(lname,
      'áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ',
      'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC'));

    email_user := CASE floor(random() * 6)::int
      WHEN 0 THEN fname_norm || '.' || lname_norm
      WHEN 1 THEN fname_norm || lname_norm || (10 + floor(random() * 89)::int)::text
      WHEN 2 THEN substr(fname_norm, 1, 1) || lname_norm
      WHEN 3 THEN fname_norm || '_' || lname_norm
      WHEN 4 THEN fname_norm || lname_norm
      ELSE fname_norm || '.' || lname_norm || (1980 + floor(random() * 25)::int)::text
    END;
    email_domain := email_domains[1 + floor(random() * array_length(email_domains,1))::int];
    email_full := email_user || '@' || email_domain;

    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.radar_topic_suggestions WHERE lower(email) = lower(email_full)
    ) OR attempts >= 40;
  END LOOP;

  -- Descrição inédita: 8.000 combinações possíveis, validadas no banco
  attempts := 0;
  message_text := NULL;
  LOOP
    attempts := attempts + 1;
    open_txt := msg_open[1 + floor(random() * array_length(msg_open,1))::int];
    reason_txt := msg_reason[1 + floor(random() * array_length(msg_reason,1))::int];
    message_text := open_txt || ' ' || reason_txt || '. ' ||
      msg_close[1 + floor(random() * array_length(msg_close,1))::int];

    SELECT EXISTS (
      SELECT 1 FROM public.radar_topic_suggestions
      WHERE message = message_text
         OR message LIKE (open_txt || ' ' || reason_txt || '%')
    ) INTO exists_msg;

    EXIT WHEN NOT exists_msg OR attempts >= 60;
  END LOOP;

  IF exists_msg THEN
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