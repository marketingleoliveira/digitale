import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Star, VolumeX } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRef, useState } from "react";

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_company: string | null;
  author_photo_url: string | null;
  video_url: string | null;
  rating: number;
  years_partnership: string | null;
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isInView) {
      v.muted = isMuted;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isInView, isMuted]);

  const handleUnmute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setIsMuted(false);
    v.play().catch(() => {});
  };

  const hasVideo = !!t.video_url;

  return (
    <div
      ref={containerRef}
      className="bg-card rounded-2xl shadow-lg overflow-hidden flex flex-col border border-border hover:shadow-xl transition-shadow"
    >
      <div className="relative bg-black h-[280px]">
        {hasVideo ? (
          <>
            <video
              ref={videoRef}
              src={t.video_url!}
              controls
              autoPlay
              muted={isMuted}
              playsInline
              loop
              preload="metadata"
              poster={t.author_photo_url || undefined}
              className="w-full h-full object-cover"
            />
            {isMuted && (
              <button
                type="button"
                onClick={handleUnmute}
                aria-label="Ativar som"
                className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-black/80 transition-colors animate-pulse"
              >
                <VolumeX className="h-3.5 w-3.5" />
                Ativar som
              </button>
            )}
          </>
        ) : t.author_photo_url ? (
          <img
            src={t.author_photo_url}
            alt={t.author_name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-6xl font-bold">
            {t.author_name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex gap-1 mb-3">
          {[...Array(t.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-accent text-accent" />
          ))}
        </div>
        <blockquote className="text-foreground text-sm leading-relaxed mb-4 flex-1">
          "{t.quote}"
        </blockquote>
        <div className="pt-4 border-t border-border">
          <p className="font-bold text-foreground">{t.author_name}</p>
          {t.author_company && (
            <p className="text-accent text-sm font-medium mt-0.5">{t.author_company}</p>
          )}
          {t.years_partnership && (
            <span className="inline-flex items-center px-3 py-1 mt-3 rounded-full bg-accent/10 text-accent text-xs font-medium">
              {t.years_partnership}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  useEffect(() => {
    document.title = "Depoimentos | Digitale Têxtil";
    const meta = document.querySelector('meta[name="description"]');
    const desc = "Veja o que nossos clientes dizem sobre a Digitale Têxtil. Depoimentos reais de parceiros e empresas que confiam em nossos tecidos.";
    if (meta) meta.setAttribute("content", desc);
    else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = desc;
      document.head.appendChild(m);
    }
  }, []);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials", "page"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-primary py-20">
          <div className="container mx-auto px-6 text-center">
            <span className="text-accent text-sm uppercase tracking-[0.25em] font-semibold">
              Depoimentos
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mt-4">
              O que dizem nossos clientes
            </h1>
            <p className="text-primary-foreground/70 mt-4 max-w-2xl mx-auto">
              Histórias reais de empresas que confiam na Digitale Têxtil para criar produtos de qualidade superior.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-6">
            {isLoading ? (
              <p className="text-center text-muted-foreground">Carregando depoimentos...</p>
            ) : testimonials.length === 0 ? (
              <p className="text-center text-muted-foreground">Nenhum depoimento disponível no momento.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {testimonials.map((t) => (
                  <TestimonialCard key={t.id} t={t} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
