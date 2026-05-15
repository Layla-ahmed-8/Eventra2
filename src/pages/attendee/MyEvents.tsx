import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Ticket, Heart } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function MyEvents() {
  const { events, rsvpedEvents, bookmarkedEvents } = useAppStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'bookmarked'>('upcoming');

  const now = new Date();
  const upcomingEvents = events.filter(
    (e) => rsvpedEvents.includes(e.id) && new Date(e.date) > now
  );
  const pastEvents = events.filter(
    (e) => rsvpedEvents.includes(e.id) && new Date(e.date) <= now
  );
  const savedEvents = events.filter((e) => bookmarkedEvents.includes(e.id));

  const displayEvents =
    activeTab === 'upcoming'
      ? upcomingEvents
      : activeTab === 'past'
      ? pastEvents
      : savedEvents;

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h1 font-bold text-foreground">My Events</h1>
          <p className="text-body-sm text-muted-foreground mt-1">Manage your bookings and saved experiences.</p>
        </div>
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl inline-flex">
          {[
            { key: 'upcoming', label: 'Upcoming', count: upcomingEvents.length },
            { key: 'past', label: 'Past', count: pastEvents.length },
            { key: 'bookmarked', label: 'Saved', count: savedEvents.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg text-caption font-bold transition-all ${activeTab === tab.key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {tab.label.toUpperCase()} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {displayEvents.length === 0 ? (
        <div className="bento-section text-center py-20">
          {activeTab === 'upcoming' && (
            <>
              <div className="icon-box icon-box-primary mx-auto mb-4 scale-150">
                <Ticket className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No upcoming events</h3>
              <p className="text-muted-foreground mb-8">Start exploring events and book your next adventure.</p>
              <Link to="/app/discover" className="btn-primary px-8 py-4">
                Discover Events
              </Link>
            </>
          )}
          {activeTab === 'past' && (
            <>
              <div className="icon-box icon-box-cyan mx-auto mb-4 scale-150">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No past events</h3>
              <p className="text-muted-foreground">You haven't attended any events yet.</p>
            </>
          )}
          {activeTab === 'bookmarked' && (
            <>
              <div className="icon-box icon-box-orange mx-auto mb-4 scale-150">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No bookmarked events</h3>
              <p className="text-muted-foreground">Save events you're interested in for later.</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event) => (
            <div
              key={event.id}
              className="group card-surface overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-40" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-white/20 dark:border-white/10 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {event.category}
                  </span>
                </div>
                {activeTab !== 'bookmarked' && (
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                      Confirmed
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-body font-bold text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2 text-caption text-muted-foreground font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-caption text-muted-foreground font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{event.location.venue}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {activeTab === 'upcoming' ? (
                    <>
                      <Link to={`/app/orders/${event.id}`} className="btn-primary text-body-sm flex-1">
                        View Ticket
                      </Link>
                      <Link to={`/app/events/${event.id}`} className="btn-secondary text-body-sm px-4">
                        Info
                      </Link>
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
  );
}
