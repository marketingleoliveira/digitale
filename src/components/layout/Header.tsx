import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown, Phone, Clock, Search } from "lucide-react";
import logoWhite from "@/assets/logo-white.png";
import logoColor from "@/assets/logo-color.png";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { t } = useLanguage();

  const navigation = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.about"), href: "/sobre" },
    {
      name: t("nav.fabrics"),
      href: "/tecidos",
      children: [
        { name: "Milano", href: "/tecidos/milano" },
        { name: "Lyon", href: "/tecidos/lyon" },
        { name: "Aerodry", href: "/tecidos/aerodry" },
        { name: "Veneza", href: "/tecidos/veneza" },
      ],
    },
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
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground text-sm hidden lg:block">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-10">
            <div className="flex items-center gap-6">
              <a href="tel:+551120649662" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone className="h-3.5 w-3.5" />
                <span>+55 11 2064-9662</span>
              </a>
              <div className="flex items-center gap-2 text-primary-foreground/70">
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
            : "bg-white/95 backdrop-blur-md py-4"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img 
                src={logoColor} 
                alt="Digitale Têxtil" 
                className={`transition-all duration-300 ${isScrolled ? "h-12" : "h-14 md:h-16"}`} 
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

            {/* CTA + Search */}
            <div className="hidden lg:flex items-center gap-4">
              <button className="p-2 text-muted-foreground hover:text-accent transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <Link
                to="/contato"
                className="btn-primary text-sm"
              >
                {t("cta.button")}
              </Link>
            </div>

            {/* Mobile: Language + Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-foreground hover:text-accent transition-colors"
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
              className="lg:hidden bg-white border-t border-border"
            >
              <nav className="container mx-auto px-6 py-6">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block py-3 font-medium text-lg border-b border-border/50 ${
                        location.pathname === item.href ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                    {item.children && (
                      <div className="pl-4 pb-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block py-2.5 text-muted-foreground hover:text-accent"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <Link
                  to="/contato"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-4 btn-primary text-center"
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
