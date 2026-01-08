import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-primary p-12 md:p-16 lg:p-20"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 400">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-foreground mb-6">
              Pronto para elevar a qualidade dos seus produtos?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-10">
              Entre em contato conosco e descubra como nossos tecidos de alta tecnologia podem transformar sua produção.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="accent" className="group">
                <Link to="/contato">
                  Fale Conosco
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
                <Link to="/tecidos">Ver Catálogo</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
