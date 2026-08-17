import { useLanguage } from "../../contexts/LanguageContext";
import type { EmergencyContact } from "../../types";
import { formatPhoneHref } from "../../utils/formatters";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { VerifiedBadge } from "../common/VerificationBadges";
import { IconPhone } from "../ui/Icons";

export function EmergencyContactCard({ contact }: { contact: EmergencyContact }) {
  const { t, language } = useLanguage();
  const description = language === "bn" && contact.descriptionBn ? contact.descriptionBn : contact.description;
  const name = language === "bn" && contact.nameBn ? contact.nameBn : contact.name;

  return (
    <Card className="space-y-2.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-navy-800">{name}</p>
          <p className="text-xs text-stone-500 mt-0.5">{contact.category}</p>
        </div>
        <VerifiedBadge verified={contact.verified} />
      </div>
      <p className="text-sm text-navy-700">{description}</p>
      <a href={formatPhoneHref(contact.phone)}>
        <Button variant="emergency" size="sm" icon={<IconPhone width={16} height={16} />} fullWidth>
          {t("common.call")} {contact.phone}
        </Button>
      </a>
      <p className="text-xs text-stone-400">{t("common.source")}: {contact.source}</p>
    </Card>
  );
}
