import { Link } from "react-router-dom";
import { Instagram, Youtube, Linkedin, Facebook, MapPin, Mail, Phone } from "lucide-react";
import logoWhite from "@/assets/logo-white.png";

const footerLinks = {
  institucional: [
    { name: "Sobre Nós", href: "/sobre" },
    { name: "Sustentabilidade", href: "/sustentabilidade" },
    { name: "Blog", href: "/blog" },
    { name: "Contato", href: "/contato" },
  ],
  produtos: [
    { name: "Tecidos", href: "/tecidos" },
    { name: "Estampas", href: "/estampas" },
    { name: "Linha ECO", href: "/sustentabilidade" },
  ],
  atendimento: [
    { name: "Política de Privacidade", href: "/politica-de-privacidade" },
    { name: "Termos de Uso", href: "/termos-de-uso" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/digitale.textil/" },
  { name: "Youtube", icon: Youtube, href: "https://www.youtube.com/channel/UClXf0Er4nwHyq6EFuSmNSrw" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/digitale-textil-loja/" },
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/digitaletextilbr/" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src={logoWhite} alt="Digitale Têxtil" className="h-14 mb-6" />
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Somos uma empresa do Grupo VMF/Schick Bin, com mais de 60 anos de experiência no segmento têxtil.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Institucional</h4>
            <ul className="space-y-3">
              {footerLinks.institucional.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Produtos */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Produtos</h4>
            <ul className="space-y-3">
              {footerLinks.produtos.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-5">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary-foreground/60" />
                <a
                  href="mailto:atendimento@digitaletextil.com.br"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                >
                  atendimento@digitaletextil.com.br
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary-foreground/60" />
                <a
                  href="tel:+551120649662"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                >
                  +55 11 2064-9662
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary-foreground/60" />
                <span className="text-primary-foreground/70 text-sm">
                  Av. Henry Ford, 354 - São Paulo-SP<br />
                  CEP 03109-000
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="text-center text-primary-foreground/50 text-sm">
            Copyright © {new Date().getFullYear()} Todos os direitos reservados por Digitale Têxtil.
          </p>
        </div>
      </div>
    </footer>
  );
}
