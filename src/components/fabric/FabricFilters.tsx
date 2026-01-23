import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Fabric {
  id: string;
  name: string;
  specifications: unknown;
  applications: string[] | null;
  features: unknown[] | null;
}

interface FabricFiltersProps {
  fabrics: Fabric[];
  onFilterChange: (filters: FilterState) => void;
  filters: FilterState;
}

export interface FilterState {
  compositions: string[];
  weights: string[];
  applications: string[];
}

export function FabricFilters({ fabrics, onFilterChange, filters }: FabricFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Extract unique filter options from fabrics
  const filterOptions = useMemo(() => {
    const compositions = new Set<string>();
    const weights = new Set<string>();
    const applications = new Set<string>();

    fabrics.forEach((fabric) => {
      // Extract composition from specifications
      if (fabric.specifications) {
        const specs = fabric.specifications as Record<string, string>;
        if (specs.composicao || specs.composição) {
          compositions.add(specs.composicao || specs.composição);
        }
        if (specs.gramatura) {
          weights.add(specs.gramatura);
        }
      }

      // Extract applications
      if (fabric.applications) {
        fabric.applications.forEach((app) => applications.add(app));
      }
    });

    return {
      compositions: Array.from(compositions),
      weights: Array.from(weights),
      applications: Array.from(applications),
    };
  }, [fabrics]);

  const toggleFilter = (type: keyof FilterState, value: string) => {
    const current = filters[type];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    
    onFilterChange({ ...filters, [type]: updated });
  };

  const clearAllFilters = () => {
    onFilterChange({ compositions: [], weights: [], applications: [] });
  };

  const activeFiltersCount = 
    filters.compositions.length + filters.weights.length + filters.applications.length;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mb-8">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-lg font-semibold text-foreground"
        >
          <Filter className="h-5 w-5 text-accent" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 ml-2" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2" />
          )}
        </button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar filtros
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-border">
              {/* Composition Filter */}
              {filterOptions.compositions.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-3">Composição</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.compositions.map((comp) => (
                      <button
                        key={comp}
                        onClick={() => toggleFilter("compositions", comp)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          filters.compositions.includes(comp)
                            ? "bg-accent text-white"
                            : "bg-secondary text-foreground hover:bg-accent/20"
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Weight Filter */}
              {filterOptions.weights.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-3">Gramatura</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.weights.map((weight) => (
                      <button
                        key={weight}
                        onClick={() => toggleFilter("weights", weight)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          filters.weights.includes(weight)
                            ? "bg-accent text-white"
                            : "bg-secondary text-foreground hover:bg-accent/20"
                        }`}
                      >
                        {weight}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications Filter */}
              {filterOptions.applications.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-3">Aplicação</h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.applications.map((app) => (
                      <button
                        key={app}
                        onClick={() => toggleFilter("applications", app)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          filters.applications.includes(app)
                            ? "bg-accent text-white"
                            : "bg-secondary text-foreground hover:bg-accent/20"
                        }`}
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filters display */}
      {activeFiltersCount > 0 && !isExpanded && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.compositions.map((f) => (
            <Badge key={f} variant="secondary" className="gap-1">
              {f}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter("compositions", f)} />
            </Badge>
          ))}
          {filters.weights.map((f) => (
            <Badge key={f} variant="secondary" className="gap-1">
              {f}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter("weights", f)} />
            </Badge>
          ))}
          {filters.applications.map((f) => (
            <Badge key={f} variant="secondary" className="gap-1">
              {f}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFilter("applications", f)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
