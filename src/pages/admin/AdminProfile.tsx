import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Edit3, Mail, MapPin, Calendar, LogOut, Shield,
  Users, BarChart3, Settings, AlertCircle, CheckCircle,
  Activity, Database, Cpu, Lock, Eye, Flag,
  TrendingUp, Clock, Zap
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function AdminProfile() {
  const navigate = useNavigate();
  const { currentUser, logout, organizerRequests } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'access' | 'system'>('overview');

  if (!currentUser) { navigate('/login'); return null; }

  const pendingRequests = organizerRequests.filter(r => r.status === 'pending').length;

  const systemHealth = [
    { label: 'API Status', value: 'Healthy', status: 'ok', pct: 100 },
    { label: 'Database', value: '98%', status: 'ok', pct: 98 },
    { label: 'Storage', value: '72%', status: 'warn', pct: 72 },
    { label: 'AI Engine', value: '99.2%', status: 'ok', pct: 99 },
  ];

  const permissions = [
    { label: 'User Management', desc: 'Create, suspend, promote users', granted: true },
    { label: 'Event Moderation', desc: 'Approve, reject, flag events', granted: true },
    { label: 'Platform Settings', desc: 'Modify global configuration', granted: true },
    { label: 'Financial Reports', desc: 'View revenue and payouts', granted: true },
    { label: 'AI Configuration', desc: 'Tune recommendation models', granted: true },
    { label: 'Audit Log Access', desc: 'Full audit trail visibility', granted: true },
  ];

  const recentActions = [
    { icon: '✅', text: 'Approved organizer request — Yasmine Khaled', time: '2h ago', type: 'approve' },
    { icon: '🚫', text: 'Flagged event for review — Crypto Workshop', time: '5h ago', type: 'flag' },
    { icon: '👤', text: 'Suspended user account — spam activity', time: '1d ago', type: 'suspend' },
    { icon: '⚙️', text: 'Updated AI recommendation threshold', time: '2d ago', type: 'config' },
  ];

  const platformStats = [
    { label: 'Total Users', value: '12.4K', icon: Users, grad: 'from-[#7C5CFF] to-[#9B8CFF]', change: '+15%' },
    { label: 'Active Events', value: '847', icon: Calendar, grad: 'from-[#00D4FF] to-[#4ADEFF]', change: '+24%' },
    { label: 'Pending Reviews', value: pendingRequests.toString(), icon: AlertCircle, grad: 'from-[#FF9B3D] to-[#FFD56A]', change: `${pendingRequests} items` },
    { label: 'Platform Revenue', value: 'EGP 2.4M', icon: TrendingUp, grad: 'from-[#FF4FD8] to-[#FF9B3D]', change: '+32%' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Banner — Admin red/orange authority theme ── */}
      <div className="relative h-44 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/50 via-[#0A0F1E]/60 to-background" />
        <div className="absolute top-6 right-16 w-24 h-24 rounded-full bg-red-500/20 blur-3xl animate-float" />
        <div className="absolute bottom-4 left-10 w-20 h-20 rounded-full bg-[#FF9B3D]/15 blur-2xl animate-float-slow" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* ── Avatar + Identity ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 mb-6 relative z-10">
          <div className="flex items-end gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-2xl border-4 border-background shadow-2xl ring-2 ring-red-500/40"
              />
              <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="pb-1">
              <h1 className="text-h1 font-bold text-foreground">{currentUser.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="px-3 py-1 rounded-full text-caption font-bold bg-red-500/15 text-red-400 border border-red-500/25 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Super Administrator
                </span>
                <span className="text-caption text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{currentUser.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <Link to="/admin/settings" className="btn-secondary text-body-sm">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <button className="btn-secondary text-body-sm">
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>

        {/* ── Platform Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {platformStats.map((s) => (
            <div key={s.label} className="surface-panel p-4 hover:-translate-y-0.5 transition-transform">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center mb-3`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-h2 font-bold text-foreground">{s.value}</p>
              <p className="text-caption text-muted-foreground">{s.label}</p>
              <p className="text-caption text-green-500 font-semibold mt-1">{s.change}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mb-6 w-fit">
          {(['overview', 'access', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-lg text-body-sm font-semibold capitalize transition-all ${
                activeTab === t
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Tab: Overview ── */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-5 mb-6">
            {/* Admin Info */}
            <div className="lg:col-span-2 surface-panel p-5">
              <h2 className="text-h3 font-bold text-foreground mb-4">Administrator Details</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-red-400" />{currentUser.email}
                </div>
                <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-[#7C5CFF]" />
                  Admin since {new Date(currentUser.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                  <Lock className="w-4 h-4 text-[#FF9B3D]" />
                  Full platform access · All permissions granted
                </div>
              </div>

              {/* Recent Actions */}
              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-body-sm font-semibold text-foreground mb-3">Recent Actions</p>
                <div className="space-y-2">
                  {recentActions.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition">
                      <span className="text-base">{a.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm text-foreground truncate">{a.text}</p>
                        <p className="text-caption text-muted-foreground">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="surface-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-h3 font-bold text-foreground">System Health</h2>
              </div>
              <div className="space-y-4">
                {systemHealth.map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-body-sm mb-1.5">
                      <span className="text-muted-foreground">{s.label}</span>
                      <span className={`font-bold ${s.status === 'ok' ? 'text-green-500' : 'text-amber-500'}`}>
                        {s.value}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.status === 'ok' ? 'bg-green-500' : 'bg-amber-500'}`}
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Access ── */}
        {activeTab === 'access' && (
          <div className="surface-panel p-5 mb-6">
            <h2 className="text-h3 font-bold text-foreground mb-4">Access & Permissions</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {permissions.map((p, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/30">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    p.granted ? 'bg-green-500/15' : 'bg-muted'
                  }`}>
                    {p.granted
                      ? <CheckCircle className="w-4 h-4 text-green-500" />
                      : <Lock className="w-4 h-4 text-muted-foreground" />
                    }
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-foreground">{p.label}</p>
                    <p className="text-caption text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: System ── */}
        {activeTab === 'system' && (
          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            <div className="surface-panel p-5">
              <h2 className="text-h3 font-bold text-foreground mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-[#00D4FF]" /> Platform Stats
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Daily Active Users', value: '4.2K' },
                  { label: 'Avg Session Time', value: '8m 34s' },
                  { label: 'Bounce Rate', value: '24%' },
                  { label: 'AI Accuracy', value: '92%' },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-body-sm text-muted-foreground">{s.label}</span>
                    <span className="text-body-sm font-bold text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="surface-panel p-5">
              <h2 className="text-h3 font-bold text-foreground mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#7C5CFF]" /> AI Engine
              </h2>
              <div className="space-y-3">
                {[
                  { label: 'Recommendation Model', value: 'v3.2.1' },
                  { label: 'Moderation Model', value: 'v2.8.0' },
                  { label: 'Fraud Detection', value: 'v1.5.3' },
                  { label: 'Last Retrained', value: '3 days ago' },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between py-2 border-b border-border last:border-0">
                    <span className="text-body-sm text-muted-foreground">{s.label}</span>
                    <span className="text-body-sm font-bold text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Quick Actions ── */}
        <div className="surface-panel p-5 mb-6">
          <h2 className="text-h3 font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { to: '/admin/users', icon: Users, label: 'Manage Users', grad: 'from-[#7C5CFF] to-[#9B8CFF]' },
              { to: '/admin/events', icon: Eye, label: 'Review Events', grad: 'from-[#00D4FF] to-[#4ADEFF]' },
              { to: '/admin/moderation', icon: Flag, label: 'Moderation', grad: 'from-red-500 to-red-600' },
              { to: '/admin/analytics', icon: BarChart3, label: 'Analytics', grad: 'from-[#FF9B3D] to-[#FFD56A]' },
            ].map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-muted/40 hover:bg-muted/70 hover:-translate-y-0.5 transition-all group"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${q.grad} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <q.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-body-sm font-semibold text-foreground">{q.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Sign Out ── */}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/20 text-red-500 text-body-sm font-semibold hover:bg-red-500/8 transition mb-8"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
