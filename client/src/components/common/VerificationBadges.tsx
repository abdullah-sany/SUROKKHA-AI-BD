import { useLanguage } from "../../contexts/LanguageContext";
import { Badge } from "../ui/Badge";

/**
 * Section 17: every real-world record shows either a Verified or Needs
 * Verification badge — never a fake "verified" state. Section 29: demo
 * records get their own unmistakable badge, never blended with real data.
 */
export function VerifiedBadge({ verified }: { verified: boolean }) {
  const { t } = useLanguage();
  return verified ? (
    <Badge tone="success">✓ {t("common.verified")}</Badge>
  ) : (
    <Badge tone="warning">⚠ {t("common.needsVerification")}</Badge>
  );
}

export function DemoDataBadge() {
  const { t } = useLanguage();
  return <Badge tone="neutral">{t("common.demoData")}</Badge>;
}
