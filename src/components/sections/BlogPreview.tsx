import { motion } from "framer-motion";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const posts = [
  {
    id: 1,
    title: "Tendências de Moda Fitness para 2024",
    excerpt: "Descubra as principais tendências em tecidos tecnológicos para o mercado fitness.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
    date: "15 Jan 2024",
    readTime: "5 min",
    category: "Tendências",
  },
  {
    id: 2,
    title: "Sustentabilidade na Indústria Têxtil",
    excerpt: "Como a Digitale está revolucionando a produção têxtil com práticas eco-friendly.",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop",
    date: "10 Jan 2024",
    readTime: "7 min",
    category: "Sustentabilidade",
  },
  {
    id: 3,
    title: "Tecnologias em Tecidos Esportivos",
    excerpt: "Conheça as inovações que estão transformando o desempenho dos atletas.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop",
    date: "5 Jan 2024",
    readTime: "6 min",
    category: "Tecnologia",
  },
];

export function BlogPreview() {
  const { t } = useLanguage();

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
          <Link to="/blog" className="mt-6 md:mt-0 inline-flex items-center gap-2 text-accent font-semibold">
            {t("blog.viewAll")}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>

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
              <Link to={`/blog/${post.id}`} className="block card-hover bg-card">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute top-4 left-4 px-4 py-1.5 bg-accent text-white text-xs font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
