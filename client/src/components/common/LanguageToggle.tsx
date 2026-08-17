import { useLanguage } from "../../contexts/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="inline-flex items-center rounded-full border border-stone-200 bg-white p-0.5 text-xs font-semibold">
      <button
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`px-3 py-1.5 rounded-full transition-colors min-h-[32px] ${language === "en" ? "bg-navy-500 text-white" : "text-stone-500"}`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("bn")}
        aria-pressed={language === "bn"}
        className={`px-3 py-1.5 rounded-full transition-colors min-h-[32px] ${language === "bn" ? "bg-navy-500 text-white" : "text-stone-500"}`}
      >
        বাংলা
      </button>
    </div>
  );
}
