import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, BarChart, Share2, MoreVertical, Calendar } from 'lucide-react';
import { mockEvents } from '../../data/mockData';

export default function OrganizerEvents() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'draft'>('all');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C4CF1]" />
        <input
          type="text"
          placeholder="Search your events..."
          className="w-full pl-10 pr-4 input-base"
        />
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
    </div>
  );
}
