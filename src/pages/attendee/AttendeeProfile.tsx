import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Edit3, Mail, MapPin, Calendar, Award, Users, LogOut,
  Sparkles, Briefcase, Send, TrendingUp, Star, Zap,
  Music, Code, Palette, Heart, Trophy,
  MessageSquare, Ticket, AlertCircle, X, Lock, Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore, getXPForLevel } from '../../store/useAppStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../app/components/ui/dialog';

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400';

const DEFAULT_NOTIF_PREFS = {
  bookingConfirmation: true,
  eventReminders: true,
  cancellationStatus: true,
  refundStatus: true,
  accountStatusChanges: true,
  eventApprovalUpdates: true,
  newAttendeeBooking: true,
  flaggedContentAlerts: true,
};

type NotifKey = keyof typeof DEFAULT_NOTIF_PREFS;

const ATTENDEE_NOTIF_ROWS: { key: NotifKey; label: string }[] = [
  { key: 'bookingConfirmation', label: 'Booking Confirmation' },
  { key: 'eventReminders', label: 'Event Reminders' },
  { key: 'cancellationStatus', label: 'Cancellation Status' },
  { key: 'refundStatus', label: 'Refund Status' },
  { key: 'accountStatusChanges', label: 'Account Status Changes' },
  { key: 'eventApprovalUpdates', label: 'Event Approval Updates' },
];

export default function AttendeeProfile() {
  const navigate = useNavigate();
  const { currentUser, logout, requestOrganizerStatus, events, updateProfile, changePassword } = useAppStore();
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'activity'>('overview');
  const [emailBannerDismissed, setEmailBannerDismissed] = useState(false);
  // In demo mode, treat email as unverified unless dismissed — mirrors emailVerified === false
  const showEmailBanner = !emailBannerDismissed;

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState<string | null>(null);
  const [editCover, setEditCover] = useState<string | null>(null);
  const [notifPrefs, setNotifPrefs] = useState<typeof DEFAULT_NOTIF_PREFS>({ ...DEFAULT_NOTIF_PREFS });
  const [showPwModal, setShowPwModal] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');

  if (!currentUser) { navigate('/login'); return null; }

  const xpToNext = getXPForLevel(currentUser.level + 1);
  const xpCurrentLevel = getXPForLevel(currentUser.level);
  const xpPct = xpToNext > xpCurrentLevel
    ? Math.min(100, Math.round(((currentUser.xp - xpCurrentLevel) / (xpToNext - xpCurrentLevel)) * 100))
    : 100;

  const handleOrganizerRequest = () => {
    if (reason) {
      requestOrganizerStatus(selectedEventId || 'event-001', reason);
      setShowOrganizerModal(false);
      setReason('');
      setSelectedEventId('');
    }
  };

  const handleSaveProfile = async () => {
    await updateProfile({
      name: editName.trim(),
      location: editLocation.trim(),
      ...(editPhone.trim() && { phone: editPhone.trim() }),
      ...(editAvatar !== null && { avatar: editAvatar }),
      ...(editCover !== null && { coverPhoto: editCover || undefined }),
      notificationPreferences: notifPrefs,
    });
    setShowEditModal(false);
    toast.success('Profile updated successfully!');
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Photo must be under 2 MB'); return; }
    const reader = new FileReader();
    reader.onload = () => setEditAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Cover photo must be under 5 MB'); return; }
    const reader = new FileReader();
    reader.onload = () => setEditCover(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleChangePassword = async () => {
    setPwError('');
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters.'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return; }
    await changePassword(currentPw, newPw);
    setShowPwModal(false);
    setCurrentPw(''); setNewPw(''); setConfirmPw('');
    toast.success('Password changed successfully!');
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

  // Computed for the modal cover preview — reactive because state/store changes re-render
  const coverPreviewUrl = editCover !== null ? editCover : (currentUser.coverPhoto ?? '');

  return (
    <div className="min-h-screen bg-background">
      {/* ── Email Verification Banner ── */}
      {showEmailBanner && (
        <div className="border-b border-amber-200/80 bg-amber-50/90 px-4 py-2.5 dark:border-amber-800 dark:bg-amber-900/20">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-body-sm text-amber-800 dark:text-amber-200">
                Please verify your email address to unlock all features.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => toast.success('Verification email sent! Check your inbox.')}
                className="text-body-sm font-semibold text-amber-700 dark:text-amber-300 underline hover:no-underline"
              >
                Resend Email
              </button>
              <button onClick={() => setEmailBannerDismissed(true)} className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Hero Banner ── */}
      <div className="relative h-40 overflow-hidden sm:h-44">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${currentUser.coverPhoto ?? FALLBACK_COVER}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#7C5CFF]/60 via-[#0A0F1E]/40 to-background" />
        {/* Atmospheric orbs */}
        <div className="absolute top-6 right-24 w-32 h-32 rounded-full bg-[#7C5CFF]/20 blur-3xl animate-float" />
        <div className="absolute bottom-4 left-16 w-24 h-24 rounded-full bg-[#00D4FF]/15 blur-2xl animate-float-slow" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* ── Avatar + Name Row ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 -mt-14 mb-5 relative z-10">
          <div className="flex items-end gap-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-2xl border-4 border-background shadow-2xl ring-2 ring-[#7C5CFF]/40 sm:w-28 sm:h-28"
              />
              {/* Level badge */}
              <div className="absolute -bottom-2 -right-2 h-9 w-9 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#FF4FD8] flex flex-col items-center justify-center shadow-lg shadow-[#7C5CFF]/40">
                <span className="text-white font-bold leading-none" style={{ fontSize: 13 }}>{currentUser.level}</span>
                <span className="text-white/70 leading-none" style={{ fontSize: 9 }}>LVL</span>
              </div>
            </div>

            <div className="pb-1">
              <h1 className="text-3xl font-bold leading-none text-foreground sm:text-h1">{currentUser.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] bg-[#7C5CFF]/15 text-[#7C5CFF] border border-[#7C5CFF]/25">
                  Attendee
                </span>
                {currentUser.organizerStatus === 'pending' && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] bg-amber-500/15 text-amber-400 border border-amber-500/25 animate-pulse-slow">
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
            <button
              onClick={() => {
                setEditName(currentUser.name);
                setEditLocation(currentUser.location ?? '');
                setEditPhone(currentUser.phone ?? '');
                setEditAvatar(null);
                setEditCover(null);
                setNotifPrefs(currentUser.notificationPreferences ?? { ...DEFAULT_NOTIF_PREFS });
                setShowEditModal(true);
              }}
              className="btn-secondary flex items-center gap-2 text-body-sm px-3 py-2"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
            <button
              onClick={() => setShowPwModal(true)}
              className="btn-ghost flex items-center gap-2 text-body-sm px-3 py-2"
            >
              <Lock className="w-4 h-4" />
              Change Password
            </button>
          </div>
        </div>

        {/* ── XP Bar ── */}
        <div className="surface-panel p-4 mb-5 border border-border/60">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C5CFF] to-[#FF4FD8]">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-body-sm sm:text-body font-semibold text-foreground">Level {currentUser.level} — {currentUser.xp.toLocaleString()} XP</span>
            </div>
            <span className="text-caption text-muted-foreground">{xpPct}% to Level {currentUser.level + 1}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#FF4FD8] transition-all duration-700"
              style={{ width: `${xpPct}%` }}
            />
          </div>
          <p className="text-caption text-muted-foreground mt-1">
            {(xpToNext - currentUser.xp).toLocaleString()} XP to next level
          </p>
        </div>

        {/* ── Stats Row ── */}
        <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {[
            { label: 'Events', value: currentUser.rsvpedEvents.length, icon: Ticket, grad: 'icon-box-primary' },
            { label: 'Communities', value: 5, icon: Users, grad: 'icon-box-cyan' },
            { label: 'Badges', value: currentUser.badges.length, icon: Award, grad: 'icon-box-orange' },
            { label: 'Bookmarks', value: currentUser.bookmarkedEvents.length, icon: Star, grad: 'icon-box-green' },
          ].map((s) => (
            <div key={s.label} className="kpi-card p-3 sm:p-4">
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
        <div className="mb-5 flex max-w-full w-fit gap-1 overflow-x-auto rounded-xl bg-muted/50 p-1">
          {(['overview', 'badges', 'activity'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3.5 py-1.5 rounded-lg text-body-sm font-semibold capitalize transition-all ${
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
          <div className="grid lg:grid-cols-3 gap-4 mb-5">
            {/* Interests */}
            <div className="lg:col-span-2 surface-panel p-4.5 sm:p-5">
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-h3 font-bold text-foreground">Interests</h2>
                <button className="text-caption text-[#7C5CFF] font-semibold hover:underline flex items-center gap-1">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentUser.interests.map((interest) => {
                  const Icon = interestIcons[interest];
                  return (
                    <span
                      key={interest}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] sm:text-body-sm font-semibold bg-[#7C5CFF]/10 text-[#7C5CFF] border border-[#7C5CFF]/20 hover:bg-[#7C5CFF]/20 transition"
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      {interest}
                    </span>
                  );
                })}
                <button className="px-2.5 py-1.5 rounded-full text-[11px] sm:text-body-sm font-semibold border border-dashed border-muted-foreground/30 text-muted-foreground hover:border-[#7C5CFF]/40 hover:text-[#7C5CFF] transition">
                  + Add
                </button>
              </div>

              {/* Contact info */}
              <div className="mt-4 pt-3.5 border-t border-border space-y-2">
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
            <div className="surface-panel p-4.5 sm:p-5">
              <div className="flex items-center justify-between mb-3.5">
                <h2 className="text-h3 font-bold text-foreground">Recent Badges</h2>
                <Link to="/app/profile/achievements" className="text-caption text-[#7C5CFF] font-semibold hover:underline">
                  All
                </Link>
              </div>
              <div className="space-y-2.5">
                {badges.filter(b => b.earned).slice(0, 3).map((b, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-muted/40 hover:bg-muted/70 transition">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-base shadow-sm`}>
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

        {activeTab === 'badges' && (
          <div className="mb-5">
            <h2 className="text-h3 font-bold text-foreground mb-4">Earned Badges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-5">
              {badges.filter(b => b.earned).map((b, i) => (
                <div key={i} className="surface-panel p-3.5 flex flex-col items-center gap-1.5 text-center hover:-translate-y-1 transition-transform">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center text-xl shadow-lg`}>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {badges.filter(b => !b.earned).map((b, i) => (
                <div key={i} className="surface-panel p-3.5 flex flex-col items-center gap-1.5 text-center opacity-40">
                  <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-xl grayscale">
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
          <div className="surface-panel p-4.5 sm:p-5 mb-5">
            <h2 className="text-h3 font-bold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-2.5">
              {activity.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/60 transition">
                  <span className="text-lg">{a.icon}</span>
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
        <div className="surface-panel p-4.5 sm:p-5 mb-5">
          <h2 className="text-h3 font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { to: '/app/profile/achievements', icon: Award, label: 'Achievements', grad: 'from-[#7C5CFF] to-[#9B8CFF]' },
              { to: '/app/my-events', icon: Ticket, label: 'My Events', grad: 'from-[#00D4FF] to-[#4ADEFF]' },
              { to: '/app/community', icon: Users, label: 'Communities', grad: 'from-[#FF9B3D] to-[#FFD56A]' },
              { to: '/app/messages', icon: MessageSquare, label: 'Messages', grad: 'from-[#FF4FD8] to-[#FF9B3D]' },
            ].map((q) => (
              <Link
                key={q.to}
                to={q.to}
                  className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-muted/40 hover:bg-muted/70 hover:-translate-y-0.5 transition-all group"
              >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${q.grad} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <q.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-body-sm font-semibold text-foreground">{q.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Become Organizer ── */}
        {currentUser.role === 'attendee' && !currentUser.organizerStatus && (
          <div className="relative overflow-hidden rounded-2xl p-4.5 sm:p-5 mb-5 border border-[#00D4FF]/20 bg-gradient-to-br from-[#00D4FF]/8 to-[#7C5CFF]/8">
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
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-red-500/20 text-red-500 text-body-sm font-semibold hover:bg-red-500/8 transition mb-6"
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

      {/* Edit Profile Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg border-border/70" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-h3 font-bold">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2 max-h-[65vh] overflow-y-auto pr-1">

            {/* Cover Photo */}
            <div className="space-y-2">
              <p className="text-caption font-black uppercase tracking-widest text-muted-foreground">Cover Photo</p>
              <div
                className="w-full h-28 rounded-xl border border-border/60"
                style={{ background: `url(${coverPreviewUrl || FALLBACK_COVER}) center/cover no-repeat` }}
              />
              <div className="flex items-center gap-2">
                <input id="cover-upload" type="file" accept="image/jpeg,image/png,image/jpg" className="sr-only" onChange={handleCoverUpload} />
                <label htmlFor="cover-upload" className="btn-secondary text-body-sm px-3 py-1.5 cursor-pointer inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Upload Cover
                </label>
                {coverPreviewUrl && (
                  <button type="button" onClick={() => setEditCover('')} className="btn-ghost text-body-sm px-3 py-1.5 text-red-500 hover:text-red-600">Remove</button>
                )}
              </div>
              <p className="text-caption text-muted-foreground">JPG, PNG · max 5 MB</p>
            </div>

            {/* Avatar */}
            <div className="space-y-2">
              <p className="text-caption font-black uppercase tracking-widest text-muted-foreground">Profile Picture</p>
              <div className="flex items-center gap-4">
                <img src={editAvatar ?? currentUser.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-border shrink-0" />
                <div className="space-y-1.5">
                  <input id="avatar-upload" type="file" accept="image/jpeg,image/png,image/jpg" className="sr-only" onChange={handleAvatarUpload} />
                  <label htmlFor="avatar-upload" className="btn-secondary text-body-sm px-3 py-1.5 cursor-pointer inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload Photo
                  </label>
                  <p className="text-caption text-muted-foreground">JPG, PNG · max 2 MB</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-3">
              <p className="text-caption font-black uppercase tracking-widest text-muted-foreground">Personal Information</p>
              <div className="space-y-1.5">
                <label className="text-body-sm font-semibold text-foreground">Display Name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className="input-base w-full" placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-body-sm font-semibold text-foreground">Phone Number</label>
                <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="input-base w-full" placeholder="+20 100 000 0000" />
                <p className="text-caption text-muted-foreground">Used for booking confirmations and event reminders</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-body-sm font-semibold text-foreground">City / Location</label>
                <input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="input-base w-full" placeholder="e.g. Cairo, Egypt" />
              </div>
              <div className="space-y-1.5">
                <label className="text-body-sm font-semibold text-foreground">Email Address</label>
                <input value={currentUser.email} disabled className="input-base w-full opacity-50 cursor-not-allowed" />
                <p className="text-caption text-muted-foreground">Email cannot be changed. Contact support for email updates.</p>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-2">
              <p className="text-caption font-black uppercase tracking-widest text-muted-foreground">Notification Settings</p>
              <div className="surface-panel rounded-xl divide-y divide-border/50">
                {ATTENDEE_NOTIF_ROWS.map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between px-3 py-2.5">
                    <span className="text-body-sm text-foreground">{label}</span>
                    <button
                      type="button"
                      onClick={() => setNotifPrefs(p => ({ ...p, [key]: !p[key] }))}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${notifPrefs[key] ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    >
                      <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform ${notifPrefs[key] ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
          <DialogFooter>
            <button onClick={() => setShowEditModal(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSaveProfile} disabled={!editName.trim()} className="btn-primary disabled:opacity-40">
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={showPwModal} onOpenChange={setShowPwModal}>
        <DialogContent className="max-w-md border-border/70" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle className="text-h3 font-bold">Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {pwError && <p className="text-body-sm text-red-500 font-medium">{pwError}</p>}
            <div className="space-y-1.5">
              <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">Current Password</label>
              <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className="input-base w-full" placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">New Password</label>
              <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className="input-base w-full" placeholder="Min. 8 characters" />
            </div>
            <div className="space-y-1.5">
              <label className="text-caption font-black uppercase tracking-widest text-muted-foreground">Confirm New Password</label>
              <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className="input-base w-full" placeholder="••••••••" />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => { setShowPwModal(false); setPwError(''); }} className="btn-secondary">Cancel</button>
            <button onClick={handleChangePassword} disabled={!currentPw || !newPw || !confirmPw} className="btn-primary disabled:opacity-40">
              Update Password
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
