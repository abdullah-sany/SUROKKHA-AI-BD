import { useRef, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { IconUpload } from "../ui/Icons";

interface Props {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function UploadDropzone({ onFileSelected, disabled }: Props) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onFileSelected(file);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
        isDragging ? "border-teal-400 bg-teal-50" : "border-stone-300 bg-white hover:border-teal-300"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <span className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-50 text-teal-600">
        <IconUpload width={22} height={22} />
      </span>
      <div>
        <p className="font-semibold text-navy-700">{t("prescription.upload")}</p>
        <p className="text-xs text-stone-500 mt-1">{t("prescription.dropHint")}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
