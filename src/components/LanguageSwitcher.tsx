import { useLanguage, Language } from "@/contexts/LanguageContext";

const flags: Record<Language, { src: string; alt: string }> = {
  pt: {
    src: "https://flagcdn.com/w40/br.png",
    alt: "Português",
  },
  es: {
    src: "https://flagcdn.com/w40/es.png",
    alt: "Español",
  },
  en: {
    src: "https://flagcdn.com/w40/us.png",
    alt: "English",
  },
};

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: Language[] = ["pt", "es", "en"];

  return (
    <div className="flex items-center gap-2">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`w-8 h-6 rounded overflow-hidden transition-all duration-200 ${
            language === lang
              ? "ring-2 ring-primary ring-offset-2 scale-110"
              : "opacity-60 hover:opacity-100 hover:scale-105"
          }`}
          title={flags[lang].alt}
        >
          <img
            src={flags[lang].src}
            alt={flags[lang].alt}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );
}
