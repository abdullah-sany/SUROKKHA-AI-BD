import { randomUUID } from "node:crypto";
import { db } from "./db";

export type TimelineEntryType =
  | "FIRST_AID_CONSULTATION"
  | "EMERGENCY_SEARCH"
  | "HOSPITAL_SEARCH"
  | "PRESCRIPTION_ANALYSIS"
  | "BLOOD_PLATFORM_VISIT";

export interface TimelineEntry {
  id: string;
  clientId: string;
  type: TimelineEntryType;
  summary: string;
  severity: string | null;
  createdAt: string;
}

/**
 * `clientId` is a random ID generated and stored in the browser (not tied
 * to any account) so the timeline stays useful without collecting personal
 * information (section 22/26: privacy — no unnecessary personal data,
 * deletion always available).
 */
export const timelineRepository = {
  add(clientId: string, type: TimelineEntryType, summary: string, severity: string | null): TimelineEntry {
    const entry: TimelineEntry = {
      id: randomUUID(),
      clientId,
      type,
      summary,
      severity,
      createdAt: new Date().toISOString(),
    };
    db.prepare(
      `INSERT INTO timeline_entries (id, clientId, type, summary, severity, createdAt) VALUES (@id, @clientId, @type, @summary, @severity, @createdAt)`
    ).run(entry);
    return entry;
  },

  listForClient(clientId: string): TimelineEntry[] {
    return db
      .prepare("SELECT * FROM timeline_entries WHERE clientId = ? ORDER BY createdAt DESC")
      .all(clientId) as TimelineEntry[];
  },

  delete(clientId: string, id: string): boolean {
    const result = db.prepare("DELETE FROM timeline_entries WHERE clientId = ? AND id = ?").run(clientId, id);
    return result.changes > 0;
  },

  clearForClient(clientId: string): number {
    const result = db.prepare("DELETE FROM timeline_entries WHERE clientId = ?").run(clientId);
    return result.changes;
  },
};
