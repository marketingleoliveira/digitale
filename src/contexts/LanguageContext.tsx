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
    "products.title": "Últimos Lançamentos",
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
    "products.title": "Últimos Lanzamientos",
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
    "products.title": "Latest Releases",
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
