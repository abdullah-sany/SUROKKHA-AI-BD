import { useLanguage } from "../../contexts/LanguageContext";
import { IconSearch, IconMapPin } from "../ui/Icons";
import { Button } from "../ui/Button";
import type { FacilityType } from "../../types";

const FACILITY_TYPES: FacilityType[] = [
  "Hospital", "Medical College Hospital", "Private Hospital/Clinic", "Health Complex",
  "Clinic", "Diagnostic Center", "Blood Bank", "Other Healthcare Facility",
];

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  division: string;
  onDivisionChange: (v: string) => void;
  district: string;
  onDistrictChange: (v: string) => void;
  divisions: string[];
  districts: string[];
  facilityType: string;
  onFacilityTypeChange: (v: string) => void;
  ownership: "all" | "public" | "private";
  onOwnershipChange: (v: "all" | "public" | "private") => void;
  verifiedOnly: boolean;
  onVerifiedOnlyChange: (v: boolean) => void;
  sortBy: "nearest" | "verified" | "name";
  onSortByChange: (v: "nearest" | "verified" | "name") => void;
  onUseLocation: () => void;
}

const selectClass = "rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm min-h-[40px]";

export function FacilityFilters(props: Props) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div className="relative">
        <IconSearch width={18} height={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={props.search}
          onChange={(e) => props.onSearchChange(e.target.value)}
          placeholder={t("healthcare.searchPlaceholder")}
          className="w-full rounded-lg border border-stone-200 bg-white pl-10 pr-3 py-2.5 text-sm min-h-[44px]"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={props.division} onChange={(e) => props.onDivisionChange(e.target.value)} className={selectClass}>
          <option value="">{t("healthcare.division")}</option>
          {props.divisions.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={props.district} onChange={(e) => props.onDistrictChange(e.target.value)} className={selectClass}>
          <option value="">{t("healthcare.district")}</option>
          {props.districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={props.facilityType} onChange={(e) => props.onFacilityTypeChange(e.target.value)} className={selectClass}>
          <option value="">{t("healthcare.facilityType")}</option>
          {FACILITY_TYPES.map((ft) => <option key={ft} value={ft}>{ft}</option>)}
        </select>
        <select
          value={props.ownership}
          onChange={(e) => props.onOwnershipChange(e.target.value as "all" | "public" | "private")}
          className={selectClass}
        >
          <option value="all">{t("healthcare.ownership")}: {t("healthcare.ownershipAll")}</option>
          <option value="public">{t("healthcare.ownershipPublic")}</option>
          <option value="private">{t("healthcare.ownershipPrivate")}</option>
        </select>
        <select
          value={props.sortBy}
          onChange={(e) => props.onSortByChange(e.target.value as "nearest" | "verified" | "name")}
          className={selectClass}
        >
          <option value="nearest">{t("healthcare.sortNearest")}</option>
          <option value="verified">{t("healthcare.sortVerified")}</option>
          <option value="name">{t("healthcare.sortName")}</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-navy-700">
          <input
            type="checkbox"
            checked={props.verifiedOnly}
            onChange={(e) => props.onVerifiedOnlyChange(e.target.checked)}
            className="w-4 h-4"
          />
          {t("healthcare.verifiedOnly")}
        </label>
        <Button variant="outline" size="sm" icon={<IconMapPin width={16} height={16} />} onClick={props.onUseLocation}>
          {t("healthcare.enableLocation")}
        </Button>
      </div>
    </div>
  );
}
