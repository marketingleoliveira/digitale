import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Award, Users, Layers, Factory } from "lucide-react";

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setDisplayValue(value);
              clearInterval(timer);
            } else {
              setDisplayValue(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={ref} className="flex items-baseline justify-center gap-1">
      <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tabular-nums">
        {displayValue}
      </span>
      <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-accent">{suffix}</span>
    </div>
  );
}

export function Stats() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  const stats = [
    { value: 60, suffix: "+", label: t("stats.years"), icon: Award, color: "from-amber-500 to-orange-500" },
    { value: 1000, suffix: "+", label: t("stats.clients"), icon: Users, color: "from-blue-500 to-cyan-500" },
    { value: 10, suffix: "M+", label: t("stats.fabrics"), icon: Layers, color: "from-emerald-500 to-teal-500" },
    { value: 15, suffix: "+", label: t("stats.production"), icon: Factory, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div 
        className="container mx-auto px-6 relative z-10"
        style={{ scale }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-subtitle">
            Nossa Trajetória
          </span>
          <h2 className="section-title mt-4">
            Números que nos <span className="text-accent">orgulham</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Décadas de excelência, milhares de parcerias e uma produção que transforma o mercado têxtil brasileiro.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="relative bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-accent/50 transition-all duration-500 hover:shadow-xl hover:shadow-accent/5 h-full">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>

                {/* Number */}
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />

                {/* Label */}
                <p className="mt-4 text-muted-foreground text-sm md:text-base font-medium text-center">
                  {stat.label}
                </p>

                {/* Decorative line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent group-hover:w-3/4 transition-all duration-500 rounded-full" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {[
            "Qualidade Certificada",
            "Entrega em Todo Brasil",
            "Atendimento Personalizado",
            "Produção Sustentável"
          ].map((badge, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>{badge}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
