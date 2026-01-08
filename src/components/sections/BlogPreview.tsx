import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const posts = [
  {
    id: 1,
    title: "Tendências de Tecidos para 2026: O Futuro é Sustentável",
    excerpt: "Descubra as principais tendências que estão moldando a indústria têxtil e como a sustentabilidade está no centro das inovações.",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&q=80",
    date: "05 Jan 2026",
    readTime: "5 min",
    category: "Tendências",
  },
  {
    id: 2,
    title: "Como Escolher o Tecido Ideal para Moda Fitness",
    excerpt: "Guia completo sobre as características essenciais que você deve buscar em tecidos para peças de alta performance.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80",
    date: "02 Jan 2026",
    readTime: "7 min",
    category: "Guias",
  },
  {
    id: 3,
    title: "Tecnologia Antibacteriana: O Diferencial nos Tecidos Modernos",
    excerpt: "Entenda como a tecnologia antibacteriana funciona e por que ela é cada vez mais valorizada no mercado.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    date: "28 Dez 2025",
    readTime: "4 min",
    category: "Tecnologia",
  },
];

export function BlogPreview() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <span className="section-subtitle">Blog</span>
            <h2 className="section-title mt-3">Últimas do Blog</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/blog">
              Ver Todos os Posts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/blog/${post.id}`} className="group block card-premium">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <span className="inline-block text-xs font-medium text-accent uppercase tracking-wider mb-3">
                    {post.category}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
