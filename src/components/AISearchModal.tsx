import { useState } from 'react';
import { X, Send, Sparkles, TrendingUp, Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const suggestedPrompts = [
  "Find jazz concerts this weekend in Cairo",
  "Show me free tech events near me",
  "Art exhibitions happening this month",
  "Family-friendly events under 100 EGP",
];

const mockAIResults = [
  {
    id: 'event-001',
    title: 'Cairo Jazz Night',
    category: 'Music',
    date: '2026-05-15T19:00:00',
    location: 'Cairo Opera House',
    price: 250,
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600',
    matchScore: 95,
    reason: 'Matches your love for jazz and music events'
  },
  {
    id: 'event-002',
    title: 'Live Jazz at Sequoia',
    category: 'Music',
    date: '2026-05-16T20:00:00',
    location: 'Sequoia - Zamalek',
    price: 150,
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600',
    matchScore: 88,
    reason: 'Perfect for weekend entertainment'
  },
  {
    id: 'event-003',
    title: 'Smooth Jazz Brunch',
    category: 'Music',
    date: '2026-05-17T12:00:00',
    location: 'Four Seasons',
    price: 400,
    image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600',
    matchScore: 82,
    reason: 'Premium jazz experience with dining'
  },
];

export default function AISearchModal({ isOpen, onClose }: AISearchModalProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState(mockAIResults);

  if (!isOpen) return null;

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setIsSearching(true);
    setHasSearched(false);

    // Simulate AI processing
    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl bg-card rounded-3xl shadow-2xl border border-border max-h-[85vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6C4CF1] to-[#00C2FF] rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">AI Event Search</h2>
                <p className="text-sm text-muted-foreground">Ask me anything about events</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-secondary transition"
            >
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try 'jazz concerts this weekend' or 'free tech events'..."
              className="w-full pl-6 pr-14 py-4 bg-background border border-border rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground text-lg"
              autoFocus
            />
            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-[#6C4CF1] to-[#5739D4] text-white rounded-xl hover:shadow-lg transition disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!hasSearched && !isSearching && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Try asking:</h3>
              <div className="grid md:grid-cols-2 gap-3 mb-8">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(prompt)}
                    className="p-4 bg-secondary hover:bg-secondary/80 border border-border rounded-xl text-left transition group"
                  >
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground group-hover:text-primary transition">{prompt}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-6">
                <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  How AI Search Works
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Our AI understands natural language and finds events based on your preferences, location, budget, and interests.
                </p>
                <div className="grid md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Date & time parsing</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Location matching</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span>Budget filtering</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Interest matching</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isSearching && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-[#6C4CF1] to-[#00C2FF] rounded-2xl flex items-center justify-center mb-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">AI is thinking...</h3>
              <p className="text-muted-foreground">Analyzing your request and finding the best matches</p>
            </div>
          )}

          {hasSearched && !isSearching && (
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-foreground">AI Found {results.length} Perfect Matches</h3>
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>Powered by AI</span>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  Based on: <span className="font-semibold text-foreground">"{query}"</span>
                </p>
              </div>

              <div className="space-y-4">
                {results.map((event) => (
                  <Link
                    key={event.id}
                    to={`/app/events/${event.id}`}
                    onClick={onClose}
                    className="block group"
                  >
                    <div className="flex gap-4 p-4 bg-card border-2 border-border hover:border-primary rounded-2xl transition-all hover:shadow-lg">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-32 h-32 object-cover rounded-xl flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition line-clamp-1">
                              {event.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 text-right flex-shrink-0">
                            <div className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-xs font-bold mb-1">
                              {event.matchScore}% Match
                            </div>
                            <div className="text-lg font-bold text-foreground">
                              {event.price === 0 ? 'Free' : `${event.price} EGP`}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg">
                          <Sparkles className="w-4 h-4 text-primary flex-shrink-0" />
                          <p className="text-sm text-primary font-medium">{event.reason}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setQuery('');
                    setHasSearched(false);
                  }}
                  className="text-primary hover:text-primary/80 font-semibold text-sm"
                >
                  Try another search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
