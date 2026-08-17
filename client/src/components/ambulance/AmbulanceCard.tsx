import { useLanguage } from "../../contexts/LanguageContext";
import type { AmbulanceProvider } from "../../types";
import { formatPhoneHref } from "../../utils/formatters";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { VerifiedBadge, DemoDataBadge } from "../common/VerificationBadges";
import { IconPhone, IconAmbulance } from "../ui/Icons";

export function AmbulanceCard({ ambulance }: { ambulance: AmbulanceProvider }) {
  const { t } = useLanguage();

  return (
    <Card className="space-y-2.5">
      <div className="flex items-start gap-3">
        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-emred-50 text-emred-600 shrink-0">
          <IconAmbulance width={20} height={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy-800 leading-snug">{ambulance.providerName}</p>
          <p className="text-xs text-stone-500 mt-0.5">
            {ambulance.serviceType} · {ambulance.area ? `${ambulance.area}, ` : ""}{ambulance.district}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {ambulance.isDemoData ? <DemoDataBadge /> : <VerifiedBadge verified={ambulance.verified} />}
        {ambulance.distanceKm != null ? (
          <span className="text-xs text-stone-500">{t("common.distanceKm", { value: ambulance.distanceKm })}</span>
        ) : (
          <span className="text-xs text-stone-400">{t("common.distanceUnknown")}</span>
        )}
      </div>

      {ambulance.phone ? (
        <a href={formatPhoneHref(ambulance.phone)}>
          <Button variant="emergency" size="sm" icon={<IconPhone width={16} height={16} />} fullWidth>
            {t("common.call")} {ambulance.phone}
          </Button>
        </a>
      ) : (
        <p className="text-xs text-stone-400">{t("common.notAvailable")}</p>
      )}

      <p className="text-xs text-stone-400">{t("common.source")}: {ambulance.source}</p>
    </Card>
  );
}
