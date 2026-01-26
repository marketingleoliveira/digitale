import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logoColor from "@/assets/logo-color.png";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback images
import fabricMilano from "@/assets/fabric-milano.jpg";
import fabricLyon from "@/assets/fabric-lyon.jpg";
import fabricAerodry from "@/assets/fabric-aerodry.jpg";
import fabricVeneza from "@/assets/fabric-veneza.jpg";

const fallbackFabrics = [
  { name: "Milano", slug: "milano", image_url: fabricMilano, short_description: "Tecido de alta compressão, ideal para leggings e shorts fitness." },
  { name: "Lyon", slug: "lyon", image_url: fabricLyon, short_description: "Malha com toque suave e caimento perfeito." },
  { name: "Aerodry", slug: "aerodry", image_url: fabricAerodry, short_description: "Tecnologia dry fit avançada com secagem ultra-rápida." },
  { name: "Veneza", slug: "veneza", image_url: fabricVeneza, short_description: "Acabamento acetinado premium com brilho sofisticado." },
];

export function Products() {
  const { t } = useLanguage();

  // Fetch latest fabrics from database
  const { data: fabrics, isLoading: fabricsLoading } = useQuery({
    queryKey: ["latest-fabrics-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabrics")
        .select("id, name, slug, image_url, short_description")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch latest prints from database
  const { data: prints, isLoading: printsLoading } = useQuery({
    queryKey: ["latest-prints-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prints")
        .select("id, code, name, image_url")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  const displayFabrics = fabrics && fabrics.length > 0 ? fabrics : fallbackFabrics;

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Fabrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="section-title">Últimos Lançamentos</h2>
          <span className="inline-block mt-3 text-accent font-semibold text-sm md:text-base tracking-wide uppercase">Tecidos</span>
        </motion.div>

        {/* Fabrics Grid */}
        {fabricsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 md:h-72 rounded-xl" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {displayFabrics.map((fabric, index) => (
              <motion.div
                key={fabric.slug || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/tecidos/${fabric.slug}`} className="block">
                  <div className="relative bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-md transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-2">
                    {/* Image Container */}
                    <div className="relative h-48 md:h-72 overflow-hidden">
                      <img
                        src={fabric.image_url}
                        alt={fabric.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Logo Badge */}
                      <div className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center shadow-lg p-1.5 transition-transform duration-500 group-hover:scale-110">
                        <img 
                          src={logoColor} 
                          alt="Digitale" 
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Hover Content */}
                      <div className="absolute inset-0 hidden md:flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <div className="bg-white text-foreground px-5 py-2.5 rounded-full font-semibold shadow-xl flex items-center gap-2 text-sm">
                          {t("products.viewMore")}
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 md:p-5 bg-card">
                      <h3 className="text-sm md:text-lg font-bold text-foreground mb-1 group-hover:text-accent transition-colors duration-300">
                        {fabric.name}
                      </h3>
                      <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">
                        {fabric.short_description}
                      </p>
                      
                      {/* Arrow indicator */}
                      <div className="hidden md:flex mt-3 items-center gap-2 text-accent font-semibold text-sm">
                        <span>{t("products.viewMore")}</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}


        {/* Prints Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-12 mt-16 md:mt-20"
        >
          <h2 className="section-title">Últimos Lançamentos</h2>
          <span className="inline-block mt-3 text-accent font-semibold text-sm md:text-base tracking-wide uppercase">Estampas</span>
        </motion.div>

        {/* Prints Grid */}
        {printsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 mb-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : prints && prints.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 mb-8">
            {prints.map((print, index) => (
              <motion.div
                key={print.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <img
                  src={print.image_url}
                  alt={print.name || print.code}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-3">
                  <span className="text-white font-bold text-sm md:text-base">{print.code}</span>
                  {print.name && (
                    <span className="text-white/80 text-xs">{print.name}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p>Nenhuma estampa cadastrada ainda.</p>
          </div>
        )}

      </div>
    </section>
  );
}
