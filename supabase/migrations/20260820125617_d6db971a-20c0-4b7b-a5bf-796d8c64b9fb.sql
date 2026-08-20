
-- 1. Deletar TODAS as sugestões existentes para recomeçar do zero
DELETE FROM public.radar_topic_suggestions;

-- 2. Função temporária para gerar 67 sugestões únicas retroativas (20 de Julho até Hoje)
DO $$
DECLARE
    i int;
    start_date timestamp := '2026-07-20 09:00:00';
    end_date timestamp := now();
    total_days int;
    random_ts timestamp;
    
    first_names text[] := ARRAY['Ana','Beatriz','Camila','Daniela','Eduarda','Fernanda','Gabriela','Helena','Isabela','Juliana','Karina','Larissa','Mariana','Natália','Patrícia','Renata','Sabrina','Tatiana','Vanessa','Lúcia','Bruna','Carolina','Letícia','Amanda','Lucas','Marcos','Pedro','Rafael','Bruno','Felipe','Gustavo','Rodrigo','Thiago','André','Diego','Eduardo','Fábio','Vinícius','Leonardo','Matheus','Otávio','Ricardo','Sérgio','Henrique','Caio','Murilo','Igor','Davi'];
    last_names text[] := ARRAY['Silva','Santos','Oliveira','Souza','Pereira','Costa','Rodrigues','Almeida','Nascimento','Lima','Araújo','Fernandes','Carvalho','Gomes','Martins','Ribeiro','Alves','Monteiro','Mendes','Barbosa','Cardoso','Rocha','Dias','Teixeira','Moreira','Cavalcanti','Freitas','Ramos','Pinto','Andrade'];
    email_domains text[] := ARRAY['gmail.com','hotmail.com','outlook.com','yahoo.com.br','uol.com.br'];
    
    bases text[] := ARRAY['Custos de energia na malharia nacional','Alta do dólar e o preço dos fios importados','Reforma tributária para confecções de pequeno porte','Crédito e financiamento de maquinário têxtil','Inflação e o consumo de moda fitness','Marketing de conteúdo B2B para indústria têxtil','WhatsApp Business como canal de venda de tecidos','Branding sensorial e o toque do tecido','Press kits e amostras para a imprensa de moda','Comunicação interna em fábricas de confecção','Geração Z e roupas funcionais','Athleisure no dia a dia do brasileiro','Modelagem inclusiva e body positivity','O novo perfil do comprador atacadista de tecidos','Consumo de moda praia no Nordeste','Cores Pantone aplicadas à moda fitness','Estampas digitais na próxima temporada','Moda praia verão 2026/2027','Quiet luxury em tecidos premium brasileiros','Gorpcore e tecidos técnicos no streetwear','PET reciclado na confecção brasileira','Certificações ambientais na compra B2B','Tingimento com baixo consumo de água','Greenwashing no setor têxtil','Algodão regenerativo como matéria-prima','Inteligência artificial no desenvolvimento de tecidos','Tecidos inteligentes com sensores biométricos','Automação na malharia','Rastreabilidade digital da cadeia têxtil','Softwares de PCP para confecções','Compradores de tecido fitness no Brasil','Mercado de moda íntima: dados e oportunidades','E-commerce B2B de tecidos','Exportação de moda praia brasileira','Concorrência asiática no mercado têxtil nacional','Polos têxteis brasileiros em ascensão'];
    angles text[] := ARRAY['o que muda para quem produz em pequena escala','um guia prático para compradores','com números e projeções para 2026','erros comuns e como evitá-los','estudo de caso de confecções brasileiras','checklist para quem está começando','impacto direto na margem de lucro','comparativo entre fornecedores nacionais e importados','o que os grandes players já estão fazendo','perguntas que todo lojista deveria fazer','tendências para os próximos 5 anos','como isso afeta o prazo de entrega','na visão de quem trabalha no chão de fábrica','oportunidades para marcas independentes'];
    
    msg_open text[] := ARRAY['Trabalho com confecção há alguns anos e esse assunto sempre volta','Acompanho o Radar desde as primeiras edições','Estou montando minha marca agora','Sou compradora de uma rede de lojas','Trabalho na produção e vejo isso de perto todo dia','Sou representante comercial e ouço isso dos clientes','Estudo o setor têxtil na faculdade','Faço parte do time de estilo de uma confecção','Toco uma facção pequena aqui na região','Cuido das compras de matéria-prima da empresa','Tenho uma loja de atacado há doze anos','Comecei recentemente no setor e ainda estou aprendendo','Sou modelista e converso muito com fornecedores','Minha família tem uma malharia desde os anos 90','Atuo com moda praia no litoral','Presto consultoria para pequenas confecções','Trabalho no financeiro de uma indústria têxtil','Sou designer de estampas freelancer','Gerencio o e-commerce de uma marca fitness','Vendo tecido no varejo e sou muito questionada sobre isso'];
    msg_reason text[] := ARRAY['e sinto falta de material sério em português sobre o tema','e nunca encontro dados atualizados do mercado brasileiro','e vejo muita gente decidindo no achismo por falta de informação','e isso pesa demais no custo final da peça','e a maioria dos conteúdos para na superfície','e muda totalmente a negociação com fornecedor','e a diferença aparece direto na margem no fim do mês','e influencia até o prazo de entrega que consigo prometer','e é o tipo de coisa que ninguém explica direito','e afeta bastante quem trabalha com pronta-entrega','e percebo que cada fornecedor dá uma explicação diferente','e acabo aprendendo na tentativa e erro, o que sai caro','e sinto que o mercado brasileiro está atrasado nesse ponto','e reflete direto na escolha da malha para cada coleção','e volta e meia perco venda por não saber responder','e as informações que acho são todas de fora do Brasil','e minha equipe vive travando decisão por causa disso','e isso define se compro nacional ou importado','e nunca sei se o preço que me passam está justo','e impacta muito no planejamento da próxima temporada'];
    msg_close text[] := ARRAY['Se der para trazer exemplos reais de empresas, ajuda muito.','Uma entrevista com alguém da área cairia super bem.','Adoraria ver com gráficos e números comparativos.','Um passo a passo prático seria perfeito.','Acho que renderia até uma série de edições.','Pode ser algo curto, mas com informação concreta.','Se citarem fontes e estudos, melhor ainda.','Uma comparação antes e depois ilustraria bem.','Um infográfico resumindo já resolveria muita dúvida.','Fico no aguardo, seria leitura obrigatória por aqui.','Se puderem incluir uma planilha de referência, seria ótimo.','Gostaria de ver a opinião de quem já passou por isso na prática.','Vale muito abrir espaço para perguntas dos leitores no fim.','Se tiver um resumo em tópicos no início, facilita bastante.','Uma linha do tempo mostrando a evolução seria interessante.','Compartilharia na hora com o resto da equipe.','Se der para separar por porte de empresa, ajuda a aplicar.','Um comparativo de custos deixaria tudo mais claro.','Seria ótimo ter indicação de onde buscar esses dados depois.','Qualquer recorte regional já seria muito útil para nós.'];

    v_topic text;
    v_message text;
    v_fname text;
    v_lname text;
    v_email text;
    v_attempts int;
    v_exists boolean;
BEGIN
    total_days := (date_part('day', end_date - start_date))::int;
    
    FOR i IN 1..67 LOOP
        v_attempts := 0;
        LOOP
            v_attempts := v_attempts + 1;
            v_topic := bases[1 + floor(random() * array_length(bases, 1))::int] || ': ' || 
                       angles[1 + floor(random() * array_length(angles, 1))::int];
            v_message := msg_open[1 + floor(random() * array_length(msg_open, 1))::int] || ' ' || 
                         msg_reason[1 + floor(random() * array_length(msg_reason, 1))::int] || '. ' || 
                         msg_close[1 + floor(random() * array_length(msg_close, 1))::int];
            
            SELECT EXISTS (
                SELECT 1 FROM public.radar_topic_suggestions 
                WHERE lower(message) = lower(v_message) OR lower(topic) = lower(v_topic)
            ) INTO v_exists;
            
            EXIT WHEN NOT v_exists OR v_attempts >= 100;
        END LOOP;
        
        v_fname := first_names[1 + floor(random() * array_length(first_names, 1))::int];
        v_lname := last_names[1 + floor(random() * array_length(last_names, 1))::int];
        v_email := lower(replace(v_fname, ' ', '')) || '.' || lower(replace(v_lname, ' ', '')) || (100 + i)::text || '@' || email_domains[1 + floor(random() * array_length(email_domains, 1))::int];
        
        -- Distribuir as datas uniformemente entre 20/07 e hoje
        random_ts := start_date + (random() * (end_date - start_date));
        
        INSERT INTO public.radar_topic_suggestions (topic, name, email, message, page_url, status, created_at)
        VALUES (v_topic, v_fname || ' ' || v_lname, v_email, v_message, 'seed://new-history', 'new', random_ts);
    END LOOP;
END $$;
