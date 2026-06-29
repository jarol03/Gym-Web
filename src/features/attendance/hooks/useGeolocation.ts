import { useState } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  function requestLocation(): Promise<{
    latitude: number;
    longitude: number;
  } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        setState((prev) => ({
          ...prev,
          error: "Tu navegador no soporta geolocalización",
        }));
        resolve(null);
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setState({ ...coords, error: null, loading: false });
          resolve(coords);
        },
        (error) => {
          let message = "No se pudo obtener tu ubicación";
          if (error.code === error.PERMISSION_DENIED) {
            message =
              "Necesitas permitir el acceso a tu ubicación para registrar asistencia";
          } else if (error.code === error.TIMEOUT) {
            message =
              "Tardó demasiado en obtener tu ubicación, intenta de nuevo";
          }
          setState((prev) => ({ ...prev, error: message, loading: false }));
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    });
  }

  return { ...state, requestLocation };
}
