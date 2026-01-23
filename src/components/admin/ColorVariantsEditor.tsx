import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Palette } from "lucide-react";

export interface ColorVariant {
  name: string;
  hex: string;
}

interface ColorVariantsEditorProps {
  value: ColorVariant[];
  onChange: (colors: ColorVariant[]) => void;
}

export function ColorVariantsEditor({ value, onChange }: ColorVariantsEditorProps) {
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000" });

  const handleAdd = () => {
    if (!newColor.name.trim()) return;
    onChange([...value, { name: newColor.name.trim(), hex: newColor.hex }]);
    setNewColor({ name: "", hex: "#000000" });
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: keyof ColorVariant, fieldValue: string) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: fieldValue };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <Palette className="h-4 w-4" />
        Variantes de Cor
      </Label>

      {/* Existing colors */}
      <div className="space-y-2">
        {value.map((color, index) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg">
            <input
              type="color"
              value={color.hex}
              onChange={(e) => handleUpdate(index, "hex", e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0"
            />
            <Input
              value={color.name}
              onChange={(e) => handleUpdate(index, "name", e.target.value)}
              placeholder="Nome da cor"
              className="flex-1"
            />
            <Input
              value={color.hex}
              onChange={(e) => handleUpdate(index, "hex", e.target.value)}
              placeholder="#000000"
              className="w-28 font-mono text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add new color */}
      <div className="flex items-end gap-2 p-3 border-2 border-dashed rounded-lg">
        <input
          type="color"
          value={newColor.hex}
          onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
          className="w-10 h-10 rounded cursor-pointer border-0"
        />
        <div className="flex-1">
          <Label className="text-xs text-muted-foreground">Nome da Cor</Label>
          <Input
            value={newColor.name}
            onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
            placeholder="Ex: Azul Marinho"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Código Hex</Label>
          <Input
            value={newColor.hex}
            onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
            placeholder="#000000"
            className="w-28 font-mono text-sm"
          />
        </div>
        <Button type="button" variant="secondary" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {value.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-2">
          Nenhuma cor adicionada. Use o campo acima para adicionar variantes de cor.
        </p>
      )}
    </div>
  );
}
