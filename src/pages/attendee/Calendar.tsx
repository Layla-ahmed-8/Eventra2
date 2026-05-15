import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function Calendar() {
  const { events, rsvpedEvents, bookings } = useAppStore();
  const [view, setView] = useState<'month' | 'week'>('month');

  const userEvents = events.filter((event) => rsvpedEvents.includes(event.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-h1 font-bold text-foreground">My Calendar</h1>
          <p className="text-body-sm text-muted-foreground mt-1">Track your upcoming experiences.</p>
        </div>
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl inline-flex">
          {[
            { key: 'month', label: 'Month' },
            { key: 'week', label: 'Week' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setView(t.key as any)}
              className={`px-6 py-2 rounded-lg text-caption font-bold transition-all ${view === t.key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 bento-section">
          <div className="bento-header">
            <h2 className="bento-title">May 2026</h2>
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-lg transition-colors">
                Today
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 2;
              const isToday = day === 6;
              const hasEvent = day === 10 || day === 15 || day === 18 || day === 20;
              return (
                <div
                  key={i}
                  className={`h-12 sm:h-20 p-2 border rounded-2xl flex flex-col items-start justify-start relative transition-all ${
                    day < 1 || day > 31
                      ? 'bg-transparent border-transparent opacity-20'
                      : isToday
                      ? 'bg-primary border-primary shadow-lg shadow-primary/20 scale-105 z-10'
                      : hasEvent
                      ? 'bg-primary/5 border-primary/20 hover:border-primary/40'
                      : 'border-border/50 hover:bg-secondary/50'
                  }`}
                >
                  {day > 0 && day <= 31 && (
                    <>
                      <div className={`text-caption font-bold ${isToday ? 'text-white' : 'text-muted-foreground'}`}>{day}</div>
                      {hasEvent && (
                        <div className={`mt-auto w-full h-1 rounded-full ${isToday ? 'bg-white/40' : 'bg-primary/40'}`} />
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Event List */}
        <div className="space-y-6">
          <div className="bento-section">
            <div className="bento-header">
              <div className="bento-title-wrapper">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h2 className="bento-title">Upcoming</h2>
              </div>
            </div>

            <div className="space-y-3">
              {userEvents.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                  <CalendarIcon className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-caption font-bold">No events scheduled</p>
                </div>
              ) : (
                userEvents
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 4)
                  .map((event) => (
                    <Link
                      key={event.id}
                      to={`/app/events/${event.id}`}
                      className="activity-item p-3 group"
                    >
                      <div className="activity-icon-wrapper overflow-hidden border-0 scale-90">
                        <img src={event.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{event.title}</p>
                        <p className="text-[10px] font-medium text-muted-foreground mt-0.5">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {event.location.city}
                        </p>
                      </div>
                    </Link>
                  ))
              )}
            </div>
            
            <Link to="/app/discover" className="block w-full mt-6 text-center py-3 text-caption font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl border border-dashed border-primary/20 transition-all">
              Discover more
            </Link>
          </div>

          <div className="atmo-panel p-5">
            <h3 className="text-caption font-black uppercase tracking-widest text-white/70 mb-4">Pro Tip</h3>
            <div className="flex items-start gap-3">
              <div className="icon-box icon-box-primary scale-90 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <p className="text-caption text-white/90 leading-relaxed">
                Sync your Eventra calendar with Google or Apple Calendar to never miss a beat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
