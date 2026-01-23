import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Palette, Sparkles, Layers, Brush, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Prints = () => {
  const { t } = useLanguage();

  const printCategories = [
    {
      title: t("prints.category.tropical"),
      description: t("prints.category.tropical.desc"),
      icon: Sparkles,
      image: "https://images.unsplash.com/photo-1557971370-e7298ee473fb?w=600&q=80",
      count: "120+",
    },
    {
      title: t("prints.category.geometric"),
      description: t("prints.category.geometric.desc"),
      icon: Layers,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
      count: "85+",
    },
    {
      title: t("prints.category.abstract"),
      description: t("prints.category.abstract.desc"),
      icon: Brush,
      image: "https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=600&q=80",
      count: "95+",
    },
    {
      title: t("prints.category.floral"),
      description: t("prints.category.floral.desc"),
      icon: Palette,
      image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80",
      count: "150+",
    },
  ];

  const features = [
    {
      icon: Star,
      title: t("prints.feature.exclusive"),
      description: t("prints.feature.exclusive.desc"),
    },
    {
      icon: Palette,
      title: t("prints.feature.colors"),
      description: t("prints.feature.colors.desc"),
    },
    {
      icon: Zap,
      title: t("prints.feature.tech"),
      description: t("prints.feature.tech.desc"),
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-primary/90 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80')] bg-cover bg-center opacity-10" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium mb-6">
                {t("prints.label")}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                {t("prints.title")}
              </h1>
              <p className="text-lg md:text-xl text-white/80">
                {t("prints.description")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-6 bg-background rounded-xl shadow-sm"
                >
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Print Categories */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t("prints.categories.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("prints.categories.description")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {printCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        <category.icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
                        {category.count}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                    <p className="text-sm text-white/70">{category.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {t("prints.cta.title")}
              </h2>
              <p className="text-lg text-white/80 mb-8">
                {t("prints.cta.description")}
              </p>
              <Link to="/contato">
                <Button size="lg" variant="secondary" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  {t("cta.button")}
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

export default Prints;
