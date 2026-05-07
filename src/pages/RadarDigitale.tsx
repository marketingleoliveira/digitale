import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SEO } from "@/components/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight, Newspaper, Filter, Eye, Sparkles, X, Heart } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PdfViewer } from "@/components/radar/PdfViewer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import radarHeader from "@/assets/radar-header.png";

interface RadarCategory {
  id: string;
  name: string;
  slug: string;
}

interface RadarEdition {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  edition_date: string;
  cover_image_url: string | null;
  file_url: string;
  description: string | null;
  views: number;
  likes: number;
  radar_categories: RadarCategory | null;
}

const getViewCount = (edition: RadarEdition): number => {
  return edition.views ?? 0;
};

const formatViews = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return n.toString();
};


const RadarDigitale = () => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEdition, setSelectedEdition] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [likedEditions, setLikedEditions] = useState<Set<string>>(new Set());

  const { data: categories = [] } = useQuery({
    queryKey: ["radar-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("radar_categories")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as RadarCategory[];
    },
  });

  const { data: editions = [], isLoading } = useQuery({
    queryKey: ["radar-editions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("radar_editions")
        .select("*, radar_categories(*)")
        .order("edition_date", { ascending: false });
      if (error) throw error;
      return data as RadarEdition[];
    },
  });

  // Only show categories that have at least one edition
  const categoriesWithEditions = categories.filter((cat) =>
    editions.some((e) => e.category_id === cat.id)
  );

  // The "first" edition in the admin order — gets the NOVO badge
  const firstEditionId = editions[0]?.id;

  const filteredEditions = useMemo(() => {
    let result = editions;
    if (selectedCategory) {
      result = result.filter((e) => e.category_id === selectedCategory);
    }
    if (dateFrom) {
      result = result.filter((e) => new Date(e.edition_date) >= dateFrom);
    }
    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      result = result.filter((e) => new Date(e.edition_date) <= endOfDay);
    }
    return result;
  }, [editions, selectedCategory, dateFrom, dateTo]);

  const activeEdition = selectedEdition
    ? editions.find((e) => e.id === selectedEdition)
    : filteredEditions[0];

  const likeMutation = useMutation({
    mutationFn: async (editionId: string) => {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/radar-like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
          body: JSON.stringify({ edition_id: editionId }),
        }
      );
      if (!res.ok) throw new Error("Erro ao curtir");
      return res.json();
    },
    onSuccess: (data, editionId) => {
      setLikedEditions((prev) => {
        const next = new Set(prev);
        if (data.liked) next.add(editionId);
        else next.delete(editionId);
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ["radar-editions"] });
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SEO title="Radar Digitale – Tendências de Moda e Tecidos" description="Radar Digitale: tendências de moda, comportamento e inovações em tecidos para inspirar suas próximas coleções." keywords="tendências de moda, tendências têxteis, radar de moda, inovação têxtil, fashion trends Brasil" />
      <main>
        {/* Hero */}
        <section className="bg-white py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center gap-4">
            <img
              src={radarHeader}
              alt="Radar Digitale - Boletim Informativo"
              className="max-w-full h-auto max-h-[200px] md:max-h-[280px] object-contain"
            />
            {editions.length > 0 && (
              <p className="text-muted-foreground text-sm md:text-base font-medium">
                Tivemos + de{" "}
                <span className="text-accent font-bold text-lg md:text-xl">
                  {formatViews(editions.reduce((sum, e) => sum + getViewCount(e), 0))}
                </span>{" "}
                leitores
              </p>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <aside className="lg:w-72 flex-shrink-0">
                <div className="sticky top-24 space-y-6">
                  {/* Category Filter */}
                  <div className="bg-card rounded-2xl border border-border p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Filter className="h-4 w-4 text-accent" />
                      <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Categorias</h3>
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => { setSelectedCategory(null); setSelectedEdition(null); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          !selectedCategory
                            ? "bg-accent text-accent-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        Todas as edições
                      </button>
                      {categoriesWithEditions.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCategory(cat.id); setSelectedEdition(null); }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedCategory === cat.id
                              ? "bg-accent text-accent-foreground font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Filter */}
                  <div className="bg-card rounded-2xl border border-border p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-4 w-4 text-accent" />
                      <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Filtrar por data</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">De</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left text-sm font-normal h-9", !dateFrom && "text-muted-foreground")}>
                              <Calendar className="mr-2 h-3.5 w-3.5" />
                              {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Selecionar"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} locale={ptBR} initialFocus className="p-3 pointer-events-auto" />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Até</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left text-sm font-normal h-9", !dateTo && "text-muted-foreground")}>
                              <Calendar className="mr-2 h-3.5 w-3.5" />
                              {dateTo ? format(dateTo, "dd/MM/yyyy") : "Selecionar"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} locale={ptBR} initialFocus className="p-3 pointer-events-auto" />
                          </PopoverContent>
                        </Popover>
                      </div>
                      {(dateFrom || dateTo) && (
                        <button
                          onClick={() => { setDateFrom(undefined); setDateTo(undefined); }}
                          className="flex items-center gap-1 text-xs text-accent hover:underline"
                        >
                          <X className="h-3 w-3" /> Limpar filtro
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Editions List */}
                  <div className="bg-card rounded-2xl border border-border p-5">
                    <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider mb-4">
                      Edições
                    </h3>
                    <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
                      {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))
                      ) : filteredEditions.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-2">
                          Nenhuma edição encontrada.
                        </p>
                      ) : (
                        filteredEditions.map((edition) => (
                          <button
                            key={edition.id}
                            onClick={() => setSelectedEdition(edition.id)}
                            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors group ${
                              activeEdition?.id === edition.id
                                ? "bg-accent/10 border border-accent/20"
                                : "hover:bg-muted"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-medium truncate ${
                                activeEdition?.id === edition.id ? "text-accent" : "text-foreground"
                              }`}>
                                {edition.title}
                              </p>
                              {edition.id === firstEditionId && (
                                <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0 shrink-0 animate-pulse">
                                  <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                                  NOVO
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">
                                {new Date(edition.edition_date).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                {formatViews(getViewCount(edition))}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Heart className={`h-3 w-3 ${likedEditions.has(edition.id) ? "fill-red-500 text-red-500" : ""}`} />
                                {formatViews(edition.likes ?? 0)}
                              </span>
                              {edition.radar_categories && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  {edition.radar_categories.name}
                                </Badge>
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Content - Edition Viewer */}
              <div className="flex-1 min-w-0">
                {isLoading ? (
                  <div className="bg-card rounded-2xl border border-border p-8">
                    <Skeleton className="h-8 w-2/3 mb-4" />
                    <Skeleton className="h-4 w-1/3 mb-8" />
                    <Skeleton className="h-[600px] w-full rounded-xl" />
                  </div>
                ) : !activeEdition ? (
                  <div className="bg-card rounded-2xl border border-border p-12 text-center">
                    <Newspaper className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Nenhuma edição disponível
                    </h2>
                    <p className="text-muted-foreground">
                      Em breve teremos novidades por aqui!
                    </p>
                  </div>
                ) : (
                  <motion.div
                    key={activeEdition.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-2xl border border-border overflow-hidden"
                  >
                    {/* Edition Header */}
                    <div className="p-6 md:p-8 border-b border-border">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        {activeEdition.radar_categories && (
                          <Badge className="bg-accent text-accent-foreground">
                            {activeEdition.radar_categories.name}
                          </Badge>
                        )}
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Edição {new Date(activeEdition.edition_date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                          <Eye className="h-4 w-4" />
                          <span>{formatViews(getViewCount(activeEdition))} leituras</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => likeMutation.mutate(activeEdition.id)}
                          disabled={likeMutation.isPending}
                          className={cn(
                            "gap-2 transition-all",
                            likedEditions.has(activeEdition.id)
                              ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                              : "hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                          )}
                        >
                          <Heart className={cn("h-4 w-4", likedEditions.has(activeEdition.id) && "fill-red-500")} />
                          Curtir · {formatViews(activeEdition.likes ?? 0)}
                        </Button>
                      </div>
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                        {activeEdition.title}
                      </h2>
                      {activeEdition.description && (
                        <p className="text-muted-foreground mt-2">{activeEdition.description}</p>
                      )}
                    </div>

                    {/* Edition Content - embedded file */}
                    <div>
                      {activeEdition.file_url.endsWith(".pdf") ? (
                        <PdfViewer url={activeEdition.file_url} title={activeEdition.title} />
                      ) : (
                        <img
                          src={activeEdition.file_url}
                          alt={activeEdition.title}
                          className="w-full object-cover"
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RadarDigitale;
