import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  Upload,
  Newspaper,
  FolderPlus,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface RadarCategory {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
}

interface RadarEdition {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  edition_date: string;
  cover_image_url: string | null;
  file_url: string;
  description: string | null;
  is_published: boolean;
  display_order: number;
  views: number;
  radar_categories: RadarCategory | null;
}

const RadarAdmin = () => {
  const queryClient = useQueryClient();
  const [editionDialog, setEditionDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [editingEdition, setEditingEdition] = useState<RadarEdition | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editionDate, setEditionDate] = useState(new Date().toISOString().split("T")[0]);
  const [fileUrl, setFileUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [views, setViews] = useState(0);
  const [newCategoryName, setNewCategoryName] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-radar-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("radar_categories")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as RadarCategory[];
    },
  });

  const { data: editions = [], isLoading } = useQuery({
    queryKey: ["admin-radar-editions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("radar_editions")
        .select("*, radar_categories(*)")
        .order("edition_date", { ascending: false });
      if (error) throw error;
      return data as RadarEdition[];
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategoryId("");
    setEditionDate(new Date().toISOString().split("T")[0]);
    setFileUrl("");
    setCoverUrl("");
    setIsPublished(false);
    setViews(0);
    setEditingEdition(null);
  };

  const openEditDialog = (edition: RadarEdition) => {
    setEditingEdition(edition);
    setTitle(edition.title);
    setDescription(edition.description || "");
    setCategoryId(edition.category_id || "");
    setEditionDate(edition.edition_date);
    setFileUrl(edition.file_url);
    setCoverUrl(edition.cover_image_url || "");
    setIsPublished(edition.is_published);
    setViews(edition.views ?? 0);
    setEditionDialog(true);
  };

  const generateSlug = (text: string) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `radar/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("uploads").upload(path, file);
    if (error) {
      toast.error("Erro ao enviar arquivo");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(path);

    if (type === "file") setFileUrl(urlData.publicUrl);
    else setCoverUrl(urlData.publicUrl);

    setUploading(false);
    toast.success("Arquivo enviado!");
  };

  const handleSaveEdition = async () => {
    if (!title || !fileUrl) {
      toast.error("Preencha título e arquivo");
      return;
    }

    const slug = generateSlug(title);
    const payload = {
      title,
      slug,
      description: description || null,
      category_id: categoryId || null,
      edition_date: editionDate,
      file_url: fileUrl,
      cover_image_url: coverUrl || null,
      is_published: isPublished,
      views,
      updated_at: new Date().toISOString(),
    };

    if (editingEdition) {
      const { error } = await supabase
        .from("radar_editions")
        .update(payload)
        .eq("id", editingEdition.id);
      if (error) {
        toast.error("Erro ao atualizar edição");
        return;
      }
      toast.success("Edição atualizada!");
    } else {
      const { error } = await supabase.from("radar_editions").insert(payload);
      if (error) {
        toast.error("Erro ao criar edição");
        return;
      }
      toast.success("Edição criada!");
    }

    queryClient.invalidateQueries({ queryKey: ["admin-radar-editions"] });
    setEditionDialog(false);
    resetForm();
  };

  const handleDeleteEdition = async (id: string) => {
    const { error } = await supabase.from("radar_editions").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir");
    else {
      toast.success("Edição excluída");
      queryClient.invalidateQueries({ queryKey: ["admin-radar-editions"] });
    }
  };

  const togglePublish = async (edition: RadarEdition) => {
    const { error } = await supabase
      .from("radar_editions")
      .update({ is_published: !edition.is_published })
      .eq("id", edition.id);
    if (error) toast.error("Erro");
    else {
      toast.success(edition.is_published ? "Despublicado" : "Publicado!");
      queryClient.invalidateQueries({ queryKey: ["admin-radar-editions"] });
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    const slug = generateSlug(newCategoryName);
    const { error } = await supabase.from("radar_categories").insert({ name: newCategoryName, slug });
    if (error) {
      toast.error("Erro ao criar categoria");
      return;
    }
    toast.success("Categoria criada!");
    setNewCategoryName("");
    setCategoryDialog(false);
    queryClient.invalidateQueries({ queryKey: ["admin-radar-categories"] });
  };

  return (
    <AdminLayout title="Radar Digitale">
      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Dialog open={editionDialog} onOpenChange={(o) => { setEditionDialog(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-primary">
              <Plus className="h-4 w-4 mr-2" />
              Nova Edição
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEdition ? "Editar Edição" : "Nova Edição"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Título *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: D&G assina fantasia Viradouro" />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descrição da edição" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Categoria</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Data da Edição</Label>
                  <Input type="date" value={editionDate} onChange={(e) => setEditionDate(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Arquivo da Newsletter (PDF ou Imagem) *</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" onChange={(e) => handleFileUpload(e, "file")} disabled={uploading} />
                {fileUrl && (
                  <p className="text-xs text-green-600 mt-1 truncate">✓ {fileUrl.split("/").pop()}</p>
                )}
              </div>
              <div>
                <Label>Capa / Thumbnail (opcional)</Label>
                <Input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => handleFileUpload(e, "cover")} disabled={uploading} />
                {coverUrl && (
                  <img src={coverUrl} alt="Cover" className="mt-2 h-32 object-cover rounded-lg" />
                )}
              </div>
              <div>
                <Label>Visualizações</Label>
                <Input type="number" min={0} value={views} onChange={(e) => setViews(parseInt(e.target.value) || 0)} placeholder="0" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="publish"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="publish">Publicar imediatamente</Label>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="outline" onClick={() => { setEditionDialog(false); resetForm(); }}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdition} disabled={uploading}>
                  {editingEdition ? "Salvar" : "Criar Edição"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <FolderPlus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Nova Categoria</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Nome da Categoria</Label>
                <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Ex: Tendência" />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setCategoryDialog(false)}>Cancelar</Button>
                <Button onClick={handleAddCategory}>Criar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Editions Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : editions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  Nenhuma edição cadastrada
                </TableCell>
              </TableRow>
            ) : (
              editions.map((edition) => (
                <TableRow key={edition.id}>
                  <TableCell className="font-medium">{edition.title}</TableCell>
                  <TableCell>
                    {edition.radar_categories ? (
                      <Badge variant="secondary">{edition.radar_categories.name}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(edition.edition_date).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{edition.views ?? 0}</TableCell>
                  <TableCell>
                    <Badge variant={edition.is_published ? "default" : "outline"} className={edition.is_published ? "bg-green-500" : ""}>
                      {edition.is_published ? "Publicado" : "Rascunho"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => togglePublish(edition)}>
                        {edition.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(edition)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir edição?</AlertDialogTitle>
                            <AlertDialogDescription>
                              A edição "{edition.title}" será removida permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteEdition(edition.id)} className="bg-destructive text-destructive-foreground">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default RadarAdmin;
