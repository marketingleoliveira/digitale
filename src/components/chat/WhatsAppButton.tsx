import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export function WhatsAppButton() {
  const { t } = useLanguage();
  const { whatsappLink } = useSiteSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show button after scrolling a bit or after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000);
    
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = () => {
    window.open(whatsappLink(t("whatsapp.defaultMessage")), "_blank");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
        >
          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-white rounded-lg shadow-xl p-4 max-w-[280px] relative"
              >
                <button
                  onClick={() => setShowTooltip(false)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="text-sm text-foreground font-medium mb-1">
                  {t("whatsapp.title")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("whatsapp.subtitle")}
                </p>
                <Button
                  onClick={handleClick}
                  size="sm"
                  className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  {t("whatsapp.startChat")}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* WhatsApp Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTooltip(!showTooltip)}
            className="group relative bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg shadow-green-500/30 transition-colors"
          >
            <WhatsAppIcon className="h-6 w-6" />
            
            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
