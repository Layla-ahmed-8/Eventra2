import { useState } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, ArrowUpRight, Globe, Repeat, Target, Zap } from 'lucide-react';

const PERIODS = ['7d', '30d', '6m', '1y'] as const;
type Period = typeof PERIODS[number];

function BarChart({ data, labels, color = '#7C5CFF', height = 160 }: {
  data: number[]; labels: string[]; color?: string; height?: number;
}) {
  const max = Math.max(...data);
  return (
    <div>
      <div className="flex items-end gap-1" style={{ height }}>
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end group relative">
            <div
              className="rounded-t transition-all hover:opacity-75"
              style={{ height: `${(v / max) * 100}%`, background: color }}
            />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-caption px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {v.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {labels.map((l, i) => (
          <span key={i} className="text-caption text-muted-foreground" style={{ width: `${100 / labels.length}%`, textAlign: 'center' }}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function HBar({ label, value, max, color, suffix = '' }: { label: string; value: number; max: number; color: string; suffix?: string }) {
  return (
    <div>
      <div className="flex justify-between text-body-sm mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold text-foreground">{typeof value === 'number' && value > 999 ? value.toLocaleString() : value}{suffix}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
    </div>
  );
}

const userGrowthData: Record<Period, { data: number[]; labels: string[] }> = {
  '7d':  { data: [1820, 1950, 1880, 2100, 2050, 2280, 2200], labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  '30d': { data: [8200, 8800, 8500, 9400, 9100, 10200, 9800, 10800, 10400, 11500, 11100, 12400], labels: Array.from({length:12},(_,i)=>`${i*3+1}`) },
  '6m':  { data: [6200, 7400, 8100, 9300, 10800, 12400], labels: ['Dec','Jan','Feb','Mar','Apr','May'] },
  '1y':  { data: [3200, 4100, 3800, 5200, 4900, 6100, 5800, 7200, 6900, 8400, 8100, 9500], labels: ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'] },
};

const revenueData: Record<Period, { data: number[]; labels: string[] }> = {
  '7d':  { data: [42, 58, 51, 74, 68, 95, 88], labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  '30d': { data: [180, 240, 210, 310, 280, 390, 360, 450, 420, 540, 510, 620], labels: Array.from({length:12},(_,i)=>`${i*3+1}`) },
  '6m':  { data: [320, 410, 480, 560, 640, 720], labels: ['Dec','Jan','Feb','Mar','Apr','May'] },
  '1y':  { data: [120, 180, 150, 240, 210, 310, 280, 390, 360, 450, 420, 540], labels: ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'] },
};

const categoryData = [
  { category: 'Music', events: 145, growth: '+28%', attendees: 18400, color: '#7C5CFF' },
  { category: 'Tech', events: 128, growth: '+42%', attendees: 24600, color: '#00D4FF' },
  { category: 'Food & Drink', events: 98, growth: '+15%', attendees: 12800, color: '#FF9B3D' },
  { category: 'Sports', events: 87, growth: '+12%', attendees: 9200, color: '#22C55E' },
  { category: 'Art', events: 76, growth: '+8%', attendees: 7400, color: '#FF4FD8' },
  { category: 'Business', events: 65, growth: '+22%', attendees: 8100, color: '#F59E0B' },
];

const topCities = [
  { city: 'Cairo', events: 520, users: 8400, color: '#7C5CFF' },
  { city: 'Alexandria', events: 180, users: 2800, color: '#00D4FF' },
  { city: 'Giza', events: 95, users: 1400, color: '#FF9B3D' },
  { city: 'Sharm El-Sheikh', events: 52, users: 820, color: '#22C55E' },
];

export default function AdminAnalytics() {
  const [period, setPeriod] = useState<Period>('30d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">Platform Analytics</h1>
          <p className="text-body-sm text-muted-foreground mt-1">Platform-wide metrics and performance insights</p>
        </div>
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl self-start sm:self-auto">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-body-sm font-semibold transition-all ${period === p ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Users', value: '12.4K', change: '+24%', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Total Events', value: '847', change: '+18%', icon: Calendar, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Revenue (30d)', value: 'EGP 2.4M', change: '+32%', icon: DollarSign, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Retention Rate', value: '78%', change: '+12%', icon: TrendingUp, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10' },
        ].map(kpi => (
          <div key={kpi.label} className="surface-panel p-4 sm:p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <span className="flex items-center gap-0.5 text-caption font-bold text-green-600 dark:text-green-400">
                <ArrowUpRight className="w-3 h-3" />{kpi.change}
              </span>
            </div>
            <p className="text-h2 font-bold text-foreground mb-0.5">{kpi.value}</p>
            <p className="text-caption text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="surface-panel p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-h3 font-bold text-foreground">User Growth</h2>
            <span className="text-caption text-muted-foreground">{period}</span>
          </div>
          <BarChart
            data={userGrowthData[period].data}
            labels={userGrowthData[period].labels}
            color="url(#grad1)"
            height={140}
          />
          <svg width="0" height="0">
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C5CFF" />
                <stop offset="100%" stopColor="#9B8CFF" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="surface-panel p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-h3 font-bold text-foreground">Revenue (EGP K)</h2>
            <span className="text-caption text-muted-foreground">{period}</span>
          </div>
          <BarChart
            data={revenueData[period].data}
            labels={revenueData[period].labels}
            color="url(#grad2)"
            height={140}
          />
          <svg width="0" height="0">
            <defs>
              <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF9B3D" />
                <stop offset="100%" stopColor="#FFD56A" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Category performance */}
      <div className="surface-panel p-5">
        <h2 className="text-h3 font-bold text-foreground mb-5">Category Performance</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryData.map(cat => (
            <div key={cat.category} className="card-surface p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                  <p className="text-body-sm font-bold text-foreground">{cat.category}</p>
                </div>
                <span className="text-caption font-bold text-green-600 dark:text-green-400">{cat.growth}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-h3 font-bold text-foreground">{cat.events}</p>
                  <p className="text-caption text-muted-foreground">Events</p>
                </div>
                <div>
                  <p className="text-h3 font-bold text-foreground">{(cat.attendees / 1000).toFixed(1)}K</p>
                  <p className="text-caption text-muted-foreground">Attendees</p>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(cat.events / 145) * 100}%`, background: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic + engagement */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="surface-panel p-5">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-h3 font-bold text-foreground">Top Cities</h2>
          </div>
          <div className="space-y-4">
            {topCities.map(city => (
              <HBar key={city.city} label={city.city} value={city.events} max={520} color={city.color} suffix=" events" />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border space-y-3">
            {topCities.map(city => (
              <div key={city.city} className="flex items-center justify-between text-body-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: city.color }} />
                  <span className="text-muted-foreground">{city.city}</span>
                </div>
                <span className="font-bold text-foreground">{city.users.toLocaleString()} users</span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-panel p-5">
          <h2 className="text-h3 font-bold text-foreground mb-5">Engagement Metrics</h2>
          <div className="space-y-4 mb-5">
            <HBar label="Daily Active Users" value={4200} max={12400} color="#7C5CFF" />
            <HBar label="Weekly Active Users" value={8900} max={12400} color="#00D4FF" />
            <HBar label="Monthly Active Users" value={12400} max={12400} color="#22C55E" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            {[
              { label: 'Avg Session', value: '8m 34s', icon: Zap },
              { label: 'Bounce Rate', value: '24%', icon: Target },
              { label: 'Repeat Users', value: '42%', icon: Repeat },
              { label: 'NPS Score', value: '72', icon: TrendingUp },
            ].map(m => (
              <div key={m.label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <m.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-body-sm font-bold text-foreground">{m.value}</p>
                  <p className="text-caption text-muted-foreground">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue breakdown */}
      <div className="surface-panel p-5">
        <h2 className="text-h3 font-bold text-foreground mb-5">Revenue Breakdown</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Ticket Sales', value: 'EGP 1.8M', pct: 75, color: '#7C5CFF' },
            { label: 'Service Fees', value: 'EGP 420K', pct: 17.5, color: '#00D4FF' },
            { label: 'VIP Upgrades', value: 'EGP 140K', pct: 5.8, color: '#FF9B3D' },
            { label: 'Partnerships', value: 'EGP 40K', pct: 1.7, color: '#22C55E' },
          ].map(r => (
            <div key={r.label} className="card-surface p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-3 h-3 rounded-full" style={{ background: r.color }} />
                <span className="text-caption font-bold text-muted-foreground">{r.pct}%</span>
              </div>
              <p className="text-h3 font-bold text-foreground">{r.value}</p>
              <p className="text-caption text-muted-foreground mt-0.5">{r.label}</p>
              <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
