import { TrendingUp, Users, Eye, DollarSign } from 'lucide-react';

export default function OrganizerAnalytics() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-h1 font-bold text-foreground">Analytics</h1>
        <p className="text-body text-muted-foreground mt-1">Track performance across all your events</p>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <Eye className="w-8 h-8 text-[#6C4CF1]" />
              <span className="text-sm text-green-600 font-semibold">+24%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">45.2K</p>
            <p className="text-caption text-muted-foreground">Total Page Views</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-[#00C2FF]" />
              <span className="text-sm text-green-600 font-semibold">+18%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">1,247</p>
            <p className="text-caption text-muted-foreground">Total Registrations</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-sm text-green-600 font-semibold">+12%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">2.8%</p>
            <p className="text-caption text-muted-foreground">Conversion Rate</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-8 h-8 text-[#FF8A00]" />
              <span className="text-sm text-green-600 font-semibold">+32%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">EGP 45K</p>
            <p className="text-caption text-muted-foreground">Total Revenue</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="surface-panel p-5">
            <h2 className="text-h2 font-semibold text-foreground mb-6">Traffic Sources</h2>
            <div className="space-y-4">
              {[
                { source: 'Direct', percentage: 42, color: 'bg-[#6C4CF1]' },
                { source: 'Social Media', percentage: 28, color: 'bg-[#00C2FF]' },
                { source: 'Search', percentage: 18, color: 'bg-[#FF8A00]' },
                { source: 'Email', percentage: 12, color: 'bg-green-500' },
              ].map((item) => (
                <div key={item.source}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-body text-muted-foreground">{item.source}</span>
                    <span className="font-semibold text-foreground">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-[#F4F3FF] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel p-5">
            <h2 className="text-h2 font-semibold text-foreground mb-6">Age Demographics</h2>
            <div className="space-y-4">
              {[
                { range: '18-24', percentage: 35 },
                { range: '25-34', percentage: 45 },
                { range: '35-44', percentage: 15 },
                { range: '45+', percentage: 5 },
              ].map((item) => (
                <div key={item.range}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-body text-muted-foreground">{item.range} years</span>
                    <span className="font-semibold text-foreground">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-[#F4F3FF] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6C4CF1] to-[#00C2FF]"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="surface-panel p-5">
          <h2 className="text-h2 font-semibold text-foreground mb-6">
            Registration Timeline (Last 30 Days)
          </h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {Array.from({ length: 30 }, (_, i) => {
              const height = Math.random() * 100;
              return (
                <div key={i} className="flex-1 flex flex-col justify-end group relative">
                  <div
                    className="bg-gradient-to-t from-[#6C4CF1] to-[#00C2FF] rounded-t hover:opacity-80 transition-opacity"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.round(height)} registrations
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>
    </div>
  );
}
