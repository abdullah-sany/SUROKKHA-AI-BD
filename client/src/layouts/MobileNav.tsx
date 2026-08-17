import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { openRoktoSheba } from "../data/roktosheba";
import {
  IconHome, IconEmergency, IconBlood, IconSpecialist, IconHospital,
  IconPrescription, IconTimeline, IconSettings, IconInfo,
} from "../components/ui/Icons";

const itemBase = "flex flex-col items-center justify-center gap-1 flex-1 min-h-[56px] text-[11px] font-medium";

export function MobileNav() {
  const { t } = useLanguage();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-stone-200 pb-[env(safe-area-inset-bottom)]"
        aria-label="Primary"
      >
        <div className="flex items-stretch">
          <NavLink to="/" end className={({ isActive }) => `${itemBase} ${isActive ? "text-navy-500" : "text-stone-500"}`}>
            <IconHome width={22} height={22} />
            {t("nav.home")}
          </NavLink>
          <NavLink to="/first-aid" className={({ isActive }) => `${itemBase} ${isActive ? "text-navy-500" : "text-stone-500"}`}>
            <IconEmergency width={22} height={22} />
            {t("nav.firstAid")}
          </NavLink>
          <NavLink
            to="/emergency"
            className={({ isActive }) => `${itemBase} ${isActive ? "text-emred-600" : "text-emred-500"}`}
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emred-500 text-white -mt-4 shadow-raised">
              <IconEmergency width={18} height={18} />
            </span>
            {t("nav.emergency")}
          </NavLink>
          <button onClick={openRoktoSheba} className={`${itemBase} text-stone-500`}>
            <IconBlood width={22} height={22} />
            {t("nav.blood")}
          </button>
          <button onClick={() => setMoreOpen(true)} className={`${itemBase} text-stone-500`}>
            <span className="text-lg leading-none">⋯</span>
            More
          </button>
        </div>
      </nav>

      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-navy-900/40"
            aria-label={t("common.close")}
            onClick={() => setMoreOpen(false)}
          />
          <div className="relative w-full bg-white rounded-t-2xl p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] max-h-[70vh] overflow-y-auto">
            <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-4" />
            <div className="grid grid-cols-3 gap-3">
              {[
                { to: "/healthcare", icon: IconHospital, label: t("nav.healthcare") },
                { to: "/prescription", icon: IconPrescription, label: t("nav.prescription") },
                { to: "/specialist", icon: IconSpecialist, label: t("nav.specialist") },
                { to: "/timeline", icon: IconTimeline, label: t("nav.timeline") },
                { to: "/data-sources", icon: IconInfo, label: t("nav.dataSources") },
                { to: "/settings", icon: IconSettings, label: t("nav.settings") },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMoreOpen(false)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-stone-200 py-4 text-xs font-medium text-navy-600 hover:bg-navy-50"
                >
                  <item.icon width={22} height={22} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
