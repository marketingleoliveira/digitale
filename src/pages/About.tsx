import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Stats } from "@/components/sections/Stats";
import { Clients } from "@/components/sections/Clients";
import { useLanguage } from "@/contexts/LanguageContext";
import athleteImg from "@/assets/athlete-model.jpg";

const About = () => {
  const { t } = useLanguage();

  const values = [
    {
      titleKey: "about.value.quality",
      descKey: "about.value.quality.desc",
    },
    {
      titleKey: "about.value.innovation",
      descKey: "about.value.innovation.desc",
    },
    {
      titleKey: "about.value.sustainability",
      descKey: "about.value.sustainability.desc",
    },
    {
      titleKey: "about.value.partnership",
      descKey: "about.value.partnership.desc",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
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
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title mb-6">{t("about.history.title")}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                {t("about.history.p1")}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {t("about.history.p2")}
              </p>

              <div className="space-y-4">
                {values.map((value, index) => (
                  <motion.div
                    key={value.titleKey}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">{t(value.titleKey)}</h4>
                      <p className="text-sm text-muted-foreground">{t(value.descKey)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                <img
                  src={athleteImg}
                  alt={t("about.image.alt")}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl">
                <p className="font-display text-4xl font-bold">60+</p>
                <p className="text-sm text-primary-foreground/80">{t("about.years")}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Stats />
      <Clients />
      <Footer />
    </div>
  );
};

export default About;
