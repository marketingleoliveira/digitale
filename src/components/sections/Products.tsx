import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    id: "milano",
    name: "Milano Myst",
    description: "O tecido preferido para leggings premium com zero transparência.",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
  },
  {
    id: "lyon",
    name: "Lyon",
    description: "Alta compressão e suporte perfeito para peças de modelagem.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
  },
  {
    id: "aerodry",
    name: "Aerodry",
    description: "Tecnologia de secagem rápida para máxima performance.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
  },
  {
    id: "veneza",
    name: "Veneza",
    description: "Elegância e conforto para peças do dia a dia.",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80",
  },
];

export function Products() {
  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="section-subtitle">Nossos Produtos</span>
          <h2 className="section-title mt-2">Tecidos de Alta Performance</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Desenvolvidos com tecnologia exclusiva para atender às necessidades mais exigentes do mercado.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/tecidos/${product.id}`} className="group block">
                <div className="card-clean">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                    <span className="inline-flex items-center text-sm font-medium text-primary">
                      Ver detalhes
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
