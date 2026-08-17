import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../contexts/ToastContext";
import { requestSpecialistSuggestion } from "../services/firstAidService";
import { ApiError } from "../services/apiClient";
import type { SpecialistResult } from "../types";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SkeletonCard, ErrorState } from "../components/ui/Feedback";
import { DemoModeNotice } from "../components/common/DemoModeNotice";
import { DisclaimerBanner } from "../components/common/DisclaimerBanner";
import { SpecialtyCard } from "../components/specialist/SpecialtyCard";

export default function Specialist() {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const [context, setContext] = useState("");
  const [result, setResult] = useState<SpecialistResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!context.trim()) {
      showToast("Please describe your symptoms or context.", "warning");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      setResult(await requestSpecialistSuggestion(context, language));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't get a suggestion right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pt-1">
      <section>
        <h1 className="font-display text-2xl font-semibold text-navy-800">{t("specialist.title")}</h1>
        <p className="text-stone-500 mt-1">{t("specialist.subtitle")}</p>
      </section>

      <Card className="space-y-3">
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder={t("specialist.inputPlaceholder")}
          rows={4}
          className="w-full resize-none rounded-lg border border-stone-200 bg-warm-100/60 px-3 py-2.5 text-sm text-navy-800 placeholder:text-stone-400 focus:bg-white"
        />
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? t("common.loading") : t("specialist.submit")}
        </Button>
        <p className="text-xs text-stone-500">{t("specialist.notDiagnosis")}</p>
      </Card>

      {loading && <SkeletonCard />}
      {error && <ErrorState message={error} onRetry={handleSubmit} retryLabel={t("common.retry")} />}

      {result && !loading && (
        <div className="space-y-3">
          {result.isDemoResponse && <DemoModeNotice text={t("firstAid.demoNotice")} />}
          {result.suggestions.map((s, i) => <SpecialtyCard key={i} suggestion={s} />)}
          <Card><DisclaimerBanner text={result.disclaimer} /></Card>
        </div>
      )}
    </div>
  );
}
