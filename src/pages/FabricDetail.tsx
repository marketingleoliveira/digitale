import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Phone, Mail, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ColorGallery } from "@/components/fabric/ColorGallery";
import fabricMilano from "@/assets/fabric-milano.jpg";
import fabricLyon from "@/assets/fabric-lyon.jpg";
import fabricAerodry from "@/assets/fabric-aerodry.jpg";
import fabricVeneza from "@/assets/fabric-veneza.jpg";

const defaultImages: Record<string, string> = {
  milano: fabricMilano,
  lyon: fabricLyon,
  aerodry: fabricAerodry,
  veneza: fabricVeneza,
};

interface ColorVariant {
  name: string;
  hex: string;
}

export default function FabricDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();

  const { data: fabric, isLoading, error } = useQuery({
    queryKey: ["fabric", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabrics")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: otherFabrics } = useQuery({
    queryKey: ["other-fabrics", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabrics")
        .select("*")
        .eq("is_active", true)
        .neq("slug", slug)
        .order("display_order")
        .limit(3);

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-16">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid lg:grid-cols-2 gap-12">
              <Skeleton className="aspect-square rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !fabric) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-6 py-32 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Tecido não encontrado</h1>
            <p className="text-muted-foreground mb-8">O tecido que você procura não está disponível.</p>
            <Link to="/tecidos" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Ver todos os tecidos
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const features = Array.isArray(fabric.features) ? fabric.features : [];
  const specifications = fabric.specifications as Record<string, string> || {};
  const applications = fabric.applications || [];
  const colorVariants = Array.isArray(fabric.color_variants) 
    ? (fabric.color_variants as unknown as ColorVariant[])
    : [];
  const imageUrl = fabric.image_url || defaultImages[fabric.slug] || fabricMilano;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="bg-secondary/30 border-b border-border">
          <div className="container mx-auto px-6 py-4">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-accent">Home</Link>
              <span>/</span>
              <Link to="/tecidos" className="hover:text-accent">Tecidos</Link>
              <span>/</span>
              <span className="text-foreground font-medium">{fabric.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={imageUrl}
                    alt={fabric.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div>
                  <span className="section-subtitle">{t("products.label")}</span>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                    {fabric.name}
                  </h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {fabric.description || fabric.short_description}
                  </p>
                </div>

                {/* Color Gallery */}
                {colorVariants.length > 0 && (
                  <ColorGallery colors={colorVariants} />
                )}

                {/* Features */}
                {features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4">Características</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-4 w-4 text-accent" />
                          </div>
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {Object.keys(specifications).length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4">Especificações Técnicas</h3>
                    <div className="bg-secondary/50 rounded-2xl p-6 space-y-3">
                      {Object.entries(specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center border-b border-border/50 pb-3 last:border-0 last:pb-0">
                          <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="font-medium text-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Applications */}
                {applications.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4">Aplicações</h3>
                    <div className="flex flex-wrap gap-2">
                      {applications.map((app: string, index: number) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="pt-4 space-y-4">
                  <Link
                    to="/contato"
                    className="btn-primary w-full text-center block"
                  >
                    {t("cta.button")}
                  </Link>
                  <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                    <a href="tel:+551120649662" className="flex items-center gap-2 hover:text-accent">
                      <Phone className="h-4 w-4" />
                      +55 11 2064-9662
                    </a>
                    <a href="mailto:atendimento@digitaletextil.com.br" className="flex items-center gap-2 hover:text-accent">
                      <Mail className="h-4 w-4" />
                      atendimento@digitaletextil.com.br
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Other Fabrics */}
        {otherFabrics && otherFabrics.length > 0 && (
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-6">
              <h2 className="text-2xl font-bold text-foreground mb-8">Outros Tecidos</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {otherFabrics.map((otherFabric) => (
                  <Link
                    key={otherFabric.id}
                    to={`/tecidos/${otherFabric.slug}`}
                    className="group block bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={otherFabric.image_url || defaultImages[otherFabric.slug] || fabricMilano}
                        alt={otherFabric.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                        {otherFabric.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
                        {otherFabric.short_description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-accent font-semibold text-sm mt-4">
                        Ver detalhes
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
