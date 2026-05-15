import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, BarChart, Share2, MoreVertical } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { demoToast, shareOrCopyLink } from '../../lib/demoFeedback';

export default function OrganizerEvents() {
  const { events } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'draft'>('all');
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const now = new Date();
    let list = [...events];
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((e) => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
    if (filter === 'upcoming') list = list.filter((e) => new Date(e.date) >= now);
    if (filter === 'past') list = list.filter((e) => new Date(e.date) < now);
    if (filter === 'draft') list = [];
    return list;
  }, [events, filter, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">My Events</h1>
          <p className="text-body text-muted-foreground mt-1">Manage and track all your events</p>
        </div>
        <Link
          to="/organizer/events/create"
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
      </div>

      <div className="bento-section">
        <div className="bento-header flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
            {[
              { label: 'All', value: 'all' as const },
              { label: 'Upcoming', value: 'upcoming' as const },
              { label: 'Past', value: 'past' as const },
              { label: 'Drafts', value: 'draft' as const },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-caption font-bold transition-all ${filter === tab.value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your events..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-body-sm"
            />
          </div>
        </div>

        {filter === 'draft' && (
          <div className="text-center py-12 text-muted-foreground text-body-sm">
            No drafts in this demo.{' '}
            <Link to="/organizer/events/create" className="text-primary font-bold hover:underline">
              Start a new event
            </Link>
          </div>
        )}

        {filter !== 'draft' && (
          <div className="overflow-x-auto">
            <table className="table-surface min-w-[800px]">
              <thead className="bg-secondary border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-caption font-black text-foreground uppercase tracking-widest">Event</th>
                  <th className="px-4 py-3 text-left text-caption font-black text-foreground uppercase tracking-widest">Date</th>
                  <th className="px-4 py-3 text-left text-caption font-black text-foreground uppercase tracking-widest">Attendees</th>
                  <th className="px-4 py-3 text-left text-caption font-black text-foreground uppercase tracking-widest">Revenue</th>
                  <th className="px-4 py-3 text-left text-caption font-black text-foreground uppercase tracking-widest">Status</th>
                  <th className="px-4 py-3 text-right text-caption font-black text-foreground uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((event) => (
                  <tr key={event.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={event.image} alt={event.title} className="w-12 h-12 object-cover rounded-xl flex-shrink-0 border border-border" />
                        <div className="min-w-0">
                          <p className="text-body-sm font-bold text-foreground line-clamp-1">{event.title}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{event.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-caption font-bold text-foreground whitespace-nowrap">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-body-sm font-bold text-foreground">
                        {event.rsvpCount} / {event.capacity}
                      </p>
                      <p className="text-[10px] font-black text-muted-foreground">{Math.round((event.rsvpCount / event.capacity) * 100)}% filled</p>
                    </td>
                    <td className="px-4 py-3 text-body-sm font-black text-foreground whitespace-nowrap">
                      EGP {(event.rsvpCount * event.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="status-pill bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 font-black uppercase text-[10px]">Published</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/organizer/events/${event.id}/manage`} className="btn-ghost p-2" title="Edit & details">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link to={`/organizer/events/${event.id}/manage`} className="btn-ghost p-2" title="Manage">
                          <BarChart className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          className="btn-ghost p-2"
                          title="Share"
                          onClick={() =>
                            shareOrCopyLink(event.title, event.title, `${window.location.origin}/app/events/${event.id}`)
                          }
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="btn-ghost p-2"
                          title="More"
                          onClick={() => demoToast('More options', 'Duplicate, archive, and cancel are demo placeholders.')}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {rows.length === 0 && filter !== 'draft' && (
          <div className="p-12 text-center text-body-sm text-muted-foreground font-bold">No events match this filter or search.</div>
        )}
      </div>
    </div>
  );
}
