import { useState, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Scale, Check, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface Fabric {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  image_url: string | null;
  features: unknown[] | null;
  specifications: Record<string, string> | null;
  applications: string[] | null;
}

interface CompareContextType {
  compareList: Fabric[];
  addToCompare: (fabric: Fabric) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  maxItems: number;
}

const CompareContext = createContext<CompareContextType | null>(null);

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}

interface CompareProviderProps {
  children: ReactNode;
  maxItems?: number;
}

export function CompareProvider({ children, maxItems = 3 }: CompareProviderProps) {
  const [compareList, setCompareList] = useState<Fabric[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const addToCompare = (fabric: Fabric) => {
    if (compareList.length >= maxItems) return;
    if (compareList.some((f) => f.id === fabric.id)) return;
    setCompareList([...compareList, fabric]);
  };

  const removeFromCompare = (id: string) => {
    setCompareList(compareList.filter((f) => f.id !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsCompareOpen(false);
  };

  const isInCompare = (id: string) => compareList.some((f) => f.id === id);

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareOpen,
        setIsCompareOpen,
        maxItems,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

interface CompareButtonProps {
  fabric: Fabric;
  className?: string;
}

export function CompareButton({ fabric, className = "" }: CompareButtonProps) {
  const { addToCompare, removeFromCompare, isInCompare, compareList, maxItems } = useCompare();
  const isAdded = isInCompare(fabric.id);
  const isFull = compareList.length >= maxItems;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdded) {
      removeFromCompare(fabric.id);
    } else if (!isFull) {
      addToCompare(fabric);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isFull && !isAdded}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
        ${isAdded 
          ? "bg-accent text-white" 
          : isFull 
            ? "bg-muted text-muted-foreground cursor-not-allowed" 
            : "bg-white/90 text-foreground hover:bg-accent hover:text-white"
        }
        ${className}
      `}
    >
      {isAdded ? (
        <>
          <Check className="h-4 w-4" />
          Comparar
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          Comparar
        </>
      )}
    </button>
  );
}

export function CompareFloatingBar() {
  const { compareList, removeFromCompare, clearCompare, setIsCompareOpen, isCompareOpen } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-card border border-border shadow-2xl rounded-2xl p-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-accent" />
            <span className="font-medium text-foreground">
              {compareList.length} tecido{compareList.length > 1 ? "s" : ""} selecionado{compareList.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {compareList.map((fabric) => (
              <div key={fabric.id} className="relative">
                <img
                  src={fabric.image_url || "/placeholder.svg"}
                  alt={fabric.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <button
                  onClick={() => removeFromCompare(fabric.id)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2 ml-2">
            <Button variant="ghost" size="sm" onClick={clearCompare}>
              Limpar
            </Button>
            <Button
              size="sm"
              onClick={() => setIsCompareOpen(true)}
              disabled={compareList.length < 2}
            >
              Comparar
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface CompareModalProps {
  defaultImages: Record<string, string>;
}

export function CompareModal({ defaultImages }: CompareModalProps) {
  const { compareList, isCompareOpen, setIsCompareOpen, clearCompare } = useCompare();

  if (!isCompareOpen) return null;

  // Collect all unique specification keys
  const allSpecKeys = new Set<string>();
  compareList.forEach((fabric) => {
    if (fabric.specifications) {
      Object.keys(fabric.specifications).forEach((key) => allSpecKeys.add(key));
    }
  });

  // Collect all unique features
  const allFeatures = new Set<string>();
  compareList.forEach((fabric) => {
    if (Array.isArray(fabric.features)) {
      fabric.features.forEach((f) => {
        if (typeof f === "string") allFeatures.add(f);
      });
    }
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={() => setIsCompareOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <Scale className="h-6 w-6 text-accent" />
              <h2 className="text-2xl font-bold text-foreground">Comparar Tecidos</h2>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={clearCompare}>
                Limpar
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsCompareOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-auto max-h-[calc(90vh-100px)]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left text-muted-foreground font-medium w-40">
                    Característica
                  </th>
                  {compareList.map((fabric) => (
                    <th key={fabric.id} className="p-4 text-center">
                      <Link
                        to={`/tecidos/${fabric.slug}`}
                        className="block hover:opacity-80 transition-opacity"
                        onClick={() => setIsCompareOpen(false)}
                      >
                        <img
                          src={fabric.image_url || defaultImages[fabric.slug] || "/placeholder.svg"}
                          alt={fabric.name}
                          className="w-24 h-24 object-cover rounded-xl mx-auto mb-3"
                        />
                        <span className="font-bold text-foreground text-lg">{fabric.name}</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Description */}
                <tr className="border-b border-border/50">
                  <td className="p-4 text-muted-foreground font-medium">Descrição</td>
                  {compareList.map((fabric) => (
                    <td key={fabric.id} className="p-4 text-center text-foreground">
                      {fabric.short_description || "-"}
                    </td>
                  ))}
                </tr>

                {/* Specifications */}
                {Array.from(allSpecKeys).map((key) => (
                  <tr key={key} className="border-b border-border/50">
                    <td className="p-4 text-muted-foreground font-medium capitalize">
                      {key.replace(/_/g, " ")}
                    </td>
                    {compareList.map((fabric) => (
                      <td key={fabric.id} className="p-4 text-center text-foreground">
                        {fabric.specifications?.[key] || "-"}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Features */}
                {Array.from(allFeatures).map((feature) => (
                  <tr key={feature} className="border-b border-border/50">
                    <td className="p-4 text-muted-foreground font-medium">{feature}</td>
                    {compareList.map((fabric) => {
                      const hasFeature = Array.isArray(fabric.features) && 
                        fabric.features.some((f) => f === feature);
                      return (
                        <td key={fabric.id} className="p-4 text-center">
                          {hasFeature ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground/40 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Applications */}
                <tr>
                  <td className="p-4 text-muted-foreground font-medium">Aplicações</td>
                  {compareList.map((fabric) => (
                    <td key={fabric.id} className="p-4 text-center">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {fabric.applications?.map((app, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-secondary rounded-full text-xs text-foreground"
                          >
                            {app}
                          </span>
                        )) || "-"}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
