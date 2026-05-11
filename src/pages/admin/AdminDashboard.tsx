import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Calendar, TrendingUp, AlertCircle, Activity, DollarSign,
  ShieldAlert, CheckCircle2, ArrowUpRight, ArrowDownRight, Zap,
  BarChart3, Eye, Clock, ChevronRight, Cpu, Globe, UserCheck,
  Flag, Sparkles, RefreshCw
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

// ── Mini sparkline ────────────────────────────────────────────────────────────
function Sparkline({ data, color = '#7C5CFF' }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-8">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm opacity-80"
          style={{ height: `${(v / max) * 100}%`, background: color }} />
      ))}
    </div>
  );
}

// ── Donut chart (SVG) ─────────────────────────────────────────────────────────
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
          const el = (
            <circle key={i} cx={36} cy={36} r={r} fill="none" stroke={seg.color}
              strokeWidth={10} strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset} strokeLinecap="butt" />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="space-y-1.5">
        {segments.map(s => (
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

const userGrowthData = [320, 410, 380, 520, 490, 610, 580, 720, 690, 840, 810, 950];
const revenueData    = [180, 240, 210, 310, 280, 390, 360, 450, 420, 540, 510, 620];
const eventData      = [28, 35, 31, 42, 38, 48, 44, 55, 51, 62, 58, 70];

const realtimeActivity = [
  { icon: '👤', action: 'New user registration', user: 'Sarah Ahmed', time: 'Just now', type: 'user' },
  { icon: '📅', action: 'Event published', user: 'Tech Cairo', time: '2 min ago', type: 'event' },
  { icon: '💰', action: 'Payment processed', user: 'Mohamed Ali', time: '5 min ago', type: 'payment' },
  { icon: '🚩', action: 'Event flagged for review', user: 'System AI', time: '8 min ago', type: 'flag' },
  { icon: '🏢', action: 'New organizer account', user: 'Cairo Events Co', time: '12 min ago', type: 'organizer' },
  { icon: '🎟️', action: 'Bulk ticket purchase', user: 'Yasmine K.', time: '18 min ago', type: 'payment' },
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

const topOrganizers = [
  { name: 'Cairo Food Collective', events: 12, revenue: 'EGP 89K', avatar: 'https://i.pravatar.cc/40?img=50' },
  { name: 'Tech Cairo', events: 8, revenue: 'EGP 0', avatar: 'https://i.pravatar.cc/40?img=20' },
  { name: 'Cairo Jazz Club', events: 6, revenue: 'EGP 45K', avatar: 'https://i.pravatar.cc/40?img=10' },
  { name: 'Townhouse Gallery', events: 5, revenue: 'EGP 12K', avatar: 'https://i.pravatar.cc/40?img=40' },
];

export default function AdminDashboard() {
  const { currentUser, organizerRequests } = useAppStore();
  const pendingRequests = organizerRequests.filter(r => r.status === 'pending').length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-caption text-muted-foreground mb-0.5">{greeting()},</p>
          <h1 className="text-h1 font-bold text-foreground">{currentUser?.name ?? 'Admin'} 🛡️</h1>
          <p className="text-body-sm text-muted-foreground mt-1">Platform overview — all systems operational.</p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link to="/admin/analytics" className="btn-secondary flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Analytics
          </Link>
          <Link to="/admin/moderation" className="btn-primary">
            <ShieldAlert className="w-4 h-4" /> Moderation
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '12.4K', change: '+15%', up: true, data: userGrowthData, color: '#7C5CFF', icon: Users, iconBg: 'bg-primary/10', iconColor: 'text-primary' },
          { label: 'Active Events', value: '847', change: '+24%', up: true, data: eventData, color: '#00D4FF', icon: Calendar, iconBg: 'bg-cyan-500/10', iconColor: 'text-cyan-600 dark:text-cyan-400' },
          { label: 'Platform Revenue', value: 'EGP 2.4M', change: '+32%', up: true, data: revenueData, color: '#FF9B3D', icon: DollarSign, iconBg: 'bg-orange-500/10', iconColor: 'text-orange-600 dark:text-orange-400' },
          { label: 'Flags & Reports', value: '24', change: '8 pending', up: false, data: [3,5,4,7,6,8,7,9,8,10,9,11], color: '#EF4444', icon: AlertCircle, iconBg: 'bg-red-500/10', iconColor: 'text-red-600 dark:text-red-400' },
        ].map((kpi) => (
          <div key={kpi.label} className="surface-panel p-4 sm:p-5 hover:-translate-y-0.5 transition-transform">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${kpi.iconBg} flex items-center justify-center`}>
                <kpi.icon className={`w-4 h-4 ${kpi.iconColor}`} />
              </div>
              <span className={`flex items-center gap-0.5 text-caption font-bold ${kpi.up ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="text-h2 font-bold text-foreground mb-0.5">{kpi.value}</p>
            <p className="text-caption text-muted-foreground mb-3">{kpi.label}</p>
            <Sparkline data={kpi.data} color={kpi.color} />
          </div>
        ))}
      </div>

      {/* ── Main bento ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Real-time Activity — 2 cols */}
        <div className="lg:col-span-2 surface-panel p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="text-h3 font-bold text-foreground">Real-time Activity</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-caption text-green-600 dark:text-green-400 font-semibold">Live</span>
            </div>
          </div>

          <div className="space-y-1">
            {realtimeActivity.map((item, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl transition-colors hover:bg-muted/40 ${item.type === 'flag' ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-semibold text-foreground">
                    {item.action}
                    {item.type === 'flag' && <span className="ml-2 status-pill bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">Review needed</span>}
                  </p>
                  <p className="text-caption text-muted-foreground">{item.user}</p>
                </div>
                <span className="text-caption text-muted-foreground whitespace-nowrap flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Reviews — 1 col */}
        <div className="surface-panel p-5">
          <div className="flex items-center gap-2 mb-5">
            <Flag className="w-5 h-5 text-orange-500" />
            <h2 className="text-h3 font-bold text-foreground">Pending Reviews</h2>
          </div>

          <div className="space-y-3 mb-5">
            {pendingItems.map(item => (
              <Link key={item.label} to={item.link}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-colors group"
              >
                <span className="text-body-sm text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`status-pill ${item.bg} ${item.color} font-bold`}>{item.count}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </Link>
            ))}
            {pendingRequests > 0 && (
              <Link to="/admin/users"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/40 transition-colors group"
              >
                <span className="text-body-sm text-muted-foreground group-hover:text-foreground transition-colors">Organizer requests</span>
                <div className="flex items-center gap-2">
                  <span className="status-pill bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-bold">{pendingRequests}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </Link>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="text-body-sm font-bold text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/admin/events" className="btn-primary w-full text-body-sm">
                <CheckCircle2 className="w-4 h-4" /> Review Events
              </Link>
              <Link to="/admin/users" className="btn-secondary w-full text-body-sm">
                <UserCheck className="w-4 h-4" /> Manage Users
              </Link>
              <Link to="/admin/moderation" className="btn-secondary w-full text-body-sm">
                <ShieldAlert className="w-4 h-4" /> Moderation Queue
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* User Growth Chart */}
        <div className="surface-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h3 font-bold text-foreground">User Growth</h3>
            <span className="text-caption text-muted-foreground">Last 12 months</span>
          </div>
          <div className="h-32 flex items-end gap-1 mb-2">
            {userGrowthData.map((v, i) => {
              const max = Math.max(...userGrowthData);
              return (
                <div key={i} className="flex-1 flex flex-col justify-end group relative">
                  <div
                    className="rounded-t transition-all hover:opacity-80"
                    style={{ height: `${(v / max) * 100}%`, background: 'linear-gradient(to top, #7C5CFF, #00D4FF)' }}
                  />
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-foreground text-background text-caption px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {v}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-caption text-muted-foreground">
            <span>Jun '25</span><span>May '26</span>
          </div>
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
            <span className="text-caption text-muted-foreground">Total users</span>
            <span className="text-body-sm font-bold text-foreground">12,437</span>
          </div>
        </div>

        {/* User breakdown donut */}
        <div className="surface-panel p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-h3 font-bold text-foreground">User Breakdown</h3>
            <Globe className="w-4 h-4 text-muted-foreground" />
          </div>
          <DonutChart segments={[
            { value: 11245, color: '#7C5CFF', label: 'Attendees' },
            { value: 1180, color: '#00D4FF', label: 'Organizers' },
            { value: 12, color: '#FF9B3D', label: 'Admins' },
          ]} />
          <div className="mt-4 pt-3 border-t border-border grid grid-cols-2 gap-3">
            <div className="text-center">
              <p className="text-h3 font-bold text-foreground">78%</p>
              <p className="text-caption text-muted-foreground">Retention rate</p>
            </div>
            <div className="text-center">
              <p className="text-h3 font-bold text-foreground">4.2K</p>
              <p className="text-caption text-muted-foreground">Daily active</p>
            </div>
          </div>
        </div>

        {/* System Health + Top Organizers */}
        <div className="space-y-4">
          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <h3 className="text-h3 font-bold text-foreground">System Health</h3>
              </div>
              <button className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-2.5">
              {systemHealth.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-caption mb-1">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-semibold" style={{ color: s.color }}>{s.status}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h3 font-bold text-foreground">Top Organizers</h3>
              <Link to="/admin/users" className="text-caption text-primary font-semibold hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {topOrganizers.map((org, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={org.avatar} alt={org.name} className="w-8 h-8 rounded-full flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-semibold text-foreground truncate">{org.name}</p>
                    <p className="text-caption text-muted-foreground">{org.events} events · {org.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Platform Health ── */}
      <div className="surface-panel p-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-[#00D4FF] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-h3 font-bold text-foreground">AI Platform Intelligence</h2>
          <span className="status-pill bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 ml-auto">All systems nominal</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Recommendation accuracy', value: '95%', icon: '🎯', trend: '+2%' },
            { label: 'Moderation precision', value: '99.1%', icon: '🛡️', trend: '+0.3%' },
            { label: 'Fraud detection rate', value: '98.7%', icon: '🔍', trend: '+1.1%' },
            { label: 'Avg AI response time', value: '142ms', icon: '⚡', trend: '-18ms' },
          ].map(m => (
            <div key={m.label} className="card-surface p-4 text-center">
              <span className="text-2xl mb-2 block">{m.icon}</span>
              <p className="text-h3 font-bold text-foreground">{m.value}</p>
              <p className="text-caption text-muted-foreground mt-0.5">{m.label}</p>
              <p className="text-caption text-green-600 dark:text-green-400 font-semibold mt-1">{m.trend}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
