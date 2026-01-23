import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  GripVertical, 
  Star, 
  Eye, 
  EyeOff,
  Upload,
  X,
  Save,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_company: string | null;
  author_photo_url: string | null;
  rating: number;
  years_partnership: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

const emptyTestimonial: Omit<Testimonial, 'id' | 'created_at'> = {
  quote: "",
  author_name: "",
  author_company: "",
  author_photo_url: null,
  rating: 5,
  years_partnership: "",
  is_active: true,
  display_order: 0,
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar depoimentos");
      console.error(error);
    } else {
      setTestimonials(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!editingTestimonial?.quote || !editingTestimonial?.author_name) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    setSaving(true);

    try {
      if (editingTestimonial.id) {
        // Update existing
        const { error } = await supabase
          .from("testimonials")
          .update({
            quote: editingTestimonial.quote,
            author_name: editingTestimonial.author_name,
            author_company: editingTestimonial.author_company || null,
            author_photo_url: editingTestimonial.author_photo_url,
            rating: editingTestimonial.rating,
            years_partnership: editingTestimonial.years_partnership || null,
            is_active: editingTestimonial.is_active,
          })
          .eq("id", editingTestimonial.id);

        if (error) throw error;
        toast.success("Depoimento atualizado!");
      } else {
        // Create new
        const maxOrder = Math.max(...testimonials.map(t => t.display_order), 0);
        const { error } = await supabase
          .from("testimonials")
          .insert({
            quote: editingTestimonial.quote,
            author_name: editingTestimonial.author_name,
            author_company: editingTestimonial.author_company || null,
            author_photo_url: editingTestimonial.author_photo_url,
            rating: editingTestimonial.rating || 5,
            years_partnership: editingTestimonial.years_partnership || null,
            is_active: editingTestimonial.is_active ?? true,
            display_order: maxOrder + 1,
          });

        if (error) throw error;
        toast.success("Depoimento criado!");
      }

      setDialogOpen(false);
      setEditingTestimonial(null);
      fetchTestimonials();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar depoimento");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao excluir depoimento");
    } else {
      toast.success("Depoimento excluído!");
      fetchTestimonials();
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    const { error } = await supabase
      .from("testimonials")
      .update({ is_active: !currentState })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar status");
    } else {
      toast.success(currentState ? "Depoimento ocultado" : "Depoimento ativado");
      fetchTestimonials();
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Apenas imagens são permitidas");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("testimonials")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("testimonials")
        .getPublicUrl(fileName);

      setEditingTestimonial(prev => ({
        ...prev,
        author_photo_url: publicUrl,
      }));

      toast.success("Foto enviada!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar foto");
    } finally {
      setUploading(false);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const currentItem = testimonials[index];
    const prevItem = testimonials[index - 1];

    await Promise.all([
      supabase.from("testimonials").update({ display_order: prevItem.display_order }).eq("id", currentItem.id),
      supabase.from("testimonials").update({ display_order: currentItem.display_order }).eq("id", prevItem.id),
    ]);

    fetchTestimonials();
  };

  const handleMoveDown = async (index: number) => {
    if (index === testimonials.length - 1) return;

    const currentItem = testimonials[index];
    const nextItem = testimonials[index + 1];

    await Promise.all([
      supabase.from("testimonials").update({ display_order: nextItem.display_order }).eq("id", currentItem.id),
      supabase.from("testimonials").update({ display_order: currentItem.display_order }).eq("id", nextItem.id),
    ]);

    fetchTestimonials();
  };

  const openCreateDialog = () => {
    setEditingTestimonial({ ...emptyTestimonial });
    setDialogOpen(true);
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial({ ...testimonial });
    setDialogOpen(true);
  };

  return (
    <AdminLayout title="Depoimentos">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Gerencie os depoimentos exibidos na página inicial
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchTestimonials} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Depoimento
          </Button>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            Nenhum depoimento cadastrado
          </div>
        ) : (
          <div className="divide-y divide-border">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors"
              >
                {/* Drag Handle & Order */}
                <div className="flex flex-col items-center gap-1 pt-2">
                  <button
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                    className="p-1 hover:bg-muted rounded disabled:opacity-30"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground rotate-90" />
                  </button>
                  <span className="text-xs text-muted-foreground font-medium">
                    {index + 1}
                  </span>
                  <button
                    onClick={() => handleMoveDown(index)}
                    disabled={index === testimonials.length - 1}
                    className="p-1 hover:bg-muted rounded disabled:opacity-30"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground rotate-90" />
                  </button>
                </div>

                {/* Photo */}
                <div className="flex-shrink-0">
                  {testimonial.author_photo_url ? (
                    <img
                      src={testimonial.author_photo_url}
                      alt={testimonial.author_name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                      {testimonial.author_name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground">{testimonial.author_name}</p>
                    {testimonial.author_company && (
                      <span className="text-sm text-muted-foreground">
                        • {testimonial.author_company}
                      </span>
                    )}
                    <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                      {testimonial.is_active ? "Ativo" : "Oculto"}
                    </Badge>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">
                    "{testimonial.quote}"
                  </p>
                  {testimonial.years_partnership && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-accent/10 text-accent">
                      {testimonial.years_partnership}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleActive(testimonial.id, testimonial.is_active)}
                    title={testimonial.is_active ? "Ocultar" : "Ativar"}
                  >
                    {testimonial.is_active ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(testimonial)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir depoimento?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. O depoimento de {testimonial.author_name} será removido permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(testimonial.id)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial?.id ? "Editar Depoimento" : "Novo Depoimento"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Photo Upload */}
            <div className="flex items-center gap-4">
              {editingTestimonial?.author_photo_url ? (
                <div className="relative">
                  <img
                    src={editingTestimonial.author_photo_url}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 border-border"
                  />
                  <button
                    onClick={() => setEditingTestimonial(prev => ({ ...prev, author_photo_url: null }))}
                    className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="w-20 h-20 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-accent transition-colors">
                  {uploading ? (
                    <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                </label>
              )}
              <div>
                <p className="font-medium text-sm">Foto do Cliente</p>
                <p className="text-xs text-muted-foreground">Opcional. JPG ou PNG.</p>
              </div>
            </div>

            {/* Author Name */}
            <div className="space-y-2">
              <Label htmlFor="author_name">Nome do Cliente *</Label>
              <Input
                id="author_name"
                value={editingTestimonial?.author_name || ""}
                onChange={(e) => setEditingTestimonial(prev => ({ ...prev, author_name: e.target.value }))}
                placeholder="Nome completo"
              />
            </div>

            {/* Author Company */}
            <div className="space-y-2">
              <Label htmlFor="author_company">Empresa</Label>
              <Input
                id="author_company"
                value={editingTestimonial?.author_company || ""}
                onChange={(e) => setEditingTestimonial(prev => ({ ...prev, author_company: e.target.value }))}
                placeholder="Nome da empresa"
              />
            </div>

            {/* Quote */}
            <div className="space-y-2">
              <Label htmlFor="quote">Depoimento *</Label>
              <Textarea
                id="quote"
                value={editingTestimonial?.quote || ""}
                onChange={(e) => setEditingTestimonial(prev => ({ ...prev, quote: e.target.value }))}
                placeholder="O que o cliente disse sobre a Digitale..."
                rows={4}
              />
            </div>

            {/* Rating & Years */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Avaliação</Label>
                <Select
                  value={String(editingTestimonial?.rating || 5)}
                  onValueChange={(v) => setEditingTestimonial(prev => ({ ...prev, rating: parseInt(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 4, 3, 2, 1].map((r) => (
                      <SelectItem key={r} value={String(r)}>
                        {r} estrela{r !== 1 && "s"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="years">Tempo de Parceria</Label>
                <Input
                  id="years"
                  value={editingTestimonial?.years_partnership || ""}
                  onChange={(e) => setEditingTestimonial(prev => ({ ...prev, years_partnership: e.target.value }))}
                  placeholder="Ex: 5 anos de parceria"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Testimonials;
