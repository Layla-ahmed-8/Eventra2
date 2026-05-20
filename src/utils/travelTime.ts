export interface TravelMode {
  key: string;
  label: string;
  /** lucide icon name — rendered inline */
  iconEmoji: string;
  /** metres per second (urban Cairo average) */
  mps: number;
  googleMode: string;
  cost: string | null;
  unit: string;
}

export const TRAVEL_MODES: TravelMode[] = [
  {
    key: 'walk',
    label: 'Walk',
    iconEmoji: '🚶',
    mps: 1.4,
    googleMode: 'walking',
    cost: null,
    unit: 'steps',
  },
  {
    key: 'car',
    label: 'Drive',
    iconEmoji: '🚗',
    mps: 8.3,
    googleMode: 'driving',
    cost: '~EGP 35 – 50',
    unit: 'km',
  },
  {
    key: 'bike',
    label: 'Cycle',
    iconEmoji: '🚲',
    mps: 3.5,
    googleMode: 'bicycling',
    cost: null,
    unit: 'km',
  },
  {
    key: 'transit',
    label: 'Transit',
    iconEmoji: '🚌',
    mps: 5.0,
    googleMode: 'transit',
    cost: '~EGP 5',
    unit: 'stops',
  },
  {
    key: 'taxi',
    label: 'Taxi',
    iconEmoji: '🚕',
    mps: 7.0,
    googleMode: 'driving',
    cost: '~EGP 45 – 70',
    unit: 'km',
  },
];

/**
 * Formats a distance + speed into a human-readable travel time string.
 * Caps walking display at "> 1 day" when distKm > 100.
 */
export function formatTravelTime(
  distKm: number | null,
  mps: number,
  modeKey?: string,
): string {
  if (distKm === null || distKm === undefined || !mps) return '—';

  // Cap walking at > 1 day for very long distances
  if (modeKey === 'walk' && distKm > 100) return '> 1 day';

  const totalSeconds = (distKm * 1000) / mps;
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/**
 * Builds a Google Maps deep-link for directions to a lat/lng.
 */
export function mapsUrl(
  lat: number,
  lng: number,
  travelMode: string,
): string {
  return [
    'https://www.google.com/maps/dir/?api=1',
    `&destination=${lat},${lng}`,
    `&travelmode=${travelMode}`,
  ].join('');
}

/**
 * Builds a Google Maps text-search link (fallback when coords are missing).
 */
export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?q=${encodeURIComponent(query)}`;
}

export const ROUTE_HINTS: Record<string, string[]> = {
  car: ['26th of July St', 'Corniche el Nil'],
  bike: ['Corniche bike path', 'Agouza roads'],
  transit: ['Bus line', 'Metro Line 2'],
};

export const STEP_HINTS: Record<string, string[]> = {
  walk: [
    'Head north on your street',
    'Turn right onto main road',
    'Continue 1.8 km',
    'Arrive at venue on left',
  ],
  car: [
    'Head east on main road',
    'Keep left toward venue district',
    'Turn right at landmark',
    'Arrive at venue',
  ],
  bike: [
    'Take bike lane heading north',
    'Turn left at bridge',
    'Follow venue district signs',
    'Lock bike at entrance',
  ],
  transit: [
    'Walk 4 min to nearest stop',
    'Board bus/metro toward city center',
    'Ride 3–5 stops',
    'Walk 5 min to venue',
  ],
  taxi: [
    'Request Uber / Careem / InDrive',
    'Share your pickup location',
    'Driver arrives ~3 min',
    'Trip approx 10–15 min',
  ],
};
