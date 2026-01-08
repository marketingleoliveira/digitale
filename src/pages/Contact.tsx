import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "atendimento@digitaletextil.com.br",
    href: "mailto:atendimento@digitaletextil.com.br",
  },
  {
    icon: Phone,
    title: "Telefone",
    value: "+55 11 2064-9662",
    href: "tel:+551120649662",
  },
  {
    icon: MapPin,
    title: "Endereço",
    value: "Av. Henry Ford, 354 - São Paulo-SP",
    href: "https://maps.google.com/?q=Av.+Henry+Ford,+354+-+Mooca,+São+Paulo",
  },
  {
    icon: Clock,
    title: "Horário",
    value: "Seg - Sex: 8h às 18h",
    href: null,
  },
];

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("contact_submissions").insert([
      {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        company: form.company || null,
        message: form.message,
      },
    ]);

    if (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } else {
      setSubmitted(true);
      toast.success("Mensagem enviada com sucesso!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-16 bg-muted/50 border-b border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="section-subtitle">Contato</span>
            <h1 className="section-title mt-2 mb-4">Fale Conosco</h1>
            <p className="text-muted-foreground text-lg">
              Estamos prontos para atender você e ajudar a encontrar os melhores tecidos para o seu negócio.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              {submitted ? (
                <div className="bg-card rounded-lg border border-border p-10 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Mensagem Enviada!</h2>
                  <p className="text-muted-foreground mb-6">
                    Obrigado pelo contato. Nossa equipe retornará em breve.
                  </p>
                  <Button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", company: "", message: "" }); }}>
                    Enviar nova mensagem
                  </Button>
                </div>
              ) : (
                <div className="bg-card rounded-lg border border-border p-8">
                  <h2 className="text-xl font-semibold text-foreground mb-6">Envie sua mensagem</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo *</Label>
                        <Input
                          id="name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input
                          id="company"
                          value={form.company}
                          onChange={(e) => setForm({ ...form, company: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea
                        id="message"
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" size="lg" disabled={loading}>
                      <Send className="mr-2 h-4 w-4" />
                      {loading ? "Enviando..." : "Enviar Mensagem"}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-4"
            >
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-lg border border-border p-5"
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.title === "Endereço" ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors text-sm"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground text-sm">{item.value}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-16 lg:pb-24">
        <div className="container mx-auto px-6">
          <div className="rounded-lg overflow-hidden h-[400px] border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.2693373489673!2d-46.60404!3d-23.569525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5950c7a40f4f%3A0x86dab7ff65e99519!2sAv.%20Henry%20Ford%2C%20354%20-%20Mooca%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2003109-000!5e0!3m2!1spt-BR!2sbr!4v1704456000000!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
