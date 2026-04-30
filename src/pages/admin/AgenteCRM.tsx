import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot, ShieldCheck, ShieldAlert, ShieldX, Sparkles,
  Download, RefreshCw, CheckCircle2,
  AlertTriangle, XCircle, Clock, FileText, Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AgentConsole } from "@/components/admin/AgentConsole";

type Lead = {
  id: string;
  fabric_name: string;
  cnpj: string;
  whatsapp: string;
  email: string;
  cnae: string | null;
  created_at: string;
};

type Validation = {
  id: string;
  fabric_lead_id: string;
  status: "pending" | "validating" | "qualified" | "suspicious" | "rejected" | "error";
  score: number;
  cnpj_valid: boolean | null;
  cnae_match: boolean | null;
  email_domain_ok: boolean | null;
  whatsapp_format_ok: boolean | null;
  company_analysis: string | null;
  positive_signals: string[] | null;
  risk_signals: string[] | null;
  recommendation: string | null;
  ai_summary: string | null;
  validated_at: string | null;
};

const formatCnpj = (c: string) => c?.length === 14 ? `${c.slice(0,2)}.${c.slice(2,5)}.${c.slice(5,8)}/${c.slice(8,12)}-${c.slice(12)}` : c;
const formatWa = (n: string) => n?.length === 11 ? `${n.slice(0,2)} ${n[2]} ${n.slice(3,7)}-${n.slice(7)}` : n;

const STATUS_META: Record<string, { label: string; color: string; icon: any }> = {
  qualified:   { label: "Qualificado",  color: "bg-emerald-500/15 text-emerald-700 border-emerald-300", icon: CheckCircle2 },
  suspicious:  { label: "Suspeito",     color: "bg-amber-500/15 text-amber-700 border-amber-300",       icon: AlertTriangle },
  rejected:    { label: "Rejeitado",    color: "bg-rose-500/15 text-rose-700 border-rose-300",          icon: XCircle },
  validating:  { label: "Validando…",   color: "bg-sky-500/15 text-sky-700 border-sky-300",             icon: Loader2 },
  pending:     { label: "Pendente",     color: "bg-muted text-muted-foreground border-border",          icon: Clock },
  error:       { label: "Erro",         color: "bg-rose-500/15 text-rose-700 border-rose-300",          icon: XCircle },
};

export default function AgenteCRM() {
  const queryClient = useQueryClient();
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);

  const { data: leads, isLoading: leadsLoading } = useQuery({
    queryKey: ["agente-crm-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabric_leads")
        .select("id,fabric_name,cnpj,whatsapp,email,cnae,created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as Lead[];
    },
  });

  const { data: validations } = useQuery({
    queryKey: ["agente-crm-validations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_validations")
        .select("*");
      if (error) throw error;
      return data as Validation[];
    },
    refetchInterval: 4000,
  });

  const validationMap = useMemo(() => {
    const m = new Map<string, Validation>();
    (validations || []).forEach(v => m.set(v.fabric_lead_id, v));
    return m;
  }, [validations]);

  const pendingLeads = useMemo(
    () => (leads || []).filter(l => {
      const v = validationMap.get(l.id);
      return !v || v.status === "pending" || v.status === "error";
    }),
    [leads, validationMap]
  );

  const stats = useMemo(() => {
    const total = leads?.length || 0;
    const validated = (validations || []).filter(v => ["qualified", "suspicious", "rejected"].includes(v.status));
    const qualified = validated.filter(v => v.status === "qualified").length;
    const suspicious = validated.filter(v => v.status === "suspicious").length;
    const rejected = validated.filter(v => v.status === "rejected").length;
    const avgScore = validated.length
      ? Math.round(validated.reduce((a, v) => a + v.score, 0) / validated.length)
      : 0;
    return { total, validated: validated.length, qualified, suspicious, rejected, avgScore };
  }, [leads, validations]);

  // Mantém o lead "ativo" piscando: pega o que está em validating (se houver)
  useEffect(() => {
    const active = (validations || []).find(v => v.status === "validating");
    setActiveLeadId(active?.fabric_lead_id || null);
  }, [validations]);

  const revalidateAll = async () => {
    const ok = window.confirm("Re-validar TODOS os leads agora? O agente vai reprocessá-los nos próximos minutos.");
    if (!ok) return;
    await supabase.from("lead_validations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    await queryClient.invalidateQueries({ queryKey: ["agente-crm-validations"] });
    toast.success("Fila zerada — agente vai re-validar nos próximos ciclos.");
  };

  const exportQualified = (formatType: "csv" | "pdf") => {
    const qualified = (leads || [])
      .map(l => ({ lead: l, val: validationMap.get(l.id) }))
      .filter(x => x.val?.status === "qualified")
      .sort((a, b) => (b.val!.score - a.val!.score));

    if (qualified.length === 0) {
      toast.error("Nenhum lead qualificado para exportar.");
      return;
    }

    if (formatType === "csv") {
      const headers = ["Score", "Empresa (e-mail)", "Tecido", "CNPJ", "WhatsApp", "E-mail", "CNAE", "Recomendação", "Resumo IA"];
      const rows = qualified.map(({ lead, val }) => [
        val!.score,
        lead.email.split("@")[1] || "",
        lead.fabric_name,
        formatCnpj(lead.cnpj),
        formatWa(lead.whatsapp),
        lead.email,
        lead.cnae || "",
        val!.recommendation || "",
        val!.ai_summary || "",
      ]);
      const csv = [headers, ...rows]
        .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(";"))
        .join("\n");
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `contatos-qualificados_${format(new Date(), "yyyy-MM-dd")}.csv`;
      a.click();
      toast.success(`${qualified.length} contatos exportados em CSV.`);
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFillColor(33, 55, 84);
    doc.rect(0, 0, pageWidth, 24, "F");
    doc.setTextColor(255);
    doc.setFontSize(16);
    doc.text("Agente CRM — Contatos Qualificados", 14, 15);
    doc.setFontSize(9);
    doc.text(`Gerado em ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}  |  ${qualified.length} contatos`, pageWidth - 14, 15, { align: "right" });
    autoTable(doc, {
      startY: 32,
      head: [["Score", "Tecido", "CNPJ", "WhatsApp", "E-mail", "Recomendação"]],
      body: qualified.map(({ lead, val }) => [
        val!.score,
        lead.fabric_name,
        formatCnpj(lead.cnpj),
        formatWa(lead.whatsapp),
        lead.email,
        val!.recommendation || "",
      ]),
      headStyles: { fillColor: [33, 55, 84], textColor: 255, fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { left: 14, right: 14 },
    });
    doc.save(`contatos-qualificados_${format(new Date(), "yyyy-MM-dd")}.pdf`);
    toast.success(`${qualified.length} contatos exportados em PDF.`);
  };

  const renderStatusBadge = (status: string) => {
    const meta = STATUS_META[status] || STATUS_META.pending;
    const Icon = meta.icon;
    return (
      <Badge variant="outline" className={`${meta.color} gap-1 font-medium`}>
        <Icon className={`h-3 w-3 ${status === "validating" ? "animate-spin" : ""}`} />
        {meta.label}
      </Badge>
    );
  };

  return (
    <AdminLayout title="Agente CRM">
      {/* Header do Agente */}
      <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`relative h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center ${running ? "animate-pulse" : ""}`}>
                <Bot className="h-7 w-7" />
                {running && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  Agente IA de Validação B2B
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </h2>
                <p className="text-sm text-muted-foreground">
                  Análise aprofundada de cada lead com validação de CNPJ, CNAE têxtil, domínio corporativo e potencial de venda real.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {!running ? (
                <Button onClick={startValidation} className="gap-2">
                  <Play className="h-4 w-4" /> Iniciar validação ({pendingLeads.length})
                </Button>
              ) : (
                <Button variant="destructive" onClick={stopValidation} className="gap-2">
                  <Pause className="h-4 w-4" /> Pausar
                </Button>
              )}
              <Button variant="outline" onClick={revalidateAll} className="gap-2">
                <RefreshCw className="h-4 w-4" /> Re-validar tudo
              </Button>
              <Button variant="outline" onClick={() => exportQualified("csv")} className="gap-2">
                <Download className="h-4 w-4" /> CSV
              </Button>
              <Button onClick={() => exportQualified("pdf")} className="gap-2">
                <FileText className="h-4 w-4" /> PDF
              </Button>
            </div>
          </div>

          {running && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Validando {progress.current} de {progress.total}…</span>
                <span>{progress.total ? Math.round((progress.current / progress.total) * 100) : 0}%</span>
              </div>
              <Progress value={progress.total ? (progress.current / progress.total) * 100 : 0} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Validados</p>
          <p className="text-2xl font-bold text-foreground">{stats.validated}</p>
        </CardContent></Card>
        <Card className="border-emerald-300/50"><CardContent className="p-4">
          <p className="text-xs text-emerald-700 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Qualificados</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.qualified}</p>
        </CardContent></Card>
        <Card className="border-amber-300/50"><CardContent className="p-4">
          <p className="text-xs text-amber-700 flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> Suspeitos</p>
          <p className="text-2xl font-bold text-amber-700">{stats.suspicious}</p>
        </CardContent></Card>
        <Card className="border-rose-300/50"><CardContent className="p-4">
          <p className="text-xs text-rose-700 flex items-center gap-1"><ShieldX className="h-3 w-3" /> Rejeitados</p>
          <p className="text-2xl font-bold text-rose-700">{stats.rejected}</p>
        </CardContent></Card>
      </div>

      {/* Pipeline Visual */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Pipeline de Validação</CardTitle>
          <span className="text-xs text-muted-foreground">Score médio: <strong>{stats.avgScore}/100</strong></span>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] pr-2">
            <div className="space-y-2">
              {leadsLoading ? (
                Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
              ) : (leads || []).length === 0 ? (
                <p className="text-center text-muted-foreground py-12">Nenhum lead para validar.</p>
              ) : (
                (leads || []).map(lead => {
                  const v = validationMap.get(lead.id);
                  const status = v?.status || "pending";
                  const isActive = activeLeadId === lead.id;
                  const score = v?.score || 0;
                  const scoreColor = score >= 70 ? "text-emerald-600" : score >= 40 ? "text-amber-600" : "text-rose-600";

                  return (
                    <div
                      key={lead.id}
                      className={`rounded-xl border p-4 transition-all ${
                        isActive ? "border-primary shadow-md bg-primary/5 ring-2 ring-primary/20" : "border-border bg-card"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start gap-3">
                        {/* Score circle */}
                        <div className={`flex-shrink-0 h-16 w-16 rounded-full border-4 ${
                          score >= 70 ? "border-emerald-400" : score >= 40 ? "border-amber-400" : score > 0 ? "border-rose-400" : "border-muted"
                        } flex items-center justify-center`}>
                          <div className="text-center">
                            <p className={`text-lg font-bold leading-none ${scoreColor}`}>{score || "—"}</p>
                            <p className="text-[9px] text-muted-foreground uppercase">score</p>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{lead.fabric_name}</span>
                            {renderStatusBadge(status)}
                            {v?.cnpj_valid && <Badge variant="outline" className="text-[10px] gap-1"><CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />CNPJ</Badge>}
                            {v?.cnae_match && <Badge variant="outline" className="text-[10px] gap-1"><CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />CNAE Têxtil</Badge>}
                            {v?.email_domain_ok && <Badge variant="outline" className="text-[10px] gap-1"><CheckCircle2 className="h-2.5 w-2.5 text-emerald-500" />E-mail Corp.</Badge>}
                          </div>
                          <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5">
                            <span>{formatCnpj(lead.cnpj)}</span>
                            <span>{formatWa(lead.whatsapp)}</span>
                            <span className="truncate max-w-[240px]">{lead.email}</span>
                            {lead.cnae && <span className="font-mono">{lead.cnae}</span>}
                          </div>

                          {v?.ai_summary && (
                            <p className="text-xs mt-2 text-foreground/80 italic">
                              <Sparkles className="inline h-3 w-3 mr-1 text-amber-500" />
                              {v.ai_summary}
                            </p>
                          )}

                          {(v?.positive_signals?.length || v?.risk_signals?.length) && (
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                              {!!v?.positive_signals?.length && (
                                <div>
                                  <p className="font-medium text-emerald-700 mb-0.5">Sinais positivos</p>
                                  <ul className="space-y-0.5">
                                    {v.positive_signals.slice(0, 3).map((s, i) => (
                                      <li key={i} className="text-muted-foreground flex gap-1">
                                        <CheckCircle2 className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" /> {s}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {!!v?.risk_signals?.length && (
                                <div>
                                  <p className="font-medium text-rose-700 mb-0.5">Sinais de risco</p>
                                  <ul className="space-y-0.5">
                                    {v.risk_signals.slice(0, 3).map((s, i) => (
                                      <li key={i} className="text-muted-foreground flex gap-1">
                                        <AlertTriangle className="h-3 w-3 text-rose-500 flex-shrink-0 mt-0.5" /> {s}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {v?.recommendation && (
                            <p className="text-xs mt-2 font-medium text-primary">
                              → {v.recommendation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}