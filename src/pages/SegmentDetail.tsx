import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Waves, Dumbbell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback images
import segmentPraiaImg from "@/assets/segment-praia.jpg";
import segmentEsportivoImg from "@/assets/segment-esportivo.jpg";
import praiaGallery1 from "@/assets/segment-praia-gallery-1.jpg";
import praiaGallery2 from "@/assets/segment-praia-gallery-2.jpg";
import praiaGallery3 from "@/assets/segment-praia-gallery-3.jpg";
import esportivoGallery1 from "@/assets/segment-esportivo-gallery-1.jpg";
import esportivoGallery2 from "@/assets/segment-esportivo-gallery-2.jpg";
import esportivoGallery3 from "@/assets/segment-esportivo-gallery-3.jpg";

interface Subcategory {
  name: string;
  description: string;
  features: string[];
}

interface Benefit {
  title: string;
  description: string;
}

interface Fabric {
  name: string;
  slug: string;
}

interface GalleryImage {
  url: string;
  alt?: string;
}

interface Segment {
  id: string;
  slug: string;
  name: string;
  icon: string;
  hero_image: string | null;
  gallery_images: GalleryImage[];
  description: string | null;
  long_description: string | null;
  features: string[];
  fabrics: Fabric[];
  subcategories: Subcategory[];
  benefits: Benefit[];
}

const fallbackImages: Record<string, string> = {
  praia: segmentPraiaImg,
  esportivo: segmentEsportivoImg,
};

const fallbackGalleries: Record<string, string[]> = {
  praia: [praiaGallery1, praiaGallery2, praiaGallery3],
  esportivo: [esportivoGallery1, esportivoGallery2, esportivoGallery3],
};

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  waves: Waves,
  dumbbell: Dumbbell,
};

const SegmentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const { data: segment, isLoading, error } = useQuery({
    queryKey: ["segment", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("segments")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Parse JSONB fields safely
      const parseArray = <T,>(val: any): T[] => {
        if (Array.isArray(val)) return val as T[];
        return [];
      };

      const galleryImages = parseArray<any>(data.gallery_images).map((img: any) => 
        typeof img === 'string' ? { url: img, alt: '' } : { url: img?.url || '', alt: img?.alt || '' }
      );

      return {
        id: data.id,
        slug: data.slug,
        name: data.name,
        icon: data.icon,
        hero_image: data.hero_image,
        gallery_images: galleryImages as GalleryImage[],
        description: data.description,
        long_description: data.long_description,
        features: parseArray<string>(data.features),
        fabrics: parseArray<Fabric>(data.fabrics),
        subcategories: parseArray<Subcategory>(data.subcategories),
        benefits: parseArray<Benefit>(data.benefits),
      } as Segment;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main>
          <Skeleton className="h-[60vh] w-full" />
          <div className="container mx-auto px-6 py-16">
            <div className="grid md:grid-cols-3 gap-4">
              <Skeleton className="aspect-[4/3] rounded-2xl" />
              <Skeleton className="aspect-[4/3] rounded-2xl" />
              <Skeleton className="aspect-[4/3] rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!segment) {
    return <Navigate to="/segmentos" replace />;
  }

  const IconComponent = iconComponents[segment.icon] || Waves;
  const heroImage = segment.hero_image || fallbackImages[segment.slug] || segmentPraiaImg;
  
  // Get gallery images, falling back to local images if none uploaded
  const galleryImages = segment.gallery_images.length > 0 
    ? segment.gallery_images.map(img => img.url)
    : fallbackGalleries[segment.slug] || [];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
          <img
            src={heroImage}
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

        {/* About Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
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
                  {segment.long_description || segment.description}
                </p>
                
                {segment.features.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {segment.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-accent flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {segment.benefits.length > 0 && (
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
              )}
            </div>
          </div>
        </section>

        {/* Applications & Recommended Fabrics Combined Section */}
        {(segment.subcategories.length > 0 || segment.fabrics.length > 0) && (
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                  Aplicações & Tecidos
                </h2>
                
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Applications - Left Side */}
                  {segment.subcategories.length > 0 && (
                    <div className="lg:col-span-2">
                      {/* Tabs */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {segment.subcategories.map((sub, index) => (
                          <button
                            key={sub.name}
                            onClick={() => setActiveTab(index)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              activeTab === index
                                ? "bg-accent text-accent-foreground"
                                : "bg-background text-muted-foreground hover:text-foreground border border-border"
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>

                      {/* Tab Content */}
                      <AnimatePresence mode="wait">
                        {segment.subcategories[activeTab] && (
                          <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="bg-background rounded-2xl p-6 border border-border"
                          >
                            <h3 className="text-xl font-bold text-foreground mb-3">
                              {segment.subcategories[activeTab].name}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {segment.subcategories[activeTab].description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {segment.subcategories[activeTab].features?.map((feature) => (
                                <span
                                  key={feature}
                                  className="px-3 py-1.5 bg-accent/10 border border-accent/30 rounded-full text-xs text-accent font-medium"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Recommended Fabrics - Right Side */}
                  {segment.fabrics.length > 0 && (
                    <div className={segment.subcategories.length > 0 ? "lg:col-span-1" : "lg:col-span-3"}>
                      <div className="bg-background rounded-2xl p-6 border border-border h-full">
                        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-accent rounded-full"></span>
                          Tecidos Recomendados
                        </h3>
                        <div className={`grid gap-3 ${segment.subcategories.length > 0 ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"}`}>
                          {segment.fabrics.map((fabric) => (
                            <Link
                              key={fabric.slug}
                              to={`/tecidos/${fabric.slug}`}
                              className="group flex items-center gap-3 p-3 bg-muted/50 rounded-xl hover:bg-accent/10 hover:border-accent/30 border border-transparent transition-all"
                            >
                              <div className="w-2 h-2 bg-accent/50 rounded-full group-hover:bg-accent transition-colors"></div>
                              <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                                {fabric.name}
                              </span>
                              <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          ))}
                        </div>
                        
                        <Link 
                          to="/tecidos"
                          className="mt-4 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-accent hover:bg-accent/5 rounded-lg transition-colors border border-accent/20"
                        >
                          Ver todos os tecidos
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Gallery Section */}
        {galleryImages.length > 0 && (
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
                  {galleryImages.map((image, index) => (
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
        )}

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
