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
  clearCache: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Intervalo de refresh do token (10 minutos)
const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000;

// Limpa o cache de autenticação do localStorage
const clearAuthCache = () => {
  // Remove todos os itens de autenticação do Supabase
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));
  
  // Também limpa sessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
      sessionStorage.removeItem(key);
    }
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  
  // Refs para controlar estados
  const isInitializedRef = useRef(false);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentUserIdRef = useRef<string | null>(null);

  // Função para buscar roles - sem dependências externas problemáticas
  const fetchRoles = async (userId: string): Promise<{ admin: boolean; editor: boolean }> => {
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
    }
  };

  // Para o intervalo de refresh
  const stopRefreshInterval = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  }, []);

  // Inicia o intervalo de refresh automático
  const startRefreshInterval = useCallback(() => {
    stopRefreshInterval();
    
    refreshIntervalRef.current = setInterval(async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          await supabase.auth.refreshSession();
        }
      } catch (error) {
        console.error("Error in refresh interval:", error);
      }
    }, TOKEN_REFRESH_INTERVAL);
  }, [stopRefreshInterval]);

  // Função para limpar cache e fazer logout
  const clearCache = useCallback(() => {
    stopRefreshInterval();
    clearAuthCache();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsEditor(false);
    isInitializedRef.current = false;
    currentUserIdRef.current = null;
    toast.info("Cache limpo com sucesso");
  }, [stopRefreshInterval]);

  useEffect(() => {
    let isMounted = true;

    // Carregamento INICIAL
    const initializeAuth = async () => {
      // Evita re-inicialização
      if (isInitializedRef.current) {
        setLoading(false);
        return;
      }
      
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          console.error("Error getting session:", error);
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsEditor(false);
          isInitializedRef.current = true;
          setLoading(false);
          return;
        }

        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        currentUserIdRef.current = initialSession?.user?.id ?? null;

        if (initialSession?.user) {
          const { admin, editor } = await fetchRoles(initialSession.user.id);
          if (isMounted) {
            setIsAdmin(admin);
            setIsEditor(editor);
            startRefreshInterval();
          }
        } else {
          setIsAdmin(false);
          setIsEditor(false);
        }
        
        isInitializedRef.current = true;
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (isMounted) {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsEditor(false);
          isInitializedRef.current = true;
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Listener para mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return;

        // Só processa após inicialização
        if (!isInitializedRef.current) return;

        console.log("Auth state changed:", event);

        // Atualiza estado
        setSession(newSession);
        setUser(newSession?.user ?? null);
        currentUserIdRef.current = newSession?.user?.id ?? null;

        if (newSession?.user) {
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

    // Handler para visibilidade
    const handleVisibilityChange = async () => {
      if (document.visibilityState !== "visible" || !isMounted) return;
      
      // Só faz algo se já inicializou e tem usuário
      if (!isInitializedRef.current) return;
      
      const userId = currentUserIdRef.current;
      
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (currentSession?.user) {
          // Usuário ainda tem sessão
          if (userId) {
            setReconnecting(true);
          }
          
          // Refresh silencioso
          const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
          
          if (!isMounted) return;
          
          if (refreshedSession) {
            setSession(refreshedSession);
            setUser(refreshedSession.user);
            currentUserIdRef.current = refreshedSession.user.id;
            
            const { admin, editor } = await fetchRoles(refreshedSession.user.id);
            if (isMounted) {
              setIsAdmin(admin);
              setIsEditor(editor);
              if (userId) {
                toast.success("Sessão ativa", { id: "reconnecting", duration: 1500 });
              }
            }
          }
          
          setReconnecting(false);
        } else if (userId) {
          // Tinha usuário mas sessão expirou
          toast.error("Sessão expirada", { 
            description: "Por favor, faça login novamente.",
            duration: 4000 
          });
          setUser(null);
          setSession(null);
          setIsAdmin(false);
          setIsEditor(false);
          currentUserIdRef.current = null;
          stopRefreshInterval();
        }
      } catch (error) {
        console.error("Error checking session on visibility change:", error);
        setReconnecting(false);
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
  }, [startRefreshInterval, stopRefreshInterval]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        startRefreshInterval();
      }
      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  }, [startRefreshInterval]);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName }
        }
      });
      return { error: error as Error | null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signOut = useCallback(async () => {
    stopRefreshInterval();
    await supabase.auth.signOut();
    clearAuthCache();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsEditor(false);
    currentUserIdRef.current = null;
    isInitializedRef.current = false;
    toast.info("Você saiu da sua conta");
  }, [stopRefreshInterval]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      reconnecting, 
      isAdmin, 
      isEditor, 
      signIn, 
      signUp, 
      signOut,
      clearCache 
    }}>
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
