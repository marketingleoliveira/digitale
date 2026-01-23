import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Palette, 
  Sparkles, 
  Layers, 
  Brush, 
  Star, 
  Zap, 
  Droplets, 
  Sun,
  ShoppingBag,
  Award,
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Prints = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: Palette,
      title: t("prints.service.catalog"),
      description: t("prints.service.catalog.desc"),
      highlight: "4000+",
    },
    {
      icon: Brush,
      title: t("prints.service.exclusive"),
      description: t("prints.service.exclusive.desc"),
      highlight: t("prints.service.exclusive.highlight"),
    },
    {
      icon: Layers,
      title: t("prints.service.custom"),
      description: t("prints.service.custom.desc"),
      highlight: t("prints.service.custom.highlight"),
    },
  ];

  const advantages = [
    {
      icon: Sparkles,
      title: t("prints.advantage.quality"),
      description: t("prints.advantage.quality.desc"),
    },
    {
      icon: Sun,
      title: t("prints.advantage.durability"),
      description: t("prints.advantage.durability.desc"),
    },
    {
      icon: Droplets,
      title: t("prints.advantage.eco"),
      description: t("prints.advantage.eco.desc"),
    },
    {
      icon: Zap,
      title: t("prints.advantage.speed"),
      description: t("prints.advantage.speed.desc"),
    },
  ];

  const techComparison = [
    {
      feature: t("prints.comparison.definition"),
      digital: true,
      sublimation: false,
    },
    {
      feature: t("prints.comparison.durability"),
      digital: true,
      sublimation: false,
    },
    {
      feature: t("prints.comparison.colors"),
      digital: true,
      sublimation: false,
    },
    {
      feature: t("prints.comparison.premium"),
      digital: true,
      sublimation: false,
    },
  ];

  const categories = [
    {
      name: t("prints.category.tropical"),
      count: "120+",
      image: "https://images.unsplash.com/photo-1557971370-e7298ee473fb?w=600&q=80",
    },
    {
      name: t("prints.category.geometric"),
      count: "85+",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    },
    {
      name: t("prints.category.abstract"),
      count: "95+",
      image: "https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=600&q=80",
    },
    {
      name: t("prints.category.floral"),
      count: "150+",
      image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80",
    },
    {
      name: t("prints.category.animal"),
      count: "70+",
      image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80",
    },
    {
      name: t("prints.category.ethnic"),
      count: "60+",
      image: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&q=80",
    },
  ];

  const stats = [
    { value: "4000+", label: t("prints.stat.patterns") },
    { value: "15+", label: t("prints.stat.years") },
    { value: "1000+", label: t("prints.stat.clients") },
    { value: "60%", label: t("prints.stat.eco") },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-primary/90 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80')] bg-cover bg-center opacity-10" />
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="mb-6 bg-accent/20 text-accent border-0">
                  <Palette className="h-3 w-3 mr-1" />
                  {t("prints.label")}
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {t("prints.hero.title")}
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-8">
                  {t("prints.hero.description")}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/contato">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      {t("prints.hero.cta")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/tecidos">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      {t("prints.hero.secondary")}
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="grid grid-cols-2 gap-4">
                  {categories.slice(0, 4).map((cat, index) => (
                    <motion.div
                      key={cat.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="font-semibold">{cat.name}</p>
                        <p className="text-sm text-white/70">{cat.count} {t("prints.designs")}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="bg-accent py-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-accent-foreground">{stat.value}</div>
                  <div className="text-sm text-accent-foreground/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-accent font-medium text-sm uppercase tracking-wider">
                {t("prints.services.label")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                {t("prints.services.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("prints.services.description")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative bg-background rounded-2xl p-8 shadow-sm border border-border hover:shadow-xl hover:border-accent/50 transition-all"
                >
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                    <Badge className="bg-accent text-accent-foreground text-lg font-bold px-4 py-2">
                      {service.highlight}
                    </Badge>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-xl w-fit mb-6 group-hover:bg-accent/20 transition-colors">
                    <service.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Comparison */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="text-accent font-medium text-sm uppercase tracking-wider">
                  {t("prints.tech.label")}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  {t("prints.tech.title")}
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {t("prints.tech.description")}
                </p>

                <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm font-medium text-muted-foreground">
                    <div></div>
                    <div className="text-center">{t("prints.tech.digital")}</div>
                    <div className="text-center">{t("prints.tech.sublimation")}</div>
                  </div>
                  {techComparison.map((row, index) => (
                    <div 
                      key={row.feature}
                      className={`grid grid-cols-3 gap-4 py-4 ${
                        index !== techComparison.length - 1 ? "border-b border-border" : ""
                      }`}
                    >
                      <div className="text-sm font-medium text-foreground">{row.feature}</div>
                      <div className="flex justify-center">
                        <CheckCircle className={`h-5 w-5 ${row.digital ? "text-green-500" : "text-muted-foreground/30"}`} />
                      </div>
                      <div className="flex justify-center">
                        <CheckCircle className={`h-5 w-5 ${row.sublimation ? "text-green-500" : "text-muted-foreground/30"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {advantages.map((adv, index) => (
                  <motion.div
                    key={adv.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 p-5 bg-background rounded-xl shadow-sm border border-border"
                  >
                    <div className="p-3 bg-accent/10 rounded-lg h-fit">
                      <adv.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{adv.title}</h3>
                      <p className="text-sm text-muted-foreground">{adv.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories Gallery */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-accent font-medium text-sm uppercase tracking-wider">
                {t("prints.gallery.label")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                {t("prints.categories.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("prints.categories.description")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <Badge className="w-fit mb-3 bg-accent text-accent-foreground">
                      {category.count} {t("prints.designs")}
                    </Badge>
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* B2B Benefits */}
        <section className="py-20 bg-primary">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-accent font-medium text-sm uppercase tracking-wider">
                {t("prints.b2b.label")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                {t("prints.b2b.title")}
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                {t("prints.b2b.description")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: ShoppingBag, key: "retail" },
                { icon: Award, key: "quality" },
                { icon: Users, key: "support" },
              ].map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center"
                >
                  <div className="p-4 bg-accent/20 rounded-full w-fit mx-auto mb-6">
                    <item.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t(`prints.b2b.${item.key}.title`)}
                  </h3>
                  <p className="text-white/70">
                    {t(`prints.b2b.${item.key}.desc`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-accent/10 via-accent/5 to-transparent rounded-3xl p-12 md:p-16 text-center border border-accent/20"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t("prints.cta.title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t("prints.cta.description")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contato">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    {t("cta.button")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="https://wa.me/551120649662" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline">
                    {t("prints.cta.whatsapp")}
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Prints;
