<<<<<<< Updated upstream
import { Search, UserX, Award, Eye, Filter } from 'lucide-react';
=======
import { useMemo, useState } from 'react';
import { Search, UserX, Award, Eye, Filter, CheckCircle, XCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { demoToast } from '../../lib/demoFeedback';
>>>>>>> Stashed changes

const mockUsers = [
  { id: 1, name: 'Sarah Ahmed', email: 'sarah@example.com', role: 'attendee', status: 'active', joined: '2026-01-15', events: 12 },
  { id: 2, name: 'Mohamed Ali', email: 'mohamed@example.com', role: 'organizer', status: 'active', joined: '2025-11-20', events: 24 },
  { id: 3, name: 'Tech Cairo', email: 'info@techcairo.com', role: 'organizer', status: 'active', joined: '2025-10-05', events: 38 },
  { id: 4, name: 'Nour Ibrahim', email: 'nour@example.com', role: 'attendee', status: 'suspended', joined: '2026-03-10', events: 3 },
  { id: 5, name: 'Yasmine Khaled', email: 'yasmine@example.com', role: 'attendee', status: 'active', joined: '2026-02-28', events: 8 },
];

export default function AdminUsers() {
<<<<<<< Updated upstream
=======
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

>>>>>>> Stashed changes
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">User Management</h1>
          <p className="text-body text-muted-foreground mt-1">Manage platform users, roles, and access</p>
        </div>
<<<<<<< Updated upstream
        <button className="btn-secondary flex items-center gap-2">
=======
        <button
          type="button"
          className="btn-secondary flex items-center gap-2 self-start sm:self-auto"
          onClick={() => setShowFilters((v) => !v)}
        >
>>>>>>> Stashed changes
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

<<<<<<< Updated upstream
=======
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

>>>>>>> Stashed changes
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C4CF1]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full pl-10 pr-4 input-base"
        />
      </div>
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="surface-panel p-5">
            <p className="text-caption text-muted-foreground mb-1">Total Users</p>
            <p className="text-display font-semibold text-foreground">12,437</p>
          </div>
          <div className="surface-panel p-5">
            <p className="text-caption text-muted-foreground mb-1">Attendees</p>
            <p className="text-display font-semibold text-foreground">11,245</p>
          </div>
          <div className="surface-panel p-5">
            <p className="text-caption text-muted-foreground mb-1">Organizers</p>
            <p className="text-display font-semibold text-foreground">1,180</p>
          </div>
          <div className="surface-panel p-5">
            <p className="text-caption text-muted-foreground mb-1">Suspended</p>
            <p className="text-display font-semibold text-red-600">12</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="surface-panel overflow-hidden">
          <table className="table-surface">
            <thead className="bg-[#F8F5FF] border-b border-[#E9E4FF]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  User
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Events
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
<<<<<<< Updated upstream
            <tbody className="divide-y">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#F8F5FF] transition-colors">
                  <td className="px-6 py-4">
=======
            <tbody className="divide-y divide-border">
              {filteredMockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3">
>>>>>>> Stashed changes
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://i.pravatar.cc/40?img=${user.id}`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === 'organizer'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(user.joined).toLocaleDateString()}
                  </td>
<<<<<<< Updated upstream
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {user.events}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      {user.role === 'attendee' && (
                        <button
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="Grant Organizer"
                        >
                          <Award className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title={user.status === 'active' ? 'Suspend' : 'Activate'}
                      >
                        <UserX className="w-4 h-4 text-gray-600" />
=======
                  <td className="px-4 py-3 text-body-sm font-semibold text-foreground">{user.events}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="View Profile"
                        onClick={() => demoToast('User profile', `${user.name} — demo preview only.`)}
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      {user.role === 'attendee' && (
                        <button
                          type="button"
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Grant Organizer"
                          onClick={() => demoToast('Grant organizer', `Would promote ${user.name} in production.`)}
                        >
                          <Award className="w-4 h-4 text-muted-foreground" />
                        </button>
                      )}
                      <button
                        type="button"
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title={user.status === 'active' ? 'Suspend' : 'Activate'}
                        onClick={() =>
                          demoToast(user.status === 'active' ? 'User suspended' : 'User activated', user.name)
                        }
                      >
                        <UserX className="w-4 h-4 text-muted-foreground" />
>>>>>>> Stashed changes
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
