import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, BarChart, Share2, MoreVertical } from 'lucide-react';
import { mockEvents } from '../../data/mockData';

export default function OrganizerEvents() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'draft'>('all');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">My Events</h1>
          <p className="text-body text-muted-foreground mt-1">Manage and track all your events</p>
        </div>
        <Link to="/organizer/events/create" className="btn-primary self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Create Event
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        <input type="text" placeholder="Search your events..." className="w-full pl-10 pr-4 input-base" />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'All', value: 'all' },
          { label: 'Upcoming', value: 'upcoming' },
          { label: 'Past', value: 'past' },
          { label: 'Drafts', value: 'draft' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as any)}
            className={`filter-chip ${filter === tab.value ? 'active' : 'inactive'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Table — scrollable on mobile */}
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
              {mockEvents.slice(0, 5).map((event) => (
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
                    <p className="text-body-sm font-semibold text-foreground">{event.rsvpCount} / {event.capacity}</p>
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
                      <Link to={`/organizer/events/${event.id}/edit`} className="btn-ghost p-2" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <Link to={`/organizer/events/${event.id}/manage`} className="btn-ghost p-2" title="Manage">
                        <BarChart className="w-4 h-4" />
                      </Link>
                      <button className="btn-ghost p-2" title="Share">
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
      </div>
    </div>
  );
}
