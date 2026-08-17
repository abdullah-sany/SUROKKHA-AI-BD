/**
 * SUROKKHA AI BD deliberately does NOT build a second blood donation
 * platform (section 18). It links out to the existing RoktoSheba AI Blood
 * Donation platform instead of duplicating donor search/matching here.
 */
export const ROKTOSHEBA_URL =
  import.meta.env.VITE_ROKTOSHEBA_URL || "https://roktosheba-ai-blood-donation.netlify.app/";

export function openRoktoSheba() {
  window.open(ROKTOSHEBA_URL, "_blank", "noopener,noreferrer");
}
