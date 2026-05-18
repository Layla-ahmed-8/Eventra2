import { useState, useCallback } from 'react';

export interface Coords {
  lat: number;
  lng: number;
}

interface UseLocationReturn {
  coords: Coords | null;
  denied: boolean;
  requesting: boolean;
  request: () => void;
}

const STORAGE_KEY = 'eventra_location';

/**
 * Manages user geolocation with localStorage caching.
 * On mount, reads saved coords so we never re-ask unnecessarily.
 */
export function useLocation(): UseLocationReturn {
  const [coords, setCoords] = useState<Coords | null>(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? (JSON.parse(s) as Coords) : null;
    } catch {
      return null;
    }
  });

  const [denied, setDenied] = useState(false);
  const [requesting, setRequesting] = useState(false);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setDenied(true);
      return;
    }
    setRequesting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c: Coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCoords(c);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
        setRequesting(false);
      },
      () => {
        setDenied(true);
        setRequesting(false);
      },
    );
  }, []);

  return { coords, denied, requesting, request };
}
