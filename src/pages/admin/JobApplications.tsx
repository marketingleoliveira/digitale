import { useState, useEffect } from "react";
import { Eye, Download, Trash2, Mail, Phone, Calendar, FileText, Check, X, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface JobApplication {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  resume_url: string;
  status: string;
  notes: string | null;
  created_at: string;
  job_opening: { id: string; title: string } | null;
}

const statusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  reviewed: { label: "Analisado", color: "bg-blue-100 text-blue-800", icon: Eye },
  approved: { label: "Aprovado", color: "bg-green-100 text-green-800", icon: Check },
  rejected: { label: "Recusado", color: "bg-red-100 text-red-800", icon: X },
};

const JobApplications = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("job_applications")
      .select("*, job_opening:job_openings(id, title)")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Erro ao carregar candidaturas", variant: "destructive" });
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("job_applications")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Erro ao atualizar status", variant: "destructive" });
    } else {
      toast({ title: "Status atualizado!" });
      fetchApplications();
      if (selectedApplication?.id === id) {
        setSelectedApplication((prev) => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  const saveNotes = async () => {
    if (!selectedApplication) return;

    const { error } = await supabase
      .from("job_applications")
      .update({ notes })
      .eq("id", selectedApplication.id);

    if (error) {
      toast({ title: "Erro ao salvar anotações", variant: "destructive" });
    } else {
      toast({ title: "Anotações salvas!" });
      fetchApplications();
      setSelectedApplication((prev) => prev ? { ...prev, notes } : null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta candidatura?")) return;

    // First, try to delete the resume file
    const app = applications.find((a) => a.id === id);
    if (app?.resume_url) {
      await supabase.storage.from("resumes").remove([app.resume_url.replace("resumes/", "")]);
    }

    const { error } = await supabase.from("job_applications").delete().eq("id", id);

    if (error) {
      toast({ title: "Erro ao excluir candidatura", variant: "destructive" });
    } else {
      toast({ title: "Candidatura excluída!" });
      setSelectedApplication(null);
      fetchApplications();
    }
  };

  const downloadResume = async (resumeUrl: string, applicantName: string) => {
    const filePath = resumeUrl.replace("resumes/", "");
    const { data, error } = await supabase.storage.from("resumes").download(filePath);

    if (error) {
      toast({ title: "Erro ao baixar currículo", variant: "destructive" });
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `curriculo_${applicantName.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openDetails = (app: JobApplication) => {
    setSelectedApplication(app);
    setNotes(app.notes || "");
  };

  const filteredApplications = filterStatus === "all"
    ? applications
    : applications.filter((app) => app.status === filterStatus);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminLayout title="Candidaturas">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Candidaturas</h1>
            <p className="text-muted-foreground">
              {applications.length} candidatura(s) recebida(s)
            </p>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="reviewed">Analisados</SelectItem>
              <SelectItem value="approved">Aprovados</SelectItem>
              <SelectItem value="rejected">Recusados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="card-clean p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {filterStatus === "all"
                ? "Nenhuma candidatura recebida ainda."
                : "Nenhuma candidatura com este status."}
            </p>
          </div>
        ) : (
          <div className="card-clean">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidato</TableHead>
                  <TableHead>Vaga</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => {
                  const status = statusConfig[app.status as keyof typeof statusConfig] || statusConfig.pending;
                  return (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{app.name}</p>
                          <p className="text-sm text-muted-foreground">{app.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {app.job_opening?.title || "Banco de Talentos"}
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(app.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openDetails(app)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => downloadResume(app.resume_url, app.name)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => handleDelete(app.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Details Dialog */}
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Candidatura</DialogTitle>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Nome</Label>
                    <p className="font-medium">{selectedApplication.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Vaga</Label>
                    <p className="font-medium">
                      {selectedApplication.job_opening?.title || "Banco de Talentos"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${selectedApplication.email}`} className="text-primary hover:underline">
                      {selectedApplication.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`https://wa.me/55${selectedApplication.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {selectedApplication.whatsapp}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Candidatura enviada em {formatDate(selectedApplication.created_at)}</span>
                </div>

                <div className="flex items-center gap-4">
                  <Label className="whitespace-nowrap">Status:</Label>
                  <Select
                    value={selectedApplication.status}
                    onValueChange={(value) => updateStatus(selectedApplication.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="reviewed">Analisado</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="rejected">Recusado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Anotações internas</Label>
                  <Textarea
                    rows={4}
                    placeholder="Adicione observações sobre este candidato..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <Button size="sm" onClick={saveNotes}>
                    Salvar Anotações
                  </Button>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => downloadResume(selectedApplication.resume_url, selectedApplication.name)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Currículo
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedApplication.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir Candidatura
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default JobApplications;
