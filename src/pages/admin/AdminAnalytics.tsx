import { TrendingUp, Users, Calendar, DollarSign } from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-h1 font-bold text-foreground">Platform Analytics</h1>
        <p className="text-body text-muted-foreground mt-1">Platform-wide metrics and performance insights</p>
      </div>
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-5 h-5 text-[#6C4CF1]" />
              <span className="status-pill bg-green-100 text-green-700">+24%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">12.4K</p>
            <p className="text-caption text-muted-foreground">Active Users</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-5 h-5 text-[#00C2FF]" />
              <span className="status-pill bg-green-100 text-green-700">+18%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">847</p>
            <p className="text-caption text-muted-foreground">Total Events</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-5 h-5 text-[#FF8A00]" />
              <span className="status-pill bg-green-100 text-green-700">+32%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">EGP 2.4M</p>
            <p className="text-caption text-muted-foreground">Revenue (30d)</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="status-pill bg-green-100 text-green-700">+12%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">78%</p>
            <p className="text-caption text-muted-foreground">Retention Rate</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* User Growth */}
          <div className="surface-panel p-5">
            <h2 className="text-h2 font-semibold text-foreground mb-6">User Growth (6 Months)</h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
                const height = 40 + (i * 10);
                return (
                  <div key={month} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col justify-end h-full">
                      <div
                        className="bg-gradient-to-t from-[#6C4CF1] to-[#00C2FF] rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{month}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Events */}
          <div className="surface-panel p-5">
            <h2 className="text-h2 font-semibold text-foreground mb-6">Top Events by Attendance</h2>
            <div className="space-y-4">
              {[
                { name: 'Street Food Festival', attendees: 654, revenue: 49050 },
                { name: 'AI & ML Summit', attendees: 387, revenue: 0 },
                { name: 'Cairo Jazz Night', attendees: 142, revenue: 21300 },
                { name: 'Art Exhibition', attendees: 89, revenue: 0 },
              ].map((event, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-700">{event.name}</span>
                    <span className="font-bold text-gray-900">
                      {event.attendees} attendees
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6C4CF1] to-[#00C2FF]"
                      style={{ width: `${(event.attendees / 1000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="surface-panel p-5 mb-6">
          <h2 className="text-h2 font-semibold text-foreground mb-6">Category Performance</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { category: 'Music', events: 145, growth: '+28%', color: 'bg-purple-500' },
              { category: 'Tech', events: 128, growth: '+42%', color: 'bg-cyan-500' },
              { category: 'Food & Drink', events: 98, growth: '+15%', color: 'bg-orange-500' },
              { category: 'Sports', events: 87, growth: '+12%', color: 'bg-green-500' },
              { category: 'Art', events: 76, growth: '+8%', color: 'bg-pink-500' },
              { category: 'Business', events: 65, growth: '+22%', color: 'bg-blue-500' },
            ].map((cat) => (
              <div key={cat.category} className="surface-panel p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 ${cat.color} rounded-full`}></div>
                  <p className="font-semibold text-foreground">{cat.category}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-h2 font-bold text-foreground">{cat.events}</p>
                  <span className="status-pill bg-green-100 text-green-700">{cat.growth}</span>
                </div>
                <p className="text-body text-muted-foreground mt-1">events</p>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement & Event Stats */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="surface-panel p-5">
            <h3 className="text-h3 font-semibold text-foreground mb-4">User Engagement</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Active Users</span>
                <span className="font-bold text-gray-900">4.2K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Session Time</span>
                <span className="font-bold text-gray-900">8m 34s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bounce Rate</span>
                <span className="font-bold text-gray-900">24%</span>
              </div>
            </div>
          </div>

          <div className="surface-panel p-5">
            <h3 className="text-h3 font-semibold text-foreground mb-4">Event Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Fill Rate</span>
                <span className="font-bold text-gray-900">78%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Ticket Price</span>
                <span className="font-bold text-gray-900">EGP 145</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Repeat Attendees</span>
                <span className="font-bold text-gray-900">42%</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
