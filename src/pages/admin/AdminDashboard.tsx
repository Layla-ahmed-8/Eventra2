import { useState } from 'react';
import { Link } from 'react-router-dom';

import { demoToast } from '../../lib/demoFeedback';
import { formatRelativeTime } from '../../lib/utils';
import {
  Users, Calendar, TrendingUp, AlertCircle, Activity, DollarSign,
  ShieldAlert, CheckCircle2, ArrowUpRight, ArrowDownRight, Zap,
  BarChart3, Eye, Clock, ChevronRight, Cpu, Globe, UserCheck,
  Flag, Sparkles, RefreshCw, ArrowRight
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
      <div className="flex items-center justify-between">
        <div>
          <p className="text-caption text-muted-foreground mb-0.5">{greeting()},</p>
          <h1 className="text-h1 font-bold text-foreground">{currentUser?.name ?? 'Admin'} 👋</h1>
          <p className="text-body-sm text-muted-foreground mt-1">Platform overview and real-time activity.</p>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Users',
            value: '12.4K',
            change: '+12%',
            up: true,
            data: userGrowthData,
            color: '#7C5CFF',
            icon: Users,
            iconClass: 'icon-box-primary',
          },
          {
            label: 'Active Events',
            value: '847',
            change: '+24%',
            up: true,
            data: eventData,
            color: '#00D4FF',
            icon: Calendar,
            iconClass: 'icon-box-cyan',
          },
          {
            label: 'Platform Revenue',
            value: 'EGP 2.4M',
            change: '+32%',
            up: true,
            data: revenueData,
            color: '#FF8A00',
            icon: DollarSign,
            iconClass: 'icon-box-orange',
          },
          {
            label: 'System Flags',
            value: '24',
            change: '-5%',
            up: false,
            data: [45, 38, 42, 30, 35, 28, 24],
            color: '#EF4444',
            icon: AlertCircle,
            iconClass: 'icon-box-red',
          },
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

      {/* ── Main bento ── */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Real-time Activity — 2 cols */}
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
                <div className="activity-icon-wrapper">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-body-sm font-semibold text-foreground truncate">{activity.action}</p>
                    <span className="text-caption text-muted-foreground whitespace-nowrap">{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                  <p className="text-caption text-muted-foreground">{activity.user}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="w-full mt-5 py-2.5 text-caption font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors border border-dashed border-primary/20"
          >
            View system audit log
          </button>
        </div>

        {/* Right column — Health & Requests */}
        <div className="space-y-5">
          {/* Pending items */}
          <div className="bento-section">
            <h3 className="text-body-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              Action required
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {pendingItems.map(item => (
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
              {systemHealth.map(s => (
                <div key={s.label} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span>{s.label}</span>
                    <span style={{ color: s.color }}>{s.status}</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

