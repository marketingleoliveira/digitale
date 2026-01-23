import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "sonner";

interface FavoriteButtonProps {
  fabric: {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    short_description: string | null;
  };
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function FavoriteButton({ 
  fabric, 
  size = "md", 
  showLabel = false, 
  className = "" 
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isLiked = isFavorite(fabric.id);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(fabric);
    
    if (!isLiked) {
      toast.success(`${fabric.name} adicionado aos favoritos!`, {
        duration: 2000,
      });
    } else {
      toast.info(`${fabric.name} removido dos favoritos`, {
        duration: 2000,
      });
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      className={`
        ${sizeClasses[size]} 
        rounded-full flex items-center justify-center gap-2 transition-all duration-300
        ${isLiked 
          ? "bg-red-500 text-white shadow-lg shadow-red-500/30" 
          : "bg-white/90 text-muted-foreground hover:bg-white hover:text-red-500"
        }
        ${className}
      `}
      aria-label={isLiked ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isLiked ? "filled" : "outline"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart 
            className={`${iconSizes[size]} ${isLiked ? "fill-current" : ""}`} 
          />
        </motion.div>
      </AnimatePresence>
      {showLabel && (
        <span className="text-sm font-medium">
          {isLiked ? "Favoritado" : "Favoritar"}
        </span>
      )}
    </motion.button>
  );
}
