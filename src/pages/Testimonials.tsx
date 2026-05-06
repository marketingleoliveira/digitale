import { useEffect, useRef, useState, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Star, VolumeX, Volume2, Play, Maximize2, Quote, X, Search, CalendarIcon, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_company: string | null;
  author_photo_url: string | null;
  video_url: string | null;
  rating: number;
  years_partnership: string | null;
  created_at?: string;
  display_order?: number;
}

function TestimonialCard({ t, onOpenVideo, isNew }: { t: Testimonial; onOpenVideo: (t: Testimonial) => void; isNew?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (!node) return;
    const tryPlay = () => node.play().catch(() => {});
    tryPlay();
    node.addEventListener("loadeddata", tryPlay, { once: true });
    node.addEventListener("canplay", tryPlay, { once: true });
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

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    v.muted = next;
    setIsMuted(next);
    v.play().catch(() => {});
  };

  const hasVideo = !!t.video_url;

  return (
    <div
      ref={containerRef}
      className={`group relative bg-card rounded-2xl overflow-hidden flex flex-col border ${isNew ? "border-accent/60 ring-2 ring-accent/30" : "border-border/60"} shadow-[0_4px_20px_-8px_rgba(33,55,84,0.12)] hover:shadow-[0_16px_36px_-12px_rgba(33,55,84,0.22)] hover:-translate-y-1 transition-all duration-500`}
    >
      {isNew && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-accent via-accent to-accent/90 text-white text-[10px] font-bold uppercase tracking-[0.2em] py-1.5 px-3 flex items-center justify-center gap-1.5 shadow-lg">
          <Sparkles className="h-3 w-3 animate-pulse" />
          Novo Depoimento
          <Sparkles className="h-3 w-3 animate-pulse" />
        </div>
      )}
      {/* Mídia */}
      <div className="relative bg-black aspect-[3/4] overflow-hidden">
        {hasVideo ? (
          <>
            <video
              ref={setVideoRef}
              src={t.video_url!}
              autoPlay
              muted={isMuted}
              playsInline
              loop
              preload="auto"
              poster={t.author_photo_url || undefined}
              className="w-full h-full object-cover"
            />
            {/* Overlay gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Botão tela cheia */}
            <button
              type="button"
              onClick={() => onOpenVideo(t)}
              aria-label="Ver em tela cheia"
              className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider hover:bg-accent hover:scale-105 transition-all"
            >
              <Maximize2 className="h-3 w-3" />
              <span className="hidden sm:inline">Tela cheia</span>
            </button>

            {/* Botão mudo */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Ativar som" : "Desativar som"}
              className={`absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2.5 py-1.5 rounded-full backdrop-blur-md text-white text-[10px] font-semibold uppercase tracking-wider transition-all ${isMuted ? "bg-accent/90 hover:bg-accent animate-pulse" : "bg-black/50 hover:bg-black/70"}`}
            >
              {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              {isMuted && <span className="hidden sm:inline">Som</span>}
            </button>

            {/* Play grande no hover */}
            <button
              type="button"
              onClick={() => onOpenVideo(t)}
              aria-label="Reproduzir em tela cheia"
              className="absolute inset-0 z-[5] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="w-14 h-14 rounded-full bg-accent/95 flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                <Play className="h-6 w-6 text-white fill-white ml-0.5" />
              </span>
            </button>

            {/* Identificação sobre o vídeo */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-[6] pointer-events-none">
              <p className="text-white font-bold text-base leading-tight">{t.author_name}</p>
              {t.author_company && (
                <p className="text-white/85 text-xs mt-0.5">{t.author_company}</p>
              )}
            </div>
          </>
        ) : t.author_photo_url ? (
          <>
            <img
              src={t.author_photo_url}
              alt={t.author_name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white font-bold text-base leading-tight">{t.author_name}</p>
              {t.author_company && (
                <p className="text-white/85 text-xs mt-0.5">{t.author_company}</p>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary via-primary to-primary/60 text-primary-foreground text-6xl font-bold">
            {t.author_name.charAt(0)}
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-1 relative">
        <Quote className="absolute top-3 right-4 h-7 w-7 text-accent/15 rotate-180" />

        <div className="flex gap-0.5 mb-2.5">
          {[...Array(t.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
          ))}
        </div>

        <blockquote className="text-foreground/90 text-sm leading-relaxed mb-3 flex-1 italic line-clamp-5">
          "{t.quote}"
        </blockquote>

        {t.years_partnership && (
          <div className="pt-3 border-t border-border/60">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-semibold uppercase tracking-wider">
              {t.years_partnership}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoLightbox({ testimonial, onClose }: { testimonial: Testimonial | null; onClose: () => void }) {
  const open = !!testimonial;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-[100vw] sm:max-w-[95vw] w-[100vw] h-[100vh] sm:h-[95vh] p-0 bg-black border-none sm:rounded-2xl overflow-hidden flex flex-col [&>button]:hidden"
      >
        <VisuallyHidden>
          <DialogTitle>{testimonial?.author_name ?? "Depoimento"}</DialogTitle>
        </VisuallyHidden>

        {testimonial && (
          <>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex-1 flex items-center justify-center bg-black overflow-hidden">
              <video
                src={testimonial.video_url!}
                controls
                autoPlay
                playsInline
                className="max-w-full max-h-full w-auto h-auto object-contain"
              />
            </div>

            <div className="bg-gradient-to-t from-black to-black/70 px-6 py-4 text-white">
              <p className="font-bold text-base sm:text-lg">{testimonial.author_name}</p>
              {testimonial.author_company && (
                <p className="text-white/70 text-sm mt-0.5">{testimonial.author_company}</p>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function TestimonialsPage() {
  const [openVideo, setOpenVideo] = useState<Testimonial | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);

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
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const filteredTestimonials = testimonials.filter((t) => {
    const term = searchTerm.trim().toLowerCase();
    const matchTerm = !term ||
      (t.author_company || "").toLowerCase().includes(term) ||
      (t.author_name || "").toLowerCase().includes(term);
    const matchDate = !filterDate || (
      t.created_at &&
      format(new Date(t.created_at), "yyyy-MM-dd") === format(filterDate, "yyyy-MM-dd")
    );
    return matchTerm && matchDate;
  });

  const videoCount = testimonials.filter(t => t.video_url).length;
  const avgRating = testimonials.length
    ? (testimonials.reduce((s, t) => s + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : "5.0";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* HERO premium */}
        <section className="relative bg-primary overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, hsl(var(--accent)) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }} />
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />

          {/* Nuvens de nomes de empresas */}
          {!isLoading && testimonials.length > 0 && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              {[0, 1, 2].map((rowIdx) => {
                const companies = testimonials
                  .map((t) => t.author_company)
                  .filter((c): c is string => !!c);
                if (companies.length === 0) return null;
                const loop = [...companies, ...companies, ...companies];
                const durations = ["80s", "110s", "95s"];
                const tops = ["12%", "48%", "78%"];
                const directions = rowIdx % 2 === 0 ? "cloud-marquee-ltr" : "cloud-marquee-rtl";
                return (
                  <div
                    key={rowIdx}
                    className={`absolute left-0 right-0 flex gap-16 whitespace-nowrap ${directions}`}
                    style={{ top: tops[rowIdx], animationDuration: durations[rowIdx] }}
                  >
                    {loop.map((name, i) => (
                      <span
                        key={`${rowIdx}-${i}`}
                        className="text-primary-foreground/10 font-bold uppercase tracking-[0.2em] text-3xl md:text-5xl lg:text-6xl select-none"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          <div className="container relative mx-auto px-6 py-24 md:py-32 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs uppercase tracking-[0.25em] font-semibold">
              <Quote className="h-3.5 w-3.5" />
              Depoimentos
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mt-6 leading-[1.1]">
              Histórias que <span className="text-accent">inspiram</span>
            </h1>
            <p className="text-primary-foreground/75 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">
              Conheça empresas que escolheram a Digitale Têxtil para transformar suas ideias em produtos de qualidade superior.
            </p>

            {/* Stats */}
            {!isLoading && testimonials.length > 0 && (
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-accent">{testimonials.length}+</div>
                  <div className="text-primary-foreground/60 text-xs uppercase tracking-wider mt-1">Depoimentos</div>
                </div>
                <div className="border-l border-primary-foreground/10 pl-8 md:pl-16">
                  <div className="text-3xl md:text-4xl font-bold text-accent flex items-center gap-1.5">
                    {avgRating}
                    <Star className="h-6 w-6 fill-accent text-accent" />
                  </div>
                  <div className="text-primary-foreground/60 text-xs uppercase tracking-wider mt-1">Avaliação média</div>
                </div>
                {videoCount > 0 && (
                  <div className="border-l border-primary-foreground/10 pl-8 md:pl-16">
                    <div className="text-3xl md:text-4xl font-bold text-accent">{videoCount}</div>
                    <div className="text-primary-foreground/60 text-xs uppercase tracking-wider mt-1">Em vídeo</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Wave divisor */}
          <svg className="block w-full h-12 md:h-20" viewBox="0 0 1440 80" preserveAspectRatio="none" fill="none">
            <path d="M0,40 C360,80 720,0 1440,40 L1440,80 L0,80 Z" fill="hsl(var(--background))" />
          </svg>
        </section>

        {/* GRID */}
        <section className="py-12 md:py-20 bg-background">
          <div className="container mx-auto px-6">
            {/* Filtros: busca por empresa/nome + data */}
            {!isLoading && testimonials.length > 0 && (
              <div className="max-w-7xl mx-auto mb-8 md:mb-10 flex flex-col md:flex-row gap-3 md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Pesquisar por empresa ou nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 rounded-xl bg-card border-border/60"
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "h-11 rounded-xl justify-start text-left font-normal md:w-[220px]",
                        !filterDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filterDate ? format(filterDate, "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Filtrar por data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={filterDate}
                      onSelect={setFilterDate}
                      initialFocus
                      locale={ptBR}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                {(searchTerm || filterDate) && (
                  <Button
                    variant="ghost"
                    onClick={() => { setSearchTerm(""); setFilterDate(undefined); }}
                    className="h-11 rounded-xl"
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    Limpar
                  </Button>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border/60 overflow-hidden animate-pulse">
                    <div className="aspect-[3/4] bg-muted" />
                    <div className="p-6 space-y-3">
                      <div className="h-3 bg-muted rounded w-1/3" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            ) : testimonials.length === 0 ? (
              <div className="text-center py-20">
                <Quote className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Nenhum depoimento disponível no momento.</p>
              </div>
            ) : filteredTestimonials.length === 0 ? (
              <div className="text-center py-20">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Nenhum depoimento encontrado para os filtros aplicados.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
                {filteredTestimonials.map((t) => (
                  <TestimonialCard
                    key={t.id}
                    t={t}
                    onOpenVideo={setOpenVideo}
                    isNew={(t.display_order ?? -1) === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <VideoLightbox testimonial={openVideo} onClose={() => setOpenVideo(null)} />
      </main>
      <Footer />
    </div>
  );
}
