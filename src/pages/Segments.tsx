import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowRight, Waves, Dumbbell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Import segment images (using generated assets)
import segmentPraiaImg from "@/assets/hero-bg.jpg";
import segmentEsportivoImg from "@/assets/athlete-model.jpg";

const segmentCategories = [
  {
    id: "praia",
    name: "Praia",
    icon: Waves,
    description: "Tecidos de alta performance para moda praia, com proteção UV, secagem rápida e cores vibrantes.",
    image: segmentPraiaImg,
    features: ["Proteção UV 50+", "Secagem Rápida", "Resistente ao Cloro", "Cores Vibrantes"],
    fabrics: ["Oceanic", "Oceanic Eco", "Softskin", "Intense", "Caribe"],
    subcategories: [
      { name: "Biquínis", description: "Tecidos com alta elasticidade e resistência ao cloro e sal" },
      { name: "Maiôs", description: "Malhas com compressão modeladora e secagem ultra-rápida" },
      { name: "Sungas", description: "Tecidos resistentes com excelente caimento" },
      { name: "Saídas de Praia", description: "Tecidos leves e fluidos com proteção UV" },
      { name: "Camisetas Proteção UV", description: "Malhas com FPU 50+ e tecnologia antibacteriana" },
      { name: "Infantil", description: "Tecidos macios e seguros para a pele sensível" },
    ],
  },
  {
    id: "esportivo",
    name: "Esportivo",
    icon: Dumbbell,
    description: "Malhas tecnológicas para alta performance esportiva, com elasticidade superior e conforto térmico.",
    image: segmentEsportivoImg,
    features: ["Zero Transparência", "Alta Elasticidade", "Antibacteriano", "Conforto Térmico"],
    fabrics: ["Milano", "Aerodry", "Lyon", "Velocity", "Flow"],
    subcategories: [
      { name: "Academia", description: "Tecidos com compressão e respirabilidade para treinos intensos" },
      { name: "Natação", description: "Malhas hidrodinâmicas resistentes ao cloro" },
      { name: "Corrida", description: "Tecidos ultraleves com gestão de umidade" },
      { name: "Beach Tennis", description: "Proteção UV com secagem rápida" },
      { name: "Ciclismo", description: "Tecidos aerodinâmicos com alta elasticidade" },
    ],
  },
];

const Segments = () => {
  const { t } = useLanguage();
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const activeSegment = selectedSegment 
    ? segmentCategories.find(s => s.id === selectedSegment) 
    : null;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-primary via-primary/95 to-primary/90 overflow-hidden">
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
                Tecidos especializados para atender às necessidades específicas de cada mercado.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Segments Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {segmentCategories.map((segment, index) => (
                <motion.div
                  key={segment.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredSegment(segment.id)}
                  onMouseLeave={() => setHoveredSegment(null)}
                  onClick={() => setSelectedSegment(selectedSegment === segment.id ? null : segment.id)}
                >
                  <div className={`relative rounded-3xl overflow-hidden transition-all duration-500 ${
                    selectedSegment === segment.id 
                      ? "ring-4 ring-accent shadow-2xl" 
                      : "hover:shadow-xl"
                  }`}>
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={segment.image}
                        alt={segment.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-3 bg-accent rounded-xl">
                            <segment.icon className="h-6 w-6 text-accent-foreground" />
                          </div>
                          <h2 className="text-2xl md:text-3xl font-bold text-white">
                            {segment.name}
                          </h2>
                        </div>
                        <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2">
                          {segment.description}
                        </p>
                        
                        {/* Features Pills */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {segment.features.slice(0, 3).map((feature) => (
                            <span
                              key={feature}
                              className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center text-accent font-medium">
                          <span>Ver aplicações</span>
                          <ChevronRight className={`h-5 w-5 ml-1 transition-transform duration-300 ${
                            selectedSegment === segment.id ? "rotate-90" : ""
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  {selectedSegment === segment.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 p-6 bg-muted/50 rounded-2xl border border-border"
                    >
                      {/* Subcategories */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                          Aplicações
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {segment.subcategories.map((sub) => (
                            <div
                              key={sub.name}
                              className="p-3 bg-background rounded-xl border border-border/50 hover:border-accent/30 transition-colors"
                            >
                              <h4 className="font-medium text-foreground text-sm mb-1">
                                {sub.name}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {sub.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Recommended Fabrics */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                          Tecidos Recomendados
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {segment.fabrics.map((fabric) => (
                            <Link
                              key={fabric}
                              to={`/tecidos`}
                              className="px-4 py-2 bg-accent/10 border border-accent/30 rounded-full text-sm text-accent font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                            >
                              {fabric}
                            </Link>
                          ))}
                        </div>
                      </div>
                      
                      <Link to="/tecidos">
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                          Ver Todos os Tecidos
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </motion.div>
                  )}
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
