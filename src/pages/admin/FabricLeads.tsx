import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays, startOfDay, endOfDay, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Download, FileText, TrendingUp, Users, Package, Calendar } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { toast } from "sonner";

export default function FabricLeads() {
  // Período de exportação (default: últimos 30 dias até hoje)
  const today = new Date();
  const defaultEnd = format(today, "yyyy-MM-dd");
  const defaultStart = format(subDays(today, 29), "yyyy-MM-dd");
  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);
  const maxDate = format(today, "yyyy-MM-dd");

  const { data: leads, isLoading } = useQuery({
    queryKey: ["fabric-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabric_leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Filtra leads dentro do período escolhido (clamp para nunca incluir futuro)
  const filteredLeads = useMemo(() => {
    if (!leads) return [];
    const now = new Date();
    const s = isValid(parseISO(startDate)) ? startOfDay(parseISO(startDate)) : startOfDay(subDays(now, 29));
    let e = isValid(parseISO(endDate)) ? endOfDay(parseISO(endDate)) : endOfDay(now);
    if (e > now) e = now;
    return leads.filter(l => {
      const dt = new Date(l.created_at);
      return dt >= s && dt <= e;
    });
  }, [leads, startDate, endDate]);

  const formatCnpj = (cnpj: string) => {
    if (cnpj.length === 14) {
      return `${cnpj.slice(0,2)}.${cnpj.slice(2,5)}.${cnpj.slice(5,8)}/${cnpj.slice(8,12)}-${cnpj.slice(12)}`;
    }
    return cnpj;
  };

  const formatWhatsapp = (num: string) => {
    if (num.length === 11) return `(${num.slice(0,2)}) ${num.slice(2,7)}-${num.slice(7)}`;
    if (num.length === 10) return `(${num.slice(0,2)}) ${num.slice(2,6)}-${num.slice(6)}`;
    return num;
  };

  const stats = useMemo(() => {
    if (!leads) return null;
    const total = leads.length;
    const today = startOfDay(new Date());
    const last7 = subDays(today, 7);
    const last30 = subDays(today, 30);

    const todayCount = leads.filter(l => new Date(l.created_at) >= today).length;
    const last7Count = leads.filter(l => new Date(l.created_at) >= last7).length;
    const last30Count = leads.filter(l => new Date(l.created_at) >= last30).length;

    // Top tecidos
    const fabricMap = new Map<string, number>();
    leads.forEach(l => fabricMap.set(l.fabric_name, (fabricMap.get(l.fabric_name) || 0) + 1));
    const topFabrics = Array.from(fabricMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Leads por dia (últimos 14)
    const days: { date: string; count: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = subDays(today, i);
      const next = subDays(today, i - 1);
      const count = leads.filter(l => {
        const dt = new Date(l.created_at);
        return dt >= d && dt < next;
      }).length;
      days.push({ date: format(d, "dd/MM"), count });
    }

    const uniqueCompanies = new Set(leads.map(l => l.cnpj)).size;

    return { total, todayCount, last7Count, last30Count, topFabrics, days, uniqueCompanies };
  }, [leads]);

  const exportCsv = () => {
    if (!filteredLeads || filteredLeads.length === 0) {
      toast.error("Nenhum lead no período selecionado.");
      return;
    }
    const headers = ["Data", "Tecido", "CNPJ", "WhatsApp", "E-mail", "Status"];
    const rows = filteredLeads.map(l => [
      format(new Date(l.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR }),
      l.fabric_name,
      formatCnpj(l.cnpj),
      formatWhatsapp(l.whatsapp),
      l.email,
      l.status === "new" ? "Novo" : l.status,
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-tecidos_${startDate}_a_${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filteredLeads.length} leads exportados em CSV.`);
  };

  const exportPdf = () => {
    if (!filteredLeads || filteredLeads.length === 0) {
      toast.error("Nenhum lead no período selecionado.");
      return;
    }
    const doc = new jsPDF({ orientation: "landscape" });
    const pageWidth = doc.internal.pageSize.getWidth();

    // Cabeçalho
    doc.setFillColor(33, 55, 84);
    doc.rect(0, 0, pageWidth, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("Relatório de Leads — Tecidos", 14, 14);
    doc.setFontSize(9);
    doc.text(`Gerado em ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}`, pageWidth - 14, 14, { align: "right" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    const periodoTxt = `Período: ${format(parseISO(startDate), "dd/MM/yyyy")} a ${format(parseISO(endDate), "dd/MM/yyyy")}  |  Total no período: ${filteredLeads.length}`;
    doc.text(periodoTxt, 14, 30);

    autoTable(doc, {
      startY: 36,
      head: [["Data", "Tecido", "CNPJ", "WhatsApp", "E-mail", "Status"]],
      body: filteredLeads.map(l => [
        format(new Date(l.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR }),
        l.fabric_name,
        formatCnpj(l.cnpj),
        formatWhatsapp(l.whatsapp),
        l.email,
        l.status === "new" ? "Novo" : l.status,
      ]),
      headStyles: { fillColor: [33, 55, 84], textColor: 255, fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { left: 14, right: 14 },
    });

    doc.save(`leads-tecidos_${startDate}_a_${endDate}.pdf`);
    toast.success(`${filteredLeads.length} leads exportados em PDF.`);
  };

  return (
    <AdminLayout title="Leads Tecidos">
      {/* Ações de exportação */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Dashboard de Leads</h2>
          <p className="text-sm text-muted-foreground">Selecione um período para exportar os contatos.</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col">
            <Label htmlFor="start-date" className="text-xs text-muted-foreground mb-1">De</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              max={endDate || maxDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-9 w-[160px]"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="end-date" className="text-xs text-muted-foreground mb-1">Até</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              min={startDate}
              max={maxDate}
              onChange={(e) => {
                // Nunca permite data futura
                const v = e.target.value;
                setEndDate(v > maxDate ? maxDate : v);
              }}
              className="h-9 w-[160px]"
            />
          </div>
          <Button variant="outline" onClick={exportCsv} disabled={!filteredLeads.length}>
            <Download className="h-4 w-4 mr-2" /> CSV ({filteredLeads.length})
          </Button>
          <Button onClick={exportPdf} disabled={!filteredLeads.length}>
            <FileText className="h-4 w-4 mr-2" /> PDF ({filteredLeads.length})
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total ?? "—"}</div>
            <p className="text-xs text-muted-foreground">{stats?.uniqueCompanies ?? 0} empresas únicas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.todayCount ?? "—"}</div>
            <p className="text-xs text-muted-foreground">novos contatos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Últimos 7 dias</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.last7Count ?? "—"}</div>
            <p className="text-xs text-muted-foreground">média {stats ? (stats.last7Count / 7).toFixed(1) : "—"}/dia</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Últimos 30 dias</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.last30Count ?? "—"}</div>
            <p className="text-xs text-muted-foreground">solicitações no mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads nos últimos 14 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.days ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="count" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top tecidos mais solicitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.topFabrics ?? []} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Tecido</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>WhatsApp</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : leads && leads.length > 0 ? (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="text-sm whitespace-nowrap">
                    {format(new Date(lead.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="font-medium">{lead.fabric_name}</TableCell>
                  <TableCell className="text-sm">{formatCnpj(lead.cnpj)}</TableCell>
                  <TableCell className="text-sm">
                    <a
                      href={`https://wa.me/55${lead.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {formatWhatsapp(lead.whatsapp)}
                    </a>
                  </TableCell>
                  <TableCell className="text-sm">
                    <a href={`mailto:${lead.email}`} className="text-accent hover:underline">
                      {lead.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant={lead.status === "new" ? "default" : "secondary"}>
                      {lead.status === "new" ? "Novo" : lead.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum lead recebido ainda.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
