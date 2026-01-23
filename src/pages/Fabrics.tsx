import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, ArrowUpDown, X, Loader2, Heart } from "lucide-react";
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

const ITEMS_PER_PAGE = 6;
const STORAGE_KEY = "fabrics_preferences";

type SortOption = "display_order" | "name_asc" | "name_desc" | "weight_asc" | "weight_desc" | "favorites";

interface StoredPreferences {
  sortBy: SortOption;
  filters: FilterState;
}

function loadPreferences(): StoredPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load preferences:", e);
  }
  return {
    sortBy: "display_order",
    filters: { compositions: [], weights: [], applications: [] },
  };
}

function savePreferences(prefs: StoredPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error("Failed to save preferences:", e);
  }
}

function FabricsContent() {
  const { t } = useLanguage();
  const { isFavorite, favoritesCount } = useFavorites();
  
  // Load initial preferences from localStorage
  const initialPrefs = useMemo(() => loadPreferences(), []);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>(initialPrefs.sortBy);
  const [filters, setFilters] = useState<FilterState>(initialPrefs.filters);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Save preferences when they change
  useEffect(() => {
    savePreferences({ sortBy, filters });
  }, [sortBy, filters]);

  // Reset visible count when filters/search/sort change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, sortBy, filters]);

  const { data: fabrics, isLoading } = useQuery({
    queryKey: ["fabrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabrics")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data;
    },
  });

  // Helper to extract weight number from gramatura string
  const extractWeight = useCallback((fabric: typeof fabrics extends (infer T)[] | null ? T : never) => {
    const specs = fabric.specifications as Record<string, string> | null;
    const gramatura = specs?.gramatura || "";
    const match = gramatura.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }, []);

  // Filter and sort fabrics
  const filteredAndSortedFabrics = useMemo(() => {
    if (!fabrics) return [];

    // First, filter by search query
    let result = fabrics.filter((fabric) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = fabric.name.toLowerCase().includes(query);
        const matchesDescription = fabric.short_description?.toLowerCase().includes(query) || false;
        const matchesApplications = fabric.applications?.some(app => 
          app.toLowerCase().includes(query)
        ) || false;
        
        if (!matchesName && !matchesDescription && !matchesApplications) {
          return false;
        }
      }

      // Check composition filter
      if (filters.compositions.length > 0) {
        const specs = fabric.specifications as Record<string, string> | null;
        const composition = specs?.composicao || specs?.composição;
        if (!composition || !filters.compositions.includes(composition)) {
          return false;
        }
      }

      // Check weight filter
      if (filters.weights.length > 0) {
        const specs = fabric.specifications as Record<string, string> | null;
        if (!specs?.gramatura || !filters.weights.includes(specs.gramatura)) {
          return false;
        }
      }

      // Check applications filter
      if (filters.applications.length > 0) {
        if (!fabric.applications || 
            !filters.applications.some((app) => fabric.applications?.includes(app))) {
          return false;
        }
      }

      return true;
    });

    // Then sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name, "pt-BR");
        case "name_desc":
          return b.name.localeCompare(a.name, "pt-BR");
        case "weight_asc":
          return extractWeight(a) - extractWeight(b);
        case "weight_desc":
          return extractWeight(b) - extractWeight(a);
        case "favorites":
          // Favorites first, then by display order
          const aFav = isFavorite(a.id) ? 0 : 1;
          const bFav = isFavorite(b.id) ? 0 : 1;
          if (aFav !== bFav) return aFav - bFav;
          return a.display_order - b.display_order;
        case "display_order":
        default:
          return a.display_order - b.display_order;
      }
    });

    return result;
  }, [fabrics, searchQuery, filters, sortBy, extractWeight, isFavorite]);

  // Paginated fabrics
  const visibleFabrics = useMemo(() => {
    return filteredAndSortedFabrics.slice(0, visibleCount);
  }, [filteredAndSortedFabrics, visibleCount]);

  const hasMore = visibleCount < filteredAndSortedFabrics.length;
  const remainingCount = filteredAndSortedFabrics.length - visibleCount;

  const loadMore = useCallback(() => {
    setIsLoadingMore(true);
    // Simulate loading delay for smooth UX with skeleton
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredAndSortedFabrics.length));
      setIsLoadingMore(false);
    }, 800);
  }, [filteredAndSortedFabrics.length]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({ compositions: [], weights: [], applications: [] });
    setSortBy("display_order");
  };

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

        {/* Fabrics Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {/* Search and Sort Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar tecidos por nome, descrição ou aplicação..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-10 h-12 text-base"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-[220px] h-12">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="display_order">Padrão</SelectItem>
                    <SelectItem value="name_asc">Nome (A-Z)</SelectItem>
                    <SelectItem value="name_desc">Nome (Z-A)</SelectItem>
                    <SelectItem value="weight_asc">Gramatura (menor)</SelectItem>
                    <SelectItem value="weight_desc">Gramatura (maior)</SelectItem>
                    {favoritesCount > 0 && (
                      <SelectItem value="favorites">
                        <span className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          Favoritos primeiro
                        </span>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filters */}
            {fabrics && fabrics.length > 0 && (
              <FabricFilters
                fabrics={fabrics as any}
                filters={filters}
                onFilterChange={setFilters}
              />
            )}

            {isLoading ? (
              <FabricSkeletonGrid count={6} />
            ) : visibleFabrics.length > 0 ? (
              <>
                {/* Results count */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Mostrando {visibleFabrics.length} de {filteredAndSortedFabrics.length} tecido{filteredAndSortedFabrics.length !== 1 ? "s" : ""}
                    {searchQuery && (
                      <span className="ml-1">
                        para "<span className="font-medium text-foreground">{searchQuery}</span>"
                      </span>
                    )}
                  </p>
                  {(sortBy !== "display_order" || filters.compositions.length > 0 || filters.weights.length > 0 || filters.applications.length > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-muted-foreground"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Limpar preferências
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <AnimatePresence mode="popLayout">
                    {visibleFabrics.map((fabric, index) => (
                      <motion.div
                        key={fabric.id}
                        layout
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ 
                          delay: Math.min(index, 5) * 0.1,
                          layout: { duration: 0.3 }
                        }}
                      >
                        <Link
                          to={`/tecidos/${fabric.slug}`}
                          className="group block bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
                        >
                          <div className="aspect-[4/3] overflow-hidden relative">
                            <img
                              src={fabric.image_url || defaultImages[fabric.slug] || fabricMilano}
                              alt={fabric.name}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            
                            {/* Action buttons */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <FavoriteButton 
                                fabric={fabric} 
                                size="sm"
                              />
                              <CompareButton fabric={fabric as any} />
                            </div>

                            {/* Favorite indicator when not hovering */}
                            {isFavorite(fabric.id) && (
                              <div className="absolute top-4 left-4 group-hover:opacity-0 transition-opacity">
                                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
                                  <Heart className="h-4 w-4 text-white fill-white" />
                                </div>
                              </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                              <span className="inline-flex items-center gap-2 bg-white text-foreground px-4 py-2 rounded-full font-semibold text-sm">
                                Ver detalhes
                                <ArrowRight className="h-4 w-4" />
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                              {fabric.name}
                            </h3>
                            <p className="text-muted-foreground mt-2 line-clamp-2">
                              {fabric.short_description}
                            </p>
                            {fabric.applications && fabric.applications.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {fabric.applications.slice(0, 3).map((app: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1 bg-secondary text-foreground rounded-full text-xs font-medium"
                                  >
                                    {app}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Loading more skeleton */}
                {isLoadingMore && (
                  <LoadingMoreSkeleton count={Math.min(remainingCount, ITEMS_PER_PAGE)} />
                )}

                {/* Load More Button */}
                {hasMore && !isLoadingMore && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center mt-12"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={loadMore}
                      className="min-w-[200px]"
                    >
                      Carregar mais ({remainingCount} restante{remainingCount !== 1 ? "s" : ""})
                    </Button>
                  </motion.div>
                )}

                {/* Progress indicator */}
                {filteredAndSortedFabrics.length > ITEMS_PER_PAGE && (
                  <div className="mt-8">
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-accent"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${(visibleCount / filteredAndSortedFabrics.length) * 100}%` 
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      {Math.round((visibleCount / filteredAndSortedFabrics.length) * 100)}% carregado
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-lg">
                  {searchQuery 
                    ? `Nenhum tecido encontrado para "${searchQuery}".`
                    : fabrics && fabrics.length > 0 
                      ? "Nenhum tecido corresponde aos filtros selecionados." 
                      : "Nenhum tecido disponível no momento."
                  }
                </p>
                {(searchQuery || filters.compositions.length > 0 || filters.weights.length > 0 || filters.applications.length > 0) && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={clearAllFilters}
                  >
                    Limpar busca e filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Compare components */}
      <CompareFloatingBar />
      <CompareModal defaultImages={defaultImages} />

      {/* Favorites drawer */}
      <FavoritesDrawer defaultImages={defaultImages} />
    </div>
  );
}

export default function Fabrics() {
  return (
    <FavoritesProvider>
      <CompareProvider maxItems={3}>
        <FabricsContent />
      </CompareProvider>
    </FavoritesProvider>
  );
}
