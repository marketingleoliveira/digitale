import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Checkbox,
} from "@/components/ui/checkbox";
import { Plus, Pencil, Trash2, GripVertical, Image, Palette, Images, Star, Dumbbell, Sun } from "lucide-react";
import { toast } from "sonner";
import { isVideoUrl } from "@/lib/media-utils";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import { ColorVariantsEditor, ColorVariant } from "@/components/admin/ColorVariantsEditor";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";

interface GalleryImage {
  url: string;
  alt?: string;
}

interface Fabric {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  fabric_category_assignments?: { category_id: string }[];
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  gallery_images: GalleryImage[];
  features: string[];
  specifications: Record<string, string>;
  applications: string[];
  color_variants: ColorVariant[];
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
}

export default function AdminFabrics() {
  const { invalidateFabrics } = useInvalidateCache();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFabric, setEditingFabric] = useState<Fabric | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category_ids: [] as string[],
    short_description: "",
    description: "",
    image_url: "",
    gallery_images: [] as GalleryImage[],
    features: "",
    specifications: "",
    applications: "",
    color_variants: [] as ColorVariant[],
    is_active: true,
    display_order: 0,
  });

  const { data: categories } = useQuery({
    queryKey: ["admin-fabric-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabric_categories")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: fabrics, isLoading } = useQuery({
    queryKey: ["admin-fabrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fabrics")
        .select("*, fabric_category_assignments(category_id)")
        .order("display_order");

      if (error) throw error;
      return data as unknown as Fabric[];
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
        gallery_images: data.gallery_images as unknown as Record<string, unknown>[],
        features: data.features ? data.features.split("\n").filter(Boolean) : [],
        specifications: data.specifications ? JSON.parse(data.specifications) : {},
        applications: data.applications ? data.applications.split("\n").filter(Boolean) : [],
        color_variants: data.color_variants as unknown as Record<string, unknown>[],
        is_active: data.is_active,
        display_order: data.display_order,
      };

      let fabricId = editingFabric?.id;

      if (editingFabric) {
        const { error } = await supabase
          .from("fabrics")
          .update(fabricData as any)
          .eq("id", editingFabric.id);
        if (error) throw error;
      } else {
        const { data: newFabric, error } = await supabase
          .from("fabrics")
          .insert(fabricData as any)
          .select()
          .single();
        if (error) throw error;
        fabricId = newFabric.id;
      }

      // Update category assignments
      if (fabricId) {
        // Delete existing
        const { error: deleteError } = await supabase
          .from("fabric_category_assignments")
          .delete()
          .eq("fabric_id", fabricId);
        if (deleteError) throw deleteError;

        // Insert new ones
        if (data.category_ids.length > 0) {
          const { error: insertError } = await supabase
            .from("fabric_category_assignments")
            .insert(
              data.category_ids.map((catId) => ({
                fabric_id: fabricId,
                category_id: catId,
              }))
            );
          if (insertError) throw insertError;
        }
      }
    },
    onSuccess: () => {
      invalidateFabrics();
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
      invalidateFabrics();
      toast.success("Tecido excluído!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir: " + error.message);
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, is_featured }: { id: string; is_featured: boolean }) => {
      const { error } = await supabase
        .from("fabrics")
        .update({ is_featured } as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { is_featured }) => {
      invalidateFabrics();
      toast.success(is_featured ? "Tecido destacado na home!" : "Tecido removido dos destaques");
    },
    onError: (error) => {
      toast.error("Erro ao atualizar: " + error.message);
    },
  });

  const handleOpenCreate = () => {
    setEditingFabric(null);
    setFormData({
      name: "",
      slug: "",
      category_ids: [],
      short_description: "",
      description: "",
      image_url: "",
      gallery_images: [],
      features: "",
      specifications: '{\n  "composicao": "",\n  "gramatura": "",\n  "largura": ""\n}',
      applications: "",
      color_variants: [],
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
      category_ids: fabric.fabric_category_assignments?.map(a => a.category_id) || [],
      short_description: fabric.short_description || "",
      description: fabric.description || "",
      image_url: fabric.image_url || "",
      gallery_images: Array.isArray(fabric.gallery_images) ? fabric.gallery_images : [],
      features: Array.isArray(fabric.features) ? fabric.features.join("\n") : "",
      specifications: JSON.stringify(fabric.specifications || {}, null, 2),
      applications: Array.isArray(fabric.applications) ? fabric.applications.join("\n") : "",
      color_variants: Array.isArray(fabric.color_variants) ? fabric.color_variants : [],
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
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingFabric ? "Editar Tecido" : "Novo Tecido"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="info">Informações</TabsTrigger>
                    <TabsTrigger value="media" className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Imagem
                    </TabsTrigger>
                    <TabsTrigger value="gallery" className="flex items-center gap-2">
                      <Images className="h-4 w-4" />
                      Galeria
                    </TabsTrigger>
                    <TabsTrigger value="colors" className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Cores
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4 mt-4">
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
                        <Label>Categorias</Label>
                        <div className="grid grid-cols-2 gap-2 p-3 border rounded-md bg-background/50">
                          {categories?.map((cat) => (
                            <div key={cat.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`cat-${cat.id}`}
                                checked={formData.category_ids.includes(cat.id)}
                                onCheckedChange={(checked) => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    category_ids: checked
                                      ? [...prev.category_ids, cat.id]
                                      : prev.category_ids.filter((id) => id !== cat.id),
                                  }));
                                }}
                              />
                              <label
                                htmlFor={`cat-${cat.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {cat.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Imagem Principal</Label>
                      <ImageUpload
                        bucket="fabrics"
                        folder="main"
                        value={formData.image_url}
                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                      />
                      <p className="text-sm text-muted-foreground">
                        Ou insira uma URL manualmente:
                      </p>
                      <Input
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="gallery" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Galeria de Imagens</Label>
                      <p className="text-sm text-muted-foreground">
                        Adicione imagens secundárias mostrando diferentes ângulos e texturas do tecido.
                      </p>
                      <GalleryUpload
                        bucket="fabrics"
                        folder="gallery"
                        value={formData.gallery_images}
                        onChange={(images) => setFormData({ ...formData, gallery_images: images })}
                        maxImages={6}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="colors" className="space-y-4 mt-4">
                    <ColorVariantsEditor
                      value={formData.color_variants}
                      onChange={(colors) => setFormData({ ...formData, color_variants: colors })}
                    />
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4 border-t">
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
                <TableHead>Imagem</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Cores</TableHead>
                <TableHead>Destaque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead className="w-24">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : fabrics && fabrics.length > 0 ? (
                fabrics.map((fabric) => (
                  <TableRow key={fabric.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>
                      {fabric.image_url ? (
                        isVideoUrl(fabric.image_url) ? (
                          <video
                            src={fabric.image_url}
                            className="w-12 h-12 object-cover rounded"
                            muted playsInline autoPlay loop
                          />
                        ) : (
                          <img
                            src={fabric.image_url}
                            alt={fabric.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <Image className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{fabric.name}</p>
                        <p className="text-sm text-muted-foreground">{fabric.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {fabric.fabric_category_assignments?.map(a => {
                          const cat = categories?.find(c => c.id === a.category_id);
                          return cat ? (
                            <span key={cat.id} className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] rounded-full font-medium flex items-center gap-1">
                              {cat.slug?.toLowerCase() === 'fitness' ? (
                                <Dumbbell className="h-2 w-2" />
                              ) : cat.slug?.toLowerCase() === 'praia' ? (
                                <Sun className="h-2 w-2" />
                              ) : null}
                              {cat.name}
                            </span>
                          ) : null;
                        })}
                        {(!fabric.fabric_category_assignments || fabric.fabric_category_assignments.length === 0) && "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {fabric.color_variants?.slice(0, 4).map((color, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full border border-border"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                        {fabric.color_variants?.length > 4 && (
                          <span className="text-xs text-muted-foreground ml-1">
                            +{fabric.color_variants.length - 4}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFeaturedMutation.mutate({ id: fabric.id, is_featured: !fabric.is_featured })}
                        title={fabric.is_featured ? "Remover destaque" : "Destacar na home"}
                      >
                        <Star
                          className={`h-5 w-5 transition-colors ${
                            fabric.is_featured
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground hover:text-yellow-400"
                          }`}
                        />
                      </Button>
                    </TableCell>
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
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
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
