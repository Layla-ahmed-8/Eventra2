import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Sparkles,
  Ticket,
  TrendingUp,
  Users,
  Plus,
  Share2,
  Trash2,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import CalendarAddEventModal from '../../components/calendar/CalendarAddEventModal';
import { generateGoogleCalendarUrl } from '../../lib/calendar';

export default function Calendar() {
  const { events, rsvpedEvents, bookings, personalEvents, removePersonalEvent } = useAppStore();
  const [view, setView] = useState<'month' | 'week'>('month');
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().slice(0, 10));
  const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'virtual' | 'in-person'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Combine RSVPed events and Personal events
  const allUserEvents = useMemo(() => {
    const rsvped = events
      .filter((event) => rsvpedEvents.includes(event.id))
      .map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        endDate: event.endDate || new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString(),
        location: event.location,
        image: event.image,
        type: 'event' as const,
        isVirtual: event.location.isVirtual,
        category: event.category
      }));

    const personal = personalEvents.map(event => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.date,
      endDate: event.endDate,
      location: {
        venue: event.location,
        address: '',
        city: '',
        isVirtual: false,
        lat: 0,
        lng: 0
      },
      image: '', // Placeholder or specific icon
      type: event.type as 'personal' | 'reminder',
      isVirtual: false,
      category: event.category || 'Personal'
    }));

    return [...rsvped, ...personal].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, rsvpedEvents, personalEvents]);

  const today = new Date();
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);
  const monthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - monthStart.getDay());

  const filteredEvents = useMemo(() => {
    return allUserEvents.filter((event) => {
      const eventDate = new Date(event.date);
      const isUpcoming = eventDate.getTime() >= todayStart.getTime();
      return (
        eventFilter === 'all' ||
        (eventFilter === 'upcoming' && isUpcoming) ||
        (eventFilter === 'virtual' && event.isVirtual) ||
        (eventFilter === 'in-person' && !event.isVirtual)
      );
    });
  }, [eventFilter, todayStart, allUserEvents]);

  const monthEvents = useMemo(() => {
    return filteredEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= monthStart && eventDate <= monthEnd;
    });
  }, [filteredEvents, monthEnd, monthStart]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate) return [];
    return filteredEvents.filter((event) => event.date.slice(0, 10) === selectedDate).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredEvents, selectedDate]);

  const nextSevenDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return date;
    });
  }, [today]);

  const upcomingEvents = useMemo(() => {
    return filteredEvents
      .filter((event) => new Date(event.date).getTime() >= todayStart.getTime())
      .slice(0, 6);
  }, [filteredEvents, todayStart]);

  const stats = useMemo(() => {
    const virtualCount = allUserEvents.filter((event) => event.isVirtual).length;
    const inPersonCount = allUserEvents.filter(e => !e.isVirtual).length;
    const personalCount = personalEvents.length;
    return { virtualCount, inPersonCount, personalCount };
  }, [allUserEvents, personalEvents.length]);

  const selectedDateLabel = selectedDate ? new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'Pick a day';

  const gotoToday = () => {
    setMonthOffset(0);
    setSelectedDate(todayStart.toISOString().slice(0, 10));
  };

  const formatMonthTitle = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const monthCells = Array.from({ length: 42 }, (_, index) => {
    const cell = new Date(gridStart);
    cell.setDate(gridStart.getDate() + index);
    const isoDate = cell.toISOString().slice(0, 10);
    const isCurrentMonth = cell.getMonth() === monthDate.getMonth();
    const isToday = isoDate === today.toISOString().slice(0, 10);
    const eventsOnDay = filteredEvents.filter((event) => event.date.slice(0, 10) === isoDate);

    return { cell, isoDate, isCurrentMonth, isToday, eventsOnDay };
  });

  const handleGoogleSync = (event: typeof allUserEvents[0]) => {
    const url = generateGoogleCalendarUrl({
      title: event.title,
      description: event.description,
      date: event.date,
      endDate: event.endDate,
      location: {
        venue: event.location.venue,
        address: event.location.address,
        city: event.location.city,
        isVirtual: event.isVirtual
      }
    });
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-2.5">
      <div className="hero-surface p-2 md:p-2.5 space-y-1.5">
        <div className="flex flex-col gap-1.5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-body-sm font-bold uppercase tracking-wider">
              <CalendarIcon className="w-4 h-4" />
              My Calendar
            </div>
            <div>
              <h1 className="text-h4 font-bold text-foreground">Plan, review, and jump into your next event.</h1>
              <p className="text-body-sm text-muted-foreground mt-2 max-w-2xl">
                Switch between month and week views, filter by format, and tap any day to see a focused agenda.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
            <div className="h-8 w-px bg-border/50 mx-1 hidden sm:block" />
            {([
              { key: 'all', label: 'All' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'virtual', label: 'Virtual' },
              { key: 'in-person', label: 'In person' },
            ] as const).map((item) => (
              <button
                key={item.key}
                onClick={() => setEventFilter(item.key)}
                className={`filter-chip ${eventFilter === item.key ? 'active' : 'inactive'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-1 sm:grid-cols-2 xl:grid-cols-4">
          <div className="kpi-card !p-2">
            <span className="kpi-label">Total items</span>
            <div className="kpi-value text-lg">{allUserEvents.length}</div>
          </div>
          <div className="kpi-card !p-2">
            <span className="kpi-label">This month</span>
            <div className="kpi-value text-lg">{monthEvents.length}</div>
          </div>
          <div className="kpi-card !p-2">
            <span className="kpi-label">Virtual</span>
            <div className="kpi-value text-lg">{stats.virtualCount}</div>
          </div>
          <div className="kpi-card !p-2">
            <span className="kpi-label">Personal</span>
            <div className="kpi-value text-lg">{stats.personalCount}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-2 xl:grid-cols-[1.55fr_0.75fr]">
        <div className="bento-section space-y-1.5 p-2 md:p-2.5">
          <div className="flex flex-col gap-1.5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="bento-title-wrapper">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h2 className="bento-title">{formatMonthTitle(monthDate)}</h2>
              </div>
              <p className="text-body-sm text-muted-foreground mt-1">Click a day to focus the agenda on that date.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => setMonthOffset((value) => value - 1)} className="btn-ghost px-3 py-2">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={gotoToday} className="btn-primary px-4 py-2 text-sm">
                Today
              </button>
              <button onClick={() => setMonthOffset((value) => value + 1)} className="btn-ghost px-3 py-2">
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="flex gap-1 p-1 bg-secondary/50 rounded-2xl inline-flex border border-border/50">
                {[
                  { key: 'month', label: 'Month' },
                  { key: 'week', label: 'Week' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setView(item.key as 'month' | 'week')}
                    className={`px-5 py-2 rounded-xl text-caption font-bold transition-all ${view === item.key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {item.label.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {view === 'month' ? (
            <div className="space-y-0.5">
              <div className="grid grid-cols-7 gap-0.5">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-[9px] font-black uppercase tracking-widest text-muted-foreground py-0.5">
                    {day}
                  </div>
                ))}
                {monthCells.map(({ cell, isoDate, isCurrentMonth, isToday, eventsOnDay }) => {
                  const isSelected = selectedDate === isoDate;
                  return (
                    <button
                      key={isoDate}
                      type="button"
                      onClick={() => setSelectedDate(isoDate)}
                      className={`min-h-11 p-0.5 border rounded-lg flex flex-col items-start justify-start relative transition-all text-left ${
                        !isCurrentMonth
                          ? 'bg-transparent border-transparent opacity-25'
                          : isSelected
                          ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10 ring-2 ring-primary/15'
                          : isToday
                          ? 'bg-primary border-primary shadow-lg shadow-primary/20 scale-[1.01] z-10'
                          : eventsOnDay.length > 0
                          ? 'bg-primary/5 border-primary/20 hover:border-primary/40'
                          : 'border-border/50 hover:bg-secondary/50'
                      }`}
                    >
                      <div className={`text-caption font-bold ${isToday ? 'text-white' : 'text-muted-foreground'}`}>{cell.getDate()}</div>
                      <div className="mt-auto space-y-1 w-full">
                        {eventsOnDay.slice(0, 2).map((event) => (
                          <div key={event.id} className={`h-1.5 rounded-full ${isToday ? 'bg-white/70' : event.type === 'event' ? 'bg-primary/60' : 'bg-amber-500/60'}`} />
                        ))}
                        {eventsOnDay.length > 2 && (
                          <div className={`text-[10px] font-bold ${isToday ? 'text-white/80' : 'text-primary'}`}>
                            +{eventsOnDay.length - 2} more
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {nextSevenDays.map((date) => {
                const isoDate = date.toISOString().slice(0, 10);
                const dayEvents = filteredEvents.filter((event) => event.date.slice(0, 10) === isoDate);
                return (
                  <button
                    key={isoDate}
                    type="button"
                    onClick={() => setSelectedDate(isoDate)}
                    className={`w-full flex items-center gap-2 p-1.5 rounded-2xl border transition-all text-left ${selectedDate === isoDate ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 hover:bg-secondary/40'}`}
                  >
                    <div className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center shrink-0 ${isoDate === today.toISOString().slice(0, 10) ? 'bg-primary text-white' : 'bg-secondary/60 text-foreground'}`}>
                      <span className="text-[10px] font-black uppercase tracking-wider">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className="text-base font-black leading-none">{date.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-body-sm font-bold text-foreground">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        <span className="text-caption text-muted-foreground">{dayEvents.length} item{dayEvents.length === 1 ? '' : 's'}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {dayEvents.slice(0, 3).map((event) => (
                          <span key={event.id} className={`filter-chip inactive text-[11px] ${event.type === 'event' ? '' : 'border-amber-500/30 text-amber-600'}`}>
                            {event.title}
                          </span>
                        ))}
                        {dayEvents.length === 0 && <span className="text-caption text-muted-foreground">No events yet</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bento-section space-y-1.5 p-2 md:p-2.5">
            <div className="bento-header flex items-center justify-between">
              <div className="bento-title-wrapper">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h2 className="bento-title">Detailed Day View</h2>
              </div>
              {selectedDayEvents.length > 0 && (
                <button 
                  onClick={() => {
                    // Logic to sync all day events could go here
                  }}
                  className="btn-ghost p-2 text-primary"
                  title="Sync day to Google"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-border/50 bg-secondary/20 p-2.5 space-y-1">
              <p className="text-caption font-black uppercase tracking-widest text-muted-foreground">Focus Agenda</p>
              <h3 className="text-h4 font-bold text-foreground leading-tight">{selectedDateLabel}</h3>
              <div className="flex items-center gap-3">
                <p className="text-body-sm text-muted-foreground">{selectedDayEvents.length} item{selectedDayEvents.length === 1 ? '' : 's'} scheduled.</p>
                <div className="h-4 w-px bg-border/50" />
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add item
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-[25rem] overflow-auto pr-1">
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-6 opacity-60 bg-secondary/10 rounded-2xl border border-dashed border-border">
                  <CalendarIcon className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-caption font-bold">Your agenda is clear</p>
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-3 btn-secondary px-4 py-2 text-xs"
                  >
                    Add something
                  </button>
                </div>
              ) : (
                selectedDayEvents.map((event) => (
                  <div key={event.id} className="group relative bg-secondary/30 rounded-2xl border border-border/50 p-3 hover:border-primary/30 transition-all">
                    <div className="flex gap-3">
                      <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-secondary flex items-center justify-center border border-border/50">
                        {event.image ? (
                          <img src={event.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${event.type === 'reminder' ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                            {event.type === 'reminder' ? <Bell className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-body-sm font-bold text-foreground group-hover:text-primary transition-colors">
                              {event.title}
                            </p>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md border ${
                              event.type === 'event' ? 'bg-primary/5 border-primary/20 text-primary' : 
                              event.type === 'personal' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                              'bg-amber-50 border-amber-200 text-amber-600'
                            }`}>
                              {event.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleGoogleSync(event)}
                              className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                              title="Sync to Google Calendar"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                            {event.type !== 'event' && (
                              <button 
                                onClick={() => removePersonalEvent(event.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-all"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                            <Clock3 className="w-3 h-3 text-primary/70" />
                            <span>{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
                            <MapPin className="w-3 h-3 text-primary/70" />
                            <span className="truncate">{event.location.venue || (event.isVirtual ? 'Virtual' : 'No location')}</span>
                          </div>
                        </div>

                        {event.description && (
                          <p className="mt-2 text-[11px] text-muted-foreground line-clamp-2 italic border-l-2 border-primary/20 pl-2">
                            {event.description}
                          </p>
                        )}

                        {event.type === 'event' && (
                          <Link 
                            to={`/app/events/${event.id}`}
                            className="mt-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-background border border-border/50 text-[10px] font-bold text-foreground hover:border-primary/30 transition-all"
                          >
                            <span>View Event Details</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bento-section space-y-1.5 p-2 md:p-2.5">
            <div className="bento-header">
              <div className="bento-title-wrapper">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="bento-title">Upcoming</h2>
              </div>
            </div>

            <div className="space-y-1">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-3 opacity-50">
                  <CalendarIcon className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-caption font-bold">No events scheduled</p>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="activity-item p-1.5 group">
                    <div className="activity-icon-wrapper overflow-hidden border-0 scale-90 w-8 h-8">
                      {event.image ? (
                        <img src={event.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                          <CalendarIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{event.title}</p>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground mt-0.5">
                        <Clock3 className="w-3 h-3" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{event.location.city || 'Virtual'}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleGoogleSync(event)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <Link to="/app/discover" className="block w-full mt-4 text-center py-2.5 text-caption font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl border border-dashed border-primary/20 transition-all">
              Discover more
            </Link>
          </div>

          <div className="surface-panel p-2 flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-2 text-caption font-black uppercase tracking-widest text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              {bookings.length} confirmed • {stats.personalCount} personal
            </div>
            <Link to="/app/discover" className="btn-secondary px-4 py-2 text-sm">
              <Ticket className="w-4 h-4" />
              Find events
            </Link>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <CalendarAddEventModal 
          onClose={() => setIsAddModalOpen(false)} 
          initialDate={selectedDate || undefined}
        />
      )}
    </div>
  );
}
