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
    
    // Hero
    "hero.title": "Inovação em Tecidos para o Futuro do Esporte",
    "hero.subtitle": "Desenvolvemos tecidos de alta performance com tecnologia sustentável para as principais marcas esportivas do Brasil.",
    "hero.cta.products": "Conheça Nossos Tecidos",
    "hero.cta.contact": "Fale Conosco",
    
    // Products
    "products.label": "Nossos Tecidos",
    "products.title": "Tecnologia e Inovação em Cada Fio",
    "products.description": "Desenvolvemos tecidos exclusivos que combinam performance, conforto e sustentabilidade para atender às necessidades mais exigentes do mercado esportivo.",
    "products.cta": "Ver Todos os Tecidos",
    
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
    "about.hero.title": "Sobre a Digitale",
    "about.hero.subtitle": "Há mais de 25 anos desenvolvendo tecidos inovadores para o mercado esportivo brasileiro",
    
    // Contact Page
    "contact.hero.title": "Fale Conosco",
    "contact.hero.subtitle": "Estamos prontos para atender você. Entre em contato através do formulário ou pelos nossos canais de atendimento.",
    "contact.form.name": "Nome",
    "contact.form.email": "E-mail",
    "contact.form.phone": "Telefone",
    "contact.form.company": "Empresa",
    "contact.form.message": "Mensagem",
    "contact.form.submit": "Enviar Mensagem",
    "contact.form.sending": "Enviando...",
    "contact.form.success": "Mensagem Enviada!",
    "contact.form.successDesc": "Obrigado pelo seu contato. Nossa equipe retornará em breve.",
    "contact.form.sendAnother": "Enviar Outra Mensagem",
    
    // Blog Page
    "blog.hero.title": "Blog Digitale",
    "blog.hero.subtitle": "Acompanhe as últimas tendências, novidades e insights do mundo têxtil esportivo.",
    "blog.search": "Buscar artigos...",
    "blog.all": "Todos",
    "blog.noResults": "Nenhum post encontrado",
    "blog.noResultsDesc": "Não encontramos posts com os filtros selecionados.",
    "blog.clearSearch": "Limpar busca",
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
    
    // Hero
    "hero.title": "Innovación en Tejidos para el Futuro del Deporte",
    "hero.subtitle": "Desarrollamos tejidos de alto rendimiento con tecnología sostenible para las principales marcas deportivas de Brasil.",
    "hero.cta.products": "Conoce Nuestros Tejidos",
    "hero.cta.contact": "Contáctanos",
    
    // Products
    "products.label": "Nuestros Tejidos",
    "products.title": "Tecnología e Innovación en Cada Hilo",
    "products.description": "Desarrollamos tejidos exclusivos que combinan rendimiento, comodidad y sostenibilidad para satisfacer las necesidades más exigentes del mercado deportivo.",
    "products.cta": "Ver Todos los Tejidos",
    
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
    "about.hero.title": "Sobre Digitale",
    "about.hero.subtitle": "Hace más de 25 años desarrollando tejidos innovadores para el mercado deportivo brasileño",
    
    // Contact Page
    "contact.hero.title": "Contáctanos",
    "contact.hero.subtitle": "Estamos listos para atenderle. Póngase en contacto a través del formulario o de nuestros canales de atención.",
    "contact.form.name": "Nombre",
    "contact.form.email": "Correo electrónico",
    "contact.form.phone": "Teléfono",
    "contact.form.company": "Empresa",
    "contact.form.message": "Mensaje",
    "contact.form.submit": "Enviar Mensaje",
    "contact.form.sending": "Enviando...",
    "contact.form.success": "¡Mensaje Enviado!",
    "contact.form.successDesc": "Gracias por su contacto. Nuestro equipo le responderá pronto.",
    "contact.form.sendAnother": "Enviar Otro Mensaje",
    
    // Blog Page
    "blog.hero.title": "Blog Digitale",
    "blog.hero.subtitle": "Sigue las últimas tendencias, novedades e insights del mundo textil deportivo.",
    "blog.search": "Buscar artículos...",
    "blog.all": "Todos",
    "blog.noResults": "Ningún post encontrado",
    "blog.noResultsDesc": "No encontramos posts con los filtros seleccionados.",
    "blog.clearSearch": "Limpiar búsqueda",
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
    
    // Hero
    "hero.title": "Innovation in Fabrics for the Future of Sports",
    "hero.subtitle": "We develop high-performance fabrics with sustainable technology for Brazil's leading sports brands.",
    "hero.cta.products": "Discover Our Fabrics",
    "hero.cta.contact": "Contact Us",
    
    // Products
    "products.label": "Our Fabrics",
    "products.title": "Technology and Innovation in Every Thread",
    "products.description": "We develop exclusive fabrics that combine performance, comfort and sustainability to meet the most demanding needs of the sports market.",
    "products.cta": "View All Fabrics",
    
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
    "about.hero.title": "About Digitale",
    "about.hero.subtitle": "For over 25 years developing innovative fabrics for the Brazilian sports market",
    
    // Contact Page
    "contact.hero.title": "Contact Us",
    "contact.hero.subtitle": "We're ready to serve you. Get in touch through the form or our service channels.",
    "contact.form.name": "Name",
    "contact.form.email": "Email",
    "contact.form.phone": "Phone",
    "contact.form.company": "Company",
    "contact.form.message": "Message",
    "contact.form.submit": "Send Message",
    "contact.form.sending": "Sending...",
    "contact.form.success": "Message Sent!",
    "contact.form.successDesc": "Thank you for your contact. Our team will get back to you soon.",
    "contact.form.sendAnother": "Send Another Message",
    
    // Blog Page
    "blog.hero.title": "Digitale Blog",
    "blog.hero.subtitle": "Follow the latest trends, news and insights from the sports textile world.",
    "blog.search": "Search articles...",
    "blog.all": "All",
    "blog.noResults": "No posts found",
    "blog.noResultsDesc": "We didn't find any posts with the selected filters.",
    "blog.clearSearch": "Clear search",
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
