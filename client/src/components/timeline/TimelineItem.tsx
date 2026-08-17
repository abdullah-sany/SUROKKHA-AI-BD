import { useLanguage } from "../../contexts/LanguageContext";
import type { TimelineEntry } from "../../types";
import { formatRelativeDate } from "../../utils/formatters";
import {
  IconEmergency, IconHospital, IconPrescription, IconBlood, IconTimeline, IconTrash,
} from "../ui/Icons";

const iconByType: Record<TimelineEntry["type"], typeof IconEmergency> = {
  FIRST_AID_CONSULTATION: IconEmergency,
  EMERGENCY_SEARCH: IconEmergency,
  HOSPITAL_SEARCH: IconHospital,
  PRESCRIPTION_ANALYSIS: IconPrescription,
  BLOOD_PLATFORM_VISIT: IconBlood,
};

export function TimelineItem({ entry, onDelete }: { entry: TimelineEntry; onDelete: (id: string) => void }) {
  const { t, language } = useLanguage();
  const Icon = iconByType[entry.type] ?? IconTimeline;

  return (
    <div className="flex items-start gap-3 py-3 border-b border-stone-100 last:border-0">
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-teal-50 text-teal-600 shrink-0">
        <Icon width={18} height={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-navy-800 leading-snug">{entry.summary}</p>
        <p className="text-xs text-stone-400 mt-0.5">{formatRelativeDate(entry.createdAt, language)}</p>
      </div>
      <button
        onClick={() => onDelete(entry.id)}
        className="text-stone-400 hover:text-emred-500 p-2 -m-2"
        aria-label={t("common.delete")}
      >
        <IconTrash width={16} height={16} />
      </button>
    </div>
  );
}
