export type LocationStatus = "idle" | "requesting" | "granted" | "denied" | "unavailable" | "timeout";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * Thin wrapper over the browser Geolocation API (section 11). Never
 * throws — always resolves with a status so the UI can fall back to
 * manual division/district selection instead of getting stuck.
 */
export function requestBrowserLocation(): Promise<{ status: LocationStatus; coords: Coordinates | null }> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve({ status: "unavailable", coords: null });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          status: "granted",
          coords: { latitude: position.coords.latitude, longitude: position.coords.longitude },
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          resolve({ status: "denied", coords: null });
        } else if (error.code === error.TIMEOUT) {
          resolve({ status: "timeout", coords: null });
        } else {
          resolve({ status: "unavailable", coords: null });
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 }
    );
  });
}
