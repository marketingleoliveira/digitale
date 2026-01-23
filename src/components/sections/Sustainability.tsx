import { motion } from "framer-motion";
import { Leaf, Droplets, Zap, Recycle, ArrowRight, CheckCircle } from "lucide-react";
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
      stat: "500K+",
      statLabel: "garrafas recicladas/mês",
    },
    {
      icon: Leaf,
      title: t("sustainability.co2"),
      description: t("sustainability.co2.desc"),
      stat: "40%",
      statLabel: "menos emissões",
    },
    {
      icon: Droplets,
      title: t("sustainability.water"),
      description: t("sustainability.water.desc"),
      stat: "60%",
      statLabel: "economia de água",
    },
    {
      icon: Zap,
      title: t("sustainability.energy"),
      description: t("sustainability.energy.desc"),
      stat: "30%",
      statLabel: "energia renovável",
    },
  ];

  const certifications = [
    "ISO 14001",
    "OEKO-TEX®",
    "Bluesign®",
    "GRS Certified",
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-6">
              <Leaf className="h-4 w-4" />
              {t("sustainability.label")}
            </span>
            
            <h2 className="section-title mb-6">
              {t("sustainability.title")}
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              {t("sustainability.description")}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mb-10">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border border-green-100 dark:border-green-900/30"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{benefit.stat}</p>
                  <p className="text-sm text-muted-foreground">{benefit.statLabel}</p>
                </motion.div>
              ))}
            </div>

            {/* Certifications */}
            <div className="flex flex-wrap gap-3 mb-8">
              {certifications.map((cert) => (
                <span
                  key={cert}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-card rounded-full text-sm font-medium text-foreground border border-border"
                >
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {cert}
                </span>
              ))}
            </div>

            <Link
              to="/sustentabilidade"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-green-600/30"
            >
              {t("sustainability.cta")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              {/* Animated Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-green-200 dark:border-green-800 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border-4 border-dashed border-green-300 dark:border-green-700 rounded-full"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-16 border-4 border-dashed border-green-400 dark:border-green-600 rounded-full"
              />
              
              {/* Center Content */}
              <div className="absolute inset-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                <div className="text-center text-white">
                  <Recycle className="h-16 w-16 mx-auto mb-3" />
                  <p className="text-4xl font-bold">100%</p>
                  <p className="text-sm opacity-90">{t("sustainability.sustainable")}</p>
                </div>
              </div>

              {/* Floating Icons */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-4 right-4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center"
              >
                <Leaf className="h-8 w-8 text-green-500" />
              </motion.div>
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center"
              >
                <Droplets className="h-8 w-8 text-blue-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
