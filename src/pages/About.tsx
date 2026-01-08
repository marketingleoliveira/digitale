import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Stats } from "@/components/sections/Stats";
import { Clients } from "@/components/sections/Clients";
import athleteImg from "@/assets/athlete-model.jpg";

const values = [
  {
    title: "Qualidade",
    description: "Entregamos tecidos com os mais altos padrões de qualidade do mercado.",
  },
  {
    title: "Inovação",
    description: "Investimos constantemente em novas tecnologias e processos.",
  },
  {
    title: "Sustentabilidade",
    description: "Compromisso com práticas ambientalmente responsáveis.",
  },
  {
    title: "Parceria",
    description: "Construímos relacionamentos duradouros com nossos clientes.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="section-subtitle">Sobre Nós</span>
            <h1 className="section-title mt-3 mb-6">
              Mais de 60 Anos de Excelência Têxtil
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Somos uma empresa do Grupo VMF/Schick Bin, com mais de seis décadas de experiência 
              no segmento têxtil, sempre à frente das inovações do mercado.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title mb-6">Nossa História</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                A Digitale Têxtil nasceu da paixão por transformar tecidos em experiências. 
                Ao longo de mais de 60 anos, nos tornamos referência em tecidos de alta tecnologia, 
                sempre investindo em inovação e sustentabilidade.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Hoje, atendemos mais de 1.000 clientes em 15 países, oferecendo tecidos com 
                tecnologias exclusivas como Aloe Vera, proteção UV 50+, antibacteriano e muito mais.
              </p>

              <div className="space-y-4">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <CheckCircle className="h-6 w-6 text-accent flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground">{value.title}</h4>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                <img
                  src={athleteImg}
                  alt="Atleta usando tecidos Digitale"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-2xl shadow-xl">
                <p className="font-display text-4xl font-bold">60+</p>
                <p className="text-sm text-primary-foreground/80">Anos de mercado</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Stats />
      <Clients />
      <Footer />
    </div>
  );
};

export default About;
