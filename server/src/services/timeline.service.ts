import { timelineRepository, type TimelineEntryType } from "../repositories/timeline.repository";

export const timelineService = {
  add(clientId: string, type: TimelineEntryType, summary: string, severity: string | null) {
    return timelineRepository.add(clientId, type, summary, severity);
  },
  list(clientId: string) {
    return timelineRepository.listForClient(clientId);
  },
  remove(clientId: string, id: string) {
    return timelineRepository.delete(clientId, id);
  },
  clear(clientId: string) {
    return timelineRepository.clearForClient(clientId);
  },
};
