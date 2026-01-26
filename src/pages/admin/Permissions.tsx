import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface RolePermission {
  role: string;
  permission_id: string;
}

const ROLES = [
  { value: "redator", label: "Redator" },
  { value: "vendedor", label: "Vendedor" },
];

const CATEGORY_LABELS: Record<string, string> = {
  tecidos: "Tecidos",
  estampas: "Estampas",
  blog: "Blog",
  contatos: "Contatos",
  vagas: "Vagas",
  candidaturas: "Candidaturas",
  depoimentos: "Depoimentos",
  carrossel: "Carrossel",
  newsletter: "Newsletter",
  usuarios: "Usuários",
  configuracoes: "Configurações",
};

const Permissions = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [permsRes, rolePermsRes] = await Promise.all([
      supabase.from("permissions").select("*").order("category"),
      supabase.from("role_permissions").select("*"),
    ]);

    setPermissions(permsRes.data || []);
    setRolePermissions(rolePermsRes.data || []);
    setLoading(false);
  };

  const hasRolePermission = (role: string, permissionId: string) => {
    return rolePermissions.some(rp => rp.role === role && rp.permission_id === permissionId);
  };

  const togglePermission = async (role: string, permissionId: string) => {
    const key = `${role}-${permissionId}`;
    setSaving(key);

    const hasPermission = hasRolePermission(role, permissionId);

    if (hasPermission) {
      const { error } = await supabase
        .from("role_permissions")
        .delete()
        .eq("role", role)
        .eq("permission_id", permissionId);

      if (error) {
        toast.error("Erro ao remover permissão");
      } else {
        setRolePermissions(prev => prev.filter(rp => !(rp.role === role && rp.permission_id === permissionId)));
      }
    } else {
      const { error } = await supabase
        .from("role_permissions")
        .insert({ role, permission_id: permissionId });

      if (error) {
        toast.error("Erro ao adicionar permissão");
      } else {
        setRolePermissions(prev => [...prev, { role, permission_id: permissionId }]);
      }
    }

    setSaving(null);
  };

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <AdminLayout title="Permissões por Cargo">
      <div className="bg-card rounded-2xl border border-border p-6">
        <p className="text-sm text-muted-foreground mb-6">
          Configure quais ações cada cargo pode realizar no sistema. 
          <strong className="text-foreground"> Desenvolvedores</strong> têm acesso total automaticamente.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Permissão</th>
                  {ROLES.map(role => (
                    <th key={role.value} className="text-center py-3 px-4 font-medium">
                      {role.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedPermissions).map(([category, perms]) => (
                  <>
                    <tr key={category} className="bg-muted/50">
                      <td colSpan={ROLES.length + 1} className="py-2 px-4 font-semibold text-sm">
                        {CATEGORY_LABELS[category] || category}
                      </td>
                    </tr>
                    {perms.map(perm => (
                      <tr key={perm.id} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-4">
                          <span className="text-sm">{perm.description}</span>
                        </td>
                        {ROLES.map(role => {
                          const key = `${role.value}-${perm.id}`;
                          const isChecked = hasRolePermission(role.value, perm.id);
                          const isSaving = saving === key;

                          return (
                            <td key={key} className="text-center py-3 px-4">
                              {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin mx-auto text-muted-foreground" />
                              ) : (
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => togglePermission(role.value, perm.id)}
                                />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Permissions;
