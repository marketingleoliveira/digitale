import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const products = [
  {
    id: "lyon",
    name: "Lyon",
    taglineKey: "products.lyon.tagline",
    subtitleKey: "products.lyon.subtitle",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    bgColor: "bg-sky-400",
  },
  {
    id: "aerodry",
    name: "Aerodry",
    taglineKey: "products.aerodry.tagline",
    subtitleKey: "products.aerodry.subtitle",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    bgColor: "bg-gray-700",
  },
  {
    id: "veneza",
    name: "Veneza",
    taglineKey: "products.veneza.tagline",
    subtitleKey: "products.veneza.subtitle",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80",
    bgColor: "bg-rose-400",
  },
  {
    id: "milano",
    name: "Milano Myst",
    taglineKey: "products.milano.tagline",
    subtitleKey: "products.milano.subtitle",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
    bgColor: "bg-violet-600",
  },
];

export function Products() {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-title text-center mb-12"
        >
          {t("products.title")}
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/tecidos/${product.id}`}
                className="group block card-hover"
              >
                <div className={`${product.bgColor} relative aspect-[3/4] overflow-hidden`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover mix-blend-overlay opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                    <span className="text-sm opacity-80 mb-2">{t(product.taglineKey)}</span>
                    <h3 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h3>
                    <span className="text-sm opacity-80">{t(product.subtitleKey)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
