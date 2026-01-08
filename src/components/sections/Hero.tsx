import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import athleteModel from "@/assets/athlete-model.jpg";

const slides = [
  {
    id: 1,
    type: "technologies",
    image: heroBg,
    title: "Tecnologias",
    subtitle: "Digitale Têxtil",
    technologies: [
      { name: "SUPER\nMICRO\nFIBRA", bgColor: "#FFFFFF", textColor: "#374151", borderColor: "#E5E7EB" },
      { name: "ALOE VERA\nHIDRATANTE", bgColor: "#84CC16", textColor: "#FFFFFF", borderColor: "transparent" },
      { name: "ANTIBACTERIANO\nANTIODOR", bgColor: "#F9A8D4", textColor: "#FFFFFF", borderColor: "transparent", icon: "🦠" },
      { name: "PROTEÇÃO\nUV\n50+", bgColor: "#F97316", textColor: "#FFFFFF", borderColor: "transparent" },
      { name: "SUPER\nBLACK", bgColor: "#1F2937", textColor: "#FFFFFF", borderColor: "transparent" },
      { name: "DIGITALE\nECO", bgColor: "#16A34A", textColor: "#FFFFFF", borderColor: "transparent", icon: "♻" },
    ],
  },
  {
    id: 2,
    type: "product",
    image: athleteModel,
    title: "Milano Myst",
    subtitle: "O melhor tecido para leggings premium",
    link: "/tecidos/milano",
  },
  {
    id: 3,
    type: "product",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80",
    title: "Lyon",
    subtitle: "Aumente suas vendas com zero transparência",
    link: "/tecidos/lyon",
  },
  {
    id: 4,
    type: "product",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
    title: "Linha ECO",
    subtitle: "Sustentabilidade e performance em um só tecido",
    link: "/sustentabilidade",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, nextSlide]);

  const slide = slides[currentSlide];

  return (
    <section
      className="relative h-[450px] md:h-[550px] lg:h-[600px] mt-20 overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
          />
          
          {/* Overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/20" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="container mx-auto px-4">
              {slide.type === "technologies" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  {/* Title */}
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-light mb-8 md:mb-12">
                    <span className="text-primary">{slide.title}</span>{" "}
                    <span className="text-gray-500">{slide.subtitle}</span>
                  </h2>

                  {/* Technology Badges */}
                  <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-5 max-w-5xl mx-auto">
                    {slide.technologies.map((tech, index) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="relative group cursor-pointer"
                      >
                        <div
                          className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full flex flex-col items-center justify-center text-center shadow-lg transition-transform hover:scale-105"
                          style={{
                            backgroundColor: tech.bgColor,
                            color: tech.textColor,
                            border: tech.borderColor !== "transparent" ? `2px solid ${tech.borderColor}` : "none",
                          }}
                        >
                          {tech.icon && (
                            <span className="text-lg md:text-2xl mb-1">{tech.icon}</span>
                          )}
                          <span className="text-[8px] md:text-xs lg:text-sm font-bold leading-tight whitespace-pre-line px-1">
                            {tech.name}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-xl text-left"
                >
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 mb-6">
                    {slide.subtitle}
                  </p>
                  <a
                    href={slide.link}
                    className="inline-block bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                  >
                    Saiba mais
                  </a>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 z-10"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 z-10"
        aria-label="Próximo slide"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all ${
              index === currentSlide
                ? "bg-primary scale-110"
                : "bg-gray-400/60 hover:bg-gray-500"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
