import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Skeleton } from '../../app/components/ui/skeleton';
import { demoToast } from '../../lib/demoFeedback';
import { formatRelativeTime } from '../../lib/utils';
import {
  Users, Calendar, TrendingUp, AlertCircle, Activity, DollarSign,
  ArrowUpRight, ArrowDownRight, Globe, Repeat, Target, Zap, Sparkles,
  ChevronRight, Cpu, ArrowRight, RefreshCw, ShieldAlert, Settings, Eye, Shield, UserCheck,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import {
  DashboardPage, DashboardHero, QuickActionGrid, PeriodTabs, LiveIndicator,
} from '../../components/business/DashboardPrimitives';

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
  { label: 'Events awaiting approval', count: 5, link: '/admin/events' },
  { label: 'User reports', count: 3, link: '/admin/moderation' },
  { label: 'Flagged posts', count: 8, link: '/admin/community' },
  { label: 'Organizer requests', count: 2, link: '/admin/users' },
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

const topOrganizers = [
  { name: 'Cairo Food Collective', events: 12, revenue: 'EGP 89K', avatar: 'https://i.pravatar.cc/40?img=50' },
  { name: 'Tech Cairo', events: 8, revenue: 'EGP 0', avatar: 'https://i.pravatar.cc/40?img=20' },
  { name: 'Cairo Jazz Club', events: 6, revenue: 'EGP 45K', avatar: 'https://i.pravatar.cc/40?img=10' },
  { name: 'Townhouse Gallery', events: 5, revenue: 'EGP 12K', avatar: 'https://i.pravatar.cc/40?img=40' },
];

const userDonutSegments = [
  { value: 10200, color: '#7C5CFF', label: 'Attendees' },
  { value: 1840, color: '#9B8CFF', label: 'Organizers' },
  { value: 360, color: '#C4B5FD', label: 'Admins' },
];

const topCities = [
  { city: 'Cairo', events: 520, users: 8400, color: '#7C5CFF' },
  { city: 'Alexandria', events: 180, users: 2800, color: '#9B8CFF' },
  { city: 'Giza', events: 95, users: 1400, color: '#C4B5FD' },
  { city: 'Sharm El-Sheikh', events: 52, users: 820, color: '#DDD6FE' },
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

  const totalPending = pendingItems.reduce((s, i) => s + i.count, 0) + pendingRequests;

  return (
    <DashboardPage>
      <DashboardHero
        badge="Administrator"
        badgeIcon={Shield}
        name={currentUser?.name ?? 'Admin'}
        subtitle="Platform command center — monitor health, review actions, and track growth in real time."
        meta={<LiveIndicator label="All systems operational" />}
        actions={
          <>
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
            <Link to="/admin/settings" className="btn-secondary flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            <span className="hidden md:inline text-caption text-muted-foreground">
              Updated {lastRefresh}
            </span>
          </>
        }
        stats={[
          { label: 'Total Users', value: '12.4K', hint: '+12% this month' },
          { label: 'Active Events', value: '847', hint: '+24% growth' },
          { label: 'Revenue', value: 'EGP 2.4M', hint: 'Platform-wide' },
          { label: 'Pending Reviews', value: String(totalPending), hint: 'Needs attention' },
        ]}
      />

      <QuickActionGrid
        items={[
          { to: '/admin/users', icon: Users, label: 'Manage Users', grad: 'from-[#7C5CFF] to-[#9B8CFF]' },
          { to: '/admin/events', icon: Eye, label: 'Review Events', grad: 'from-[#7C5CFF] to-[#5B3FE0]' },
          { to: '/admin/moderation', icon: ShieldAlert, label: 'Moderation', grad: 'from-[#9B8CFF] to-[#7C5CFF]' },
          { to: '/admin/settings', icon: Settings, label: 'Settings', grad: 'from-[#C4B5FD] to-[#9B8CFF]' },
        ]}
      />

      <div className="dashboard-grid dashboard-grid-4">
        {[
          { label: 'Total Users', value: '12.4K', change: '+12%', up: true, data: kpiSparklines.users, color: '#7C5CFF', icon: Users, iconClass: 'icon-box-primary' },
          { label: 'Active Events', value: '847', change: '+24%', up: true, data: kpiSparklines.events, color: '#9B8CFF', icon: Calendar, iconClass: 'icon-box-primary' },
          { label: 'Platform Revenue', value: 'EGP 2.4M', change: '+32%', up: true, data: kpiSparklines.revenue, color: '#7C5CFF', icon: DollarSign, iconClass: 'icon-box-primary' },
          { label: 'System Flags', value: '24', change: '-5%', up: false, data: kpiSparklines.flags, color: '#C4B5FD', icon: AlertCircle, iconClass: 'icon-box-primary' },
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-h3 font-bold text-foreground">Platform Metrics</h2>
          <p className="text-caption text-muted-foreground mt-0.5">User growth and revenue trends</p>
        </div>
        <PeriodTabs periods={PERIODS} value={period} onChange={handlePeriodChange} />
      </div>

      <div className="dashboard-grid dashboard-grid-2">
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
              <DollarSign className="w-5 h-5 text-primary" />
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
      <div className="dashboard-grid dashboard-grid-3-lg">
        {/* Activity feed — 2 cols */}
        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="bento-title">Real-time Activity</h2>
            </div>
            <LiveIndicator />
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
          <Link to="/admin/audit-logs" className="w-full mt-4 py-2.5 text-caption font-semibold text-primary hover:bg-primary/5 rounded-xl transition-colors border border-dashed border-primary/20 flex items-center justify-center gap-2">
            View system audit log <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-5">
          <div className="bento-section">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-body-sm font-semibold text-foreground flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-primary" />
                Action required
              </h3>
              <span className="status-pill bg-primary/10 text-primary">{totalPending} total</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {pendingItems.map((item) => (
                <Link key={item.label} to={item.link} className="pending-action-card group">
                  <span className="text-caption font-semibold text-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm font-bold text-primary">{item.count}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
              {pendingRequests > 0 && (
                <Link to="/admin/users" className="pending-action-card group">
                  <span className="text-caption font-semibold text-foreground">Organizer requests (live)</span>
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm font-bold text-primary">{pendingRequests}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              )}
            </div>
          </div>

          <div className="bento-section">
            <div className="bento-header !mb-3">
              <h3 className="text-body-sm font-semibold text-foreground flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                System Health
              </h3>
              <Globe className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {systemHealth.map((s) => (
                <div key={s.label} className="space-y-1">
                  <div className="flex justify-between text-caption font-semibold uppercase tracking-wide text-muted-foreground">
                    <span>{s.label}</span>
                    <span className="text-primary">{s.status}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid-2">
        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="bento-title">User Distribution</h2>
            </div>
          </div>
          <DonutChart segments={userDonutSegments} />
        </div>

        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <UserCheck className="w-5 h-5 text-primary" />
              <h2 className="bento-title">Top Organizers</h2>
            </div>
          </div>
          <div className="space-y-3">
            {topOrganizers.map((org) => (
              <div key={org.name} className="card-surface flex items-center gap-3">
                <img src={org.avatar} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/10" />
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-semibold text-foreground truncate">{org.name}</p>
                  <p className="text-caption text-muted-foreground">{org.events} events</p>
                </div>
                <p className="text-body-sm font-bold text-primary flex-shrink-0">{org.revenue}</p>
              </div>
            ))}
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
            <div key={cat.category} className="card-surface hover:border-primary/20 transition-all">
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
                  <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">Events</p>
                </div>
                <div>
                  <p className="text-h3 font-black text-foreground">{(cat.attendees / 1000).toFixed(1)}K</p>
                  <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground">Attendees</p>
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
      <div className="dashboard-grid dashboard-grid-2">
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
            <HBar label="Weekly Active Users" value={8900} max={12400} color="#9B8CFF" />
            <HBar label="Monthly Active Users" value={12400} max={12400} color="#7C5CFF" />
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
                  <p className="text-body-sm font-semibold text-foreground leading-none">{m.value}</p>
                  <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground mt-1">{m.label}</p>
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
            <DollarSign className="w-5 h-5 text-primary" />
            <h2 className="bento-title">Revenue Breakdown</h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Ticket Sales', value: 'EGP 1.8M', pct: 75, color: '#7C5CFF' },
            { label: 'Service Fees', value: 'EGP 420K', pct: 17.5, color: '#9B8CFF' },
            { label: 'VIP Upgrades', value: 'EGP 140K', pct: 5.8, color: '#C4B5FD' },
            { label: 'Partnerships', value: 'EGP 40K', pct: 1.7, color: '#DDD6FE' },
          ].map((r) => (
            <div key={r.label} className="card-surface hover:border-primary/20 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                <span className="text-caption font-semibold text-muted-foreground uppercase">{r.pct}%</span>
              </div>
              <p className="text-h3 font-black text-foreground">{r.value}</p>
              <p className="text-caption font-semibold uppercase tracking-wide text-muted-foreground mt-1">{r.label}</p>
              <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${r.pct}%`, background: r.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardPage>
  );
}
