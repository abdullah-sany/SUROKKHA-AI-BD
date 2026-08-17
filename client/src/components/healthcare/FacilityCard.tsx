import { useLanguage } from "../../contexts/LanguageContext";
import type { Facility } from "../../types";
import { formatPhoneHref } from "../../utils/formatters";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { VerifiedBadge, DemoDataBadge } from "../common/VerificationBadges";
import { IconHospital, IconPhone, IconDirections } from "../ui/Icons";

export function FacilityCard({ facility }: { facility: Facility }) {
  const { t, language } = useLanguage();
  const name = language === "bn" && facility.nameBn ? facility.nameBn : facility.name;
  const mapsUrl =
    facility.latitude != null && facility.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${facility.latitude},${facility.longitude}`
      : null;

  return (
    <Card className="space-y-2.5">
      <div className="flex items-start gap-3">
        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-navy-50 text-navy-600 shrink-0">
          <IconHospital width={20} height={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy-800 leading-snug">{name}</p>
          <p className="text-xs text-stone-500 mt-0.5">
            {facility.facilityType} · {facility.district}, {facility.division}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {facility.isDemoData ? <DemoDataBadge /> : <VerifiedBadge verified={facility.verified} />}
        <Badge tone="neutral">{facility.isPrivate ? t("healthcare.ownershipPrivate") : t("healthcare.ownershipPublic")}</Badge>
        {facility.distanceKm != null ? (
          <span className="text-xs text-stone-500">{t("common.distanceKm", { value: facility.distanceKm })}</span>
        ) : (
          <span className="text-xs text-stone-400">{t("common.distanceUnknown")}</span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {facility.phone ? (
          <a href={formatPhoneHref(facility.phone)} className="flex-1 min-w-[120px]">
            <Button variant="primary" size="sm" icon={<IconPhone width={16} height={16} />} fullWidth>
              {t("common.call")}
            </Button>
          </a>
        ) : (
          <span className="flex-1 min-w-[120px] text-xs text-stone-400 self-center">{t("common.notAvailable")}</span>
        )}
        {mapsUrl && (
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[120px]">
            <Button variant="outline" size="sm" icon={<IconDirections width={16} height={16} />} fullWidth>
              {t("common.directions")}
            </Button>
          </a>
        )}
      </div>

      <p className="text-xs text-stone-400">
        {t("common.source")}: {facility.source}
        {facility.lastVerifiedAt ? ` · ${t("common.lastVerified")}: ${facility.lastVerifiedAt}` : ""}
      </p>
    </Card>
  );
}
