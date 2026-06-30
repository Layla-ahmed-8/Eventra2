import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  MapPin,
  Clock,
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
import { getRecommendations } from '../../lib/recommendationEngine';

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

function isEventThisWeekend(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 5 || day === 6 || day === 0;
}

export default function Discover() {
  const { events, bookmarkedEvents, toggleBookmark, recordBrowse, currentUser, locationEnabled, userCoordinates, interests, rsvpedEvents, systemConfig } = useAppStore();
  const aiEnabled = systemConfig.aiRecommendationsEnabled;

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
  const [showThisWeekend, setShowThisWeekend] = useState(false);
  const [showTrending, setShowTrending] = useState(false);
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all');
  const [sortBy, setSortBy] = useState<SortMode>('recommended');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [drawerSections, setDrawerSections] = useState<Record<string, boolean>>({
    categories: true,
    tags: false,
    dateTime: false,
    budget: false,
    eventType: false,
    social: false,
    ai: false,
  });
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

  const scoreMap = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' =
      hour >= 5 && hour < 12 ? 'morning' : hour >= 12 && hour < 17 ? 'afternoon' : hour >= 17 && hour < 21 ? 'evening' : 'night';
    const result = getRecommendations({
      user: {
        id: currentUser?.id ?? 'guest',
        name: currentUser?.name,
        profile: {
          interests: interests,
          preferredCategories: interests,
          preferredTimeOfDay: 'any',
          maxDistanceKm: userRadius,
          pricePreference: 'any',
        },
        history: rsvpedEvents.map((eid) => {
          const ev = events.find((e) => e.id === eid);
          return { eventId: eid, category: ev?.category ?? '', attendedAt: ev?.date ?? now.toISOString(), rating: null };
        }),
        social: { friendsAttending: [] },
      },
      context: {
        currentLocation: userCoordinates,
        currentTime: now.toISOString(),
        dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
        timeOfDay,
      },
      events: events.map((e) => ({
        id: e.id,
        title: e.title,
        category: e.category,
        date: e.date,
        startTime: new Date(e.date).toTimeString().slice(0, 5),
        endTime: '',
        price: e.price === 0 ? null : e.price,
        location: { lat: e.location.lat, lng: e.location.lng, venue: e.location.venue },
        capacity: e.capacity,
        spotsRemaining: e.capacity - e.rsvpCount,
        tags: e.tags,
      })),
    });
    return new Map(result.recommendations.map((r) => [r.eventId, r]));
  }, [currentUser, interests, userCoordinates, userRadius, rsvpedEvents, events]);

  const trending = useMemo(() => [...enrichedEvents].sort((a, b) => b.rsvpCount - a.rsvpCount).slice(0, 4), [enrichedEvents]);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const trendingIds = new Set(trending.map((event) => event.id));

    const base = enrichedEvents.filter((event) => {
      const matchesSearch = !query || event.searchBlob.includes(query);
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);
      const matchesTag = selectedTags.length === 0 || selectedTags.some((tag) => event.tags.some((eventTag) => eventTag.toLowerCase().includes(tag.toLowerCase())));
      const matchesPrice = event.price <= maxPrice;
      const matchesRecommended = !showOnlyRecommended || event.isRecommended;
      const matchesNearMe = !showNearMeOnly || event.isNearMe;
      const matchesThisWeekend = !showThisWeekend || isEventThisWeekend(event.date);
      const matchesTrending = !showTrending || trendingIds.has(event.id);
      const matchesMode =
        modeFilter === 'all' ||
        (modeFilter === 'virtual' && event.location.isVirtual) ||
        (modeFilter === 'in-person' && !event.location.isVirtual);

      return matchesSearch && matchesCategory && matchesTag && matchesPrice && matchesRecommended && matchesNearMe && matchesThisWeekend && matchesTrending && matchesMode;
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
        default: {
          const aScore = scoreMap.get(a.id)?.score ?? 0;
          const bScore = scoreMap.get(b.id)?.score ?? 0;
          if (aScore !== bScore) return bScore - aScore;
          return b.rsvpCount - a.rsvpCount;
        }
      }
    });
  }, [enrichedEvents, interests, maxPrice, modeFilter, searchQuery, selectedCategories, selectedTags, showNearMeOnly, showOnlyRecommended, showThisWeekend, showTrending, sortBy, trending]);

  useKeyboardShortcuts({
    j: () => setFocusedIndex((i) => Math.min(i + 1, filteredEvents.length - 1)),
    k: () => setFocusedIndex((i) => Math.max(i - 1, 0)),
  });

  const recommended = useMemo(() => {
    return [...enrichedEvents]
      .sort((a, b) => (scoreMap.get(b.id)?.score ?? 0) - (scoreMap.get(a.id)?.score ?? 0))
      .filter((e) => (scoreMap.get(e.id)?.topPick) ?? e.isRecommended)
      .slice(0, 4);
  }, [enrichedEvents, scoreMap]);
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
    showThisWeekend,
    showTrending,
    modeFilter !== 'all',
    sortBy !== 'recommended',
  ].filter(Boolean).length;

  const visibleTags = Array.from(new Set(events.flatMap((event) => event.tags))).slice(0, 12);
  const trendingTags = Array.from(new Set(trending.flatMap((event) => event.tags))).slice(0, 8);

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
        <div className="space-y-4 rounded-[3rem] bg-background/90 p-5 md:p-7 shadow-2xl border border-border/40 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-caption font-bold uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                AI Powered Discovery
              </div>
              <div>
                <h1 className="text-display font-bold text-foreground leading-[1.05] max-w-3xl">
                  Find your next experience with <span className="gradient-text">smarter</span> search.
                </h1>
                <p className="text-body-lg text-muted-foreground max-w-2xl">
                  Search by venue, vibe, or interests, then refine with emotional, community-driven filters.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="btn-primary px-6 py-3 h-auto text-body font-bold rounded-2xl shadow-lg shadow-primary/10"
                onClick={() => setShowAISearch(true)}
              >
                <Sparkles className="w-5 h-5" />
                Try AI Search
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-2xl bg-secondary/80 px-5 py-3 text-body font-bold text-foreground border border-border/50"
                onClick={() => setShowFilterDrawer(true)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && <span className="ml-2 rounded-full bg-primary text-white text-[11px] font-black px-2 py-0.5">{activeFilterCount}</span>}
              </button>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find rooftop jazz events tonight"
              className="input-base w-full pl-12 pr-4 text-body h-16 rounded-[2rem] border border-border/50 bg-white/90 shadow-sm focus:border-primary/40"
            />
          </div>

          <p className="text-caption text-muted-foreground">Try search examples like “Rooftop jazz tonight”, “Networking conference”, or “Creative workshops this weekend”.</p>

          <div className="flex flex-wrap gap-2">
            {[
              ...(aiEnabled ? [{ label: 'AI Picks', value: showOnlyRecommended, action: () => setShowOnlyRecommended((prev) => !prev), icon: Sparkles }] : []),
              { label: 'Near me', value: showNearMeOnly, action: () => setShowNearMeOnly((prev) => !prev), icon: Compass, disabled: !locationEnabled },
              { label: 'This weekend', value: showThisWeekend, action: () => setShowThisWeekend((prev) => !prev), icon: Calendar },
              { label: 'Trending', value: showTrending, action: () => setShowTrending((prev) => !prev), icon: TrendingUp },
            ].map((chip) => {
              const Icon = chip.icon;
              return (
                <button
                  key={chip.label}
                  onClick={chip.action}
                  disabled={chip.disabled}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all ${chip.value ? 'bg-primary/10 border-primary/20 text-primary shadow-sm' : 'bg-white/80 border-border/50 text-muted-foreground hover:bg-secondary/70'} ${chip.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Icon className="w-4 h-4" />
                  {chip.label}
                </button>
              );
            })}
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-[2rem] bg-white/90 border border-border/50 p-3 shadow-sm">
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-bold">Active filters</span>
              {searchQuery && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Search: {searchQuery}</span>}
              {selectedCategories.map((category) => (
                <span key={category} className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-foreground">{category}</span>
              ))}
              {selectedTags.map((tag) => (
                <span key={tag} className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-foreground">#{tag}</span>
              ))}
              {showOnlyRecommended && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">AI Picks</span>}
              {showNearMeOnly && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Near me</span>}
              {showThisWeekend && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">This weekend</span>}
              {showTrending && <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Trending</span>}
              {modeFilter !== 'all' && <span className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-foreground">{modeFilter}</span>}
              {maxPrice < 10000 && <span className="rounded-full bg-secondary/80 px-3 py-1 text-xs font-semibold text-foreground">Under EGP {maxPrice.toLocaleString()}</span>}
              <button onClick={clearAllFilters} className="ml-auto text-xs font-bold text-primary underline underline-offset-4">Clear all</button>
            </div>
          )}
        </div>

        {showFilterDrawer && (
          <>
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm opacity-100" />
            <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6 sm:items-center sm:py-10">
              <div className="w-full max-w-3xl rounded-[2rem] border border-border/60 bg-background/95 shadow-2xl p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.24em] text-muted-foreground">Advanced filters</p>
                    <h2 className="text-2xl font-bold text-foreground">Refine event discovery</h2>
                  </div>
                  <button type="button" onClick={() => setShowFilterDrawer(false)} className="btn-ghost rounded-full p-3">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  {[
                    {
                      key: 'categories',
                      title: 'Categories',
                      description: 'Select event categories that match your current mood.',
                      content: (
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                            <button
                              key={category}
                              onClick={() => toggleCategory(category)}
                              className={`filter-chip ${selectedCategories.includes(category) ? 'active' : 'inactive'}`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      ),
                    },
                    {
                      key: 'tags',
                      title: 'Mood tags',
                      description: 'Narrow events by trending themes, hobbies, and vibes.',
                      content: (
                        <div className="flex flex-wrap gap-2">
                          {trendingTags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => toggleTag(tag)}
                              className={`filter-chip ${selectedTags.includes(tag) ? 'active' : 'inactive'} text-[12px]`}
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      ),
                    },

                    {
                      key: 'budget',
                      title: 'Budget',
                      description: 'Filter by maximum ticket price and keep recommendations within budget.',
                      content: (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-caption text-muted-foreground">Up to</span>
                            <span className="text-foreground font-bold">EGP</span>
                            <input
                              type="number"
                              min="0"
                              max="10000"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(Number(e.target.value))}
                              className="input-base flex-1 px-4 py-2 rounded-2xl border border-border/50 bg-white/90 shadow-sm focus:border-primary/40"
                            />
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: 'mode',
                      title: 'Event mode',
                      description: 'Choose virtual, in-person, or all experiences.',
                      content: (
                        <div className="grid grid-cols-3 gap-2">
                          {(['all', 'virtual', 'in-person'] as const).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setModeFilter(mode)}
                              className={`px-3 py-2 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all border ${
                                modeFilter === mode ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      ),
                    },
                    {
                      key: 'social',
                      title: 'Momentum & timing',
                      description: 'Surface the most active and upcoming experiences first.',
                      content: (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setShowThisWeekend((prev) => !prev)}
                            className={`filter-chip ${showThisWeekend ? 'active' : 'inactive'}`}
                          >
                            This weekend
                          </button>
                          <button
                            onClick={() => setShowTrending((prev) => !prev)}
                            className={`filter-chip ${showTrending ? 'active' : 'inactive'}`}
                          >
                            Trending
                          </button>
                          <button
                            onClick={() => setShowOnlyRecommended((prev) => !prev)}
                            className={`filter-chip ${showOnlyRecommended ? 'active' : 'inactive'}`}
                          >
                            AI Picks
                          </button>
                        </div>
                      ),
                    },
                  ].map(({ key, title, description, content }) => (
                    <div key={key} className="rounded-3xl border border-border/50 bg-background/80 p-4">
                      <button
                        type="button"
                        onClick={() => setDrawerSections((prev) => ({ ...prev, [key]: !prev[key] }))}
                        className="w-full flex items-center justify-between gap-4 text-left"
                      >
                        <div>
                          <p className="text-sm font-bold text-foreground">{title}</p>
                          <p className="text-caption text-muted-foreground mt-1">{description}</p>
                        </div>
                        <span className="text-primary font-bold">{drawerSections[key] ? '–' : '+'}</span>
                      </button>
                      {drawerSections[key] && <div className="mt-4">{content}</div>}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 justify-end">
                  <button type="button" onClick={clearAllFilters} className="btn-ghost rounded-2xl px-5 py-3">
                    Clear filters
                  </button>
                  <button type="button" onClick={() => setShowFilterDrawer(false)} className="btn-primary rounded-2xl px-5 py-3">
                    Apply filters
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {interests.length === 0 && (
          <div className="surface-panel p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-body-sm font-bold text-foreground">Personalize your feed</p>
                <p className="text-caption text-muted-foreground">Pick your interests to unlock AI-powered event recommendations.</p>
              </div>
            </div>
            <Link to="/onboarding" className="btn-primary px-5 py-2 h-auto text-body-sm font-bold whitespace-nowrap">
              Complete Setup
            </Link>
          </div>
        )}

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
                  <EventCard
                    event={event}
                    bookmarkedEvents={bookmarkedEvents}
                    toggleBookmark={toggleBookmark}
                    distanceKm={event.distanceKm}
                    aiReason={scoreMap.get(event.id)?.reason ?? null}
                    aiScore={scoreMap.get(event.id)?.score ?? null}
                  />
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
                  aiReason={scoreMap.get(event.id)?.reason ?? null}
                  aiScore={scoreMap.get(event.id)?.score ?? null}
                />
              ))}
            </div>
          </div>
        )}

        {!searchQuery && selectedCategories.length === 0 && selectedTags.length === 0 && !showOnlyRecommended && !showNearMeOnly && modeFilter === 'all' && maxPrice === 10000 && aiEnabled && recommended.length > 0 && (
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
                <EventCard
                  key={event.id}
                  event={event}
                  bookmarkedEvents={bookmarkedEvents}
                  toggleBookmark={toggleBookmark}
                  distanceKm={event.distanceKm}
                  aiReason={scoreMap.get(event.id)?.reason ?? null}
                  aiScore={scoreMap.get(event.id)?.score ?? null}
                />
              ))}
            </div>
          </div>
        )}

        {!searchQuery && selectedCategories.length === 0 && selectedTags.length === 0 && !showOnlyRecommended && !showNearMeOnly && modeFilter === 'all' && maxPrice === 10000 && trending.length > 0 && (
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
                <EventCard
                  key={event.id}
                  event={event}
                  bookmarkedEvents={bookmarkedEvents}
                  toggleBookmark={toggleBookmark}
                  distanceKm={event.distanceKm}
                  aiReason={scoreMap.get(event.id)?.reason ?? null}
                  aiScore={null}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function EventCard({ event, bookmarkedEvents, toggleBookmark, distanceKm, aiReason, aiScore }: any) {
  const aiEnabled = useAppStore((s) => s.systemConfig.aiRecommendationsEnabled);
  const isBookmarked = bookmarkedEvents.includes(event.id);
  const isTopPick = aiEnabled && aiScore !== null && aiScore >= 55;

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

          {isTopPick && (
            <div className="absolute bottom-4 left-4">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xl animate-pulse-slow">
                <Sparkles className="w-3 h-3" />
                AI Pick
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/app/events/${event.id}`}>
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h3>
        </Link>

        {aiReason && isTopPick && (
          <p className="text-[11px] text-primary font-semibold mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 flex-shrink-0" />
            {aiReason}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {isTopPick && <span className="filter-chip active text-[11px]">AI Pick</span>}
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
          {event.schedule?.length ? (
            <div className="flex items-center gap-2 text-caption text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span className="truncate font-semibold">{event.schedule[0].time} — {event.schedule[0].title}</span>
            </div>
          ) : null}
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
