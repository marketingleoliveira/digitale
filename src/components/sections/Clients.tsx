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
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-subtitle">{t("clients.label")}</span>
          <h2 className="section-title mt-4">{t("clients.title")}</h2>
        </motion.div>

        {/* Infinite Scroll Effect */}
        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
          
          <div className="flex animate-scroll gap-16 items-center py-8">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="flex-shrink-0 group"
              >
                <div className="w-40 h-20 flex items-center justify-center grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-500">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-16 max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
