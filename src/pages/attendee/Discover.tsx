import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Heart, X, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { categories } from '../../data/mockData';
import AISearchModal from '../../components/AISearchModal';

export default function Discover() {
  const { events, bookmarkedEvents, toggleBookmark } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAISearch, setShowAISearch] = useState(false);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showOnlyRecommended, setShowOnlyRecommended] = useState(false);
  const [modeFilter, setModeFilter] = useState<'all' | 'virtual' | 'in-person'>('all');

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);
    const matchesPrice = event.price <= maxPrice;
    const matchesRecommended = !showOnlyRecommended || event.isRecommended;
    const matchesMode =
      modeFilter === 'all' ||
      (modeFilter === 'virtual' && event.location.isVirtual) ||
      (modeFilter === 'in-person' && !event.location.isVirtual);
    return matchesSearch && matchesCategory && matchesPrice && matchesRecommended && matchesMode;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const recommended = events.filter(e => e.isRecommended).slice(0, 4);
  const trending = [...events].sort((a, b) => b.rsvpCount - a.rsvpCount).slice(0, 4);

  return (
    <div className="min-h-screen">
      <AISearchModal isOpen={showAISearch} onClose={() => setShowAISearch(false)} />
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Search Section */}
        <div className="hero-surface p-8 md:p-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-body-sm font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                AI Powered Discovery
              </div>
              <h1 className="text-display font-bold text-foreground leading-[1.1]">
                Find your next experience with <span className="gradient-text">smarter</span> recommendations.
              </h1>
              <p className="text-body-lg text-muted-foreground max-w-xl">
                Discover events tailored to your unique interests, powered by intelligent search and our custom AI engine.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setShowAISearch(true)} className="btn-primary px-8 py-3.5 h-auto text-body font-bold">
                  <Sparkles className="w-5 h-5" />
                  Try AI Search
                </button>
                <button
                  type="button"
                  className="btn-secondary px-8 py-3.5 h-auto text-body font-bold"
                  onClick={() => document.getElementById('discover-event-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                  Browse Catalog
                </button>
              </div>
            </div>

            <div className="surface-panel p-8 space-y-6">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events, organizers, or topics..."
                  className="input-base w-full pl-12 pr-4 text-body h-14"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">Quick Filters</span>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={() => setSelectedCategories([])}
                      className="text-caption font-bold text-primary hover:text-primary-soft transition-colors"
                    >
                      Reset All
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-4 py-2 rounded-xl text-caption font-bold transition-all border ${
                        selectedCategories.includes(category)
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                          : 'bg-secondary/40 border-border/50 text-muted-foreground hover:bg-secondary/60'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bento-section">
          <div className="grid md:grid-cols-4 gap-8 items-end">
            <div className="md:col-span-1 space-y-3">
              <div className="flex justify-between">
                <label className="text-caption font-bold text-muted-foreground uppercase tracking-widest">Price Range</label>
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

            <div className="md:col-span-1">
              <button
                onClick={() => setShowOnlyRecommended((prev) => !prev)}
                className={`w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border text-body-sm font-bold transition-all ${
                  showOnlyRecommended
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                AI Recommended
              </button>
            </div>

            <div className="md:col-span-2 flex bg-secondary/30 rounded-2xl p-1 border border-border/50">
              {(['all', 'virtual', 'in-person'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setModeFilter(mode)}
                  className={`flex-1 py-2 text-caption font-bold uppercase tracking-wider transition-all rounded-xl ${
                    modeFilter === mode
                      ? 'bg-background text-primary shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Section */}
        {!searchQuery && selectedCategories.length === 0 && (
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
                <EventCard key={event.id} event={event} bookmarkedEvents={bookmarkedEvents} toggleBookmark={toggleBookmark} />
              ))}
            </div>
          </div>
        )}

        {/* Trending Section */}
        {!searchQuery && selectedCategories.length === 0 && (
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
                <EventCard key={event.id} event={event} bookmarkedEvents={bookmarkedEvents} toggleBookmark={toggleBookmark} />
              ))}
            </div>
          </div>
        )}

        {/* All Events / Filtered Results */}
        <div id="discover-event-grid" className="space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between border-b border-border/50 pb-6">
            <div>
              <h2 className="text-h2 font-bold text-foreground">
                {searchQuery || selectedCategories.length > 0 ? 'Search Results' : 'Explore All Events'}
              </h2>
              <p className="text-body-sm text-muted-foreground mt-1">
                Showing <span className="text-foreground font-bold">{filteredEvents.length}</span> matching experiences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} bookmarkedEvents={bookmarkedEvents} toggleBookmark={toggleBookmark} />
            ))}
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
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategories([]);
                  setMaxPrice(10000);
                  setShowOnlyRecommended(false);
                  setModeFilter('all');
                }}
                className="btn-primary px-8"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Event Card Component
function EventCard({ event, bookmarkedEvents, toggleBookmark }: any) {
  const isBookmarked = bookmarkedEvents.includes(event.id);

  return (
    <div className="group card-surface overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]">
      <Link to={`/app/events/${event.id}`}>
        <div className="relative h-64 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-white/20 dark:border-white/10 text-slate-900 dark:text-white text-xs font-bold shadow-lg">
              {event.category}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleBookmark(event.id);
            }}
            className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-white/20 dark:border-white/10 flex items-center justify-center transition-all hover:scale-110 shadow-lg group/bookmark"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isBookmarked ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-400 group-hover/bookmark:text-red-400'
              }`}
            />
          </button>

          {/* AI Recommended Badge */}
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
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
        </Link>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-caption text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {new Date(event.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
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
              {[1, 2, 3].map(i => (
                <img key={i} src={`https://i.pravatar.cc/24?img=${i + 10}`} className="w-6 h-6 rounded-full border-2 border-background" alt="" />
              ))}
            </div>
            <span className="text-[11px] font-bold text-muted-foreground">+{event.rsvpCount} going</span>
          </div>
          <p className="text-lg font-black text-foreground">
            {event.price === 0 ? (
              <span className="text-green-600 dark:text-green-400">FREE</span>
            ) : (
              `EGP ${event.price}`
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

