import { useLanguage } from "../../contexts/LanguageContext";
import type { MedicineEntry } from "../../types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { IconPrescription } from "../ui/Icons";

const confidenceTone: Record<MedicineEntry["confidence"], "success" | "warning" | "danger"> = {
  high: "success",
  medium: "warning",
  low: "danger",
};

export function MedicineCard({ medicine }: { medicine: MedicineEntry }) {
  const { t } = useLanguage();
  const details = [
    medicine.strength,
    medicine.dosage,
    medicine.frequency,
    medicine.timing,
    medicine.duration,
  ].filter(Boolean);

  return (
    <Card className="space-y-3">
      <div className="flex items-start gap-3">
        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-teal-50 text-teal-600 shrink-0">
          <IconPrescription width={20} height={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy-800">{medicine.name}</p>
          {details.length > 0 && <p className="text-xs text-stone-500 mt-0.5">{details.join(" · ")}</p>}
        </div>
        <Badge tone={confidenceTone[medicine.confidence]}>{medicine.confidence}</Badge>
      </div>

      {medicine.specialInstructions && (
        <p className="text-sm text-navy-700 bg-warm-200/60 rounded-lg px-3 py-2">{medicine.specialInstructions}</p>
      )}

      <div className="space-y-2 text-sm">
        <div>
          <p className="font-semibold text-navy-700 text-xs uppercase tracking-wide mb-0.5">{t("prescription.medicineUse")}</p>
          <p className="text-navy-700">{medicine.explanation.generalUse}</p>
        </div>
        <div>
          <p className="font-semibold text-navy-700 text-xs uppercase tracking-wide mb-0.5">{t("prescription.howToTake")}</p>
          <p className="text-navy-700">{medicine.explanation.howToTakeAccordingToPrescription}</p>
        </div>
        {medicine.explanation.precautions.length > 0 && (
          <div>
            <p className="font-semibold text-navy-700 text-xs uppercase tracking-wide mb-0.5">{t("prescription.precautions")}</p>
            <ul className="list-disc list-inside text-navy-700 space-y-0.5">
              {medicine.explanation.precautions.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        )}
        {medicine.explanation.commonSideEffects.length > 0 && (
          <div>
            <p className="font-semibold text-navy-700 text-xs uppercase tracking-wide mb-0.5">{t("prescription.sideEffects")}</p>
            <ul className="list-disc list-inside text-navy-700 space-y-0.5">
              {medicine.explanation.commonSideEffects.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
