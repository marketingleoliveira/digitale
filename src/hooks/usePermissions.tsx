import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

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

export function usePermissions() {
  const { user, isAdmin } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch user role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      const role = roleData?.role || null;
      setUserRole(role);

      // Admin and desenvolvedor have all permissions
      if (role === "admin" || role === "desenvolvedor") {
        const { data: allPerms } = await supabase
          .from("permissions")
          .select("*");
        setPermissions(allPerms || []);
        setUserPermissions(allPerms?.map(p => p.name) || []);
      } else {
        // Fetch all permissions
        const { data: permsData } = await supabase
          .from("permissions")
          .select("*");
        setPermissions(permsData || []);

        // Fetch role permissions
        const { data: rolePermsData } = await supabase
          .from("role_permissions")
          .select("*");
        setRolePermissions(rolePermsData || []);

        // Get user's permissions based on role
        if (role) {
          const userRolePerms = rolePermsData?.filter(rp => rp.role === role) || [];
          const permIds = userRolePerms.map(rp => rp.permission_id);
          const userPerms = permsData?.filter(p => permIds.includes(p.id)).map(p => p.name) || [];
          setUserPermissions(userPerms);
        }
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permissionName: string): boolean => {
    if (isAdmin || userRole === "admin" || userRole === "desenvolvedor") {
      return true;
    }
    return userPermissions.includes(permissionName);
  };

  const getRolePermissions = (role: string): string[] => {
    if (role === "admin" || role === "desenvolvedor") {
      return permissions.map(p => p.name);
    }
    const rolePerms = rolePermissions.filter(rp => rp.role === role);
    const permIds = rolePerms.map(rp => rp.permission_id);
    return permissions.filter(p => permIds.includes(p.id)).map(p => p.name);
  };

  const updateRolePermission = async (role: string, permissionId: string, hasPermission: boolean) => {
    if (hasPermission) {
      await supabase.from("role_permissions").insert({ role, permission_id: permissionId });
    } else {
      await supabase.from("role_permissions").delete().eq("role", role).eq("permission_id", permissionId);
    }
    await fetchData();
  };

  return {
    permissions,
    rolePermissions,
    userPermissions,
    userRole,
    loading,
    hasPermission,
    getRolePermissions,
    updateRolePermission,
    refetch: fetchData,
  };
}
