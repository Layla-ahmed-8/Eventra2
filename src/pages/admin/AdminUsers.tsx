import { Search, UserX, Award, Eye, Filter } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Sarah Ahmed', email: 'sarah@example.com', role: 'attendee', status: 'active', joined: '2026-01-15', events: 12 },
  { id: 2, name: 'Mohamed Ali', email: 'mohamed@example.com', role: 'organizer', status: 'active', joined: '2025-11-20', events: 24 },
  { id: 3, name: 'Tech Cairo', email: 'info@techcairo.com', role: 'organizer', status: 'active', joined: '2025-10-05', events: 38 },
  { id: 4, name: 'Nour Ibrahim', email: 'nour@example.com', role: 'attendee', status: 'suspended', joined: '2026-03-10', events: 3 },
  { id: 5, name: 'Yasmine Khaled', email: 'yasmine@example.com', role: 'attendee', status: 'active', joined: '2026-02-28', events: 8 },
];

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">User Management</h1>
          <p className="text-body text-muted-foreground mt-1">Manage platform users, roles, and access</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C4CF1]" />
        <input
          type="text"
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
            <tbody className="divide-y">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#F8F5FF] transition-colors">
                  <td className="px-6 py-4">
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
