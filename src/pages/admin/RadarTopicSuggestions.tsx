import { useEffect, useState } from "react";
import { Lightbulb, Trash2, CheckCircle, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const RadarTopicSuggestions = () => {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <AdminLayout title="Sugestões de Tema - Radar">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Sugestões dos leitores</h2>
            <p className="text-sm text-muted-foreground">
              Temas enviados pelos visitantes para futuras edições do Radar Digitale.
            </p>
          </div>
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