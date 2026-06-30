import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import {
  Search, X, MapPin, Users, Heart, ExternalLink,
  Navigation, LocateFixed, ZoomIn, ZoomOut, Sparkles,
  Car, Footprints, Bike, Bus, TrendingUp, Radio,
  Calendar, Clock, Star, Info, ChevronRight, Bookmark,
  Share2, Map as MapIcon
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { createMapTileLayer } from '../../lib/mapTiles';
import { reverseGeocode } from '../../lib/geocoding';
import { scoreNearbyEvents, buildNearMeInsight } from '../../lib/mapRecommendations';
import { useLocation } from '../../hooks/useLocation';
import { haversineKm } from '../../utils/distance';
import { TRAVEL_MODES, formatTravelTime, mapsUrl } from '../../utils/travelTime';
import { getCategoryPin, getUserLocationPin } from '../../components/map/categoryPins';
import type { Event } from '../../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../app/components/ui/utils';

// ── Constants ─────────────────────────────────────────────────────────────────
const CAIRO: [number, number] = [30.0444, 31.2357];
const FILTERS = ['All', 'Music', 'Tech', 'Food', 'Art', 'Sports', 'Free', 'Today'];
const TIME_OPTIONS = [
  { label: 'Now', value: 'now' },
  { label: 'Tonight', value: 'tonight' },
  { label: 'Weekend', value: 'weekend' },
  { label: 'All Time', value: 'all' },
];
type TravelKey = 'walk' | 'car' | 'bike' | 'transit' | 'taxi';

function categoryColor(cat: string) {
  const m: Record<string, string> = {
    Music: '#6C4CF1', Tech: '#378ADD', Business: '#378ADD',
    'Food & Drink': '#F97316', Art: '#EC4899', Sports: '#22C55E',
    'Health & Wellness': '#22C55E', Gaming: '#A855F7', Film: '#EF4444',
    Fashion: '#F472B6', Science: '#06B6D4', Community: '#F59E0B',
  };
  return m[cat] ?? '#6C4CF1';
}

function ModeIcon({ k }: { k: TravelKey }) {
  if (k === 'walk')    return <Footprints className="w-3.5 h-3.5" />;
  if (k === 'car')     return <Car className="w-3.5 h-3.5" />;
  if (k === 'bike')    return <Bike className="w-3.5 h-3.5" />;
  if (k === 'transit') return <Bus className="w-3.5 h-3.5" />;
  return <TrendingUp className="w-3.5 h-3.5" />;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function MapDiscovery() {
  const navigate = useNavigate();
  const { events, bookmarkedEvents, toggleBookmark, theme, interests, setUserLocation } = useAppStore();
  const { coords, denied, request } = useLocation();

  const [search, setSearch]           = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [travelMode, setTravelMode]   = useState<TravelKey>('car');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [liveMode, setLiveMode]       = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [timeRange, setTimeRange]     = useState('all');
  const [planner, setPlanner]         = useState<string[]>([]);
  const [view, setView]               = useState<'feed' | 'detail'>('feed');

  const mapRef       = useRef<L.Map | null>(null);
  const mapDivRef    = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef   = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  // ── Filtered events ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return events
      .filter(e => !e.location.isVirtual && e.location.lat && e.location.lng)
      .filter(e => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Free') return e.price === 0;
        if (activeFilter === 'Today') {
          const today = new Date().toDateString();
          return new Date(e.date).toDateString() === today;
        }
        if (activeFilter === 'Food') return e.category === 'Food & Drink';
        return e.category === activeFilter;
      })
      .filter(e => {
        if (timeRange === 'all') return true;
        const date = new Date(e.date);
        const now = new Date();
        if (timeRange === 'now') {
          return date.toDateString() === now.toDateString() && date.getHours() >= now.getHours() - 1 && date.getHours() <= now.getHours() + 2;
        }
        if (timeRange === 'tonight') {
          return date.toDateString() === now.toDateString() && date.getHours() >= 17;
        }
        if (timeRange === 'weekend') {
          const day = date.getDay();
          return day === 5 || day === 6 || day === 0; // Fri, Sat, Sun
        }
        return true;
      })
      .filter(e => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          (e.location.venue ?? '').toLowerCase().includes(q) ||
          (e.location.city ?? '').toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
        );
      });
  }, [events, activeFilter, search, timeRange]);

  // ── Enriched with distance ───────────────────────────────────────────────
  type EnrichedEvent = Event & { distKm: number | null };

  const enriched = useMemo((): EnrichedEvent[] => {
    return filtered.map((e: Event): EnrichedEvent => ({
      ...e,
      distKm: coords
        ? haversineKm(coords.lat, coords.lng, e.location.lat, e.location.lng)
        : null,
    })).sort((a: EnrichedEvent, b: EnrichedEvent) => {
      if (a.distKm !== null && b.distKm !== null) return a.distKm - b.distKm;
      return 0;
    });
  }, [filtered, coords]);

  const nearMeInsight = useMemo(() => {
    if (!coords) return 'Enable location to get AI-powered nearby event recommendations.';
    const recs = scoreNearbyEvents(events, coords.lat, coords.lng, { interests });
    return buildNearMeInsight(recs);
  }, [coords, events, interests]);

  const topPick = useMemo(() => {
    if (!coords) return enriched.find((e) => e.isRecommended) || enriched[0];
    const recs = scoreNearbyEvents(events, coords.lat, coords.lng, { interests });
    return recs[0]?.event ?? enriched[0];
  }, [coords, events, interests, enriched]);

  // ── Init map ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = L.map(mapDivRef.current, {
      center: coords ? [coords.lat, coords.lng] : CAIRO,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
    });

    const tileLayer = createMapTileLayer(theme === 'dark' ? 'dark' : 'light');
    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;

    mapRef.current = map;

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync map tiles when theme changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    tileLayerRef.current?.remove();
    const tileLayer = createMapTileLayer(theme === 'dark' ? 'dark' : 'light');
    tileLayer.addTo(map);
    tileLayerRef.current = tileLayer;
  }, [theme]);

  // Persist user location in store + reverse geocode label
  useEffect(() => {
    if (!coords) return;
    reverseGeocode(coords.lat, coords.lng).then((city) => {
      setUserLocation(coords.lat, coords.lng, city);
    });
  }, [coords, setUserLocation]);

  // Update map center when coords change
  useEffect(() => {
    if (mapRef.current && coords) {
      mapRef.current.panTo({ lat: coords.lat, lng: coords.lng });
    }
  }, [coords]);

  // ── Update markers when filtered events change ───────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    enriched.forEach((ev: EnrichedEvent) => {
      const crowd = ev.rsvpCount / ev.capacity > 0.75 ? 'high'
        : ev.rsvpCount / ev.capacity > 0.4 ? 'medium' : 'low';
      const pin = getCategoryPin(ev.category, liveMode, crowd);
      const marker = L.marker([ev.location.lat, ev.location.lng], { icon: pin })
        .addTo(map)
        .on('click', () => {
          setSelectedEvent(ev);
          map.flyTo([ev.location.lat, ev.location.lng], 16, { duration: 0.5 });
        });

      markersRef.current.push(marker);
    });
  }, [enriched, liveMode]);

  // ── Update user location marker ──────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    userMarkerRef.current?.remove();
    radiusCircleRef.current?.remove();

    if (coords) {
      userMarkerRef.current = L.marker([coords.lat, coords.lng], {
        icon: getUserLocationPin(),
      }).addTo(map);

      radiusCircleRef.current = L.circle([coords.lat, coords.lng], {
        radius: 5000,
        color: '#6C4CF1',
        fillColor: '#6C4CF1',
        fillOpacity: 0.05,
        weight: 1,
        dashArray: '4 4',
      }).addTo(map);
    }
  }, [coords]);

  // ── Map controls ─────────────────────────────────────────────────────────
  const locateMe = () => {
    if (!coords) { request(); return; }
    if (mapRef.current) {
      mapRef.current.panTo({ lat: coords.lat, lng: coords.lng });
      mapRef.current.setZoom(14);
    }
  };

  const flyToEvent = (ev: Event) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat: ev.location.lat, lng: ev.location.lng });
      mapRef.current.setZoom(16);
    }
    setSelectedEvent(ev);
    setView('detail');
  };

  const mode = TRAVEL_MODES.find(m => m.key === travelMode)!;

  return (
    <div className="flex h-[calc(100vh-80px)] lg:h-[calc(100vh-40px)] overflow-hidden rounded-2xl border border-border bg-background relative">

      {/* ── LEFT PANEL (Desktop + Mobile) ──────────────────────────────── */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 380 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="absolute lg:relative z-50 lg:z-20 h-full flex flex-col flex-shrink-0 border-r border-border overflow-hidden bg-background/95 backdrop-blur-xl"
      >
        <div className="w-[380px] flex flex-col h-full relative">
          {/* Mobile close button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 z-50 w-10 h-10 rounded-2xl bg-secondary/80 backdrop-blur-md flex items-center justify-center border border-border text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
          
          <AnimatePresence mode="wait">
            {view === 'feed' ? (
              <motion.div
                key="feed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                {/* Header */}
                <div className="p-5 border-b border-border space-y-4 flex-shrink-0 bg-background/80 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative group">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                      <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search Zamalek, Jazz, AI..."
                        className="w-full pl-10 pr-8 py-3 rounded-2xl bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                      />
                      {search && (
                        <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setLiveMode(l => !l)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold border transition-all flex-shrink-0",
                        liveMode
                          ? "bg-red-500/10 border-red-500/40 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                          : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full", liveMode ? "bg-red-500 animate-pulse" : "bg-muted-foreground")} />
                      Live
                    </button>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
                    {FILTERS.map(f => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={cn(
                          "flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap",
                          activeFilter === f
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                            : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Discovery Layer */}
                <div className="px-5 pt-5 flex-shrink-0">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden group"
                  >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
                    <div className="flex items-start gap-3.5 relative z-10">
                      <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                        <Sparkles className="w-5 h-5 text-primary fill-primary/20" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-black text-primary uppercase tracking-[0.1em]">AI Assistant</span>
                          <span className="w-1 h-1 rounded-full bg-primary/40" />
                          <span className="text-[11px] font-bold text-muted-foreground">Nearby Recommendation</span>
                        </div>
                        <p className="text-[13px] text-foreground font-bold leading-tight">
                          {nearMeInsight}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Scrollable Feed */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 custom-scrollbar overscroll-contain">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Nearby Experiences</h3>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{enriched.length} found</span>
                  </div>
                  
                  {enriched.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                      <div className="w-20 h-20 rounded-[2.5rem] bg-secondary flex items-center justify-center mb-6">
                        <MapPin className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground">No events found here</p>
                      <button onClick={() => { setSearch(''); setActiveFilter('All'); }} className="mt-4 text-xs text-primary font-bold hover:underline">
                        Clear Filters
                      </button>
                    </div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      {enriched.map(ev => {
                        const isSelected = selectedEvent?.id === ev.id;
                        const eta = formatTravelTime(ev.distKm, mode.mps, travelMode);
                        return (
                          <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={ev.id}
                            onClick={() => flyToEvent(ev)}
                            className={cn(
                              "group relative rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-500 border p-1",
                              isSelected
                                ? "bg-primary/5 border-primary/40 shadow-2xl shadow-primary/10 ring-1 ring-primary/20"
                                : "bg-card border-border hover:border-primary/30 hover:shadow-xl hover:translate-y-[-2px]"
                            )}
                          >
                            <div className="relative h-40 rounded-[1.75rem] overflow-hidden">
                              <img src={ev.image} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
                              
                              <div className="absolute top-3 left-3 flex gap-2">
                                <span className="px-3 py-1.5 rounded-xl text-[10px] font-black text-white backdrop-blur-md border border-white/20 shadow-xl" style={{ background: categoryColor(ev.category) }}>
                                  {ev.category.toUpperCase()}
                                </span>
                              </div>

                              <button
                                onClick={e => { e.stopPropagation(); toggleBookmark(ev.id); }}
                                className="absolute top-3 right-3 w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/60 transition-all active:scale-90"
                              >
                                <Heart className={cn("w-4.5 h-4.5", bookmarkedEvents.includes(ev.id) ? "fill-red-500 text-red-500" : "text-white")} />
                              </button>

                              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                {ev.distKm !== null && (
                                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-[10px] font-black border border-white/20 shadow-2xl">
                                    <ModeIcon k={travelMode} />
                                    {ev.distKm.toFixed(1)}KM · {eta.toUpperCase()}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="p-4 pt-3">
                              <div className="flex justify-between items-start gap-2 mb-2">
                                <h4 className="text-[15px] font-black text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                  {ev.title}
                                </h4>
                                <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground whitespace-nowrap bg-secondary/50 px-2 py-0.5 rounded-lg">
                                  <Users className="w-3 h-3" />
                                  {ev.rsvpCount}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                <span className="truncate">{ev.location.venue}</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                </div>

                {/* Time Exploration Slider - Desktop Sidebar */}
                <div className="p-5 border-t border-border bg-background/80 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Time Exploration</span>
                    <Clock className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="flex p-1 bg-secondary/50 rounded-2xl border border-border">
                    {TIME_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setTimeRange(opt.value)}
                        className={cn(
                          "flex-1 py-2 text-[10px] font-bold rounded-xl transition-all",
                          timeRange === opt.value
                            ? "bg-background text-primary shadow-sm border border-border"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col h-full bg-background"
              >
                {selectedEvent && (
                  <>
                    <div className="relative h-64 flex-shrink-0">
                      <img src={selectedEvent.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                      <button 
                        onClick={() => setView('feed')}
                        className="absolute top-5 left-5 w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-all"
                      >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                      </button>
                      <div className="absolute bottom-5 left-5 right-5">
                        <span className="px-3 py-1 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
                          {selectedEvent.category}
                        </span>
                        <h2 className="text-2xl font-black text-white leading-tight">{selectedEvent.title}</h2>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-3xl bg-secondary/30 border border-border space-y-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Attendance</p>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="text-lg font-black">{selectedEvent.rsvpCount}</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-3xl bg-secondary/30 border border-border space-y-1">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Price</p>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-orange-500" />
                            <span className="text-lg font-black">{selectedEvent.price === 0 ? 'Free' : `EGP ${selectedEvent.price}`}</span>
                          </div>
                        </div>
                      </div>

                      {/* Details Section */}
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 rounded-3xl bg-secondary/20 border border-border/50">
                          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Location</p>
                            <p className="text-sm font-bold text-foreground truncate">{selectedEvent.location.venue}</p>
                            <p className="text-xs text-muted-foreground truncate">{selectedEvent.location.address}, {selectedEvent.location.city}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-3xl bg-secondary/20 border border-border/50">
                          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Date & Time</p>
                            <p className="text-sm font-bold text-foreground">
                              {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </p>
                            <p className="text-xs text-muted-foreground">Starts at 19:00 (7 PM)</p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                          <Info className="w-4 h-4 text-primary" />
                          About Event
                        </h3>
                        <p className="text-[13px] leading-relaxed text-muted-foreground font-medium">
                          {selectedEvent.description || "Join us for an immersive experience at one of the city's most vibrant venues. Network with peers and enjoy a curated selection of activities."}
                        </p>
                      </div>

                      {/* Transit Options */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-primary" />
                          Transit Access
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {TRAVEL_MODES.slice(0, 4).map(m => (
                            <div key={m.key} className="p-3 rounded-2xl bg-secondary/20 border border-border/50 flex items-center gap-3">
                              <span className="text-lg">{m.iconEmoji}</span>
                              <span className="text-[11px] font-bold">{formatTravelTime(selectedEvent.distKm, m.mps)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-t border-border bg-background/80 backdrop-blur-md flex gap-3 flex-shrink-0">
                      <Link
                        to={`/app/events/${selectedEvent.id}`}
                        className="flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] bg-primary text-white text-xs font-black shadow-xl shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
                      >
                        BOOK NOW <ChevronRight className="w-4 h-4" />
                      </Link>
                      <button className="w-14 h-14 rounded-[1.5rem] border border-border flex items-center justify-center hover:bg-secondary transition-all active:scale-95">
                        <Share2 className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* ── MAP CANVAS ──────────────────────────────────────────────────── */}
      <main className="flex-1 relative overflow-hidden">
        {/* Map Container */}
        <div ref={mapDivRef} className="w-full h-full z-0" />

        {/* Mobile Search & Filters Overlay */}
        <div className="lg:hidden absolute top-4 left-4 right-4 z-[1000] space-y-3 pointer-events-none">
          <div className="relative pointer-events-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Discover events..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-background/90 backdrop-blur-xl border border-border text-sm shadow-2xl shadow-black/10 focus:outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar pointer-events-auto">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border shadow-xl transition-all",
                  activeFilter === f
                    ? "bg-primary border-primary text-white"
                    : "bg-background/90 backdrop-blur-xl border-border text-muted-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Controls Overlay */}
        <div className="absolute right-5 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-3">
          <button
            onClick={() => setIsSidebarOpen(s => !s)}
            className="w-12 h-12 rounded-2xl bg-background/90 backdrop-blur-xl border border-border shadow-2xl items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all group flex"
            title={isSidebarOpen ? 'Hide Panel' : 'Show Panel'}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />}
          </button>
          
          <div className="h-px w-8 bg-border/50 mx-auto" />

          {[
            { icon: <LocateFixed className="w-5 h-5" />, action: locateMe, title: 'My Location' },
            { icon: <ZoomIn className="w-5 h-5" />, action: () => mapRef.current?.zoomIn(), title: 'Zoom In' },
            { icon: <ZoomOut className="w-5 h-5" />, action: () => mapRef.current?.zoomOut(), title: 'Zoom Out' },
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className="w-12 h-12 rounded-2xl bg-background/90 backdrop-blur-xl border border-border shadow-2xl flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all active:scale-95"
              title={btn.title}
            >
              {btn.icon}
            </button>
          ))}
        </div>

        {/* Travel Mode Switcher - Glassmorphism Floating */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] flex gap-1 p-1.5 rounded-[2rem] bg-background/80 backdrop-blur-2xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
          {(['walk', 'car', 'bike', 'transit', 'taxi'] as TravelKey[]).map((k) => (
            <button
              key={k}
              onClick={() => setTravelMode(k)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black transition-all",
                travelMode === k
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <ModeIcon k={k} />
              <span className="hidden sm:inline uppercase tracking-widest text-[10px]">
                {k === 'transit' ? 'Bus' : k}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Event Preview Overlay */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.9, x: '-50%' }}
              animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
              exit={{ opacity: 0, y: 100, scale: 0.9, x: '-50%' }}
              className="absolute bottom-24 lg:bottom-24 left-1/2 z-[1001] w-[340px] max-w-[calc(100vw-40px)]"
            >
              <div className="bg-background/90 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="relative h-44">
                  <img src={selectedEvent.image} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div className="space-y-1">
                      <span className="px-3 py-1 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                        {selectedEvent.category}
                      </span>
                      <h3 className="text-lg font-black text-white leading-tight drop-shadow-lg">{selectedEvent.title}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {selectedEvent.location.venue}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5" />
                      {selectedEvent.rsvpCount} GOING
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Link
                      to={`/app/events/${selectedEvent.id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[1.25rem] bg-primary text-white text-xs font-black shadow-xl shadow-primary/20 hover:opacity-90 transition-opacity"
                    >
                      GET TICKETS <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <a
                      href={mapsUrl(selectedEvent.location.lat, selectedEvent.location.lng, mode.googleMode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 rounded-[1.25rem] border border-border bg-secondary/30 flex items-center justify-center hover:bg-secondary transition-colors group"
                    >
                      <Navigation className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
