import { facilitiesRepository } from "../repositories/facilities.repository";
import type { FacilityQuery } from "../types/facility";

export const facilitiesService = {
  search(query: FacilityQuery) {
    return facilitiesRepository.search(query);
  },
  getById(id: string) {
    return facilitiesRepository.findById(id);
  },
  listDivisions() {
    return facilitiesRepository.listDivisions();
  },
  listDistricts(division?: string) {
    return facilitiesRepository.listDistricts(division);
  },
};
