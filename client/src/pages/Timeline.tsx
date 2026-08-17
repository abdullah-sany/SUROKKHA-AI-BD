import { useLanguage } from "../contexts/LanguageContext";
import { useTimeline } from "../hooks/useTimeline";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { SkeletonLine, ErrorState, EmptyState } from "../components/ui/Feedback";
import { TimelineItem } from "../components/timeline/TimelineItem";
import { IconTimeline } from "../components/ui/Icons";

export default function Timeline() {
  const { t } = useLanguage();
  const { entries, loading, error, reload, remove, clearAll } = useTimeline();

  return (
    <div className="space-y-6 pt-1">
      <section className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-800">{t("timeline.title")}</h1>
          <p className="text-stone-500 mt-1">{t("timeline.subtitle")}</p>
        </div>
        {entries.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => { if (window.confirm(t("timeline.confirmClear"))) clearAll(); }}
          >
            {t("timeline.clearAll")}
          </Button>
        )}
      </section>

      <Card padded={entries.length > 0}>
        {loading && (
          <div className="space-y-3 p-4">
            <SkeletonLine className="h-4 w-3/4" />
            <SkeletonLine className="h-4 w-1/2" />
            <SkeletonLine className="h-4 w-2/3" />
          </div>
        )}
        {error && <ErrorState message={error} onRetry={reload} retryLabel={t("common.retry")} />}
        {!loading && !error && entries.length === 0 && (
          <EmptyState title={t("timeline.empty")} icon={<IconTimeline width={32} height={32} />} />
        )}
        {!loading && entries.map((entry) => (
          <TimelineItem key={entry.id} entry={entry} onDelete={remove} />
        ))}
      </Card>
    </div>
  );
}
