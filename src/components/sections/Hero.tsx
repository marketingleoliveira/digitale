import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const slides = [
  {
    id: 1,
    title: "Tecnologias Digitale Têxtil",
    image: heroBg,
    technologies: [
      { name: "SUPER MICRO FIBRA", color: "bg-white", textColor: "text-gray-700" },
      { name: "ALOE VERA HIDRATANTE", color: "bg-lime-400", textColor: "text-white" },
      { name: "ANTIBACTERIANO ANTIODOR", color: "bg-pink-300", textColor: "text-white" },
      { name: "PROTEÇÃO UV 50+", color: "bg-orange-500", textColor: "text-white" },
      { name: "SUPER BLACK", color: "bg-gray-900", textColor: "text-white" },
      { name: "DIGITALE ECO", color: "bg-green-600", textColor: "text-white" },
    ],
  },
  {
    id: 2,
    title: "Milano Myst",
    subtitle: "O melhor tecido para leggings premium",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1920&q=80",
    cta: { text: "Conheça", href: "/tecidos/milano" },
  },
  {
    id: 3,
    title: "Lyon",
    subtitle: "Aumente suas vendas com zero transparência",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80",
    cta: { text: "Saiba mais", href: "/tecidos/lyon" },
  },
  {
    id: 4,
    title: "Linha ECO",
    subtitle: "Sustentabilidade e performance em um só tecido",
    image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=1920&q=80",
    cta: { text: "Descubra", href: "/sustentabilidade" },
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
      className="relative h-[500px] md:h-[600px] lg:h-[700px] mt-20 overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              {slide.technologies ? (
                // First slide with technologies
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-light mb-8">
                    <span className="text-primary">Tecnologias</span>{" "}
                    <span className="text-gray-600">Digitale Têxtil</span>
                  </h2>
                  <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
                    {slide.technologies.map((tech, index) => (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className={`${tech.color} ${tech.textColor} px-4 py-3 md:px-6 md:py-4 rounded-full text-xs md:text-sm font-medium shadow-lg`}
                      >
                        {tech.name}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                // Other slides with title/subtitle
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-xl"
                >
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-4">
                    {slide.title}
                  </h2>
                  {slide.subtitle && (
                    <p className="text-lg md:text-xl text-gray-600 mb-6">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.cta && (
                    <a
                      href={slide.cta.href}
                      className="inline-block bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors"
                    >
                      {slide.cta.text}
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        <ChevronLeft className="h-6 w-6 text-gray-700" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        <ChevronRight className="h-6 w-6 text-gray-700" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-primary" : "bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
