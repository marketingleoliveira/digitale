import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
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
  const containerRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Scroll-based parallax
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.15]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  
  // Smooth spring animations
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  // Mouse parallax effect
  const rotateX = useTransform(mouseY, [-200, 200], [2, -2]);
  const rotateY = useTransform(mouseX, [-200, 200], [-2, 2]);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springRotateY = useSpring(springRotateX, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsAutoPlaying(true);
  };

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
      ref={containerRef}
      className="relative w-full overflow-hidden bg-muted"
      style={{ height: "400px", perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Parallax Container */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: springY,
          scale: springScale,
          opacity,
          rotateX: springRotateX,
          rotateY: springRotateY,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-[-20px]"
          >
            <img
              src={slide.image_url}
              alt={slide.alt_text || "Slide"}
              className="w-full h-full object-cover object-center"
            />
            
            {/* Gradient overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            initial={{
              x: `${Math.random() * 100}%`,
              y: "100%",
              opacity: 0,
            }}
            animate={{
              y: "-10%",
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear",
            }}
            style={{
              left: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Navigation Arrows with enhanced styling */}
      {slides.length > 1 && (
        <>
          <motion.button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all z-10 shadow-lg backdrop-blur-sm"
            aria-label="Slide anterior"
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
          </motion.button>
          <motion.button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all z-10 shadow-lg backdrop-blur-sm"
            aria-label="Próximo slide"
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-foreground" />
          </motion.button>
        </>
      )}

      {/* Enhanced Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-accent w-8 h-2.5"
                  : "bg-white/60 hover:bg-white w-2.5 h-2.5"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar for current slide */}
      {slides.length > 1 && isAutoPlaying && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-accent"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          key={currentSlide}
        />
      )}
    </section>
  );
}
