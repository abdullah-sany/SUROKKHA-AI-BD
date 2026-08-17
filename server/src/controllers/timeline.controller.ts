import type { Request, Response } from "express";
import { timelineService } from "../services/timeline.service";
import { AppError } from "../utils/AppError";
import type { TimelineEntryType } from "../repositories/timeline.repository";

function requireClientId(req: Request): string {
  const clientId = (req.headers["x-client-id"] as string) || (req.query.clientId as string);
  if (!clientId || clientId.length < 6) {
    throw new AppError(
      "Missing client ID. The app generates one automatically in your browser — try reloading.",
      400,
      "MISSING_CLIENT_ID"
    );
  }
  return clientId;
}

export async function getTimeline(req: Request, res: Response) {
  const clientId = requireClientId(req);
  res.json({ ok: true, data: timelineService.list(clientId) });
}

export async function postTimeline(req: Request, res: Response) {
  const clientId = requireClientId(req);
  const { type, summary, severity } = req.body as { type: TimelineEntryType; summary: string; severity?: string };
  const entry = timelineService.add(clientId, type, summary, severity ?? null);
  res.status(201).json({ ok: true, data: entry });
}

export async function deleteTimelineEntry(req: Request, res: Response) {
  const clientId = requireClientId(req);
  const removed = timelineService.remove(clientId, req.params.id as string);
  if (!removed) {
    throw new AppError("Timeline entry not found.", 404, "NOT_FOUND");
  }
  res.json({ ok: true, data: { deleted: true } });
}

export async function deleteAllTimeline(req: Request, res: Response) {
  const clientId = requireClientId(req);
  const count = timelineService.clear(clientId);
  res.json({ ok: true, data: { deletedCount: count } });
}
