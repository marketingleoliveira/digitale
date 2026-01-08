import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoColor from "@/assets/logo-color.png";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Sobre", href: "/sobre" },
  {
    name: "Tecidos",
    href: "/tecidos",
    children: [
      { name: "Milano", href: "/tecidos/milano" },
      { name: "Lyon", href: "/tecidos/lyon" },
      { name: "Aerodry", href: "/tecidos/aerodry" },
      { name: "Veneza", href: "/tecidos/veneza" },
    ],
  },
  { name: "Sustentabilidade", href: "/sustentabilidade" },
  { name: "Blog", href: "/blog" },
  { name: "Contato", href: "/contato" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-background/98 backdrop-blur-sm shadow-sm border-b border-border"
          : "bg-background"
      }`}
    >
      {/* Top Bar */}
      <div className="hidden lg:block bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 py-2 flex justify-between text-xs">
          <span>Atendimento: Seg - Sex, 8h às 18h</span>
          <a href="tel:+551120649662" className="flex items-center gap-1 hover:underline">
            <Phone className="h-3 w-3" />
            +55 11 2064-9662
          </a>
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logoColor} alt="Digitale Têxtil" className="h-10 lg:h-12" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                    location.pathname === item.href
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {item.name}
                  {item.children && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>
                {item.children && (
                  <AnimatePresence>
                    {openDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 py-2 bg-card rounded-lg shadow-lg border border-border min-w-[160px]"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
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

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-3">
            <Button asChild>
              <Link to="/contato">Solicitar Orçamento</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border"
          >
            <nav className="container mx-auto px-6 py-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 text-foreground font-medium border-b border-border/50"
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
                          className="block py-2 text-sm text-muted-foreground"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Button asChild className="w-full mt-4">
                <Link to="/contato">Solicitar Orçamento</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
