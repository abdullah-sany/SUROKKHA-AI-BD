import type { SpecialistSuggestion } from "../../types";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { IconSpecialist } from "../ui/Icons";

const confidenceTone: Record<SpecialistSuggestion["confidence"], "success" | "warning" | "danger"> = {
  high: "success",
  medium: "warning",
  low: "danger",
};

export function SpecialtyCard({ suggestion }: { suggestion: SpecialistSuggestion }) {
  return (
    <Card className="space-y-2">
      <div className="flex items-start gap-3">
        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-navy-50 text-navy-600 shrink-0">
          <IconSpecialist width={20} height={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy-800">{suggestion.specialty}</p>
        </div>
        <Badge tone={confidenceTone[suggestion.confidence]}>{suggestion.confidence}</Badge>
      </div>
      <p className="text-sm text-navy-700">{suggestion.reasoning}</p>
    </Card>
  );
}
