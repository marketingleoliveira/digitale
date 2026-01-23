import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ColorVariant {
  name: string;
  hex: string;
}

interface ColorGalleryProps {
  colors: ColorVariant[];
  className?: string;
}

export function ColorGallery({ colors, className = "" }: ColorGalleryProps) {
  const [selectedColor, setSelectedColor] = useState<ColorVariant | null>(
    colors.length > 0 ? colors[0] : null
  );

  if (colors.length === 0) return null;

  return (
    <div className={className}>
      <h3 className="text-lg font-bold text-foreground mb-4">Cores Disponíveis</h3>
      
      {/* Selected color preview */}
      {selectedColor && (
        <motion.div
          key={selectedColor.hex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-secondary/50 rounded-xl flex items-center gap-4"
        >
          <div
            className="w-16 h-16 rounded-xl shadow-lg border-2 border-border"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <div>
            <p className="font-semibold text-foreground">{selectedColor.name}</p>
            <p className="text-sm text-muted-foreground font-mono">{selectedColor.hex}</p>
          </div>
        </motion.div>
      )}

      {/* Color swatches */}
      <div className="flex flex-wrap gap-3">
        {colors.map((color, index) => {
          const isSelected = selectedColor?.hex === color.hex;
          const isLight = isLightColor(color.hex);

          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedColor(color)}
              className={`
                relative w-12 h-12 rounded-xl shadow-md transition-all duration-200
                ${isSelected ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : "hover:shadow-lg"}
              `}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Check className={`h-5 w-5 ${isLight ? "text-gray-800" : "text-white"}`} />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground mt-3">
        {colors.length} {colors.length === 1 ? "cor disponível" : "cores disponíveis"}
      </p>
    </div>
  );
}

// Helper function to determine if a color is light
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
