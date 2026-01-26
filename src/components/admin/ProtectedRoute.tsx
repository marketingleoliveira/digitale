import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin, isEditor, reconnecting } = useAuth();
  const [showTimeout, setShowTimeout] = useState(false);
  const [rolesChecked, setRolesChecked] = useState(false);

  // Aguarda as roles serem verificadas após o loading terminar
  useEffect(() => {
    if (!loading && user) {
      // Pequeno delay para garantir que as roles foram atualizadas
      const timer = setTimeout(() => {
        setRolesChecked(true);
      }, 100);
      return () => clearTimeout(timer);
    } else if (!loading && !user) {
      setRolesChecked(true);
    }
  }, [loading, user, isAdmin, isEditor]);

  // Timeout de segurança para evitar tela branca infinita
  useEffect(() => {
    if (!loading && rolesChecked) {
      setShowTimeout(false);
      return;
    }

    const timeout = setTimeout(() => {
      setShowTimeout(true);
    }, 8000); // 8 segundos

    return () => clearTimeout(timeout);
  }, [loading, rolesChecked]);

  // Mostra loading enquanto carrega ou enquanto verifica roles
  if (loading || (!rolesChecked && user)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        {reconnecting && (
          <p className="text-sm text-muted-foreground">Reconectando...</p>
        )}
        {showTimeout && !reconnecting && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Carregamento lento detectado</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-primary hover:underline"
            >
              Recarregar página
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if user has at least editor role (redator, vendedor, editor, or admin)
  if (!isAdmin && !isEditor) {
    console.log("ProtectedRoute: Access denied - isAdmin:", isAdmin, "isEditor:", isEditor);
    return <Navigate to="/" replace />;
  }

  // Check admin-only routes
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
