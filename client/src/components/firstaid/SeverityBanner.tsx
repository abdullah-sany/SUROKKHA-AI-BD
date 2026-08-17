import { useLanguage } from "../../contexts/LanguageContext";
import { getSeverityStyle } from "../../ai/severity";
import type { SeverityLevel } from "../../types";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { IconWarning, IconAmbulance, IconHospital, IconEmergency } from "../ui/Icons";

export function SeverityBanner({ severity, emergencyEscalation }: { severity: SeverityLevel; emergencyEscalation: boolean }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const style = getSeverityStyle(severity);

  if (!emergencyEscalation) {
    return (
      <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${style.bannerClass}`}>
        <span className={`w-2 h-2 rounded-full ${style.dotClass}`} />
        {t(`firstAid.severity.${severity}`)}
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-emred-500 bg-emred-50 p-4 space-y-3">
      <div className="flex items-center gap-2 text-emred-700 font-bold">
        <IconWarning width={22} height={22} />
        {t("firstAid.emergencyBanner")}
      </div>
      <p className="text-sm text-emred-700">{t("firstAid.emergencyEscalate")}</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="emergency" size="sm" icon={<IconAmbulance width={16} height={16} />} onClick={() => navigate("/emergency?tab=ambulance")}>
          {t("home.findAmbulance")}
        </Button>
        <Button variant="emergency" size="sm" icon={<IconHospital width={16} height={16} />} onClick={() => navigate("/healthcare")}>
          {t("home.findHospital")}
        </Button>
        <Button variant="outline" size="sm" icon={<IconEmergency width={16} height={16} />} onClick={() => navigate("/emergency")}>
          {t("home.emergencyHelp")}
        </Button>
      </div>
    </div>
  );
}
