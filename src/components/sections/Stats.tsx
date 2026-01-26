import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trophy, Users, Layers, Factory } from "lucide-react";

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

const icons = [
  { Icon: Trophy, color: "text-amber-500" },
  { Icon: Users, color: "text-blue-500" },
  { Icon: Layers, color: "text-emerald-500" },
  { Icon: Factory, color: "text-purple-500" },
];

export function Stats() {
  const { t } = useLanguage();

  const stats = [
    { value: 60, suffix: "+", label: t("stats.years"), iconIndex: 0 },
    { value: 1000, suffix: "+", label: t("stats.clients"), iconIndex: 1 },
    { value: 10, suffix: "M+", label: t("stats.fabrics"), iconIndex: 2 },
    { value: 15, suffix: "+", label: t("stats.production"), iconIndex: 3 },
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
      {/* Decorative Elements - Static */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="section-subtitle">
            Nossa Trajetória
          </span>
          <h2 className="section-title mt-4">
            Números que nos <span className="text-accent">orgulham</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Décadas de excelência, milhares de parcerias e uma produção que transforma o mercado têxtil brasileiro.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const { Icon, color } = icons[stat.iconIndex];
            return (
              <div
                key={stat.label}
                className="group"
              >
                <div className="relative bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent/5 h-full">
                  {/* Icon */}
                  <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Icon className={`w-14 h-14 ${color}`} />
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
