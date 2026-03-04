import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronRight, Newspaper, Filter } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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
  radar_categories: RadarCategory | null;
}

const RadarDigitale = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEdition, setSelectedEdition] = useState<string | null>(null);

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

  const filteredEditions = selectedCategory
    ? editions.filter((e) => e.category_id === selectedCategory)
    : editions;

  const activeEdition = selectedEdition
    ? editions.find((e) => e.id === selectedEdition)
    : filteredEditions[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <Newspaper className="h-6 w-6 text-accent" />
                <span className="text-accent font-medium tracking-wider text-sm uppercase">Newsletter</span>
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold mb-4">
                <span className="text-accent">radar</span>digitale
              </h1>
              <p className="text-primary-foreground/70 text-lg">
                Fique por dentro das tendências, novidades e inovações do mercado têxtil.
              </p>
            </motion.div>
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
                      {categories.map((cat) => (
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
                            <p className={`text-sm font-medium truncate ${
                              activeEdition?.id === edition.id ? "text-accent" : "text-foreground"
                            }`}>
                              {edition.title}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground">
                                {new Date(edition.edition_date).toLocaleDateString("pt-BR", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
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
                      </div>
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                        {activeEdition.title}
                      </h2>
                      {activeEdition.description && (
                        <p className="text-muted-foreground mt-2">{activeEdition.description}</p>
                      )}
                    </div>

                    {/* Edition Content - embedded file */}
                    <div className="p-4 md:p-6">
                      {activeEdition.file_url.endsWith(".pdf") ? (
                        <iframe
                          src={activeEdition.file_url}
                          className="w-full rounded-xl border border-border"
                          style={{ height: "80vh", minHeight: "600px" }}
                          title={activeEdition.title}
                        />
                      ) : (
                        <img
                          src={activeEdition.file_url}
                          alt={activeEdition.title}
                          className="w-full rounded-xl object-contain max-h-[80vh]"
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
