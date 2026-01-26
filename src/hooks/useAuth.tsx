import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  reconnecting: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Intervalo de refresh do token (10 minutos)
const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  
  // Refs para controlar estados de inicialização e evitar race conditions
  const isInitialized = useRef(false);
  const isFetchingRoles = useRef(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchRoles = useCallback(async (userId: string): Promise<{ admin: boolean; editor: boolean }> => {
    if (isFetchingRoles.current) {
      return { admin: isAdmin, editor: isEditor };
    }
    
    isFetchingRoles.current = true;
    
    try {
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching roles:", error);
        return { admin: false, editor: false };
      }

      const userRoles = roles?.map((r) => r.role) || [];
      const admin = userRoles.includes("admin");
      const editor = userRoles.includes("editor") || admin;
      
      return { admin, editor };
    } catch (error) {
      console.error("Error fetching roles:", error);
      return { admin: false, editor: false };
    } finally {
      isFetchingRoles.current = false;
    }
  }, [isAdmin, isEditor]);

  // Função para refresh do token
  const refreshSession = useCallback(async (showToast = false) => {
    try {
      const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Error refreshing session:", error);
        return null;
      }
      
      if (refreshedSession && showToast) {
        toast.success("Sessão renovada", { duration: 2000 });
      }
      
      return refreshedSession;
    } catch (error) {
      console.error("Error refreshing session:", error);
      return null;
    }
  }, []);

  // Inicia o intervalo de refresh automático
  const startRefreshInterval = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    
    refreshIntervalRef.current = setInterval(async () => {
      const currentSession = await supabase.auth.getSession();
      if (currentSession.data.session) {
        await refreshSession(false);
      }
    }, TOKEN_REFRESH_INTERVAL);
  }, [refreshSession]);

  // Para o intervalo de refresh
  const stopRefreshInterval = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Carregamento INICIAL - controla o loading
    const initializeAuth = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (isMounted) {
            setSession(null);
            setUser(null);
            setIsAdmin(false);
            setIsEditor(false);
          }
          return;
        }

        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        // Busca roles ANTES de definir loading como false
        if (session?.user) {
          const { admin, editor } = await fetchRoles(session.user.id);
          if (isMounted) {
            setIsAdmin(admin);
            setIsEditor(editor);
            startRefreshInterval();
          }
        } else {
          setIsAdmin(false);
          setIsEditor(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsEditor(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Listener para mudanças contínuas (NÃO controla o loading)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;

        // Ignora eventos durante a inicialização
        if (!isInitialized.current) return;

        console.log("Auth state changed:", event);

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Busca roles sem bloquear o loading
          const { admin, editor } = await fetchRoles(newSession.user.id);
          if (isMounted) {
            setIsAdmin(admin);
            setIsEditor(editor);
            startRefreshInterval();
          }
        } else {
          setIsAdmin(false);
          setIsEditor(false);
          stopRefreshInterval();
        }
      }
    );

    // Handler para quando a aba fica visível novamente
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && isMounted) {
        try {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          
          if (!isMounted) return;
          
          // Verifica se há uma sessão ativa
          if (currentSession?.user) {
            // Mostra indicador de reconexão apenas se já estava logado
            if (user?.id) {
              setReconnecting(true);
              toast.loading("Reconectando...", { id: "reconnecting", duration: 2000 });
            }
            
            // Refresh da sessão ao retornar à aba
            const refreshedSession = await refreshSession(false);
            
            if (!isMounted) return;
            
            if (refreshedSession) {
              setSession(refreshedSession);
              setUser(refreshedSession.user);
              
              // Revalida roles
              const { admin, editor } = await fetchRoles(refreshedSession.user.id);
              if (isMounted) {
                setIsAdmin(admin);
                setIsEditor(editor);
              }
              
              toast.success("Sessão ativa", { id: "reconnecting", duration: 2000 });
            }
            
            setReconnecting(false);
          } else if (user?.id) {
            // Usuário estava logado mas sessão expirou
            toast.error("Sessão expirada", { 
              description: "Por favor, faça login novamente.",
              duration: 4000 
            });
            setUser(null);
            setSession(null);
            setIsAdmin(false);
            setIsEditor(false);
            stopRefreshInterval();
          }
        } catch (error) {
          console.error("Error checking session on visibility change:", error);
          setReconnecting(false);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopRefreshInterval();
    };
  }, [fetchRoles, user?.id, refreshSession, startRefreshInterval, stopRefreshInterval]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      startRefreshInterval();
    }
    return { error: error as Error | null };
  }, [startRefreshInterval]);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName }
      }
    });
    return { error: error as Error | null };
  }, []);

  const signOut = useCallback(async () => {
    stopRefreshInterval();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsEditor(false);
    toast.info("Você saiu da sua conta");
  }, [stopRefreshInterval]);

  return (
    <AuthContext.Provider value={{ user, session, loading, reconnecting, isAdmin, isEditor, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
