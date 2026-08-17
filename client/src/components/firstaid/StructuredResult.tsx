import { useLanguage } from "../../contexts/LanguageContext";
import type { FirstAidResult } from "../../types";
import { Card } from "../ui/Card";
import { DisclaimerBanner } from "../common/DisclaimerBanner";
import { DemoModeNotice } from "../common/DemoModeNotice";
import { SeverityBanner } from "./SeverityBanner";

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="text-sm font-semibold text-navy-700 mb-1.5">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-navy-700 flex gap-2">
            <span className="text-teal-500 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StructuredResult({ result }: { result: FirstAidResult }) {
  const { t } = useLanguage();

  return (
    <Card className="space-y-4">
      <SeverityBanner severity={result.severity} emergencyEscalation={result.emergencyEscalation} />

      {result.isDemoResponse && <DemoModeNotice text={t("firstAid.demoNotice")} />}

      <div>
        <h3 className="text-sm font-semibold text-navy-700 mb-1.5">{t("firstAid.situation")}</h3>
        <p className="text-sm text-navy-700">{result.situationSummary}</p>
      </div>

      <Section title={t("firstAid.immediateSteps")} items={result.immediateSteps} />
      <Section title={t("firstAid.whatNotToDo")} items={result.avoid} />
      <Section title={t("firstAid.warningSigns")} items={result.warningSigns} />

      <div>
        <h3 className="text-sm font-semibold text-navy-700 mb-1.5">{t("firstAid.seekCare")}</h3>
        <p className="text-sm text-navy-700">{result.seekCare}</p>
      </div>

      <DisclaimerBanner text={result.disclaimer} />
    </Card>
  );
}
