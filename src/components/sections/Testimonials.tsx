import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const testimonials = [
  {
    id: 1,
    quote: "Sou estilista há mais de 10 anos e sempre trabalhei com as malhas da digitale. O que mais me agrada nas malhas são as tecnologias como Aloe Vera, além da qualidade que agregam muito valor as minhas criações.",
    author: "Loreine",
    company: "LB Criação",
    avatar: "L",
  },
  {
    id: 2,
    quote: "O Milano é o melhor tecido para leggings que já usei, sem transparência e com ótima elasticidade. Minhas vendas só crescem!",
    author: "Simone Mecias da Silva",
    company: "Cliente Digitale",
    avatar: "S",
  },
  {
    id: 3,
    quote: "Estamos a 15 anos no mercado e trabalhamos com a Digitale a quase 10 anos! Digitale é nosso principal fornecedor, pela qualidade de suas estampas e parceria nos prazos.",
    author: "Juliana Hermans",
    company: "Abacaxiclub",
    avatar: "J",
  },
  {
    id: 4,
    quote: "Encontrei a Digitale pesquisando e a experiência superou todas as expectativas. Comprei os tecidos e fiquei impressionada com a qualidade e o acabamento.",
    author: "Jussara",
    company: "Cliente Digitale",
    avatar: "J",
  },
  {
    id: 5,
    quote: "São mais de 10 anos de parceria com uma equipe fantástica. Entregam qualidade, beleza e segurança em cada metro de tecido.",
    author: "Viviane",
    company: "Mar & Sol",
    avatar: "V",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-subtitle">{t("testimonials.label")}</span>
          <h2 className="section-title mt-4">{t("testimonials.title")}</h2>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-8 md:p-16 shadow-2xl relative"
              >
                {/* Large Quote Icon */}
                <div className="absolute -top-6 left-12 w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
                  <Quote className="h-8 w-8 text-white" />
                </div>

                <blockquote className="text-xl md:text-2xl lg:text-3xl text-foreground leading-relaxed mb-10 font-serif italic">
                  "{testimonials[current].quote}"
                </blockquote>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                    {testimonials[current].avatar}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">{testimonials[current].author}</p>
                    <p className="text-accent font-medium">{testimonials[current].company}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-6 mt-10">
              <button
                onClick={prev}
                className="w-14 h-14 rounded-full bg-white border-2 border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all shadow-md"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === current 
                        ? "bg-accent w-8" 
                        : "bg-border hover:bg-muted-foreground w-2"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-14 h-14 rounded-full bg-white border-2 border-border flex items-center justify-center hover:border-accent hover:text-accent transition-all shadow-md"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
