import { Link } from 'react-router-dom';
import { Check, X, Eye } from 'lucide-react';
import { mockEvents } from '../../data/mockData';

export default function AdminEvents() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-h1 font-bold text-foreground">Event Moderation</h1>
        <p className="text-body text-muted-foreground mt-1">Review and approve submitted events</p>
      </div>
        <div className="surface-panel p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-h2 font-semibold text-foreground">Pending Approval (5)</h2>
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary">All</button>
              <button className="btn-secondary">Flagged</button>
            </div>
          </div>

          <div className="space-y-4">
            {mockEvents.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="surface-panel border border-border p-6 hover:border-[#6C4CF1] transition-colors"
              >
                <div className="flex flex-col gap-6 lg:flex-row">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full lg:w-32 h-32 object-cover rounded-3xl"
                  />

                  <div className="flex-1">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-3">
                      <div>
                        <h3 className="text-h3 font-semibold text-foreground mb-1">
                          {event.title}
                        </h3>
                        <p className="text-body text-muted-foreground">
                          by {event.organizer.name} • {event.category}
                        </p>
                      </div>
                      <span className="status-pill bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    </div>

                    <p className="text-body text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-caption text-muted-foreground">Date</p>
                        <p className="font-semibold text-foreground">
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-caption text-muted-foreground">Capacity</p>
                        <p className="font-semibold text-foreground">{event.capacity}</p>
                      </div>
                      <div>
                        <p className="text-caption text-muted-foreground">Price</p>
                        <p className="font-semibold text-foreground">
                          {event.price === 0 ? 'Free' : `EGP ${event.price}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-caption text-muted-foreground">Location</p>
                        <p className="font-semibold text-foreground">
                          {event.location.city}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button className="btn-primary bg-green-600 hover:bg-green-700">
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                      <button className="btn-primary bg-red-600 hover:bg-red-700">
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                      <Link
                        to={`/app/events/${event.id}`}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-panel p-6">
          <h2 className="text-h2 font-semibold text-foreground mb-4">
            Recently Approved
          </h2>
          <div className="space-y-3">
            {mockEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="surface-panel p-4 border border-border flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-16 h-16 object-cover rounded-3xl"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{event.title}</p>
                    <p className="text-body text-muted-foreground">
                      {event.organizer.name} • {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className="status-pill bg-green-100 text-green-700">
                  Approved
                </span>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
