import { Link } from 'react-router-dom';
import { Users, Calendar, DollarSign, TrendingUp, Eye, Plus, BarChart3, Sparkles } from 'lucide-react';

export default function OrganizerDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">Organizer Dashboard</h1>
          <p className="text-body text-muted-foreground mt-1">Overview of your events and performance</p>
        </div>
        <Link
          to="/organizer/events/create"
          className="px-4 py-3 bg-gradient-to-r from-[#6C4CF1] to-[#5739D4] hover:shadow-xl text-white rounded-xl font-bold flex items-center gap-2 transform hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </Link>
      </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#6C4CF1]" />
              </div>
              <span className="status-pill bg-green-100 text-green-700">+12%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">24</p>
            <p className="text-caption text-muted-foreground">Total Events</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center">
                <Users className="w-5 h-5 text-[#00C2FF]" />
              </div>
              <span className="status-pill bg-green-100 text-green-700">+28%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">1,247</p>
            <p className="text-caption text-muted-foreground">Total Attendees</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#FF8A00]" />
              </div>
              <span className="status-pill bg-green-100 text-green-700">+18%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">EGP 45.2K</p>
            <p className="text-caption text-muted-foreground">Total Revenue</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="status-pill bg-green-100 text-green-700">+8%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">87%</p>
            <p className="text-caption text-muted-foreground">Avg Fill Rate</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Active Events */}
          <div className="md:col-span-2">
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Active Events</h2>
                <Link
                  to="/organizer/events"
                  className="text-[#6C4CF1] hover:text-[#5a3dd1] font-semibold"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Cairo Jazz Night: Live at Sunset',
                    date: 'May 15, 2026',
                    attendees: 142,
                    capacity: 200,
                    revenue: 21300,
                  },
                  {
                    title: 'AI & Machine Learning Summit 2026',
                    date: 'May 20, 2026',
                    attendees: 387,
                    capacity: 500,
                    revenue: 0,
                  },
                  {
                    title: 'Street Food Festival: Flavors of Cairo',
                    date: 'May 18, 2026',
                    attendees: 654,
                    capacity: 1000,
                    revenue: 49050,
                  },
                ].map((event, index) => (
                  <div
                    key={index}
                    className="border-2 border-border rounded-xl p-4 hover:border-primary hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                      <Link
                        to={`/organizer/events/${index}/manage`}
                        className="px-3 py-1 border border-primary text-primary rounded-lg text-sm font-semibold hover:bg-primary/10"
                      >
                        Manage
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Attendees</p>
                        <p className="font-bold text-foreground">
                          {event.attendees} / {event.capacity}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fill Rate</p>
                        <p className="font-bold text-foreground">
                          {Math.round((event.attendees / event.capacity) * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-bold text-foreground">
                          EGP {event.revenue.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#6C4CF1] to-[#00C2FF]"
                        style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  { action: 'New booking', event: 'Cairo Jazz Night', time: '5 minutes ago' },
                  { action: 'Event published', event: 'Summer Concert Series', time: '2 hours ago' },
                  { action: 'Payment received', event: 'Street Food Festival', time: '4 hours ago' },
                  { action: 'New booking', event: 'AI & ML Summit', time: '6 hours ago' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="flex-1 text-foreground">
                      <span className="font-semibold">{activity.action}</span> for{' '}
                      {activity.event}
                    </p>
                    <p className="text-muted-foreground">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-1">
            {/* AI Insights */}
            <div className="bg-gradient-to-br from-[#6C4CF1] to-[#00C2FF] border border-border rounded-2xl shadow-lg p-6 text-white mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6" />
                <h3 className="font-bold text-lg">AI Insights</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-card/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="font-semibold mb-1">Optimal Pricing</p>
                  <p className="text-white/90">
                    Consider increasing VIP ticket price by 15% based on demand trends
                  </p>
                </div>
                <div className="bg-card/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="font-semibold mb-1">Best Time to Promote</p>
                  <p className="text-white/90">
                    Thursday 6-8 PM shows highest engagement for your audience
                  </p>
                </div>
                <div className="bg-card/20 backdrop-blur-sm rounded-lg p-3">
                  <p className="font-semibold mb-1">Trending Category</p>
                  <p className="text-white/90">
                    Tech events seeing 40% more interest this month
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="font-bold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/organizer/events/create"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-[#6C4CF1] to-[#5739D4] hover:shadow-xl text-white rounded-xl font-bold text-center transform hover:scale-105 transition-all"
                >
                  Create Event
                </Link>
                <Link
                  to="/organizer/analytics"
                  className="block w-full px-4 py-3 border-2 border-border text-foreground rounded-xl font-semibold text-center hover:border-primary hover:bg-primary/10 transition-all"
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  View Analytics
                </Link>
                <Link
                  to="/organizer/messages"
                  className="block w-full px-4 py-3 border-2 border-border text-foreground rounded-xl font-semibold text-center hover:border-primary hover:bg-primary/10 transition-all"
                >
                  Message Attendees
                </Link>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-foreground mb-4">This Month</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Page Views</span>
                  <span className="font-bold text-foreground">12.4K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Conversion Rate</span>
                  <span className="font-bold text-foreground">24%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Avg Ticket Price</span>
                  <span className="font-bold text-foreground">EGP 125</span>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
