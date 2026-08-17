import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../contexts/ToastContext";
import { validatePrescriptionFile } from "../utils/validators";
import { analyzePrescription } from "../services/prescriptionService";
import { addTimelineEntry } from "../services/timelineService";
import { ApiError } from "../services/apiClient";
import type { PrescriptionAnalysisResult } from "../types";
import { UploadDropzone } from "../components/prescription/UploadDropzone";
import { MedicineCard } from "../components/prescription/MedicineCard";
import { SkeletonCard, ErrorState, EmptyState } from "../components/ui/Feedback";
import { DemoModeNotice } from "../components/common/DemoModeNotice";
import { DisclaimerBanner } from "../components/common/DisclaimerBanner";
import { Card } from "../components/ui/Card";

export default function Prescription() {
  const { t, language } = useLanguage();
  const { showToast } = useToast();

  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PrescriptionAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    const validationError = validatePrescriptionFile(file);
    if (validationError) {
      showToast(validationError, "error");
      return;
    }
    setPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    setResult(null);
    setError(null);
    setLoading(true);
    try {
      const res = await analyzePrescription(file, language);
      setResult(res);
      addTimelineEntry(
        "PRESCRIPTION_ANALYSIS",
        res.medicines.length > 0 ? `Analyzed ${res.medicines.length} medicine(s)` : "Analyzed a prescription",
        null
      ).catch(() => {});
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't analyze this prescription.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 pt-1">
      <section>
        <h1 className="font-display text-2xl font-semibold text-navy-800">{t("prescription.title")}</h1>
        <p className="text-stone-500 mt-1">{t("prescription.subtitle")}</p>
      </section>

      <UploadDropzone onFileSelected={handleFile} disabled={loading} />

      {preview && (
        <img src={preview} alt="Prescription preview" className="max-h-64 rounded-lg border border-stone-200 object-contain" />
      )}

      {loading && <p className="text-sm text-stone-500">{t("prescription.analyzing")}</p>}
      {loading && <SkeletonCard />}
      {error && <ErrorState message={error} />}

      {result && !loading && (
        <div className="space-y-4">
          {result.isDemoResponse && <DemoModeNotice text={t("firstAid.demoNotice")} />}
          {result.unreadableNotice && (
            <Card className="text-sm text-amber-700 bg-amber-50 border-amber-200">{result.unreadableNotice}</Card>
          )}
          {result.medicines.length === 0 && !result.unreadableNotice && (
            <EmptyState title={t("prescription.unreadable")} />
          )}
          {result.medicines.map((m, i) => <MedicineCard key={i} medicine={m} />)}
          <Card>
            <DisclaimerBanner text={result.disclaimer} />
          </Card>
        </div>
      )}
    </div>
  );
}
