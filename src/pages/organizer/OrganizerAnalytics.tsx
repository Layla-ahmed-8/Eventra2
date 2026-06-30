import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Calendar, DollarSign, TrendingUp, Plus, Sparkles,
  ArrowUpRight, ArrowDownRight, Activity, ChevronRight, Flame,
  Download, Target, Repeat, MessageSquare, BarChart3, Wallet, Crown,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { demoToast, downloadTextFile } from '../../lib/demoFeedback';
import { formatRelativeTime } from '../../lib/utils';
import {
  DashboardPage, DashboardHero, QuickActionGrid, PeriodTabs, LiveIndicator, CommandStrip,
} from '../../components/business/DashboardPrimitives';

const PERIODS = ['7d', '30d', '90d', 'All'] as const;
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

// ── Bar chart ─────────────────────────────────────────────────────────────────
function BarChart({ data, labels, color = '#7C5CFF', height = 140 }: {
  data: number[]; labels: string[]; color?: string; height?: number;
}) {
  const max = Math.max(...data);
  return (
    <div>
      <div className="flex items-end gap-1.5" style={{ height }}>
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

// ── Static data ───────────────────────────────────────────────────────────────
const kpiSparklines = {
  revenue:  [12, 19, 8, 24, 18, 32, 28, 35, 22, 40, 38, 45],
  attendees:[80,120, 95,160,140,200,180,220,195,260,240,280],
  events:   [8, 10, 9, 12, 11, 14, 13, 15, 14, 16, 15, 17],
  fillRate: [18, 22, 19, 25, 21, 28, 24, 30, 26, 32, 29, 35],
};

const regData: Record<Period, number[]> = {
  '7d':  [18, 24, 21, 30, 27, 35, 32],
  '30d': [80, 95, 88, 110, 102, 125, 118, 140, 132, 155, 148, 170],
  '90d': [320, 380, 350, 420, 390, 460, 430, 500, 470, 540, 510, 580],
  'All': [180, 240, 210, 310, 280, 390, 360, 450, 420, 540, 510, 620],
};
const regLabels: Record<Period, string[]> = {
  '7d':  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  '30d': Array.from({ length: 12 }, (_, i) => `${i * 3 + 1}`),
  '90d': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  'All': ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'],
};

const activeEvents = [
  { id: 'event-001', title: 'Cairo Jazz Night: Live at Sunset', date: 'May 15, 2026', attendees: 142, capacity: 200, revenue: 21300, category: 'Music' },
  { id: 'event-002', title: 'AI & Machine Learning Summit 2026', date: 'May 20, 2026', attendees: 387, capacity: 500, revenue: 0, category: 'Tech' },
  { id: 'event-005', title: 'Street Food Festival: Flavors of Cairo', date: 'May 18, 2026', attendees: 654, capacity: 1000, revenue: 49050, category: 'Food' },
];

const recentActivity = [
  { icon: '🎟️', text: 'New booking for Cairo Jazz Night', sub: 'General Admission × 2', timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString() },
  { icon: '💬', text: 'New community discussion', sub: 'AI Summit — "What to expect"', timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString() },
  { icon: '💰', text: 'Payment received', sub: 'Street Food Festival — EGP 150', timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString() },
  { icon: '👤', text: 'New follower', sub: 'Nour Ibrahim started following you', timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
  { icon: '🎟️', text: 'New booking for AI Summit', sub: 'Free Admission × 1', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
];

const aiInsights = [
  { icon: '📈', title: 'Pricing opportunity', body: 'VIP tickets for Jazz Night are 94% sold. Raise price by 15% for remaining spots.', impact: 'High', bg: 'bg-primary/5 dark:bg-primary/10' },
  { icon: '⏰', title: 'Best promotion window', body: 'Thursday 6–8 PM drives 3× more RSVPs for your audience. Schedule your next post now.', impact: 'Medium', bg: 'bg-primary/5 dark:bg-primary/10' },
  { icon: '🔥', title: 'Trending category', body: 'Tech events are up 40% this month. Your AI Summit is perfectly timed.', impact: 'High', bg: 'bg-primary/5 dark:bg-primary/10' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function OrganizerAnalytics() {
  const { currentUser, events } = useAppStore();
  const [period, setPeriod] = useState<Period>('30d');
  const [activeInsight, setActiveInsight] = useState(0);

  const catalogStats = useMemo(() => {
    const now = new Date();
    const mine = events.filter((e) => e.organizerId === currentUser?.id);
    const pool = mine.length > 0 ? mine : events;
    const upcoming = pool.filter((e) => new Date(e.date) >= now).length;
    const totalRsvp = pool.reduce((s, e) => s + e.rsvpCount, 0);
    const estRevenue = pool.reduce((s, e) => s + e.rsvpCount * e.price, 0);
    const avgFill = pool.length
      ? Math.round(pool.reduce((s, e) => s + (e.capacity ? (e.rsvpCount / e.capacity) * 100 : 0), 0) / pool.length)
      : 0;
    return { upcoming, totalRsvp, estRevenue, total: pool.length, avgFill, pool };
  }, [events, currentUser?.id]);

  const displayEvents = useMemo(() => {
    const now = new Date();
    const fromStore = catalogStats.pool
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
    if (fromStore.length > 0) {
      return fromStore.map((e) => ({
        id: e.id,
        title: e.title,
        date: new Date(e.date).toLocaleDateString('en-EG', { month: 'short', day: 'numeric', year: 'numeric' }),
        attendees: e.rsvpCount,
        capacity: e.capacity,
        revenue: e.rsvpCount * e.price,
        category: e.category,
        imageUrl: e.imageUrl,
      }));
    }
    return activeEvents;
  }, [catalogStats.pool]);

  const exportCsv = () => {
    const header = 'title,date,rsvp,capacity,price_egp,est_revenue_egp';
    const lines = events.map((e) => `"${e.title.replace(/"/g, '""')}",${e.date},${e.rsvpCount},${e.capacity},${e.price},${e.rsvpCount * e.price}`);
    downloadTextFile(`eventra-organizer-export-${Date.now()}.csv`, [header, ...lines].join('\n'));
    demoToast('Report exported', 'CSV reflects the current demo event catalog.');
  };

  return (
    <DashboardPage>
      <DashboardHero
        badge="Organizer"
        badgeIcon={Crown}
        name={currentUser?.name ?? 'Organizer'}
        subtitle="Your event command center — track sales, fill rates, and AI-powered growth opportunities."
        meta={<LiveIndicator label="Events syncing" />}
        actions={
          <>
            <button type="button" onClick={exportCsv} className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <Link to="/organizer/wallet" className="btn-secondary flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Wallet</span>
            </Link>
            <Link to="/organizer/events/create" className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Event
            </Link>
          </>
        }
        stats={[
          { label: 'Events', value: String(catalogStats.total), hint: 'In your catalog' },
          { label: 'Upcoming', value: String(catalogStats.upcoming), hint: 'Scheduled ahead' },
          { label: 'Total RSVPs', value: catalogStats.totalRsvp.toLocaleString(), hint: 'Across events' },
          { label: 'Est. Revenue', value: `EGP ${catalogStats.estRevenue.toLocaleString()}`, hint: `${catalogStats.avgFill}% avg fill` },
        ]}
      />

      <QuickActionGrid
        items={[
          { to: '/organizer/events/create', icon: Plus, label: 'Create Event', grad: 'from-[#7C5CFF] to-[#9B8CFF]' },
          { to: '/organizer/analytics', icon: BarChart3, label: 'Analytics', grad: 'from-[#7C5CFF] to-[#5B3FE0]' },
          { to: '/organizer/messages', icon: MessageSquare, label: 'Messages', grad: 'from-[#9B8CFF] to-[#7C5CFF]' },
          { to: '/organizer/events', icon: Calendar, label: 'My Events', grad: 'from-[#C4B5FD] to-[#9B8CFF]' },
        ]}
      />

      <CommandStrip
        title="Today's checklist"
        description="Quick steps before your next event goes live."
        actions={
          <>
            <Link to="/organizer/messages" className="btn-secondary text-body-sm">Reply to attendees</Link>
            <Link to="/organizer/events" className="btn-secondary text-body-sm">Confirm run-of-show</Link>
            <Link to="/organizer/analytics" className="btn-primary text-body-sm">Check sell-through</Link>
          </>
        }
      />

      <div className="dashboard-grid dashboard-grid-4">
        {[
          { label: 'Total Revenue', value: 'EGP 45.2K', change: '+18%', up: true, data: kpiSparklines.revenue, color: '#7C5CFF', icon: DollarSign, iconClass: 'icon-box-primary' },
          { label: 'Total Attendees', value: '1,247', change: '+28%', up: true, data: kpiSparklines.attendees, color: '#9B8CFF', icon: Users, iconClass: 'icon-box-primary' },
          { label: 'Active Events', value: '24', change: '+12%', up: true, data: kpiSparklines.events, color: '#C4B5FD', icon: Calendar, iconClass: 'icon-box-primary' },
          { label: 'Avg Fill Rate', value: '87%', change: '+8%', up: true, data: kpiSparklines.fillRate, color: '#7C5CFF', icon: TrendingUp, iconClass: 'icon-box-primary' },
        ].map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`icon-box ${kpi.iconClass}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
              <span className={`kpi-trend ${kpi.up ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="kpi-value mb-0.5">{kpi.value}</p>
            <p className="kpi-label mb-3">{kpi.label}</p>
            <Sparkline data={kpi.data} color={kpi.color} />
          </div>
        ))}
      </div>

      {/* Registration chart with period selector */}
      <div className="bento-section">
        <div className="bento-header">
          <div className="bento-title-wrapper">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="bento-title">Registrations Over Time</h2>
          </div>
          <PeriodTabs periods={PERIODS} value={period} onChange={setPeriod} />
        </div>
        <BarChart data={regData[period]} labels={regLabels[period]} color="url(#orgGrad)" height={160} />
        <svg width="0" height="0" aria-hidden>
          <defs>
            <linearGradient id="orgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFF" />
              <stop offset="100%" stopColor="#9B8CFF" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="dashboard-grid dashboard-grid-3-lg">
        {/* Active Events — 2 cols */}
        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <Flame className="w-5 h-5 text-primary" />
              <h2 className="bento-title">Active Events</h2>
            </div>
            <Link to="/organizer/events" className="flex items-center gap-1 text-caption font-semibold text-primary hover:underline">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {displayEvents.map((event) => {
              const fill = Math.round((event.attendees / event.capacity) * 100);
              const fillColor = fill >= 80 ? '#7C5CFF' : fill >= 50 ? '#9B8CFF' : '#C4B5FD';
              return (
                <div key={event.id} className="card-surface hover:border-primary/30 transition-all group">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex gap-3 flex-1 min-w-0">
                      {'imageUrl' in event && event.imageUrl && (
                        <img
                          src={event.imageUrl}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0 ring-2 ring-primary/10 group-hover:ring-primary/25 transition-all"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="status-pill bg-primary/10 text-primary text-caption">{event.category}</span>
                          {fill >= 80 && (
                            <span className="status-pill bg-primary/15 text-primary text-caption">Almost full</span>
                          )}
                        </div>
                        <h3 className="text-body-sm font-bold text-foreground line-clamp-1">{event.title}</h3>
                        <p className="text-caption text-muted-foreground mt-0.5">{event.date}</p>
                      </div>
                    </div>
                    <Link to={`/organizer/events/${event.id}/manage`} className="btn-secondary text-caption self-start sm:self-auto flex-shrink-0">
                      Manage
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3 text-caption">
                    <div>
                      <p className="text-muted-foreground">Attendees</p>
                      <p className="font-bold text-foreground">{event.attendees.toLocaleString()} / {event.capacity.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fill Rate</p>
                      <p className="font-bold text-foreground">{fill}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-bold text-foreground">{event.revenue === 0 ? 'Free' : `EGP ${event.revenue.toLocaleString()}`}</p>
                    </div>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${fill}%`, background: fillColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insights — 1 col */}
        <div className="bento-section flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[#9B8CFF] flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-h3 font-bold text-foreground">AI Insights</h2>
            <span className="badge-ai ml-auto">Powered by AI</span>
          </div>
          <div className="flex gap-1 mb-4">
            {aiInsights.map((_, i) => (
              <button key={i} onClick={() => setActiveInsight(i)} className={`flex-1 h-1.5 rounded-full transition-all ${i === activeInsight ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
          <div className={`insight-card mb-4 ${aiInsights[activeInsight].bg}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{aiInsights[activeInsight].icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-body-sm font-bold text-foreground">{aiInsights[activeInsight].title}</p>
                  <span className="text-caption font-semibold text-primary">{aiInsights[activeInsight].impact}</span>
                </div>
                <p className="text-caption text-muted-foreground leading-relaxed">{aiInsights[activeInsight].body}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 flex-1">
            {aiInsights.map((ins, i) => (
              <button
                key={i}
                onClick={() => setActiveInsight(i)}
                className={`w-full flex items-center gap-3 insight-card text-left transition-all ${i === activeInsight ? 'bg-primary/8 border border-primary/20' : 'hover:bg-muted/50 border border-transparent'}`}
              >
                <span className="text-lg">{ins.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-caption font-semibold text-foreground truncate">{ins.title}</p>
                  <p className="text-caption font-semibold text-primary">{ins.impact} impact</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="dashboard-grid dashboard-grid-2">
        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="bento-title">Sales Over Time</h2>
            </div>
          </div>
          <div className="h-48 flex items-end justify-between gap-1.5 pt-4">
            {Array.from({ length: 12 }, (_, i) => {
              const h = 40 + ((i * 7 + 23) % 60);
              return (
                <div key={i} className="flex-1 flex flex-col justify-end group relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-caption px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-semibold">
                    EGP {(h * 1.2).toFixed(1)}K
                  </div>
                  <div className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }} />
                  <p className="text-caption font-semibold text-muted-foreground mt-2 text-center">M{i + 1}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="bento-title">Conversion Funnel</h2>
            </div>
          </div>
          <div className="space-y-4 pt-2">
            {[
              { label: 'Page Views', value: '12,432', pct: 100, color: 'bg-primary' },
              { label: 'Add to Cart', value: '3,108', pct: 25, color: 'bg-primary/70' },
              { label: 'Checkout Started', value: '1,865', pct: 15, color: 'bg-primary/50' },
              { label: 'Completed RSVPs', value: '1,247', pct: 10, color: 'bg-primary/35' },
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

      {/* Recent Activity + Top Performing */}
      <div className="dashboard-grid dashboard-grid-2">
        {/* Recent Activity */}
        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="bento-title">Recent Activity</h2>
            </div>
            <LiveIndicator />
          </div>
          <div className="space-y-2">
            {recentActivity.map((item, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon-wrapper">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-semibold text-foreground">{item.text}</p>
                  <p className="text-caption text-muted-foreground">{item.sub}</p>
                </div>
                <span className="text-caption text-muted-foreground whitespace-nowrap flex-shrink-0">{formatRelativeTime(item.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Events */}
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
              <div key={i} className="card-surface flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-body-sm font-bold text-foreground truncate">{e.title}</p>
                  <p className="text-caption text-muted-foreground">{e.rsvp} attendees · {e.fill}% full</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-body-sm font-black text-foreground">{e.revenue === 0 ? 'FREE' : `EGP ${e.revenue.toLocaleString()}`}</p>
                  <div className="flex items-center gap-1 text-primary font-semibold text-caption justify-end">
                    <ArrowUpRight className="w-3 h-3" /> +12%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Retention metrics */}
      <div className="dashboard-grid dashboard-grid-3">
        {[
          { label: 'Repeat Attendees', value: '42%', icon: Repeat, desc: 'Attended 2+ events', bg: 'bg-primary/10', color: 'text-primary' },
          { label: 'Avg Ticket Price', value: 'EGP 125', icon: DollarSign, desc: 'Across all events', bg: 'bg-primary/10', color: 'text-primary' },
          { label: 'Upcoming Events', value: String(catalogStats.upcoming), icon: Calendar, desc: 'Scheduled this month', bg: 'bg-primary/10', color: 'text-primary' },
        ].map((s) => (
          <div key={s.label} className="bento-section flex items-center gap-4">
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

      {/* Detailed AI insights grid */}
      <div className="bento-section">
        <div className="bento-header">
          <div className="bento-title-wrapper">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="bento-title">AI Deep Insights</h2>
          </div>
          <span className="badge-ai">Powered by AI</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: TrendingUp, bg: 'bg-primary/10', color: 'text-primary', title: 'Peak Booking Window', body: 'Your events get 3× more RSVPs when published on Thursday evenings. Schedule your next launch for 7–9 PM.' },
            { icon: Target, bg: 'bg-primary/10', color: 'text-primary', title: 'Audience Fit Score', body: 'Street Food Festival had a 94% audience match. Replicating its category + vibe tags for future events could increase repeat attendance.' },
            { icon: Users, bg: 'bg-primary/10', color: 'text-primary', title: 'Retention Opportunity', body: '38% of attendees who came to Jazz Night have not booked again. A targeted follow-up message could recover ~54 bookings.' },
            { icon: DollarSign, bg: 'bg-primary/10', color: 'text-primary', title: 'Revenue Forecast', body: 'Based on your growth trend, projected revenue for next month is EGP 52–61K — up 15% if you add an early-bird tier.' },
          ].map((insight) => (
            <div key={insight.title} className="card-surface flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${insight.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <insight.icon className={`w-5 h-5 ${insight.color}`} />
              </div>
              <div>
                <p className="text-body-sm font-bold text-foreground mb-1">{insight.title}</p>
                <p className="text-caption text-muted-foreground leading-relaxed">{insight.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardPage>
  );
}
