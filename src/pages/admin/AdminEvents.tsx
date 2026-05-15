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

      <div className="surface-panel p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-h2 font-semibold text-foreground">
            Pending approval ({pendingEvents.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab('all')}
              className={tab === 'all' ? 'btn-primary' : 'btn-secondary'}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setTab('flagged')}
              className={tab === 'flagged' ? 'btn-primary' : 'btn-secondary'}
            >
              Flagged
            </button>
          </div>
        </div>

        {pendingEvents.length === 0 ? (
          <p className="text-body-sm text-muted-foreground py-6 text-center">No events in this queue. Switch tabs or check back later.</p>
        ) : (
          <div className="space-y-4">
            {pendingEvents.map((event) => (
              <div
                key={event.id}
                className="surface-panel border border-border p-6 hover:border-[#6C4CF1] transition-colors"
              >
                <div className="flex flex-col gap-6 lg:flex-row">
                  <img src={event.image} alt={event.title} className="w-full lg:w-32 h-32 object-cover rounded-3xl" />

                  <div className="flex-1">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-3">
                      <div>
                        <h3 className="text-h3 font-semibold text-foreground mb-1">{event.title}</h3>
                        <p className="text-body text-muted-foreground">
                          by {event.organizer.name} • {event.category}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="status-pill bg-yellow-100 text-yellow-700">Pending</span>
                        {FLAGGED_IDS.has(event.id) && (
                          <span className="status-pill bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">Flagged</span>
                        )}
                      </div>
                    </div>

                    <p className="text-body text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-caption text-muted-foreground">Date</p>
                        <p className="font-semibold text-foreground">{new Date(event.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-caption text-muted-foreground">Capacity</p>
                        <p className="font-semibold text-foreground">{event.capacity}</p>
                      </div>
                      <div>
                        <p className="text-caption text-muted-foreground">Price</p>
                        <p className="font-semibold text-foreground">{event.price === 0 ? 'Free' : `EGP ${event.price}`}</p>
                      </div>
                      <div>
                        <p className="text-caption text-muted-foreground">Location</p>
                        <p className="font-semibold text-foreground">{event.location.city}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button type="button" onClick={() => approve(event.id)} className="btn-primary bg-green-600 hover:bg-green-700">
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button type="button" onClick={() => reject(event.id)} className="btn-primary bg-red-600 hover:bg-red-700">
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                      <Link to={`/app/events/${event.id}`} className="btn-secondary flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="surface-panel p-6">
        <h2 className="text-h2 font-semibold text-foreground mb-4">Recently approved</h2>
        {approvedEvents.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">Approve events above to populate this list.</p>
        ) : (
          <div className="space-y-3">
            {approvedEvents.map((event) => (
              <div
                key={event.id}
                className="surface-panel p-4 border border-border flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img src={event.image} alt={event.title} className="w-16 h-16 object-cover rounded-3xl flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{event.title}</p>
                    <p className="text-body text-muted-foreground">
                      {event.organizer.name} • {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="status-pill bg-green-100 text-green-700 flex-shrink-0">Approved</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
