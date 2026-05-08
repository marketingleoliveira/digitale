import { useEffect } from "react";

interface JsonLdProps {
  id: string;
  data: Record<string, any>;
}

export function JsonLd({ id, data }: JsonLdProps) {
  useEffect(() => {
    const elId = `jsonld-${id}`;
    let el = document.getElementById(elId) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = elId;
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => {
      const node = document.getElementById(elId);
      if (node) node.remove();
    };
  }, [id, data]);

  return null;
}

export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Digitale Têxtil",
  url: "https://digitaletextil.com.br",
  logo: "https://digitaletextil.com.br/favicon-32x32.png",
  description:
    "Fábrica brasileira de tecidos fitness, moda praia e malhas técnicas com proteção UV 50+, Aloe Vera, antibacteriano e linha ECO sustentável.",
  taxID: "74.447.996/0001-14",
  address: {
    "@type": "PostalAddress",
    addressCountry: "BR",
    addressRegion: "SP",
  },
  sameAs: [
    "https://www.instagram.com/digitaletextil",
    "https://www.linkedin.com/company/digitaletextil",
  ],
};

export default JsonLd;

export const PUBLISHER_JSONLD = {
  "@type": "Organization",
  name: "Digitale Têxtil",
  logo: {
    "@type": "ImageObject",
    url: "https://digitaletextil.com.br/favicon-32x32.png",
    width: 32,
    height: 32,
  },
};

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: it.url,
    })),
  };
}