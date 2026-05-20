import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Users, BarChart, MessageSquare, QrCode, Download, DollarSign,
  Eye, ArrowUpRight, CheckCircle2, Search, Ticket, MapPin, CalendarDays,
  Share2, Copy, Filter, RefreshCw, Megaphone, Heart, MessageCircle,
  Sparkles, UserCheck2, Clock3, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';

const MOCK_CHECKIN_ATTENDEES = Array.from({ length: 12 }, (_, i) => ({
  id: `a-${i}`,
  name: `Attendee ${i + 1}`,
  email: `attendee${i + 1}@example.com`,
  ticketType: i % 3 === 0 ? 'VIP' : 'GA',
  status: i % 4 === 0 ? 'Waiting' : i % 4 === 1 ? 'Checked in' : 'Confirmed',
  avatar: `https://i.pravatar.cc/40?img=${i + 20}`,
}));

const ANNOUNCEMENTS = [
  { id: 1, title: 'Doors open earlier', body: 'We moved entry to 6:30 PM to smooth crowd flow.', time: '10m ago', icon: Megaphone },
  { id: 2, title: 'VIP lounge updated', body: 'Reserved seating and drink vouchers are now live.', time: '1h ago', icon: Sparkles },
  { id: 3, title: 'Artist meetup added', body: 'A short meet-and-greet is scheduled after the show.', time: '3h ago', icon: Heart },
];

const REGISTRATION_POINTS = [34, 42, 38, 54, 61, 67, 73, 71, 78, 84, 88, 92, 97, 105];

const ticketFilterOptions = ['All', 'VIP', 'GA'] as const;

export default function ManageEvent() {
  const { id } = useParams<{ id: string }>();
  const { awardXP } = useAppStore();
  const [activeTab, setActiveTab] = useState<'attendees' | 'analytics' | 'community' | 'checkin'>('attendees');
  const [checkedIn, setCheckedIn] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [ticketFilter, setTicketFilter] = useState<(typeof ticketFilterOptions)[number]>('All');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'ticket'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleCheckIn = (attendeeId: string, name: string) => {
    setCheckedIn((prev) => {
      const next = new Set(prev);
      next.add(attendeeId);
      return next;
    });
    awardXP(50, 'attendee check-in');
    toast.success(`${name} checked in — +50 XP awarded!`);
  };

  const handleCopyLink = () => {
    toast.success('Event link copied to clipboard');
  };

  const handleExport = () => {
    toast.success('CSV export prepared for this event');
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllVisible = () => setSelected(new Set(filteredAttendees.map(a => a.id)));
  const clearSelection = () => setSelected(new Set());

  const bulkCheckIn = () => {
    const toCheck = filteredAttendees.filter(a => selected.has(a.id) && !checkedIn.has(a.id));
    toCheck.forEach(a => handleCheckIn(a.id, a.name));
    clearSelection();
  };

  const exportSelectedCSV = () => {
    const rows = filteredAttendees.filter(a => selected.has(a.id));
    if (!rows.length) { toast.error('No attendees selected'); return; }
    const header = ['id','name','email','ticketType','status'];
    const csv = [header.join(',')].concat(rows.map(r => [r.id, r.name, r.email, r.ticketType, r.status].map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendees-${id || 'event'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded');
  };

  const filteredAttendees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return MOCK_CHECKIN_ATTENDEES.filter((attendee) => {
      const matchesQuery = !query
        || attendee.name.toLowerCase().includes(query)
        || attendee.email.toLowerCase().includes(query);
      const matchesTicket = ticketFilter === 'All' || attendee.ticketType === ticketFilter;
      return matchesQuery && matchesTicket;
    }).sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'name') return mul * a.name.localeCompare(b.name);
      return mul * a.ticketType.localeCompare(b.ticketType);
    });
  }, [searchQuery, ticketFilter, sortBy, sortDir]);

  const checkedInCount = checkedIn.size;
  const checkedInRate = Math.round((checkedInCount / MOCK_CHECKIN_ATTENDEES.length) * 100);
  const revenue = 21300;
  const avgTicket = 150;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-cyan-500/10 via-background to-primary/10 p-5 sm:p-6">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-10 left-1/3 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Link to="/organizer/events" className="inline-flex items-center gap-2 text-body-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              My Events
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <span className="status-pill bg-cyan-500/15 text-cyan-600 dark:text-cyan-300">Live</span>
              <span className="status-pill bg-primary/15 text-primary">Organizer tools</span>
              <span className="status-pill bg-amber-500/15 text-amber-600 dark:text-amber-300">ID #{id ?? 'event-001'}</span>
            </div>
            <div>
              <h1 className="text-h1 font-bold text-foreground">Manage Cairo Jazz Night</h1>
              <p className="mt-1 max-w-2xl text-body-sm text-muted-foreground sm:text-body">
                Control attendees, monitor performance, post community updates, and run check-in from one polished dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleCopyLink} className="btn-secondary inline-flex items-center gap-2 text-body-sm">
                <Copy className="h-4 w-4" />
                Copy link
              </button>
              <button onClick={handleExport} className="btn-secondary inline-flex items-center gap-2 text-body-sm">
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button className="btn-primary inline-flex items-center gap-2 text-body-sm">
                <Share2 className="h-4 w-4" />
                Share event
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[460px]">
            {[
              { label: 'Attendees', value: '142', icon: Users, tone: 'icon-box-primary' },
              { label: 'Checked in', value: `${checkedInRate}%`, icon: UserCheck2, tone: 'icon-box-green' },
              { label: 'Revenue', value: 'EGP 21.3K', icon: DollarSign, tone: 'icon-box-orange' },
              { label: 'Next scan', value: 'QR ready', icon: QrCode, tone: 'icon-box-cyan' },
            ].map((item) => (
              <div key={item.label} className="kpi-card p-3">
                <div className="mb-3 flex items-start justify-between">
                  <div className={`icon-box ${item.tone}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Now</span>
                </div>
                <p className="kpi-value">{item.value}</p>
                <p className="kpi-label">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 rounded-2xl bg-muted/60 p-1 w-fit max-w-full overflow-x-auto">
        {[
          { key: 'attendees', label: 'Attendees', icon: Users },
          { key: 'analytics', label: 'Analytics', icon: BarChart },
          { key: 'community', label: 'Community', icon: MessageSquare },
          { key: 'checkin', label: 'Check-in', icon: QrCode },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-caption font-bold transition-all ${
              activeTab === tab.key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {activeTab === 'attendees' && (
            <div className="bento-section space-y-5">
              <div className="bento-header">
                <div className="bento-title-wrapper">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="bento-title">Attendees</h2>
                    <p className="text-caption text-muted-foreground">{filteredAttendees.length} visible · {MOCK_CHECKIN_ATTENDEES.length} total</p>
                  </div>
                </div>
                <button onClick={handleExport} className="btn-secondary inline-flex items-center gap-2 text-body-sm">
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search attendees by name or email"
                    className="input-base w-full pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {ticketFilterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => setTicketFilter(option)}
                      className={`filter-chip inline-flex items-center gap-2 ${ticketFilter === option ? 'is-active' : ''}`}
                    >
                      <Filter className="h-3.5 w-3.5" />
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button onClick={selectAllVisible} className="btn-ghost px-3 py-1">Select all</button>
                  <button onClick={clearSelection} className="btn-ghost px-3 py-1">Clear</button>
                  <button onClick={bulkCheckIn} className="btn-primary px-3 py-1">Mark checked in</button>
                  <button onClick={exportSelectedCSV} className="btn-secondary px-3 py-1">Export selected</button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-caption text-muted-foreground">Sort</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="input-base py-1">
                    <option value="name">Name</option>
                    <option value="ticket">Ticket</option>
                  </select>
                  <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} className="btn-ghost px-2 py-1">{sortDir === 'asc' ? '▲' : '▼'}</button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {filteredAttendees.map((attendee) => {
                  const done = checkedIn.has(attendee.id);
                  return (
                    <div
                      key={attendee.id}
                      className={`flex items-center gap-4 rounded-2xl border p-4 transition-all ${done ? 'border-green-400/40 bg-green-50/70 dark:bg-green-900/10' : 'border-border bg-background hover:border-primary/30'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(attendee.id)}
                        onChange={() => toggleSelect(attendee.id)}
                        className="w-4 h-4 shrink-0 rounded-lg border-2 border-border checked:border-purple-700 checked:bg-purple-600 accent-purple-600"
                      />
                      <img src={attendee.avatar} alt={attendee.name} className="h-11 w-11 shrink-0 rounded-2xl border border-border object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-body-sm font-bold text-foreground">{attendee.name}</p>
                        <p className="truncate text-caption text-muted-foreground">{attendee.email}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="status-pill bg-primary/10 text-primary">{attendee.ticketType}</span>
                          <span className="status-pill bg-muted text-muted-foreground">{attendee.status}</span>
                        </div>
                      </div>
                      {done ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-caption font-bold text-green-700 dark:text-green-300">
                          <CheckCircle2 className="h-4 w-4" />
                          Checked in
                        </span>
                      ) : (
                        <button onClick={() => handleCheckIn(attendee.id, attendee.name)} className="btn-primary shrink-0 px-4 py-2 text-body-sm">
                          Check in
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: 'Page Views', value: '2,847', change: '+18%', icon: Eye, tone: 'icon-box-primary' },
                  { label: 'Conversion', value: '24%', change: '+5%', icon: TrendingUp, tone: 'icon-box-cyan' },
                  { label: 'Revenue', value: 'EGP 21.3K', change: '+12%', icon: DollarSign, tone: 'icon-box-orange' },
                  { label: 'Avg Ticket', value: 'EGP 150', change: '+3%', icon: DollarSign, tone: 'icon-box-green' },
                ].map((kpi) => (
                  <div key={kpi.label} className="kpi-card">
                    <div className="mb-3 flex items-start justify-between">
                      <div className={`icon-box ${kpi.tone}`}>
                        <kpi.icon className="h-4 w-4" />
                      </div>
                      <span className="kpi-trend text-green-600 dark:text-green-400">
                        <ArrowUpRight className="h-3 w-3" />
                        {kpi.change}
                      </span>
                    </div>
                    <p className="kpi-value">{kpi.value}</p>
                    <p className="kpi-label">{kpi.label}</p>
                  </div>
                ))}
              </div>

              <div className="bento-section space-y-5">
                <div className="bento-header">
                  <div className="bento-title-wrapper">
                    <BarChart className="h-5 w-5 text-primary" />
                    <div>
                      <h2 className="bento-title">Registration timeline</h2>
                      <p className="text-caption text-muted-foreground">Last 14 days</p>
                    </div>
                  </div>
                </div>
                <div className="flex h-64 items-end gap-2 pt-4">
                  {REGISTRATION_POINTS.map((point, index) => (
                    <div key={index} className="flex-1">
                      <div className="rounded-t-xl bg-primary/15 transition-colors hover:bg-primary/35" style={{ height: `${point}%` }} />
                      <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{index + 1}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: 'Traffic source', value: 'Social · 52%', desc: 'Highest-converting channel' },
                  { label: 'Peak hour', value: '8:00 PM', desc: 'Fastest bookings window' },
                  { label: 'Drop-off', value: 'Checkout step', desc: 'Review ticket options' },
                ].map((item) => (
                  <div key={item.label} className="surface-panel p-5">
                    <p className="text-caption font-black uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-h3 font-bold text-foreground">{item.value}</p>
                    <p className="mt-1 text-body-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="space-y-6">
              <div className="surface-panel p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-h2 font-bold text-foreground">Event Community</h2>
                    <p className="mt-1 text-body-sm text-muted-foreground">Keep attendees informed with announcements and reactions.</p>
                  </div>
                  <button className="btn-primary inline-flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Post update
                  </button>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                {ANNOUNCEMENTS.map((post) => (
                  <div key={post.id} className="surface-panel p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="icon-box icon-box-cyan">
                        <post.icon className="h-4 w-4" />
                      </div>
                      <span className="text-caption text-muted-foreground">{post.time}</span>
                    </div>
                    <h3 className="text-h4 font-bold text-foreground">{post.title}</h3>
                    <p className="mt-2 text-body-sm text-muted-foreground">{post.body}</p>
                    <div className="mt-4 flex items-center gap-4 text-caption font-semibold text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> 24</span>
                      <span className="inline-flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> 8</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'checkin' && (
            <div className="bento-section space-y-5">
              <div className="bento-header">
                <div className="bento-title-wrapper">
                  <QrCode className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="bento-title">Check-in station</h2>
                    <p className="text-caption text-muted-foreground">{checkedInCount} / {MOCK_CHECKIN_ATTENDEES.length} checked in</p>
                  </div>
                </div>
                <button onClick={() => setCheckedIn(new Set())} className="btn-secondary inline-flex items-center gap-2 text-body-sm">
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </button>
              </div>

              <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
                <div className="surface-panel flex flex-col items-center justify-center gap-4 p-5 text-center">
                  <div className="grid h-40 w-40 place-items-center rounded-3xl border border-border bg-background shadow-sm">
                    <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-primary text-white shadow-lg">
                      <QrCode className="h-12 w-12" />
                    </div>
                  </div>
                  <div>
                    <p className="text-h3 font-bold text-foreground">Scan & verify</p>
                    <p className="mt-1 text-body-sm text-muted-foreground">Use manual check-in when QR scanning isn't available.</p>
                  </div>
                  <button onClick={() => toast.success('QR session refreshed')} className="btn-primary inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Refresh QR
                  </button>
                </div>

                <div className="space-y-3">
                  {filteredAttendees.slice(0, 8).map((a) => {
                    const done = checkedIn.has(a.id);
                    return (
                      <div
                        key={a.id}
                        className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors ${done ? 'border-green-400/40 bg-green-50/70 dark:bg-green-900/10' : 'border-border bg-background hover:border-primary/30'}`}
                      >
                        <img src={a.avatar} alt={a.name} className="h-10 w-10 shrink-0 rounded-2xl border border-border object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-body-sm font-bold text-foreground">{a.name}</p>
                          <p className="truncate text-caption text-muted-foreground">{a.email}</p>
                        </div>
                        <span className="status-pill bg-muted text-muted-foreground">{a.ticketType}</span>
                        {done ? (
                          <span className="inline-flex items-center gap-1.5 text-caption font-bold text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Checked in
                          </span>
                        ) : (
                          <button onClick={() => handleCheckIn(a.id, a.name)} className="btn-primary px-4 py-2 text-body-sm">
                            Check in
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Side rail */}
        <aside className="space-y-6">
          <div className="surface-panel p-5">
            <div className="flex items-center gap-2 text-caption font-black uppercase tracking-[0.2em] text-muted-foreground">
              <CalendarDays className="h-4 w-4 text-cyan-500" />
              Event snapshot
            </div>
            <div className="mt-4 space-y-4">
              {[
                { label: 'Date', value: 'May 24, 2026' },
                { label: 'Venue', value: 'Cairo Opera House' },
                { label: 'Time', value: '7:30 PM' },
                { label: 'Capacity', value: '220 guests' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl bg-muted/40 px-4 py-3">
                  <span className="text-caption font-semibold uppercase tracking-[0.18em] text-muted-foreground">{item.label}</span>
                  <span className="text-body-sm font-bold text-foreground text-right">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center gap-2 text-caption font-black uppercase tracking-[0.2em] text-muted-foreground">
              <Clock3 className="h-4 w-4 text-primary" />
              Quick actions
            </div>
            <div className="mt-4 space-y-3">
              {[
                'Schedule reminder',
                'Send attendee update',
                'Promote on social',
                'Open check-in view',
              ].map((label) => (
                <button key={label} className="w-full rounded-2xl border border-border px-4 py-3 text-left text-body-sm font-semibold text-foreground hover:bg-muted/50 transition-colors">
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center gap-2 text-caption font-black uppercase tracking-[0.2em] text-muted-foreground">
              <Filter className="h-4 w-4 text-orange-500" />
              Filters active
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="status-pill bg-primary/10 text-primary">{ticketFilter}</span>
              <span className="status-pill bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">Search: {searchQuery || 'None'}</span>
              <span className="status-pill bg-green-500/10 text-green-600 dark:text-green-300">Checked in: {checkedInCount}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
