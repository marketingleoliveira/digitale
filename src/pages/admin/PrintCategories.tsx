import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, Loader2, ChevronRight, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface PrintCategory {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
}

const PrintCategories = () => {
  const [categories, setCategories] = useState<PrintCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PrintCategory | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    parent_id: "",
    description: "",
    image_url: "",
    is_active: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("print_categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar categorias");
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const resetForm = () => {
    setForm({
      name: "",
      slug: "",
      parent_id: "",
      description: "",
      image_url: "",
      is_active: true,
    });
    setEditingCategory(null);
  };

  const handleEdit = (category: PrintCategory) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      slug: category.slug,
      parent_id: category.parent_id || "",
      description: category.description || "",
      image_url: category.image_url || "",
      is_active: category.is_active,
    });
    setDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm({
      ...form,
      name,
      slug: editingCategory ? form.slug : generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      toast.error("Preencha o nome e o slug");
      return;
    }

    setSaving(true);

    const categoryData = {
      name: form.name,
      slug: form.slug,
      parent_id: form.parent_id || null,
      description: form.description || null,
      image_url: form.image_url || null,
      is_active: form.is_active,
    };

    let error;

    if (editingCategory) {
      const result = await supabase
        .from("print_categories")
        .update(categoryData)
        .eq("id", editingCategory.id);
      error = result.error;
    } else {
      const result = await supabase
        .from("print_categories")
        .insert([{ ...categoryData, display_order: categories.length }]);
      error = result.error;
    }

    if (error) {
      toast.error("Erro ao salvar categoria", { description: error.message });
    } else {
      toast.success(editingCategory ? "Categoria atualizada!" : "Categoria criada!");
      setDialogOpen(false);
      resetForm();
      fetchCategories();
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const hasChildren = categories.some(c => c.parent_id === id);
    if (hasChildren) {
      toast.error("Remova as subcategorias antes de excluir esta categoria");
      return;
    }

    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    const { error } = await supabase.from("print_categories").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir categoria");
    } else {
      toast.success("Categoria excluída!");
      fetchCategories();
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase
      .from("print_categories")
      .update({ is_active: !isActive })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      fetchCategories();
    }
  };

  // Get parent categories (those without parent_id)
  const parentCategories = categories.filter(c => !c.parent_id);
  
  // Get subcategories for a given parent
  const getSubcategories = (parentId: string) => 
    categories.filter(c => c.parent_id === parentId);

  // Get category name by id
  const getCategoryName = (id: string | null) => {
    if (!id) return null;
    return categories.find(c => c.id === id)?.name || null;
  };

  // Build hierarchical list for display
  const buildHierarchicalList = () => {
    const result: (PrintCategory & { level: number })[] = [];
    
    parentCategories.forEach(parent => {
      result.push({ ...parent, level: 0 });
      getSubcategories(parent.id).forEach(sub => {
        result.push({ ...sub, level: 1 });
      });
    });
    
    // Add orphan categories (those without valid parent)
    categories.forEach(cat => {
      if (cat.parent_id && !categories.find(c => c.id === cat.parent_id)) {
        result.push({ ...cat, level: 0 });
      }
    });
    
    return result;
  };

  const hierarchicalCategories = buildHierarchicalList();

  return (
    <AdminLayout title="Categorias de Estampas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            Gerencie as categorias e subcategorias de estampas
          </p>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Editar Categoria" : "Nova Categoria"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Tropical"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="Ex: tropical"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent_id">Categoria Pai (opcional)</Label>
                  <Select
                    value={form.parent_id}
                    onValueChange={(value) => setForm({ ...form, parent_id: value === "none" ? "" : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione (deixe vazio para categoria principal)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma (Categoria Principal)</SelectItem>
                      {parentCategories
                        .filter(c => c.id !== editingCategory?.id)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Deixe vazio para criar uma categoria principal ou selecione uma para criar uma subcategoria
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Breve descrição da categoria..."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Imagem (opcional)</Label>
                  <ImageUpload
                    bucket="prints"
                    folder="categories"
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
                    {editingCategory ? "Salvar" : "Criar"}
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
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma categoria cadastrada.</p>
              <p className="text-sm">Clique em "Nova Categoria" para adicionar.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="w-24">Imagem</TableHead>
                  <TableHead className="w-20">Ativa</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hierarchicalCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {category.level > 0 && (
                          <ChevronRight className="h-4 w-4 text-muted-foreground ml-4" />
                        )}
                        <span className={category.level > 0 ? "text-muted-foreground" : "font-medium"}>
                          {category.name}
                        </span>
                        {category.level === 0 && getSubcategories(category.id).length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {getSubcategories(category.id).length} sub
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                    <TableCell>
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={category.is_active}
                        onCheckedChange={() => handleToggleActive(category.id, category.is_active)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(category.id)}
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

export default PrintCategories;
