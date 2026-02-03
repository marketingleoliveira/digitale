import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Waves, Dumbbell } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import { useInvalidateCache } from "@/hooks/useInvalidateCache";

interface Subcategory {
  name: string;
  description: string;
  features: string[];
}

interface Benefit {
  title: string;
  description: string;
}

interface Fabric {
  name: string;
  slug: string;
}

interface GalleryImage {
  url: string;
  alt?: string;
}

interface Segment {
  id: string;
  slug: string;
  name: string;
  icon: string;
  hero_image: string | null;
  gallery_images: GalleryImage[];
  description: string | null;
  long_description: string | null;
  features: string[];
  fabrics: Fabric[];
  subcategories: Subcategory[];
  benefits: Benefit[];
  is_active: boolean;
  display_order: number;
}

const iconOptions = [
  { value: "waves", label: "Praia (Ondas)", icon: Waves },
  { value: "dumbbell", label: "Esportivo (Halter)", icon: Dumbbell },
];

const SegmentsAdmin = () => {
  const { invalidateSegments } = useInvalidateCache();
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: segments, isLoading } = useQuery({
    queryKey: ["admin-segments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("segments")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;

      return (data || []).map((s: any) => ({
        ...s,
        gallery_images: Array.isArray(s.gallery_images) 
          ? s.gallery_images.map((img: any) => 
              typeof img === 'string' ? { url: img, alt: '' } : img
            )
          : [],
        features: Array.isArray(s.features) ? s.features : [],
        fabrics: Array.isArray(s.fabrics) ? s.fabrics : [],
        subcategories: Array.isArray(s.subcategories) ? s.subcategories : [],
        benefits: Array.isArray(s.benefits) ? s.benefits : [],
      })) as Segment[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (segment: Segment) => {
      const { id, ...rest } = segment;
      
      // Convert to JSON compatible format
      const updateData = {
        slug: rest.slug,
        name: rest.name,
        icon: rest.icon,
        hero_image: rest.hero_image,
        description: rest.description,
        long_description: rest.long_description,
        is_active: rest.is_active,
        display_order: rest.display_order,
        gallery_images: rest.gallery_images as any,
        features: rest.features as any,
        fabrics: rest.fabrics as any,
        subcategories: rest.subcategories as any,
        benefits: rest.benefits as any,
      };
      
      const { error } = await supabase
        .from("segments")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateSegments();
      toast.success("Segmento atualizado!");
      setIsDialogOpen(false);
      setEditingSegment(null);
    },
    onError: (error) => {
      toast.error("Erro ao atualizar segmento: " + error.message);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("segments")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateSegments();
      toast.success("Status atualizado!");
    },
  });

  const handleSave = () => {
    if (!editingSegment) return;
    updateMutation.mutate(editingSegment);
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (!editingSegment) return;
    const newFeatures = [...editingSegment.features];
    newFeatures[index] = value;
    setEditingSegment({ ...editingSegment, features: newFeatures });
  };

  const addFeature = () => {
    if (!editingSegment) return;
    setEditingSegment({
      ...editingSegment,
      features: [...editingSegment.features, ""],
    });
  };

  const removeFeature = (index: number) => {
    if (!editingSegment) return;
    const newFeatures = editingSegment.features.filter((_, i) => i !== index);
    setEditingSegment({ ...editingSegment, features: newFeatures });
  };

  const handleSubcategoryChange = (index: number, field: keyof Subcategory, value: any) => {
    if (!editingSegment) return;
    const newSubcategories = [...editingSegment.subcategories];
    newSubcategories[index] = { ...newSubcategories[index], [field]: value };
    setEditingSegment({ ...editingSegment, subcategories: newSubcategories });
  };

  const addSubcategory = () => {
    if (!editingSegment) return;
    setEditingSegment({
      ...editingSegment,
      subcategories: [
        ...editingSegment.subcategories,
        { name: "", description: "", features: [] },
      ],
    });
  };

  const removeSubcategory = (index: number) => {
    if (!editingSegment) return;
    const newSubcategories = editingSegment.subcategories.filter((_, i) => i !== index);
    setEditingSegment({ ...editingSegment, subcategories: newSubcategories });
  };

  const handleBenefitChange = (index: number, field: keyof Benefit, value: string) => {
    if (!editingSegment) return;
    const newBenefits = [...editingSegment.benefits];
    newBenefits[index] = { ...newBenefits[index], [field]: value };
    setEditingSegment({ ...editingSegment, benefits: newBenefits });
  };

  const addBenefit = () => {
    if (!editingSegment) return;
    setEditingSegment({
      ...editingSegment,
      benefits: [...editingSegment.benefits, { title: "", description: "" }],
    });
  };

  const removeBenefit = (index: number) => {
    if (!editingSegment) return;
    const newBenefits = editingSegment.benefits.filter((_, i) => i !== index);
    setEditingSegment({ ...editingSegment, benefits: newBenefits });
  };

  const handleFabricChange = (index: number, field: keyof Fabric, value: string) => {
    if (!editingSegment) return;
    const newFabrics = [...editingSegment.fabrics];
    newFabrics[index] = { ...newFabrics[index], [field]: value };
    setEditingSegment({ ...editingSegment, fabrics: newFabrics });
  };

  const addFabric = () => {
    if (!editingSegment) return;
    setEditingSegment({
      ...editingSegment,
      fabrics: [...editingSegment.fabrics, { name: "", slug: "" }],
    });
  };

  const removeFabric = (index: number) => {
    if (!editingSegment) return;
    const newFabrics = editingSegment.fabrics.filter((_, i) => i !== index);
    setEditingSegment({ ...editingSegment, fabrics: newFabrics });
  };

  if (isLoading) {
    return (
      <AdminLayout title="Segmentos">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Segmentos">
      <div className="space-y-6">
        <p className="text-muted-foreground">
          Gerencie os segmentos de mercado e suas informações
        </p>

        <div className="grid gap-4">
          {segments?.map((segment) => (
            <Card key={segment.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      {segment.icon === "waves" ? (
                        <Waves className="h-6 w-6 text-accent" />
                      ) : (
                        <Dumbbell className="h-6 w-6 text-accent" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{segment.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {segment.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${segment.id}`} className="text-sm">
                        Ativo
                      </Label>
                      <Switch
                        id={`active-${segment.id}`}
                        checked={segment.is_active}
                        onCheckedChange={(checked) =>
                          toggleActiveMutation.mutate({
                            id: segment.id,
                            is_active: checked,
                          })
                        }
                      />
                    </div>

                    <Dialog
                      open={isDialogOpen && editingSegment?.id === segment.id}
                      onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) setEditingSegment(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingSegment(segment);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Editar Segmento: {segment.name}</DialogTitle>
                        </DialogHeader>

                        {editingSegment && (
                          <Tabs defaultValue="general" className="mt-4">
                            <TabsList className="grid grid-cols-5 w-full">
                              <TabsTrigger value="general">Geral</TabsTrigger>
                              <TabsTrigger value="images">Imagens</TabsTrigger>
                              <TabsTrigger value="features">Recursos</TabsTrigger>
                              <TabsTrigger value="applications">Aplicações</TabsTrigger>
                              <TabsTrigger value="fabrics">Tecidos</TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="space-y-4 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Nome</Label>
                                  <Input
                                    value={editingSegment.name}
                                    onChange={(e) =>
                                      setEditingSegment({
                                        ...editingSegment,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Slug (URL)</Label>
                                  <Input
                                    value={editingSegment.slug}
                                    onChange={(e) =>
                                      setEditingSegment({
                                        ...editingSegment,
                                        slug: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Ícone</Label>
                                <div className="flex gap-2">
                                  {iconOptions.map((option) => (
                                    <Button
                                      key={option.value}
                                      type="button"
                                      variant={
                                        editingSegment.icon === option.value
                                          ? "default"
                                          : "outline"
                                      }
                                      className="flex items-center gap-2"
                                      onClick={() =>
                                        setEditingSegment({
                                          ...editingSegment,
                                          icon: option.value,
                                        })
                                      }
                                    >
                                      <option.icon className="h-4 w-4" />
                                      {option.label}
                                    </Button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Descrição Curta</Label>
                                <Textarea
                                  value={editingSegment.description || ""}
                                  onChange={(e) =>
                                    setEditingSegment({
                                      ...editingSegment,
                                      description: e.target.value,
                                    })
                                  }
                                  rows={2}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Descrição Completa</Label>
                                <Textarea
                                  value={editingSegment.long_description || ""}
                                  onChange={(e) =>
                                    setEditingSegment({
                                      ...editingSegment,
                                      long_description: e.target.value,
                                    })
                                  }
                                  rows={4}
                                />
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <Label>Benefícios</Label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addBenefit}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Adicionar
                                  </Button>
                                </div>
                                {editingSegment.benefits.map((benefit, index) => (
                                  <div
                                    key={index}
                                    className="p-4 border rounded-lg space-y-3"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">
                                        Benefício {index + 1}
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeBenefit(index)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                    <Input
                                      placeholder="Título"
                                      value={benefit.title}
                                      onChange={(e) =>
                                        handleBenefitChange(
                                          index,
                                          "title",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <Textarea
                                      placeholder="Descrição"
                                      value={benefit.description}
                                      onChange={(e) =>
                                        handleBenefitChange(
                                          index,
                                          "description",
                                          e.target.value
                                        )
                                      }
                                      rows={2}
                                    />
                                  </div>
                                ))}
                              </div>
                            </TabsContent>

                            <TabsContent value="images" className="space-y-6 mt-4">
                              <div className="space-y-2">
                                <Label>Imagem Hero (Banner)</Label>
                                <ImageUpload
                                  value={editingSegment.hero_image || ""}
                                  onChange={(url) =>
                                    setEditingSegment({
                                      ...editingSegment,
                                      hero_image: url,
                                    })
                                  }
                                  bucket="fabrics"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Galeria de Imagens</Label>
                                <GalleryUpload
                                  value={editingSegment.gallery_images}
                                  onChange={(images) =>
                                    setEditingSegment({
                                      ...editingSegment,
                                      gallery_images: images,
                                    })
                                  }
                                  bucket="fabrics"
                                />
                              </div>
                            </TabsContent>

                            <TabsContent value="features" className="space-y-4 mt-4">
                              <div className="flex items-center justify-between">
                                <Label>Características / Tags</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={addFeature}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Adicionar
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {editingSegment.features.map((feature, index) => (
                                  <div key={index} className="flex gap-2">
                                    <Input
                                      value={feature}
                                      onChange={(e) =>
                                        handleFeatureChange(index, e.target.value)
                                      }
                                      placeholder="Ex: Proteção UV 50+"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeFeature(index)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>

                            <TabsContent value="applications" className="space-y-4 mt-4">
                              <div className="flex items-center justify-between">
                                <Label>Aplicações (Subcategorias)</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={addSubcategory}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Adicionar
                                </Button>
                              </div>
                              {editingSegment.subcategories.map((sub, index) => (
                                <div
                                  key={index}
                                  className="p-4 border rounded-lg space-y-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                      Aplicação {index + 1}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeSubcategory(index)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                  <Input
                                    placeholder="Nome (Ex: Biquínis)"
                                    value={sub.name}
                                    onChange={(e) =>
                                      handleSubcategoryChange(
                                        index,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                  />
                                  <Textarea
                                    placeholder="Descrição"
                                    value={sub.description}
                                    onChange={(e) =>
                                      handleSubcategoryChange(
                                        index,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    rows={2}
                                  />
                                  <div className="space-y-2">
                                    <Label className="text-xs">
                                      Características (separadas por vírgula)
                                    </Label>
                                    <Input
                                      placeholder="Alta elasticidade, Resistência ao sal, Secagem rápida"
                                      value={sub.features.join(", ")}
                                      onChange={(e) =>
                                        handleSubcategoryChange(
                                          index,
                                          "features",
                                          e.target.value
                                            .split(",")
                                            .map((f) => f.trim())
                                            .filter(Boolean)
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ))}
                            </TabsContent>

                            <TabsContent value="fabrics" className="space-y-4 mt-4">
                              <div className="flex items-center justify-between">
                                <Label>Tecidos Recomendados</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={addFabric}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Adicionar
                                </Button>
                              </div>
                              <div className="grid gap-2">
                                {editingSegment.fabrics.map((fabric, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <Input
                                      placeholder="Nome do Tecido"
                                      value={fabric.name}
                                      onChange={(e) =>
                                        handleFabricChange(
                                          index,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      className="flex-1"
                                    />
                                    <Input
                                      placeholder="Slug (URL)"
                                      value={fabric.slug}
                                      onChange={(e) =>
                                        handleFabricChange(
                                          index,
                                          "slug",
                                          e.target.value
                                        )
                                      }
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeFabric(index)}
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </TabsContent>
                          </Tabs>
                        )}

                        <div className="flex justify-end gap-2 mt-6">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsDialogOpen(false);
                              setEditingSegment(null);
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={handleSave}
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending
                              ? "Salvando..."
                              : "Salvar Alterações"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default SegmentsAdmin;
