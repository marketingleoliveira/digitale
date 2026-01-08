import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Search, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const categories = ["Todos", "Tendências", "Tecnologia", "Guias", "Sustentabilidade", "Novidades"];

const allPosts = [
  {
    id: 1,
    title: "Tendências de Tecidos para 2026: O Futuro é Sustentável",
    excerpt: "Descubra as principais tendências que estão moldando a indústria têxtil e como a sustentabilidade está no centro das inovações.",
    image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800&q=80",
    date: "05 Jan 2026",
    readTime: "5 min",
    category: "Tendências",
  },
  {
    id: 2,
    title: "Como Escolher o Tecido Ideal para Moda Fitness",
    excerpt: "Guia completo sobre as características essenciais que você deve buscar em tecidos para peças de alta performance.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    date: "02 Jan 2026",
    readTime: "7 min",
    category: "Guias",
  },
  {
    id: 3,
    title: "Tecnologia Antibacteriana: O Diferencial nos Tecidos Modernos",
    excerpt: "Entenda como a tecnologia antibacteriana funciona e por que ela é cada vez mais valorizada no mercado.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
    date: "28 Dez 2025",
    readTime: "4 min",
    category: "Tecnologia",
  },
  {
    id: 4,
    title: "A Revolução dos Tecidos ECO: Por Que Investir em Sustentabilidade",
    excerpt: "Saiba como os tecidos sustentáveis estão transformando a indústria da moda e conquistando consumidores conscientes.",
    image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=800&q=80",
    date: "20 Dez 2025",
    readTime: "6 min",
    category: "Sustentabilidade",
  },
  {
    id: 5,
    title: "Milano: O Tecido Preferido para Leggings Premium",
    excerpt: "Conheça as características que fazem do Milano o tecido mais procurado para confecção de leggings de alta qualidade.",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
    date: "15 Dez 2025",
    readTime: "5 min",
    category: "Novidades",
  },
  {
    id: 6,
    title: "Proteção UV 50+: A Ciência por Trás dos Tecidos Inteligentes",
    excerpt: "Descubra como funciona a tecnologia de proteção solar nos tecidos e seus benefícios para a saúde.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    date: "10 Dez 2025",
    readTime: "8 min",
    category: "Tecnologia",
  },
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="section-subtitle">Blog</span>
            <h1 className="section-title mt-3 mb-6">Novidades e Tendências</h1>
            <p className="text-muted-foreground text-lg">
              Acompanhe as últimas novidades do mundo têxtil, dicas de moda e inovações em tecidos de alta tecnologia.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
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
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent uppercase tracking-wider mb-3">
                        <Tag className="h-3 w-3" />
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
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Nenhum post encontrado.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
