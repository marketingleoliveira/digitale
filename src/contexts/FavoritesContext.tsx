import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface FavoriteFabric {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  short_description: string | null;
}

interface FavoritesContextType {
  favorites: FavoriteFabric[];
  addFavorite: (fabric: FavoriteFabric) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (fabric: FavoriteFabric) => void;
  clearFavorites: () => void;
  favoritesCount: number;
}

const STORAGE_KEY = "fabric_favorites";

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<FavoriteFabric[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites:", e);
    }
  }, [favorites]);

  const addFavorite = (fabric: FavoriteFabric) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === fabric.id)) return prev;
      return [...prev, fabric];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const isFavorite = (id: string) => {
    return favorites.some((f) => f.id === id);
  };

  const toggleFavorite = (fabric: FavoriteFabric) => {
    if (isFavorite(fabric.id)) {
      removeFavorite(fabric.id);
    } else {
      addFavorite(fabric);
    }
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        clearFavorites,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
