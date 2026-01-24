import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Pencil, Trash2, GripVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Print {
  id: string;
  code: string;
  name: string | null;
  image_url: string;
  category: string | null;
  is_active: boolean;
  display_order: number;
}

const PrintsAdmin = () => {
  const [prints, setPrints] = useState<Print[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrint, setEditingPrint] = useState<Print | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    name: "",
    image_url: "",
    category: "",
    is_active: true,
  });

  useEffect(() => {
    fetchPrints();
  }, []);

  const fetchPrints = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("prints")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar estampas");
    } else {
      setPrints(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm({
      code: "",
      name: "",
      image_url: "",
      category: "",
      is_active: true,
    });
    setEditingPrint(null);
  };

  const handleEdit = (print: Print) => {
    setEditingPrint(print);
    setForm({
      code: print.code,
      name: print.name || "",
      image_url: print.image_url,
      category: print.category || "",
      is_active: print.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.image_url) {
      toast.error("Preencha o código e a imagem");
      return;
    }

    setSaving(true);

    const printData = {
      code: form.code,
      name: form.name || null,
      image_url: form.image_url,
      category: form.category || null,
      is_active: form.is_active,
    };

    let error;

    if (editingPrint) {
      const result = await supabase
        .from("prints")
        .update(printData)
        .eq("id", editingPrint.id);
      error = result.error;
    } else {
      const result = await supabase
        .from("prints")
        .insert([{ ...printData, display_order: prints.length }]);
      error = result.error;
    }

    if (error) {
      toast.error("Erro ao salvar estampa", { description: error.message });
    } else {
      toast.success(editingPrint ? "Estampa atualizada!" : "Estampa criada!");
      setDialogOpen(false);
      resetForm();
      fetchPrints();
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta estampa?")) return;

    const { error } = await supabase.from("prints").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir estampa");
    } else {
      toast.success("Estampa excluída!");
      fetchPrints();
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("prints")
      .update({ is_active: !isActive })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      fetchPrints();
    }
  };

  return (
    <AdminLayout title="Estampas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Gerencie as estampas exibidas na página de Estampas
          </p>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Estampa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPrint ? "Editar Estampa" : "Nova Estampa"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    id="code"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="Ex: 20116"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome (opcional)</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ex: Tropical Vibes"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria (opcional)</Label>
                  <Input
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Ex: Tropical, Geométrico, Floral"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Imagem *</Label>
                  <ImageUpload
                    bucket="prints"
                    value={form.image_url}
                    onChange={(url) => setForm({ ...form, image_url: url })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Ativa</Label>
                  <Switch
                    id="is_active"
                    checked={form.is_active}
                    onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingPrint ? "Salvar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              Carregando...
            </div>
          ) : prints.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhuma estampa cadastrada. Clique em "Nova Estampa" para adicionar.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="w-20">Imagem</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="w-20">Ativa</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prints.map((print) => (
                  <TableRow key={print.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    </TableCell>
                    <TableCell>
                      <img
                        src={print.image_url}
                        alt={print.code}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{print.code}</TableCell>
                    <TableCell>{print.name || "-"}</TableCell>
                    <TableCell>{print.category || "-"}</TableCell>
                    <TableCell>
                      <Switch
                        checked={print.is_active}
                        onCheckedChange={() => handleToggleActive(print.id, print.is_active)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(print)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(print.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PrintsAdmin;
