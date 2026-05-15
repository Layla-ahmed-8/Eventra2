import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< Updated upstream
import { Plus, Search, Edit, BarChart, Share2, MoreVertical, Calendar } from 'lucide-react';
import { mockEvents } from '../../data/mockData';
=======
import { Plus, Search, Edit, BarChart, Share2, MoreVertical } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { demoToast, shareOrCopyLink } from '../../lib/demoFeedback';
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
=======
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
>>>>>>> Stashed changes
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

      <div className="relative">
<<<<<<< Updated upstream
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C4CF1]" />
        <input
          type="text"
=======
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
>>>>>>> Stashed changes
          placeholder="Search your events..."
          className="w-full pl-10 pr-4 input-base"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: 'All', value: 'all' as const },
          { label: 'Upcoming', value: 'upcoming' as const },
          { label: 'Past', value: 'past' as const },
          { label: 'Drafts', value: 'draft' as const },
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setFilter(tab.value)}
            className={`filter-chip ${filter === tab.value ? 'active' : 'inactive'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
<<<<<<< Updated upstream
        {/* Events Table */}
        <div className="surface-panel overflow-hidden">
          <table className="table-surface">
            <thead className="bg-[#F8F5FF] border-b border-[#E9E4FF]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Event
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Attendees
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Revenue
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockEvents.slice(0, 5).map((event, index) => (
                <tr key={event.id} className="hover:bg-[#F8F5FF] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-16 h-16 object-cover rounded-3xl"
                      />
                      <div>
                        <p className="font-semibold text-foreground line-clamp-1">
                          {event.title}
                        </p>
                        <p className="text-body text-muted-foreground">{event.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-body text-foreground">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-foreground">
                      {event.rsvpCount} / {event.capacity}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {Math.round((event.rsvpCount / event.capacity) * 100)}% filled
                    </p>
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    EGP {(event.rsvpCount * event.price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="status-pill bg-green-100 text-green-700">Published</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/organizer/events/${event.id}/edit`}
                        className="btn-ghost p-2"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/organizer/events/${event.id}/manage`}
                        className="btn-ghost p-2"
                        title="Manage"
                      >
                        <BarChart className="w-4 h-4" />
                      </Link>
                      <button
                        className="btn-ghost p-2"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="btn-ghost p-2">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
=======

      {filter === 'draft' && (
        <div className="surface-panel p-8 text-center text-body-sm text-muted-foreground">
          No drafts in this demo.{' '}
          <Link to="/organizer/events/create" className="text-primary font-semibold hover:underline">
            Start a new event
          </Link>
        </div>
      )}

      {filter !== 'draft' && (
        <div className="surface-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-surface min-w-[700px]">
              <thead className="bg-secondary border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">Event</th>
                  <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">Attendees</th>
                  <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">Revenue</th>
                  <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">Status</th>
                  <th className="px-4 py-3 text-right text-caption font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((event) => (
                  <tr key={event.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={event.image} alt={event.title} className="w-12 h-12 object-cover rounded-xl flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-body-sm font-semibold text-foreground line-clamp-1">{event.title}</p>
                          <p className="text-caption text-muted-foreground">{event.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body-sm text-foreground whitespace-nowrap">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-body-sm font-semibold text-foreground">
                        {event.rsvpCount} / {event.capacity}
                      </p>
                      <p className="text-caption text-muted-foreground">{Math.round((event.rsvpCount / event.capacity) * 100)}% filled</p>
                    </td>
                    <td className="px-4 py-3 text-body-sm font-semibold text-foreground whitespace-nowrap">
                      EGP {(event.rsvpCount * event.price).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="status-pill bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">Published</span>
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
          {rows.length === 0 && (
            <div className="p-8 text-center text-body-sm text-muted-foreground">No events match this filter or search.</div>
          )}
        </div>
      )}
>>>>>>> Stashed changes
    </div>
  );
}
