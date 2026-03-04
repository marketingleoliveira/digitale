import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Pencil, Trash2, GripVertical, Loader2, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";
import { isVideoUrl } from "@/lib/media-utils";

interface PrintCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
}

interface Print {
  id: string;
  code: string;
  name: string | null;
  image_url: string;
  category_id: string | null;
  is_active: boolean;
  display_order: number;
}

const PrintsAdmin = () => {
  const { invalidatePrints } = useInvalidateCache();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrint, setEditingPrint] = useState<Print | null>(null);
  const [form, setForm] = useState({
    code: "",
    name: "",
    image_url: "",
    category_id: "",
    is_active: true,
  });

  // Query for prints
  const { data: prints = [], isLoading: printsLoading } = useQuery({
    queryKey: ["admin-prints"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prints")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as Print[];
    },
  });

  // Query for categories
  const { data: categories = [] } = useQuery({
    queryKey: ["print-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("print_categories")
        .select("id, name, slug, parent_id")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as PrintCategory[];
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: typeof form & { id?: string }) => {
      const printData = {
        code: data.code,
        name: data.name || null,
        image_url: data.image_url,
        category_id: data.category_id || null,
        is_active: data.is_active,
      };

      if (data.id) {
        const { error } = await supabase
          .from("prints")
          .update(printData)
          .eq("id", data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("prints")
          .insert([{ ...printData, display_order: prints.length }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidatePrints();
      toast.success(editingPrint ? "Estampa atualizada!" : "Estampa criada!");
      setDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Erro ao salvar estampa", { description: error.message });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("prints").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidatePrints();
      toast.success("Estampa excluída!");
    },
    onError: () => {
      toast.error("Erro ao excluir estampa");
    },
  });

  // Toggle active mutation
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("prints")
        .update({ is_active: !isActive })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidatePrints();
    },
    onError: () => {
      toast.error("Erro ao atualizar status");
    },
  });

  const resetForm = () => {
    setForm({
      code: "",
      name: "",
      image_url: "",
      category_id: "",
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
      category_id: print.category_id || "",
      is_active: print.is_active,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.image_url) {
      toast.error("Preencha o código e a imagem");
      return;
    }

    saveMutation.mutate({
      ...form,
      id: editingPrint?.id,
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta estampa?")) return;
    deleteMutation.mutate(id);
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    toggleActiveMutation.mutate({ id, isActive });
  };

  // Build hierarchical category options
  const getCategoryOptions = () => {
    const parentCategories = categories.filter(c => !c.parent_id);
    const options: { id: string; name: string; isSubcategory: boolean }[] = [];
    
    parentCategories.forEach(parent => {
      options.push({ id: parent.id, name: parent.name, isSubcategory: false });
      categories
        .filter(c => c.parent_id === parent.id)
        .forEach(sub => {
          options.push({ id: sub.id, name: `${parent.name} → ${sub.name}`, isSubcategory: true });
        });
    });
    
    return options;
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return null;
    const category = categories.find(c => c.id === categoryId);
    if (!category) return null;
    
    if (category.parent_id) {
      const parent = categories.find(c => c.id === category.parent_id);
      return parent ? `${parent.name} → ${category.name}` : category.name;
    }
    return category.name;
  };

  const categoryOptions = getCategoryOptions();

  return (
    <AdminLayout title="Estampas">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-muted-foreground">
              Gerencie as estampas exibidas na página de Estampas
            </p>
            <Link to="/admin/print-categories" className="text-sm text-accent hover:underline">
              <FolderOpen className="h-3 w-3 inline mr-1" />
              Gerenciar Categorias
            </Link>
          </div>
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
                  <Label htmlFor="category_id">Categoria</Label>
                  <Select
                    value={form.category_id}
                    onValueChange={(value) => setForm({ ...form, category_id: value === "none" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem categoria</SelectItem>
                      {categoryOptions.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.isSubcategory && <span className="text-muted-foreground">↳ </span>}
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {categories.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      <Link to="/admin/print-categories" className="text-accent hover:underline">
                        Crie categorias primeiro
                      </Link>
                    </p>
                  )}
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
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {editingPrint ? "Salvar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {printsLoading ? (
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
                      {isVideoUrl(print.image_url) ? (
                        <video
                          src={print.image_url}
                          className="w-16 h-16 object-cover rounded-lg"
                          muted playsInline autoPlay loop
                        />
                      ) : (
                        <img
                          src={print.image_url}
                          alt={print.code}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{print.code}</TableCell>
                    <TableCell>{print.name || "-"}</TableCell>
                    <TableCell>
                      {print.category_id ? (
                        <Badge variant="secondary">
                          {getCategoryName(print.category_id)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
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
