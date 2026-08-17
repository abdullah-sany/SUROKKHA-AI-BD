import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useToast } from "../contexts/ToastContext";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { requestFirstAidGuidance } from "../services/firstAidService";
import { addTimelineEntry } from "../services/timelineService";
import { validateImageFile, fileToBase64 } from "../utils/validators";
import { ApiError } from "../services/apiClient";
import type { FirstAidResult } from "../types";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { SkeletonCard, ErrorState } from "../components/ui/Feedback";
import { StructuredResult } from "../components/firstaid/StructuredResult";
import { IconVoice, IconCamera } from "../components/ui/Icons";

interface NavState {
  situationText?: string;
  imageBase64?: string;
  imageMimeType?: string;
  autoSubmit?: boolean;
}

export default function FirstAid() {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const location = useLocation();
  const navState = (location.state as NavState | null) ?? null;

  const [situationText, setSituationText] = useState(navState?.situationText ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<{ base64: string; mimeType: string } | null>(
    navState?.imageBase64 && navState?.imageMimeType
      ? { base64: navState.imageBase64, mimeType: navState.imageMimeType }
      : null
  );

  const [result, setResult] = useState<FirstAidResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoSubmitted = useRef(false);

  const handleVoiceResult = useCallback((text: string) => {
    setSituationText((prev) => (prev ? `${prev} ${text}` : text));
  }, []);
  const voice = useVoiceInput(language, handleVoiceResult);

  const submit = useCallback(
    async (text: string, image?: { base64: string; mimeType: string } | null) => {
      if (!text.trim() && !image) {
        showToast("Please describe what happened.", "warning");
        return;
      }
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const res = await requestFirstAidGuidance({
          situationText: text.trim() || "See attached photo.",
          language,
          imageBase64: image?.base64,
          imageMimeType: image?.mimeType as "image/jpeg" | "image/png" | "image/webp" | undefined,
        });
        setResult(res);
        addTimelineEntry("FIRST_AID_CONSULTATION", res.situationSummary, res.severity).catch(() => {
          /* timeline is best-effort; never block the guidance flow on it */
        });
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [language, showToast]
  );

  useEffect(() => {
    if (navState?.autoSubmit && !autoSubmitted.current) {
      autoSubmitted.current = true;
      submit(navState.situationText ?? "", pendingImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      showToast(validationError, "error");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    const base64 = await fileToBase64(file);
    setPendingImage({ base64, mimeType: file.type });
  }

  return (
    <div className="space-y-6 pt-1">
      <section>
        <h1 className="font-display text-2xl font-semibold text-navy-800">{t("firstAid.title")}</h1>
        <p className="text-stone-500 mt-1">{t("firstAid.subtitle")}</p>
      </section>

      <Card className="space-y-3">
        <textarea
          value={situationText}
          onChange={(e) => setSituationText(e.target.value)}
          placeholder={t("firstAid.inputPlaceholder")}
          rows={4}
          className="w-full resize-none rounded-lg border border-stone-200 bg-warm-100/60 px-3 py-2.5 text-sm text-navy-800 placeholder:text-stone-400 focus:bg-white"
        />

        {imagePreview && (
          <div className="relative inline-block">
            <img src={imagePreview} alt="Attached" className="h-20 w-20 rounded-lg object-cover border border-stone-200" />
            <button
              onClick={() => { setImageFile(null); setImagePreview(null); setPendingImage(null); }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-navy-700 text-white text-xs"
              aria-label={t("firstAid.removeImage")}
            >
              ×
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => submit(situationText, pendingImage)} disabled={loading}>
            {loading ? t("common.loading") : t("firstAid.submit")}
          </Button>
          <Button
            variant="outline"
            icon={<IconVoice width={18} height={18} />}
            onClick={() => (voice.isListening ? voice.stop() : voice.start())}
          >
            {voice.isListening ? t("firstAid.voiceListening") : t("firstAid.voice")}
          </Button>
          <label className="inline-flex">
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
            <span className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-sm px-4 py-2.5 min-h-[44px] bg-transparent text-navy-500 border border-navy-300 hover:bg-navy-50 cursor-pointer">
              <IconCamera width={18} height={18} />
              {t("firstAid.uploadImage")}
            </span>
          </label>
        </div>
      </Card>

      {loading && <SkeletonCard />}
      {error && <ErrorState message={error} onRetry={() => submit(situationText, pendingImage)} retryLabel={t("common.retry")} />}
      {result && !loading && <StructuredResult result={result} />}
    </div>
  );
}
