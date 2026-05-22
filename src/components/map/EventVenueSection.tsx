import { useState, useMemo, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin, Clock, Navigation, ExternalLink, Share2, List,
  ChevronUp, Video, AlertTriangle, Loader2, Route,
  Coins, Car, Footprints, Bike, Bus, TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { purplePin, userDot } from './PurplePin';
import { haversineKm } from '../../utils/distance';
import {
  TRAVEL_MODES,
  formatTravelTime,
  mapsUrl,
  mapsSearchUrl,
  ROUTE_HINTS,
  STEP_HINTS,
} from '../../utils/travelTime';
import { useLocation } from '../../hooks/useLocation';

// ── Cairo city-centre fallback coords
const CAIRO_CENTER = { lat: 30.0444, lng: 31.2357 };

export interface VenueLocation {
  venue: string | null;
  address: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  isVirtual: boolean;
  virtualLink?: string | null;
}

interface Props {
  location: VenueLocation;
}

// ── Mode icon map
function ModeIcon({ modeKey, className }: { modeKey: string; className?: string }) {
  const cls = className ?? 'w-4 h-4';
  switch (modeKey) {
    case 'walk':    return <Footprints className={cls} />;
    case 'car':     return <Car className={cls} />;
    case 'bike':    return <Bike className={cls} />;
    case 'transit': return <Bus className={cls} />;
    case 'taxi':    return <TrendingUp className={cls} />;
    default:        return <Navigation className={cls} />;
  }
}

// ── Leaflet mini map for venue display
function VenueMap({
  lat,
  lng,
  userCoords,
}: {
  lat: number;
  lng: number;
  userCoords: { lat: number; lng: number } | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
      scrollWheelZoom: false,
      dragging: false,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    L.marker([lat, lng], { icon: purplePin }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    userMarkerRef.current?.remove();
    polylineRef.current?.remove();
    userMarkerRef.current = null;
    polylineRef.current = null;

    if (userCoords) {
      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userDot }).addTo(map);
      polylineRef.current = L.polyline(
        [[userCoords.lat, userCoords.lng], [lat, lng]],
        { color: '#6C4CF1', weight: 2, dashArray: '6 4', opacity: 0.6 },
      ).addTo(map);
    }
  }, [userCoords, lat, lng]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

export default function EventVenueSection({ location }: Props) {
  const { coords, denied, requesting, request } = useLocation();
  const [activeKey, setActiveKey] = useState('car');
  const [stepsOpen, setStepsOpen] = useState(false);

  // ── Virtual event
  if (location.isVirtual) {
    return (
      <div className="bento-section p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
          <Video className="w-5 h-5 text-cyan-500" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#1F0A6B] dark:text-violet-200">Virtual event</p>
          <p className="text-[12px] text-gray-500 mt-0.5">
            Join link will be shared before the event
          </p>
          {location.virtualLink && (
            <a
              href={location.virtualLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-[12px] text-violet-600 font-medium hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open join link
            </a>
          )}
        </div>
      </div>
    );
  }

  // ── Missing coords — text-only fallback
  if (!location.lat || !location.lng) {
    const searchQuery = [location.address, location.city].filter(Boolean).join(', ');
    return (
      <div className="bento-section p-6 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#1F0A6B] dark:text-violet-200">{location.venue}</p>
          <p className="text-[12px] text-gray-500 mt-0.5">{location.address}</p>
          {searchQuery && (
            <a
              href={mapsSearchUrl(searchQuery)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-[12px] text-violet-600 font-medium hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in Maps
            </a>
          )}
        </div>
      </div>
    );
  }

  const lat = location.lat;
  const lng = location.lng;

  const distKm: number | null = coords
    ? haversineKm(coords.lat, coords.lng, lat, lng)
    : null;

  // Fallback distance for time estimates when location is unavailable
  const estimateDistKm = distKm ?? haversineKm(CAIRO_CENTER.lat, CAIRO_CENTER.lng, lat, lng);

  const selectedMode = TRAVEL_MODES.find((m) => m.key === activeKey) ?? TRAVEL_MODES[1];
  const travelTime = formatTravelTime(estimateDistKm, selectedMode.mps, selectedMode.key);
  const openMapsUrl = mapsUrl(lat, lng, selectedMode.googleMode);

  const routeHints = ROUTE_HINTS[activeKey] ?? null;
  const steps = STEP_HINTS[activeKey] ?? [];

  const handleShare = async () => {
    const url = openMapsUrl;
    if (navigator.share) {
      try {
        await navigator.share({
          title: location.venue ?? 'Event Venue',
          text: `Directions to ${location.venue}, ${location.address}`,
          url,
        });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied!', { duration: 2000 });
      } catch {
        toast.error('Could not copy link');
      }
    }
  };

  return (
    <div className="bento-section overflow-hidden">
      {/* ── A. MINI MAP ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <VenueMap
          lat={lat}
          lng={lng}
          userCoords={coords}
        />

        {/* Expand button */}
        <button
          onClick={() => window.open(openMapsUrl, '_blank')}
          className="absolute top-2 right-2 z-[1000] flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          aria-label="Open in Google Maps"
        >
          Expand
          <ExternalLink className="w-3 h-3" />
        </button>

        {/* Location denied banner */}
        {denied && (
          <div className="absolute bottom-0 left-0 right-0 z-[1000] flex items-center gap-2 bg-amber-50 text-amber-800 text-xs px-3 py-2">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Location unavailable —</span>
            <button onClick={request} className="underline font-medium hover:text-amber-900">
              Enable
            </button>
          </div>
        )}

        {/* Requesting indicator */}
        {requesting && (
          <div className="absolute bottom-0 left-0 right-0 z-[1000] flex items-center gap-2 bg-blue-50 text-blue-700 text-xs px-3 py-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
            Getting your location…
          </div>
        )}
      </div>

      {/* ── B. VENUE INFO ROW ────────────────────────────────────────────────── */}
      <div
        className="flex items-start gap-3 px-4 py-3"
        style={{ borderBottom: '1px solid rgba(108,76,241,0.06)' }}
      >
        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-4 h-4 text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#1F0A6B] dark:text-violet-200 truncate">
            {location.venue}
          </p>
          <p className="text-[12px] text-gray-500 mt-0.5 truncate">
            {location.address}
          </p>
          {distKm !== null && (
            <span className="inline-flex items-center gap-1 mt-1.5 bg-blue-50 text-blue-700 rounded px-2 py-0.5 text-[11px] font-medium">
              <Navigation className="w-2.5 h-2.5" />
              {distKm.toFixed(1)} km away
            </span>
          )}
          {!coords && !denied && (
            <button
              onClick={request}
              className="inline-flex items-center gap-1 mt-1.5 text-[11px] text-violet-600 font-medium hover:underline"
            >
              <Navigation className="w-2.5 h-2.5" />
              Get distance
            </button>
          )}
        </div>
      </div>

      {/* ── C. TRAVEL MODE SELECTOR ──────────────────────────────────────────── */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: '1px solid rgba(108,76,241,0.06)' }}
      >
        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">
          How to get there
        </p>
        <div className="flex gap-2 flex-wrap">
          {TRAVEL_MODES.map((mode) => {
            const isActive = mode.key === activeKey;
            const time = formatTravelTime(estimateDistKm, mode.mps, mode.key);
            return (
              <button
                key={mode.key}
                onClick={() => setActiveKey(mode.key)}
                className={`min-w-[62px] px-3 py-2 rounded-xl flex flex-col items-center gap-1 border transition-all text-center ${
                  isActive
                    ? 'border-violet-400 bg-violet-50'
                    : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                }`}
                aria-pressed={isActive}
              >
                <span className={isActive ? 'text-violet-600' : ''}>
                  <ModeIcon modeKey={mode.key} className="w-4 h-4" />
                </span>
                <span
                  className={`text-[11px] font-semibold leading-none ${
                    isActive ? 'text-[#1F0A6B] dark:text-violet-200' : 'text-gray-400'
                  }`}
                >
                  {time}
                </span>
                <span
                  className={`text-[10px] leading-none ${
                    isActive ? 'text-violet-500' : 'text-gray-400'
                  }`}
                >
                  {mode.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── D. DETAIL ROWS ───────────────────────────────────────────────────── */}
      <div style={{ borderBottom: '1px solid rgba(108,76,241,0.06)' }}>
        {/* Estimated time */}
        <div
          className="flex justify-between items-center px-4 py-2.5"
          style={{ borderBottom: '1px solid rgba(108,76,241,0.06)' }}
        >
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Estimated time</span>
          </div>
          <span className="text-xs font-medium text-[#1F0A6B] dark:text-violet-200">{travelTime}</span>
        </div>

        {/* Distance */}
        <div
          className="flex justify-between items-center px-4 py-2.5"
          style={{ borderBottom: '1px solid rgba(108,76,241,0.06)' }}
        >
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Route className="w-4 h-4" />
            <span>Distance</span>
          </div>
          <span className="text-xs font-medium text-[#1F0A6B] dark:text-violet-200">
            {distKm !== null ? `${distKm.toFixed(1)} km` : '—'}
          </span>
        </div>

        {/* Cost — only when mode has a cost */}
        {selectedMode.cost && (
          <div
            className="flex justify-between items-center px-4 py-2.5"
            style={{ borderBottom: '1px solid rgba(108,76,241,0.06)' }}
          >
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Coins className="w-4 h-4" />
              <span>Estimated cost</span>
            </div>
            <span className="text-xs font-medium text-[#1F0A6B] dark:text-violet-200">
              {selectedMode.cost}
            </span>
          </div>
        )}

        {/* Via — only for car, bike, transit */}
        {routeHints && (
          <div className="flex justify-between items-center px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Navigation className="w-4 h-4" />
              <span>Via</span>
            </div>
            <div className="flex gap-1.5">
              {routeHints.map((r) => (
                <span
                  key={r}
                  className="bg-gray-50 rounded-sm text-[11px] text-gray-500 px-1.5 py-0.5 border border-gray-100"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── E. STEPS TOGGLE ──────────────────────────────────────────────────── */}
      {stepsOpen && (
        <div
          className="px-4 py-3"
          style={{ borderBottom: '1px solid rgba(108,76,241,0.06)' }}
        >
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-2">Turn-by-turn</p>
          <ol>
            {steps.map((step, i) => {
              const isFirst = i === 0;
              const isLast = i === steps.length - 1;
              return (
                <li key={i} className="flex items-start gap-2 mb-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      isFirst ? 'bg-violet-400' : isLast ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                  <span className="text-[12px] text-gray-600">{step}</span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* ── F. ACTION BUTTONS ────────────────────────────────────────────────── */}
      <div className="flex gap-2 px-4 py-3">
        {/* Open in Maps */}
        <button
          onClick={() => window.open(openMapsUrl, '_blank')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-[12px] font-medium transition-opacity hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6C4CF1, #8B6CF7)' }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open in Maps
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-[12px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>

        {/* Steps toggle */}
        <button
          onClick={() => setStepsOpen((s) => !s)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors flex-shrink-0"
          aria-label={stepsOpen ? 'Hide steps' : 'Show steps'}
          aria-pressed={stepsOpen}
        >
          {stepsOpen ? <ChevronUp className="w-4 h-4" /> : <List className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
