import { useCallback, useState } from "react";
import { requestBrowserLocation, type Coordinates, type LocationStatus } from "../services/locationService";

export function useGeolocation() {
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [coords, setCoords] = useState<Coordinates | null>(null);

  const request = useCallback(async () => {
    setStatus("requesting");
    const result = await requestBrowserLocation();
    setStatus(result.status);
    setCoords(result.coords);
    return result;
  }, []);

  return { status, coords, request };
}
