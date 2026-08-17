import { useCallback, useEffect, useState } from "react";
import { fetchTimeline, deleteTimelineEntry, clearTimeline } from "../services/timelineService";
import type { TimelineEntry } from "../types";

export function useTimeline() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEntries(await fetchTimeline());
    } catch {
      setError("Couldn't load your timeline.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const remove = useCallback(async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    await deleteTimelineEntry(id).catch(() => load());
  }, [load]);

  const clearAll = useCallback(async () => {
    setEntries([]);
    await clearTimeline().catch(() => load());
  }, [load]);

  return { entries, loading, error, reload: load, remove, clearAll };
}
