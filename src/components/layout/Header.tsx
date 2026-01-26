import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, Phone, Clock, Headphones } from "lucide-react";
import logoWhite from "@/assets/logo-white.png";
import logoColor from "@/assets/logo-color.png";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { t } = useLanguage();

  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.about"), href: "/sobre" },
    { name: t("nav.fabrics"), href: "/tecidos" },
    { name: t("nav.prints"), href: "/estampas" },
    {
      name: t("nav.segments"),
      href: "/segmentos",
      children: [
        { name: "Moda Praia", href: "/segmentos#praia" },
        { name: "Fitwear", href: "/segmentos#fitwear" },
        { name: "Lingerie", href: "/segmentos#lingerie" },
        { name: "Natação", href: "/segmentos#natacao" },
      ],
    },
    { name: t("nav.sustainability"), href: "/sustentabilidade" },
    { name: t("nav.blog"), href: "/blog" },
    { name: t("nav.contact"), href: "/contato" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar - Desktop */}
      <div className="bg-primary text-primary-foreground text-xs md:text-sm hidden md:block">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-9 md:h-10">
            <div className="flex items-center gap-4 md:gap-6">
              <a 
                href="https://wa.me/551120649662?text=Ol%C3%A1%2C%20vim%20do%20site%2C%20quero%20contato%20do%20time%20comercial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 md:gap-2 hover:text-accent transition-colors"
              >
                <Phone className="h-3 w-3 md:h-3.5 md:w-3.5" />
                <span>Falar com Comercial</span>
              </a>
              <div className="hidden lg:flex items-center gap-2 text-primary-foreground/70">
                <Clock className="h-3.5 w-3.5" />
                <span>Seg-Sex: 08:00 - 18:00</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white shadow-lg py-2" 
            : "bg-white/95 backdrop-blur-md py-3 md:py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img 
                src={logoColor} 
                alt="Digitale Têxtil" 
                className={`transition-all duration-300 ${isScrolled ? "h-10 md:h-12" : "h-11 md:h-14 lg:h-16"}`} 
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 relative group ${
                      location.pathname === item.href
                        ? "text-accent"
                        : "text-foreground hover:text-accent"
                    }`}
                  >
                    {item.name}
                    {item.children && <ChevronDown className="h-3.5 w-3.5" />}
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </Link>
                  
                  {item.children && (
                    <AnimatePresence>
                      {openDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-0 py-3 bg-white rounded-lg shadow-xl border border-border min-w-[200px]"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.href}
                              className="block px-5 py-3 text-sm text-foreground hover:text-accent hover:bg-muted/50 transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* CTA + SAC */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="https://sac.digitaletextil.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border-2 border-accent text-accent rounded-full hover:bg-accent hover:text-white transition-colors"
              >
                <Headphones className="h-4 w-4" />
                SAC
              </a>
              <Link
                to="/contato"
                className="btn-primary text-sm"
              >
                {t("cta.button")}
              </Link>
            </div>

            {/* Mobile: Language + Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="md:hidden">
                <LanguageSwitcher />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-foreground hover:text-accent transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-border overflow-hidden"
            >
              <nav className="container mx-auto px-4 py-4">
                {/* WhatsApp Link for Mobile */}
                <a 
                  href="https://wa.me/551120649662?text=Ol%C3%A1%2C%20vim%20do%20site%2C%20quero%20contato%20do%20time%20comercial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-3 text-accent font-medium border-b border-border/50"
                >
                  <Phone className="h-4 w-4" />
                  <span>Falar com Comercial</span>
                </a>
                
                {navigation.map((item) => (
                  <div key={item.name} className="border-b border-border/50">
                    {item.children ? (
                      <>
                        <button
                          onClick={() => setOpenMobileDropdown(openMobileDropdown === item.name ? null : item.name)}
                          className={`w-full flex items-center justify-between py-3 font-medium ${
                            location.pathname === item.href ? "text-accent" : "text-foreground"
                          }`}
                        >
                          <span>{item.name}</span>
                          <ChevronDown 
                            className={`h-4 w-4 transition-transform duration-200 ${
                              openMobileDropdown === item.name ? "rotate-180" : ""
                            }`} 
                          />
                        </button>
                        <AnimatePresence>
                          {openMobileDropdown === item.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pb-3">
                                <Link
                                  to={item.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block py-2 text-sm text-muted-foreground hover:text-accent"
                                >
                                  Ver todos
                                </Link>
                                {item.children.map((child) => (
                                  <Link
                                    key={child.name}
                                    to={child.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-2 text-sm text-muted-foreground hover:text-accent"
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block py-3 font-medium ${
                          location.pathname === item.href ? "text-accent" : "text-foreground"
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                <Link
                  to="/contato"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-4 btn-primary text-center text-sm py-3"
                >
                  {t("cta.button")}
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
