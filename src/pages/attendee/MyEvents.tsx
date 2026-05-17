import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Heart, XCircle, Star, Search, ArrowUpDown, Sparkles, Clock3, Filter, Bookmark, TicketCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import CancellationCountdown from '../../components/business/CancellationCountdown';
import { DEFAULT_SYSTEM_CONFIG } from '../../constants/config';

export default function MyEvents() {
  const { events, rsvpedEvents, bookmarkedEvents, bookings, cancelBooking, systemConfig, awardXP } = useAppStore();
  type TabKey = 'upcoming' | 'past' | 'bookmarked';
  type SortKey = 'soonest' | 'latest' | 'title';
  const [activeTab, setActiveTab] = useState<TabKey>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('soonest');
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);
  const [cancelQty, setCancelQty] = useState(1);
  const [reviewTarget, setReviewTarget] = useState<string | null>(null);
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewedEvents, setReviewedEvents] = useState<Set<string>>(new Set());
  const windowHours = systemConfig?.cancellationWindowHours ?? DEFAULT_SYSTEM_CONFIG.cancellationWindowHours;

  const currentTime = Date.now();

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    await cancelBooking(cancelTarget);
    setCancelTarget(null);
    setCancelQty(1);
    const refundFails = Math.random() < 0.3;
    if (refundFails) {
      toast.error('Booking cancelled', {
        description: 'Refund processing failed — our team has been notified and will resolve this within 2 business days.',
      });
    } else {
      toast.success('Booking cancelled', {
        description: `Refund for ${cancelQty} ticket${cancelQty > 1 ? 's' : ''} will be processed within 5–10 business days.`,
      });
    }
  };

  const handleReviewSubmit = () => {
    if (reviewStars === 0) {
      toast.error('Please select a star rating before submitting.');
      return;
    }
    setReviewedEvents((prev) => new Set(prev).add(reviewTarget!));
    setReviewTarget(null);
    setReviewStars(0);
    setReviewText('');
    awardXP(20, 'review');
    toast.success('Review submitted! You earned +20 XP.');
  };

  const getBookingForEvent = (eventId: string) =>
    bookings.find((b) => b.eventId === eventId && b.status !== 'cancelled');

  const isWithinCancellationWindow = (eventDate: string) => {
    const deadline = new Date(new Date(eventDate).getTime() - windowHours * 3600 * 1000);
    return currentTime < deadline.getTime();
  };

  const eventById = useMemo(() => new Map(events.map((event) => [event.id, event])), [events]);

  const upcomingEvents = useMemo(
    () => events.filter((event) => rsvpedEvents.includes(event.id) && new Date(event.date).getTime() > currentTime),
    [events, rsvpedEvents, currentTime]
  );
  const pastEvents = useMemo(
    () => events.filter((event) => rsvpedEvents.includes(event.id) && new Date(event.date).getTime() <= currentTime),
    [events, rsvpedEvents, currentTime]
  );
  const savedEvents = useMemo(
    () => events.filter((event) => bookmarkedEvents.includes(event.id)),
    [bookmarkedEvents, events]
  );

  const tabEvents = activeTab === 'upcoming' ? upcomingEvents : activeTab === 'past' ? pastEvents : savedEvents;

  const displayEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const base = tabEvents.filter((event) => {
      if (!query) return true;
      return [event.title, event.category, event.location.venue, event.location.city, event.organizer.name, event.tags.join(' ')].join(' ').toLowerCase().includes(query);
    });

    return [...base].sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'soonest':
        default:
          return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });
  }, [searchQuery, sortBy, tabEvents]);

  const stats = useMemo(() => {
    const cancellable = upcomingEvents.filter((event) => isWithinCancellationWindow(event.date)).length;
    const reviewed = pastEvents.filter((event) => reviewedEvents.has(event.id)).length;
    return {
      upcoming: upcomingEvents.length,
      past: pastEvents.length,
      saved: savedEvents.length,
      cancellable,
      reviewed,
    };
  }, [pastEvents, savedEvents.length, upcomingEvents]);

  const cancelBookingObj = cancelTarget ? bookings.find((b) => b.id === cancelTarget) : null;
  const cancelMaxQty = cancelBookingObj
    ? cancelBookingObj.tickets.reduce((sum, t) => sum + t.qty, 0)
    : 1;

  return (
    <div className="space-y-6">
      <div className="hero-surface p-4 md:p-5 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-body-sm font-bold uppercase tracking-wider">
              <TicketCheck className="w-4 h-4" />
              My Events
            </div>
            <div>
              <h1 className="text-h2 md:text-h1 font-bold text-foreground">Track bookings, saved picks, and your recent activity.</h1>
              <p className="text-body-sm text-muted-foreground mt-1 max-w-2xl">Search your events, sort them, and quickly manage tickets, reviews, and cancellations.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {([
              { key: 'upcoming', label: 'Upcoming', count: stats.upcoming },
              { key: 'past', label: 'Past', count: stats.past },
              { key: 'bookmarked', label: 'Saved', count: stats.saved },
            ] as { key: TabKey; label: string; count: number }[]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`filter-chip ${activeTab === tab.key ? 'active' : 'inactive'}`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {[
            ['Upcoming', stats.upcoming],
            ['Past', stats.past],
            ['Saved', stats.saved],
            ['Cancelable', stats.cancellable],
            ['Reviewed', stats.reviewed],
          ].map(([label, count]) => (
            <div
              key={label}
              className="min-w-[120px] flex-1 rounded-2xl border border-border/70 bg-background/70 backdrop-blur-sm px-3 py-2.5 shadow-sm flex items-center justify-between gap-3"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-none">
                {label}
              </span>
              <span className="text-xl font-black text-foreground leading-none tabular-nums">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bento-section p-4 md:p-5 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative group w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your events..."
              className="input-base w-full pl-12 pr-4 text-body h-12"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {([
              ['soonest', 'Soonest'],
              ['latest', 'Latest'],
              ['title', 'Title'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`filter-chip ${sortBy === key ? 'active' : 'inactive'} inline-flex items-center gap-2`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
            <span className="filter-chip inactive inline-flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" />
              {displayEvents.length} results
            </span>
          </div>
        </div>

        {displayEvents.length === 0 ? (
          <div className="bento-section text-center py-16">
          {activeTab === 'upcoming' && (
            <>
              <div className="icon-box icon-box-primary mx-auto mb-4 scale-125">
                <Ticket className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No upcoming events</h3>
              <p className="text-muted-foreground mb-6">Start exploring events and book your next adventure.</p>
              <Link to="/app/discover" className="btn-primary px-8 py-3.5">
                Discover Events
              </Link>
            </>
          )}
          {activeTab === 'past' && (
            <>
              <div className="icon-box icon-box-cyan mx-auto mb-4 scale-125">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No past events</h3>
              <p className="text-muted-foreground">You haven't attended any events yet.</p>
            </>
          )}
          {activeTab === 'bookmarked' && (
            <>
              <div className="icon-box icon-box-orange mx-auto mb-4 scale-125">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No bookmarked events</h3>
              <p className="text-muted-foreground">Save events you're interested in for later.</p>
            </>
          )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayEvents.map((event) => (
            <div
              key={event.id}
              className="group card-surface overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
            >
              <div className="relative h-44 overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-40" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-white/20 dark:border-white/10 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {event.category}
                  </span>
                </div>
                {activeTab === 'upcoming' && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Confirmed
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4.5">
                <h3 className="text-body font-bold text-foreground mb-2.5 line-clamp-1 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="filter-chip inactive text-[11px]">{event.location.isVirtual ? 'Virtual' : 'In person'}</span>
                  {event.isRecommended && <span className="filter-chip active text-[11px] inline-flex items-center gap-1"><Sparkles className="w-3 h-3" />Match</span>}
                </div>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-caption text-muted-foreground font-medium">
                    <Clock3 className="w-3.5 h-3.5" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-caption text-muted-foreground font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{event.location.venue}</span>
                  </div>
                </div>

                {activeTab === 'upcoming' && (
                  <div className="mb-3">
                    <CancellationCountdown
                      eventDate={event.date}
                      cancellationWindowHours={windowHours}
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  {activeTab === 'upcoming' ? (
                    <>
                      <Link to={`/app/orders/${event.id}`} className="btn-primary text-body-sm flex-1">
                        View Ticket
                      </Link>
                      {(() => {
                        const booking = getBookingForEvent(event.id);
                        const canCancel = booking && isWithinCancellationWindow(event.date);
                        return booking ? (
                          <button
                            onClick={() => {
                              if (!canCancel) return;
                              setCancelQty(1);
                              setCancelTarget(booking.id);
                            }}
                            disabled={!canCancel}
                            title={canCancel ? 'Cancel booking' : 'Cancellation window has closed'}
                            className="p-2 rounded-lg border border-border text-muted-foreground hover:text-red-600 hover:border-red-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        ) : null;
                      })()}
                    </>
                  ) : activeTab === 'past' ? (
                    <>
                      <Link to={`/app/events/${event.id}`} className="btn-secondary text-body-sm flex-1">
                        View Details
                      </Link>
                      {!reviewedEvents.has(event.id) ? (
                        <button
                          onClick={() => setReviewTarget(event.id)}
                          className="btn-primary text-body-sm flex-1 inline-flex items-center justify-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5" />
                          Review
                        </button>
                      ) : (
                        <span className="flex-1 text-center text-caption text-green-600 dark:text-green-400 font-bold pt-2">
                          Reviewed ✓
                        </span>
                      )}
                    </>
                  ) : (
                    <Link to={`/app/events/${event.id}`} className="btn-primary text-body-sm w-full">
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      </div>

      {/* Cancel modal with partial quantity selector */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="surface-panel rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <h3 className="text-h3 font-bold text-foreground">Cancel Booking</h3>
            <p className="text-body-sm text-muted-foreground">
              How many tickets would you like to cancel? A refund will be issued for the cancelled tickets within 5–10 business days.
            </p>
            {cancelMaxQty > 1 && (
              <div className="space-y-1.5">
                <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">
                  Tickets to cancel ({cancelMaxQty} total)
                </label>
                <input
                  type="number"
                  min={1}
                  max={cancelMaxQty}
                  value={cancelQty}
                  onChange={(e) => setCancelQty(Math.min(cancelMaxQty, Math.max(1, Number(e.target.value))))}
                  className="w-full input-base px-4 py-2.5"
                />
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setCancelTarget(null); setCancelQty(1); }}
                className="btn-secondary flex-1"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-body-sm transition-colors"
              >
                Cancel {cancelQty} Ticket{cancelQty > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Write Review modal */}
      {reviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="surface-panel rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <h3 className="text-h3 font-bold text-foreground">Write a Review</h3>
            <p className="text-body-sm text-muted-foreground">
              {events.find((e) => e.id === reviewTarget)?.title}
            </p>

            <div className="space-y-1.5">
              <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewStars(star)}
                    onMouseEnter={() => setReviewHover(star)}
                    onMouseLeave={() => setReviewHover(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (reviewHover || reviewStars)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">
                Your thoughts <span className="normal-case font-normal">(optional)</span>
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                className="w-full input-base px-4 py-3 resize-none"
                placeholder="Share what made this event memorable…"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setReviewTarget(null); setReviewStars(0); setReviewText(''); }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4" />
                Submit (+20 XP)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
