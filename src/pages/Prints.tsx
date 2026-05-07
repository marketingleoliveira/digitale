import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Sparkles, 
  Zap, 
  Droplets, 
  Sun,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Print {
  id: string;
  code: string;
  name: string | null;
  image_url: string;
  created_at: string;
}

const Prints = () => {
  const { t } = useLanguage();
  const { whatsappNumber } = useSiteSettings();

  // Fetch latest 6 prints from database
  const { data: latestPrints, isLoading: printsLoading } = useQuery({
    queryKey: ["latest-prints"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prints")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      return data as Print[];
    },
  });

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

  return (
    <div className="min-h-screen">
      <Header />
      <SEO title="Estampas Exclusivas para Tecidos Fitness e Moda Praia" description="Estampas digitais exclusivas para tecidos fitness e moda praia. Coleções autorais com alta definição, cores vibrantes e tendências de mercado." keywords="estampas exclusivas, estampas fitness, estampas moda praia, estampas digitais, estampa para tecido, prints autorais, padronagem têxtil" />
      <main>
        {/* Como podemos ajudar - B2B Section */}
        <section className="py-20 md:py-28 bg-primary">
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
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                {t("prints.b2b.title")}
              </h1>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                {t("prints.b2b.description")}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Sparkles, key: "retail" },
                { icon: Sun, key: "quality" },
                { icon: Zap, key: "support" },
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

        {/* Technology Comparison - Digital vs Sublimação */}
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

        {/* Últimos Lançamentos - Latest 6 Prints */}
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
                Novidades
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Últimos Lançamentos
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Confira as estampas mais recentes do nosso catálogo
              </p>
            </motion.div>

            {printsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-2xl" />
                ))}
              </div>
            ) : latestPrints && latestPrints.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {latestPrints.map((print, index) => (
                    <motion.div
                      key={print.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <img
                        src={print.image_url}
                        alt={print.name || `Estampa ${print.code}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm text-white/70">Cód:</p>
                        <p className="text-lg font-bold text-white">{print.code}</p>
                        {print.name && (
                          <p className="text-sm text-white/80 mt-1">{print.name}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-center mt-12"
                >
                  <Link to="/estampas/catalogo">
                    <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      Ver Todas as Estampas
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhuma estampa cadastrada ainda.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/20">
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
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
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
