import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SiteSettings {
  whatsapp_number: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  whatsapp_number: "5511973715327",
};

export function useSiteSettings() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["whatsapp_number"]);

      if (error) throw error;

      const settingsMap: Partial<SiteSettings> = {};
      data?.forEach((item) => {
        if (item.key === "whatsapp_number") {
          // Remove quotes if stored as JSON string
          const value = typeof item.value === "string" 
            ? item.value.replace(/^"|"$/g, "") 
            : String(item.value);
          settingsMap.whatsapp_number = value;
        }
      });

      return { ...DEFAULT_SETTINGS, ...settingsMap };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: true,
  });

  return {
    settings: settings || DEFAULT_SETTINGS,
    isLoading,
    whatsappNumber: settings?.whatsapp_number || DEFAULT_SETTINGS.whatsapp_number,
    whatsappLink: (message?: string) => {
      const number = settings?.whatsapp_number || DEFAULT_SETTINGS.whatsapp_number;
      const encodedMessage = message ? encodeURIComponent(message) : "";
      return `https://wa.me/${number}${encodedMessage ? `?text=${encodedMessage}` : ""}`;
    },
  };
}
