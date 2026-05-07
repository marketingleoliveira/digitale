import { motion } from "framer-motion";
import { Award, Lightbulb, Leaf, Handshake, HeadphonesIcon, PackageCheck } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { Clients } from "@/components/sections/Clients";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  const values = [
  { titleKey: "about.value.quality", descKey: "about.value.quality.desc", icon: Award },
  { titleKey: "about.value.innovation", descKey: "about.value.innovation.desc", icon: Lightbulb },
  { titleKey: "about.value.sustainability", descKey: "about.value.sustainability.desc", icon: Leaf },
  { titleKey: "about.value.partnership", descKey: "about.value.partnership.desc", icon: Handshake },
  { titleKey: "about.value.service", descKey: "about.value.service.desc", icon: HeadphonesIcon },
  { titleKey: "about.value.delivery", descKey: "about.value.delivery.desc", icon: PackageCheck }];


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <SEO title="Sobre a Digitale Têxtil – Fábrica de Tecidos Técnicos" description="Conheça a Digitale Têxtil: indústria brasileira de tecidos fitness, moda praia e malhas técnicas com inovação, qualidade e sustentabilidade desde sua fundação." keywords="sobre Digitale Têxtil, fábrica de tecidos, indústria têxtil Brasil, história Digitale, tecidos técnicos, fornecedor de malha" />
      {/* Hero */}
      <section className="pt-32 pb-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto">
            
            <span className="section-subtitle">{t("about.label")}</span>
            <h1 className="section-title mt-3 mb-6">
              {t("about.title")}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t("about.description")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto">
            
            <h2 className="section-title mb-6 text-center">{t("about.history.title")}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6 text-center">
              {t("about.history.p1")}
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10 text-center">
              {t("about.history.p2")}
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Pilares da Empresa</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {values.map((value, index) =>
              <motion.div
                key={value.titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted/50 rounded-2xl p-6 border border-border hover:border-accent/50 transition-colors">
                
                  <value.icon className="h-7 w-7 text-accent mb-3" />
                  <h4 className="font-semibold text-foreground mb-1">{t(value.titleKey)}</h4>
                  <p className="text-sm text-muted-foreground">{t(value.descKey)}</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      
      <Clients />
      <Footer />
    </div>
  );

};

export default About;