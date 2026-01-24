import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const segments = [
  {
    id: "praia",
    name: "Moda Praia",
    description: "Tecidos de alta performance para moda praia, com proteção UV, secagem rápida e cores vibrantes que não desbotam com o sol e a água salgada.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    features: ["Proteção UV 50+", "Secagem Rápida", "Resistente ao Cloro", "Cores Vibrantes"],
    fabrics: ["Milano", "Veneza", "Lyon"],
  },
  {
    id: "fitwear",
    name: "Fitwear",
    description: "Malhas tecnológicas para roupas fitness e esportivas, com elasticidade superior, zero transparência e tecnologias de conforto térmico.",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
    features: ["Zero Transparência", "Alta Elasticidade", "Antibacteriano", "Conforto Térmico"],
    fabrics: ["Milano", "Aerodry", "Lyon"],
  },
  {
    id: "lingerie",
    name: "Lingerie",
    description: "Tecidos macios e delicados para lingerie e pijamas, com toque suave, boa elasticidade e acabamento premium.",
    image: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=800&q=80",
    features: ["Toque Suave", "Elasticidade", "Conforto", "Durabilidade"],
    fabrics: ["Veneza", "Milano"],
  },
  {
    id: "natacao",
    name: "Natação",
    description: "Tecidos específicos para competição e treino de natação, com resistência ao cloro, hidrodinâmica e durabilidade excepcional.",
    image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80",
    features: ["Resistente ao Cloro", "Hidrodinâmico", "Compressão", "Longa Durabilidade"],
    fabrics: ["Milano", "Lyon"],
  },
];

const Segments = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary via-primary/95 to-primary/90 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80')] bg-cover bg-center opacity-10" />
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-accent font-medium text-sm uppercase tracking-wider">
                Segmentos
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6 leading-tight">
                Soluções para Cada Segmento
              </h1>
              <p className="text-lg md:text-xl text-white/80">
                Desenvolvemos tecidos especializados para atender às necessidades específicas de cada mercado, garantindo qualidade e performance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Segments Grid */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6">
            <div className="space-y-24">
              {segments.map((segment, index) => (
                <motion.div
                  key={segment.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden group">
                      <img
                        src={segment.image}
                        alt={segment.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-6 left-6">
                        <span className="px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium">
                          {segment.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                      {segment.name}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                      {segment.description}
                    </p>

                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                        Características
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {segment.features.map((feature) => (
                          <span
                            key={feature}
                            className="px-4 py-2 bg-muted rounded-full text-sm text-foreground"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                        Tecidos Recomendados
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {segment.fabrics.map((fabric) => (
                          <span
                            key={fabric}
                            className="px-4 py-2 bg-accent/10 border border-accent/30 rounded-full text-sm text-accent font-medium"
                          >
                            {fabric}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link to="/tecidos">
                      <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        Ver Tecidos
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary to-primary/90 rounded-3xl p-12 md:p-16 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Não encontrou seu segmento?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Entre em contato conosco. Nossa equipe pode desenvolver soluções personalizadas para atender às necessidades específicas do seu mercado.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contato">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Fale Conosco
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="https://wa.me/551120649662" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    WhatsApp
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

export default Segments;
