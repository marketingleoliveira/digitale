import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "pt" | "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Navigation
    "nav.home": "HOME",
    "nav.about": "SOBRE NÓS",
    "nav.fabrics": "TECIDOS",
    "nav.prints": "ESTAMPAS",
    "nav.sustainability": "SUSTENTABILIDADE",
    "nav.blog": "BLOG",
    "nav.contact": "FALE CONOSCO",
    
    // Products Section
    "products.label": "Nossos Tecidos",
    "products.title": "Últimos Lançamentos",
    "products.viewMore": "Ver Detalhes",
    "products.viewAll": "Ver Todos os Tecidos",
    "products.milano.desc": "Tecido de alta compressão, ideal para leggings e shorts fitness com excelente suporte muscular.",
    "products.lyon.desc": "Malha com toque suave e caimento perfeito, versátil para diversas aplicações esportivas.",
    "products.aerodry.desc": "Tecnologia dry fit avançada com secagem ultra-rápida e alta respirabilidade.",
    "products.veneza.desc": "Acabamento acetinado premium com brilho sofisticado para peças elegantes.",
    "products.lyon.tagline": "Aumente suas vendas",
    "products.lyon.subtitle": "Zero transparência",
    "products.aerodry.tagline": "Mais vendas, mais valor",
    "products.aerodry.subtitle": "Mais performance",
    "products.veneza.tagline": "Elegância e conforto",
    "products.veneza.subtitle": "Em cada detalhe",
    "products.milano.tagline": "O melhor tecido",
    "products.milano.subtitle": "Para leggings premium",
    
    // Testimonials
    "testimonials.label": "Depoimentos",
    "testimonials.title": "O Que Nossos Clientes Dizem",
    
    // Stats
    "stats.years": "Anos de Experiência",
    "stats.clients": "Clientes Atendidos",
    "stats.fabrics": "Tipos de Tecidos",
    "stats.production": "Toneladas/Mês",
    
    // Sustainability
    "sustainability.label": "Digitale ECO",
    "sustainability.title": "A Linha ECO da Digitale",
    "sustainability.description": "Transformamos resíduos pós-consumo em recursos valiosos. A reciclagem de 1 garrafa de plástico economiza o equivalente a 3 horas de energia de uma lâmpada de 60 watts.",
    "sustainability.bottles": "60 Garrafas",
    "sustainability.bottles.desc": "1 kg de PET (100% resíduos pós-consumo) mantém 60 garrafas fora do aterro",
    "sustainability.co2": "65% Menos CO₂",
    "sustainability.co2.desc": "Redução significativa nas emissões de carbono",
    "sustainability.water": "90% Menos Água",
    "sustainability.water.desc": "Economia expressiva no consumo de água",
    "sustainability.energy": "64% Menos Energia",
    "sustainability.energy.desc": "Redução no consumo energético total",
    "sustainability.cta": "Saiba Mais",
    "sustainability.sustainable": "Sustentável",
    
    // Clients
    "clients.label": "Parceiros",
    "clients.title": "Empresas Que Confiam na Digitale",
    
    // Blog
    "blog.label": "Blog",
    "blog.title": "Últimas Novidades",
    "blog.description": "Acompanhe as tendências do mercado têxtil e as novidades da Digitale.",
    "blog.readMore": "Ler Mais",
    "blog.viewAll": "Ver Todos os Artigos",
    "blog.hero.title": "Novidades e Tendências",
    "blog.hero.subtitle": "Acompanhe as últimas novidades do mercado têxtil, dicas e inovações em tecidos de alta tecnologia.",
    "blog.search": "Buscar posts...",
    "blog.all": "Todos",
    "blog.noResults": "Nenhum post encontrado.",
    "blog.clearSearch": "Limpar busca",
    
    // CTA
    "cta.title": "Pronto para Revolucionar Seus Produtos?",
    "cta.description": "Entre em contato com nossa equipe e descubra como nossos tecidos podem elevar a qualidade dos seus produtos.",
    "cta.button": "Solicitar Orçamento",
    
    // Footer
    "footer.description": "Há mais de 25 anos desenvolvendo tecidos inovadores e sustentáveis para o mercado esportivo brasileiro.",
    "footer.navigation": "Navegação",
    "footer.contact": "Contato",
    "footer.followUs": "Siga-nos",
    "footer.rights": "Todos os direitos reservados.",
    "footer.admin": "Painel Administrativo",
    "footer.privacy": "Política de Privacidade",
    
    // About Page
    "about.label": "Sobre Nós",
    "about.title": "Mais de 60 Anos de Excelência Têxtil",
    "about.description": "Somos uma empresa do Grupo VMF/Schick Bin, com mais de seis décadas de experiência no segmento têxtil, sempre à frente das inovações do mercado.",
    "about.history.title": "Nossa História",
    "about.history.p1": "A Digitale Têxtil nasceu da paixão por transformar tecidos em experiências. Ao longo de mais de 60 anos, nos tornamos referência em tecidos de alta tecnologia, sempre investindo em inovação e sustentabilidade.",
    "about.history.p2": "Hoje, atendemos mais de 1.000 clientes em 15 países, oferecendo tecidos com tecnologias exclusivas como Aloe Vera, proteção UV 50+, antibacteriano e muito mais.",
    "about.value.quality": "Qualidade",
    "about.value.quality.desc": "Entregamos tecidos com os mais altos padrões de qualidade do mercado.",
    "about.value.innovation": "Inovação",
    "about.value.innovation.desc": "Investimos constantemente em novas tecnologias e processos.",
    "about.value.sustainability": "Sustentabilidade",
    "about.value.sustainability.desc": "Compromisso com práticas ambientalmente responsáveis.",
    "about.value.partnership": "Parceria",
    "about.value.partnership.desc": "Construímos relacionamentos duradouros com nossos clientes.",
    "about.image.alt": "Atleta usando tecidos Digitale",
    "about.years": "Anos de mercado",
    
    // Contact Page
    "contact.label": "Contato",
    "contact.title": "Fale Conosco",
    "contact.description": "Estamos prontos para atender você e ajudar a encontrar os melhores tecidos para o seu negócio.",
    "contact.info.email": "Email",
    "contact.info.phone": "Telefone",
    "contact.info.address": "Endereço",
    "contact.info.hours": "Horário",
    "contact.info.hours.value": "Seg - Sex: 8h às 18h",
    "contact.form.title": "Envie sua mensagem",
    "contact.form.name": "Nome completo *",
    "contact.form.company": "Empresa",
    "contact.form.email": "Email *",
    "contact.form.phone": "Telefone",
    "contact.form.message": "Mensagem *",
    "contact.form.submit": "Enviar Mensagem",
    "contact.form.sending": "Enviando...",
    "contact.form.success.title": "Mensagem Enviada!",
    "contact.form.success.desc": "Obrigado pelo contato. Nossa equipe retornará em breve.",
    "contact.form.success.new": "Enviar nova mensagem",
    "contact.form.error": "Erro ao enviar mensagem. Tente novamente.",
    "contact.form.successToast": "Mensagem enviada com sucesso!",
    
    // Prints Page
    "prints.label": "Estampas",
    "prints.title": "Estampas Exclusivas",
    "prints.description": "Descubra nossa coleção de estampas exclusivas, desenvolvidas com as últimas tendências do mercado esportivo e de moda praia.",
    "prints.categories.title": "Categorias de Estampas",
    "prints.categories.description": "Explore nossa variedade de estilos e padrões para encontrar a estampa perfeita para sua coleção.",
    "prints.category.tropical": "Tropical",
    "prints.category.tropical.desc": "Flores e folhagens vibrantes para coleções de verão.",
    "prints.category.geometric": "Geométrico",
    "prints.category.geometric.desc": "Padrões modernos e minimalistas.",
    "prints.category.abstract": "Abstrato",
    "prints.category.abstract.desc": "Arte contemporânea em tecidos únicos.",
    "prints.category.floral": "Floral",
    "prints.category.floral.desc": "Delicadeza e sofisticação em cada peça.",
    "prints.feature.exclusive": "Estampas Exclusivas",
    "prints.feature.exclusive.desc": "Designs únicos desenvolvidos por nossa equipe criativa.",
    "prints.feature.colors": "Cores Vibrantes",
    "prints.feature.colors.desc": "Tecnologia de impressão de alta definição.",
    "prints.feature.tech": "Alta Durabilidade",
    "prints.feature.tech.desc": "Estampas que não desbotam após lavagens.",
    "prints.cta.title": "Crie Sua Estampa Exclusiva",
    "prints.cta.description": "Trabalhamos com estampas personalizadas. Entre em contato para desenvolver uma coleção única.",
    
    // Sustainability Page Extended
    "sustainability.page.title": "Compromisso com o Futuro",
    "sustainability.page.description": "Na Digitale, a sustentabilidade não é apenas uma tendência – é parte do nosso DNA. Conheça nossas iniciativas ambientais.",
    "sustainability.impact.title": "Nosso Impacto Ambiental",
    "sustainability.initiatives.title": "Nossas Iniciativas",
    "sustainability.initiatives.description": "Implementamos práticas sustentáveis em toda nossa cadeia produtiva.",
    "sustainability.initiative.recycling": "Reciclagem de PET",
    "sustainability.initiative.recycling.desc": "Transformamos garrafas PET em fibras de alta qualidade.",
    "sustainability.initiative.water": "Gestão Hídrica",
    "sustainability.initiative.water.desc": "Sistemas de reuso e tratamento de água.",
    "sustainability.initiative.energy": "Energia Renovável",
    "sustainability.initiative.energy.desc": "Uso de fontes de energia limpa em nossa produção.",
    "sustainability.initiative.certifications": "Certificações",
    "sustainability.initiative.certifications.desc": "Padrões internacionais de sustentabilidade.",
    "sustainability.commitment": "Compromisso",
    "sustainability.products.title": "Linha ECO",
    "sustainability.products.description": "Tecidos desenvolvidos com materiais reciclados e processos sustentáveis.",
    "sustainability.product.pet.desc": "Fibras de alta qualidade feitas 100% de garrafas recicladas.",
    "sustainability.product.cotton.desc": "Algodão cultivado sem pesticidas ou químicos nocivos.",
    "sustainability.product.biodegradable.desc": "Materiais que se decompõem naturalmente.",
    "sustainability.cta.title": "Faça Parte da Mudança",
    "sustainability.cta.description": "Escolha tecidos sustentáveis para sua marca e contribua para um futuro melhor.",
    
    // Privacy & Terms Page
    "privacy.label": "Legal",
    "privacy.title": "Política de Privacidade e Termos de Uso",
    "privacy.description": "Conheça nossos termos e como protegemos seus dados pessoais.",
    "privacy.tab.privacy": "Política de Privacidade",
    "privacy.tab.terms": "Termos de Uso",
    "privacy.intro": "A Digitale Têxtil está comprometida em proteger sua privacidade. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais quando você utiliza nosso site e serviços.",
    "privacy.lastUpdate": "Última atualização",
    "privacy.section.data.title": "Coleta de Dados",
    "privacy.section.data.content": "Coletamos informações que você nos fornece diretamente, como nome, email, telefone e empresa quando preenche formulários de contato ou solicita orçamentos. Também coletamos dados de navegação automaticamente, como endereço IP, tipo de navegador e páginas visitadas.",
    "privacy.section.usage.title": "Uso das Informações",
    "privacy.section.usage.content": "Utilizamos suas informações para:\n• Responder suas solicitações e fornecer atendimento\n• Enviar informações sobre produtos e novidades (com seu consentimento)\n• Melhorar nossos produtos e serviços\n• Cumprir obrigações legais",
    "privacy.section.security.title": "Segurança dos Dados",
    "privacy.section.security.content": "Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. Seus dados são armazenados em servidores seguros com criptografia.",
    "privacy.section.contact.title": "Contato sobre Privacidade",
    "privacy.section.contact.content": "Para exercer seus direitos de privacidade (acesso, correção, exclusão de dados) ou esclarecer dúvidas, entre em contato pelo email: atendimento@digitaletextil.com.br",
    "terms.intro": "Ao acessar e utilizar o site da Digitale Têxtil, você concorda com os seguintes termos e condições. Por favor, leia atentamente antes de continuar navegando.",
    "terms.section.acceptance.title": "Aceitação dos Termos",
    "terms.section.acceptance.content": "Ao acessar este site, você confirma que leu, entendeu e concorda em estar vinculado a estes Termos de Uso. Se não concordar com qualquer parte destes termos, não utilize nosso site.",
    "terms.section.services.title": "Descrição dos Serviços",
    "terms.section.services.content": "A Digitale Têxtil fornece informações sobre tecidos esportivos e de moda praia, incluindo especificações técnicas, estampas e condições comerciais. Os produtos e serviços apresentados estão sujeitos a disponibilidade.",
    "terms.section.intellectual.title": "Propriedade Intelectual",
    "terms.section.intellectual.content": "Todo o conteúdo deste site, incluindo textos, imagens, logotipos, estampas e designs, são propriedade da Digitale Têxtil ou licenciados para uso. É proibida a reprodução, distribuição ou modificação sem autorização prévia por escrito.",
    "terms.section.liability.title": "Limitação de Responsabilidade",
    "terms.section.liability.content": "A Digitale Têxtil não se responsabiliza por danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso deste site. As informações são fornecidas 'como estão' e podem ser alteradas sem aviso prévio.",
    "terms.section.modifications.title": "Modificações",
    "terms.section.modifications.content": "Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação. Recomendamos que você revise esta página periodicamente.",
    
    // Blog Post Page
    "blog.postNotFound": "Post não encontrado",
    "blog.postNotFoundDesc": "O artigo que você procura não existe ou foi removido.",
    "blog.backToBlog": "Voltar ao Blog",
    "blog.readTime": "de leitura",
    "blog.share": "Compartilhar",
    "blog.linkCopied": "Link copiado para a área de transferência!",
    "blog.relatedPosts": "Posts Relacionados",
  },
  es: {
    // Navigation
    "nav.home": "INICIO",
    "nav.about": "NOSOTROS",
    "nav.fabrics": "TEJIDOS",
    "nav.prints": "ESTAMPADOS",
    "nav.sustainability": "SOSTENIBILIDAD",
    "nav.blog": "BLOG",
    "nav.contact": "CONTACTO",
    
    // Products Section
    "products.label": "Nuestros Tejidos",
    "products.title": "Últimos Lanzamientos",
    "products.viewMore": "Ver Detalles",
    "products.viewAll": "Ver Todos los Tejidos",
    "products.milano.desc": "Tejido de alta compresión, ideal para leggings y shorts fitness con excelente soporte muscular.",
    "products.lyon.desc": "Malla con tacto suave y caída perfecta, versátil para diversas aplicaciones deportivas.",
    "products.aerodry.desc": "Tecnología dry fit avanzada con secado ultra-rápido y alta transpirabilidad.",
    "products.veneza.desc": "Acabado satinado premium con brillo sofisticado para piezas elegantes.",
    "products.lyon.tagline": "Aumente sus ventas",
    "products.lyon.subtitle": "Cero transparencia",
    "products.aerodry.tagline": "Más ventas, más valor",
    "products.aerodry.subtitle": "Más rendimiento",
    "products.veneza.tagline": "Elegancia y confort",
    "products.veneza.subtitle": "En cada detalle",
    "products.milano.tagline": "El mejor tejido",
    "products.milano.subtitle": "Para leggings premium",
    
    // Testimonials
    "testimonials.label": "Testimonios",
    "testimonials.title": "Lo Que Dicen Nuestros Clientes",
    
    // Stats
    "stats.years": "Años de Experiencia",
    "stats.clients": "Clientes Atendidos",
    "stats.fabrics": "Tipos de Tejidos",
    "stats.production": "Toneladas/Mes",
    
    // Sustainability
    "sustainability.label": "Digitale ECO",
    "sustainability.title": "La Línea ECO de Digitale",
    "sustainability.description": "Transformamos residuos posconsumo en recursos valiosos. El reciclaje de 1 botella de plástico ahorra el equivalente a 3 horas de energía de una bombilla de 60 vatios.",
    "sustainability.bottles": "60 Botellas",
    "sustainability.bottles.desc": "1 kg de PET (100% residuos posconsumo) mantiene 60 botellas fuera del vertedero",
    "sustainability.co2": "65% Menos CO₂",
    "sustainability.co2.desc": "Reducción significativa en las emisiones de carbono",
    "sustainability.water": "90% Menos Agua",
    "sustainability.water.desc": "Ahorro expresivo en el consumo de agua",
    "sustainability.energy": "64% Menos Energía",
    "sustainability.energy.desc": "Reducción en el consumo energético total",
    "sustainability.cta": "Saber Más",
    "sustainability.sustainable": "Sostenible",
    
    // Clients
    "clients.label": "Socios",
    "clients.title": "Empresas Que Confían en Digitale",
    
    // Blog
    "blog.label": "Blog",
    "blog.title": "Últimas Novedades",
    "blog.description": "Sigue las tendencias del mercado textil y las novedades de Digitale.",
    "blog.readMore": "Leer Más",
    "blog.viewAll": "Ver Todos los Artículos",
    "blog.hero.title": "Novedades y Tendencias",
    "blog.hero.subtitle": "Sigue las últimas novedades del mercado textil, consejos e innovaciones en tejidos de alta tecnología.",
    "blog.search": "Buscar posts...",
    "blog.all": "Todos",
    "blog.noResults": "Ningún post encontrado.",
    "blog.clearSearch": "Limpiar búsqueda",
    
    // CTA
    "cta.title": "¿Listo para Revolucionar Sus Productos?",
    "cta.description": "Póngase en contacto con nuestro equipo y descubra cómo nuestros tejidos pueden elevar la calidad de sus productos.",
    "cta.button": "Solicitar Presupuesto",
    
    // Footer
    "footer.description": "Hace más de 25 años desarrollando tejidos innovadores y sostenibles para el mercado deportivo brasileño.",
    "footer.navigation": "Navegación",
    "footer.contact": "Contacto",
    "footer.followUs": "Síguenos",
    "footer.rights": "Todos los derechos reservados.",
    "footer.admin": "Panel Administrativo",
    "footer.privacy": "Política de Privacidad",
    
    // About Page
    "about.label": "Nosotros",
    "about.title": "Más de 60 Años de Excelencia Textil",
    "about.description": "Somos una empresa del Grupo VMF/Schick Bin, con más de seis décadas de experiencia en el segmento textil, siempre a la vanguardia de las innovaciones del mercado.",
    "about.history.title": "Nuestra Historia",
    "about.history.p1": "Digitale Têxtil nació de la pasión por transformar tejidos en experiencias. A lo largo de más de 60 años, nos hemos convertido en referencia en tejidos de alta tecnología, siempre invirtiendo en innovación y sostenibilidad.",
    "about.history.p2": "Hoy, atendemos a más de 1.000 clientes en 15 países, ofreciendo tejidos con tecnologías exclusivas como Aloe Vera, protección UV 50+, antibacteriano y mucho más.",
    "about.value.quality": "Calidad",
    "about.value.quality.desc": "Entregamos tejidos con los más altos estándares de calidad del mercado.",
    "about.value.innovation": "Innovación",
    "about.value.innovation.desc": "Invertimos constantemente en nuevas tecnologías y procesos.",
    "about.value.sustainability": "Sostenibilidad",
    "about.value.sustainability.desc": "Compromiso con prácticas ambientalmente responsables.",
    "about.value.partnership": "Alianza",
    "about.value.partnership.desc": "Construimos relaciones duraderas con nuestros clientes.",
    "about.image.alt": "Atleta usando tejidos Digitale",
    "about.years": "Años de mercado",
    
    // Contact Page
    "contact.label": "Contacto",
    "contact.title": "Contáctanos",
    "contact.description": "Estamos listos para atenderle y ayudarle a encontrar los mejores tejidos para su negocio.",
    "contact.info.email": "Correo",
    "contact.info.phone": "Teléfono",
    "contact.info.address": "Dirección",
    "contact.info.hours": "Horario",
    "contact.info.hours.value": "Lun - Vie: 8h a 18h",
    "contact.form.title": "Envíe su mensaje",
    "contact.form.name": "Nombre completo *",
    "contact.form.company": "Empresa",
    "contact.form.email": "Correo electrónico *",
    "contact.form.phone": "Teléfono",
    "contact.form.message": "Mensaje *",
    "contact.form.submit": "Enviar Mensaje",
    "contact.form.sending": "Enviando...",
    "contact.form.success.title": "¡Mensaje Enviado!",
    "contact.form.success.desc": "Gracias por su contacto. Nuestro equipo le responderá pronto.",
    "contact.form.success.new": "Enviar nuevo mensaje",
    "contact.form.error": "Error al enviar mensaje. Inténtalo de nuevo.",
    "contact.form.successToast": "¡Mensaje enviado con éxito!",
    
    // Prints Page
    "prints.label": "Estampados",
    "prints.title": "Estampados Exclusivos",
    "prints.description": "Descubra nuestra colección de estampados exclusivos, desarrollados con las últimas tendencias del mercado deportivo y de moda playa.",
    "prints.categories.title": "Categorías de Estampados",
    "prints.categories.description": "Explore nuestra variedad de estilos y patrones para encontrar el estampado perfecto para su colección.",
    "prints.category.tropical": "Tropical",
    "prints.category.tropical.desc": "Flores y follajes vibrantes para colecciones de verano.",
    "prints.category.geometric": "Geométrico",
    "prints.category.geometric.desc": "Patrones modernos y minimalistas.",
    "prints.category.abstract": "Abstracto",
    "prints.category.abstract.desc": "Arte contemporáneo en tejidos únicos.",
    "prints.category.floral": "Floral",
    "prints.category.floral.desc": "Delicadeza y sofisticación en cada pieza.",
    "prints.feature.exclusive": "Estampados Exclusivos",
    "prints.feature.exclusive.desc": "Diseños únicos desarrollados por nuestro equipo creativo.",
    "prints.feature.colors": "Colores Vibrantes",
    "prints.feature.colors.desc": "Tecnología de impresión de alta definición.",
    "prints.feature.tech": "Alta Durabilidad",
    "prints.feature.tech.desc": "Estampados que no se destiñen después de lavados.",
    "prints.cta.title": "Cree Su Estampado Exclusivo",
    "prints.cta.description": "Trabajamos con estampados personalizados. Contáctenos para desarrollar una colección única.",
    
    // Sustainability Page Extended
    "sustainability.page.title": "Compromiso con el Futuro",
    "sustainability.page.description": "En Digitale, la sostenibilidad no es solo una tendencia – es parte de nuestro ADN. Conozca nuestras iniciativas ambientales.",
    "sustainability.impact.title": "Nuestro Impacto Ambiental",
    "sustainability.initiatives.title": "Nuestras Iniciativas",
    "sustainability.initiatives.description": "Implementamos prácticas sostenibles en toda nuestra cadena productiva.",
    "sustainability.initiative.recycling": "Reciclaje de PET",
    "sustainability.initiative.recycling.desc": "Transformamos botellas PET en fibras de alta calidad.",
    "sustainability.initiative.water": "Gestión Hídrica",
    "sustainability.initiative.water.desc": "Sistemas de reuso y tratamiento de agua.",
    "sustainability.initiative.energy": "Energía Renovable",
    "sustainability.initiative.energy.desc": "Uso de fuentes de energía limpia en nuestra producción.",
    "sustainability.initiative.certifications": "Certificaciones",
    "sustainability.initiative.certifications.desc": "Estándares internacionales de sostenibilidad.",
    "sustainability.commitment": "Compromiso",
    "sustainability.products.title": "Línea ECO",
    "sustainability.products.description": "Tejidos desarrollados con materiales reciclados y procesos sostenibles.",
    "sustainability.product.pet.desc": "Fibras de alta calidad hechas 100% de botellas recicladas.",
    "sustainability.product.cotton.desc": "Algodón cultivado sin pesticidas o químicos nocivos.",
    "sustainability.product.biodegradable.desc": "Materiales que se descomponen naturalmente.",
    "sustainability.cta.title": "Sea Parte del Cambio",
    "sustainability.cta.description": "Elija tejidos sostenibles para su marca y contribuya a un futuro mejor.",
    
    // Privacy & Terms Page
    "privacy.label": "Legal",
    "privacy.title": "Política de Privacidad y Términos de Uso",
    "privacy.description": "Conozca nuestros términos y cómo protegemos sus datos personales.",
    "privacy.tab.privacy": "Política de Privacidad",
    "privacy.tab.terms": "Términos de Uso",
    "privacy.intro": "Digitale Têxtil está comprometida en proteger su privacidad. Esta política describe cómo recopilamos, usamos y protegemos su información personal cuando utiliza nuestro sitio y servicios.",
    "privacy.lastUpdate": "Última actualización",
    "privacy.section.data.title": "Recopilación de Datos",
    "privacy.section.data.content": "Recopilamos información que nos proporciona directamente, como nombre, correo electrónico, teléfono y empresa cuando completa formularios de contacto o solicita presupuestos. También recopilamos datos de navegación automáticamente.",
    "privacy.section.usage.title": "Uso de la Información",
    "privacy.section.usage.content": "Utilizamos su información para:\n• Responder sus solicitudes y brindar atención\n• Enviar información sobre productos y novedades (con su consentimiento)\n• Mejorar nuestros productos y servicios\n• Cumplir obligaciones legales",
    "privacy.section.security.title": "Seguridad de los Datos",
    "privacy.section.security.content": "Implementamos medidas de seguridad técnicas y organizativas para proteger su información contra acceso no autorizado, alteración, divulgación o destrucción.",
    "privacy.section.contact.title": "Contacto sobre Privacidad",
    "privacy.section.contact.content": "Para ejercer sus derechos de privacidad o aclarar dudas, contáctenos: atendimento@digitaletextil.com.br",
    "terms.intro": "Al acceder y utilizar el sitio de Digitale Têxtil, usted acepta los siguientes términos y condiciones.",
    "terms.section.acceptance.title": "Aceptación de los Términos",
    "terms.section.acceptance.content": "Al acceder a este sitio, confirma que ha leído, entendido y acepta estar vinculado a estos Términos de Uso.",
    "terms.section.services.title": "Descripción de los Servicios",
    "terms.section.services.content": "Digitale Têxtil proporciona información sobre tejidos deportivos y de moda playa, incluyendo especificaciones técnicas, estampados y condiciones comerciales.",
    "terms.section.intellectual.title": "Propiedad Intelectual",
    "terms.section.intellectual.content": "Todo el contenido de este sitio es propiedad de Digitale Têxtil. Está prohibida la reproducción sin autorización previa.",
    "terms.section.liability.title": "Limitación de Responsabilidad",
    "terms.section.liability.content": "Digitale Têxtil no se responsabiliza por daños derivados del uso de este sitio. La información se proporciona tal cual.",
    "terms.section.modifications.title": "Modificaciones",
    "terms.section.modifications.content": "Nos reservamos el derecho de modificar estos términos en cualquier momento.",
    
    // Blog Post Page
    "blog.postNotFound": "Publicación no encontrada",
    "blog.postNotFoundDesc": "El artículo que busca no existe o fue eliminado.",
    "blog.backToBlog": "Volver al Blog",
    "blog.readTime": "de lectura",
    "blog.share": "Compartir",
    "blog.linkCopied": "¡Enlace copiado al portapapeles!",
    "blog.relatedPosts": "Publicaciones Relacionadas",
  },
  en: {
    // Navigation
    "nav.home": "HOME",
    "nav.about": "ABOUT US",
    "nav.fabrics": "FABRICS",
    "nav.prints": "PRINTS",
    "nav.sustainability": "SUSTAINABILITY",
    "nav.blog": "BLOG",
    "nav.contact": "CONTACT US",
    
    // Products Section
    "products.label": "Our Fabrics",
    "products.title": "Latest Releases",
    "products.viewMore": "View Details",
    "products.viewAll": "View All Fabrics",
    "products.milano.desc": "High compression fabric, ideal for leggings and fitness shorts with excellent muscle support.",
    "products.lyon.desc": "Soft touch mesh with perfect drape, versatile for various sports applications.",
    "products.aerodry.desc": "Advanced dry fit technology with ultra-fast drying and high breathability.",
    "products.veneza.desc": "Premium satin finish with sophisticated shine for elegant pieces.",
    "products.lyon.tagline": "Boost your sales",
    "products.lyon.subtitle": "Zero transparency",
    "products.aerodry.tagline": "More sales, more value",
    "products.aerodry.subtitle": "More performance",
    "products.veneza.tagline": "Elegance and comfort",
    "products.veneza.subtitle": "In every detail",
    "products.milano.tagline": "The best fabric",
    "products.milano.subtitle": "For premium leggings",
    
    // Testimonials
    "testimonials.label": "Testimonials",
    "testimonials.title": "What Our Clients Say",
    
    // Stats
    "stats.years": "Years of Experience",
    "stats.clients": "Clients Served",
    "stats.fabrics": "Fabric Types",
    "stats.production": "Tons/Month",
    
    // Sustainability
    "sustainability.label": "Digitale ECO",
    "sustainability.title": "Digitale's ECO Line",
    "sustainability.description": "We transform post-consumer waste into valuable resources. Recycling 1 plastic bottle saves the equivalent of 3 hours of energy from a 60-watt bulb.",
    "sustainability.bottles": "60 Bottles",
    "sustainability.bottles.desc": "1 kg of PET (100% post-consumer waste) keeps 60 bottles out of the landfill",
    "sustainability.co2": "65% Less CO₂",
    "sustainability.co2.desc": "Significant reduction in carbon emissions",
    "sustainability.water": "90% Less Water",
    "sustainability.water.desc": "Expressive savings in water consumption",
    "sustainability.energy": "64% Less Energy",
    "sustainability.energy.desc": "Reduction in total energy consumption",
    "sustainability.cta": "Learn More",
    "sustainability.sustainable": "Sustainable",
    
    // Clients
    "clients.label": "Partners",
    "clients.title": "Companies That Trust Digitale",
    
    // Blog
    "blog.label": "Blog",
    "blog.title": "Latest News",
    "blog.description": "Follow the trends in the textile market and the latest from Digitale.",
    "blog.readMore": "Read More",
    "blog.viewAll": "View All Articles",
    "blog.hero.title": "News and Trends",
    "blog.hero.subtitle": "Follow the latest news from the textile market, tips and innovations in high-tech fabrics.",
    "blog.search": "Search posts...",
    "blog.all": "All",
    "blog.noResults": "No posts found.",
    "blog.clearSearch": "Clear search",
    
    // CTA
    "cta.title": "Ready to Revolutionize Your Products?",
    "cta.description": "Contact our team and discover how our fabrics can elevate the quality of your products.",
    "cta.button": "Request a Quote",
    
    // Footer
    "footer.description": "For over 25 years developing innovative and sustainable fabrics for the Brazilian sports market.",
    "footer.navigation": "Navigation",
    "footer.contact": "Contact",
    "footer.followUs": "Follow Us",
    "footer.rights": "All rights reserved.",
    "footer.admin": "Admin Panel",
    "footer.privacy": "Privacy Policy",
    
    // About Page
    "about.label": "About Us",
    "about.title": "Over 60 Years of Textile Excellence",
    "about.description": "We are a company of the VMF/Schick Bin Group, with over six decades of experience in the textile segment, always at the forefront of market innovations.",
    "about.history.title": "Our History",
    "about.history.p1": "Digitale Têxtil was born from the passion for transforming fabrics into experiences. Over more than 60 years, we have become a reference in high-tech fabrics, always investing in innovation and sustainability.",
    "about.history.p2": "Today, we serve more than 1,000 clients in 15 countries, offering fabrics with exclusive technologies such as Aloe Vera, UV 50+ protection, antibacterial and much more.",
    "about.value.quality": "Quality",
    "about.value.quality.desc": "We deliver fabrics with the highest quality standards in the market.",
    "about.value.innovation": "Innovation",
    "about.value.innovation.desc": "We constantly invest in new technologies and processes.",
    "about.value.sustainability": "Sustainability",
    "about.value.sustainability.desc": "Commitment to environmentally responsible practices.",
    "about.value.partnership": "Partnership",
    "about.value.partnership.desc": "We build lasting relationships with our customers.",
    "about.image.alt": "Athlete wearing Digitale fabrics",
    "about.years": "Years in the market",
    
    // Contact Page
    "contact.label": "Contact",
    "contact.title": "Contact Us",
    "contact.description": "We are ready to serve you and help you find the best fabrics for your business.",
    "contact.info.email": "Email",
    "contact.info.phone": "Phone",
    "contact.info.address": "Address",
    "contact.info.hours": "Hours",
    "contact.info.hours.value": "Mon - Fri: 8am to 6pm",
    "contact.form.title": "Send your message",
    "contact.form.name": "Full name *",
    "contact.form.company": "Company",
    "contact.form.email": "Email *",
    "contact.form.phone": "Phone",
    "contact.form.message": "Message *",
    "contact.form.submit": "Send Message",
    "contact.form.sending": "Sending...",
    "contact.form.success.title": "Message Sent!",
    "contact.form.success.desc": "Thank you for your contact. Our team will get back to you soon.",
    "contact.form.success.new": "Send new message",
    "contact.form.error": "Error sending message. Please try again.",
    "contact.form.successToast": "Message sent successfully!",
    
    // Prints Page
    "prints.label": "Prints",
    "prints.title": "Exclusive Prints",
    "prints.description": "Discover our collection of exclusive prints, developed with the latest trends in the sports and beachwear market.",
    "prints.categories.title": "Print Categories",
    "prints.categories.description": "Explore our variety of styles and patterns to find the perfect print for your collection.",
    "prints.category.tropical": "Tropical",
    "prints.category.tropical.desc": "Vibrant flowers and foliage for summer collections.",
    "prints.category.geometric": "Geometric",
    "prints.category.geometric.desc": "Modern and minimalist patterns.",
    "prints.category.abstract": "Abstract",
    "prints.category.abstract.desc": "Contemporary art on unique fabrics.",
    "prints.category.floral": "Floral",
    "prints.category.floral.desc": "Delicacy and sophistication in every piece.",
    "prints.feature.exclusive": "Exclusive Prints",
    "prints.feature.exclusive.desc": "Unique designs developed by our creative team.",
    "prints.feature.colors": "Vibrant Colors",
    "prints.feature.colors.desc": "High definition printing technology.",
    "prints.feature.tech": "High Durability",
    "prints.feature.tech.desc": "Prints that don't fade after washing.",
    "prints.cta.title": "Create Your Exclusive Print",
    "prints.cta.description": "We work with custom prints. Contact us to develop a unique collection.",
    
    // Sustainability Page Extended
    "sustainability.page.title": "Commitment to the Future",
    "sustainability.page.description": "At Digitale, sustainability is not just a trend – it's part of our DNA. Discover our environmental initiatives.",
    "sustainability.impact.title": "Our Environmental Impact",
    "sustainability.initiatives.title": "Our Initiatives",
    "sustainability.initiatives.description": "We implement sustainable practices throughout our production chain.",
    "sustainability.initiative.recycling": "PET Recycling",
    "sustainability.initiative.recycling.desc": "We transform PET bottles into high-quality fibers.",
    "sustainability.initiative.water": "Water Management",
    "sustainability.initiative.water.desc": "Water reuse and treatment systems.",
    "sustainability.initiative.energy": "Renewable Energy",
    "sustainability.initiative.energy.desc": "Use of clean energy sources in our production.",
    "sustainability.initiative.certifications": "Certifications",
    "sustainability.initiative.certifications.desc": "International sustainability standards.",
    "sustainability.commitment": "Commitment",
    "sustainability.products.title": "ECO Line",
    "sustainability.products.description": "Fabrics developed with recycled materials and sustainable processes.",
    "sustainability.product.pet.desc": "High-quality fibers made 100% from recycled bottles.",
    "sustainability.product.cotton.desc": "Cotton grown without pesticides or harmful chemicals.",
    "sustainability.product.biodegradable.desc": "Materials that decompose naturally.",
    "sustainability.cta.title": "Be Part of the Change",
    "sustainability.cta.description": "Choose sustainable fabrics for your brand and contribute to a better future.",
    
    // Privacy & Terms Page
    "privacy.label": "Legal",
    "privacy.title": "Privacy Policy and Terms of Use",
    "privacy.description": "Learn about our terms and how we protect your personal data.",
    "privacy.tab.privacy": "Privacy Policy",
    "privacy.tab.terms": "Terms of Use",
    "privacy.intro": "Digitale Têxtil is committed to protecting your privacy. This policy describes how we collect, use and protect your personal information when you use our site and services.",
    "privacy.lastUpdate": "Last update",
    "privacy.section.data.title": "Data Collection",
    "privacy.section.data.content": "We collect information you provide directly to us, such as name, email, phone and company when you fill out contact forms or request quotes. We also automatically collect browsing data.",
    "privacy.section.usage.title": "Use of Information",
    "privacy.section.usage.content": "We use your information to:\n• Respond to your requests and provide service\n• Send information about products and news (with your consent)\n• Improve our products and services\n• Comply with legal obligations",
    "privacy.section.security.title": "Data Security",
    "privacy.section.security.content": "We implement technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure or destruction.",
    "privacy.section.contact.title": "Privacy Contact",
    "privacy.section.contact.content": "To exercise your privacy rights or clarify questions, contact us: atendimento@digitaletextil.com.br",
    "terms.intro": "By accessing and using the Digitale Têxtil website, you agree to the following terms and conditions.",
    "terms.section.acceptance.title": "Acceptance of Terms",
    "terms.section.acceptance.content": "By accessing this site, you confirm that you have read, understood and agree to be bound by these Terms of Use.",
    "terms.section.services.title": "Description of Services",
    "terms.section.services.content": "Digitale Têxtil provides information about sports and beachwear fabrics, including technical specifications, prints and commercial conditions.",
    "terms.section.intellectual.title": "Intellectual Property",
    "terms.section.intellectual.content": "All content on this site is the property of Digitale Têxtil. Reproduction without prior authorization is prohibited.",
    "terms.section.liability.title": "Limitation of Liability",
    "terms.section.liability.content": "Digitale Têxtil is not responsible for damages arising from the use of this site. Information is provided as is.",
    "terms.section.modifications.title": "Modifications",
    "terms.section.modifications.content": "We reserve the right to modify these terms at any time.",
    
    // Blog Post Page
    "blog.postNotFound": "Post not found",
    "blog.postNotFoundDesc": "The article you are looking for does not exist or has been removed.",
    "blog.backToBlog": "Back to Blog",
    "blog.readTime": "read",
    "blog.share": "Share",
    "blog.linkCopied": "Link copied to clipboard!",
    "blog.relatedPosts": "Related Posts",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "pt";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
