import { useLanguage } from "@/contexts/LanguageContext";

const clients = [
  { name: "Puma", logo: "https://digitaletextil.com.br/wp-content/uploads/2023/03/Puma-Logo.png" },
  { name: "Fila", logo: "https://digitaletextil.com.br/wp-content/uploads/2023/03/Fila-Logo.png" },
  { name: "Havaianas", logo: "https://digitaletextil.com.br/wp-content/webp-express/webp-images/uploads/2023/03/havaianas-logo-0-1.png.webp" },
  { name: "Calvin Klein", logo: "https://digitaletextil.com.br/wp-content/webp-express/webp-images/uploads/2023/03/calvin-klein-logo-501C5505BD-seeklogo.com_.png.webp" },
  { name: "Mash", logo: "https://digitaletextil.com.br/wp-content/webp-express/webp-images/uploads/2023/03/mash_marca.jpg.webp" },
  { name: "Tip Top", logo: "https://digitaletextil.com.br/wp-content/webp-express/webp-images/uploads/2022/12/LogoTipTop.jpg.webp" },
  { name: "Track & Field", logo: "https://digitaletextil.com.br/wp-content/webp-express/webp-images/uploads/2023/04/track-field-2-_1610030833.png.webp" },
  { name: "Amir Slama", logo: "https://digitaletextil.com.br/wp-content/webp-express/webp-images/uploads/2022/12/amir-slama-.jpg.webp" },
];

export function Clients() {
  const { t } = useLanguage();

  // Duplicate clients for seamless scroll (reduced from 4x to 2x)
  const duplicatedClients = [...clients, ...clients];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      {/* Header */}
      <div className="container mx-auto px-6 mb-10 md:mb-12">
        <div className="text-center">
          <span className="section-subtitle">{t("clients.label")}</span>
          <h2 className="section-title mt-4">{t("clients.title")}</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Grandes marcas escolhem a Digitale pela qualidade, inovação e compromisso com a excelência.
          </p>
        </div>
      </div>

      {/* Full-width Marquee */}
      <div className="relative w-full">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
        
        {/* Marquee Track */}
        <div className="flex marquee-track gap-8 md:gap-12 items-center py-6">
          {duplicatedClients.map((client, index) => (
            <div
              key={`${client.name}-${index}`}
              className="flex-shrink-0 group"
            >
              <div className="w-36 md:w-44 h-20 md:h-24 bg-card rounded-2xl border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 flex items-center justify-center px-4 md:px-6">
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  className="max-h-10 md:max-h-12 max-w-full object-contain grayscale group-hover:grayscale-0 opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="container mx-auto px-6">
        <div className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-4 md:gap-10">
          {[
            "Qualidade Certificada",
            "Entrega em Todo Brasil",
            "Atendimento Personalizado",
            "Produção Sustentável"
          ].map((badge, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground"
            >
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 30s linear infinite;
          width: fit-content;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
