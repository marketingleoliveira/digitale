import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
}

const SITE_NAME = "Digitale Têxtil";
const SITE_URL = "https://digitaletextil.com.br";
const DEFAULT_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/6ff9c6ff-2cc0-4a8a-9f93-ba0a70c732ed";

function setMeta(attr: "name" | "property", key: string, content: string) {
  if (!content) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function SEO({ title, description, keywords, image }: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${location.pathname}`;
    const img = image || DEFAULT_IMAGE;

    document.title = fullTitle;
    setMeta("name", "description", description);
    if (keywords) setMeta("name", "keywords", keywords);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", img);
    setMeta("property", "og:url", url);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);
    setMeta("property", "og:locale", "pt_BR");

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", img);

    setLink("canonical", url);
  }, [title, description, keywords, image, location.pathname]);

  return null;
}

export default SEO;