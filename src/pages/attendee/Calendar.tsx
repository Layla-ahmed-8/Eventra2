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
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function Calendar() {
  const { events, rsvpedEvents, bookings } = useAppStore();
  const [view, setView] = useState<'month' | 'week'>('month');
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventFilter, setEventFilter] = useState<'all' | 'upcoming' | 'virtual' | 'in-person'>('all');

  const userEvents = useMemo(() => {
    return events
      .filter((event) => rsvpedEvents.includes(event.id))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, rsvpedEvents]);

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
    return userEvents.filter((event) => {
      const eventDate = new Date(event.date);
      const isUpcoming = eventDate.getTime() >= todayStart.getTime();
      return (
        eventFilter === 'all' ||
        (eventFilter === 'upcoming' && isUpcoming) ||
        (eventFilter === 'virtual' && event.location.isVirtual) ||
        (eventFilter === 'in-person' && !event.location.isVirtual)
      );
    });
  }, [eventFilter, todayStart, userEvents]);

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
    const virtualCount = userEvents.filter((event) => event.location.isVirtual).length;
    const inPersonCount = userEvents.length - virtualCount;
    const monthCount = monthEvents.length;
    return { virtualCount, inPersonCount, monthCount };
  }, [monthEvents.length, userEvents]);

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

          <div className="flex flex-wrap gap-2">
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
            <span className="kpi-label">Saved events</span>
            <div className="kpi-value text-lg">{userEvents.length}</div>
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
            <span className="kpi-label">In person</span>
            <div className="kpi-value text-lg">{stats.inPersonCount}</div>
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
                          <div key={event.id} className={`h-1.5 rounded-full ${isToday ? 'bg-white/70' : 'bg-primary/60'}`} />
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
                        <span className="text-caption text-muted-foreground">{dayEvents.length} event{dayEvents.length === 1 ? '' : 's'}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {dayEvents.slice(0, 3).map((event) => (
                          <span key={event.id} className="filter-chip inactive text-[11px]">
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
            <div className="bento-header">
              <div className="bento-title-wrapper">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <h2 className="bento-title">Agenda</h2>
              </div>
            </div>

            <div className="rounded-2xl border border-border/50 bg-secondary/20 p-1.5 space-y-0.5">
              <p className="text-caption font-black uppercase tracking-widest text-muted-foreground">Selected day</p>
              <h3 className="text-h4 font-bold text-foreground leading-tight">{selectedDateLabel}</h3>
              <p className="text-body-sm text-muted-foreground">{selectedDayEvents.length} event{selectedDayEvents.length === 1 ? '' : 's'} scheduled.</p>
            </div>

            <div className="space-y-0.5 max-h-[13rem] overflow-auto pr-1">
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-3 opacity-60">
                  <CalendarIcon className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-caption font-bold">Pick a day to view events</p>
                </div>
              ) : (
                selectedDayEvents.map((event) => (
                  <Link key={event.id} to={`/app/events/${event.id}`} className="activity-item p-1 group">
                    <div className="activity-icon-wrapper overflow-hidden border-0 scale-90 w-8 h-8">
                      <img src={event.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{event.title}</p>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground mt-0.5">
                        <Clock3 className="w-3 h-3" />
                        <span>{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{event.location.city}</span>
                      </div>
                    </div>
                  </Link>
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

            <div className="space-y-0.5">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-3 opacity-50">
                  <CalendarIcon className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-caption font-bold">No events scheduled</p>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <Link key={event.id} to={`/app/events/${event.id}`} className="activity-item p-1 group">
                    <div className="activity-icon-wrapper overflow-hidden border-0 scale-90 w-8 h-8">
                      <img src={event.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{event.title}</p>
                      <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground mt-0.5">
                        <Clock3 className="w-3 h-3" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        <span>•</span>
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{event.location.city}</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <Link to="/app/discover" className="block w-full mt-6 text-center py-3 text-caption font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-xl border border-dashed border-primary/20 transition-all">
              Discover more
            </Link>
          </div>

          <div className="surface-panel p-2 flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-2 text-caption font-black uppercase tracking-widest text-muted-foreground">
              <Users className="w-4 h-4" />
              {bookings.length} bookings • {stats.virtualCount} virtual • {stats.inPersonCount} in person
            </div>
            <Link to="/app/discover" className="btn-secondary px-4 py-2 text-sm">
              <Ticket className="w-4 h-4" />
              Find more events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
