import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  "Tecidos com tecnologia UV 50+",
  "Antibacteriano certificado",
  "Linha sustentável ECO",
];

export function Hero() {
  return (
    <section className="relative pt-32 lg:pt-40 pb-20 lg:pb-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block text-primary text-sm font-medium tracking-wider uppercase mb-4">
              Alta Tecnologia em Tecidos
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-[1.1] mb-6">
              Qualidade e inovação para sua confecção
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Há mais de 60 anos desenvolvendo tecidos de alta performance para moda fitness, esportiva e casual com tecnologia exclusiva.
            </p>

            <ul className="space-y-3 mb-10">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="group">
                <Link to="/tecidos">
                  Ver Catálogo
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contato">Fale Conosco</Link>
              </Button>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
              <img
                src={heroBg}
                alt="Tecidos de alta qualidade"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-card rounded-lg shadow-lg border border-border p-5"
            >
              <div className="text-3xl font-bold text-primary mb-1">60+</div>
              <div className="text-sm text-muted-foreground">Anos de experiência</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
