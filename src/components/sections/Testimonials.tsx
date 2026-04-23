import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useLanguage();

  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Testimonial[];
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });

  const next = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    if (testimonials.length === 0) return;
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    const timer = setInterval(next, 70000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, next, testimonials.length]);

  // Reset current index when testimonials change
  useEffect(() => {
    if (testimonials.length > 0 && current >= testimonials.length) {
      setCurrent(0);
    }
  }, [testimonials.length, current]);

  // Observe section to trigger autoplay when in view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Autoplay/pause video when in view or slide changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isInView) {
      video.muted = isMuted;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isInView, current, testimonials, isMuted]);

  const handleUnmute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setIsMuted(false);
    video.play().catch(() => {});
  };

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className="py-24 bg-primary relative overflow-hidden">
      {/* Static Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-accent text-sm uppercase tracking-[0.25em] font-semibold">
            {t("testimonials.label")}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground leading-tight mt-4">
            {t("testimonials.title")}
          </h2>
          <p className="text-primary-foreground/60 mt-4 max-w-2xl mx-auto">
            Milhares de empresas confiam na Digitale para criar produtos de qualidade superior
          </p>
        </div>

        {/* Featured Testimonial with Video */}
        <div
          className="relative max-w-6xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {(() => {
            const t = testimonials[current];
            if (!t) return null;
            const hasVideo = !!t.video_url;
            return (
              <div className="bg-card rounded-3xl shadow-2xl shadow-black/30 overflow-hidden flex flex-col md:flex-row items-stretch max-w-3xl mx-auto">
                {/* Media side - fixed compact size */}
                <div className="relative bg-black w-full md:w-[250px] md:flex-shrink-0 h-[300px] flex items-center justify-center">
                  {hasVideo ? (
                    <>
                      <video
                        key={t.id}
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
                          Clique para ativar o som
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

                {/* Content side */}
                <div className="p-6 md:p-8 flex flex-col justify-center flex-1">
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-foreground text-base md:text-lg leading-relaxed mb-5">
                    "{t.quote}"
                  </blockquote>

                  {/* Author */}
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
          })()}

          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Anterior"
                className="hidden md:flex absolute -left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-card border-2 border-border items-center justify-center hover:border-accent hover:text-accent transition-all shadow-lg z-20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={next}
                aria-label="Próximo"
                className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-card border-2 border-border items-center justify-center hover:border-accent hover:text-accent transition-all shadow-lg z-20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Mobile arrows + Dots */}
        {testimonials.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              aria-label="Anterior"
              className="md:hidden w-11 h-11 rounded-full bg-card/20 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-accent hover:border-accent transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  aria-label={`Ir para depoimento ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === current
                      ? "bg-accent w-8"
                      : "bg-primary-foreground/30 hover:bg-primary-foreground/50 w-2"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Próximo"
              className="md:hidden w-11 h-11 rounded-full bg-card/20 backdrop-blur-sm border border-primary-foreground/20 flex items-center justify-center text-primary-foreground hover:bg-accent hover:border-accent transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
