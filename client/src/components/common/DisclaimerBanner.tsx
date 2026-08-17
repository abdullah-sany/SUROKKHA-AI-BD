import { useLanguage } from "../../contexts/LanguageContext";

export function DisclaimerBanner({ text }: { text?: string }) {
  const { t } = useLanguage();
  return (
    <p className="text-xs text-stone-500 leading-relaxed border-t border-stone-100 pt-3 mt-3">
      {text ?? t("disclaimer.standard")}
    </p>
  );
}
