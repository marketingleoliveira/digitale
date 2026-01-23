import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Plus, Image } from "lucide-react";
import { toast } from "sonner";

interface GalleryImage {
  url: string;
  alt?: string;
}

interface GalleryUploadProps {
  bucket: string;
  folder?: string;
  value: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  maxImages?: number;
}

export function GalleryUpload({ 
  bucket, 
  folder = "", 
  value, 
  onChange, 
  maxImages = 6 
}: GalleryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - value.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.warning(`Você pode adicionar no máximo ${remainingSlots} imagem(ns) a mais.`);
    }

    setIsUploading(true);
    const uploadedImages: GalleryImage[] = [];

    try {
      for (const file of filesToUpload) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} não é uma imagem válida.`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} é muito grande (máx 5MB).`);
          continue;
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        uploadedImages.push({ url: publicUrl, alt: file.name.split(".")[0] });
      }

      onChange([...value, ...uploadedImages]);
      toast.success(`${uploadedImages.length} imagem(ns) enviada(s)!`);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Erro ao enviar imagem: " + error.message);
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleUpdateAlt = (index: number, alt: string) => {
    const updated = [...value];
    updated[index] = { ...updated[index], alt };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      {/* Gallery Grid */}
      <div className="grid grid-cols-3 gap-3">
        {value.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image.url}
              alt={image.alt || `Imagem ${index + 1}`}
              className="w-full aspect-square object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* Add button */}
        {value.length < maxImages && (
          <Button
            type="button"
            variant="outline"
            className="aspect-square flex flex-col gap-2 h-auto"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <Plus className="h-6 w-6" />
                <span className="text-xs">Adicionar</span>
              </>
            )}
          </Button>
        )}
      </div>

      {value.length === 0 && (
        <div 
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-accent/50 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <Image className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Clique para adicionar imagens da galeria
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Máximo de {maxImages} imagens, 5MB cada
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {value.length} de {maxImages} imagens
      </p>
    </div>
  );
}
