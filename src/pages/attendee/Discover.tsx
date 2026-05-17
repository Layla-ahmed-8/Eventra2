import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  MapPin,
  Heart,
  Sparkles,
  TrendingUp,
  Compass,
  SlidersHorizontal,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { categories } from '../../data/mockData';
import AISearchModal from '../../components/AISearchModal';
import { Skeleton } from '../../app/components/ui/skeleton';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

type SortMode = 'recommended' | 'nearest' | 'popular' | 'price-low' | 'price-high';
type ModeFilter = 'all' | 'virtual' | 'in-person';

type EnrichedEvent = {
  distanceKm: number | null;
  isNearMe: boolean;
  searchBlob: string;
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  location: {
    venue: string;
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
    isVirtual: boolean;
    virtualLink: string | null;
  };
  organizer: { name: string };
  price: number;
  tags: string[];
  isRecommended: boolean;
  rsvpCount: number;
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const earthRadiusKm = 6371;
  const latDelta = ((lat2 - lat1) * Math.PI) / 180;
  const lngDelta = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(lngDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function enrichEvent(event: any, userRadius: number, currentCity: string | null, userCoordinates: { lat: number; lng: number } | null): EnrichedEvent {
  const distanceKm =
    userCoordinates && event.location.lat && event.location.lng
      ? haversineKm(userCoordinates.lat, userCoordinates.lng, event.location.lat, event.location.lng)
      : null;
  const sameCity = currentCity ? event.location.city.toLowerCase() === currentCity : false;

  return {
    ...event,
    distanceKm,
    isNearMe: Boolean(distanceKm !== null ? distanceKm <= userRadius : sameCity || event.location.isVirtual),
    searchBlob: [
      event.title,
      event.description,
      event.category,
      event.organizer.name,
      event.location.venue,
      event.location.city,
      event.tags.join(' '),
    ].join(' ').toLowerCase(),
  };
}

export default function Discover() {
  const { events, bookmarkedEvents, toggleBookmark, recordBrowse, currentUser, locationEnabled, userCoordinates } = useAppStore();

  useEffect(() => {
    recordBrowse();
  }, [recordBrowse]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAISearch, setShowAISearch] = useState(false);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showOnlyRecommended, setShowOnlyRecommended] = useState(false);
  const [showNearMeOnly, setShowNearMeOnly] = useState(false);
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all');
  const [sortBy, setSortBy] = useState<SortMode>('recommended');
  const [isLoading, setIsLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timeoutId);
  }, []);

  const currentCity = currentUser?.location?.split(',')[0]?.trim().toLowerCase() ?? null;
  const userRadius = currentUser?.radius ?? 25;

  const enrichedEvents = useMemo<EnrichedEvent[]>(() => {
    return events.map((event) => enrichEvent(event, userRadius, currentCity, userCoordinates));
  }, [events, currentCity, userCoordinates, userRadius]);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const base = enrichedEvents.filter((event) => {
      const matchesSearch = !query || event.searchBlob.includes(query);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);
      const matchesTag = selectedTags.length === 0 || selectedTags.some((tag) => event.tags.some((eventTag) => eventTag.toLowerCase().includes(tag.toLowerCase())));
      const matchesPrice = event.price <= maxPrice;
      const matchesRecommended = !showOnlyRecommended || event.isRecommended;
      const matchesNearMe = !showNearMeOnly || event.isNearMe;
      const matchesMode =
        modeFilter === 'all' ||
        (modeFilter === 'virtual' && event.location.isVirtual) ||
        (modeFilter === 'in-person' && !event.location.isVirtual);

      return matchesSearch && matchesCategory && matchesTag && matchesPrice && matchesRecommended && matchesNearMe && matchesMode;
    });

    return base.sort((a, b) => {
      switch (sortBy) {
        case 'nearest': {
          const aDistance = a.distanceKm ?? Number.POSITIVE_INFINITY;
          const bDistance = b.distanceKm ?? Number.POSITIVE_INFINITY;
          if (aDistance !== bDistance) return aDistance - bDistance;
          return b.rsvpCount - a.rsvpCount;
        }
        case 'popular':
          return b.rsvpCount - a.rsvpCount;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'recommended':
        default:
          if (a.isRecommended !== b.isRecommended) return a.isRecommended ? -1 : 1;
          if (a.distanceKm !== null && b.distanceKm !== null && a.distanceKm !== b.distanceKm) {
            return a.distanceKm - b.distanceKm;
          }
          return b.rsvpCount - a.rsvpCount;
      }
    });
  }, [enrichedEvents, maxPrice, modeFilter, searchQuery, selectedCategories, selectedTags, showNearMeOnly, showOnlyRecommended, sortBy]);

  useKeyboardShortcuts({
    j: () => setFocusedIndex((i) => Math.min(i + 1, filteredEvents.length - 1)),
    k: () => setFocusedIndex((i) => Math.max(i - 1, 0)),
  });

  const recommended = useMemo(() => enrichedEvents.filter((event) => event.isRecommended).slice(0, 4), [enrichedEvents]);
  const trending = useMemo(() => [...enrichedEvents].sort((a, b) => b.rsvpCount - a.rsvpCount).slice(0, 4), [enrichedEvents]);
  const nearby = useMemo(
    () =>
      [...enrichedEvents]
        .filter((event) => event.isNearMe)
        .sort((a, b) => (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY))
        .slice(0, 4),
    [enrichedEvents]
  );

  const activeFilterCount = [
    searchQuery.trim(),
    selectedCategories.length > 0,
    selectedTags.length > 0,
    maxPrice < 10000,
    showOnlyRecommended,
    showNearMeOnly,
    modeFilter !== 'all',
    sortBy !== 'recommended',
  ].filter(Boolean).length;

  const visibleTags = Array.from(new Set(events.flatMap((event) => event.tags))).slice(0, 12);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedTags([]);
    setMaxPrice(10000);
    setShowOnlyRecommended(false);
    setShowNearMeOnly(false);
    setModeFilter('all');
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen">
      <AISearchModal isOpen={showAISearch} onClose={() => setShowAISearch(false)} />

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="hero-surface p-5 md:p-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr] items-start">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-body-sm font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                AI Powered Discovery
              </div>
              <div className="space-y-3 max-w-3xl">
                <h1 className="text-display font-bold text-foreground leading-[1.05]">
                  Find your next experience with <span className="gradient-text">smarter</span> search and filters.
                </h1>
                <p className="text-body-lg text-muted-foreground max-w-2xl">
                  Search by title, organizer, venue, tag, or city, then refine by category, format, budget, and proximity.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => setShowAISearch(true)} className="btn-primary px-7 py-3 h-auto text-body font-bold">
                  <Sparkles className="w-5 h-5" />
                  Try AI Search
                </button>
                <button
                  type="button"
                  className="btn-secondary px-7 py-3 h-auto text-body font-bold"
                  onClick={() => document.getElementById('discover-event-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  Browse Events
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="kpi-card !p-4">
                  <span className="kpi-label">Live results</span>
                  <div className="kpi-value">{filteredEvents.length}</div>
                </div>
                <div className="kpi-card !p-4">
                  <span className="kpi-label">Nearby</span>
                  <div className="kpi-value">{nearby.length}</div>
                </div>
                <div className="kpi-card !p-4">
                  <span className="kpi-label">Recommended</span>
                  <div className="kpi-value">{recommended.length}</div>
                </div>
                <div className="kpi-card !p-4">
                  <span className="kpi-label">Active filters</span>
                  <div className="kpi-value">{activeFilterCount}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-border/60 bg-background/70 p-5 md:p-6 shadow-lg backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-caption font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    <SlidersHorizontal className="w-4 h-4" />
                    Smart Search
                  </div>
                  <p className="text-body-sm text-muted-foreground mt-1">Compact, fast, and easy to scan.</p>
                </div>
                <button onClick={clearAllFilters} className={`filter-chip ${activeFilterCount > 0 ? 'active' : 'inactive'} inline-flex items-center gap-2`}>
                  <X className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>

              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search title, organizer, venue, city, or tags..."
                  className="input-base w-full pl-12 pr-4 text-body h-14"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowOnlyRecommended((prev) => !prev)}
                  className={`filter-chip ${showOnlyRecommended ? 'active' : 'inactive'} inline-flex items-center gap-2`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Picks
                </button>
                <button
                  onClick={() => setShowNearMeOnly((prev) => !prev)}
                  className={`filter-chip ${showNearMeOnly ? 'active' : 'inactive'} inline-flex items-center gap-2 ${locationEnabled ? '' : 'opacity-60'}`}
                  disabled={!locationEnabled}
                  title={locationEnabled ? 'Show events within your radius' : 'Enable location to use this filter'}
                >
                  <Compass className="w-3.5 h-3.5" />
                  Near me
                </button>
                <span className="filter-chip inactive inline-flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  {sortBy.replace('-', ' ')}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">Categories</span>
                  {selectedCategories.length > 0 && <span className="text-caption text-muted-foreground">{selectedCategories.length} selected</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <button key={category} onClick={() => toggleCategory(category)} className={`filter-chip ${selectedCategories.includes(category) ? 'active' : 'inactive'}`}>
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">Tags</span>
                  {selectedTags.length > 0 && <span className="text-caption text-muted-foreground">{selectedTags.length} selected</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {visibleTags.slice(0, 8).map((tag) => (
                    <button key={tag} onClick={() => toggleTag(tag)} className={`filter-chip ${selectedTags.includes(tag) ? 'active' : 'inactive'} text-[12px]`}>
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">Budget</span>
                    <span className="text-caption font-bold text-foreground">EGP {maxPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-secondary rounded-full"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 sm:w-[14rem]">
                  {(['all', 'virtual', 'in-person'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setModeFilter(mode)}
                      className={`px-3 py-2 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all border ${
                        modeFilter === mode ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/50 bg-secondary/20 px-4 py-3">
                <div>
                  <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest">Sort</p>
                  <p className="text-body-sm text-muted-foreground">Change ranking by relevance, proximity, popularity, or price.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    ['recommended', 'Best match'],
                    ['nearest', 'Nearest'],
                    ['popular', 'Popular'],
                    ['price-low', 'Price'],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setSortBy(value)}
                      className={`px-3 py-2 rounded-xl text-caption font-bold transition-all border ${
                        sortBy === value ? 'bg-background text-primary shadow-sm border-primary/20' : 'bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-4">
                  <span className="text-caption font-bold text-muted-foreground uppercase tracking-[0.2em]">Active</span>
                  {searchQuery && <span className="filter-chip active">Search: {searchQuery}</span>}
                  {selectedCategories.map((category) => (
                    <span key={category} className="filter-chip active">{category}</span>
                  ))}
                  {selectedTags.map((tag) => (
                    <span key={tag} className="filter-chip active">#{tag}</span>
                  ))}
                  {showOnlyRecommended && <span className="filter-chip active">AI Picks</span>}
                  {showNearMeOnly && <span className="filter-chip active">Near me</span>}
                  {modeFilter !== 'all' && <span className="filter-chip active">{modeFilter}</span>}
                  {maxPrice < 10000 && <span className="filter-chip active">Under EGP {maxPrice.toLocaleString()}</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        <div id="discover-event-grid" className="space-y-8 scroll-mt-24">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border/50 pb-6">
            <div>
              <h2 className="text-h2 font-bold text-foreground">{activeFilterCount > 0 ? 'Search Results' : 'Explore All Events'}</h2>
              <p className="text-body-sm text-muted-foreground mt-1">
                Showing <span className="text-foreground font-bold">{filteredEvents.length}</span> matching experiences
              </p>
            </div>
            <div className="flex items-center gap-3 text-caption font-bold text-muted-foreground uppercase tracking-wider">
              <ArrowUpDown className="w-4 h-4" />
              {sortBy.replace('-', ' ')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="card-surface p-4 space-y-3">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                  <div className="flex gap-2 pt-1">
                    <Skeleton className="h-8 w-20 rounded-full" />
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </div>
                </div>
              ))
            ) : (
              filteredEvents.map((event, index) => (
                <div key={event.id} className={focusedIndex === index ? 'ring-2 ring-primary rounded-3xl' : undefined}>
                  <EventCard event={event} bookmarkedEvents={bookmarkedEvents} toggleBookmark={toggleBookmark} distanceKm={event.distanceKm} />
                </div>
              ))
            )}
          </div>

          {filteredEvents.length === 0 && (
            <div className="bento-section py-20 text-center">
              <div className="w-20 h-20 bg-secondary/50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-h3 font-bold text-foreground mb-2">No matching events found</h3>
              <p className="text-body text-muted-foreground mb-8 max-w-md mx-auto">
                We couldn't find any events matching your current filters. Try expanding your search or clearing filters.
              </p>
              <button onClick={clearAllFilters} className="btn-primary px-8">
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {locationEnabled && nearby.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="icon-box bg-cyan-500/10 text-cyan-500">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-h2 font-bold text-foreground">Events Near You</h2>
                  <p className="text-body-sm text-muted-foreground">Sorted by proximity for attendees around {currentUser?.location ?? 'your area'}.</p>
                </div>
              </div>
              <button className="btn-ghost text-cyan-500 font-bold" onClick={() => setSortBy('nearest')}>
                Nearest first
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nearby.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  bookmarkedEvents={bookmarkedEvents}
                  toggleBookmark={toggleBookmark}
                  distanceKm={event.distanceKm}
                />
              ))}
            </div>
          </div>
        )}

        {!searchQuery && selectedCategories.length === 0 && selectedTags.length === 0 && !showOnlyRecommended && !showNearMeOnly && modeFilter === 'all' && maxPrice === 10000 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="icon-box bg-primary/10 text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-h2 font-bold text-foreground">Recommended for You</h2>
                  <p className="text-body-sm text-muted-foreground">Intelligent picks based on your activity</p>
                </div>
              </div>
              <button className="btn-ghost text-primary font-bold">View All</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommended.map((event) => (
                <EventCard key={event.id} event={event} bookmarkedEvents={bookmarkedEvents} toggleBookmark={toggleBookmark} distanceKm={event.distanceKm} />
              ))}
            </div>
          </div>
        )}

        {!searchQuery && selectedCategories.length === 0 && selectedTags.length === 0 && !showOnlyRecommended && !showNearMeOnly && modeFilter === 'all' && maxPrice === 10000 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="icon-box bg-cyan-500/10 text-cyan-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-h2 font-bold text-foreground">Trending Now</h2>
                  <p className="text-body-sm text-muted-foreground">Most popular events in the community</p>
                </div>
              </div>
              <button className="btn-ghost text-cyan-500 font-bold">Explore Trends</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.map((event) => (
                <EventCard key={event.id} event={event} bookmarkedEvents={bookmarkedEvents} toggleBookmark={toggleBookmark} distanceKm={event.distanceKm} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function EventCard({ event, bookmarkedEvents, toggleBookmark, distanceKm }: any) {
  const isBookmarked = bookmarkedEvents.includes(event.id);

  return (
    <div className="group card-surface overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]">
      <Link to={`/app/events/${event.id}`}>
        <div className="relative h-64 overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />

          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-white/20 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold shadow-lg">
              {event.category}
            </span>
          </div>

          {distanceKm !== null && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1.5 rounded-full bg-cyan-500/95 text-white text-[10px] font-black uppercase tracking-wider shadow-xl">
                {distanceKm.toFixed(1)} km away
              </span>
            </div>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleBookmark(event.id);
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-white/20 dark:border-white/10 flex items-center justify-center transition-all hover:scale-110 shadow-lg group/bookmark"
          >
            <Heart className={`w-5 h-5 transition-colors ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-400 group-hover/bookmark:text-red-400'}`} />
          </button>

          {event.isRecommended && (
            <div className="absolute bottom-4 left-4">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xl animate-pulse-slow">
                <Sparkles className="w-3 h-3" />
                AI Match
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/app/events/${event.id}`}>
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h3>
        </Link>

        <div className="flex flex-wrap gap-2 mb-4">
          {event.isRecommended && <span className="filter-chip active text-[11px]">AI Match</span>}
          {event.location.isVirtual ? (
            <span className="filter-chip inactive text-[11px]">Virtual</span>
          ) : (
            <span className="filter-chip inactive text-[11px]">In person</span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-caption text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-caption text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{event.location.venue}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <img key={i} src={`https://i.pravatar.cc/24?img=${i + 10}`} className="w-6 h-6 rounded-full border-2 border-background" alt="" />
              ))}
            </div>
            <span className="text-[11px] font-bold text-muted-foreground">+{event.rsvpCount} going</span>
          </div>
          <p className="text-lg font-black text-foreground">
            {event.price === 0 ? <span className="text-green-600 dark:text-green-400">FREE</span> : `EGP ${event.price}`}
          </p>
        </div>
      </div>
    </div>
  );
}
