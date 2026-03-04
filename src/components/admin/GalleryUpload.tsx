import { useState, useRef, DragEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Plus, Image } from "lucide-react";
import { toast } from "sonner";
import { isVideoUrl, isValidMediaFile, getMaxFileSize, getMaxFileSizeLabel, getAcceptedMediaTypes } from "@/lib/media-utils";

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
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const processFiles = async (files: File[]) => {
    const remainingSlots = maxImages - value.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast.warning(`Você pode adicionar no máximo ${remainingSlots} imagem(ns) a mais.`);
    }

    setIsUploading(true);
    const uploadedImages: GalleryImage[] = [];

    try {
      for (const file of filesToUpload) {
        if (!isValidMediaFile(file)) {
          toast.error(`${file.name} não é um arquivo válido (imagem ou vídeo).`);
          continue;
        }

        const maxSize = getMaxFileSize(file);
        if (file.size > maxSize) {
          toast.error(`${file.name} é muito grande (máx ${getMaxFileSizeLabel(file)}).`);
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
      toast.success(`${uploadedImages.length} arquivo(s) enviado(s)!`);
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    processFiles(files);
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
    <div 
      className="space-y-4"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept={getAcceptedMediaTypes()}
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      {/* Gallery Grid */}
      <div className={`grid grid-cols-3 gap-3 p-3 rounded-lg border-2 border-dashed transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-transparent"
      }`}>
        {value.map((image, index) => (
          <div key={index} className="relative group">
            {isVideoUrl(image.url) ? (
              <video
                src={image.url}
                className="w-full aspect-square object-cover rounded-lg border"
                muted
                loop
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={image.url}
                alt={image.alt || `Imagem ${index + 1}`}
                className="w-full aspect-square object-cover rounded-lg border"
              />
            )}
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
        {value.length < maxImages && value.length > 0 && (
          <div
            onClick={() => inputRef.current?.click()}
            className={`aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragging 
                ? "border-primary bg-primary/10" 
                : "border-muted-foreground/25 hover:border-primary/50"
            } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Plus className={`h-6 w-6 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                <span className="text-xs text-muted-foreground">
                  {isDragging ? "Solte aqui" : "Adicionar"}
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {value.length === 0 && (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging 
              ? "border-primary bg-primary/5" 
              : "hover:border-accent/50"
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <Image className={`h-10 w-10 mx-auto mb-3 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-sm text-muted-foreground">
            {isDragging ? "Solte os arquivos aqui" : "Arraste ou clique para adicionar imagens ou vídeos"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Máximo de {maxImages} arquivos | Imagens até 5MB | Vídeos até 50MB
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {value.length} de {maxImages} imagens
      </p>
    </div>
  );
}
