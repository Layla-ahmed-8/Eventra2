import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '../../app/components/ui/skeleton';
import { demoToast } from '../../lib/demoFeedback';
import { formatRelativeTime } from '../../lib/utils';
import {
  Users, Calendar, TrendingUp, AlertCircle, Activity, DollarSign,
  ArrowUpRight, ArrowDownRight, Globe, Repeat, Target, Zap, Sparkles,
  ChevronRight, Cpu, ArrowRight, RefreshCw,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const PERIODS = ['7d', '30d', '6m', '1y'] as const;
type Period = typeof PERIODS[number];

// ── Sparkline ─────────────────────────────────────────────────────────────────
function Sparkline({ data, color = '#7C5CFF' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm opacity-80" style={{ height: `${(v / max) * 100}%`, background: color }} />
      ))}
    </div>
  );
}

// ── Donut chart ───────────────────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  const r = 28; const circ = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-4">
      <svg width={72} height={72} className="-rotate-90">
        <circle cx={36} cy={36} r={r} fill="none" stroke="currentColor" strokeWidth={10} className="text-muted/20" />
        {segments.map((seg, i) => {
          const dash = (seg.value / total) * circ;
          const el = <circle key={i} cx={36} cy={36} r={r} fill="none" stroke={seg.color} strokeWidth={10} strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset} strokeLinecap="butt" />;
          offset += dash;
          return el;
        })}
      </svg>
      <div className="space-y-1.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
            <span className="text-caption text-muted-foreground">{s.label}</span>
            <span className="text-caption font-bold text-foreground ml-auto">{s.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Bar chart ─────────────────────────────────────────────────────────────────
function BarChart({ data, labels, color = '#7C5CFF', height = 140 }: {
  data: number[]; labels: string[]; color?: string; height?: number;
}) {
  const max = Math.max(...data);
  return (
    <div>
      <div className="flex items-end gap-1" style={{ height }}>
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end group relative">
            <div className="rounded-t transition-all hover:opacity-75" style={{ height: `${(v / max) * 100}%`, background: color }} />
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
        <span className="font-bold text-foreground">{value > 999 ? value.toLocaleString() : value}{suffix}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Static data ───────────────────────────────────────────────────────────────
const kpiSparklines = {
  users:   [320, 410, 380, 520, 490, 610, 580, 720, 690, 840, 810, 950],
  revenue: [180, 240, 210, 310, 280, 390, 360, 450, 420, 540, 510, 620],
  events:  [28, 35, 31, 42, 38, 48, 44, 55, 51, 62, 58, 70],
  flags:   [45, 38, 42, 30, 35, 28, 24],
};

const chartUserGrowth: Record<Period, { data: number[]; labels: string[] }> = {
  '7d':  { data: [1820, 1950, 1880, 2100, 2050, 2280, 2200], labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  '30d': { data: [8200, 8800, 8500, 9400, 9100, 10200, 9800, 10800, 10400, 11500, 11100, 12400], labels: Array.from({length:12},(_,i)=>`${i*3+1}`) },
  '6m':  { data: [6200, 7400, 8100, 9300, 10800, 12400], labels: ['Dec','Jan','Feb','Mar','Apr','May'] },
  '1y':  { data: [3200, 4100, 3800, 5200, 4900, 6100, 5800, 7200, 6900, 8400, 8100, 9500], labels: ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'] },
};

const chartRevenue: Record<Period, { data: number[]; labels: string[] }> = {
  '7d':  { data: [42, 58, 51, 74, 68, 95, 88], labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  '30d': { data: [180, 240, 210, 310, 280, 390, 360, 450, 420, 540, 510, 620], labels: Array.from({length:12},(_,i)=>`${i*3+1}`) },
  '6m':  { data: [320, 410, 480, 560, 640, 720], labels: ['Dec','Jan','Feb','Mar','Apr','May'] },
  '1y':  { data: [120, 180, 150, 240, 210, 310, 280, 390, 360, 450, 420, 540], labels: ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'] },
};

const realtimeActivity = [
  { icon: '👤', action: 'New user registration', user: 'Sarah Ahmed', timestamp: new Date(Date.now() - 0.5 * 60 * 1000).toISOString(), type: 'user' },
  { icon: '📅', action: 'Event published', user: 'Tech Cairo', timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), type: 'event' },
  { icon: '💰', action: 'Payment processed', user: 'Mohamed Ali', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), type: 'payment' },
  { icon: '🚩', action: 'Event flagged for review', user: 'System AI', timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(), type: 'flag' },
  { icon: '🏢', action: 'New organizer account', user: 'Cairo Events Co', timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(), type: 'organizer' },
  { icon: '🎟️', action: 'Bulk ticket purchase', user: 'Yasmine K.', timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(), type: 'payment' },
];

const pendingItems = [
  { label: 'Events awaiting approval', count: 5, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30', link: '/admin/events' },
  { label: 'User reports', count: 3, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30', link: '/admin/moderation' },
  { label: 'Flagged posts', count: 8, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', link: '/admin/community' },
  { label: 'Organizer requests', count: 2, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', link: '/admin/users' },
];

const systemHealth = [
  { label: 'API Gateway', status: 'Healthy', pct: 100, color: '#22C55E' },
  { label: 'Database', status: '98%', pct: 98, color: '#22C55E' },
  { label: 'AI Engine', status: '95%', pct: 95, color: '#7C5CFF' },
  { label: 'Storage', status: '72%', pct: 72, color: '#F59E0B' },
  { label: 'CDN', status: '99%', pct: 99, color: '#22C55E' },
];

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

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminAnalytics() {
  const { currentUser, organizerRequests } = useAppStore();
  const pendingRequests = organizerRequests.filter((r) => r.status === 'pending').length;
  const [period, setPeriod] = useState<Period>('30d');
  const [chartLoading, setChartLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(() => new Date().toLocaleTimeString());

  const handlePeriodChange = (p: Period) => {
    setChartLoading(true);
    setPeriod(p);
    setTimeout(() => setChartLoading(false), 500);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-caption text-muted-foreground mb-0.5">{greeting()},</p>
          <h1 className="text-h1 font-bold text-foreground">{currentUser?.name ?? 'Admin'} 👋</h1>
          <p className="text-body-sm text-muted-foreground mt-1">Platform overview, real-time activity, and analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setLastRefresh(new Date().toLocaleTimeString());
              demoToast('Refreshed', 'Dashboard data updated.');
            }}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <div className="hidden sm:block text-right">
            <p className="text-caption text-muted-foreground">Last updated</p>
            <p className="text-caption font-bold text-foreground">{lastRefresh}</p>
          </div>
        </div>
      </div>

      {/* KPI cards with sparklines */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '12.4K', change: '+12%', up: true, data: kpiSparklines.users, color: '#7C5CFF', icon: Users, iconClass: 'icon-box-primary' },
          { label: 'Active Events', value: '847', change: '+24%', up: true, data: kpiSparklines.events, color: '#00D4FF', icon: Calendar, iconClass: 'icon-box-cyan' },
          { label: 'Platform Revenue', value: 'EGP 2.4M', change: '+32%', up: true, data: kpiSparklines.revenue, color: '#FF8A00', icon: DollarSign, iconClass: 'icon-box-orange' },
          { label: 'System Flags', value: '24', change: '-5%', up: false, data: kpiSparklines.flags, color: '#EF4444', icon: AlertCircle, iconClass: 'icon-box-red' },
        ].map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <div className="flex items-center justify-between">
              <div className={`icon-box ${kpi.iconClass}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div className={`kpi-trend ${kpi.up ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </div>
            </div>
            <div>
              <p className="kpi-value">{kpi.value}</p>
              <p className="kpi-label">{kpi.label}</p>
            </div>
            <Sparkline data={kpi.data} color={kpi.color} />
          </div>
        ))}
      </div>

      {/* Period selector + charts */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-h3 font-bold text-foreground">Platform Metrics</h2>
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`px-3 py-1.5 rounded-lg text-body-sm font-semibold transition-all ${period === p ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="bento-title">User Growth</h2>
            </div>
            <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">{period}</span>
          </div>
          {chartLoading
            ? <Skeleton className="rounded-xl" style={{ height: 140 }} />
            : <BarChart data={chartUserGrowth[period].data} labels={chartUserGrowth[period].labels} color="url(#adminGrad1)" height={140} />
          }
          <svg width="0" height="0">
            <defs>
              <linearGradient id="adminGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C5CFF" />
                <stop offset="100%" stopColor="#9B8CFF" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <DollarSign className="w-5 h-5 text-orange-500" />
              <h2 className="bento-title">Revenue (EGP K)</h2>
            </div>
            <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">{period}</span>
          </div>
          {chartLoading
            ? <Skeleton className="rounded-xl" style={{ height: 140 }} />
            : <BarChart data={chartRevenue[period].data} labels={chartRevenue[period].labels} color="url(#adminGrad2)" height={140} />
          }
          <svg width="0" height="0">
            <defs>
              <linearGradient id="adminGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF9B3D" />
                <stop offset="100%" stopColor="#FFD56A" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Real-time Activity + System Health + Pending Reviews */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Activity feed — 2 cols */}
        <div className="lg:col-span-2 bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="bento-title">Real-time Activity</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-caption text-green-600 dark:text-green-400 font-semibold">Live</span>
            </div>
          </div>
          <div className="space-y-3">
            {realtimeActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon-wrapper">{activity.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-body-sm font-semibold text-foreground truncate">{activity.action}</p>
                    <span className="text-caption text-muted-foreground whitespace-nowrap">{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                  <p className="text-caption text-muted-foreground">{activity.user}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Right col — Pending + System Health */}
        <div className="space-y-5">
          {/* Pending reviews */}
          <div className="bento-section">
            <h3 className="text-body-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              Action required
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {pendingItems.map((item) => (
                <Link key={item.label} to={item.link} className={`p-3 rounded-xl ${item.bg} flex items-center justify-between group hover:scale-[1.02] transition-transform`}>
                  <span className={`text-caption font-bold ${item.color}`}>{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-body-sm font-black ${item.color}`}>{item.count}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${item.color} group-hover:translate-x-0.5 transition-transform`} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* System Health */}
          <div className="atmo-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-body-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                System Health
              </h3>
              <Globe className="w-4 h-4 text-slate-500" />
            </div>
            <div className="space-y-3">
              {systemHealth.map((s) => (
                <div key={s.label} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span>{s.label}</span>
                    <span style={{ color: s.color }}>{s.status}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category performance */}
      <div className="bento-section">
        <div className="bento-header">
          <div className="bento-title-wrapper">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="bento-title">Category Performance</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryData.map((cat) => (
            <div key={cat.category} className="card-surface p-4 hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                  <p className="text-body-sm font-black text-foreground uppercase tracking-tight">{cat.category}</p>
                </div>
                <span className="text-caption font-black text-green-600 dark:text-green-400">{cat.growth}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-h3 font-black text-foreground">{cat.events}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Events</p>
                </div>
                <div>
                  <p className="text-h3 font-black text-foreground">{(cat.attendees / 1000).toFixed(1)}K</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Attendees</p>
                </div>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(cat.events / 145) * 100}%`, background: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Geographic + engagement */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="bento-title">Top Cities</h2>
            </div>
          </div>
          <div className="space-y-4">
            {topCities.map((city) => (
              <HBar key={city.city} label={city.city} value={city.events} max={520} color={city.color} suffix=" events" />
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-border/50 space-y-3">
            {topCities.map((city) => (
              <div key={city.city} className="flex items-center justify-between text-caption">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: city.color }} />
                  <span className="font-bold text-muted-foreground">{city.city}</span>
                </div>
                <span className="font-black text-foreground uppercase">{city.users.toLocaleString()} users</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="bento-title">Engagement Metrics</h2>
            </div>
          </div>
          <div className="space-y-5 mb-6">
            <HBar label="Daily Active Users" value={4200} max={12400} color="#7C5CFF" />
            <HBar label="Weekly Active Users" value={8900} max={12400} color="#00D4FF" />
            <HBar label="Monthly Active Users" value={12400} max={12400} color="#22C55E" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/50">
            {[
              { label: 'Avg Session', value: '8m 34s', icon: Zap },
              { label: 'Bounce Rate', value: '24%', icon: Target },
              { label: 'Repeat Users', value: '42%', icon: Repeat },
              { label: 'NPS Score', value: '72', icon: TrendingUp },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-3">
                <div className="icon-box icon-box-primary scale-90">
                  <m.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-body-sm font-black text-foreground leading-none">{m.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue breakdown */}
      <div className="bento-section">
        <div className="bento-header">
          <div className="bento-title-wrapper">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <h2 className="bento-title">Revenue Breakdown</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Ticket Sales', value: 'EGP 1.8M', pct: 75, color: '#7C5CFF' },
            { label: 'Service Fees', value: 'EGP 420K', pct: 17.5, color: '#00D4FF' },
            { label: 'VIP Upgrades', value: 'EGP 140K', pct: 5.8, color: '#FF9B3D' },
            { label: 'Partnerships', value: 'EGP 40K', pct: 1.7, color: '#22C55E' },
          ].map((r) => (
            <div key={r.label} className="card-surface p-4 hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                <span className="text-[10px] font-black text-muted-foreground uppercase">{r.pct}%</span>
              </div>
              <p className="text-h3 font-black text-foreground">{r.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{r.label}</p>
              <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${r.pct}%`, background: r.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
