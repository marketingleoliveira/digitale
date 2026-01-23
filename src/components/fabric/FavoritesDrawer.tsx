import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Trash2, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Button } from "@/components/ui/button";

interface FavoritesDrawerProps {
  defaultImages: Record<string, string>;
}

export function FavoritesDrawer({ defaultImages }: FavoritesDrawerProps) {
  const { favorites, removeFavorite, clearFavorites, favoritesCount } = useFavorites();
  const [isExpanded, setIsExpanded] = useState(false);

  if (favoritesCount === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <div className="bg-card border border-border shadow-2xl rounded-2xl overflow-hidden max-w-sm">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">
                Meus Favoritos
              </p>
              <p className="text-sm text-muted-foreground">
                {favoritesCount} tecido{favoritesCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border">
                <div className="max-h-64 overflow-y-auto p-2 space-y-2">
                  {favorites.map((fabric) => (
                    <motion.div
                      key={fabric.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors group"
                    >
                      <Link
                        to={`/tecidos/${fabric.slug}`}
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <img
                          src={fabric.image_url || defaultImages[fabric.slug] || "/placeholder.svg"}
                          alt={fabric.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">
                            {fabric.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {fabric.short_description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </Link>
                      <button
                        onClick={() => removeFavorite(fabric.id)}
                        className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Actions */}
                <div className="p-3 border-t border-border flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFavorites}
                    className="flex-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <Link to="/tecidos">
                      Ver todos
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
