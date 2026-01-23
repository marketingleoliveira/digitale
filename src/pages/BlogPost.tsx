import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, ArrowLeft, User, Tag, Share2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  views: number;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      setLoading(true);
      
      // Fetch the main post
      const { data: postData, error: postError } = await supabase
        .from("blog_posts")
        .select(`
          id,
          title,
          slug,
          content,
          excerpt,
          featured_image,
          published_at,
          created_at,
          views,
          category:blog_categories(id, name, slug)
        `)
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (postError || !postData) {
        setLoading(false);
        return;
      }

      setPost(postData as Post);

      // Increment views
      await supabase
        .from("blog_posts")
        .update({ views: (postData.views || 0) + 1 })
        .eq("id", postData.id);

      // Fetch related posts from same category
      if (postData.category) {
        const { data: relatedData } = await supabase
          .from("blog_posts")
          .select(`
            id,
            title,
            slug,
            excerpt,
            featured_image,
            published_at
          `)
          .eq("status", "published")
          .eq("category_id", postData.category.id)
          .neq("id", postData.id)
          .order("published_at", { ascending: false })
          .limit(3);

        if (relatedData) {
          setRelatedPosts(relatedData);
        }
      }

      setLoading(false);
    };

    fetchPost();
  }, [slug]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const locales = { pt: "pt-BR", es: "es-ES", en: "en-US" };
    return date.toLocaleDateString(locales[language] || "pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || "",
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("blog.linkCopied"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-12">
          <div className="container mx-auto px-6 max-w-4xl">
            <Skeleton className="h-8 w-32 mb-8" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="aspect-video w-full mb-8 rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {t("blog.postNotFound")}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t("blog.postNotFoundDesc")}
            </p>
            <Link to="/blog">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("blog.backToBlog")}
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <ChevronRight className="h-4 w-4" />
                <Link to="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-white/80 truncate max-w-[200px]">
                  {post.title}
                </span>
              </nav>

              {/* Category Badge */}
              {post.category && (
                <Badge 
                  variant="secondary" 
                  className="mb-4 bg-accent/20 text-accent border-0"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {post.category.name}
                </Badge>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.published_at || post.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{estimateReadTime(post.content)} min {t("blog.readTime")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Digitale Têxtil</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="container mx-auto px-6 -mt-12 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full aspect-video object-cover rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        )}

        {/* Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <Link to="/blog">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t("blog.backToBlog")}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  {t("blog.share")}
                </Button>
              </div>

              <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-accent"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                  {t("blog.relatedPosts")}
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.article
                      key={relatedPost.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <Link to={`/blog/${relatedPost.slug}`}>
                        <div className="bg-background rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-all">
                          {relatedPost.featured_image ? (
                            <div className="aspect-video overflow-hidden">
                              <img
                                src={relatedPost.featured_image}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="aspect-video bg-muted flex items-center justify-center">
                              <Tag className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                          )}
                          <div className="p-5">
                            <p className="text-xs text-muted-foreground mb-2">
                              {formatDate(relatedPost.published_at)}
                            </p>
                            <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                              {relatedPost.title}
                            </h3>
                            {relatedPost.excerpt && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {relatedPost.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
