import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface GeneralSettings {
  site_name: string;
  tagline: string;
  contact_email: string;
  phone: string;
}

interface SocialSettings {
  instagram: string;
  linkedin: string;
  facebook: string;
}

interface SeoSettings {
  meta_title: string;
  meta_description: string;
}

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [general, setGeneral] = useState<GeneralSettings>({
    site_name: "",
    tagline: "",
    contact_email: "",
    phone: "",
  });
  const [social, setSocial] = useState<SocialSettings>({
    instagram: "",
    linkedin: "",
    facebook: "",
  });
  const [seo, setSeo] = useState<SeoSettings>({
    meta_title: "",
    meta_description: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("key, value");

    if (data) {
      data.forEach((setting) => {
        const value = setting.value as Record<string, string>;
        switch (setting.key) {
          case "general":
            setGeneral(value as unknown as GeneralSettings);
            break;
          case "social":
            setSocial(value as unknown as SocialSettings);
            break;
          case "seo":
            setSeo(value as unknown as SeoSettings);
            break;
        }
      });
    }
  };

  const saveSettings = async (key: string, value: GeneralSettings | SocialSettings | SeoSettings) => {
    setLoading(true);

    const { error } = await supabase
      .from("site_settings")
      .update({ value: value as any })
      .eq("key", key);

    if (error) {
      toast.error("Erro ao salvar configurações");
    } else {
      toast.success("Configurações salvas!");
    }

    setLoading(false);
  };

  return (
    <AdminLayout title="Configurações">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-display text-lg font-semibold mb-6">Configurações Gerais</h3>
            <div className="space-y-4 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="site_name">Nome do Site</Label>
                <Input
                  id="site_name"
                  value={general.site_name}
                  onChange={(e) => setGeneral({ ...general, site_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagline">Slogan</Label>
                <Input
                  id="tagline"
                  value={general.tagline}
                  onChange={(e) => setGeneral({ ...general, tagline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email de Contato</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={general.contact_email}
                  onChange={(e) => setGeneral({ ...general, contact_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={general.phone}
                  onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                />
              </div>
              <Button onClick={() => saveSettings("general", general)} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Social Settings */}
        <TabsContent value="social">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-display text-lg font-semibold mb-6">Redes Sociais</h3>
            <div className="space-y-4 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={social.instagram}
                  onChange={(e) => setSocial({ ...social, instagram: e.target.value })}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={social.linkedin}
                  onChange={(e) => setSocial({ ...social, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={social.facebook}
                  onChange={(e) => setSocial({ ...social, facebook: e.target.value })}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <Button onClick={() => saveSettings("social", social)} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-display text-lg font-semibold mb-6">SEO</h3>
            <div className="space-y-4 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Título Padrão</Label>
                <Input
                  id="meta_title"
                  value={seo.meta_title}
                  onChange={(e) => setSeo({ ...seo, meta_title: e.target.value })}
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">{seo.meta_title.length}/60 caracteres</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Descrição Padrão</Label>
                <Textarea
                  id="meta_description"
                  value={seo.meta_description}
                  onChange={(e) => setSeo({ ...seo, meta_description: e.target.value })}
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">{seo.meta_description.length}/160 caracteres</p>
              </div>
              <Button onClick={() => saveSettings("seo", seo)} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Settings;
