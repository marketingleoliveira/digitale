import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTA() {
  return (
    <section className="py-20 lg:py-28 bg-primary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-primary-foreground mb-6">
            Pronto para elevar a qualidade dos seus produtos?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10">
            Entre em contato com nossa equipe e descubra como nossos tecidos podem transformar sua produção.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button asChild size="lg" variant="secondary" className="group">
              <Link to="/contato">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/10"
            >
              <a href="tel:+551120649662">
                <Phone className="mr-2 h-4 w-4" />
                Ligar Agora
              </a>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 text-primary-foreground/70 text-sm">
            <a href="tel:+551120649662" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <Phone className="h-4 w-4" />
              +55 11 2064-9662
            </a>
            <a href="mailto:atendimento@digitaletextil.com.br" className="flex items-center gap-2 hover:text-primary-foreground transition-colors">
              <Mail className="h-4 w-4" />
              atendimento@digitaletextil.com.br
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
