import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface JobOpening {
  id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  location: string | null;
  type: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

const JobOpenings = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    type: "full-time",
    is_active: true,
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("job_openings")
      .select("*")
      .order("display_order");

    if (error) {
      toast({ title: "Erro ao carregar vagas", variant: "destructive" });
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const jobData = {
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      requirements: formData.requirements.trim() || null,
      location: formData.location.trim() || null,
      type: formData.type,
      is_active: formData.is_active,
    };

    if (editingJob) {
      const { error } = await supabase
        .from("job_openings")
        .update(jobData)
        .eq("id", editingJob.id);

      if (error) {
        toast({ title: "Erro ao atualizar vaga", variant: "destructive" });
      } else {
        toast({ title: "Vaga atualizada com sucesso!" });
        fetchJobs();
        closeDialog();
      }
    } else {
      const { error } = await supabase.from("job_openings").insert(jobData);

      if (error) {
        toast({ title: "Erro ao criar vaga", variant: "destructive" });
      } else {
        toast({ title: "Vaga criada com sucesso!" });
        fetchJobs();
        closeDialog();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta vaga?")) return;

    const { error } = await supabase.from("job_openings").delete().eq("id", id);

    if (error) {
      toast({ title: "Erro ao excluir vaga", variant: "destructive" });
    } else {
      toast({ title: "Vaga excluída com sucesso!" });
      fetchJobs();
    }
  };

  const toggleActive = async (job: JobOpening) => {
    const { error } = await supabase
      .from("job_openings")
      .update({ is_active: !job.is_active })
      .eq("id", job.id);

    if (error) {
      toast({ title: "Erro ao atualizar status", variant: "destructive" });
    } else {
      fetchJobs();
    }
  };

  const openEditDialog = (job: JobOpening) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description || "",
      requirements: job.requirements || "",
      location: job.location || "",
      type: job.type || "full-time",
      is_active: job.is_active,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingJob(null);
    setFormData({
      title: "",
      description: "",
      requirements: "",
      location: "",
      type: "full-time",
      is_active: true,
    });
  };

  const jobTypes = [
    { value: "full-time", label: "Tempo Integral" },
    { value: "part-time", label: "Meio Período" },
    { value: "internship", label: "Estágio" },
    { value: "temporary", label: "Temporário" },
    { value: "freelance", label: "Freelance" },
  ];

  return (
    <AdminLayout title="Vagas de Emprego">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Vagas de Emprego</h1>
            <p className="text-muted-foreground">
              Gerencie as vagas disponíveis para candidatura
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => !open && closeDialog()}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Vaga
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingJob ? "Editar Vaga" : "Nova Vaga"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Vaga *</Label>
                  <Input
                    id="title"
                    required
                    placeholder="Ex: Analista de Marketing Digital"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      placeholder="Ex: São Paulo, SP"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, location: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Contrato</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição da Vaga</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Descreva as responsabilidades e atividades da vaga..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requisitos</Label>
                  <Textarea
                    id="requirements"
                    rows={4}
                    placeholder="Liste os requisitos e qualificações necessárias..."
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, requirements: e.target.value }))
                    }
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_active: checked }))
                    }
                  />
                  <Label htmlFor="is_active">Vaga ativa (visível no site)</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingJob ? "Salvar Alterações" : "Criar Vaga"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : jobs.length === 0 ? (
          <div className="card-clean p-8 text-center">
            <p className="text-muted-foreground mb-4">
              Nenhuma vaga cadastrada ainda.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira vaga
            </Button>
          </div>
        ) : (
          <div className="card-clean">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vaga</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.location || "-"}</TableCell>
                    <TableCell>
                      {jobTypes.find((t) => t.value === job.type)?.label || job.type}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleActive(job)}
                        className={`flex items-center gap-1.5 text-sm ${
                          job.is_active
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {job.is_active ? (
                          <>
                            <Eye className="h-4 w-4" /> Ativa
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4" /> Inativa
                          </>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openEditDialog(job)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDelete(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default JobOpenings;
