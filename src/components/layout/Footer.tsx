import { Link } from "react-router-dom";
import { Instagram, Youtube, Linkedin, Facebook, MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";
import logoColor from "@/assets/logo-color.png";

const footerLinks = {
  empresa: [
    { name: "Sobre Nós", href: "/sobre" },
    { name: "Sustentabilidade", href: "/sustentabilidade" },
    { name: "Blog", href: "/blog" },
    { name: "Contato", href: "/contato" },
  ],
  produtos: [
    { name: "Milano", href: "/tecidos/milano" },
    { name: "Lyon", href: "/tecidos/lyon" },
    { name: "Aerodry", href: "/tecidos/aerodry" },
    { name: "Veneza", href: "/tecidos/veneza" },
  ],
  suporte: [
    { name: "Política de Privacidade", href: "/politica-de-privacidade" },
    { name: "Termos de Uso", href: "/termos-de-uso" },
  ],
};

const socialLinks = [
  { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/digitale.textil/" },
  { name: "YouTube", icon: Youtube, href: "https://www.youtube.com/channel/UClXf0Er4nwHyq6EFuSmNSrw" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/digitale-textil-loja/" },
  { name: "Facebook", icon: Facebook, href: "https://www.facebook.com/digitaletextilbr/" },
];

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src={logoColor} alt="Digitale Têxtil" className="h-12 mb-5" />
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
              Com mais de 60 anos de experiência, somos referência em tecidos de alta tecnologia para moda fitness, esportiva e casual.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-md bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
            <ul className="space-y-2.5">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Produtos */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Tecidos</h4>
            <ul className="space-y-2.5">
              {footerLinks.produtos.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:atendimento@digitaletextil.com.br" className="hover:text-foreground transition-colors">
                  atendimento@digitaletextil.com.br
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+551120649662" className="hover:text-foreground transition-colors">
                  +55 11 2064-9662
                </a>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Av. Henry Ford, 354<br />
                  São Paulo-SP, 03109-000
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Digitale Têxtil. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            {footerLinks.suporte.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
