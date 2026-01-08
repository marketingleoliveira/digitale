import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-20">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block text-accent font-medium tracking-[0.2em] uppercase text-sm mb-6"
          >
            Tecidos de Alta Tecnologia
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-primary-foreground font-semibold leading-tight mb-6"
          >
            Inovação e qualidade em cada{" "}
            <span className="text-accent">fibra</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-primary-foreground/80 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
          >
            Há mais de 60 anos transformando o mercado têxtil com tecnologias exclusivas e sustentabilidade em cada processo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Button size="lg" variant="accent" className="group">
              Conheça Nossos Tecidos
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="ghost" className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
              <Play className="mr-2 h-5 w-5" />
              Ver Vídeo
            </Button>
          </motion.div>
        </div>

        {/* Tech Badges */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {[
            { name: "Super Micro Fibra", icon: "🧵" },
            { name: "Aloe Vera", icon: "🌿" },
            { name: "Antibacteriano", icon: "🛡️" },
            { name: "UV 50+", icon: "☀️" },
            { name: "Super Black", icon: "⬛" },
            { name: "Digitale ECO", icon: "♻️" },
          ].map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-4 text-center border border-primary-foreground/20"
            >
              <span className="text-2xl mb-2 block">{tech.icon}</span>
              <span className="text-primary-foreground/90 text-xs font-medium">{tech.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
