import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export function CTA() {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
      
      {/* Dotted Pattern Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-[0.08]" 
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--background)) 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Subtle glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Label Badge */}
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-full text-xs md:text-sm font-semibold mb-6 md:mb-8 shadow-lg shadow-accent/30"
            >
              {t("cta.label")}
            </motion.span>
            
            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground mb-5 md:mb-6 leading-tight tracking-tight">
              {t("cta.title")}
            </h2>
            
            {/* Description */}
            <p className="text-primary-foreground/70 text-base md:text-lg lg:text-xl mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              {t("cta.description")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16">
              <Link
                to="/contato"
                className="inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent/90 text-accent-foreground px-8 md:px-10 py-4 md:py-5 rounded-full font-semibold text-base md:text-lg transition-all duration-300 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-1 active:translate-y-0"
              >
                <MessageCircle className="h-5 w-5" />
                {t("cta.button")}
              </Link>
              <a
                href="tel:+551120649662"
                className="inline-flex items-center justify-center gap-3 border-2 border-primary-foreground/30 text-primary-foreground px-8 md:px-10 py-4 md:py-5 rounded-full font-semibold text-base md:text-lg hover:bg-primary-foreground/10 hover:border-primary-foreground/50 transition-all duration-300"
              >
                <Phone className="h-5 w-5" />
                {t("nav.contact")}
              </a>
            </div>

            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-10 text-primary-foreground/60"
            >
              <a 
                href="tel:+551120649662" 
                className="flex items-center gap-3 hover:text-accent transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm md:text-base font-medium">+55 11 2064-9662</span>
              </a>
              <a 
                href="mailto:atendimento@digitaletextil.com.br" 
                className="flex items-center gap-3 hover:text-accent transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-sm md:text-base font-medium">atendimento@digitaletextil.com.br</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
