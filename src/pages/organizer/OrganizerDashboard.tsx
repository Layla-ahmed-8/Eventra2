import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Calendar, DollarSign, TrendingUp, Plus, BarChart3,
  Sparkles, ArrowUpRight, ArrowDownRight, Zap, MessageSquare,
  Eye, Clock, Target, Activity,
  ChevronRight, Flame, Download
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { demoToast, downloadTextFile } from '../../lib/demoFeedback';

// ── Mini sparkline bar chart ─────────────────────────────────────────────────
function Sparkline({ data, color = '#7C5CFF' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm opacity-80"
          style={{ height: `${(v / max) * 100}%`, background: color }}
        />
      ))}
    </div>
  );
}

const revenueData = [12, 19, 8, 24, 18, 32, 28, 35, 22, 40, 38, 45];
const attendeeData = [80, 120, 95, 160, 140, 200, 180, 220, 195, 260, 240, 280];
const conversionData = [18, 22, 19, 25, 21, 28, 24, 30, 26, 32, 29, 35];

const activeEvents = [
  { id: 'event-001', title: 'Cairo Jazz Night: Live at Sunset', date: 'May 15, 2026', attendees: 142, capacity: 200, revenue: 21300, category: 'Music', trend: 'up' },
  { id: 'event-002', title: 'AI & Machine Learning Summit 2026', date: 'May 20, 2026', attendees: 387, capacity: 500, revenue: 0, category: 'Tech', trend: 'up' },
  { id: 'event-005', title: 'Street Food Festival: Flavors of Cairo', date: 'May 18, 2026', attendees: 654, capacity: 1000, revenue: 49050, category: 'Food', trend: 'up' },
];

const recentActivity = [
  { icon: '🎟️', text: 'New booking for Cairo Jazz Night', sub: 'General Admission × 2', time: '3 min ago', type: 'booking' },
  { icon: '💬', text: 'New community discussion', sub: 'AI Summit — "What to expect"', time: '18 min ago', type: 'community' },
  { icon: '💰', text: 'Payment received', sub: 'Street Food Festival — EGP 150', time: '42 min ago', type: 'payment' },
  { icon: '👤', text: 'New follower', sub: 'Nour Ibrahim started following you', time: '1 hr ago', type: 'follow' },
  { icon: '🎟️', text: 'New booking for AI Summit', sub: 'Free Admission × 1', time: '2 hrs ago', type: 'booking' },
];

const aiInsights = [
  { icon: '📈', title: 'Pricing opportunity', body: 'VIP tickets for Jazz Night are 94% sold. Raise price by 15% for remaining spots.', impact: 'High', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
  { icon: '⏰', title: 'Best promotion window', body: 'Thursday 6–8 PM drives 3× more RSVPs for your audience. Schedule your next post now.', impact: 'Medium', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { icon: '🔥', title: 'Trending category', body: 'Tech events are up 40% this month. Your AI Summit is perfectly timed.', impact: 'High', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
];

export default function OrganizerDashboard() {
  const { currentUser, events } = useAppStore();
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
    const lines = events.map(
      (e) =>
        `"${e.title.replace(/"/g, '""')}",${e.date},${e.rsvpCount},${e.capacity},${e.price},${e.rsvpCount * e.price}`
    );
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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-caption text-muted-foreground mb-0.5">{greeting()},</p>
          <h1 className="text-h1 font-bold text-foreground">{currentUser?.name ?? 'Organizer'} 👋</h1>
          <p className="text-body-sm text-muted-foreground mt-1">Here's what's happening with your events today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <button type="button" onClick={exportCsv} className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <Link to="/organizer/analytics" className="btn-secondary flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Link>
          <Link to="/organizer/events/create" className="btn-primary">
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
        </div>
      </div>

      {/* Catalog Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="kpi-card border border-border/80">
          <p className="kpi-label">Events in catalog</p>
          <p className="kpi-value">{catalogStats.total}</p>
        </div>
        <div className="kpi-card border border-border/80">
          <p className="kpi-label">Upcoming (dated)</p>
          <p className="kpi-value">{catalogStats.upcoming}</p>
        </div>
        <div className="kpi-card border border-border/80">
          <p className="kpi-label">Total RSVPs (mock)</p>
          <p className="kpi-value">{catalogStats.totalRsvp.toLocaleString()}</p>
        </div>
        <div className="kpi-card border border-border/80">
          <p className="kpi-label">Est. ticket revenue</p>
          <p className="kpi-value">EGP {catalogStats.estRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bento-section p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-body-sm font-semibold text-foreground">Today's checklist</p>
          <p className="text-caption text-muted-foreground">Jump into the steps organizers usually run before doors open.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/organizer/messages" className="btn-secondary text-body-sm">
            Reply to attendees
          </Link>
          <Link to="/organizer/events" className="btn-secondary text-body-sm">
            Confirm run-of-show
          </Link>
          <Link to="/organizer/analytics" className="btn-primary text-body-sm">
            Check sell-through
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Revenue',
            value: 'EGP 45.2K',
            change: '+18%',
            up: true,
            data: revenueData,
            color: '#7C5CFF',
            icon: DollarSign,
            iconClass: 'icon-box-primary',
          },
          {
            label: 'Total Attendees',
            value: '1,247',
            change: '+28%',
            up: true,
            data: attendeeData,
            color: '#00D4FF',
            icon: Users,
            iconClass: 'icon-box-cyan',
          },
          {
            label: 'Active Events',
            value: '24',
            change: '+12%',
            up: true,
            data: [8,10,9,12,11,14,13,15,14,16,15,17],
            color: '#FF9B3D',
            icon: Calendar,
            iconClass: 'icon-box-orange',
          },
          {
            label: 'Avg Fill Rate',
            value: '87%',
            change: '+8%',
            up: true,
            data: conversionData,
            color: '#22C55E',
            icon: TrendingUp,
            iconClass: 'icon-box-green',
          },
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

      {/* ── Main bento grid ── */}
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
                    <Link
                      to={`/organizer/events/${event.id}/manage`}
                      className="btn-secondary text-caption self-start sm:self-auto flex-shrink-0"
                    >
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

                  {/* Fill bar */}
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${fill}%`, background: fillColor }}
                    />
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
          </div>

          {/* Insight tabs */}
          <div className="flex gap-1 mb-4">
            {aiInsights.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveInsight(i)}
                className={`flex-1 h-1.5 rounded-full transition-all ${i === activeInsight ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>

          <div className={`rounded-2xl p-4 mb-4 ${aiInsights[activeInsight].bg}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{aiInsights[activeInsight].icon}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-body-sm font-bold text-foreground">{aiInsights[activeInsight].title}</p>
                  <span className={`text-caption font-bold ${aiInsights[activeInsight].color}`}>
                    {aiInsights[activeInsight].impact}
                  </span>
                </div>
                <p className="text-caption text-muted-foreground leading-relaxed">{aiInsights[activeInsight].body}</p>
              </div>
            </div>
          </div>

          {/* All insights list */}
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

          <Link to="/organizer/analytics" className="btn-secondary w-full mt-4 text-body-sm">
            <BarChart3 className="w-4 h-4" />
            Full Analytics
          </Link>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bento-section">
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
                <div className="activity-icon-wrapper">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-semibold text-foreground">{item.text}</p>
                  <p className="text-caption text-muted-foreground">{item.sub}</p>
                </div>
                <span className="text-caption text-muted-foreground whitespace-nowrap flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — Quick Stats */}
        <div className="space-y-4">
          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <div className="icon-box icon-box-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="status-pill bg-green-100 text-green-700">+12%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">24</p>
            <p className="kpi-label">Total Events</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <div className="icon-box icon-box-cyan">
                <Users className="w-5 h-5" />
              </div>
              <span className="status-pill bg-green-100 text-green-700">+28%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">1,247</p>
            <p className="kpi-label">Total Attendees</p>
          </div>

          <div className="kpi-card">
            <div className="flex items-center justify-between mb-4">
              <div className="icon-box icon-box-green">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="status-pill bg-green-100 text-green-700">+8%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">87%</p>
            <p className="kpi-label">Avg Fill Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
