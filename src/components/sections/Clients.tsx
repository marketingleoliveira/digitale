import { useLanguage } from "@/contexts/LanguageContext";

const clients = [
  { name: "Puma", logo: "/logos/puma.png" },
  { name: "Fila", logo: "/logos/fila.png" },
  { name: "Havaianas", logo: "/logos/havaianas.png" },
  { name: "Calvin Klein", logo: "/logos/calvin-klein.png" },
  { name: "Mash", logo: "/logos/mash.png" },
  { name: "Tip Top", logo: "/logos/tiptop.png" },
  { name: "Track & Field", logo: "/logos/track-field.png" },
  { name: "Amir Slama", logo: "/logos/amir-slama.png" },
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
              <div className="w-[180px] h-[90px] bg-card rounded-2xl border border-border hover:border-accent/30 hover:shadow-lg hover:w-[220px] hover:h-[110px] transition-all duration-300 flex items-center justify-center px-5">
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  className="max-h-14 max-w-[140px] object-contain grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:max-h-20 group-hover:max-w-[180px] group-hover:scale-110"
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
