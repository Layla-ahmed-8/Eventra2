import { Search, UserX, Award, Eye, Filter, CheckCircle, XCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">User Management</h1>
          <p className="text-body text-muted-foreground mt-1">Manage platform users, roles, and access</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 self-start sm:self-auto">
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full pl-10 pr-4 input-base"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="surface-panel p-4 sm:p-5">
          <p className="text-caption text-muted-foreground mb-1">Total Users</p>
          <p className="text-display font-semibold text-foreground">12,437</p>
        </div>
        <div className="surface-panel p-4 sm:p-5">
          <p className="text-caption text-muted-foreground mb-1">Attendees</p>
          <p className="text-display font-semibold text-foreground">11,245</p>
        </div>
        <div className="surface-panel p-4 sm:p-5">
          <p className="text-caption text-muted-foreground mb-1">Organizers</p>
          <p className="text-display font-semibold text-foreground">1,180</p>
        </div>
        <div className="surface-panel p-4 sm:p-5">
          <p className="text-caption text-muted-foreground mb-1">Suspended</p>
          <p className="text-display font-semibold text-red-600">12</p>
        </div>
      </div>

      {/* Users Table — scrollable on mobile */}
      <div className="surface-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-surface min-w-[640px]">
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
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/40?img=${user.id}`}
                        alt={user.name}
                        className="w-9 h-9 rounded-full flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-body-sm font-semibold text-foreground truncate">{user.name}</p>
                        <p className="text-caption text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`status-pill ${user.role === 'organizer' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`status-pill ${user.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-body-sm text-muted-foreground whitespace-nowrap">
                    {new Date(user.joined).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-body-sm font-semibold text-foreground">{user.events}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="View Profile">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      {user.role === 'attendee' && (
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Grant Organizer">
                          <Award className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors" title={user.status === 'active' ? 'Suspend' : 'Activate'}>
                        <UserX className="w-4 h-4 text-muted-foreground" />
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
