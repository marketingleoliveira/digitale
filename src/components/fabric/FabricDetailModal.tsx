import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Phone, Mail, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { ColorGallery } from "./ColorGallery";
import { FabricGallery } from "./FabricGallery";
import { FavoriteButton } from "./FavoriteButton";
import { FabricLeadForm } from "./FabricLeadForm";
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

                {/* Lead Form - replaces specs/features/applications */}
                <FabricLeadForm
                  fabricId={fabric.id}
                  fabricName={fabric.name}
                  fabricSlug={fabric.slug}
                />

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
                    <a href={`tel:+${whatsappNumber}`} className="flex items-center gap-2 hover:text-accent">
                      <Phone className="h-3 w-3" />
                      {formatPhone(whatsappNumber)}
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
