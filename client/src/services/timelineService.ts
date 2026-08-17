import { apiRequest } from "./apiClient";
import type { TimelineEntry, TimelineEntryType } from "../types";

export async function fetchTimeline(): Promise<TimelineEntry[]> {
  const res = await apiRequest<{ ok: true; data: TimelineEntry[] }>("/timeline");
  return res.data;
}

export async function addTimelineEntry(
  type: TimelineEntryType,
  summary: string,
  severity?: string | null
): Promise<TimelineEntry> {
  const res = await apiRequest<{ ok: true; data: TimelineEntry }>("/timeline", {
    method: "POST",
    body: { type, summary, severity: severity ?? undefined },
  });
  return res.data;
}

export async function deleteTimelineEntry(id: string): Promise<void> {
  await apiRequest(`/timeline/${id}`, { method: "DELETE" });
}

export async function clearTimeline(): Promise<void> {
  await apiRequest("/timeline", { method: "DELETE" });
}
