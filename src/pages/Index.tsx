import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Products } from "@/components/sections/Products";
import { Testimonials } from "@/components/sections/Testimonials";
import { Stats } from "@/components/sections/Stats";
import { Sustainability } from "@/components/sections/Sustainability";
import { Clients } from "@/components/sections/Clients";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Products />
        <Testimonials />
        <Stats />
        <Sustainability />
        <Clients />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
