import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Upload, FileText, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface JobOpening {
  id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  location: string | null;
  type: string | null;
}

const WorkWithUs = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    jobId: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("job_openings")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (!error && data) {
      setJobs(data);
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast({
          title: "Formato inválido",
          description: "Por favor, envie apenas arquivos PDF.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "Currículo obrigatório",
        description: "Por favor, anexe seu currículo em PDF.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.jobId) {
      toast({
        title: "Vaga obrigatória",
        description: "Por favor, selecione uma vaga.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Upload resume
      const fileName = `${Date.now()}_${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL (for admin access later)
      const resumeUrl = `resumes/${fileName}`;

      // Submit application
      const { error: insertError } = await supabase
        .from("job_applications")
        .insert({
          job_opening_id: formData.jobId,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          whatsapp: formData.whatsapp.trim(),
          resume_url: resumeUrl,
        });

      if (insertError) throw insertError;

      toast({
        title: "Candidatura enviada!",
        description: "Sua candidatura foi recebida com sucesso. Entraremos em contato em breve.",
      });

      // Reset form
      setFormData({ name: "", email: "", whatsapp: "", jobId: "" });
      setSelectedFile(null);
      const fileInput = document.getElementById("resume") as HTMLInputElement;
      if (fileInput) fileInput.value = "";

    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast({
        title: "Erro ao enviar",
        description: "Ocorreu um erro ao enviar sua candidatura. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedJob = jobs.find((j) => j.id === formData.jobId);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 lg:pt-40 pb-16 bg-gradient-to-br from-primary/10 to-accent/10 border-b border-border">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="section-subtitle">Carreiras</span>
            <h1 className="section-title mt-2 mb-4">Trabalhe Conosco</h1>
            <p className="text-muted-foreground text-lg">
              Faça parte da nossa equipe! Estamos sempre em busca de talentos que compartilhem nossa paixão por inovação e qualidade na indústria têxtil.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Job Listings */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Vagas Disponíveis</h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="card-clean p-6 animate-pulse">
                      <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : jobs.length > 0 ? (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`card-clean p-6 cursor-pointer transition-all ${
                        formData.jobId === job.id
                          ? "ring-2 ring-primary bg-primary/5"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setFormData((prev) => ({ ...prev, jobId: job.id }))}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{job.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {job.location && (
                              <span className="text-xs bg-muted px-2 py-1 rounded">
                                {job.location}
                              </span>
                            )}
                            {job.type && (
                              <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">
                                {job.type}
                              </span>
                            )}
                          </div>
                          {job.description && (
                            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                              {job.description}
                            </p>
                          )}
                          {formData.jobId === job.id && job.requirements && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <h4 className="text-sm font-medium mb-2">Requisitos:</h4>
                              <p className="text-sm text-muted-foreground whitespace-pre-line">
                                {job.requirements}
                              </p>
                            </div>
                          )}
                        </div>
                        {formData.jobId === job.id && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="card-clean p-8 text-center">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No momento não há vagas abertas. Mas você pode enviar seu currículo para nosso banco de talentos!
                  </p>
                </div>
              )}
            </div>

            {/* Application Form */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Envie sua Candidatura</h2>
              
              <form onSubmit={handleSubmit} className="card-clean p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    required
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp *</Label>
                  <Input
                    id="whatsapp"
                    required
                    placeholder="(11) 99999-9999"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job">Vaga Desejada *</Label>
                  <Select
                    value={formData.jobId}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, jobId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma vaga" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.title}
                        </SelectItem>
                      ))}
                      {jobs.length === 0 && (
                        <SelectItem value="banco-talentos">
                          Banco de Talentos (Cadastro Geral)
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume">Currículo (PDF) *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      id="resume"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="resume" className="cursor-pointer block">
                      {selectedFile ? (
                        <div className="flex items-center justify-center gap-2 text-primary">
                          <FileText className="h-6 w-6" />
                          <span className="font-medium">{selectedFile.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Clique para selecionar ou arraste seu currículo
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Apenas PDF • Máximo 5MB
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>Apenas arquivos PDF são aceitos. Certifique-se de que seu currículo está atualizado.</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={submitting || !formData.jobId}
                >
                  {submitting ? "Enviando..." : "Enviar Candidatura"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WorkWithUs;
