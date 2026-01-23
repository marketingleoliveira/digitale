import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const testimonials = [
  {
    id: 1,
    quote: "Sou estilista há mais de 10 anos e sempre trabalhei com as malhas da digitale. O que mais me agrada nas malhas são as tecnologias como Aloe Vera, além da qualidade que agregam muito valor as minhas criações.",
    author: "Loreine",
    company: "LB Criação",
    avatar: "L",
    rating: 5,
    years: "10+ anos de parceria",
  },
  {
    id: 2,
    quote: "O Milano é o melhor tecido para leggings que já usei, sem transparência e com ótima elasticidade. Minhas vendas só crescem!",
    author: "Simone Mecias da Silva",
    company: "Empreendedora Fitness",
    avatar: "S",
    rating: 5,
    years: "5 anos de parceria",
  },
  {
    id: 3,
    quote: "Estamos a 15 anos no mercado e trabalhamos com a Digitale a quase 10 anos! Digitale é nosso principal fornecedor, pela qualidade de suas estampas e parceria nos prazos.",
    author: "Juliana Hermans",
    company: "Abacaxiclub",
    avatar: "J",
    rating: 5,
    years: "10 anos de parceria",
  },
  {
    id: 4,
    quote: "Encontrei a Digitale pesquisando e a experiência superou todas as expectativas. Comprei os tecidos e fiquei impressionada com a qualidade e o acabamento.",
    author: "Jussara",
    company: "Designer de Moda",
    avatar: "J",
    rating: 5,
    years: "3 anos de parceria",
  },
  {
    id: 5,
    quote: "São mais de 10 anos de parceria com uma equipe fantástica. Entregam qualidade, beleza e segurança em cada metro de tecido.",
    author: "Viviane",
    company: "Mar & Sol",
    avatar: "V",
    rating: 5,
    years: "10+ anos de parceria",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { t } = useLanguage();

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-play with pause on hover
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next]);

  const getVisibleTestimonials = () => {
    const indices = [];
    for (let i = -1; i <= 1; i++) {
      indices.push((current + i + testimonials.length) % testimonials.length);
    }
    return indices;
  };

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm uppercase tracking-[0.25em] font-semibold">
            {t("testimonials.label")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground leading-tight mt-4">
            {t("testimonials.title")}
          </h2>
          <p className="text-primary-foreground/60 mt-4 max-w-2xl mx-auto">
            Milhares de empresas confiam na Digitale para criar produtos de qualidade superior
          </p>
        </motion.div>

        {/* Desktop: 3 Cards View */}
        <div 
          className="hidden lg:block relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="flex items-center justify-center gap-6">
            {getVisibleTestimonials().map((index, position) => {
              const testimonial = testimonials[index];
              const isCenter = position === 1;
              
              return (
                <motion.div
                  key={testimonial.id}
                  initial={false}
                  animate={{
                    scale: isCenter ? 1 : 0.9,
                    opacity: isCenter ? 1 : 0.5,
                    y: isCenter ? 0 : 20,
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`w-[400px] ${isCenter ? 'z-10' : 'z-0'}`}
                >
                  <div 
                    className={`bg-card rounded-2xl p-8 transition-all duration-300 ${
                      isCenter 
                        ? 'shadow-2xl shadow-black/20' 
                        : 'shadow-lg'
                    }`}
                  >
                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-5 h-5 fill-accent text-accent" 
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-foreground text-lg leading-relaxed mb-6 line-clamp-4">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-4 border-t border-border">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-xl font-bold shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-foreground">{testimonial.author}</p>
                        <p className="text-accent text-sm font-medium">{testimonial.company}</p>
                      </div>
                    </div>

                    {/* Years Badge */}
                    <div className="mt-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                        {testimonial.years}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-card border-2 border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all shadow-lg z-20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-card border-2 border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all shadow-lg z-20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile: Single Card with Swipe */}
        <div 
          className="lg:hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl p-6 md:p-8 shadow-2xl"
            >
              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-5 h-5 fill-accent text-accent" 
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground text-lg md:text-xl leading-relaxed mb-6">
                "{testimonials[current].quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground text-xl font-bold shadow-lg">
                  {testimonials[current].avatar}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground">{testimonials[current].author}</p>
                  <p className="text-accent text-sm font-medium">{testimonials[current].company}</p>
                </div>
              </div>

              {/* Years Badge */}
              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                  {testimonials[current].years}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Mobile Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-accent hover:border-accent transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current 
                      ? "bg-accent w-8" 
                      : "bg-primary-foreground/30 hover:bg-primary-foreground/50 w-2"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-accent hover:border-accent transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Desktop Dots */}
        <div className="hidden lg:flex justify-center gap-2 mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current 
                  ? "bg-accent w-8" 
                  : "bg-primary-foreground/30 hover:bg-primary-foreground/50 w-2"
              }`}
            />
          ))}
        </div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { value: "1000+", label: "Clientes Satisfeitos" },
            { value: "25+", label: "Anos no Mercado" },
            { value: "4.9", label: "Avaliação Média" },
            { value: "98%", label: "Taxa de Recompra" },
          ].map((stat, index) => (
            <div 
              key={index}
              className="text-center p-4 rounded-xl bg-primary-foreground/5 backdrop-blur-sm"
            >
              <p className="text-2xl md:text-3xl font-bold text-accent">{stat.value}</p>
              <p className="text-sm text-primary-foreground/70 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
