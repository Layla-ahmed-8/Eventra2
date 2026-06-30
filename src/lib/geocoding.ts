const CACHE_PREFIX = 'eventra_revgeo_';

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const key = `${CACHE_PREFIX}${lat.toFixed(3)}_${lng.toFixed(3)}`;
    const cached = sessionStorage.getItem(key);
    if (cached) return cached;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=14`,
      { headers: { 'Accept-Language': 'en' } },
    );
    if (!res.ok) return null;

    const data = await res.json() as {
      display_name?: string;
      address?: { suburb?: string; neighbourhood?: string; city?: string; town?: string };
    };

    const label =
      data.address?.suburb ||
      data.address?.neighbourhood ||
      data.address?.city ||
      data.address?.town ||
      data.display_name?.split(',')[0] ||
      null;

    if (label) sessionStorage.setItem(key, label);
    return label;
  } catch {
    return null;
  }
}

export async function forwardGeocode(query: string): Promise<Array<{ lat: number; lng: number; label: string }>> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
      { headers: { 'Accept-Language': 'en' } },
    );
    if (!res.ok) return [];
    const data = await res.json() as Array<{ lat: string; lon: string; display_name: string }>;
    return data.map((item) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      label: item.display_name,
    }));
  } catch {
    return [];
  }
}
