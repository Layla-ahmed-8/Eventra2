import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, Eye } from 'lucide-react';
import { mockEvents } from '../../data/mockData';
import { demoToast } from '../../lib/demoFeedback';

const FLAGGED_IDS = new Set(['event-001', 'event-005']);

export default function AdminEvents() {
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set(mockEvents.slice(0, 5).map((e) => e.id)));
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [, setRejectedIds] = useState<string[]>([]);
  const [tab, setTab] = useState<'all' | 'flagged'>('all');

  const pendingEvents = useMemo(() => {
    return mockEvents.filter((e) => {
      if (!pendingIds.has(e.id)) return false;
      if (tab === 'flagged' && !FLAGGED_IDS.has(e.id)) return false;
      return true;
    });
  }, [pendingIds, tab]);

  const approvedEvents = useMemo(
    () => approvedIds.map((id) => mockEvents.find((e) => e.id === id)).filter(Boolean) as typeof mockEvents,
    [approvedIds]
  );

  const approve = (id: string) => {
    setPendingIds((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
    setApprovedIds((prev) => (prev.includes(id) ? prev : [id, ...prev]));
    demoToast('Event approved', 'It is now visible to attendees in this demo.');
  };

  const reject = (id: string) => {
    setPendingIds((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
    setRejectedIds((prev) => (prev.includes(id) ? prev : [id, ...prev]));
    demoToast('Event rejected', 'Organizer would be notified in a production build.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold text-foreground">Event Moderation</h1>
        <p className="text-body text-muted-foreground mt-1">Review and approve submitted events</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending', value: pendingEvents.length, icon: Calendar, color: 'text-orange-600', bg: 'icon-box-orange' },
          { label: 'Approved', value: approvedEvents.length, icon: Check, color: 'text-green-600', bg: 'icon-box-green' },
          { label: 'Flagged', value: FLAGGED_IDS.size, icon: X, color: 'text-red-600', bg: 'icon-box-red' },
          { label: 'Total Events', value: mockEvents.length, icon: Eye, color: 'text-primary', bg: 'icon-box-primary' },
        ].map((stat) => (
          <div key={stat.label} className="kpi-card">
            <div className="flex items-center justify-between">
              <div className={`icon-box ${stat.bg}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="kpi-value">{stat.value}</p>
              <p className="kpi-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bento-section">
        <div className="bento-header">
          <div className="bento-title-wrapper">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="bento-title">Pending approval</h2>
          </div>
          <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
            {(['all', 'flagged'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 rounded-lg text-caption font-bold transition-all ${tab === t ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {pendingEvents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-body-sm">
            No events in this queue. Switch tabs or check back later.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingEvents.map((event) => (
              <div key={event.id} className="card-surface p-5 hover:border-primary/20 transition-all">
                <div className="flex flex-col gap-5 lg:flex-row">
                  <div className="relative w-full lg:w-40 h-40 flex-shrink-0 overflow-hidden rounded-2xl">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <span className="status-pill bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-body font-bold text-foreground leading-tight">{event.title}</h3>
                        <p className="text-caption text-muted-foreground mt-1">
                          Organizer: <span className="text-foreground font-semibold">{event.organizer.name}</span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {FLAGGED_IDS.has(event.id) && (
                          <span className="status-pill bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 font-black uppercase text-[10px]">
                            Flagged
                          </span>
                        )}
                        <span className="status-pill bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 font-black uppercase text-[10px]">
                          Pending
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</p>
                        <p className="text-body-sm font-bold text-foreground">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capacity</p>
                        <p className="text-body-sm font-bold text-foreground">{event.capacity}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Price</p>
                        <p className="text-body-sm font-bold text-foreground">{event.price === 0 ? 'Free' : `EGP ${event.price}`}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</p>
                        <p className="text-body-sm font-bold text-foreground truncate">{event.location.city}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                      <button type="button" onClick={() => approve(event.id)} className="btn-primary text-body-sm inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700">
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button type="button" onClick={() => reject(event.id)} className="btn-secondary text-body-sm inline-flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:border-red-200">
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                      <Link to={`/app/events/${event.id}`} className="btn-secondary text-body-sm inline-flex items-center gap-1.5 ml-auto">
                        <Eye className="w-4 h-4" />
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bento-section">
        <div className="bento-header">
          <div className="bento-title-wrapper">
            <Check className="w-5 h-5 text-green-500" />
            <h2 className="bento-title">Recently approved</h2>
          </div>
        </div>
        {approvedEvents.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground text-body-sm">No events approved in this session.</p>
        ) : (
          <div className="space-y-3">
            {approvedEvents.map((event) => (
              <div key={event.id} className="activity-item">
                <div className="activity-icon-wrapper overflow-hidden border-0">
                  <img src={event.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-body-sm font-bold text-foreground truncate">{event.title}</p>
                    <span className="status-pill bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 font-black uppercase text-[9px]">Approved</span>
                  </div>
                  <p className="text-caption text-muted-foreground">{event.organizer.name} • {new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
