import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { openRoktoSheba } from "../../data/roktosheba";
import { Card } from "../ui/Card";
import { IconAmbulance, IconHospital, IconBlood } from "../ui/Icons";

export function EmergencyQuickActions() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const actions = [
    { label: t("home.findAmbulance"), icon: IconAmbulance, onClick: () => navigate("/emergency?tab=ambulance") },
    { label: t("home.findHospital"), icon: IconHospital, onClick: () => navigate("/healthcare") },
    { label: t("home.findBlood"), icon: IconBlood, onClick: openRoktoSheba },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="flex flex-col items-center gap-2 rounded-xl border border-stone-200 bg-white py-4 text-xs font-semibold text-navy-700 hover:border-emred-200 hover:bg-emred-50/40 transition-colors min-h-[44px]"
        >
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emred-50 text-emred-600">
            <action.icon width={20} height={20} />
          </span>
          {action.label}
        </button>
      ))}
    </div>
  );
}
