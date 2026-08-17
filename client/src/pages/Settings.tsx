import { useLanguage } from "../contexts/LanguageContext";
import { Card } from "../components/ui/Card";
import { LanguageToggle } from "../components/common/LanguageToggle";

export default function Settings() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pt-1">
      <section>
        <h1 className="font-display text-2xl font-semibold text-navy-800">{t("settings.title")}</h1>
      </section>

      <Card className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-navy-700">{t("settings.language")}</span>
        <LanguageToggle />
      </Card>

      <Card className="space-y-2">
        <h2 className="font-semibold text-navy-800">{t("brand.name")}</h2>
        <p className="text-sm text-stone-500">{t("brand.tagline")}</p>
        <p className="text-xs text-stone-400 pt-2 border-t border-stone-100">
          Innovation Fair prototype. This app provides general safety guidance and directory information — it is not
          a substitute for professional emergency services.
        </p>
      </Card>
    </div>
  );
}
