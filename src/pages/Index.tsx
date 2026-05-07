import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SEO } from "@/components/SEO";
import { Hero } from "@/components/sections/Hero";
import { Products } from "@/components/sections/Products";
import { Testimonials } from "@/components/sections/Testimonials";
import { Sustainability } from "@/components/sections/Sustainability";
import { Clients } from "@/components/sections/Clients";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <SEO title="Tecidos Fitness e Malhas Técnicas com Proteção UV 50+" description="Fábrica de tecidos fitness, moda praia e malhas técnicas com proteção UV 50+, Aloe Vera e antibacteriano. Linha ECO sustentável e estampas exclusivas direto da fábrica." keywords="tecido fitness, malha fitness, tecido moda praia, tecido com proteção UV, tecido aloe vera, tecido antibacteriano, fábrica de tecidos São Paulo, tecidos sustentáveis, malha sportwear, tecido para academia, fornecedor de tecidos, Digitale Têxtil" />
      <main>
        <Hero />
        <Products />
        <Testimonials />
        <Sustainability />
        <Clients />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
