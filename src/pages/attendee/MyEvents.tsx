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
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/app/discover" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">My Events</h1>
            <div className="w-20"></div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-secondary p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-card text-[#6C4CF1] shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Upcoming ({upcomingEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'past'
                  ? 'bg-card text-[#6C4CF1] shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Past ({pastEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('bookmarked')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'bookmarked'
                  ? 'bg-card text-[#6C4CF1] shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Bookmarked ({savedEvents.length})
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {displayEvents.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl shadow-lg p-12 text-center">
            {activeTab === 'upcoming' && (
              <>
                <Ticket className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No upcoming events</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring events and book your next adventure
                </p>
                <Link
                  to="/app/discover"
                  className="inline-block px-6 py-4 bg-gradient-to-r from-[#6C4CF1] to-[#5739D4] hover:shadow-xl text-white rounded-xl font-bold transform hover:scale-105 transition-all"
                >
                  Discover Events
                </Link>
              </>
            )}
            {activeTab === 'past' && (
              <>
                <Calendar className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No past events</h3>
                <p className="text-muted-foreground">You haven't attended any events yet</p>
              </>
            )}
            {activeTab === 'bookmarked' && (
              <>
                <Heart className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No bookmarked events</h3>
                <p className="text-muted-foreground">Save events you're interested in for later</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayEvents.map((event) => (
              <div
                key={event.id}
                className="bg-card border border-border rounded-2xl shadow-lg hover:shadow-2xl hover-lift transition-all overflow-hidden"
              >
                <Link to={`/app/events/${event.id}`}>
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-[#6C4CF1] text-white text-xs font-semibold rounded-full">
                        {event.category}
                      </span>
                    </div>
                    {activeTab !== 'bookmarked' && (
                      <div className="absolute top-3 right-3">
                        <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                          Confirmed
                        </span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/app/events/${event.id}`}>
                    <h3 className="font-bold text-foreground mb-2 hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                  </Link>

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{event.location.venue}</span>
                    </div>
                  </div>

                  {activeTab === 'upcoming' && (
                    <Link
                      to={`/app/orders/${event.id}`}
                      className="block w-full text-center px-4 py-2 border-2 border-primary text-primary rounded-xl hover:bg-primary/10 font-semibold transition-all"
                    >
                      View Ticket
                    </Link>
                  )}
                  {activeTab === 'bookmarked' && (
                    <Link
                      to={`/app/events/${event.id}`}
                      className="block w-full text-center px-4 py-2 bg-gradient-to-r from-[#6C4CF1] to-[#5739D4] hover:shadow-lg text-white rounded-xl font-bold transition-all transform hover:scale-105"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
