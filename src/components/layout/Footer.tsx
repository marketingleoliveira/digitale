import { Link } from "react-router-dom";
import { Instagram, Youtube, Linkedin, Facebook, MapPin, Mail, Phone, ArrowRight } from "lucide-react";
import logoWhite from "@/assets/logo-white.png";
import { useLanguage } from "@/contexts/LanguageContext";

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/digitale.textil/" },
  { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/channel/UClXf0Er4nwHyq6EFuSmNSrw" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/digitale-textil-loja/" },
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/digitaletextilbr/" },
];

export function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    empresa: [
      { name: t("nav.about"), href: "/sobre" },
      { name: t("nav.sustainability"), href: "/sustentabilidade" },
      { name: t("nav.blog"), href: "/blog" },
      { name: t("nav.contact"), href: "/contato" },
    ],
    produtos: [
      { name: "Milano", href: "/tecidos/milano" },
      { name: "Lyon", href: "/tecidos/lyon" },
      { name: "Aerodry", href: "/tecidos/aerodry" },
      { name: "Veneza", href: "/tecidos/veneza" },
    ],
  };

  return (
    <footer className="bg-primary text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src={logoWhite} alt="Digitale Têxtil" className="h-14 mb-6" />
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              {t("footer.description")}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-accent transition-all duration-300"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold text-lg mb-6">{t("footer.navigation")}</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-white/70 hover:text-accent transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tecidos */}
          <div>
            <h4 className="font-semibold text-lg mb-6">{t("nav.fabrics")}</h4>
            <ul className="space-y-3">
              {footerLinks.produtos.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-white/70 hover:text-accent transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-lg mb-6">{t("footer.contact")}</h4>
            <ul className="space-y-4 text-sm text-white/70">
              <li>
                <a href="mailto:atendimento@digitaletextil.com.br" className="flex items-start gap-3 hover:text-accent transition-colors">
                  <Mail className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>atendimento@digitaletextil.com.br</span>
                </a>
              </li>
              <li>
                <a href="tel:+551120649662" className="flex items-start gap-3 hover:text-accent transition-colors">
                  <Phone className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>+55 11 2064-9662</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  Av. Henry Ford, 354<br />
                  São Paulo-SP, 03109-000
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
            <p>© {new Date().getFullYear()} Digitale Têxtil. {t("footer.rights")}</p>
            <Link 
              to="/admin" 
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              {t("footer.admin")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
