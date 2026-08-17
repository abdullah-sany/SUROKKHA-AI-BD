import { useLanguage } from "../../contexts/LanguageContext";
import { IconAmbulance, IconHospital, IconPhone, IconMapPin } from "../ui/Icons";

interface Props {
  activeTab: string;
  onSelect: (tab: "ambulance" | "hospital" | "contacts" | "nearby") => void;
}

export function EmergencyActionGrid({ activeTab, onSelect }: Props) {
  const { t } = useLanguage();

  const actions = [
    { key: "ambulance" as const, label: t("emergency.findAmbulance"), icon: IconAmbulance },
    { key: "hospital" as const, label: t("emergency.findHospital"), icon: IconHospital },
    { key: "contacts" as const, label: t("emergency.contacts"), icon: IconPhone },
    { key: "nearby" as const, label: t("emergency.nearbyHelp"), icon: IconMapPin },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <button
          key={action.key}
          onClick={() => onSelect(action.key)}
          className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-colors min-h-[44px] ${
            activeTab === action.key
              ? "border-emred-400 bg-emred-50"
              : "border-stone-200 bg-white hover:border-emred-200"
          }`}
        >
          <span className="flex items-center justify-center w-10 h-10 rounded-full bg-emred-500 text-white shrink-0">
            <action.icon width={20} height={20} />
          </span>
          <span className="text-sm font-semibold text-navy-800">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
