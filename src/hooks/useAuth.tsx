import { useState, useEffect, createContext, useContext } from "react";
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
  const [rolesLoaded, setRolesLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchRoles = async (userId: string) => {
      try {
        const { data: roles, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId);

        if (error) throw error;

        const userRoles = roles?.map((r) => r.role) || [];
        if (!isMounted) return;
        setIsAdmin(userRoles.includes("admin"));
        setIsEditor(userRoles.includes("editor") || userRoles.includes("admin"));
      } catch {
        if (!isMounted) return;
        setIsAdmin(false);
        setIsEditor(false);
      } finally {
        if (!isMounted) return;
        setRolesLoaded(true);
      }
    };

    // Listener de mudanças contínuas (não controla o loading inicial)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setRolesLoaded(false);
          await fetchRoles(session.user.id);
        } else {
          setIsAdmin(false);
          setIsEditor(false);
          setRolesLoaded(true);
        }
      }
    );

    // Carregamento inicial (controla o loading)
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setRolesLoaded(false);
          await fetchRoles(session.user.id);
        } else {
          setRolesLoaded(true);
        }
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName }
      }
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const effectiveLoading = loading || (!!user && !rolesLoaded);

  return (
    <AuthContext.Provider value={{ user, session, loading: effectiveLoading, isAdmin, isEditor, signIn, signUp, signOut }}>
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
