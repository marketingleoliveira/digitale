import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import athleteModel from "@/assets/athlete-model.jpg";

// Fallback slides when no database slides exist
const fallbackSlides = [
  { id: "1", image_url: heroBg, alt_text: "Digitale Têxtil" },
  { id: "2", image_url: athleteModel, alt_text: "Linha Fitness" },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data: dbSlides } = useQuery({
    queryKey: ["carousel-slides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("carousel_slides")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const slides = dbSlides && dbSlides.length > 0 ? dbSlides : fallbackSlides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide, slides.length]);

  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  const slide = slides[currentSlide];

  return (
    <section
      className="relative w-full overflow-hidden bg-background"
      style={{ height: "clamp(280px, 50vw, 450px)" }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Carousel Container */}
      <div className="absolute inset-0" style={{ perspective: "1500px" }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={slide.id}
            initial={{ 
              rotateY: 90,
              opacity: 0,
              transformOrigin: "left center"
            }}
            animate={{ 
              rotateY: 0,
              opacity: 1,
              transformOrigin: "left center"
            }}
            exit={{ 
              rotateY: -90,
              opacity: 0,
              transformOrigin: "right center"
            }}
            transition={{ 
              duration: 0.8, 
              ease: [0.4, 0, 0.2, 1]
            }}
            className="absolute inset-0"
            style={{ backfaceVisibility: "hidden" }}
          >
            <img
              src={slide.image_url}
              alt={slide.alt_text || "Slide"}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all z-10 shadow-md"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all z-10 shadow-md"
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-accent w-6 md:w-8 h-2"
                  : "bg-white/70 hover:bg-white w-2 h-2"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {slides.length > 1 && isAutoPlaying && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-accent"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          key={currentSlide}
        />
      )}
    </section>
  );
}