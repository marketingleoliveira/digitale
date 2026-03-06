
UPDATE segments SET benefits = '[
  {"title":"Aloe Vera","description":"A tecnologia Aloe Vera transforma suas peças em um verdadeiro tratamento de beleza."},
  {"title":"Proteção UV 50+","description":"A tecnologia UV 50+ da Digitale Têxtil atua como um escudo invisível de alta performance."},
  {"title":"Antibacteriana","description":"A tecnologia Antibacteriana da Digitale Têxtil garante frescor e higiene prolongados para sua rotina ativa."},
  {"title":"Super Black","description":"Desenvolvida pela Digitale Têxtil, essa tecnologia traz uma série de benefícios tanto para a indústria têxtil quanto para os consumidores."},
  {"title":"Creora","description":"Fio elastano líder em resistência aos impactos do cloro, protetores solares, bronzeadores e luz UV."},
  {"title":"Super Brilho","description":"A tecnologia Super Brilho da Digitale Têxtil une sofisticação visual e conforto extremo."},
  {"title":"Digitale Eco","description":"Tecidos sustentáveis com tecnologia eco-friendly, produzidos com materiais reciclados e processos de baixo impacto ambiental."},
  {"title":"4 Way Stretch","description":"Elasticidade em 4 direções para máximo conforto e liberdade de movimento em qualquer atividade."},
  {"title":"Super Micro Fibra","description":"Tecnologia de microfibra superior que proporciona toque ultra macio, leveza e alta performance."},
  {"title":"Zero Transparência","description":"Tecnologia que garante total opacidade ao tecido, mesmo em cores claras e durante o uso."}
]'::jsonb WHERE slug = 'praia';

UPDATE segments SET benefits = '[
  {"title":"Aloe Vera","description":"A tecnologia Aloe Vera transforma suas peças em um verdadeiro tratamento de beleza."},
  {"title":"Proteção UV 50+","description":"A tecnologia UV 50+ da Digitale Têxtil atua como um escudo invisível de alta performance."},
  {"title":"Antibacteriana","description":"A tecnologia Antibacteriana da Digitale Têxtil garante frescor e higiene prolongados para sua rotina ativa."},
  {"title":"Super Black","description":"Desenvolvida pela Digitale Têxtil, essa tecnologia traz uma série de benefícios tanto para a indústria têxtil quanto para os consumidores."},
  {"title":"Creora","description":"Fio elastano líder em resistência aos impactos do cloro, protetores solares, bronzeadores e luz UV."},
  {"title":"Super Brilho","description":"A tecnologia Super Brilho da Digitale Têxtil une sofisticação visual e conforto extremo."},
  {"title":"Digitale Eco","description":"Tecidos sustentáveis com tecnologia eco-friendly, produzidos com materiais reciclados e processos de baixo impacto ambiental."},
  {"title":"4 Way Stretch","description":"Elasticidade em 4 direções para máximo conforto e liberdade de movimento em qualquer atividade."},
  {"title":"Super Micro Fibra","description":"Tecnologia de microfibra superior que proporciona toque ultra macio, leveza e alta performance."},
  {"title":"Zero Transparência","description":"Tecnologia que garante total opacidade ao tecido, mesmo em cores claras e durante o uso."}
]'::jsonb WHERE slug = 'esportivo';
