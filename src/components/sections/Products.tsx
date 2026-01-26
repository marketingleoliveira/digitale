import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import logoColor from "@/assets/logo-color.png";
import fabricMilano from "@/assets/fabric-milano.jpg";
import fabricLyon from "@/assets/fabric-lyon.jpg";
import fabricAerodry from "@/assets/fabric-aerodry.jpg";
import fabricVeneza from "@/assets/fabric-veneza.jpg";

const products = [
  {
    name: "Milano",
    image: fabricMilano,
    description: "products.milano.desc",
    color: "from-blue-600/80 to-blue-900/80",
  },
  {
    name: "Lyon",
    image: fabricLyon,
    description: "products.lyon.desc",
    color: "from-pink-400/80 to-rose-600/80",
  },
  {
    name: "Aerodry",
    image: fabricAerodry,
    description: "products.aerodry.desc",
    color: "from-teal-400/80 to-teal-700/80",
  },
  {
    name: "Veneza",
    image: fabricVeneza,
    description: "products.veneza.desc",
    color: "from-red-500/80 to-rose-700/80",
  },
];

export function Products() {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="section-subtitle">{t("products.label")}</span>
          <h2 className="section-title mt-3 md:mt-4 mb-4 md:mb-6">{t("products.title")}</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link to={`/tecidos/${product.name.toLowerCase()}`} className="block">
                <div className="relative bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-md md:shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 md:group-hover:-translate-y-3">
                  {/* Image Container */}
                  <div className="relative h-48 md:h-80 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                    />
                    
                    {/* Gradient Overlay on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${product.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block`} />
                    
                    {/* Logo Badge */}
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 w-8 h-8 md:w-12 md:h-12 bg-white rounded-lg md:rounded-xl flex items-center justify-center shadow-lg p-1.5 md:p-2 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                      <img 
                        src={logoColor} 
                        alt="Digitale" 
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Hover Content - Desktop Only */}
                    <div className="absolute inset-0 hidden md:flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                      <motion.div 
                        className="bg-white text-foreground px-6 py-3 rounded-full font-semibold shadow-xl flex items-center gap-2"
                      >
                        {t("products.viewMore")}
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6 bg-card relative">
                    {/* Decorative Line */}
                    <div className="absolute top-0 left-4 right-4 md:left-6 md:right-6 h-1 bg-gradient-to-r from-transparent via-accent to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 hidden md:block" />
                    
                    <h3 className="text-base md:text-xl font-bold text-foreground mb-1 md:mb-2 group-hover:text-accent transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 transition-colors duration-300 group-hover:text-foreground">
                      {t(product.description)}
                    </p>
                    
                    {/* Arrow indicator - Desktop Only */}
                    <div className="hidden md:flex mt-4 items-center gap-2 text-accent font-semibold text-sm">
                      <span className="transform transition-all duration-300 group-hover:mr-2">
                        {t("products.viewMore")}
                      </span>
                      <ArrowRight className="h-4 w-4 transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0" />
                    </div>
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
