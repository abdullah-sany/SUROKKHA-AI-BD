const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_PRESCRIPTION_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) return "Please upload a JPG, PNG, or WEBP image.";
  if (file.size > MAX_UPLOAD_BYTES) return "Image is too large. Please use a file under 5 MB.";
  return null;
}

export function validatePrescriptionFile(file: File): string | null {
  if (!ALLOWED_PRESCRIPTION_TYPES.has(file.type)) return "Please upload a JPG, PNG, WEBP, or PDF file.";
  if (file.size > MAX_UPLOAD_BYTES) return "File is too large. Please use a file under 5 MB.";
  return null;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}
