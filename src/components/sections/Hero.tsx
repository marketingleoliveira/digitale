import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import heroBg from "@/assets/hero-bg.jpg";
import athleteModel from "@/assets/athlete-model.jpg";

// Fallback slides when no database slides exist
const fallbackSlides = [
  { 
    id: "1", 
    image_url: heroBg, 
    alt_text: "Digitale Têxtil",
    title: "Tradição, Tecnologia e Responsabilidade",
    subtitle: "60+ anos criando tecidos de alta performance",
  },
  { 
    id: "2", 
    image_url: athleteModel, 
    alt_text: "Linha Fitness",
    title: "Tecidos de Alta Performance",
    subtitle: "Do básico ao diferenciado para sua coleção",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { t } = useLanguage();

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

  const slides = dbSlides && dbSlides.length > 0 
    ? dbSlides.map((s, i) => ({
        ...s,
        title: fallbackSlides[i % fallbackSlides.length]?.title || "Digitale Têxtil",
        subtitle: fallbackSlides[i % fallbackSlides.length]?.subtitle || "",
      }))
    : fallbackSlides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;
    const timer = setInterval(nextSlide, 6000);
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
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(500px, 70vh, 800px)" }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image_url}
            alt={slide.alt_text || "Slide"}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full container mx-auto px-6 flex items-center">
        <motion.div
          key={`content-${currentSlide}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl text-white"
        >
          <span className="inline-block px-4 py-1.5 bg-accent text-white text-sm font-semibold rounded-full mb-6">
            {t("hero.label")}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            {slide.title || t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed">
            {slide.subtitle || t("hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/tecidos"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-orange-light text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent/30"
            >
              {t("hero.cta")}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/contato"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300"
            >
              {t("nav.contact")}
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10 border border-white/20"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center transition-all z-10 border border-white/20"
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-accent w-8"
                  : "bg-white/50 hover:bg-white/70 w-2"
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
