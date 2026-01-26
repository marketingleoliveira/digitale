import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  
  // Refs para controlar estados de inicialização e evitar race conditions
  const isInitialized = useRef(false);
  const isFetchingRoles = useRef(false);

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
          }
        } else {
          setIsAdmin(false);
          setIsEditor(false);
        }
      }
    );

    // Handler para quando a aba fica visível novamente
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && isMounted) {
        try {
          // Verifica a sessão ao retornar à aba
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          
          if (!isMounted) return;
          
          // Apenas atualiza se a sessão mudou
          if (currentSession?.user?.id !== user?.id) {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            
            if (currentSession?.user) {
              const { admin, editor } = await fetchRoles(currentSession.user.id);
              if (isMounted) {
                setIsAdmin(admin);
                setIsEditor(editor);
              }
            } else {
              setIsAdmin(false);
              setIsEditor(false);
            }
          }
        } catch (error) {
          console.error("Error checking session on visibility change:", error);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchRoles, user?.id]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  }, []);

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
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsEditor(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, isEditor, signIn, signUp, signOut }}>
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
