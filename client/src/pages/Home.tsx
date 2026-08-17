import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useVoiceInput } from "../hooks/useVoiceInput";
import { formatTimeOfDay } from "../utils/formatters";
import { validateImageFile, fileToBase64 } from "../utils/validators";
import { useToast } from "../contexts/ToastContext";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { QuickFirstAidGrid } from "../components/home/QuickFirstAidGrid";
import { EmergencyQuickActions } from "../components/home/EmergencyQuickActions";
import { openRoktoSheba } from "../data/roktosheba";
import { IconVoice, IconCamera, IconBlood } from "../components/ui/Icons";

export default function Home() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [situationText, setSituationText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleVoiceResult = useCallback((text: string) => {
    setSituationText((prev) => (prev ? `${prev} ${text}` : text));
  }, []);
  const voice = useVoiceInput(language, handleVoiceResult);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateImageFile(file);
    if (error) {
      showToast(error, "error");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleGetHelp() {
    if (!situationText.trim() && !imageFile) {
      showToast("Please describe what happened, or attach a photo.", "warning");
      return;
    }
    let imageBase64: string | undefined;
    let imageMimeType: string | undefined;
    if (imageFile) {
      imageBase64 = await fileToBase64(imageFile);
      imageMimeType = imageFile.type;
    }
    navigate("/first-aid", {
      state: { situationText, imageBase64, imageMimeType, autoSubmit: true },
    });
  }

  return (
    <div className="space-y-8 pt-1">
      <section>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-navy-800">
          {t("home.greeting", { timeOfDay: t(`home.timeOfDay.${formatTimeOfDay()}`) })}
        </h1>
        <p className="text-stone-500 mt-1">{t("home.subtitle")}</p>
      </section>

      <Card className="space-y-3">
        <label htmlFor="situation" className="text-sm font-semibold text-navy-700">
          {t("home.inputLabel")}
        </label>
        <textarea
          id="situation"
          value={situationText}
          onChange={(e) => setSituationText(e.target.value)}
          placeholder={t("home.inputPlaceholder")}
          rows={3}
          className="w-full resize-none rounded-lg border border-stone-200 bg-warm-100/60 px-3 py-2.5 text-sm text-navy-800 placeholder:text-stone-400 focus:bg-white"
        />

        {imagePreview && (
          <div className="relative inline-block">
            <img src={imagePreview} alt="Attached" className="h-20 w-20 rounded-lg object-cover border border-stone-200" />
            <button
              onClick={() => { setImageFile(null); setImagePreview(null); }}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-navy-700 text-white text-xs"
              aria-label={t("firstAid.removeImage")}
            >
              ×
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleGetHelp} size="md">{t("home.getHelp")}</Button>
          <Button
            variant="outline"
            size="md"
            icon={<IconVoice width={18} height={18} />}
            onClick={() => (voice.isListening ? voice.stop() : voice.start())}
          >
            {voice.isListening ? t("firstAid.voiceListening") : t("home.voiceInput")}
          </Button>
          <label className="inline-flex">
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
            <span className="inline-flex items-center justify-center gap-2 rounded-lg font-semibold text-sm px-4 py-2.5 min-h-[44px] bg-transparent text-navy-500 border border-navy-300 hover:bg-navy-50 cursor-pointer">
              <IconCamera width={18} height={18} />
              {t("home.uploadImage")}
            </span>
          </label>
        </div>
        {!voice.isSupported && (
          <p className="text-xs text-stone-400">{t("firstAid.voiceUnsupported")}</p>
        )}
      </Card>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-navy-700">{t("home.quickFirstAid")}</h2>
        <QuickFirstAidGrid />
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-navy-700">{t("home.emergencyHelp")}</h2>
        <EmergencyQuickActions />
      </section>

      <button
        onClick={openRoktoSheba}
        className="w-full text-left flex items-center gap-4 rounded-xl border border-emred-200 bg-emred-50/50 p-4 hover:bg-emred-50 transition-colors"
      >
        <span className="flex items-center justify-center w-11 h-11 rounded-full bg-emred-500 text-white shrink-0">
          <IconBlood width={22} height={22} />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-navy-800">{t("home.needBlood")}</span>
          <span className="block text-sm text-stone-500">{t("home.needBloodBlurb")}</span>
        </span>
        <span className="text-sm font-semibold text-emred-600 shrink-0">{t("home.findBlood")} →</span>
      </button>
    </div>
  );
}
