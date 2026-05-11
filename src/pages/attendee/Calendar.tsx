import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function Calendar() {
  const { events, rsvpedEvents, bookings } = useAppStore();
  const [view, setView] = useState<'month' | 'week'>('month');

  const userEvents = events.filter((event) => rsvpedEvents.includes(event.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/app/discover" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">My Calendar</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* View Tabs */}
        <div className="bg-card border border-border rounded-xl shadow-lg p-2 mb-6 inline-flex gap-2">
          <button
            onClick={() => setView('month')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              view === 'month'
                ? 'bg-[#6C4CF1] text-white'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              view === 'week'
                ? 'bg-[#6C4CF1] text-white'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            Week
          </button>
        </div>

        {/* Calendar Header */}
        <div className="surface-panel p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-h3 font-bold text-foreground">May 2026</h2>
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="px-3 py-1.5 text-body-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                Today
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-caption font-semibold text-muted-foreground py-2">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.charAt(0)}</span>
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 2;
              const isToday = day === 6;
              const hasEvent = day === 10 || day === 15 || day === 18 || day === 20;
              return (
                <div
                  key={i}
                  className={`h-10 sm:h-14 p-1 sm:p-2 border rounded-lg flex flex-col items-start justify-start ${
                    day < 1 || day > 31
                      ? 'bg-background text-muted-foreground/30 border-transparent'
                      : isToday
                      ? 'bg-primary text-primary-foreground font-bold border-primary'
                      : hasEvent
                      ? 'bg-primary/8 border-primary/30'
                      : 'border-border hover:bg-secondary/50 transition-colors'
                  }`}
                >
                  {day > 0 && day <= 31 && (
                    <>
                      <div className="text-caption sm:text-body-sm">{day}</div>
                      {hasEvent && !isToday && (
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-0.5" />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="surface-panel p-4 sm:p-6">
          <h2 className="text-h3 font-bold text-foreground mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {userEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No upcoming events</p>
                <Link
                  to="/app/discover"
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  Browse events
                </Link>
              </div>
            ) : (
              userEvents
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((event) => (
                  <Link
                    key={event.id}
                    to={`/app/events/${event.id}`}
                    className="flex flex-col sm:flex-row gap-4 p-4 border-2 border-border rounded-xl hover:border-primary transition-colors"
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full sm:w-20 h-32 sm:h-20 object-cover rounded-xl flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-body font-bold text-foreground mb-2 line-clamp-2">{event.title}</h3>
                      <div className="space-y-1 text-body-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 flex-shrink-0" />
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
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{event.location.venue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:items-center">
                      <span className="status-pill bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 self-start sm:self-auto">
                        Confirmed
                      </span>
                    </div>
                  </Link>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
