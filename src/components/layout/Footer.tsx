import { Link } from "react-router-dom";
import { Instagram, Youtube, Linkedin, Facebook, MapPin, Mail, Phone } from "lucide-react";
import logoColor from "@/assets/logo-color.png";

const footerLinks = {
  empresa: [
    { name: "Sobre Nós", href: "/sobre" },
    { name: "Sustentabilidade", href: "/sustentabilidade" },
    { name: "Blog", href: "/blog" },
    { name: "Fale Conosco", href: "/contato" },
  ],
  produtos: [
    { name: "Milano", href: "/tecidos/milano" },
    { name: "Lyon", href: "/tecidos/lyon" },
    { name: "Aerodry", href: "/tecidos/aerodry" },
    { name: "Veneza", href: "/tecidos/veneza" },
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
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <img src={logoColor} alt="Digitale Têxtil" className="h-12 mb-4 brightness-0 invert" />
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Mais de 60 anos de experiência em tecidos de alta tecnologia para moda fitness, esportiva e casual.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tecidos */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Tecidos</h4>
            <ul className="space-y-2">
              {footerLinks.produtos.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contato</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="mailto:atendimento@digitaletextil.com.br" className="hover:text-white">
                  atendimento@digitaletextil.com.br
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a href="tel:+551120649662" className="hover:text-white">
                  +55 11 2064-9662
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  Av. Henry Ford, 354<br />
                  São Paulo-SP, 03109-000
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Digitale Têxtil. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
