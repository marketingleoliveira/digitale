import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    id: "lyon",
    name: "Lyon",
    description: "Aumente suas vendas com zero transparência",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
    color: "from-blue-600 to-blue-800",
  },
  {
    id: "aerodry",
    name: "Aerodry",
    description: "Mais vendas, mais valor, mais performance",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    color: "from-zinc-700 to-zinc-900",
  },
  {
    id: "veneza",
    name: "Veneza",
    description: "Elegância e conforto em cada detalhe",
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800&q=80",
    color: "from-rose-500 to-rose-700",
  },
  {
    id: "milano",
    name: "Milano Myst",
    description: "O melhor tecido para leggings premium",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
    color: "from-violet-600 to-violet-800",
  },
];

export function Products() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="section-subtitle">Nossos Produtos</span>
          <h2 className="section-title mt-3">Últimos Lançamentos</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/tecidos/${product.id}`}
                className="group block card-premium h-[420px] relative"
              >
                <div className="absolute inset-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${product.color} opacity-60 group-hover:opacity-70 transition-opacity`} />
                </div>
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-primary-foreground">
                  <div className="transform transition-transform duration-300 group-hover:translate-y-[-8px]">
                    <h3 className="font-display text-2xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-primary-foreground/80 text-sm">{product.description}</p>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="h-5 w-5" />
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
