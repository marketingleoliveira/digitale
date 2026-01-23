import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowRight, Search, ArrowUpDown, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
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

type SortOption = "display_order" | "name_asc" | "name_desc" | "weight_asc" | "weight_desc";

function FabricsContent() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("display_order");
  const [filters, setFilters] = useState<FilterState>({
    compositions: [],
    weights: [],
    applications: [],
  });

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
  const extractWeight = (fabric: typeof fabrics extends (infer T)[] | null ? T : never) => {
    const specs = fabric.specifications as Record<string, string> | null;
    const gramatura = specs?.gramatura || "";
    const match = gramatura.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

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
        case "display_order":
        default:
          return a.display_order - b.display_order;
      }
    });

    return result;
  }, [fabrics, searchQuery, filters, sortBy]);

  const clearSearch = () => {
    setSearchQuery("");
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
                  <SelectTrigger className="w-[200px] h-12">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="display_order">Padrão</SelectItem>
                    <SelectItem value="name_asc">Nome (A-Z)</SelectItem>
                    <SelectItem value="name_desc">Nome (Z-A)</SelectItem>
                    <SelectItem value="weight_asc">Gramatura (menor)</SelectItem>
                    <SelectItem value="weight_desc">Gramatura (maior)</SelectItem>
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/3] rounded-2xl" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : filteredAndSortedFabrics.length > 0 ? (
              <>
                {/* Results count */}
                <div className="mb-6 text-muted-foreground">
                  {filteredAndSortedFabrics.length} tecido{filteredAndSortedFabrics.length !== 1 ? "s" : ""} encontrado{filteredAndSortedFabrics.length !== 1 ? "s" : ""}
                  {searchQuery && (
                    <span className="ml-1">
                      para "<span className="font-medium text-foreground">{searchQuery}</span>"
                    </span>
                  )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredAndSortedFabrics.map((fabric, index) => (
                    <motion.div
                      key={fabric.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
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
                          
                          {/* Compare button */}
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <CompareButton fabric={fabric as any} />
                          </div>

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
                </div>
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
                    onClick={() => {
                      setSearchQuery("");
                      setFilters({ compositions: [], weights: [], applications: [] });
                    }}
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
    </div>
  );
}

export default function Fabrics() {
  return (
    <CompareProvider maxItems={3}>
      <FabricsContent />
    </CompareProvider>
  );
}
