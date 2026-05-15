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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-cyan-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <AISearchModal isOpen={showAISearch} onClose={() => setShowAISearch(false)} />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Search Section */}
        <div className="hero-surface rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAISearch(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                AI Search
              </button>
            </div>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100/60 to-cyan-100/60 dark:from-purple-900/40 dark:to-cyan-900/40 border border-purple-200/30 dark:border-purple-800/30 text-purple-700 dark:text-purple-300 text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                AI powered discovery
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white max-w-3xl leading-tight">
                Find your next experience with <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">smarter</span> event recommendations.
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Discover events tailored to your interests, powered by intelligent search, filters, and AI.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setShowAISearch(true)} className="btn-primary text-lg px-6 py-3">
                  <Sparkles className="w-5 h-5" />
                  AI Search
                </button>
<<<<<<< Updated upstream
                <button className="btn-secondary text-lg px-6 py-3">
=======
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => document.getElementById('discover-event-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
>>>>>>> Stashed changes
                  Browse Events
                </button>
              </div>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-purple-200/20 dark:border-purple-800/20 p-6 shadow-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600 dark:text-purple-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search events by name or category..."
                  className="input-base w-full pl-12 pr-4 text-lg"
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <span>Search anytime</span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">⌘K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-purple-200/20 dark:border-purple-800/20">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            <span className="font-bold text-lg text-slate-900 dark:text-white">Categories:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`filter-chip ${
                  selectedCategories.includes(category) ? 'active' : 'inactive'
                }`}
              >
                {category}
                {selectedCategories.includes(category) && (
                  <X className="inline-block ml-2 w-4 h-4" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <label className="space-y-2">
              <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Max price: EGP {maxPrice}</span>
              <input type="range" min="0" max="10000" step="100" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-purple-600" />
            </label>
            <button
              onClick={() => setShowOnlyRecommended((prev) => !prev)}
              className={`px-4 py-3 rounded-2xl border text-sm font-bold transition-all ${
                showOnlyRecommended ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700' : 'border-purple-200 dark:border-purple-800 text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50'
              }`}
            >
              AI Recommended only
            </button>
            <div className="flex rounded-2xl border border-purple-200 dark:border-purple-800 overflow-hidden bg-white/50 dark:bg-slate-800/50">
              {(['all', 'virtual', 'in-person'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setModeFilter(mode)}
                  className={`flex-1 px-3 py-3 text-sm capitalize font-semibold transition-all ${
                    modeFilter === mode ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300' : 'bg-transparent text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="mt-6 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-bold flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear all filters
            </button>
          )}
        </div>

        {/* Recommended Section */}
        {!searchQuery && selectedCategories.length === 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Recommended for You</h2>
                  <p className="text-slate-600 dark:text-slate-400">Based on your interests and past attendance</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommended.map((event) => (
                <EventCard key={event.id} event={event} bookmarkedEvents={bookmarkedEvents} toggleBookmark={toggleBookmark} />
              ))}
            </div>
          </div>
        )}

        {/* Trending Section */}
        {!searchQuery && selectedCategories.length === 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Trending Events</h2>
                <p className="text-slate-600 dark:text-slate-400">Most popular events this week</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {trending.map((event) => (
                <EventCard key={event.id} event={event} bookmarkedEvents={bookmarkedEvents} toggleBookmark={toggleBookmark} />
              ))}
            </div>
          </div>
        )}

        {/* All Events / Filtered Results */}
        <div id="discover-event-grid" className="mt-16 scroll-mt-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                {searchQuery || selectedCategories.length > 0 ? 'Search Results' : 'All Events'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">{filteredEvents.length} events found</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} bookmarkedEvents={bookmarkedEvents} toggleBookmark={toggleBookmark} />
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="hero-surface rounded-3xl p-16 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Search className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No events found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 text-lg">Try adjusting your filters or search terms</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategories([]);
                  setMaxPrice(10000);
                  setShowOnlyRecommended(false);
                  setModeFilter('all');
                }}
                className="btn-primary"
              >
                Clear Filters
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
          <div className="card-image-overlay"></div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 text-slate-900 dark:text-white text-sm font-semibold shadow-lg">
              {event.category}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleBookmark(event.id);
            }}
            className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
          >
            <Heart
              className={`w-6 h-6 ${
                isBookmarked ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'
              }`}
            />
          </button>
        </div>
      </Link>

      <div className="p-6">
        <Link to={`/app/events/${event.id}`}>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">{
            event.title}</h3>
        </Link>

        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {event.location.venue}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-sm font-semibold">
              {event.rsvpCount} going
            </span>
            {event.isRecommended && (
              <span className="badge-ai">
                <Sparkles className="w-3 h-3" />
                AI Recommended
              </span>
            )}
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">{event.price === 0 ? 'Free' : `EGP ${event.price}`}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {event.tags?.slice(0, 3).map((tag: string, idx: number) => (
            <span key={idx} className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
