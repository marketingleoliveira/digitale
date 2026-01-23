import { motion } from "framer-motion";
import { ArrowRight, Star, Zap, Shield, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const products = [
  {
    name: "Milano",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=700&fit=crop",
    description: "products.milano.desc",
    icon: Zap,
  },
  {
    name: "Lyon",
    image: "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=600&h=700&fit=crop",
    description: "products.lyon.desc",
    icon: Star,
  },
  {
    name: "Aerodry",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=700&fit=crop",
    description: "products.aerodry.desc",
    icon: Droplets,
  },
  {
    name: "Veneza",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=700&fit=crop",
    description: "products.veneza.desc",
    icon: Shield,
  },
];

export function Products() {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-subtitle">{t("products.label")}</span>
          <h2 className="section-title mt-4 mb-6">{t("products.title")}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="card-hover bg-card">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 w-12 h-12 bg-card rounded-xl flex items-center justify-center shadow-lg">
                    <product.icon className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {t(product.description)}
                  </p>
                  <Link
                    to={`/tecidos/${product.name.toLowerCase()}`}
                    className="inline-flex items-center gap-2 text-accent font-semibold text-sm"
                  >
                    {t("products.viewMore")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
