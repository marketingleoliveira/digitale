import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Phone, Mail, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { ColorGallery } from "./ColorGallery";
import { FabricGallery } from "./FabricGallery";
import { FavoriteButton } from "./FavoriteButton";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ColorVariant {
  name: string;
  hex: string;
}

interface GalleryImage {
  url: string;
  alt?: string;
}

interface FabricDetailModalProps {
  fabric: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    short_description?: string | null;
    image_url?: string | null;
    features?: unknown;
    specifications?: unknown;
    applications?: string[] | null;
    color_variants?: unknown;
    gallery_images?: unknown;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultImages: Record<string, string>;
  fallbackImage: string;
}

export function FabricDetailModal({
  fabric,
  open,
  onOpenChange,
  defaultImages,
  fallbackImage,
}: FabricDetailModalProps) {
  const { t } = useLanguage();
  const { whatsappNumber } = useSiteSettings();

  const formatPhone = (num: string) => {
    if (num.length === 13) return `+${num.slice(0,2)} ${num.slice(2,4)} ${num.slice(4,9)}-${num.slice(9)}`;
    if (num.length === 12) return `+${num.slice(0,2)} ${num.slice(2,4)} ${num.slice(4,8)}-${num.slice(8)}`;
    return num;
  };

  if (!fabric) return null;

  const features = Array.isArray(fabric.features) ? fabric.features : [];
  const specifications = (fabric.specifications as Record<string, string>) || {};
  const applications = fabric.applications || [];
  const colorVariants = Array.isArray(fabric.color_variants)
    ? (fabric.color_variants as unknown as ColorVariant[])
    : [];
  const galleryImages = Array.isArray(fabric.gallery_images)
    ? (fabric.gallery_images as unknown as GalleryImage[])
    : [];
  const imageUrl = fabric.image_url || defaultImages[fabric.slug] || fallbackImage;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-accent font-semibold uppercase tracking-widest text-xs">
                    {t("products.label")}
                  </span>
                  <DialogTitle className="text-2xl md:text-3xl font-bold text-foreground mt-1">
                    {fabric.name}
                  </DialogTitle>
                </div>
                <FavoriteButton fabric={fabric as any} size="md" />
              </div>
            </DialogHeader>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Gallery */}
              <div>
                <FabricGallery
                  mainImage={imageUrl}
                  images={galleryImages}
                  fabricName={fabric.name}
                />
              </div>

              {/* Content */}
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {fabric.description || fabric.short_description}
                </p>

                {/* Color Gallery */}
                {colorVariants.length > 0 && (
                  <ColorGallery colors={colorVariants} />
                )}

                {/* Features */}
                {features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-3">Características</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(features as string[]).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-accent" />
                          </div>
                          <span className="text-foreground text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specifications */}
                {Object.keys(specifications).length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-3">Especificações Técnicas</h3>
                    <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                      {Object.entries(specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-0 last:pb-0">
                          <span className="text-muted-foreground text-sm capitalize">{key.replace(/_/g, " ")}</span>
                          <span className="font-medium text-foreground text-sm">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Applications */}
                {applications.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-3">Aplicações</h3>
                    <div className="flex flex-wrap gap-2">
                      {applications.map((app, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="pt-2 space-y-3">
                  <Link
                    to="/contato"
                    className="btn-primary w-full text-center block"
                    onClick={() => onOpenChange(false)}
                  >
                    {t("cta.button")}
                  </Link>
                  <div className="flex flex-col sm:flex-row gap-3 text-xs text-muted-foreground">
                    <a href="tel:+551120649662" className="flex items-center gap-2 hover:text-accent">
                      <Phone className="h-3 w-3" />
                      +55 11 2064-9662
                    </a>
                    <a href="mailto:atendimento@digitaletextil.com.br" className="flex items-center gap-2 hover:text-accent">
                      <Mail className="h-3 w-3" />
                      atendimento@digitaletextil.com.br
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
