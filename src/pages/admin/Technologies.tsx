import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, EyeOff, Star, ArrowUp, ArrowDown, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import * as LucideIcons from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface TechnologyRow {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  icon_url: string | null;
  benefits: unknown;
  applications: unknown;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

const EMPTY_FORM = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  image_url: "",
  icon: "Sparkles",
  icon_url: "",
  benefits: "",
  applications: "",
  is_featured: false,
  is_active: true,
  display_order: 0,
};

const LUCIDE_ICONS = [
  "Sun", "Droplets", "ShieldCheck", "Activity", "Recycle", 
  "Shield", "Waves", "Leaf", "Palette", "Zap", 
  "Cloud", "Wind", "Thermometer", "Sparkles", "CheckCircle2",
  "Target", "Star", "Flame", "Layers", "Fingerprint"
];

/** Normaliza texto em slug URL-safe (sem acentos, espaços viram hífen). */
function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toLines(value: unknown): string {
  if (Array.isArray(value)) return value.join("\n");
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.join("\n") : value;
    } catch {
      return value;
    }
  }
  return "";
}

function fromLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const AdminTechnologies = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<TechnologyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TechnologyRow | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("technologies")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      toast({ title: "Erro ao carregar tecnologias", variant: "destructive" });
    } else {
      setItems((data || []) as TechnologyRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({ ...EMPTY_FORM, display_order: items.length });
    setIsDialogOpen(true);
  };

  const openEdit = (tech: TechnologyRow) => {
    setEditing(tech);
    setFormData({
      name: tech.name,
      slug: tech.slug,
      short_description: tech.short_description ?? "",
      description: tech.description ?? "",
      image_url: tech.image_url ?? "",
      icon: tech.icon ?? "Sparkles",
      icon_url: tech.icon_url ?? "",
      benefits: toLines(tech.benefits),
      applications: toLines(tech.applications),
      is_featured: tech.is_featured,
      is_active: tech.is_active,
      display_order: tech.display_order,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: "Informe o nome da tecnologia", variant: "destructive" });
      return;
    }

    setSaving(true);
    const payload = {
      name: formData.name.trim(),
      slug: slugify(formData.slug || formData.name),
      short_description: formData.short_description.trim() || null,
      description: formData.description.trim() || null,
      image_url: formData.image_url.trim() || null,
      icon: formData.icon.trim() || null,
      benefits: fromLines(formData.benefits),
      applications: fromLines(formData.applications),
      is_featured: formData.is_featured,
      is_active: formData.is_active,
      display_order: Number(formData.display_order) || 0,
    };

    const { error } = editing
      ? await supabase.from("technologies").update(payload).eq("id", editing.id)
      : await supabase.from("technologies").insert(payload);

    setSaving(false);

    if (error) {
      toast({
        title: editing ? "Erro ao atualizar tecnologia" : "Erro ao criar tecnologia",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: editing ? "Tecnologia atualizada!" : "Tecnologia criada!" });
    setIsDialogOpen(false);
    setEditing(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta tecnologia?")) return;
    const { error } = await supabase.from("technologies").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Tecnologia excluída!" });
      fetchItems();
    }
  };

  const toggleField = async (tech: TechnologyRow, field: "is_active" | "is_featured") => {
    const { error } = await supabase
      .from("technologies")
      .update({ [field]: !tech[field] })
      .eq("id", tech.id);
    if (error) {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    } else {
      fetchItems();
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const current = items[index];
    const other = items[target];

    const [a, b] = await Promise.all([
      supabase.from("technologies").update({ display_order: other.display_order }).eq("id", current.id),
      supabase.from("technologies").update({ display_order: current.display_order }).eq("id", other.id),
    ]);

    if (a.error || b.error) {
      toast({ title: "Erro ao reordenar", variant: "destructive" });
    } else {
      fetchItems();
    }
  };

  return (
    <AdminLayout title="Tecnologias">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Gerencie as tecnologias exibidas na página pública /tecnologias.
        </p>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova tecnologia
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Ordem</TableHead>
              <TableHead>Tecnologia</TableHead>
              <TableHead className="hidden md:table-cell">Resumo</TableHead>
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-40 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Nenhuma tecnologia cadastrada.
                </TableCell>
              </TableRow>
            ) : (
              items.map((tech, index) => (
                <TableRow key={tech.id}>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => move(index, -1)} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => move(index, 1)}
                        disabled={index === items.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {tech.image_url && (
                        <img
                          src={tech.image_url}
                          alt={tech.name}
                          loading="lazy"
                          className="h-10 w-16 rounded-md object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{tech.name}</p>
                        <p className="text-xs text-muted-foreground">/{tech.slug}</p>
                      </div>
                      {tech.is_featured && <Badge variant="secondary">Destaque</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="hidden max-w-sm md:table-cell">
                    <p className="truncate text-sm text-muted-foreground">
                      {tech.short_description || "—"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tech.is_active ? "default" : "secondary"}>
                      {tech.is_active ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => toggleField(tech, "is_featured")}>
                      <Star className={tech.is_featured ? "h-4 w-4 fill-current text-accent" : "h-4 w-4"} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleField(tech, "is_active")}>
                      {tech.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(tech)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(tech.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar tecnologia" : "Nova tecnologia"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Proteção UV 50+"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="protecao-uv-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Resumo (card)</Label>
              <Textarea
                id="short_description"
                rows={2}
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição completa</Label>
              <Textarea
                id="description"
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="benefits">Benefícios (um por linha)</Label>
                <Textarea
                  id="benefits"
                  rows={4}
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applications">Aplicações (uma por linha)</Label>
                <Textarea
                  id="applications"
                  rows={4}
                  value={formData.applications}
                  onChange={(e) => setFormData({ ...formData, applications: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="icon">Ícone (Escolha ou digite nome Lucide)</Label>
                <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/20">
                  {LUCIDE_ICONS.map((iconName) => {
                    const IconComponent = (LucideIcons as any)[iconName] || Sparkles;
                    return (
                      <Button
                        key={iconName}
                        type="button"
                        variant={formData.icon === iconName ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setFormData({ ...formData, icon: iconName })}
                        title={iconName}
                      >
                        <IconComponent className="h-4 w-4" />
                      </Button>
                    );
                  })}
                </div>
                <Input
                  id="icon"
                  className="mt-2"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Sun, Droplets, ShieldCheck..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_order">Ordem de exibição</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imagem</Label>
              <ImageUpload
                bucket="uploads"
                folder="technologies"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                />
                <Label htmlFor="is_active">Ativa no site</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                />
                <Label htmlFor="is_featured">Destaque</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminTechnologies;