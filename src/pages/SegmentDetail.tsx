import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Waves, Dumbbell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Import segment images
import segmentPraiaImg from "@/assets/segment-praia.jpg";
import segmentEsportivoImg from "@/assets/segment-esportivo.jpg";

// Gallery images - Praia
import praiaGallery1 from "@/assets/segment-praia-gallery-1.jpg";
import praiaGallery2 from "@/assets/segment-praia-gallery-2.jpg";
import praiaGallery3 from "@/assets/segment-praia-gallery-3.jpg";

// Gallery images - Esportivo
import esportivoGallery1 from "@/assets/segment-esportivo-gallery-1.jpg";
import esportivoGallery2 from "@/assets/segment-esportivo-gallery-2.jpg";
import esportivoGallery3 from "@/assets/segment-esportivo-gallery-3.jpg";

interface Subcategory {
  name: string;
  description: string;
  features: string[];
}

interface SegmentData {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  heroImage: string;
  gallery: string[];
  description: string;
  longDescription: string;
  features: string[];
  fabrics: { name: string; slug: string }[];
  subcategories: Subcategory[];
  benefits: { title: string; description: string }[];
}

const segmentsData: Record<string, SegmentData> = {
  praia: {
    id: "praia",
    name: "Praia",
    icon: Waves,
    heroImage: segmentPraiaImg,
    gallery: [praiaGallery1, praiaGallery2, praiaGallery3],
    description: "Tecidos de alta performance para moda praia, com proteção UV, secagem rápida e cores vibrantes.",
    longDescription: "Nossa linha de tecidos para moda praia foi desenvolvida pensando nas necessidades específicas deste segmento. Com tecnologias exclusivas de proteção UV, resistência ao cloro e secagem ultra-rápida, nossos tecidos garantem durabilidade, conforto e cores vibrantes que não desbotam mesmo após exposição prolongada ao sol e água salgada.",
    features: ["Proteção UV 50+", "Secagem Rápida", "Resistente ao Cloro", "Cores Vibrantes", "Alta Elasticidade", "Antibacteriano"],
    fabrics: [
      { name: "Oceanic", slug: "oceanic" },
      { name: "Oceanic Eco", slug: "oceanic-eco" },
      { name: "Softskin", slug: "softskin" },
      { name: "Intense", slug: "intense" },
      { name: "Caribe", slug: "caribe" },
    ],
    subcategories: [
      { 
        name: "Biquínis", 
        description: "Tecidos com alta elasticidade e resistência ao cloro e sal, perfeitos para criar peças que mantêm a forma e as cores por muito mais tempo.",
        features: ["Alta elasticidade", "Resistência ao sal", "Secagem rápida"]
      },
      { 
        name: "Maiôs", 
        description: "Malhas com compressão modeladora e secagem ultra-rápida, ideais para peças que valorizam o corpo com conforto.",
        features: ["Compressão modeladora", "Toque suave", "Durabilidade"]
      },
      { 
        name: "Sungas", 
        description: "Tecidos resistentes com excelente caimento, desenvolvidos para oferecer liberdade de movimento e durabilidade.",
        features: ["Excelente caimento", "Resistência", "Conforto"]
      },
      { 
        name: "Saídas de Praia", 
        description: "Tecidos leves e fluidos com proteção UV, perfeitos para criar peças elegantes e funcionais.",
        features: ["Leveza", "Fluidez", "Proteção UV"]
      },
      { 
        name: "Camisetas Proteção UV", 
        description: "Malhas com FPU 50+ e tecnologia antibacteriana, essenciais para proteção solar com estilo.",
        features: ["FPU 50+", "Antibacteriano", "Respirável"]
      },
      { 
        name: "Infantil", 
        description: "Tecidos macios e seguros para a pele sensível das crianças, com todas as tecnologias de proteção.",
        features: ["Toque macio", "Hipoalergênico", "Proteção total"]
      },
    ],
    benefits: [
      { title: "Durabilidade Superior", description: "Tecidos que resistem a centenas de lavagens sem perder cor ou elasticidade." },
      { title: "Conforto Térmico", description: "Tecnologia que regula a temperatura e mantém o corpo fresco." },
      { title: "Sustentabilidade", description: "Opções eco-friendly com fibras recicladas e certificação GRS." },
    ]
  },
  esportivo: {
    id: "esportivo",
    name: "Esportivo",
    icon: Dumbbell,
    heroImage: segmentEsportivoImg,
    gallery: [esportivoGallery1, esportivoGallery2, esportivoGallery3],
    description: "Malhas tecnológicas para alta performance esportiva, com elasticidade superior e conforto térmico.",
    longDescription: "Nossa linha esportiva foi desenvolvida para atletas e entusiastas do fitness que exigem o máximo de performance. Com tecnologias de compressão, gestão de umidade e antibacteriano, nossos tecidos oferecem suporte muscular, conforto térmico e liberdade de movimento para qualquer tipo de atividade física.",
    features: ["Zero Transparência", "Alta Elasticidade", "Antibacteriano", "Conforto Térmico", "Compressão", "Secagem Rápida"],
    fabrics: [
      { name: "Milano", slug: "milano" },
      { name: "Aerodry", slug: "aerodry" },
      { name: "Lyon", slug: "lyon" },
      { name: "Velocity", slug: "velocity" },
      { name: "Flow", slug: "flow" },
    ],
    subcategories: [
      { 
        name: "Academia", 
        description: "Tecidos com compressão e respirabilidade para treinos intensos, oferecendo suporte muscular e conforto.",
        features: ["Compressão", "Respirabilidade", "Zero transparência"]
      },
      { 
        name: "Natação", 
        description: "Malhas hidrodinâmicas resistentes ao cloro, desenvolvidas para performance na água.",
        features: ["Hidrodinâmico", "Resistente ao cloro", "Secagem rápida"]
      },
      { 
        name: "Corrida", 
        description: "Tecidos ultraleves com gestão de umidade, perfeitos para longas distâncias.",
        features: ["Ultraleve", "Gestão de umidade", "Termorregulação"]
      },
      { 
        name: "Beach Tennis", 
        description: "Proteção UV com secagem rápida, ideal para esportes de praia.",
        features: ["Proteção UV", "Secagem rápida", "Leveza"]
      },
      { 
        name: "Ciclismo", 
        description: "Tecidos aerodinâmicos com alta elasticidade, projetados para performance sobre duas rodas.",
        features: ["Aerodinâmico", "Alta elasticidade", "Conforto prolongado"]
      },
    ],
    benefits: [
      { title: "Performance Superior", description: "Tecidos que acompanham cada movimento sem restrição." },
      { title: "Recuperação Muscular", description: "Compressão graduada que auxilia na recuperação pós-treino." },
      { title: "Anti-odor", description: "Tecnologia antibacteriana que mantém a roupa fresca por mais tempo." },
    ]
  }
};

const SegmentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const segment = slug ? segmentsData[slug] : null;

  if (!segment) {
    return <Navigate to="/segmentos" replace />;
  }

  const IconComponent = segment.icon;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={segment.heroImage}
            alt={segment.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-6 pb-12 md:pb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Link 
                  to="/segmentos" 
                  className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Voltar para Segmentos</span>
                </Link>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-accent rounded-xl">
                    <IconComponent className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                    {segment.name}
                  </h1>
                </div>
                <p className="text-lg md:text-xl text-white/80 max-w-2xl">
                  {segment.description}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                Galeria
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {segment.gallery.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`${segment.name} - Imagem ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Sobre o Segmento
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  {segment.longDescription}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {segment.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {segment.benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="p-6 bg-muted/50 rounded-2xl border border-border/50"
                  >
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Applications Section */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                Aplicações
              </h2>
              
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                {segment.subcategories.map((sub, index) => (
                  <button
                    key={sub.name}
                    onClick={() => setActiveTab(index)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeTab === index
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="bg-background rounded-3xl p-8 border border-border"
                >
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {segment.subcategories[activeTab].name}
                  </h3>
                  <p className="text-muted-foreground text-lg mb-6">
                    {segment.subcategories[activeTab].description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {segment.subcategories[activeTab].features.map((feature) => (
                      <span
                        key={feature}
                        className="px-4 py-2 bg-accent/10 border border-accent/30 rounded-full text-sm text-accent font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Recommended Fabrics */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                Tecidos Recomendados
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {segment.fabrics.map((fabric) => (
                  <Link
                    key={fabric.slug}
                    to={`/tecidos/${fabric.slug}`}
                    className="group p-6 bg-muted/50 rounded-2xl border border-border/50 hover:border-accent/50 hover:bg-accent/5 transition-all text-center"
                  >
                    <span className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                      {fabric.name}
                    </span>
                  </Link>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Link to="/tecidos">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Ver Todos os Tecidos
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/90">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Precisa de uma solução personalizada?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Nossa equipe está pronta para desenvolver tecidos sob medida para as necessidades específicas do seu projeto.
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

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
              <motion.img
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                src={selectedImage}
                alt="Imagem ampliada"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default SegmentDetail;
