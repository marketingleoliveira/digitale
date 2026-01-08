import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const testimonials = [
  {
    id: 1,
    quote: "Sou estilista há mais de 10 anos e sempre trabalhei com as malhas da digitale. O que mais me agrada nas malhas são as tecnologias como Aloe Vera, além da qualidade que agregam muito valor as minhas criações.",
    author: "Loreine",
    company: "LB Criação",
  },
  {
    id: 2,
    quote: "O Milano é o melhor tecido para leggings que já usei, sem transparência e com ótima elasticidade. Minhas vendas só crescem!",
    author: "Simone Mecias da Silva",
    company: "Cliente Digitale",
  },
  {
    id: 3,
    quote: "Estamos a 15 anos no mercado e trabalhamos com a Digitale a quase 10 anos! Digitale é nosso principal fornecedor, pela qualidade de suas estampas e parceria nos prazos.",
    author: "Juliana Hermans",
    company: "Abacaxiclub",
  },
  {
    id: 4,
    quote: "Encontrei a Digitale pesquisando e a experiência superou todas as expectativas. Comprei os tecidos e fiquei impressionada com a qualidade e o acabamento. Com certeza, ganharam uma cliente fiel!",
    author: "Jussara",
    company: "Cliente Digitale",
  },
  {
    id: 5,
    quote: "São mais de 10 anos de parceria com uma equipe fantástica. Entregam qualidade, beleza e segurança em cada metro de tecido.",
    author: "Viviane",
    company: "Mar & Sol",
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-subtitle">{t("testimonials.label")}</span>
          <h2 className="section-title mt-3">{t("testimonials.title")}</h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border/50"
              >
                <Quote className="h-12 w-12 text-accent/30 mb-6" />
                <blockquote className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 font-display">
                  "{testimonials[current].quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {testimonials[current].author[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonials[current].author}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[current].company}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      index === current ? "bg-primary" : "bg-border"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
