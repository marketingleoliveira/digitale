import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, FolderOpen, MessageSquare, Eye, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  newContacts: number;
  totalViews: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalCategories: 0,
    newContacts: 0,
    totalViews: 0,
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentContacts, setRecentContacts] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentPosts();
    fetchRecentContacts();
  }, []);

  const fetchStats = async () => {
    const [postsRes, categoriesRes, contactsRes] = await Promise.all([
      supabase.from("blog_posts").select("status, views"),
      supabase.from("blog_categories").select("id"),
      supabase.from("contact_submissions").select("status"),
    ]);

    const posts = postsRes.data || [];
    const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);

    setStats({
      totalPosts: posts.length,
      publishedPosts: posts.filter(p => p.status === "published").length,
      draftPosts: posts.filter(p => p.status === "draft").length,
      totalCategories: categoriesRes.data?.length || 0,
      newContacts: contactsRes.data?.filter(c => c.status === "new").length || 0,
      totalViews,
    });
  };

  const fetchRecentPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, status, created_at, views")
      .order("created_at", { ascending: false })
      .limit(5);
    setRecentPosts(data || []);
  };

  const fetchRecentContacts = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("id, name, email, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);
    setRecentContacts(data || []);
  };

  const statCards = [
    { icon: FileText, label: "Posts Publicados", value: stats.publishedPosts, color: "bg-green-500" },
    { icon: FileText, label: "Rascunhos", value: stats.draftPosts, color: "bg-yellow-500" },
    { icon: FolderOpen, label: "Categorias", value: stats.totalCategories, color: "bg-blue-500" },
    { icon: MessageSquare, label: "Novos Contatos", value: stats.newContacts, color: "bg-red-500" },
    { icon: Eye, label: "Visualizações", value: stats.totalViews, color: "bg-purple-500" },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card rounded-2xl p-5 border border-border"
          >
            <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Posts Recentes</h2>
            <Link to="/admin/posts" className="text-sm text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          {recentPosts.length > 0 ? (
            <div className="space-y-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/admin/posts/${post.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground line-clamp-1">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {post.status === "published" ? "Publicado" : "Rascunho"}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Nenhum post encontrado.</p>
          )}
        </div>

        {/* Recent Contacts */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold">Contatos Recentes</h2>
            <Link to="/admin/contacts" className="text-sm text-primary hover:underline">
              Ver todos
            </Link>
          </div>
          {recentContacts.length > 0 ? (
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.email}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      contact.status === "new"
                        ? "bg-red-100 text-red-700"
                        : contact.status === "read"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {contact.status === "new" ? "Novo" : contact.status === "read" ? "Lido" : "Respondido"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Nenhum contato encontrado.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
