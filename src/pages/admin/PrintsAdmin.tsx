import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Pencil, Trash2, GripVertical, Loader2, FolderOpen, MoveRight } from "lucide-react";
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

interface SortablePrintRowProps {
  print: Print;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onEdit: (print: Print) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  categoryName: string | null;
}

const SortablePrintRow = ({
  print,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onToggleActive,
  categoryName,
}: SortablePrintRowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: print.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={isDragging ? "bg-muted" : selected ? "bg-accent/10" : ""}
    >
      <TableCell>
        <Checkbox checked={selected} onCheckedChange={(checked) => onSelect(print.id, !!checked)} />
      </TableCell>
      <TableCell>
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground touch-none"
          title="Arraste para reordenar"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell>
        {isVideoUrl(print.image_url) ? (
          <video
            src={print.image_url}
            className="w-16 h-16 object-cover rounded-lg"
            muted
            playsInline
            autoPlay
            loop
          />
        ) : (
          <img src={print.image_url} alt={print.code} className="w-16 h-16 object-cover rounded-lg" />
        )}
      </TableCell>
      <TableCell className="font-medium">{print.code}</TableCell>
      <TableCell>{print.name || "-"}</TableCell>
      <TableCell>
        {categoryName ? (
          <Badge variant="secondary">{categoryName}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        <Switch
          checked={print.is_active}
          onCheckedChange={() => onToggleActive(print.id, print.is_active)}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => onEdit(print)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(print.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

const PrintsAdmin = () => {
  const { invalidatePrints } = useInvalidateCache();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPrint, setEditingPrint] = useState<Print | null>(null);
  const [selectedPrints, setSelectedPrints] = useState<Set<string>>(new Set());
  const [bulkMoveDialogOpen, setBulkMoveDialogOpen] = useState(false);
  const [bulkCategoryId, setBulkCategoryId] = useState("");
  const [orderedPrints, setOrderedPrints] = useState<Print[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
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

  // Mantém a ordem local sincronizada com o servidor
  useEffect(() => {
    setOrderedPrints(prints);
  }, [prints]);

  // Persiste a nova ordem após o drag
  const reorderMutation = useMutation({
    mutationFn: async (items: Print[]) => {
      const updates = items.map((item, index) =>
        supabase.from("prints").update({ display_order: index }).eq("id", item.id)
      );
      const results = await Promise.all(updates);
      const failed = results.find((r) => r.error);
      if (failed?.error) throw failed.error;
    },
    onSuccess: () => {
      invalidatePrints();
      toast.success("Ordem atualizada!");
    },
    onError: (error: Error) => {
      toast.error("Erro ao reordenar", { description: error.message });
      setOrderedPrints(prints);
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = orderedPrints.findIndex((p) => p.id === active.id);
    const newIndex = orderedPrints.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const next = arrayMove(orderedPrints, oldIndex, newIndex);
    setOrderedPrints(next);
    reorderMutation.mutate(next);
  };

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

  // Bulk move mutation
  const bulkMoveMutation = useMutation({
    mutationFn: async ({ ids, categoryId }: { ids: string[]; categoryId: string | null }) => {
      const { error } = await supabase
        .from("prints")
        .update({ category_id: categoryId })
        .in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidatePrints();
      toast.success(`${selectedPrints.size} estampa(s) movida(s) com sucesso!`);
      setSelectedPrints(new Set());
      setBulkMoveDialogOpen(false);
      setBulkCategoryId("");
    },
    onError: (error) => {
      toast.error("Erro ao mover estampas", { description: error.message });
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

  const handleSelectPrint = (id: string, checked: boolean) => {
    setSelectedPrints(prev => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPrints(new Set(prints.map(p => p.id)));
    } else {
      setSelectedPrints(new Set());
    }
  };

  const handleBulkMove = () => {
    if (selectedPrints.size === 0) return;
    bulkMoveMutation.mutate({
      ids: Array.from(selectedPrints),
      categoryId: bulkCategoryId === "none" ? null : bulkCategoryId || null,
    });
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
  const allSelected = prints.length > 0 && selectedPrints.size === prints.length;

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
          <div className="flex items-center gap-2">
            {selectedPrints.size > 0 && (
              <Dialog open={bulkMoveDialogOpen} onOpenChange={setBulkMoveDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <MoveRight className="h-4 w-4 mr-2" />
                    Mover {selectedPrints.size} selecionada(s)
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Mover Estampas para Categoria</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {selectedPrints.size} estampa(s) selecionada(s) serão movidas para a categoria escolhida.
                    </p>
                    <div className="space-y-2">
                      <Label>Categoria de destino</Label>
                      <Select value={bulkCategoryId} onValueChange={setBulkCategoryId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
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
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" onClick={() => setBulkMoveDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleBulkMove} disabled={bulkMoveMutation.isPending}>
                        {bulkMoveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Mover
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
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
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={(checked) => handleSelectAll(!!checked)}
                      />
                    </TableHead>
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
                  <SortableContext
                    items={orderedPrints.map((p) => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {orderedPrints.map((print) => (
                      <SortablePrintRow
                        key={print.id}
                        print={print}
                        selected={selectedPrints.has(print.id)}
                        onSelect={handleSelectPrint}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                        categoryName={getCategoryName(print.category_id)}
                      />
                    ))}
                  </SortableContext>
                </TableBody>
              </Table>
            </DndContext>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PrintsAdmin;
