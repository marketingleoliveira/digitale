import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { isVideoUrl } from "@/lib/media-utils";

interface Print {
  id: string;
  code: string;
  name: string | null;
  image_url: string;
  category: string | null;
}

export function PrintsGallery() {
  const { data: prints, isLoading } = useQuery({
    queryKey: ["prints-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prints")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Print[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (!prints || prints.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {prints.map((print, index) => (
        <motion.div
          key={print.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          viewport={{ once: true }}
          className="group relative aspect-square rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow"
        >
          {isVideoUrl(print.image_url) ? (
            <video
              src={print.image_url}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <img
              src={print.image_url}
              alt={print.name || `Estampa ${print.code}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
          {/* Overlay with code on hover */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-sm font-medium mb-1">Cód:</p>
              <p className="text-lg font-bold">{print.code}</p>
              {print.name && (
                <p className="text-xs mt-2 text-white/80">{print.name}</p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
