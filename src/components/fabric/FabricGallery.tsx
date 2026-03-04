import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { isVideoUrl } from "@/lib/media-utils";

interface GalleryImage {
  url: string;
  alt?: string;
}

interface FabricGalleryProps {
  images: GalleryImage[];
  mainImage: string;
  fabricName: string;
}

export function FabricGallery({ images, mainImage, fabricName }: FabricGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Combine main image with gallery images
  const allImages: GalleryImage[] = [
    { url: mainImage, alt: fabricName },
    ...images,
  ];

  const currentImage = allImages[selectedIndex];

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  if (allImages.length === 1) {
    return (
      <div className="relative">
        <div 
          className="aspect-square rounded-3xl overflow-hidden shadow-2xl cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        >
          {isVideoUrl(mainImage) ? (
            <video src={mainImage} className="w-full h-full object-cover" muted loop autoPlay playsInline />
          ) : (
            <img src={mainImage} alt={fabricName} className="w-full h-full object-cover" />
          )}
        </div>

        {/* Lightbox */}
        <Lightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          image={mainImage}
          alt={fabricName}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative">
        <motion.div
          key={selectedIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="aspect-square rounded-3xl overflow-hidden shadow-2xl cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        >
          {isVideoUrl(currentImage.url) ? (
            <video src={currentImage.url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
          ) : (
            <img src={currentImage.url} alt={currentImage.alt || fabricName} className="w-full h-full object-cover" />
          )}
        </motion.div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/60 text-white rounded-full text-sm">
          {selectedIndex + 1} / {allImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {allImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`
              flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all
              ${selectedIndex === index 
                ? "ring-2 ring-accent ring-offset-2 ring-offset-background" 
                : "opacity-60 hover:opacity-100"
              }
            `}
          >
            {isVideoUrl(image.url) ? (
              <video src={image.url} className="w-full h-full object-cover" muted playsInline />
            ) : (
              <img src={image.url} alt={image.alt || `${fabricName} ${index + 1}`} className="w-full h-full object-cover" />
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={allImages}
        currentIndex={selectedIndex}
        onIndexChange={setSelectedIndex}
      />
    </div>
  );
}

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  image?: string;
  alt?: string;
  images?: GalleryImage[];
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
}

function Lightbox({ 
  isOpen, 
  onClose, 
  image, 
  alt, 
  images, 
  currentIndex = 0, 
  onIndexChange 
}: LightboxProps) {
  if (!isOpen) return null;

  const allImages = images || (image ? [{ url: image, alt }] : []);
  const current = allImages[currentIndex];

  const goToPrevious = () => {
    if (onIndexChange && allImages.length > 1) {
      onIndexChange(currentIndex === 0 ? allImages.length - 1 : currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (onIndexChange && allImages.length > 1) {
      onIndexChange(currentIndex === allImages.length - 1 ? 0 : currentIndex + 1);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="h-6 w-6 text-white" />
        </button>

        {/* Media */}
        {isVideoUrl(current?.url || '') ? (
          <video
            key={currentIndex}
            src={current?.url}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            controls
            autoPlay
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <motion.img
            key={currentIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={current?.url}
            alt={current?.alt || ""}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {/* Navigation for multiple images */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 text-white rounded-full">
              {currentIndex + 1} / {allImages.length}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
