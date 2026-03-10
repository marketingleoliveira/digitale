import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface PrintCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
}

interface Print {
  id: string;
  code: string;
  name: string | null;
  image_url: string;
  category_id: string | null;
}

const PrintsCatalog = () => {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [activeSubcategory, setActiveSubcategory] = useState<Record<string, string | null>>({});

  // Fetch categories
  // Fetch all categories (parents + subcategories)
  const { data: allCategories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["print-categories-catalog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("print_categories")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as PrintCategory[];
    },
  });

  // Separate parent categories and subcategories
  const categories = allCategories?.filter((c) => !c.parent_id) || [];
  const getSubcategories = (parentId: string) => {
    return allCategories?.filter((c) => c.parent_id === parentId) || [];
  };

  // Fetch all prints
  const { data: prints, isLoading: printsLoading } = useQuery({
    queryKey: ["prints-catalog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prints")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Print[];
    },
  });

  // Group prints by category
  const getPrintsByCategory = (categoryId: string) => {
    return prints?.filter((p) => p.category_id === categoryId) || [];
  };

  // Get uncategorized prints
  const uncategorizedPrints = prints?.filter((p) => !p.category_id) || [];

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const isLoading = categoriesLoading || printsLoading;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 md:py-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-accent font-medium text-sm uppercase tracking-wider">
              Catálogo Completo
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Todas as Estampas
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore nosso catálogo completo de estampas organizadas por categoria
            </p>
          </motion.div>

          {isLoading ? (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-12 w-48 mb-4" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <Skeleton key={j} className="aspect-square rounded-lg" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Categories with prints */}
               {categories?.map((category, index) => {
                const categoryPrints = getPrintsByCategory(category.id);
                const subcategories = getSubcategories(category.id);
                const totalPrints = categoryPrints.length + subcategories.reduce((acc, sub) => acc + getPrintsByCategory(sub.id).length, 0);
                if (totalPrints === 0) return null;

                const isOpen = openCategories.includes(category.id);

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Collapsible open={isOpen} onOpenChange={() => toggleCategory(category.id)}>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-6 h-auto bg-muted/50 hover:bg-muted rounded-xl mb-4"
                        >
                          <div className="flex items-center gap-4">
                            {category.image_url && (
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div className="text-left">
                              <h2 className="text-xl font-semibold text-foreground">
                                {category.name}
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                {totalPrints} estampa{totalPrints !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {/* Subcategory filter buttons */}
                        {subcategories.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {categoryPrints.length > 0 && (
                              <Button
                                size="sm"
                                variant={activeSubcategory[category.id] === null || activeSubcategory[category.id] === undefined ? "default" : "outline"}
                                onClick={() => setActiveSubcategory((prev) => ({ ...prev, [category.id]: null }))}
                                className="rounded-full text-xs"
                              >
                                Todas
                              </Button>
                            )}
                            {subcategories.map((sub) => {
                              const subPrints = getPrintsByCategory(sub.id);
                              if (subPrints.length === 0) return null;
                              return (
                                <Button
                                  key={sub.id}
                                  size="sm"
                                  variant={activeSubcategory[category.id] === sub.id ? "default" : "outline"}
                                  onClick={() => setActiveSubcategory((prev) => ({ ...prev, [category.id]: sub.id }))}
                                  className="rounded-full text-xs"
                                >
                                  {sub.name} ({subPrints.length})
                                </Button>
                              );
                            })}
                          </div>
                        )}

                        {/* Show prints based on active subcategory selection */}
                        {(() => {
                          const activeSub = activeSubcategory[category.id];
                          const printsToShow = activeSub
                            ? getPrintsByCategory(activeSub)
                            : subcategories.length > 0 && categoryPrints.length === 0
                              ? [] // no selection yet, show nothing
                              : categoryPrints; // no subcategories or "Todas" selected

                          if (printsToShow.length === 0 && !activeSub && subcategories.length > 0) {
                            return (
                              <p className="text-sm text-muted-foreground text-center py-6">
                                Selecione uma subcategoria acima para ver as estampas.
                              </p>
                            );
                          }

                          return (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-6">
                              {printsToShow.map((print) => (
                                <motion.div
                                  key={print.id}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                                >
                                  <img
                                    src={print.image_url}
                                    alt={print.name || `Estampa ${print.code}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="text-center text-white">
                                      <p className="text-xs font-medium mb-1">Cód:</p>
                                      <p className="text-sm font-bold">{print.code}</p>
                                      {print.name && (
                                        <p className="text-xs mt-1 text-white/80">{print.name}</p>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          );
                        })()}
                      </CollapsibleContent>
                    </Collapsible>
                  </motion.div>
                );
              })}

              {/* Uncategorized prints */}
              {uncategorizedPrints.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Collapsible
                    open={openCategories.includes("uncategorized")}
                    onOpenChange={() => toggleCategory("uncategorized")}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-6 h-auto bg-muted/50 hover:bg-muted rounded-xl mb-4"
                      >
                        <div className="text-left">
                          <h2 className="text-xl font-semibold text-foreground">
                            Outras Estampas
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {uncategorizedPrints.length} estampa{uncategorizedPrints.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                            openCategories.includes("uncategorized") ? "rotate-180" : ""
                          }`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-6">
                        {uncategorizedPrints.map((print) => (
                          <motion.div
                            key={print.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                          >
                            <img
                              src={print.image_url}
                              alt={print.name || `Estampa ${print.code}`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="text-center text-white">
                                <p className="text-xs font-medium mb-1">Cód:</p>
                                <p className="text-sm font-bold">{print.code}</p>
                                {print.name && (
                                  <p className="text-xs mt-1 text-white/80">{print.name}</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              )}

              {/* Empty state */}
              {(!categories || categories.length === 0) && uncategorizedPrints.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="text-lg">Nenhuma estampa cadastrada ainda.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrintsCatalog;
