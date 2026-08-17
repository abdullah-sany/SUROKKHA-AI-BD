export function formatPhoneHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function formatTimeOfDay(date: Date = new Date()): "morning" | "afternoon" | "evening" | "night" {
  const hour = date.getHours();
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

export function formatRelativeDate(iso: string, locale: "en" | "bn"): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  const rtf = new Intl.RelativeTimeFormat(locale === "bn" ? "bn" : "en", { numeric: "auto" });
  if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, "minute");
  const diffHr = Math.round(diffMin / 60);
  if (Math.abs(diffHr) < 24) return rtf.format(-diffHr, "hour");
  const diffDay = Math.round(diffHr / 24);
  return rtf.format(-diffDay, "day");
}
