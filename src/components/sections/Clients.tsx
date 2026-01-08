import { motion } from "framer-motion";

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
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-subtitle">Parceiros</span>
          <h2 className="section-title mt-3">Alguns de Nossos Clientes</h2>
        </motion.div>

        {/* Infinite Scroll Effect */}
        <div className="relative">
          <div className="flex animate-scroll gap-12 items-center">
            {[...clients, ...clients].map((client, index) => (
              <div
                key={`${client.name}-${index}`}
                className="flex-shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="h-12 md:h-16 w-auto object-contain"
                />
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
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
