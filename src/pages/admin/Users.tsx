import { useEffect, useState } from "react";
import { Search, Shield, UserPlus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface UserWithRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  profile?: { full_name: string | null; user_id: string } | null;
}

const ROLES = [
  { value: "desenvolvedor", label: "Desenvolvedor", description: "Acesso total ao sistema" },
  { value: "redator", label: "Redator", description: "Gerencia conteúdo e blog" },
  { value: "vendedor", label: "Vendedor", description: "Acesso a contatos e pedidos" },
];

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState<string>("redator");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const { data: rolesData, error } = await supabase
      .from("user_roles")
      .select("id, user_id, role, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar usuários");
      setLoading(false);
      return;
    }

    const userIds = rolesData?.map(r => r.user_id) || [];
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", userIds);

    const usersWithProfiles = (rolesData || []).map(role => ({
      ...role,
      profile: profilesData?.find(p => p.user_id === role.user_id) || null
    }));

    setUsers(usersWithProfiles);
    setLoading(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Sessão expirada, faça login novamente");
        setCreating(false);
        return;
      }

      const response = await supabase.functions.invoke("create-user", {
        body: {
          email: newUserEmail,
          password: newUserPassword,
          fullName: newUserName,
          role: newUserRole,
        },
      });

      if (response.error) {
        toast.error("Erro ao criar usuário", { description: response.error.message });
      } else if (response.data?.error) {
        toast.error("Erro ao criar usuário", { description: response.data.error });
      } else {
        toast.success("Usuário criado com sucesso!");
        setDialogOpen(false);
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserName("");
        setNewUserRole("redator");
        fetchUsers();
      }
    } catch (err: any) {
      toast.error("Erro ao criar usuário", { description: err.message });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole as any })
      .eq("user_id", userId);

    if (error) {
      toast.error("Erro ao atualizar cargo");
    } else {
      toast.success("Cargo atualizado!");
      fetchUsers();
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("user_id", userId);
    if (error) {
      toast.error("Erro ao remover acesso");
    } else {
      toast.success("Acesso removido");
      fetchUsers();
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
      case "desenvolvedor":
        return "bg-purple-100 text-purple-700";
      case "redator":
      case "editor":
        return "bg-blue-100 text-blue-700";
      case "vendedor":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleLabel = (role: string) => {
    const roleConfig = ROLES.find(r => r.value === role);
    if (roleConfig) return roleConfig.label;
    switch (role) {
      case "admin": return "Administrador";
      case "editor": return "Editor";
      default: return "Usuário";
    }
  };

  const filteredUsers = users.filter((u) => {
    const name = u.profile?.full_name || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <AdminLayout title="Usuários">
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar usuários..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><UserPlus className="h-4 w-4 mr-2" />Novo Usuário</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Criar Novo Usuário</DialogTitle></DialogHeader>
              <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Nome completo" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} placeholder="email@exemplo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} placeholder="Mínimo 6 caracteres" minLength={6} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Select value={newUserRole} onValueChange={setNewUserRole}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ROLES.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex flex-col">
                            <span>{role.label}</span>
                            <span className="text-xs text-muted-foreground">{role.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                  <Button type="submit" disabled={creating}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {creating ? "Criando..." : "Criar Usuário"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-10 text-muted-foreground">Carregando...</div>
        ) : filteredUsers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead className="w-[150px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.profile?.full_name || "Sem nome"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(u.role)}`}>
                      {getRoleLabel(u.role)}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(u.created_at).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Select value={u.role} onValueChange={(value) => handleUpdateRole(u.user_id, value)} disabled={u.user_id === currentUser?.id}>
                        <SelectTrigger className="w-32 h-8">
                          <Shield className="h-3 w-3 mr-1" /><SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map(role => (
                            <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {u.user_id !== currentUser?.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover acesso?</AlertDialogTitle>
                              <AlertDialogDescription>O usuário perderá acesso ao painel administrativo.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteUser(u.user_id)}>Remover</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;
