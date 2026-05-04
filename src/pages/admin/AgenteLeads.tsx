import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Flame, Snowflake, ThermometerSun, Phone, Building2,
  MessageSquare, TrendingUp, Users, CheckCircle2, Clock, ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const formatCnpj = (c?: string | null) =>
  c && c.length === 14 ? `${c.slice(0,2)}.${c.slice(2,5)}.${c.slice(5,8)}/${c.slice(8,12)}-${c.slice(12)}` : (c || "—");
const formatWa = (n?: string | null) =>
  n && n.length === 11 ? `${n.slice(0,2)} ${n[2]} ${n.slice(3,7)}-${n.slice(7)}` : (n || "—");

const STATUSES = [
  { value: "new", label: "Novo" },
  { value: "contacted", label: "Contatado" },
  { value: "negotiating", label: "Em negociação" },
  { value: "won", label: "Ganho" },
  { value: "lost", label: "Perdido" },
];

export default function AgenteLeads() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState<any>(null);
  const [tab, setTab] = useState("leads");

  const { data: leads } = useQuery({
    queryKey: ["agent-leads"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("agent_leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    refetchInterval: 8000,
  });

  const { data: messages } = useQuery({
    queryKey: ["agent-messages-all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("agent_messages")
        .select("id, role, content, is_fallback, created_at, conversation_id")
        .order("created_at", { ascending: false })
        .limit(500);
      return data || [];
    },
    refetchInterval: 15000,
  });

  const { data: conversations } = useQuery({
    queryKey: ["agent-conversations-stats"],
    queryFn: async () => {
      const { data } = await supabase
        .from("agent_conversations")
        .select("id, created_at, handoff_at, visitor_whatsapp, visitor_cnpj, status, page_url")
        .order("created_at", { ascending: false })
        .limit(500);
      return data || [];
    },
    refetchInterval: 15000,
  });

  const conversationMessages = useMemo(() => {
    if (!selected) return [];
    return (messages || [])
      .filter((m: any) => m.conversation_id === selected.conversation_id)
      .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [selected, messages]);

  // Dashboard stats
  const stats = useMemo(() => {
    const totalLeads = leads?.length || 0;
    const hot = leads?.filter((l) => l.interest_level === "quente").length || 0;
    const warm = leads?.filter((l) => l.interest_level === "morno").length || 0;
    const cold = leads?.filter((l) => l.interest_level === "frio").length || 0;
    const won = leads?.filter((l) => l.status === "won").length || 0;
    const totalConvs = conversations?.length || 0;
    const handoffs = conversations?.filter((c: any) => c.handoff_at).length || 0;
    const conversionRate = totalConvs > 0 ? Math.round((handoffs / totalConvs) * 100) : 0;
    const totalMsgs = messages?.length || 0;
    const fallbacks = messages?.filter((m: any) => m.is_fallback).length || 0;
    const fallbackRate = totalMsgs > 0 ? Math.round((fallbacks / totalMsgs) * 100) : 0;
    return { totalLeads, hot, warm, cold, won, totalConvs, handoffs, conversionRate, totalMsgs, fallbacks, fallbackRate };
  }, [leads, conversations, messages]);

  // Top perguntas dos visitantes (frequência por palavras-chave)
  const topQuestions = useMemo(() => {
    const userMsgs = (messages || []).filter((m: any) => m.role === "user");
    const counts = new Map<string, number>();
    for (const m of userMsgs) {
      const norm = (m.content || "").toLowerCase().trim();
      if (norm.length < 3 || norm.length > 120) continue;
      counts.set(norm, (counts.get(norm) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
  }, [messages]);

  async function updateLead(id: string, patch: any) {
    const { error } = await (supabase as any).from("agent_leads").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Atualizado");
    qc.invalidateQueries({ queryKey: ["agent-leads"] });
  }

  const interestBadge = (level: string) => {
    if (level === "quente") return <Badge className="bg-rose-500/15 text-rose-700 border-rose-300 gap-1"><Flame className="h-3 w-3" />Quente</Badge>;
    if (level === "morno") return <Badge className="bg-amber-500/15 text-amber-700 border-amber-300 gap-1"><ThermometerSun className="h-3 w-3" />Morno</Badge>;
    return <Badge className="bg-sky-500/15 text-sky-700 border-sky-300 gap-1"><Snowflake className="h-3 w-3" />Frio</Badge>;
  };

  return (
    <AdminLayout title="Leads do Agente">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="leads">Leads ({stats.totalLeads})</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>Interesse</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Resumo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads?.map((l) => (
                    <TableRow key={l.id} className="cursor-pointer" onClick={() => setSelected(l)}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {format(new Date(l.created_at), "dd/MM HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="font-medium">{formatWa(l.whatsapp)}</TableCell>
                      <TableCell className="text-xs">{formatCnpj(l.cnpj)}</TableCell>
                      <TableCell>{interestBadge(l.interest_level)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select value={l.status} onValueChange={(v) => updateLead(l.id, { status: v })}>
                          <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-md truncate">
                        {l.interest_summary || "—"}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {l.whatsapp && (
                          <a
                            href={`https://wa.me/55${l.whatsapp}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:underline"
                          >
                            <Phone className="h-3 w-3" /> WhatsApp
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!leads?.length && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Nenhum lead capturado pelo agente ainda.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="mt-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPI icon={Users} label="Conversas" value={stats.totalConvs} />
            <KPI icon={CheckCircle2} label="Leads gerados" value={stats.totalLeads} accent="emerald" />
            <KPI icon={TrendingUp} label="Taxa de conversão" value={`${stats.conversionRate}%`} accent="primary" />
            <KPI icon={Flame} label="Leads quentes" value={stats.hot} accent="rose" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KPI icon={MessageSquare} label="Mensagens" value={stats.totalMsgs} />
            <KPI icon={Clock} label="Sem resposta (fallback)" value={`${stats.fallbackRate}%`} />
            <KPI icon={Building2} label="Handoffs concluídos" value={stats.handoffs} />
            <KPI icon={CheckCircle2} label="Vendas (won)" value={stats.won} accent="emerald" />
          </div>

          {/* Distribuição interesse */}
          <Card>
            <CardHeader><CardTitle className="text-base">Distribuição por interesse</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                <BarRow label="🔥 Quente" value={stats.hot} total={stats.totalLeads} color="bg-rose-500" />
                <BarRow label="🌤 Morno" value={stats.warm} total={stats.totalLeads} color="bg-amber-500" />
                <BarRow label="❄️ Frio" value={stats.cold} total={stats.totalLeads} color="bg-sky-500" />
              </div>
            </CardContent>
          </Card>

          {/* Top perguntas */}
          <Card>
            <CardHeader><CardTitle className="text-base">Perguntas mais frequentes dos visitantes</CardTitle></CardHeader>
            <CardContent>
              {topQuestions.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sem dados suficientes ainda.</p>
              ) : (
                <div className="space-y-2">
                  {topQuestions.map(([q, c]) => (
                    <div key={q} className="flex items-center justify-between gap-3 text-sm border-b border-border/50 pb-1.5">
                      <span className="truncate flex-1">{q}</span>
                      <Badge variant="outline">{c}x</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal detalhe lead */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Info label="WhatsApp" value={formatWa(selected.whatsapp)} />
                <Info label="CNPJ" value={formatCnpj(selected.cnpj)} />
                <Info label="E-mail" value={selected.email || "—"} />
                <Info label="Interesse" value={selected.interest_level} />
                <Info label="Página" value={selected.page_url || "—"} />
                <Info label="Origem" value={selected.source || "—"} />
              </div>

              {selected.interest_summary && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Resumo do interesse</p>
                  <p className="text-sm bg-muted/40 p-3 rounded">{selected.interest_summary}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Conversa</p>
                <div className="space-y-1 max-h-72 overflow-y-auto bg-muted/30 p-3 rounded text-xs">
                  {conversationMessages.map((m: any) => (
                    <div key={m.id}>
                      <span className={m.role === "user" ? "font-semibold text-primary" : "font-semibold text-muted-foreground"}>
                        {m.role === "user" ? "Visitante" : "Agente"}:
                      </span>{" "}
                      {m.content}
                    </div>
                  ))}
                  {conversationMessages.length === 0 && (
                    <p className="text-muted-foreground">Sem mensagens registradas.</p>
                  )}
                </div>
              </div>

              {selected.whatsapp && (
                <Button asChild className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <a href={`https://wa.me/55${selected.whatsapp}`} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" /> Abrir WhatsApp
                  </a>
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function KPI({ icon: Icon, label, value, accent }: any) {
  const colors: any = {
    rose: "text-rose-700",
    emerald: "text-emerald-700",
    primary: "text-primary",
  };
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Icon className="h-3 w-3" /> {label}
        </p>
        <p className={`text-2xl font-bold ${colors[accent] || ""}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function BarRow({ label, value, total, color }: any) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className="text-muted-foreground">{value} ({Math.round(pct)}%)</span>
      </div>
      <div className="h-2 bg-muted rounded overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}