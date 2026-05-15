import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Edit3, Mail, MapPin, Calendar, Award, Users, LogOut,
  Sparkles, Briefcase, Send, TrendingUp, Star, Zap,
  Music, Code, Palette, Heart, Trophy, ChevronRight,
  Bell, MessageSquare, Ticket, Gift
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function AttendeeProfile() {
  const navigate = useNavigate();
  const { currentUser, logout, requestOrganizerStatus, events } = useAppStore();
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'activity'>('overview');

  if (!currentUser) { navigate('/login'); return null; }

  const xpToNext = (currentUser.level + 1) * 1000;
  const xpPct = Math.min(100, Math.round((currentUser.xp / xpToNext) * 100));

  const handleOrganizerRequest = () => {
    if (reason) {
      requestOrganizerStatus(selectedEventId || 'event-001', reason);
      setShowOrganizerModal(false);
      setReason('');
      setSelectedEventId('');
    }
  };

  const interestIcons: Record<string, any> = {
    Music, Tech: Code, Art: Palette, 'Health & Wellness': Heart, Sports: Trophy,
  };

  const badges = [
    { icon: '🎵', name: 'Music Lover', desc: '5 music events', color: 'from-purple-500 to-pink-500', earned: true },
    { icon: '⚡', name: 'Early Bird', desc: 'First to RSVP 3×', color: 'from-orange-400 to-yellow-400', earned: true },
    { icon: '🌟', name: 'Rising Star', desc: 'Reached Level 8', color: 'from-cyan-400 to-blue-500', earned: true },
    { icon: '🎊', name: 'Party Animal', desc: '25 events', color: 'from-pink-500 to-rose-500', earned: false },
    { icon: '🗺️', name: 'Explorer', desc: '5 venues', color: 'from-green-400 to-teal-500', earned: false },
    { icon: '⭐', name: 'VIP Member', desc: '5 VIP tickets', color: 'from-amber-400 to-orange-500', earned: false },
  ];

  const activity = [
    { icon: '🎵', text: 'RSVPed to Cairo Jazz Night', time: '2 days ago', color: 'text-purple-400' },
    { icon: '🏆', text: 'Earned Early Bird badge', time: '5 days ago', color: 'text-orange-400' },
    { icon: '👥', text: 'Joined Cairo Music Lovers', time: '1 week ago', color: 'text-cyan-400' },
    { icon: '🎨', text: 'Bookmarked Art Exhibition', time: '2 weeks ago', color: 'text-pink-400' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Banner ── */}
      <div className="relative h-52 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#7C5CFF]/60 via-[#0A0F1E]/40 to-background" />
        {/* Atmospheric orbs */}
        <div className="absolute top-6 right-24 w-32 h-32 rounded-full bg-[#7C5CFF]/20 blur-3xl animate-float" />
        <div className="absolute bottom-4 left-16 w-24 h-24 rounded-full bg-[#00D4FF]/15 blur-2xl animate-float-slow" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* ── Avatar + Name Row ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 mb-6 relative z-10">
          <div className="flex items-end gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-28 h-28 rounded-2xl border-4 border-background shadow-2xl ring-2 ring-[#7C5CFF]/40"
              />
              {/* Level badge */}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-[#7C5CFF] to-[#FF4FD8] rounded-xl flex flex-col items-center justify-center shadow-lg shadow-[#7C5CFF]/40">
                <span className="text-white font-bold leading-none" style={{ fontSize: 13 }}>{currentUser.level}</span>
                <span className="text-white/70 leading-none" style={{ fontSize: 9 }}>LVL</span>
              </div>
            </div>

            <div className="pb-1">
              <h1 className="text-h1 font-bold text-foreground">{currentUser.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="px-3 py-1 rounded-full text-caption font-bold bg-[#7C5CFF]/15 text-[#7C5CFF] border border-[#7C5CFF]/25">
                  Attendee
                </span>
                {currentUser.organizerStatus === 'pending' && (
                  <span className="px-3 py-1 rounded-full text-caption font-bold bg-amber-500/15 text-amber-400 border border-amber-500/25 animate-pulse-slow">
                    Organizer Request Pending
                  </span>
                )}
                <span className="text-caption text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{currentUser.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <button className="btn-secondary flex items-center gap-2 text-body-sm">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* ── XP Bar ── */}
        <div className="surface-panel p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C5CFF] to-[#FF4FD8] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-body font-semibold text-foreground">Level {currentUser.level} — {currentUser.xp.toLocaleString()} XP</span>
            </div>
            <span className="text-caption text-muted-foreground">{xpPct}% to Level {currentUser.level + 1}</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#FF4FD8] transition-all duration-700"
              style={{ width: `${xpPct}%` }}
            />
          </div>
          <p className="text-caption text-muted-foreground mt-1.5">
            {(xpToNext - currentUser.xp).toLocaleString()} XP to next level
          </p>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Events', value: currentUser.rsvpedEvents.length, icon: Ticket, grad: 'icon-box-primary' },
            { label: 'Communities', value: 5, icon: Users, grad: 'icon-box-cyan' },
            { label: 'Badges', value: currentUser.badges.length, icon: Award, grad: 'icon-box-orange' },
            { label: 'Bookmarks', value: currentUser.bookmarkedEvents.length, icon: Star, grad: 'icon-box-green' },
          ].map((s) => (
            <div key={s.label} className="kpi-card">
              <div className="flex items-center justify-between">
                <div className={`icon-box ${s.grad}`}>
                  <s.icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="kpi-value">{s.value}</p>
                <p className="kpi-label">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mb-6 w-fit">
          {(['overview', 'badges', 'activity'] as const).map((t) => (
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
            {/* Interests */}
            <div className="lg:col-span-2 surface-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-h3 font-bold text-foreground">Interests</h2>
                <button className="text-caption text-[#7C5CFF] font-semibold hover:underline flex items-center gap-1">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map((interest) => {
                  const Icon = interestIcons[interest];
                  return (
                    <span
                      key={interest}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-body-sm font-semibold bg-[#7C5CFF]/10 text-[#7C5CFF] border border-[#7C5CFF]/20 hover:bg-[#7C5CFF]/20 transition"
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      {interest}
                    </span>
                  );
                })}
                <button className="px-3 py-1.5 rounded-full text-body-sm font-semibold border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-[#7C5CFF]/40 hover:text-[#7C5CFF] transition">
                  + Add
                </button>
              </div>

              {/* Contact info */}
              <div className="mt-5 pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-[#7C5CFF]" />{currentUser.email}
                </div>
                <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-[#00D4FF]" />
                  Joined {new Date(currentUser.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Recent Badges */}
            <div className="surface-panel p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-h3 font-bold text-foreground">Recent Badges</h2>
                <Link to="/app/profile/achievements" className="text-caption text-[#7C5CFF] font-semibold hover:underline">
                  All
                </Link>
              </div>
              <div className="space-y-3">
                {badges.filter(b => b.earned).slice(0, 3).map((b, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-lg shadow-sm`}>
                      {b.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-bold text-foreground truncate">{b.name}</p>
                      <p className="text-caption text-muted-foreground">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Badges ── */}
        {activeTab === 'badges' && (
          <div className="mb-6">
            <h2 className="text-h3 font-bold text-foreground mb-4">Earned Badges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              {badges.filter(b => b.earned).map((b, i) => (
                <div key={i} className="surface-panel p-4 flex flex-col items-center gap-2 text-center hover:-translate-y-1 transition-transform">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center text-2xl shadow-lg`}>
                    {b.icon}
                  </div>
                  <p className="text-body-sm font-bold text-foreground">{b.name}</p>
                  <p className="text-caption text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
            <h2 className="text-h3 font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="opacity-50">Locked</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {badges.filter(b => !b.earned).map((b, i) => (
                <div key={i} className="surface-panel p-4 flex flex-col items-center gap-2 text-center opacity-40">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center text-2xl grayscale">
                    {b.icon}
                  </div>
                  <p className="text-body-sm font-bold text-foreground">{b.name}</p>
                  <p className="text-caption text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Activity ── */}
        {activeTab === 'activity' && (
          <div className="surface-panel p-5 mb-6">
            <h2 className="text-h3 font-bold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition">
                  <span className="text-xl">{a.icon}</span>
                  <div className="flex-1">
                    <p className="text-body-sm text-foreground font-medium">{a.text}</p>
                    <p className="text-caption text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Quick Actions ── */}
        <div className="surface-panel p-5 mb-6">
          <h2 className="text-h3 font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { to: '/app/profile/achievements', icon: Award, label: 'Achievements', grad: 'from-[#7C5CFF] to-[#9B8CFF]' },
              { to: '/app/my-events', icon: Ticket, label: 'My Events', grad: 'from-[#00D4FF] to-[#4ADEFF]' },
              { to: '/app/community', icon: Users, label: 'Communities', grad: 'from-[#FF9B3D] to-[#FFD56A]' },
              { to: '/app/messages', icon: MessageSquare, label: 'Messages', grad: 'from-[#FF4FD8] to-[#FF9B3D]' },
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

        {/* ── Become Organizer ── */}
        {currentUser.role === 'attendee' && !currentUser.organizerStatus && (
          <div className="relative overflow-hidden rounded-2xl p-5 mb-6 border border-[#00D4FF]/20 bg-gradient-to-br from-[#00D4FF]/8 to-[#7C5CFF]/8">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#00D4FF]/10 blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-start gap-4 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#7C5CFF] flex items-center justify-center flex-shrink-0 shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-h3 font-bold text-foreground mb-1">Become an Event Organizer</h3>
                <p className="text-body-sm text-muted-foreground mb-3">
                  Ready to create your own events? Request organizer access and our team will review your application.
                </p>
                <button
                  onClick={() => setShowOrganizerModal(true)}
                  className="btn-primary text-body-sm"
                >
                  <Send className="w-4 h-4" />
                  Request Organizer Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Sign Out ── */}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/20 text-red-500 text-body-sm font-semibold hover:bg-red-500/8 transition mb-8"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* ── Organizer Request Modal ── */}
      {showOrganizerModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="surface-panel p-6 max-w-lg w-full shadow-2xl animate-scale-in">
            <h2 className="text-h2 font-bold text-foreground mb-1">Request Organizer Status</h2>
            <p className="text-body-sm text-muted-foreground mb-5">
              Tell us why you want to become an organizer. Admin will review and notify you.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-2">Related Event (optional)</label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full input-base"
                >
                  <option value="">Select an event...</option>
                  {currentUser.rsvpedEvents.map(id => (
                    <option key={id} value={id}>Event {id}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-2">Why do you want to organize? *</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Share your experience and plans..."
                  className="w-full input-base h-28 resize-none py-3"
                  style={{ height: 112 }}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowOrganizerModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleOrganizerRequest}
                disabled={!reason}
                className="flex-1 btn-primary disabled:opacity-40"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
