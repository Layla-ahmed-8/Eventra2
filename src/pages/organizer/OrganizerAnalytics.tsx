import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Calendar, DollarSign, TrendingUp, Plus, Sparkles,
  ArrowUpRight, ArrowDownRight, Activity, ChevronRight, Flame,
  Download, Target, Repeat,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { demoToast, downloadTextFile } from '../../lib/demoFeedback';
import { formatRelativeTime } from '../../lib/utils';

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
  { icon: '📈', title: 'Pricing opportunity', body: 'VIP tickets for Jazz Night are 94% sold. Raise price by 15% for remaining spots.', impact: 'High', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
  { icon: '⏰', title: 'Best promotion window', body: 'Thursday 6–8 PM drives 3× more RSVPs for your audience. Schedule your next post now.', impact: 'Medium', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { icon: '🔥', title: 'Trending category', body: 'Tech events are up 40% this month. Your AI Summit is perfectly timed.', impact: 'High', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function OrganizerAnalytics() {
  const { currentUser, events } = useAppStore();
  const [period, setPeriod] = useState<Period>('30d');
  const [activeInsight, setActiveInsight] = useState(0);

  const catalogStats = useMemo(() => {
    const now = new Date();
    const upcoming = events.filter((e) => new Date(e.date) >= now).length;
    const totalRsvp = events.reduce((s, e) => s + e.rsvpCount, 0);
    const estRevenue = events.reduce((s, e) => s + e.rsvpCount * e.price, 0);
    return { upcoming, totalRsvp, estRevenue, total: events.length };
  }, [events]);

  const exportCsv = () => {
    const header = 'title,date,rsvp,capacity,price_egp,est_revenue_egp';
    const lines = events.map((e) => `"${e.title.replace(/"/g, '""')}",${e.date},${e.rsvpCount},${e.capacity},${e.price},${e.rsvpCount * e.price}`);
    downloadTextFile(`eventra-organizer-export-${Date.now()}.csv`, [header, ...lines].join('\n'));
    demoToast('Report exported', 'CSV reflects the current demo event catalog.');
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-caption text-muted-foreground mb-0.5">{greeting()},</p>
          <h1 className="text-h1 font-bold text-foreground">{currentUser?.name ?? 'Organizer'} 👋</h1>
          <p className="text-body-sm text-muted-foreground mt-1">Analytics overview and real-time insights for your events.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-start">
          <button type="button" onClick={exportCsv} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <Link to="/organizer/events/create" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
        </div>
      </div>

      {/* Catalog quick stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Events in catalog', value: catalogStats.total },
          { label: 'Upcoming (dated)', value: catalogStats.upcoming },
          { label: 'Total RSVPs', value: catalogStats.totalRsvp.toLocaleString() },
          { label: 'Est. ticket revenue', value: `EGP ${catalogStats.estRevenue.toLocaleString()}` },
        ].map((s) => (
          <div key={s.label} className="kpi-card border border-border/80">
            <p className="kpi-label">{s.label}</p>
            <p className="kpi-value">{s.value}</p>
          </div>
        ))}
      </div>

      {/* KPI cards with sparklines */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: 'EGP 45.2K', change: '+18%', up: true, data: kpiSparklines.revenue, color: '#7C5CFF', icon: DollarSign, iconClass: 'icon-box-primary' },
          { label: 'Total Attendees', value: '1,247', change: '+28%', up: true, data: kpiSparklines.attendees, color: '#00D4FF', icon: Users, iconClass: 'icon-box-cyan' },
          { label: 'Active Events', value: '24', change: '+12%', up: true, data: kpiSparklines.events, color: '#FF9B3D', icon: Calendar, iconClass: 'icon-box-orange' },
          { label: 'Avg Fill Rate', value: '87%', change: '+8%', up: true, data: kpiSparklines.fillRate, color: '#22C55E', icon: TrendingUp, iconClass: 'icon-box-green' },
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
          <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
            {PERIODS.map((p) => (
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
        <BarChart data={regData[period]} labels={regLabels[period]} color="#7C5CFF" height={160} />
      </div>

      {/* Active Events + AI Insights */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Active Events — 2 cols */}
        <div className="lg:col-span-2 bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="bento-title">Active Events</h2>
            </div>
            <Link to="/organizer/events" className="flex items-center gap-1 text-caption font-semibold text-primary hover:underline">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {activeEvents.map((event) => {
              const fill = Math.round((event.attendees / event.capacity) * 100);
              const fillColor = fill >= 80 ? '#22C55E' : fill >= 50 ? '#7C5CFF' : '#FF9B3D';
              return (
                <div key={event.id} className="card-surface p-4 hover:border-primary/30 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="status-pill bg-primary/10 text-primary text-caption">{event.category}</span>
                        {fill >= 80 && <span className="status-pill bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-caption">Almost full</span>}
                      </div>
                      <h3 className="text-body-sm font-bold text-foreground line-clamp-1">{event.title}</h3>
                      <p className="text-caption text-muted-foreground mt-0.5">{event.date}</p>
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
        <div className="surface-panel p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-[#00D4FF] flex items-center justify-center">
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
          <div className={`rounded-2xl p-4 mb-4 ${aiInsights[activeInsight].bg}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{aiInsights[activeInsight].icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-body-sm font-bold text-foreground">{aiInsights[activeInsight].title}</p>
                  <span className={`text-caption font-bold ${aiInsights[activeInsight].color}`}>{aiInsights[activeInsight].impact}</span>
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
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${i === activeInsight ? 'bg-primary/8 border border-primary/20' : 'hover:bg-muted/50'}`}
              >
                <span className="text-lg">{ins.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-caption font-semibold text-foreground truncate">{ins.title}</p>
                  <p className={`text-caption font-bold ${ins.color}`}>{ins.impact} impact</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-5">
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
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                    EGP {(h * 1.2).toFixed(1)}K
                  </div>
                  <div className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }} />
                  <p className="text-[10px] font-bold text-muted-foreground mt-2 text-center">M{i + 1}</p>
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

      {/* Recent Activity + Top Performing */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Recent Activity */}
        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="bento-title">Recent Activity</h2>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-caption text-green-600 dark:text-green-400 font-semibold">Live</span>
            </div>
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
              <div key={i} className="card-surface p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-body-sm font-bold text-foreground truncate">{e.title}</p>
                  <p className="text-caption text-muted-foreground">{e.rsvp} attendees · {e.fill}% full</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-body-sm font-black text-foreground">{e.revenue === 0 ? 'FREE' : `EGP ${e.revenue.toLocaleString()}`}</p>
                  <div className="flex items-center gap-1 text-green-600 font-bold text-[10px] justify-end">
                    <ArrowUpRight className="w-3 h-3" /> +12%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Retention metrics */}
      <div className="grid md:grid-cols-3 gap-5">
        {[
          { label: 'Repeat Attendees', value: '42%', icon: Repeat, desc: 'Attended 2+ events', color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Avg Ticket Price', value: 'EGP 125', icon: DollarSign, desc: 'Across all events', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Upcoming Events', value: String(catalogStats.upcoming), icon: Calendar, desc: 'Scheduled this month', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10' },
        ].map((s) => (
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

      {/* Detailed AI insights grid */}
      <div className="bento-section">
        <div className="bento-header">
          <div className="bento-title-wrapper">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="bento-title">AI Deep Insights</h2>
          </div>
          <span className="badge-ai">Powered by AI</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: TrendingUp, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10', title: 'Peak Booking Window', body: 'Your events get 3× more RSVPs when published on Thursday evenings. Schedule your next launch for 7–9 PM.' },
            { icon: Target, color: 'text-primary', bg: 'bg-primary/10', title: 'Audience Fit Score', body: 'Street Food Festival had a 94% audience match. Replicating its category + vibe tags for future events could increase repeat attendance.' },
            { icon: Users, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10', title: 'Retention Opportunity', body: '38% of attendees who came to Jazz Night have not booked again. A targeted follow-up message could recover ~54 bookings.' },
            { icon: DollarSign, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10', title: 'Revenue Forecast', body: 'Based on your growth trend, projected revenue for next month is EGP 52–61K — up 15% if you add an early-bird tier.' },
          ].map((insight) => (
            <div key={insight.title} className="card-surface p-5 flex items-start gap-4">
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
    </div>
  );
}
