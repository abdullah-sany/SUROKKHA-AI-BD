import { ambulancesRepository } from "../repositories/ambulances.repository";
import type { AmbulanceQuery } from "../types/ambulance";

export const ambulancesService = {
  search(query: AmbulanceQuery) {
    return ambulancesRepository.search(query);
  },
  listDistricts() {
    return ambulancesRepository.listDistricts();
  },
};
