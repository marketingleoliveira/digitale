import { motion } from "framer-motion";
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

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-subtitle">{t("clients.label")}</span>
          <h2 className="section-title mt-4">{t("clients.title")}</h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Grandes marcas escolhem a Digitale pela qualidade, inovação e compromisso com a excelência.
          </p>
        </motion.div>

        {/* Desktop: Static Grid */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4 gap-8 max-w-4xl mx-auto">
            {clients.map((client, index) => (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-card rounded-2xl p-6 border border-border hover:border-accent/30 hover:shadow-lg transition-all duration-300 flex items-center justify-center h-24">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-12 max-w-full object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Infinite Scroll */}
        <div className="md:hidden relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10" />
          
          <div className="flex animate-scroll gap-8 items-center py-4">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="flex-shrink-0"
              >
                <div className="w-32 h-16 bg-card rounded-xl border border-border flex items-center justify-center px-4">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-10 max-w-full object-contain grayscale opacity-60"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {[
            "Qualidade Certificada",
            "Entrega em Todo Brasil",
            "Atendimento Personalizado",
            "Produção Sustentável"
          ].map((badge, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>{badge}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </section>
  );
}
