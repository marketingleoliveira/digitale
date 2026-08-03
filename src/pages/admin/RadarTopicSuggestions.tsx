import { useEffect, useState } from "react";
import { Lightbulb, Trash2, CheckCircle, Mail, FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Suggestion {
  id: string;
  topic: string;
  name: string | null;
  email: string | null;
  message: string | null;
  status: string;
  page_url: string | null;
  created_at: string;
}

/** Temas monitorados no dashboard do relatório. */
const THEMES: { label: string; keywords: string[]; color: [number, number, number] }[] = [
  { label: "Comportamento", keywords: ["comportament", "consumidor", "cliente", "geração", "geracao", "hábito", "habito", "cultura", "lifestyle"], color: [33, 55, 84] },
  { label: "Economia", keywords: ["econom", "preço", "preco", "custo", "dólar", "dolar", "mercado", "venda", "faturament", "importa", "exporta", "inflaç", "inflac"], color: [232, 93, 58] },
  { label: "Tendência", keywords: ["tendênc", "tendenc", "moda", "coleç", "colec", "estampa", "cor ", "cores", "verão", "verao", "inverno", "lançament", "lancament"], color: [90, 120, 160] },
  { label: "Tecnologia", keywords: ["tecnolog", "digital", "ia ", "inteligência", "inteligencia", "automaç", "automac", "máquina", "maquina", "software", "impressão", "impressao", "inova"], color: [70, 150, 140] },
  { label: "Sustentabilidade", keywords: ["sustentá", "sustenta", "ecolog", "recicl", "ambient", "esg", "verde", "água", "agua", "carbono", "resídu", "residu"], color: [90, 160, 90] },
];

function classifyTopic(text: string): string {
  const t = (text || "").toLowerCase();
  for (const theme of THEMES) {
    if (theme.keywords.some((k) => t.includes(k))) return theme.label;
  }
  return "Outros";
}

const RadarTopicSuggestions = () => {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("radar_topic_suggestions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Erro ao carregar sugestões");
    } else {
      setItems((data || []) as Suggestion[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const markReviewed = async (id: string) => {
    const { error } = await supabase
      .from("radar_topic_suggestions")
      .update({ status: "reviewed" })
      .eq("id", id);
    if (error) return toast.error("Erro ao atualizar");
    toast.success("Marcado como revisado");
    fetchItems();
  };

  const remove = async (id: string) => {
    const { error } = await supabase
      .from("radar_topic_suggestions")
      .delete()
      .eq("id", id);
    if (error) return toast.error("Erro ao excluir");
    toast.success("Sugestão excluída");
    fetchItems();
  };

  /** Filtra por intervalo de datas (inclusivo) informado pelo usuário. */
  const filterByDate = (list: Suggestion[]) =>
    list.filter((i) => {
      const d = new Date(i.created_at);
      if (startDate && d < new Date(`${startDate}T00:00:00`)) return false;
      if (endDate && d > new Date(`${endDate}T23:59:59`)) return false;
      return true;
    });

  const exportPdf = (onlyNew = false) => {
    const base = onlyNew ? items.filter((i) => i.status !== "reviewed") : items;
    const list = filterByDate(base);
    if (list.length === 0) {
      toast.error("Nenhuma sugestão para exportar.");
      return;
    }
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const generatedAt = new Date().toLocaleString("pt-BR");
    const periodLabel =
      startDate || endDate
        ? `${startDate ? new Date(`${startDate}T00:00:00`).toLocaleDateString("pt-BR") : "início"} até ${
            endDate ? new Date(`${endDate}T00:00:00`).toLocaleDateString("pt-BR") : "hoje"
          }`
        : "Todo o período";

    // ---------- PÁGINA 1: DASHBOARD ----------
    doc.setFillColor(33, 55, 84); // navy primary
    doc.rect(0, 0, pageWidth, 90, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.text("Radar Digitale — Sugestões de Tema", 40, 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Briefing para redatores  ·  Gerado em ${generatedAt}`, 40, 52);
    doc.text(`Período: ${periodLabel}`, 40, 70);

    // Contagem por tema
    const counts = new Map<string, number>();
    for (const it of list) {
      const key = classifyTopic(`${it.topic} ${it.message ?? ""}`);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const rows = [...THEMES.map((t) => t.label), "Outros"]
      .map((label) => ({
        label,
        count: counts.get(label) ?? 0,
        color: THEMES.find((t) => t.label === label)?.color ?? ([140, 140, 140] as [number, number, number]),
      }))
      .sort((a, b) => b.count - a.count);
    const max = Math.max(1, ...rows.map((r) => r.count));

    doc.setTextColor(33, 55, 84);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Panorama dos temas mais pedidos", 40, 130);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(
      `${list.length} sugestão(ões) analisada(s)${onlyNew ? " — apenas novas" : ""}`,
      40,
      148
    );

    // Barras horizontais
    let y = 175;
    const barX = 190;
    const barMaxW = pageWidth - barX - 90;
    rows.forEach((r) => {
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(r.label, 40, y + 11);

      doc.setFillColor(238, 240, 244);
      doc.roundedRect(barX, y, barMaxW, 16, 4, 4, "F");

      const w = Math.max(2, (r.count / max) * barMaxW);
      doc.setFillColor(r.color[0], r.color[1], r.color[2]);
      doc.roundedRect(barX, y, w, 16, 4, 4, "F");

      const pct = list.length ? Math.round((r.count / list.length) * 100) : 0;
      doc.setTextColor(60, 60, 60);
      doc.setFont("helvetica", "normal");
      doc.text(`${r.count} (${pct}%)`, barX + barMaxW + 10, y + 11);
      y += 30;
    });

    // Destaques
    const top = rows[0];
    doc.setDrawColor(225, 228, 234);
    doc.roundedRect(40, y + 10, pageWidth - 80, 64, 6, 6, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(33, 55, 84);
    doc.text("Recomendação editorial", 54, y + 32);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(
      `Tema com maior demanda no período: ${top?.label ?? "—"} (${top?.count ?? 0} pedidos). Priorize pautas nesta linha.`,
      54,
      y + 52,
      { maxWidth: pageWidth - 110 }
    );

    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text("Digitale Têxtil — Radar Digitale", 40, pageHeight - 20);
    doc.text("Página 1", pageWidth - 40, pageHeight - 20, { align: "right" });

    // ---------- PÁGINAS SEGUINTES: LISTA ----------
    doc.addPage();
    doc.setFillColor(33, 55, 84);
    doc.rect(0, 0, pageWidth, 70, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Sugestões detalhadas", 40, 40);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(10);
    doc.text(
      `Total: ${list.length} sugestão(ões)${onlyNew ? " — apenas novas" : ""}`,
      40,
      92
    );

    autoTable(doc, {
      startY: 110,
      head: [["#", "Tema", "Detalhes / Contato", "Status", "Data"]],
      body: list.map((it, idx) => [
        String(idx + 1),
        it.topic,
        [
          it.message ? it.message : "—",
          "",
          it.name ? `Nome: ${it.name}` : null,
          it.email ? `E-mail: ${it.email}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
        it.status === "reviewed" ? "Revisado" : "Novo",
        new Date(it.created_at).toLocaleDateString("pt-BR"),
      ]),
      styles: { fontSize: 9, cellPadding: 6, valign: "top" },
      headStyles: { fillColor: [232, 93, 58], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 248, 250] },
      columnStyles: {
        0: { cellWidth: 28, halign: "center" },
        1: { cellWidth: 140, fontStyle: "bold" },
        2: { cellWidth: "auto" },
        3: { cellWidth: 60, halign: "center" },
        4: { cellWidth: 60, halign: "center" },
      },
      margin: { left: 40, right: 40 },
      didDrawPage: () => {
        doc.setFontSize(8);
        doc.setTextColor(140, 140, 140);
        doc.text(
          "Digitale Têxtil — Radar Digitale",
          40,
          pageHeight - 20
        );
        doc.text(
          `Página ${doc.getCurrentPageInfo().pageNumber}`,
          pageWidth - 40,
          pageHeight - 20,
          { align: "right" }
        );
      },
    });

    const stamp = new Date().toISOString().slice(0, 10);
    doc.save(`radar-sugestoes-${stamp}.pdf`);
    toast.success("PDF gerado!");
  };

  return (
    <AdminLayout title="Sugestões de Tema - Radar">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Sugestões dos leitores</h2>
            <p className="text-sm text-muted-foreground">
              Temas enviados pelos visitantes para futuras edições do Radar Digitale.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <Label htmlFor="start-date" className="text-xs">De</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-[170px]"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="end-date" className="text-xs">Até</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-[170px]"
            />
          </div>
          {(startDate || endDate) && (
            <Button
              variant="ghost"
              onClick={() => { setStartDate(""); setEndDate(""); }}
            >
              Limpar datas
            </Button>
          )}
          <div className="flex-1" />
          <span className="text-sm text-muted-foreground">
            {filterByDate(items).length} no período
          </span>
          <Button variant="outline" onClick={() => exportPdf(true)} className="gap-2">
            <FileDown className="h-4 w-4" />
            Exportar Novas
          </Button>
          <Button onClick={() => exportPdf(false)} className="gap-2">
            <FileDown className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tema sugerido</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhuma sugestão recebida ainda.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((it) => (
                  <TableRow key={it.id}>
                    <TableCell className="font-medium max-w-xs">{it.topic}</TableCell>
                    <TableCell className="text-sm">
                      {it.name && <div>{it.name}</div>}
                      {it.email && (
                        <a href={`mailto:${it.email}`} className="text-accent inline-flex items-center gap-1 hover:underline">
                          <Mail className="h-3 w-3" /> {it.email}
                        </a>
                      )}
                      {!it.name && !it.email && <span className="text-muted-foreground">Anônimo</span>}
                    </TableCell>
                    <TableCell className="max-w-sm text-sm text-muted-foreground line-clamp-2">
                      {it.message || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={it.status === "reviewed" ? "outline" : "default"}>
                        {it.status === "reviewed" ? "Revisado" : "Novo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(it.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {it.status !== "reviewed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markReviewed(it.id)}
                            title="Marcar como revisado"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir sugestão?</AlertDialogTitle>
                              <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => remove(it.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RadarTopicSuggestions;