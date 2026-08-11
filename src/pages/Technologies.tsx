import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { cn } from "@/lib/utils";

export interface Technology {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  benefits: string[];
  applications: string[];
  is_featured: boolean;
  display_order: number;
}

/** Converte o valor jsonb (array ou string) em lista de strings segura. */
function toList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
    } catch {
      return value.split("\n").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

/** Resolve dinamicamente um ícone Lucide pelo nome; usa Sparkles como fallback. */
function resolveIcon(name?: string | null) {
  if (!name) return Sparkles;
  const dict = Icons as unknown as Record<string, unknown>;
  const found = dict[name];
  return (typeof found === "function" || typeof found === "object") && found
    ? (found as typeof Sparkles)
    : Sparkles;
}

const Technologies = () => {
  const { whatsappLink } = useSiteSettings();
  const [selected, setSelected] = useState<Technology | null>(null);

  const { data: technologies, isLoading } = useQuery({
    queryKey: ["technologies", "public"],
    queryFn: async (): Promise<Technology[]> => {
      const { data, error } = await supabase
        .from("technologies")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) throw error;

      return (data || []).map((t) => ({
        ...t,
        benefits: toList(t.benefits),
        applications: toList(t.applications),
      })) as Technology[];
    },
  });

  const list = technologies ?? [];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Tecnologias Têxteis | Malhas Técnicas e Acabamentos"
        description="Conheça as tecnologias da Digitale Têxtil: proteção UV, secagem rápida, antibacteriano, compressão, estampa digital e mais para fitness, praia e moda íntima."
        keywords="tecnologia têxtil, malha com proteção UV, tecido dry fit, tecido antibacteriano, estamparia digital, tecido compressivo, fornecedor de tecidos técnicos"
      />
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground pt-28 pb-16 md:pt-36 md:pb-24">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:22px_22px]"
          />
          <div className="container relative mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl"
            >
              <Badge className="mb-4 bg-accent text-accent-foreground hover:bg-accent">
                Inovação Digitale
              </Badge>
              <h1 className="font-display text-3xl md:text-5xl font-semibold leading-tight">
                Tecnologias que transformam o tecido em performance
              </h1>
              <p className="mt-4 text-base md:text-lg text-primary-foreground/80">
                Desenvolvimento têxtil próprio, acabamentos técnicos e controle de qualidade em
                cada etapa. Conheça as tecnologias aplicadas nas malhas da Digitale Têxtil.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-2xl" />
                ))}
              </div>
            ) : list.length === 0 ? (
              <div className="text-center py-16">
                <Sparkles className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma tecnologia cadastrada no momento.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {list.map((tech, index) => {
                  const Icon = resolveIcon(tech.icon);
                  return (
                    <motion.article
                      key={tech.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
                      className={cn(
                        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card",
                        "transition-shadow hover:shadow-lg"
                      )}
                    >
                      {tech.image_url && (
                        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                          <img
                            src={tech.image_url}
                            alt={`Tecnologia ${tech.name} da Digitale Têxtil`}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <div className="flex flex-1 flex-col p-5 md:p-6">
                        <div className="mb-4 flex items-center gap-3">
                          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF8A00] to-[#FF5C00] text-white">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div className="min-w-0">
                            <h2 className="font-display text-lg font-semibold text-foreground truncate">
                              {tech.name}
                            </h2>
                            {tech.is_featured && (
                              <span className="text-xs font-medium text-accent">Destaque</span>
                            )}
                          </div>
                        </div>

                        {tech.short_description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {tech.short_description}
                          </p>
                        )}

                        {tech.benefits.length > 0 && (
                          <ul className="mt-4 space-y-1.5">
                            {tech.benefits.slice(0, 3).map((b) => (
                              <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        <Button
                          variant="ghost"
                          className="mt-auto justify-start px-0 pt-5 text-primary hover:bg-transparent hover:text-accent"
                          onClick={() => setSelected(tech)}
                        >
                          Ver detalhes
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-muted/40 py-14 md:py-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
              Precisa de uma malha técnica sob medida?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Nosso time de desenvolvimento cria soluções específicas para o seu produto.
            </p>
            <Button asChild size="lg" className="mt-6">
              <a
                href={whatsappLink("Olá! Gostaria de saber mais sobre as tecnologias da Digitale Têxtil.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar com um especialista
              </a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{selected?.name}</DialogTitle>
          </DialogHeader>

          {selected?.image_url && (
            <img
              src={selected.image_url}
              alt={`Tecnologia ${selected.name}`}
              loading="lazy"
              className="w-full rounded-xl object-cover aspect-[16/9]"
            />
          )}

          {selected?.description && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {selected.description}
            </p>
          )}

          {!!selected?.benefits.length && (
            <div>
              <h3 className="mb-2 font-semibold text-foreground">Benefícios</h3>
              <ul className="space-y-1.5">
                {selected.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!!selected?.applications.length && (
            <div>
              <h3 className="mb-2 font-semibold text-foreground">Aplicações</h3>
              <div className="flex flex-wrap gap-2">
                {selected.applications.map((a) => (
                  <Badge key={a} variant="secondary">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Technologies;