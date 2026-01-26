import { motion } from "framer-motion";
import { Phone, Mail, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export function CTA() {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 navy-gradient" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-accent/20 text-accent rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6">
              {t("cta.label")}
            </span>
            
            <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6 font-serif leading-tight px-2">
              {t("cta.title")}
            </h2>
            
            <p className="text-white/70 text-base md:text-lg lg:text-xl mb-8 md:mb-10 max-w-2xl mx-auto px-2">
              {t("cta.description")}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-8 md:mb-12 px-2">
              <Link
                to="/contato"
                className="inline-flex items-center justify-center gap-2 md:gap-3 bg-accent hover:bg-orange-light text-white px-6 md:px-10 py-4 md:py-5 rounded-full font-semibold text-sm md:text-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-1"
              >
                <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                {t("cta.button")}
              </Link>
              <a
                href="tel:+551120649662"
                className="inline-flex items-center justify-center gap-2 md:gap-3 border-2 border-white/30 text-white px-6 md:px-10 py-4 md:py-5 rounded-full font-semibold text-sm md:text-lg hover:bg-white/10 transition-all duration-300"
              >
                <Phone className="h-4 w-4 md:h-5 md:w-5" />
                {t("nav.contact")}
              </a>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8 text-white/60 text-sm md:text-base">
              <a 
                href="tel:+551120649662" 
                className="flex items-center justify-center gap-2 md:gap-3 hover:text-accent transition-colors"
              >
                <Phone className="h-4 w-4 md:h-5 md:w-5" />
                <span>+55 11 2064-9662</span>
              </a>
              <a 
                href="mailto:atendimento@digitaletextil.com.br" 
                className="flex items-center justify-center gap-2 md:gap-3 hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-xs md:text-base">atendimento@digitaletextil.com.br</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
