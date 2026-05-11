import { Link } from 'react-router-dom';
import { Users, Calendar, TrendingUp, AlertCircle, Activity, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-h1 font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-body text-muted-foreground mt-1">Platform overview and real-time activity</p>
      </div>

      {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Users className="w-5 h-5 text-[#6C4CF1]" />
              </div>
              <span className="status-pill text-green-700 bg-green-100">+15%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">12.4K</p>
            <p className="text-caption text-muted-foreground">Total Users</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#00C2FF]" />
              </div>
              <span className="status-pill text-green-700 bg-green-100">+24%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">847</p>
            <p className="text-caption text-muted-foreground">Active Events</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#FF8A00]" />
              </div>
              <span className="status-pill text-green-700 bg-green-100">+32%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">EGP 2.4M</p>
            <p className="text-caption text-muted-foreground">Platform Revenue</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <span className="status-pill text-red-700 bg-red-100">8 pending</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">24</p>
            <p className="text-caption text-muted-foreground">Flags & Reports</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Real-time Activity */}
          <div className="md:col-span-2">
            <div className="surface-panel p-5 mb-6">
              <div className="panel-header">
                <h2 className="text-h2 font-semibold text-foreground">Real-time Activity</h2>
                <Activity className="w-5 h-5 text-green-500 animate-pulse" />
              </div>

              <div className="space-y-3">
                {[
                  {
                    action: 'New user registration',
                    user: 'Sarah Ahmed',
                    time: 'Just now',
                    type: 'user',
                  },
                  {
                    action: 'Event published',
                    user: 'Tech Cairo',
                    time: '2 minutes ago',
                    type: 'event',
                  },
                  {
                    action: 'Payment processed',
                    user: 'Mohamed Ali',
                    time: '5 minutes ago',
                    type: 'payment',
                  },
                  {
                    action: 'Event flagged for review',
                    user: 'System',
                    time: '8 minutes ago',
                    type: 'flag',
                  },
                  {
                    action: 'New organizer account',
                    user: 'Cairo Events Co',
                    time: '12 minutes ago',
                    type: 'organizer',
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="surface-panel p-3 flex items-center gap-4 border border-border"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === 'flag' ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-body text-foreground">
                        <span className="font-semibold text-foreground">{activity.action}</span> •{' '}
                        {activity.user}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Growth Chart */}
            <div className="surface-panel p-5">
              <h2 className="text-h2 font-semibold text-foreground mb-6">
                User Growth (Last 30 Days)
              </h2>
              <div className="h-64 flex items-end justify-between gap-2">
                {Array.from({ length: 30 }, (_, i) => {
                  const height = 30 + Math.random() * 70;
                  return (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div
                        className="bg-gradient-to-t from-[#6C4CF1] to-[#00C2FF] rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="surface-panel p-6">
              <h3 className="text-h2 font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/admin/events"
                  className="btn-primary w-full"
                >
                  Review Events
                </Link>
                <Link
                  to="/admin/users"
                  className="btn-secondary w-full"
                >
                  Manage Users
                </Link>
                <Link
                  to="/admin/community"
                  className="btn-secondary w-full"
                >
                  Moderate Content
                </Link>
                <Link
                  to="/admin/analytics"
                  className="btn-secondary w-full"
                >
                  View Analytics
                </Link>
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="surface-panel p-6">
              <h3 className="text-h2 font-semibold text-foreground mb-4">Pending Reviews</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-body text-muted-foreground">Events</span>
                  <span className="status-pill bg-orange-100 text-orange-700">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body text-muted-foreground">User Reports</span>
                  <span className="status-pill bg-red-100 text-red-700">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body text-muted-foreground">Flagged Posts</span>
                  <span className="status-pill bg-yellow-100 text-yellow-700">8</span>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="surface-panel p-6">
              <h3 className="text-h2 font-semibold text-foreground mb-4">System Health</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-body mb-1">
                    <span className="text-muted-foreground">API Status</span>
                    <span className="text-green-600 font-semibold">Healthy</span>
                  </div>
                  <div className="h-2 bg-[#F4F3FF] rounded-full">
                    <div className="h-full w-full bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-body mb-1">
                    <span className="text-muted-foreground">Database</span>
                    <span className="text-green-600 font-semibold">98%</span>
                  </div>
                  <div className="h-2 bg-[#F4F3FF] rounded-full">
                    <div className="h-full w-[98%] bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-body mb-1">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="text-yellow-600 font-semibold">72%</span>
                  </div>
                  <div className="h-2 bg-[#F4F3FF] rounded-full">
                    <div className="h-full w-[72%] bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
