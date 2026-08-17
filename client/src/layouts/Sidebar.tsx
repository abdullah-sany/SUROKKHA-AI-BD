import { NavLink } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { openRoktoSheba } from "../data/roktosheba";
import {
  IconHome, IconSpecialist, IconEmergency, IconHospital, IconPrescription,
  IconTimeline, IconBlood, IconSettings, IconInfo,
} from "../components/ui/Icons";

const linkBase =
  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";
const inactive = "text-navy-600 hover:bg-navy-50";
const active = "bg-navy-500 text-white";

export function Sidebar() {
  const { t } = useLanguage();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 border-r border-stone-200 bg-white h-screen sticky top-0 px-3 py-5">
      <div className="px-2 mb-6">
        <p className="font-display text-lg font-semibold text-navy-700 leading-tight">{t("brand.name")}</p>
        <p className="text-xs text-stone-500 mt-0.5 leading-snug">{t("brand.tagline")}</p>
      </div>

      <nav className="flex-1 flex flex-col gap-1" aria-label="Primary">
        <NavLink to="/" end className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
          <IconHome width={20} height={20} /> {t("nav.home")}
        </NavLink>
        <NavLink to="/first-aid" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
          <IconEmergency width={20} height={20} /> {t("nav.firstAid")}
        </NavLink>
        <NavLink
          to="/emergency"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? "bg-emred-500 text-white" : "text-emred-600 hover:bg-emred-50"}`
          }
        >
          <IconEmergency width={20} height={20} /> {t("nav.emergency")}
        </NavLink>
        <NavLink to="/healthcare" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
          <IconHospital width={20} height={20} /> {t("nav.healthcare")}
        </NavLink>
        <NavLink to="/prescription" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
          <IconPrescription width={20} height={20} /> {t("nav.prescription")}
        </NavLink>
        <NavLink to="/specialist" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
          <IconSpecialist width={20} height={20} /> {t("nav.specialist")}
        </NavLink>
        <NavLink to="/timeline" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
          <IconTimeline width={20} height={20} /> {t("nav.timeline")}
        </NavLink>
      </nav>

      <div className="border-t border-stone-200 pt-3 mt-3 flex flex-col gap-1">
        <button onClick={openRoktoSheba} className={`${linkBase} ${inactive} w-full text-left`}>
          <IconBlood width={20} height={20} /> {t("nav.blood")}
        </button>
        <NavLink to="/data-sources" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
          <IconInfo width={20} height={20} /> {t("nav.dataSources")}
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
          <IconSettings width={20} height={20} /> {t("nav.settings")}
        </NavLink>
      </div>
    </aside>
  );
}
