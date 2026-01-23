import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Leaf, Droplets, Zap, Recycle, TreeDeciduous, Globe, Award, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Sustainability = () => {
  const { t } = useLanguage();

  const ecoStats = [
    {
      icon: Recycle,
      value: "60",
      label: t("sustainability.bottles"),
      description: t("sustainability.bottles.desc"),
    },
    {
      icon: Globe,
      value: "65%",
      label: t("sustainability.co2"),
      description: t("sustainability.co2.desc"),
    },
    {
      icon: Droplets,
      value: "90%",
      label: t("sustainability.water"),
      description: t("sustainability.water.desc"),
    },
    {
      icon: Zap,
      value: "64%",
      label: t("sustainability.energy"),
      description: t("sustainability.energy.desc"),
    },
  ];

  const initiatives = [
    {
      icon: TreeDeciduous,
      title: t("sustainability.initiative.recycling"),
      description: t("sustainability.initiative.recycling.desc"),
    },
    {
      icon: Droplets,
      title: t("sustainability.initiative.water"),
      description: t("sustainability.initiative.water.desc"),
    },
    {
      icon: Zap,
      title: t("sustainability.initiative.energy"),
      description: t("sustainability.initiative.energy.desc"),
    },
    {
      icon: Award,
      title: t("sustainability.initiative.certifications"),
      description: t("sustainability.initiative.certifications.desc"),
    },
  ];

  const ecoProducts = [
    {
      name: "PET Reciclado",
      description: t("sustainability.product.pet.desc"),
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80",
    },
    {
      name: "Algodão Orgânico",
      description: t("sustainability.product.cotton.desc"),
      image: "https://images.unsplash.com/photo-1464490997959-0c525f9c3b51?w=600&q=80",
    },
    {
      name: "Fibras Biodegradáveis",
      description: t("sustainability.product.biodegradable.desc"),
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&q=80",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-green-900 via-green-800 to-green-700 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80')] bg-cover bg-center opacity-20" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm font-medium mb-6">
                <Leaf className="h-4 w-4" />
                {t("sustainability.label")}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {t("sustainability.page.title")}
              </h1>
              <p className="text-lg md:text-xl text-white/80">
                {t("sustainability.page.description")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Eco Stats */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("sustainability.impact.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("sustainability.description")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ecoStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative p-8 bg-background rounded-2xl shadow-sm border border-border overflow-hidden group hover:border-green-500/50 transition-colors"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/20 transition-colors" />
                  <div className="relative">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl w-fit mb-4">
                      <stat.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{stat.value}</div>
                    <h3 className="font-semibold text-foreground mb-2">{stat.label}</h3>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Initiatives */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  {t("sustainability.initiatives.title")}
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {t("sustainability.initiatives.description")}
                </p>
                <div className="space-y-6">
                  {initiatives.map((initiative, index) => (
                    <motion.div
                      key={initiative.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex gap-4"
                    >
                      <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg h-fit">
                        <initiative.icon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{initiative.title}</h3>
                        <p className="text-sm text-muted-foreground">{initiative.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80"
                  alt="Sustainability"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-green-600 text-white p-6 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-3">
                    <Heart className="h-8 w-8" />
                    <div>
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-sm text-green-100">{t("sustainability.commitment")}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Eco Products */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("sustainability.products.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("sustainability.products.description")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {ecoProducts.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-background rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <Leaf className="h-3 w-3" />
                      ECO
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                    <p className="text-muted-foreground">{product.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-green-800 to-green-900">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <Leaf className="h-12 w-12 text-green-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t("sustainability.cta.title")}
              </h2>
              <p className="text-lg text-white/80 mb-8">
                {t("sustainability.cta.description")}
              </p>
              <Link to="/contato">
                <Button size="lg" className="bg-green-500 hover:bg-green-400 text-white">
                  {t("sustainability.cta")}
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Sustainability;
