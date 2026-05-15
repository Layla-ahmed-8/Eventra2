import { Link } from 'react-router-dom';

import { demoToast } from '../../lib/demoFeedback';
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
  const [lastRefresh, setLastRefresh] = useState(() => new Date().toLocaleTimeString());

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-h1 font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-body text-muted-foreground mt-1">Platform overview and real-time activity</p>
      </div>

      {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Users className="w-5 h-5 text-[#6C4CF1]" />
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

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <Link to="/admin/moderation" className="surface-panel p-4 flex flex-col gap-1 hover:border-primary/40 transition-colors border border-transparent">
          <span className="text-caption font-semibold text-muted-foreground">Moderation</span>
          <span className="text-h3 font-bold text-foreground">Queue</span>
          <span className="text-caption text-primary">Open center →</span>
        </Link>
        <Link to="/admin/users" className="surface-panel p-4 flex flex-col gap-1 hover:border-primary/40 transition-colors border border-transparent">
          <span className="text-caption font-semibold text-muted-foreground">Organizer requests</span>
          <span className="text-h3 font-bold text-foreground">{pendingRequests}</span>
          <span className="text-caption text-primary">Review users →</span>
        </Link>
        <Link to="/admin/events" className="surface-panel p-4 flex flex-col gap-1 hover:border-primary/40 transition-colors border border-transparent">
          <span className="text-caption font-semibold text-muted-foreground">Events</span>
          <span className="text-h3 font-bold text-foreground">Approvals</span>
          <span className="text-caption text-primary">Pending list →</span>
        </Link>
        <Link to="/admin/analytics" className="surface-panel p-4 flex flex-col gap-1 hover:border-primary/40 transition-colors border border-transparent">
          <span className="text-caption font-semibold text-muted-foreground">Analytics</span>
          <span className="text-h3 font-bold text-foreground">Reports</span>
          <span className="text-caption text-primary">View insights →</span>
        </Link>
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
            <p className="text-display font-semibold text-foreground mb-1">12.4K</p>
            <p className="text-caption text-muted-foreground">Total Users</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-2xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#00C2FF]" />
              </div>
              <span className="status-pill text-green-700 bg-green-100">+24%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">847</p>
            <p className="text-caption text-muted-foreground">Active Events</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#FF8A00]" />
              </div>
              <span className="status-pill text-green-700 bg-green-100">+32%</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">EGP 2.4M</p>
            <p className="text-caption text-muted-foreground">Platform Revenue</p>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <span className="status-pill text-red-700 bg-red-100">8 pending</span>
            </div>
            <p className="text-display font-semibold text-foreground mb-1">24</p>
            <p className="text-caption text-muted-foreground">Flags & Reports</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Real-time Activity */}
          <div className="md:col-span-2">
            <div className="surface-panel p-5 mb-6">
              <div className="panel-header">
                <h2 className="text-h2 font-semibold text-foreground">Real-time Activity</h2>
                <Activity className="w-5 h-5 text-green-500 animate-pulse" />
              </div>

              <div className="space-y-3">
                {[
                  {
                    action: 'New user registration',
                    user: 'Sarah Ahmed',
                    time: 'Just now',
                    type: 'user',
                  },
                  {
                    action: 'Event published',
                    user: 'Tech Cairo',
                    time: '2 minutes ago',
                    type: 'event',
                  },
                  {
                    action: 'Payment processed',
                    user: 'Mohamed Ali',
                    time: '5 minutes ago',
                    type: 'payment',
                  },
                  {
                    action: 'Event flagged for review',
                    user: 'System',
                    time: '8 minutes ago',
                    type: 'flag',
                  },
                  {
                    action: 'New organizer account',
                    user: 'Cairo Events Co',
                    time: '12 minutes ago',
                    type: 'organizer',
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="surface-panel p-3 flex items-center gap-4 border border-border"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === 'flag' ? 'bg-red-500' : 'bg-green-500'
                      }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-body text-foreground">
                        <span className="font-semibold text-foreground">{activity.action}</span> •{' '}
                        {activity.user}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                title={`Last refreshed ${lastRefresh}`}
                onClick={() => {
                  setLastRefresh(new Date().toLocaleTimeString());
                  demoToast('Dashboard refreshed', 'Live metrics are simulated in this demo.');
                }}
              >
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            {/* Platform Growth Chart */}
            <div className="surface-panel p-5">
              <h2 className="text-h2 font-semibold text-foreground mb-6">
                User Growth (Last 30 Days)
              </h2>
              <div className="h-64 flex items-end justify-between gap-2">
                {Array.from({ length: 30 }, (_, i) => {
                  const height = 30 + Math.random() * 70;
                  return (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div
                        className="bg-gradient-to-t from-[#6C4CF1] to-[#00C2FF] rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="surface-panel p-6">
              <h3 className="text-h2 font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/admin/events"
                  className="btn-primary w-full"
                >
                  Review Events
                </Link>
                <Link
                  to="/admin/users"
                  className="btn-secondary w-full"
                >
                  Manage Users
                </Link>
                <Link
                  to="/admin/community"
                  className="btn-secondary w-full"
                >
                  Moderate Content
                </Link>
                <Link
                  to="/admin/analytics"
                  className="btn-secondary w-full"
                >
                  View Analytics
                </Link>
              </div>
            </div>

            {/* Pending Reviews */}
            <div className="surface-panel p-6">
              <h3 className="text-h2 font-semibold text-foreground mb-4">Pending Reviews</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-body text-muted-foreground">Events</span>
                  <span className="status-pill bg-orange-100 text-orange-700">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body text-muted-foreground">User Reports</span>
                  <span className="status-pill bg-red-100 text-red-700">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-body text-muted-foreground">Flagged Posts</span>
                  <span className="status-pill bg-yellow-100 text-yellow-700">8</span>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="surface-panel p-6">
              <h3 className="text-h2 font-semibold text-foreground mb-4">System Health</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-body mb-1">
                    <span className="text-muted-foreground">API Status</span>
                    <span className="text-green-600 font-semibold">Healthy</span>
                  </div>
                  <div className="h-2 bg-[#F4F3FF] rounded-full">
                    <div className="h-full w-full bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-body mb-1">
                    <span className="text-muted-foreground">Database</span>
                    <span className="text-green-600 font-semibold">98%</span>
                  </div>
                  <div className="h-2 bg-[#F4F3FF] rounded-full">
                    <div className="h-full w-[98%] bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-body mb-1">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="text-yellow-600 font-semibold">72%</span>
                  </div>
                  <div className="h-2 bg-[#F4F3FF] rounded-full">
                    <div className="h-full w-[72%] bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

