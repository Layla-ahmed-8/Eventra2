
import { useMemo, useState } from 'react';
import { Search, UserX, Award, Eye, Filter, CheckCircle, XCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { demoToast } from '../../lib/demoFeedback';

const mockUsers = [
  { id: 1, name: 'Sarah Ahmed', email: 'sarah@example.com', role: 'attendee', status: 'active', joined: '2026-01-15', events: 12 },
  { id: 2, name: 'Mohamed Ali', email: 'mohamed@example.com', role: 'organizer', status: 'active', joined: '2025-11-20', events: 24 },
  { id: 3, name: 'Tech Cairo', email: 'info@techcairo.com', role: 'organizer', status: 'active', joined: '2025-10-05', events: 38 },
  { id: 4, name: 'Nour Ibrahim', email: 'nour@example.com', role: 'attendee', status: 'suspended', joined: '2026-03-10', events: 3 },
  { id: 5, name: 'Yasmine Khaled', email: 'yasmine@example.com', role: 'attendee', status: 'active', joined: '2026-02-28', events: 8 },
];

export default function AdminUsers() {

  const { organizerRequests, approveOrganizerRequest, rejectOrganizerRequest } = useAppStore();
  const pendingOrganizer = organizerRequests.filter((r) => r.status === 'pending');
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState<'all' | 'attendee' | 'organizer'>('all');
  const [query, setQuery] = useState('');

  const filteredMockUsers = useMemo(() => {
    return mockUsers.filter((u) => {
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      const q = query.trim().toLowerCase();
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [roleFilter, query]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">User Management</h1>
          <p className="text-body text-muted-foreground mt-1">Manage platform users, roles, and access</p>
        </div>

        <button
          type="button"
          className="btn-secondary flex items-center gap-2 self-start sm:self-auto"
          onClick={() => setShowFilters((v) => !v)}
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>


      {pendingOrganizer.length > 0 && (
        <div className="surface-panel p-5 sm:p-6 border border-primary/20">
          <h2 className="text-h3 font-bold text-foreground mb-1">Pending organizer requests</h2>
          <p className="text-body-sm text-muted-foreground mb-4">
            Approve or reject requests to become an event organizer. The applicant receives an in-app notification.
          </p>
          <ul className="space-y-3">
            {pendingOrganizer.map((req) => (
              <li
                key={req.id}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 p-4 rounded-xl bg-secondary/40 border border-border"
              >
                <div className="min-w-0">
                  <p className="text-body-sm font-semibold text-foreground">{req.userName}</p>
                  <p className="text-caption text-muted-foreground truncate">{req.eventTitle}</p>
                  <p className="text-caption text-muted-foreground mt-1 line-clamp-2">{req.reason}</p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <button
                    type="button"
                    className="btn-primary text-body-sm inline-flex items-center gap-1"
                    onClick={() => {
                      const notes = window.prompt('Optional notes for the applicant (shown in their notification):', 'Welcome to the organizer program.');
                      if (notes === null) return;
                      approveOrganizerRequest(req.id, notes || '');
                    }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn-secondary text-body-sm inline-flex items-center gap-1"
                    onClick={() => {
                      const notes = window.prompt('Reason for rejection (sent to applicant):', '');
                      if (notes === null) return;
                      rejectOrganizerRequest(req.id, notes || 'No additional details.');
                    }}
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showFilters && (
        <div className="surface-panel p-4 flex flex-wrap gap-2 items-center">
          <span className="text-caption font-semibold text-muted-foreground">Role:</span>
          {(['all', 'attendee', 'organizer'] as const).map((r) => (
            <button
              key={r}
              type="button"
              className={`filter-chip ${roleFilter === r ? 'active' : 'inactive'}`}
              onClick={() => setRoleFilter(r)}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full pl-10 pr-4 input-base"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '12,437', color: 'text-foreground' },
          { label: 'Attendees', value: '11,245', color: 'text-foreground' },
          { label: 'Organizers', value: '1,180', color: 'text-foreground' },
          { label: 'Suspended', value: '12', color: 'text-red-500' },
        ].map((stat) => (
          <div key={stat.label} className="kpi-card">
            <p className="kpi-label">{stat.label}</p>
            <p className={`text-h2 font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="surface-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-surface min-w-[800px]">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">User</th>
                <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">Role</th>
                <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">Joined</th>
                <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">Events</th>
                <th className="px-4 py-3 text-right text-caption font-semibold text-foreground">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredMockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/40?img=${user.id}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full border border-border"
                      />
                      <div className="min-w-0">
                        <p className="text-body-sm font-bold text-foreground truncate">{user.name}</p>
                        <p className="text-caption text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`status-pill uppercase text-[10px] font-black ${
                        user.role === 'organizer'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`status-pill uppercase text-[10px] font-black ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-caption font-medium text-muted-foreground">
                    {new Date(user.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>

                  <td className="px-4 py-3 text-body-sm font-bold text-foreground">{user.events}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="btn-ghost p-2"
                        title="View Profile"
                        onClick={() => demoToast('User profile', `${user.name} — demo preview only.`)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {user.role === 'attendee' && (
                        <button
                          type="button"
                          className="btn-ghost p-2"
                          title="Grant Organizer"
                          onClick={() => demoToast('Grant organizer', `Would promote ${user.name} in production.`)}
                        >
                          <Award className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-ghost p-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                        title={user.status === 'active' ? 'Suspend' : 'Activate'}
                        onClick={() =>
                          demoToast(user.status === 'active' ? 'User suspended' : 'User activated', user.name)
                        }
                      >
                        <UserX className="w-4 h-4" />
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

