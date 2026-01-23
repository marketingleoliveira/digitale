import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface Fabric {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  features: string[];
  specifications: Record<string, string>;
  applications: string[];
  is_active: boolean;
  display_order: number;
}

export default function AdminFabrics() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFabric, setEditingFabric] = useState<Fabric | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    short_description: "",
    description: "",
    image_url: "",
    features: "",
    specifications: "",
    applications: "",
    is_active: true,
    display_order: 0,
  });

  const { data: fabrics, isLoading } = useQuery({
    queryKey: ["admin-fabrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabrics")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as Fabric[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const fabricData = {
        name: data.name,
        slug: data.slug,
        short_description: data.short_description || null,
        description: data.description || null,
        image_url: data.image_url || null,
        features: data.features ? data.features.split("\n").filter(Boolean) : [],
        specifications: data.specifications ? JSON.parse(data.specifications) : {},
        applications: data.applications ? data.applications.split("\n").filter(Boolean) : [],
        is_active: data.is_active,
        display_order: data.display_order,
      };

      if (editingFabric) {
        const { error } = await supabase
          .from("fabrics")
          .update(fabricData)
          .eq("id", editingFabric.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("fabrics").insert(fabricData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-fabrics"] });
      toast.success(editingFabric ? "Tecido atualizado!" : "Tecido criado!");
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error("Erro ao salvar: " + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("fabrics").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-fabrics"] });
      toast.success("Tecido excluído!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir: " + error.message);
    },
  });

  const handleOpenCreate = () => {
    setEditingFabric(null);
    setFormData({
      name: "",
      slug: "",
      short_description: "",
      description: "",
      image_url: "",
      features: "",
      specifications: '{\n  "composicao": "",\n  "gramatura": "",\n  "largura": ""\n}',
      applications: "",
      is_active: true,
      display_order: (fabrics?.length || 0) + 1,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (fabric: Fabric) => {
    setEditingFabric(fabric);
    setFormData({
      name: fabric.name,
      slug: fabric.slug,
      short_description: fabric.short_description || "",
      description: fabric.description || "",
      image_url: fabric.image_url || "",
      features: Array.isArray(fabric.features) ? fabric.features.join("\n") : "",
      specifications: JSON.stringify(fabric.specifications || {}, null, 2),
      applications: Array.isArray(fabric.applications) ? fabric.applications.join("\n") : "",
      is_active: fabric.is_active,
      display_order: fabric.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingFabric(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate JSON
    try {
      if (formData.specifications) {
        JSON.parse(formData.specifications);
      }
    } catch {
      toast.error("Especificações inválidas. Verifique o formato JSON.");
      return;
    }

    saveMutation.mutate(formData);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <AdminLayout title="Tecidos">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Tecidos</h1>
            <p className="text-muted-foreground">Gerencie os tecidos exibidos no site</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Tecido
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingFabric ? "Editar Tecido" : "Novo Tecido"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          name: e.target.value,
                          slug: editingFabric ? formData.slug : generateSlug(e.target.value),
                        });
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Descrição Curta</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Completa</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url">URL da Imagem</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Características (uma por linha)</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    rows={4}
                    placeholder="Alto poder de compressão&#10;Proteção UV 50+&#10;Secagem rápida"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specifications">Especificações (JSON)</Label>
                  <Textarea
                    id="specifications"
                    value={formData.specifications}
                    onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applications">Aplicações (uma por linha)</Label>
                  <Textarea
                    id="applications"
                    value={formData.applications}
                    onChange={(e) => setFormData({ ...formData, applications: e.target.value })}
                    rows={3}
                    placeholder="Leggings&#10;Shorts&#10;Tops esportivos"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Ordem de Exibição</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Ativo</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saveMutation.isPending}>
                    {saveMutation.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : fabrics && fabrics.length > 0 ? (
                fabrics.map((fabric) => (
                  <TableRow key={fabric.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">{fabric.name}</TableCell>
                    <TableCell className="text-muted-foreground">{fabric.slug}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          fabric.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {fabric.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell>{fabric.display_order}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(fabric)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Deseja excluir este tecido?")) {
                              deleteMutation.mutate(fabric.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nenhum tecido cadastrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
