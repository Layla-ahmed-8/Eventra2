import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Edit3, Mail, MapPin, Calendar, LogOut, Sparkles,
  BarChart3, Users, Plus, TrendingUp, DollarSign,
  CheckCircle, Clock, Star, Crown, MessageSquare,
  Settings, ExternalLink, Award, Zap, Lock, Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../app/components/ui/dialog';

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400';

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

const ORGANIZER_NOTIF_ROWS: { key: NotifKey; label: string }[] = [
  { key: 'bookingConfirmation', label: 'Booking Confirmation' },
  { key: 'eventReminders', label: 'Event Reminders' },
  { key: 'cancellationStatus', label: 'Cancellation Status' },
  { key: 'refundStatus', label: 'Refund Status' },
  { key: 'accountStatusChanges', label: 'Account Status Changes' },
  { key: 'eventApprovalUpdates', label: 'Event Approval Updates' },
  { key: 'newAttendeeBooking', label: 'New Attendee Booking' },
];

export default function OrganizerProfile() {
  const navigate = useNavigate();
  const { currentUser, logout, updateProfile, changePassword } = useAppStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'stats'>('overview');
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

  const coverPreviewUrl = editCover !== null ? editCover : (currentUser.coverPhoto ?? '');

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Banner — Organizer cyan/teal theme ── */}
      <div className="relative h-40 overflow-hidden sm:h-44">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${currentUser.coverPhoto ?? FALLBACK_COVER}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#00D4FF]/50 via-[#0A0F1E]/50 to-background" />
        <div className="absolute top-8 right-20 w-28 h-28 rounded-full bg-[#00D4FF]/20 blur-3xl animate-float" />
        <div className="absolute bottom-4 left-12 w-20 h-20 rounded-full bg-[#7C5CFF]/15 blur-2xl animate-float-slow" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* ── Avatar + Identity ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 -mt-12 mb-5 relative z-10">
          <div className="flex items-end gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-2xl border-4 border-background shadow-2xl ring-2 ring-[#00D4FF]/40 sm:w-24 sm:h-24"
              />
              {/* Verified organizer badge */}
              <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#7C5CFF] shadow-lg">
                <Crown className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="pb-1">
              <h1 className="text-3xl sm:text-h1 font-bold text-foreground leading-none">{currentUser.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/25 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Verified Organizer
                </span>
                <span className="text-caption text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{currentUser.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pb-1">
            <Link to="/organizer/events/create" className="btn-primary text-body-sm px-3 py-2">
              <Plus className="w-4 h-4" />
              New Event
            </Link>
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
              Edit
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

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-5">
          {stats.map((s) => (
            <div key={s.label} className="surface-panel p-3.5 hover:-translate-y-0.5 transition-transform">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.grad} mb-2.5`}>
                <s.icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground leading-none">{s.value}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">{s.label}</p>
              <p className="text-caption text-green-500 font-semibold mt-1">{s.change}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mb-5 w-fit max-w-full overflow-x-auto">
          {(['overview', 'events', 'stats'] as const).map((t) => (
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
            {/* Brand / Bio */}
            <div className="lg:col-span-2 surface-panel p-4.5 sm:p-5">
              <h2 className="text-h3 font-bold text-foreground mb-3.5">Organizer Profile</h2>
              <div className="space-y-2.5">
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
              <div className="mt-4 pt-3.5 border-t border-border">
                <p className="text-body-sm font-semibold text-foreground mb-2.5">Event Categories</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.interests.map((i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[0.16em] bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="surface-panel p-4.5 sm:p-5">
              <div className="flex items-center gap-2 mb-3.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C5CFF] to-[#00D4FF]">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-h3 font-bold text-foreground">AI Insights</h2>
              </div>
              <div className="space-y-2.5">
                {aiInsights.map((ins, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-[#7C5CFF]/8 border border-[#7C5CFF]/15">
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
          <div className="surface-panel p-4.5 sm:p-5 mb-5">
            <div className="flex items-center justify-between mb-3.5">
              <h2 className="text-h3 font-bold text-foreground">Active Events</h2>
              <Link to="/organizer/events" className="text-caption text-[#00D4FF] font-semibold hover:underline flex items-center gap-1">
                View All <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2.5">
              {recentEvents.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition">
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
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div className="surface-panel p-4.5 sm:p-5">
              <h2 className="text-h3 font-bold text-foreground mb-3.5">This Month</h2>
              <div className="space-y-2.5">
                {[
                  { label: 'Page Views', value: '12.4K' },
                  { label: 'Conversion Rate', value: '24%' },
                  { label: 'Avg Ticket Price', value: 'EGP 125' },
                  { label: 'New Followers', value: '340' },
                ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                    <span className="text-body-sm text-muted-foreground">{s.label}</span>
                    <span className="text-body-sm font-bold text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="surface-panel p-4.5 sm:p-5">
              <h2 className="text-h3 font-bold text-foreground mb-3.5">Top Categories</h2>
              <div className="space-y-2.5">
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
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Quick Actions ── */}
        <div className="surface-panel p-4.5 sm:p-5 mb-5">
          <h2 className="text-h3 font-bold text-foreground mb-3.5">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { to: '/organizer/events/create', icon: Plus, label: 'Create Event', grad: 'from-[#7C5CFF] to-[#9B8CFF]' },
              { to: '/organizer/analytics', icon: BarChart3, label: 'Analytics', grad: 'from-[#00D4FF] to-[#4ADEFF]' },
              { to: '/organizer/messages', icon: MessageSquare, label: 'Messages', grad: 'from-[#FF9B3D] to-[#FFD56A]' },
              { to: '/organizer/events', icon: Calendar, label: 'My Events', grad: 'from-[#FF4FD8] to-[#FF9B3D]' },
            ].map((q) => (
              <Link
                key={q.to}
                to={q.to}
                  className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-muted/40 hover:bg-muted/70 hover:-translate-y-0.5 transition-all group"
              >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${q.grad} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <q.icon className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="text-body-sm font-semibold text-foreground">{q.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Sign Out ── */}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl border border-red-500/20 text-red-500 text-body-sm font-semibold hover:bg-red-500/8 transition mb-6"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

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
                <input id="org-cover-upload" type="file" accept="image/jpeg,image/png,image/jpg" className="sr-only" onChange={handleCoverUpload} />
                <label htmlFor="org-cover-upload" className="btn-secondary text-body-sm px-3 py-1.5 cursor-pointer inline-flex items-center gap-1.5">
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
                  <input id="org-avatar-upload" type="file" accept="image/jpeg,image/png,image/jpg" className="sr-only" onChange={handleAvatarUpload} />
                  <label htmlFor="org-avatar-upload" className="btn-secondary text-body-sm px-3 py-1.5 cursor-pointer inline-flex items-center gap-1.5">
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
                {ORGANIZER_NOTIF_ROWS.map(({ key, label }) => (
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
            <button onClick={handleSaveProfile} disabled={!editName.trim()} className="btn-primary disabled:opacity-40">Save Changes</button>
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
            <button onClick={handleChangePassword} disabled={!currentPw || !newPw || !confirmPw} className="btn-primary disabled:opacity-40">Update Password</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
