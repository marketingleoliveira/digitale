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
import fabricOceanic from "@/assets/fabric-oceanic.jpg";
import fabricOceanicEco from "@/assets/fabric-oceanic-eco.jpg";
import fabricSoftskin from "@/assets/fabric-softskin.jpg";
import fabricIntense from "@/assets/fabric-intense.jpg";
import fabricCorsega from "@/assets/fabric-corsega.jpg";
import fabricVelocity from "@/assets/fabric-velocity.jpg";
import fabricFlow from "@/assets/fabric-flow.jpg";
import fabricCaribe from "@/assets/fabric-caribe.jpg";
import fabricParis from "@/assets/fabric-paris.jpg";

// Default images mapping by slug
const defaultImages: Record<string, string> = {
  milano: fabricMilano,
  lyon: fabricLyon,
  aerodry: fabricAerodry,
  veneza: fabricVeneza,
  oceanic: fabricOceanic,
  "oceanic-eco": fabricOceanicEco,
  softskin: fabricSoftskin,
  intense: fabricIntense,
  corsega: fabricCorsega,
  velocity: fabricVelocity,
  flow: fabricFlow,
  caribe: fabricCaribe,
  paris: fabricParis,
};

// Helper function to get fabric image
const getFabricImage = (fabric: { slug?: string; image_url?: string | null }) => {
  if (fabric.image_url) return fabric.image_url;
  if (fabric.slug && defaultImages[fabric.slug]) return defaultImages[fabric.slug];
  return fabricMilano;
};

const fallbackFabrics = [
  { name: "Milano", slug: "milano", image_url: fabricMilano, short_description: "Tecido de alta compressão, ideal para leggings e shorts fitness." },
  { name: "Lyon", slug: "lyon", image_url: fabricLyon, short_description: "Malha com toque suave e caimento perfeito." },
  { name: "Aerodry", slug: "aerodry", image_url: fabricAerodry, short_description: "Tecnologia dry fit avançada com secagem ultra-rápida." },
  { name: "Veneza", slug: "veneza", image_url: fabricVeneza, short_description: "Acabamento acetinado premium com brilho sofisticado." },
];

export function Products() {
  const { t } = useLanguage();

  const { data: fabrics, isLoading: fabricsLoading } = useQuery({
    queryKey: ["featured-fabrics-home"],
    queryFn: async () => {
      const { data: featuredData, error: featuredError } = await supabase
        .from("fabrics")
        .select("id, name, slug, image_url, short_description")
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("display_order", { ascending: true })
        .limit(4);
      
      if (featuredError) throw featuredError;
      
      if (featuredData && featuredData.length > 0) {
        return featuredData;
      }
      
      const { data, error } = await supabase
        .from("fabrics")
        .select("id, name, slug, image_url, short_description")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data;
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
  });

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
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
  });

  const displayFabrics = fabrics && fabrics.length > 0 ? fabrics : fallbackFabrics;

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Fabrics Section */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="section-title">Últimos Tecidos</h2>
        </div>

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
              <div
                key={fabric.slug || index}
                className="group"
              >
                <Link to={`/tecidos/${fabric.slug}`} className="block">
                  <div className="relative bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
                    {/* Image Container */}
                    <div className="relative h-48 md:h-72 overflow-hidden">
                      <img
                        src={getFabricImage(fabric)}
                        alt={fabric.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Logo Badge */}
                      <div className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center shadow-lg p-1.5 transition-transform duration-300 group-hover:scale-110">
                        <img 
                          src={logoColor} 
                          alt="Digitale" 
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Hover Content */}
                      <div className="absolute inset-0 hidden md:flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
              </div>
            ))}
          </div>
        )}

        {/* Prints Section */}
        <div className="text-center mb-10 md:mb-12 mt-16 md:mt-20">
          <h2 className="section-title">Últimas Estampas</h2>
        </div>

        {/* Prints Grid */}
        {printsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 mb-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : prints && prints.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 mb-8">
            {prints.map((print) => (
              <div
                key={print.id}
                className="group relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              >
                <img
                  src={print.image_url}
                  alt={print.name || print.code}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-3">
                  <span className="text-white font-bold text-sm md:text-base">{print.code}</span>
                  {print.name && (
                    <span className="text-white/80 text-xs">{print.name}</span>
                  )}
                </div>
              </div>
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
