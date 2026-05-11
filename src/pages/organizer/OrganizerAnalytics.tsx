import { useState } from 'react';
import { TrendingUp, Users, Eye, DollarSign, ArrowUpRight, Calendar, Target, Repeat, ChevronDown } from 'lucide-react';

const PERIODS = ['7d', '30d', '90d', 'All'] as const;
type Period = typeof PERIODS[number];

// ── Bar chart ─────────────────────────────────────────────────────────────────
function BarChart({ data, labels, color = '#7C5CFF', height = 160 }: {
  data: number[]; labels: string[]; color?: string; height?: number;
}) {
  const max = Math.max(...data);
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height }}>
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

// ── Horizontal bar ────────────────────────────────────────────────────────────
function HBar({ label, value, max, color, suffix = '' }: { label: string; value: number; max: number; color: string; suffix?: string }) {
  return (
    <div>
      <div className="flex justify-between text-body-sm mb-1.5">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold text-foreground">{value.toLocaleString()}{suffix}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Funnel step ───────────────────────────────────────────────────────────────
function FunnelStep({ label, value, pct, color, isLast = false }: { label: string; value: number; pct: number; color: string; isLast?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex justify-between text-body-sm mb-1.5">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-bold text-foreground">{value.toLocaleString()} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
      {!isLast && <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
    </div>
  );
}

const registrationData: Record<Period, number[]> = {
  '7d':  [18, 24, 21, 30, 27, 35, 32],
  '30d': [80, 95, 88, 110, 102, 125, 118, 140, 132, 155, 148, 170, 162, 185, 178, 200, 192, 215, 208, 230, 222, 245, 238, 260, 252, 275, 268, 290, 282, 305],
  '90d': [320, 380, 350, 420, 390, 460, 430, 500, 470, 540, 510, 580],
  'All': [180, 240, 210, 310, 280, 390, 360, 450, 420, 540, 510, 620],
};

const registrationLabels: Record<Period, string[]> = {
  '7d':  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  '30d': Array.from({ length: 30 }, (_, i) => i % 5 === 0 ? `${i + 1}` : ''),
  '90d': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  'All': ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
};

const revenueByEvent = [
  { name: 'Street Food Festival', revenue: 49050, attendees: 654, color: '#FF9B3D' },
  { name: 'Cairo Jazz Night', revenue: 21300, attendees: 142, color: '#7C5CFF' },
  { name: 'Art Exhibition', revenue: 0, attendees: 89, color: '#00D4FF' },
  { name: 'AI Summit', revenue: 0, attendees: 387, color: '#22C55E' },
];

export default function OrganizerAnalytics() {
  const [period, setPeriod] = useState<Period>('30d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">Analytics</h1>
          <p className="text-body-sm text-muted-foreground mt-1">Track performance across all your events</p>
        </div>
        {/* Period selector */}
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
          { label: 'Page Views', value: '45.2K', change: '+24%', icon: Eye, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Registrations', value: '1,247', change: '+18%', icon: Users, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Conversion Rate', value: '2.8%', change: '+12%', icon: Target, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10' },
          { label: 'Total Revenue', value: 'EGP 70.4K', change: '+32%', icon: DollarSign, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10' },
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

      {/* Registration timeline */}
      <div className="surface-panel p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-h3 font-bold text-foreground">Registration Timeline</h2>
          <span className="text-caption text-muted-foreground">{period === '7d' ? 'Last 7 days' : period === '30d' ? 'Last 30 days' : period === '90d' ? 'Last 90 days' : 'All time'}</span>
        </div>
        <BarChart
          data={registrationData[period]}
          labels={registrationLabels[period]}
          color="url(#grad)"
          height={160}
        />
        {/* SVG gradient def */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFF" />
              <stop offset="100%" stopColor="#00D4FF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Middle row */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Traffic sources */}
        <div className="surface-panel p-5">
          <h2 className="text-h3 font-bold text-foreground mb-5">Traffic Sources</h2>
          <div className="space-y-4">
            {[
              { source: 'Direct', value: 42, color: '#7C5CFF' },
              { source: 'Social Media', value: 28, color: '#00D4FF' },
              { source: 'Search', value: 18, color: '#FF9B3D' },
              { source: 'Email', value: 12, color: '#22C55E' },
            ].map(item => (
              <HBar key={item.source} label={item.source} value={item.value} max={100} color={item.color} suffix="%" />
            ))}
          </div>
        </div>

        {/* Audience demographics */}
        <div className="surface-panel p-5">
          <h2 className="text-h3 font-bold text-foreground mb-5">Audience Demographics</h2>
          <div className="space-y-4 mb-5">
            {[
              { range: '18–24', value: 35, color: '#7C5CFF' },
              { range: '25–34', value: 45, color: '#00D4FF' },
              { range: '35–44', value: 15, color: '#FF9B3D' },
              { range: '45+', value: 5, color: '#22C55E' },
            ].map(item => (
              <HBar key={item.range} label={`${item.range} years`} value={item.value} max={100} color={item.color} suffix="%" />
            ))}
          </div>
          <div className="pt-4 border-t border-border grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-h3 font-bold text-foreground">62%</p>
              <p className="text-caption text-muted-foreground">Female</p>
            </div>
            <div className="text-center">
              <p className="text-h3 font-bold text-foreground">38%</p>
              <p className="text-caption text-muted-foreground">Male</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion funnel */}
      <div className="surface-panel p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-h3 font-bold text-foreground">Conversion Funnel</h2>
          <span className="text-caption text-muted-foreground">Last 30 days</span>
        </div>
        <div className="space-y-4 max-w-2xl">
          <FunnelStep label="Page Views" value={45200} pct={100} color="#7C5CFF" />
          <FunnelStep label="Event Detail Views" value={12400} pct={27} color="#8B7CFF" />
          <FunnelStep label="Ticket Selection" value={3800} pct={8} color="#00D4FF" />
          <FunnelStep label="Checkout Started" value={1800} pct={4} color="#4ADEFF" />
          <FunnelStep label="Completed Bookings" value={1247} pct={2.8} color="#22C55E" isLast />
        </div>
      </div>

      {/* Revenue by event */}
      <div className="surface-panel p-5">
        <h2 className="text-h3 font-bold text-foreground mb-5">Revenue & Attendance by Event</h2>
        <div className="space-y-4">
          {revenueByEvent.map(ev => (
            <div key={ev.name} className="card-surface p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: ev.color }} />
                  <p className="text-body-sm font-bold text-foreground">{ev.name}</p>
                </div>
                <div className="flex items-center gap-4 text-body-sm">
                  <span className="text-muted-foreground">{ev.attendees} attendees</span>
                  <span className="font-bold text-foreground">{ev.revenue === 0 ? 'Free' : `EGP ${ev.revenue.toLocaleString()}`}</span>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(ev.attendees / 1000) * 100}%`, background: ev.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retention & engagement */}
      <div className="grid md:grid-cols-3 gap-5">
        {[
          { label: 'Repeat Attendees', value: '42%', icon: Repeat, desc: 'Attended 2+ events', color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Avg Ticket Price', value: 'EGP 125', icon: DollarSign, desc: 'Across all events', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Upcoming Events', value: '3', icon: Calendar, desc: 'Scheduled this month', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10' },
        ].map(s => (
          <div key={s.label} className="surface-panel p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-h2 font-bold text-foreground">{s.value}</p>
              <p className="text-body-sm font-semibold text-foreground">{s.label}</p>
              <p className="text-caption text-muted-foreground">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
