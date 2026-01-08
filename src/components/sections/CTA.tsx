import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export function CTA() {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t("cta.title")}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            {t("cta.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              to="/contato"
              className="inline-block bg-white text-primary px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              {t("cta.button")}
            </Link>
            <a
              href="tel:+551120649662"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {t("nav.contact")}
            </a>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 text-white/70 text-sm">
            <a href="tel:+551120649662" className="flex items-center justify-center gap-2 hover:text-white">
              <Phone className="h-4 w-4" />
              +55 11 2064-9662
            </a>
            <a href="mailto:atendimento@digitaletextil.com.br" className="flex items-center justify-center gap-2 hover:text-white">
              <Mail className="h-4 w-4" />
              atendimento@digitaletextil.com.br
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
