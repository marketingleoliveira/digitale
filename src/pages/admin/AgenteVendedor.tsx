import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Save, MessageSquare, GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AgenteVendedor() {
  const qc = useQueryClient();
  const [settings, setSettings] = useState<any>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  const [editing, setEditing] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: settingsData } = useQuery({
    queryKey: ["agent-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_settings")
        .select("*")
        .eq("key", "main")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settingsData) setSettings(settingsData);
  }, [settingsData]);

  const { data: knowledge } = useQuery({
    queryKey: ["agent-knowledge-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_knowledge")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: conversations } = useQuery({
    queryKey: ["agent-conversations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_conversations")
        .select("*, agent_messages(id, role, content, created_at, is_fallback)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  async function saveSettings() {
    if (!settings) return;
    setSavingSettings(true);
    const { error } = await (supabase as any)
      .from("agent_settings")
      .update({
        agent_name: settings.agent_name,
        greeting: settings.greeting,
        persona: settings.persona,
        fallback_message: settings.fallback_message,
        is_enabled: settings.is_enabled,
        typing_speed_ms: settings.typing_speed_ms,
        min_typing_delay_ms: settings.min_typing_delay_ms,
        qualification_questions: settings.qualification_questions || [],
        reply_in_blocks: settings.reply_in_blocks !== false,
      })
      .eq("key", "main");
    setSavingSettings(false);
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
    } else {
      toast.success("Configurações salvas");
      qc.invalidateQueries({ queryKey: ["agent-settings"] });
    }
  }

  function openNew() {
    setEditing({
      category: "geral",
      question: "",
      answer: "",
      keywords: "",
      is_active: true,
      display_order: (knowledge?.length || 0) + 1,
    });
    setDialogOpen(true);
  }

  function openEdit(item: any) {
    setEditing({ ...item });
    setDialogOpen(true);
  }

  async function saveKnowledge() {
    if (!editing?.question?.trim() || !editing?.answer?.trim()) {
      toast.error("Pergunta e resposta são obrigatórias");
      return;
    }
    const payload = {
      category: editing.category || "geral",
      question: editing.question,
      answer: editing.answer,
      keywords: editing.keywords || "",
      is_active: editing.is_active !== false,
      display_order: editing.display_order || 0,
    };
    const { error } = editing.id
      ? await supabase.from("agent_knowledge").update(payload).eq("id", editing.id)
      : await supabase.from("agent_knowledge").insert(payload);
    if (error) {
      toast.error("Erro: " + error.message);
      return;
    }
    toast.success("Resposta salva");
    setDialogOpen(false);
    qc.invalidateQueries({ queryKey: ["agent-knowledge-admin"] });
  }

  async function deleteKnowledge(id: string) {
    if (!confirm("Excluir esta resposta?")) return;
    const { error } = await supabase.from("agent_knowledge").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Excluído");
    qc.invalidateQueries({ queryKey: ["agent-knowledge-admin"] });
  }

  async function toggleActive(item: any) {
    await supabase
      .from("agent_knowledge")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);
    qc.invalidateQueries({ queryKey: ["agent-knowledge-admin"] });
  }

  return (
    <AdminLayout title="Agente Vendedor IA">
      <Tabs defaultValue="settings" className="w-full">
        <TabsList>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="knowledge">Respostas ({knowledge?.length || 0})</TabsTrigger>
          <TabsTrigger value="conversations">Conversas</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4 mt-6">
          {settings && (
            <Card>
              <CardHeader>
                <CardTitle>Persona do Vendedor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={settings.is_enabled}
                    onCheckedChange={(v) => setSettings({ ...settings, is_enabled: v })}
                  />
                  <Label>Agente ativo no site</Label>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome do vendedor</Label>
                    <Input
                      value={settings.agent_name}
                      onChange={(e) => setSettings({ ...settings, agent_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Velocidade de digitação (ms/char)</Label>
                    <Input
                      type="number"
                      value={settings.typing_speed_ms}
                      onChange={(e) =>
                        setSettings({ ...settings, typing_speed_ms: parseInt(e.target.value) || 30 })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Mensagem de boas-vindas</Label>
                  <Textarea
                    rows={2}
                    value={settings.greeting}
                    onChange={(e) => setSettings({ ...settings, greeting: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Persona / Instruções de tom (system prompt)</Label>
                  <Textarea
                    rows={6}
                    value={settings.persona}
                    onChange={(e) => setSettings({ ...settings, persona: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Define como o agente fala. Inclua regras de linguagem (informal, brasileira), proibições e estilo.
                  </p>
                </div>

                <div>
                  <Label>Mensagem padrão quando não souber responder</Label>
                  <Textarea
                    rows={3}
                    value={settings.fallback_message}
                    onChange={(e) => setSettings({ ...settings, fallback_message: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Usada quando o agente não tem resposta — geralmente pedindo WhatsApp pra retornar.
                  </p>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={settings.reply_in_blocks !== false}
                      onCheckedChange={(v) => setSettings({ ...settings, reply_in_blocks: v })}
                    />
                    <Label>Respostas em blocos (mais humano)</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Quando ligado, o agente pode quebrar a resposta em até 3 mensagens curtas, com pausa entre elas — como uma pessoa real digitando.
                  </p>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-base">Perguntas de qualificação</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    O agente fará essas perguntas (uma por vez, em ordem) para qualificar o lead ANTES de pedir WhatsApp e CNPJ.
                  </p>
                  <div className="space-y-2">
                    {(settings.qualification_questions || []).map((q: string, idx: number) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <span className="text-xs font-mono bg-muted px-2 py-2 rounded">
                          {idx + 1}
                        </span>
                        <Textarea
                          rows={2}
                          value={q}
                          onChange={(e) => {
                            const arr = [...(settings.qualification_questions || [])];
                            arr[idx] = e.target.value;
                            setSettings({ ...settings, qualification_questions: arr });
                          }}
                          className="flex-1"
                        />
                        <div className="flex flex-col gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={idx === 0}
                            onClick={() => {
                              const arr = [...(settings.qualification_questions || [])];
                              [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                              setSettings({ ...settings, qualification_questions: arr });
                            }}
                            title="Mover para cima"
                          >
                            ↑
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const arr = [...(settings.qualification_questions || [])];
                              arr.splice(idx, 1);
                              setSettings({ ...settings, qualification_questions: arr });
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const arr = [...(settings.qualification_questions || []), ""];
                        setSettings({ ...settings, qualification_questions: arr });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Adicionar pergunta
                    </Button>
                  </div>
                </div>

                <Button onClick={saveSettings} disabled={savingSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  {savingSettings ? "Salvando..." : "Salvar configurações"}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Cadastre perguntas e respostas que o agente usará. Quanto mais palavras-chave, melhor a precisão.
            </p>
            <Button onClick={openNew}>
              <Plus className="h-4 w-4 mr-2" /> Nova resposta
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Pergunta</TableHead>
                    <TableHead>Palavras-chave</TableHead>
                    <TableHead>Ativa</TableHead>
                    <TableHead className="w-32">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {knowledge?.map((k) => (
                    <TableRow key={k.id} className="cursor-pointer" onClick={() => openEdit(k)}>
                      <TableCell className="text-xs">{k.category}</TableCell>
                      <TableCell className="font-medium">{k.question}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                        {k.keywords}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Switch
                          checked={k.is_active}
                          onCheckedChange={() => toggleActive(k)}
                        />
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => deleteKnowledge(k.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!knowledge?.length && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        Nenhuma resposta cadastrada ainda.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="space-y-4 mt-6">
          <p className="text-sm text-muted-foreground">
            Últimas 50 conversas. Conversas marcadas precisam de retorno por WhatsApp.
          </p>
          <div className="grid gap-3">
            {conversations?.map((c: any) => (
              <Card key={c.id} className={c.needs_followup ? "border-accent" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-sm flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {new Date(c.created_at).toLocaleString("pt-BR")}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1 truncate max-w-md">
                        {c.page_url}
                      </p>
                      {(c.visitor_whatsapp || c.visitor_cnpj) && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {c.visitor_whatsapp && (
                            <span className="text-xs bg-green-500/10 text-green-700 px-2 py-0.5 rounded-full">
                              WhatsApp: {c.visitor_whatsapp}
                            </span>
                          )}
                          {c.visitor_cnpj && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              CNPJ: {c.visitor_cnpj}
                            </span>
                          )}
                          {c.handoff_at && (
                            <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full font-semibold">
                              ✓ Lead qualificado
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {c.needs_followup && (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                        Retornar WhatsApp
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {(c.agent_messages || [])
                      .sort(
                        (a: any, b: any) =>
                          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                      )
                      .map((m: any) => (
                        <div key={m.id} className="text-xs">
                          <span
                            className={
                              m.role === "user"
                                ? "font-semibold text-primary"
                                : "font-semibold text-muted-foreground"
                            }
                          >
                            {m.role === "user" ? "Visitante" : "Agente"}:
                          </span>{" "}
                          {m.content}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {!conversations?.length && (
              <p className="text-center text-muted-foreground py-8">Nenhuma conversa ainda.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Editar resposta" : "Nova resposta"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Categoria</Label>
                  <Input
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={editing.display_order}
                    onChange={(e) =>
                      setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div>
                <Label>Pergunta (referência interna)</Label>
                <Input
                  value={editing.question}
                  onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                />
              </div>
              <div>
                <Label>Resposta (que o agente vai dizer)</Label>
                <Textarea
                  rows={4}
                  value={editing.answer}
                  onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                />
              </div>
              <div>
                <Label>Palavras-chave (separadas por vírgula)</Label>
                <Input
                  value={editing.keywords}
                  onChange={(e) => setEditing({ ...editing, keywords: e.target.value })}
                  placeholder="ex: preço, valor, custo, quanto custa"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editing.is_active}
                  onCheckedChange={(v) => setEditing({ ...editing, is_active: v })}
                />
                <Label>Ativa</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveKnowledge}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}