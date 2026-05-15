import { useState } from 'react';
import { TrendingUp, Users, Eye, DollarSign, ArrowUpRight, Calendar, Target, Repeat, ChevronDown, Sparkles } from 'lucide-react';

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: 'EGP 45.2K', change: '+18%', icon: DollarSign, bg: 'icon-box-orange' },
          { label: 'Total RSVPs', value: '1,247', change: '+24%', icon: Users, bg: 'icon-box-primary' },
          { label: 'Avg Fill Rate', value: '87%', change: '+5%', icon: TrendingUp, bg: 'icon-box-green' },
          { label: 'Repeat Rate', value: '32%', change: '+8%', icon: Repeat, bg: 'icon-box-cyan' },
        ].map((stat) => (
          <div key={stat.label} className="kpi-card">
            <div className="flex items-center justify-between">
              <div className={`icon-box ${stat.bg}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="kpi-trend text-green-600 dark:text-green-400">
                <ArrowUpRight className="w-3 h-3" />{stat.change}
              </span>
            </div>
            <div>
              <p className="kpi-value">{stat.value}</p>
              <p className="kpi-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="bento-title">Sales Over Time</h2>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-1.5 pt-4">
            {Array.from({ length: 12 }, (_, i) => {
              const h = 40 + Math.random() * 60;
              return (
                <div key={i} className="flex-1 flex flex-col justify-end group relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                    EGP {(h * 1.2).toFixed(1)}K
                  </div>
                  <div className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }} />
                  <p className="text-[10px] font-bold text-muted-foreground mt-2 text-center">M{i+1}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <Users className="w-5 h-5 text-cyan-500" />
              <h2 className="bento-title">Conversion Funnel</h2>
            </div>
          </div>
          <div className="space-y-4 pt-2">
            {[
              { label: 'Page Views', value: '12,432', pct: 100, color: 'bg-primary' },
              { label: 'Add to Cart', value: '3,108', pct: 25, color: 'bg-cyan-500' },
              { label: 'Checkout Started', value: '1,865', pct: 15, color: 'bg-purple-500' },
              { label: 'Completed RSVPs', value: '1,247', pct: 10, color: 'bg-green-500' },
            ].map((step) => (
              <div key={step.label} className="space-y-1.5">
                <div className="flex justify-between text-caption font-bold">
                  <span className="text-muted-foreground">{step.label}</span>
                  <span className="text-foreground">{step.value} ({step.pct}%)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${step.color} rounded-full transition-all duration-1000`} style={{ width: `${step.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bento-section">
        <div className="bento-header">
          <div className="bento-title-wrapper">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="bento-title">Top Performing Events</h2>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { title: 'Cairo Jazz Night', rsvp: 142, revenue: 21300, fill: 94 },
            { title: 'Street Food Festival', rsvp: 654, revenue: 49050, fill: 82 },
            { title: 'AI Summit 2026', rsvp: 387, revenue: 0, fill: 77 },
          ].map((e, i) => (
            <div key={i} className="card-surface p-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-body-sm font-bold text-foreground truncate">{e.title}</p>
                <p className="text-caption text-muted-foreground">{e.rsvp} attendees • {e.fill}% full</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-body-sm font-black text-foreground">
                  {e.revenue === 0 ? 'FREE' : `EGP ${e.revenue.toLocaleString()}`}
                </p>
                <div className="flex items-center gap-1 text-green-600 font-bold text-[10px] justify-end">
                  <ArrowUpRight className="w-3 h-3" /> +12%
                </div>
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
