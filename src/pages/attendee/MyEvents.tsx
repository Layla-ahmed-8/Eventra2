import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, MapPin, Ticket, Heart, XCircle, Star, Search, ArrowUpDown,
  Sparkles, Clock3, Filter, TicketCheck, MessagesSquare, QrCode,
  ChevronRight, Wallet, Tag, Compass,
} from 'lucide-react';
import { toast } from 'sonner';
import { generateGoogleCalendarUrl } from '../../lib/calendar';
import { useAppStore } from '../../store/useAppStore';
import CancellationCountdown from '../../components/business/CancellationCountdown';
import { DEFAULT_SYSTEM_CONFIG } from '../../constants/config';
import type { Event } from '../../data/mockData';
import type { Booking } from '../../types';

type TabKey = 'upcoming' | 'past' | 'bookmarked';
type SortKey = 'soonest' | 'latest' | 'booked';

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MyEvents() {
  const {
    events, rsvpedEvents, bookmarkedEvents, bookings, cancelBooking,
    systemConfig, awardXP, refundToWallet, currentUser,
  } = useAppStore();

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
  const now = Date.now();
  const userId = currentUser?.id;

  const myBookings = useMemo(
    () => bookings.filter((b) => b.userId === userId && b.status === 'confirmed'),
    [bookings, userId],
  );

  const bookedEventIds = useMemo(() => {
    const fromBookings = myBookings.map((b) => b.eventId);
    return [...new Set([...rsvpedEvents, ...fromBookings])];
  }, [myBookings, rsvpedEvents]);

  const getBookingForEvent = (eventId: string): Booking | undefined =>
    myBookings.find((b) => b.eventId === eventId);

  const isWithinCancellationWindow = (eventDate: string) => {
    const deadline = new Date(eventDate).getTime() - windowHours * 3600 * 1000;
    return now < deadline;
  };

  const upcomingEvents = useMemo(
    () => events.filter((e) => bookedEventIds.includes(e.id) && new Date(e.date).getTime() > now),
    [events, bookedEventIds, now],
  );

  const pastEvents = useMemo(
    () => events.filter((e) => bookedEventIds.includes(e.id) && new Date(e.date).getTime() <= now),
    [events, bookedEventIds, now],
  );

  const savedEvents = useMemo(
    () => events.filter((e) => bookmarkedEvents.includes(e.id)),
    [bookmarkedEvents, events],
  );

  const nextEvent = useMemo(
    () => [...upcomingEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0],
    [upcomingEvents],
  );

  const tabEvents = activeTab === 'upcoming' ? upcomingEvents : activeTab === 'past' ? pastEvents : savedEvents;

  const displayEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const base = tabEvents.filter((event) => {
      if (!query) return true;
      return [event.title, event.category, event.location.venue, event.location.city, event.organizer.name]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });

    return [...base].sort((a, b) => {
      if (sortBy === 'booked' && activeTab !== 'bookmarked') {
        const aBooked = getBookingForEvent(a.id)?.createdAt ?? a.date;
        const bBooked = getBookingForEvent(b.id)?.createdAt ?? b.date;
        return new Date(bBooked).getTime() - new Date(aBooked).getTime();
      }
      if (sortBy === 'latest') return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [searchQuery, sortBy, tabEvents, activeTab, myBookings]);

  const stats = useMemo(() => ({
    upcoming: upcomingEvents.length,
    past: pastEvents.length,
    saved: savedEvents.length,
    totalBooked: bookedEventIds.length,
    cancellable: upcomingEvents.filter((e) => {
      const b = getBookingForEvent(e.id);
      return b && isWithinCancellationWindow(e.date);
    }).length,
    reviewed: pastEvents.filter((e) => reviewedEvents.has(e.id)).length,
  }), [upcomingEvents, pastEvents, savedEvents.length, bookedEventIds.length, reviewedEvents, myBookings]);

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    const booking = myBookings.find((b) => b.id === cancelTarget);
    await cancelBooking(cancelTarget);
    setCancelTarget(null);
    setCancelQty(1);

    if (booking && booking.total > 0) {
      const totalQty = booking.tickets.reduce((s, t) => s + t.qty, 0);
      const refundAmount = totalQty > 0
        ? Number(((booking.total / totalQty) * cancelQty).toFixed(2))
        : 0;
      if (refundAmount > 0) {
        refundToWallet(refundAmount, cancelTarget, `Refund — cancelled ${cancelQty} ticket${cancelQty > 1 ? 's' : ''}`);
        toast.success('Booking cancelled', { description: `EGP ${refundAmount.toFixed(2)} refunded to your wallet.` });
        return;
      }
    }
    toast.success('Booking cancelled', { description: 'Your ticket has been released.' });
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

  const cancelBookingObj = cancelTarget ? myBookings.find((b) => b.id === cancelTarget) : null;
  const cancelMaxQty = cancelBookingObj
    ? cancelBookingObj.tickets.reduce((sum, t) => sum + t.qty, 0)
    : 1;

  const renderEventCard = (event: Event, mode: TabKey) => {
    const booking = mode !== 'bookmarked' ? getBookingForEvent(event.id) : undefined;
    const ticketCount = booking?.tickets.reduce((s, t) => s + t.qty, 0) ?? 0;
    const isUpcoming = new Date(event.date).getTime() > now;
    const days = daysUntil(event.date);

    const calendarUrl = generateGoogleCalendarUrl({
      title: event.title,
      description: event.description,
      date: event.date,
      endDate: event.endDate,
      location: {
        venue: event.location.venue,
        address: event.location.address,
        city: event.location.city,
        isVirtual: event.location.isVirtual,
        virtualLink: event.location.virtualLink,
      },
    });

    return (
      <article
        key={event.id}
        className="group relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-card shadow-lg transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/30"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-white/95 text-slate-900 text-[10px] font-black uppercase tracking-widest">
              {event.category}
            </span>
            {mode !== 'bookmarked' && (
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                isUpcoming ? 'bg-green-500 text-white' : 'bg-slate-600/90 text-white'
              }`}>
                {isUpcoming ? 'Confirmed' : 'Attended'}
              </span>
            )}
          </div>
          {mode !== 'bookmarked' && booking && (
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
              <span className="font-mono text-[11px] font-bold text-white/90 bg-black/40 backdrop-blur px-2.5 py-1 rounded-lg">
                {booking.bookingRef}
              </span>
              {isUpcoming && days > 0 && (
                <span className="text-[10px] font-black uppercase tracking-wider text-white bg-primary/90 px-2.5 py-1 rounded-lg">
                  In {days} day{days !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-h4 font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>
            <p className="text-caption text-muted-foreground mt-1">{event.organizer.name}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="filter-chip inactive text-[11px]">
              {event.location.isVirtual ? 'Virtual' : 'In person'}
            </span>
            {ticketCount > 0 && (
              <span className="filter-chip inactive text-[11px] inline-flex items-center gap-1">
                <Ticket className="w-3 h-3" /> {ticketCount} ticket{ticketCount > 1 ? 's' : ''}
              </span>
            )}
            {event.isRecommended && (
              <span className="filter-chip active text-[11px] inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Match
              </span>
            )}
          </div>

          <div className="space-y-2 text-body-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{formatEventDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-500 flex-shrink-0" />
              <span className="truncate">{event.location.venue}</span>
            </div>
          </div>

          {booking && mode === 'upcoming' && (
            <div className="rounded-2xl bg-secondary/40 border border-border/50 p-3 space-y-2">
              <div className="flex justify-between text-body-sm">
                <span className="text-muted-foreground">Total paid</span>
                <span className="font-bold text-foreground">
                  {booking.total === 0 ? 'Free' : `EGP ${booking.total.toLocaleString()}`}
                </span>
              </div>
              {booking.discount > 0 && (
                <div className="flex justify-between text-body-sm text-green-600">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Discount</span>
                  <span>−EGP {booking.discount.toFixed(0)}</span>
                </div>
              )}
              <CancellationCountdown eventDate={event.date} cancellationWindowHours={windowHours} />
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {mode === 'upcoming' && (
              <>
                <Link to={`/app/orders/${event.id}`} className="btn-primary text-body-sm flex-1 inline-flex items-center justify-center gap-1.5 min-w-[120px]">
                  <QrCode className="w-4 h-4" /> View Ticket
                </Link>
                <Link to={`/app/events/${event.id}/chat`} className="btn-secondary p-2.5" title="Event chat">
                  <MessagesSquare className="w-4 h-4" />
                </Link>
                <button type="button" onClick={() => window.open(calendarUrl, '_blank')} className="btn-secondary p-2.5" title="Add to calendar">
                  <Calendar className="w-4 h-4" />
                </button>
                {booking && isWithinCancellationWindow(event.date) && (
                  <button
                    onClick={() => { setCancelQty(1); setCancelTarget(booking.id); }}
                    className="btn-ghost p-2.5 text-red-500 hover:bg-red-500/10"
                    title="Cancel booking"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </>
            )}
            {mode === 'past' && (
              <>
                <Link to={`/app/orders/${event.id}`} className="btn-secondary text-body-sm flex-1">View Ticket</Link>
                <Link to={`/app/events/${event.id}`} className="btn-secondary text-body-sm flex-1">Details</Link>
                {!reviewedEvents.has(event.id) ? (
                  <button onClick={() => setReviewTarget(event.id)} className="btn-primary text-body-sm flex-1 inline-flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5" /> Review
                  </button>
                ) : (
                  <span className="flex-1 text-center text-caption text-green-600 font-bold py-2">Reviewed ✓</span>
                )}
              </>
            )}
            {mode === 'bookmarked' && (
              <>
                <Link to={`/app/events/${event.id}`} className="btn-primary text-body-sm flex-1">View Event</Link>
                <Link to={`/app/events/${event.id}/rsvp`} className="btn-secondary text-body-sm flex-1">Book Now</Link>
              </>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Hero */}
      <div className="hero-surface overflow-hidden relative">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="relative p-6 md:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-body-sm font-bold uppercase tracking-wider">
                <TicketCheck className="w-4 h-4" />
                My Events
              </div>
              <h1 className="text-h1 font-bold text-foreground">Your tickets, bookings & saved events</h1>
              <p className="text-body text-muted-foreground">
                {stats.totalBooked > 0
                  ? `You have ${stats.upcoming} upcoming and ${stats.past} past booking${stats.past !== 1 ? 's' : ''}.`
                  : 'Book an event and it will show up here instantly.'}
              </p>
            </div>
            <Link to="/app/discover" className="btn-primary shrink-0 inline-flex items-center gap-2">
              <Compass className="w-4 h-4" /> Discover Events
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Upcoming', value: stats.upcoming, accent: 'text-primary' },
              { label: 'Past', value: stats.past, accent: 'text-cyan-500' },
              { label: 'Saved', value: stats.saved, accent: 'text-orange-500' },
              { label: 'Total booked', value: stats.totalBooked, accent: 'text-foreground' },
            ].map((s) => (
              <div key={s.label} className="kpi-card p-4 text-center">
                <p className={`text-3xl font-black tabular-nums ${s.accent}`}>{s.value}</p>
                <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Next event spotlight */}
      {nextEvent && activeTab === 'upcoming' && (
        <div className="glow-card overflow-hidden">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-0">
            <div className="relative h-56 md:h-auto min-h-[220px]">
              <img src={nextEvent.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="text-micro font-black uppercase tracking-widest text-primary bg-primary/20 border border-primary/30 px-3 py-1 rounded-full">
                  Next up
                </span>
                <h2 className="text-h2 font-bold text-white mt-2 line-clamp-2">{nextEvent.title}</h2>
                <p className="text-body-sm text-white/80 mt-1">{formatEventDate(nextEvent.date)}</p>
              </div>
            </div>
            <div className="p-6 flex flex-col justify-center gap-4 bg-card/80">
              <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-cyan-500" />
                {nextEvent.location.venue}
              </div>
              {(() => {
                const b = getBookingForEvent(nextEvent.id);
                return b ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border">
                    <span className="font-mono text-caption text-muted-foreground">{b.bookingRef}</span>
                    <span className="font-bold text-foreground">
                      {b.total === 0 ? 'Free' : `EGP ${b.total}`}
                    </span>
                  </div>
                ) : null;
              })()}
              <div className="flex gap-2">
                <Link to={`/app/orders/${nextEvent.id}`} className="btn-primary flex-1 inline-flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4" /> Open Ticket
                </Link>
                <Link to={`/app/events/${nextEvent.id}`} className="btn-secondary px-4">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs + filters */}
      <div className="bento-section space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {([
              { key: 'upcoming' as TabKey, label: 'Upcoming', count: stats.upcoming },
              { key: 'past' as TabKey, label: 'Past', count: stats.past },
              { key: 'bookmarked' as TabKey, label: 'Saved', count: stats.saved },
            ]).map((tab) => (
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

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events, venues, organizers..."
              className="input-base w-full pl-12 h-12"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {activeTab !== 'bookmarked' && (
              <button onClick={() => setSortBy('booked')} className={`filter-chip ${sortBy === 'booked' ? 'active' : 'inactive'}`}>
                Recently booked
              </button>
            )}
            {(['soonest', 'latest', 'title'] as const).map((key) => (
              <button key={key} onClick={() => setSortBy(key)} className={`filter-chip ${sortBy === key ? 'active' : 'inactive'} inline-flex items-center gap-1.5`}>
                <ArrowUpDown className="w-3.5 h-3.5" />
                {key === 'soonest' ? 'Soonest' : key === 'latest' ? 'Latest' : 'A–Z'}
              </button>
            ))}
            <span className="filter-chip inactive inline-flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> {displayEvents.length}
            </span>
          </div>
        </div>

        {displayEvents.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-3xl border border-dashed border-border bg-secondary/20">
            {activeTab === 'upcoming' && (
              <>
                <div className="icon-box icon-box-primary mx-auto mb-5 w-16 h-16">
                  <Ticket className="w-7 h-7" />
                </div>
                <h3 className="text-h3 font-bold text-foreground mb-2">No upcoming bookings</h3>
                <p className="text-body text-muted-foreground mb-6 max-w-md mx-auto">
                  {stats.past > 0
                    ? 'Your past bookings are in the Past tab. Book a new event to see it here.'
                    : 'Complete checkout on any event — it appears here right away with your ticket.'}
                </p>
                <Link to="/app/discover" className="btn-primary px-8">Browse Events</Link>
              </>
            )}
            {activeTab === 'past' && (
              <>
                <div className="icon-box icon-box-cyan mx-auto mb-5 w-16 h-16">
                  <Calendar className="w-7 h-7" />
                </div>
                <h3 className="text-h3 font-bold text-foreground mb-2">No past events yet</h3>
                <p className="text-body text-muted-foreground">Events you attend will move here after the date passes.</p>
              </>
            )}
            {activeTab === 'bookmarked' && (
              <>
                <div className="icon-box icon-box-orange mx-auto mb-5 w-16 h-16">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="text-h3 font-bold text-foreground mb-2">No saved events</h3>
                <p className="text-body text-muted-foreground mb-6">Bookmark events from Discover to find them later.</p>
                <Link to="/app/discover" className="btn-secondary">Explore Discover</Link>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {displayEvents.map((event) => renderEventCard(event, activeTab))}
          </div>
        )}
      </div>

      {/* Cancel modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="surface-panel rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <h3 className="text-h3 font-bold text-foreground">Cancel Booking</h3>
            <p className="text-body-sm text-muted-foreground flex items-start gap-2">
              <Wallet className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Refunds are credited to your Eventra Wallet instantly.
            </p>
            {cancelMaxQty > 1 && (
              <div>
                <label className="text-caption font-bold uppercase tracking-widest text-muted-foreground">
                  Tickets to cancel (of {cancelMaxQty})
                </label>
                <input
                  type="number"
                  min={1}
                  max={cancelMaxQty}
                  value={cancelQty}
                  onChange={(e) => setCancelQty(Math.min(cancelMaxQty, Math.max(1, Number(e.target.value))))}
                  className="input-base w-full mt-2"
                />
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setCancelTarget(null); setCancelQty(1); }} className="btn-secondary flex-1">Keep</button>
              <button onClick={handleCancelConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-body-sm">
                Cancel {cancelQty} ticket{cancelQty > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review modal */}
      {reviewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="surface-panel rounded-2xl p-6 w-full max-w-md space-y-5 shadow-2xl">
            <h3 className="text-h3 font-bold text-foreground">Write a Review</h3>
            <p className="text-body-sm text-muted-foreground">{events.find((e) => e.id === reviewTarget)?.title}</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewStars(star)}
                  onMouseEnter={() => setReviewHover(star)}
                  onMouseLeave={() => setReviewHover(0)}
                >
                  <Star className={`w-8 h-8 ${star <= (reviewHover || reviewStars) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
                </button>
              ))}
            </div>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              className="input-base w-full resize-none"
              placeholder="What made this event memorable?"
            />
            <div className="flex gap-3">
              <button onClick={() => { setReviewTarget(null); setReviewStars(0); setReviewText(''); }} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleReviewSubmit} className="btn-primary flex-1">Submit (+20 XP)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
