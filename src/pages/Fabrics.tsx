import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, ArrowUpDown, X, Heart, ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FabricFilters, FilterState } from "@/components/fabric/FabricFilters";
import { 
  CompareProvider, 
  CompareButton, 
  CompareFloatingBar, 
  CompareModal 
} from "@/components/fabric/FabricCompare";
import { FavoriteButton } from "@/components/fabric/FavoriteButton";
import { FavoritesDrawer } from "@/components/fabric/FavoritesDrawer";
import { FabricSkeletonGrid, LoadingMoreSkeleton } from "@/components/fabric/FabricSkeleton";
import { FavoritesProvider, useFavorites } from "@/contexts/FavoritesContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import fabricMilano from "@/assets/fabric-milano.jpg";
import fabricLyon from "@/assets/fabric-lyon.jpg";
import fabricAerodry from "@/assets/fabric-aerodry.jpg";
import fabricVeneza from "@/assets/fabric-veneza.jpg";

const defaultImages: Record<string, string> = {
  milano: fabricMilano,
  lyon: fabricLyon,
  aerodry: fabricAerodry,
  veneza: fabricVeneza,
};

function FabricsContent() {
  const { t } = useLanguage();
  const { isFavorite } = useFavorites();
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["fabric-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabric_categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data;
    },
  });

  // Fetch fabrics
  const { data: fabrics, isLoading: fabricsLoading } = useQuery({
    queryKey: ["fabrics-with-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabrics")
        .select("*, fabric_categories(id, name, slug)")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data;
    },
  });

  // Auto-expand all categories on load
  useEffect(() => {
    if (categories) {
      setExpandedCategories(categories.map(c => c.id));
    }
  }, [categories]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Group fabrics by category
  const fabricsByCategory = useMemo(() => {
    if (!fabrics || !categories) return new Map();
    
    const grouped = new Map<string, typeof fabrics>();
    
    categories.forEach(category => {
      const categoryFabrics = fabrics.filter(f => f.category_id === category.id);
      if (categoryFabrics.length > 0) {
        grouped.set(category.id, categoryFabrics);
      }
    });
    
    return grouped;
  }, [fabrics, categories]);

  const isLoading = categoriesLoading || fabricsLoading;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-accent font-semibold uppercase tracking-widest text-sm">
                {t("products.label")}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                Nossos Tecidos
              </h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Conheça nossa linha completa de tecidos de alta performance para moda esportiva e fitness.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {isLoading ? (
              <FabricSkeletonGrid count={6} />
            ) : categories && categories.length > 0 ? (
              <div className="space-y-8">
                {categories.map((category, categoryIndex) => {
                  const categoryFabrics = fabricsByCategory.get(category.id) || [];
                  const isExpanded = expandedCategories.includes(category.id);
                  
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: categoryIndex * 0.1 }}
                    >
                      <Collapsible
                        open={isExpanded}
                        onOpenChange={() => toggleCategory(category.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <button className="w-full flex items-center justify-between p-5 bg-card rounded-xl border border-border hover:border-accent/30 transition-all group">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center text-white font-bold text-lg">
                                {category.name.charAt(0)}
                              </div>
                              <div className="text-left">
                                <h2 className="text-xl md:text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                                  {category.name}
                                </h2>
                                {category.description && (
                                  <p className="text-muted-foreground text-sm mt-1">
                                    {category.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                                {categoryFabrics.length} tecido{categoryFabrics.length !== 1 ? 's' : ''}
                              </span>
                              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </button>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                            {categoryFabrics.map((fabric, index) => (
                              <motion.div
                                key={fabric.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Link
                                  to={`/tecidos/${fabric.slug}`}
                                  className="group block bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                                >
                                  <div className="aspect-[4/3] overflow-hidden relative">
                                    <img
                                      src={fabric.image_url || defaultImages[fabric.slug] || fabricMilano}
                                      alt={fabric.name}
                                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    {/* Action buttons */}
                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <FavoriteButton 
                                        fabric={fabric} 
                                        size="sm"
                                      />
                                      <CompareButton fabric={fabric as any} />
                                    </div>

                                    {/* Favorite indicator */}
                                    {isFavorite(fabric.id) && (
                                      <div className="absolute top-3 left-3 group-hover:opacity-0 transition-opacity">
                                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                                          <Heart className="h-4 w-4 text-white fill-white" />
                                        </div>
                                      </div>
                                    )}

                                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                      <span className="inline-flex items-center gap-2 bg-white text-foreground px-4 py-2 rounded-full font-semibold text-sm">
                                        Ver detalhes
                                        <ArrowRight className="h-4 w-4" />
                                      </span>
                                    </div>
                                  </div>
                                  <div className="p-5">
                                    <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
                                      {fabric.name}
                                    </h3>
                                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                                      {fabric.short_description}
                                    </p>
                                  </div>
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                  Nenhuma categoria de tecido encontrada.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      
      {/* Compare Components */}
      <CompareFloatingBar />
      <CompareModal defaultImages={defaultImages} />
      <FavoritesDrawer defaultImages={defaultImages} />
    </div>
  );
}

const Fabrics = () => {
  return (
    <FavoritesProvider>
      <CompareProvider>
        <FabricsContent />
      </CompareProvider>
    </FavoritesProvider>
  );
};

export default Fabrics;
