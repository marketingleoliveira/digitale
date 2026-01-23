import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

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

// Animated SVG Icons
function YearsIcon({ isHovered }: { isHovered: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* Trophy base */}
      <motion.path
        d="M30 65 L50 65 L48 55 L32 55 Z"
        fill="currentColor"
        className="text-amber-400"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      />
      {/* Trophy cup */}
      <motion.path
        d="M25 20 C25 20 20 20 20 30 C20 40 25 45 40 50 C55 45 60 40 60 30 C60 20 55 20 55 20 Z"
        fill="currentColor"
        className="text-amber-500"
        initial={{ scale: 0.8 }}
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.3 }}
      />
      {/* Star */}
      <motion.path
        d="M40 28 L42 34 L48 34 L43 38 L45 44 L40 40 L35 44 L37 38 L32 34 L38 34 Z"
        fill="currentColor"
        className="text-amber-200"
        animate={{ 
          rotate: isHovered ? 360 : 0,
          scale: isHovered ? 1.2 : 1 
        }}
        transition={{ duration: 0.6 }}
        style={{ transformOrigin: "40px 36px" }}
      />
      {/* Handles */}
      <motion.path
        d="M20 25 C10 25 10 35 20 35"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        className="text-amber-600"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
      <motion.path
        d="M60 25 C70 25 70 35 60 35"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        className="text-amber-600"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
    </svg>
  );
}

function ClientsIcon({ isHovered }: { isHovered: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* Central person */}
      <motion.circle
        cx="40" cy="25"
        r="10"
        fill="currentColor"
        className="text-blue-400"
        animate={{ scale: isHovered ? 1.1 : 1 }}
      />
      <motion.path
        d="M25 55 C25 40 55 40 55 55"
        fill="currentColor"
        className="text-blue-500"
        animate={{ y: isHovered ? -2 : 0 }}
      />
      {/* Left person */}
      <motion.circle
        cx="18" cy="35"
        r="7"
        fill="currentColor"
        className="text-cyan-400"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      />
      <motion.path
        d="M8 60 C8 50 28 50 28 60"
        fill="currentColor"
        className="text-cyan-500"
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
      {/* Right person */}
      <motion.circle
        cx="62" cy="35"
        r="7"
        fill="currentColor"
        className="text-cyan-400"
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      />
      <motion.path
        d="M52 60 C52 50 72 50 72 60"
        fill="currentColor"
        className="text-cyan-500"
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
      {/* Connection lines */}
      <motion.path
        d="M28 35 L35 30 M52 35 L45 30"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 2"
        className="text-blue-300"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: isHovered ? 1 : 0.7 }}
        transition={{ duration: 0.5 }}
      />
    </svg>
  );
}

function FabricsIcon({ isHovered }: { isHovered: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* Stacked layers */}
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x={15 + i * 2}
          y={20 + i * 10}
          width="50"
          height="12"
          rx="3"
          fill="currentColor"
          className={i % 2 === 0 ? "text-emerald-500" : "text-teal-400"}
          initial={{ x: -20, opacity: 0 }}
          animate={{ 
            x: 0, 
            opacity: 1,
            y: isHovered ? 20 + i * 8 : 20 + i * 10
          }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        />
      ))}
      {/* Pattern dots */}
      {isHovered && [0, 1, 2].map((row) => (
        [0, 1, 2, 3, 4].map((col) => (
          <motion.circle
            key={`${row}-${col}`}
            cx={22 + col * 10}
            cy={26 + row * 10}
            r="2"
            fill="currentColor"
            className="text-white/40"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 + (row * 5 + col) * 0.02 }}
          />
        ))
      ))}
    </svg>
  );
}

function ProductionIcon({ isHovered }: { isHovered: boolean }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* Factory building */}
      <motion.rect
        x="10" y="40"
        width="60" height="25"
        rx="2"
        fill="currentColor"
        className="text-purple-500"
      />
      {/* Chimneys */}
      <motion.rect
        x="20" y="25"
        width="8" height="20"
        fill="currentColor"
        className="text-purple-600"
      />
      <motion.rect
        x="52" y="30"
        width="8" height="15"
        fill="currentColor"
        className="text-purple-600"
      />
      {/* Smoke */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx={24 + i * 4}
          cy={20 - i * 5}
          r={3 + i}
          fill="currentColor"
          className="text-purple-300/50"
          animate={{
            y: isHovered ? [-2, -8, -2] : 0,
            opacity: isHovered ? [0.3, 0.6, 0.3] : 0.3,
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.2,
            repeat: isHovered ? Infinity : 0,
          }}
        />
      ))}
      {/* Windows */}
      <motion.rect x="18" y="48" width="10" height="8" rx="1" fill="currentColor" className="text-pink-300" />
      <motion.rect x="35" y="48" width="10" height="8" rx="1" fill="currentColor" className="text-pink-300" />
      <motion.rect x="52" y="48" width="10" height="8" rx="1" fill="currentColor" className="text-pink-300" />
      {/* Gear */}
      <motion.g
        animate={{ rotate: isHovered ? 360 : 0 }}
        transition={{ duration: 3, repeat: isHovered ? Infinity : 0, ease: "linear" }}
        style={{ transformOrigin: "56px 45px" }}
      >
        <circle cx="56" cy="45" r="4" fill="currentColor" className="text-pink-400" />
      </motion.g>
    </svg>
  );
}

export function Stats() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  const stats = [
    { value: 60, suffix: "+", label: t("stats.years"), Icon: YearsIcon },
    { value: 1000, suffix: "+", label: t("stats.clients"), Icon: ClientsIcon },
    { value: 10, suffix: "M+", label: t("stats.fabrics"), Icon: FabricsIcon },
    { value: 15, suffix: "+", label: t("stats.production"), Icon: ProductionIcon },
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
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-accent/50 transition-all duration-500 hover:shadow-xl hover:shadow-accent/5 h-full">
                {/* Animated Icon */}
                <div className="w-20 h-20 mx-auto mb-6">
                  <stat.Icon isHovered={hoveredIndex === index} />
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
      </motion.div>
    </section>
  );
}
