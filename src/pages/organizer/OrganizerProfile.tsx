import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Edit3, Mail, MapPin, Calendar, LogOut, Sparkles,
  BarChart3, Users, Plus, TrendingUp, DollarSign,
  CheckCircle, Clock, Star, Crown, MessageSquare,
  Settings, ExternalLink, Award, Zap
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function OrganizerProfile() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'stats'>('overview');

  if (!currentUser) { navigate('/login'); return null; }

  const stats = [
    { label: 'Total Events', value: '24', icon: Calendar, grad: 'from-[#7C5CFF] to-[#9B8CFF]', change: '+3 this month' },
    { label: 'Total Attendees', value: '1,247', icon: Users, grad: 'from-[#00D4FF] to-[#4ADEFF]', change: '+28% growth' },
    { label: 'Revenue', value: 'EGP 45K', icon: DollarSign, grad: 'from-[#FF9B3D] to-[#FFD56A]', change: '+18% this month' },
    { label: 'Avg Fill Rate', value: '87%', icon: TrendingUp, grad: 'from-[#FF4FD8] to-[#FF9B3D]', change: '+8% vs avg' },
  ];

  const recentEvents = [
    { title: 'Cairo Jazz Night', date: 'May 15', attendees: 142, capacity: 200, status: 'upcoming', revenue: 21300 },
    { title: 'AI & ML Summit 2026', date: 'May 20', attendees: 387, capacity: 500, status: 'upcoming', revenue: 0 },
    { title: 'Street Food Festival', date: 'May 18', attendees: 654, capacity: 1000, status: 'upcoming', revenue: 49050 },
  ];

  const aiInsights = [
    { icon: '💡', text: 'Thursday 6–8 PM shows highest engagement for your audience', type: 'timing' },
    { icon: '📈', text: 'Tech events seeing 40% more interest this month — consider creating one', type: 'trend' },
    { icon: '💰', text: 'Increase VIP ticket price by 15% based on current demand', type: 'pricing' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Banner — Organizer cyan/teal theme ── */}
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#00D4FF]/50 via-[#0A0F1E]/50 to-background" />
        <div className="absolute top-8 right-20 w-28 h-28 rounded-full bg-[#00D4FF]/20 blur-3xl animate-float" />
        <div className="absolute bottom-4 left-12 w-20 h-20 rounded-full bg-[#7C5CFF]/15 blur-2xl animate-float-slow" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* ── Avatar + Identity ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 mb-6 relative z-10">
          <div className="flex items-end gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-2xl border-4 border-background shadow-2xl ring-2 ring-[#00D4FF]/40"
              />
              {/* Verified organizer badge */}
              <div className="absolute -bottom-2 -right-2 w-9 h-9 bg-gradient-to-br from-[#00D4FF] to-[#7C5CFF] rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="pb-1">
              <h1 className="text-h1 font-bold text-foreground">{currentUser.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="px-3 py-1 rounded-full text-caption font-bold bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/25 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Verified Organizer
                </span>
                <span className="text-caption text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{currentUser.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <Link to="/organizer/events/create" className="btn-primary text-body-sm">
              <Plus className="w-4 h-4" />
              New Event
            </Link>
            <button className="btn-secondary text-body-sm">
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stats.map((s) => (
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
          {(['overview', 'events', 'stats'] as const).map((t) => (
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
            {/* Brand / Bio */}
            <div className="lg:col-span-2 surface-panel p-5">
              <h2 className="text-h3 font-bold text-foreground mb-4">Organizer Profile</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-[#00D4FF]" />{currentUser.email}
                </div>
                <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-[#7C5CFF]" />
                  Organizer since {new Date(currentUser.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-[#FF9B3D]" />
                  Level {currentUser.level} · {currentUser.xp.toLocaleString()} XP
                </div>
              </div>

              {/* Specialties */}
              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-body-sm font-semibold text-foreground mb-3">Event Categories</p>
                <div className="flex flex-wrap gap-2">
                  {currentUser.interests.map((i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-caption font-semibold bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="surface-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C5CFF] to-[#00D4FF] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-h3 font-bold text-foreground">AI Insights</h2>
              </div>
              <div className="space-y-3">
                {aiInsights.map((ins, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#7C5CFF]/8 border border-[#7C5CFF]/15">
                    <p className="text-body-sm text-foreground">
                      <span className="mr-1.5">{ins.icon}</span>{ins.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Events ── */}
        {activeTab === 'events' && (
          <div className="surface-panel p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-h3 font-bold text-foreground">Active Events</h2>
              <Link to="/organizer/events" className="text-caption text-[#00D4FF] font-semibold hover:underline flex items-center gap-1">
                View All <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentEvents.map((ev, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/60 transition">
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-bold text-foreground truncate">{ev.title}</p>
                    <p className="text-caption text-muted-foreground">{ev.date} · {ev.attendees}/{ev.capacity} attendees</p>
                    {/* Fill bar */}
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#00D4FF] to-[#7C5CFF]"
                        style={{ width: `${Math.round((ev.attendees / ev.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-body-sm font-bold text-foreground">
                      {ev.revenue === 0 ? 'Free' : `EGP ${ev.revenue.toLocaleString()}`}
                    </p>
                    <span className="text-caption px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 font-semibold">
                      {ev.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Stats ── */}
        {activeTab === 'stats' && (
          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            <div className="surface-panel p-5">
              <h2 className="text-h3 font-bold text-foreground mb-4">This Month</h2>
              <div className="space-y-3">
                {[
                  { label: 'Page Views', value: '12.4K' },
                  { label: 'Conversion Rate', value: '24%' },
                  { label: 'Avg Ticket Price', value: 'EGP 125' },
                  { label: 'New Followers', value: '340' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-body-sm text-muted-foreground">{s.label}</span>
                    <span className="text-body-sm font-bold text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="surface-panel p-5">
              <h2 className="text-h3 font-bold text-foreground mb-4">Top Categories</h2>
              <div className="space-y-3">
                {[
                  { cat: 'Tech', pct: 45, color: 'bg-[#00D4FF]' },
                  { cat: 'Music', pct: 30, color: 'bg-[#7C5CFF]' },
                  { cat: 'Business', pct: 25, color: 'bg-[#FF9B3D]' },
                ].map((c) => (
                  <div key={c.cat}>
                    <div className="flex justify-between text-body-sm mb-1">
                      <span className="text-muted-foreground">{c.cat}</span>
                      <span className="font-semibold text-foreground">{c.pct}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                    </div>
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
              { to: '/organizer/events/create', icon: Plus, label: 'Create Event', grad: 'from-[#7C5CFF] to-[#9B8CFF]' },
              { to: '/organizer/analytics', icon: BarChart3, label: 'Analytics', grad: 'from-[#00D4FF] to-[#4ADEFF]' },
              { to: '/organizer/messages', icon: MessageSquare, label: 'Messages', grad: 'from-[#FF9B3D] to-[#FFD56A]' },
              { to: '/organizer/events', icon: Calendar, label: 'My Events', grad: 'from-[#FF4FD8] to-[#FF9B3D]' },
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
