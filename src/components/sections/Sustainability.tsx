import { motion } from "framer-motion";
import { Leaf, Droplets, Zap, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export function Sustainability() {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Recycle,
      title: t("sustainability.bottles"),
      description: t("sustainability.bottles.desc"),
    },
    {
      icon: Leaf,
      title: t("sustainability.co2"),
      description: t("sustainability.co2.desc"),
    },
    {
      icon: Droplets,
      title: t("sustainability.water"),
      description: t("sustainability.water.desc"),
    },
    {
      icon: Zap,
      title: t("sustainability.energy"),
      description: t("sustainability.energy.desc"),
    },
  ];

  return (
    <section className="py-24 bg-digitale-green/5 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-digitale-green font-medium tracking-[0.2em] uppercase text-sm mb-4">
              {t("sustainability.label")}
            </span>
            <h2 className="section-title mb-6">
              {t("sustainability.title")}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {t("sustainability.description")}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-digitale-green/10 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="h-6 w-6 text-digitale-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button asChild variant="eco" size="lg">
              <Link to="/sustentabilidade">{t("sustainability.cta")}</Link>
            </Button>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-digitale-green/20 to-digitale-green/5 rounded-full" />
              <div className="absolute inset-8 bg-gradient-to-br from-digitale-green/30 to-digitale-green/10 rounded-full" />
              <div className="absolute inset-16 bg-digitale-green/20 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <Recycle className="h-20 w-20 text-digitale-green mx-auto mb-4" />
                  <p className="font-display text-2xl font-semibold text-digitale-green">100%</p>
                  <p className="text-sm text-muted-foreground">{t("sustainability.sustainable")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
