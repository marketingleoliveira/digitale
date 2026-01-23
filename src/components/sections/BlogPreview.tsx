import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  category: { name: string; slug: string } | null;
}

export function BlogPreview() {
  const { t, language } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, featured_image, published_at, created_at, category:blog_categories(name, slug)")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3);

    setPosts(data || []);
    setLoading(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const localeMap: Record<string, string> = { pt: "pt-BR", es: "es-ES", en: "en-US" };
    return new Date(dateString).toLocaleDateString(localeMap[language], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16"
        >
          <div>
            <span className="section-subtitle">{t("blog.label")}</span>
            <h2 className="section-title mt-4">{t("blog.title")}</h2>
          </div>
          <Link to="/blog" className="mt-6 md:mt-0 inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all">
            {t("blog.viewAll")}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden">
                <Skeleton className="h-56 w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/blog/${post.slug}`} className="block card-hover bg-card rounded-xl overflow-hidden h-full">
                  <div className="relative h-56 overflow-hidden bg-muted">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Tag className="h-10 w-10" />
                      </div>
                    )}
                    {post.category && (
                      <span className="absolute top-4 left-4 px-4 py-1.5 bg-accent text-white text-xs font-semibold rounded-full">
                        {post.category.name}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">{t("blog.noResults")}</p>
            <Link to="/blog" className="mt-4 inline-flex items-center gap-2 text-accent font-semibold">
              {t("blog.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
