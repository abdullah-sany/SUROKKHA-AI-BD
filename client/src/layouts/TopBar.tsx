import { NavLink } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { LanguageToggle } from "../components/common/LanguageToggle";
import { IconEmergency } from "../components/ui/Icons";

export function TopBar() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 bg-warm-100/90 backdrop-blur border-b border-stone-200/70">
      <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-3">
        <span className="md:hidden font-display font-semibold text-navy-700">{t("brand.name")}</span>
        <div className="hidden md:block" />
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <NavLink
            to="/emergency"
            className="inline-flex items-center gap-1.5 rounded-full bg-emred-500 text-white text-xs font-semibold px-3 py-2 min-h-[36px] hover:bg-emred-600"
          >
            <IconEmergency width={16} height={16} />
            {t("nav.emergency")}
          </NavLink>
        </div>
      </div>
    </header>
  );
}
