import type { SeverityLevel } from "../types";

interface SeverityStyle {
  label: string;
  badgeClass: string;
  bannerClass: string;
  dotClass: string;
}

/**
 * Central place mapping the AI safety classification (section 8) to
 * visual treatment. Emergency is the only level that gets the reserved
 * emergency-red banner treatment — every other level stays calm.
 */
export function getSeverityStyle(severity: SeverityLevel): SeverityStyle {
  switch (severity) {
    case "EMERGENCY":
      return {
        label: "EMERGENCY",
        badgeClass: "bg-emred-500 text-white",
        bannerClass: "bg-emred-50 border-emred-500 text-emred-700",
        dotClass: "bg-emred-500",
      };
    case "URGENT":
      return {
        label: "Urgent",
        badgeClass: "bg-amber-500 text-white",
        bannerClass: "bg-amber-50 border-amber-500 text-amber-600",
        dotClass: "bg-amber-500",
      };
    case "MEDICAL_ATTENTION_RECOMMENDED":
      return {
        label: "Medical attention recommended",
        badgeClass: "bg-teal-500 text-white",
        bannerClass: "bg-teal-50 border-teal-500 text-teal-700",
        dotClass: "bg-teal-500",
      };
    case "NORMAL_FIRST_AID":
    default:
      return {
        label: "Normal first aid",
        badgeClass: "bg-leaf-500 text-white",
        bannerClass: "bg-leaf-50 border-leaf-500 text-leaf-600",
        dotClass: "bg-leaf-500",
      };
  }
}
