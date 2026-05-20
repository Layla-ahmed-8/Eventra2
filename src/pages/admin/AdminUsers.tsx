import { useEffect, useMemo, useState } from 'react';
import {
  Search, UserX, Eye, CheckCircle, XCircle, ShieldCheck, Ban,
  Download, Users, UserCheck, Clock, X, Send, RefreshCw,
  MessageSquare, Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import { formatRelativeTime } from '../../lib/utils';
import VerificationBadge from '../../components/business/VerificationBadge';
import { mockUserActivity } from '../../data/adminUsersData';
import type { ManagedUser } from '../../types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isToday(iso: string) {
  const d = new Date(iso);
  const n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

// ── Micro-components ──────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: 'attendee' | 'organizer' | 'admin' }) {
  const map = {
    attendee: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    organizer: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
    admin: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };
  const labels = { attendee: 'Attendee', organizer: 'Organizer', admin: 'Admin' };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-caption font-bold ${map[role]}`}>
      {labels[role]}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    suspended: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    banned: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-caption font-bold capitalize ${map[status] ?? ''}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function Spinner() {
  return <span className="inline-block w-4 h-4 border-2 border-current/25 border-t-current rounded-full animate-spin flex-shrink-0" />;
}

function Modal({
  open, onClose, title, children, maxWidth = 'max-w-lg',
}: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-full ${maxWidth} bg-card border border-border rounded-3xl shadow-2xl max-h-[90vh] flex flex-col`}>
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <h2 className="text-h3 font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="btn-ghost p-2 rounded-xl"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6 custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminUsers() {
  const {
    managedUsers,
    organizerRequests,
    approveOrganizerRequest,
    rejectOrganizerRequest,
    suspendUser,
    unsuspendUser,
    banUser,
    grantVerifiedStatus,
    sendAdminMessageToUser,
    forcePasswordReset,
  } = useAppStore();

  const pendingOrganizerRequests = organizerRequests.filter((r) => r.status === 'pending');

  // ── Filters
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'attendee' | 'organizer' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended' | 'banned'>('all');
  const [quickFilter, setQuickFilter] = useState<'none' | 'new_today' | 'pending_orgs' | 'suspended'>('none');

  // ── Modal targets (id-based so store changes auto-reflect)
  const [viewUserId, setViewUserId] = useState<string | null>(null);
  const [viewTab, setViewTab] = useState<'profile' | 'activity'>('profile');
  const [suspendTarget, setSuspendTarget] = useState<ManagedUser | null>(null);
  const [unsuspendTarget, setUnsuspendTarget] = useState<ManagedUser | null>(null);
  const [banTarget, setBanTarget] = useState<ManagedUser | null>(null);
  const [verifyTarget, setVerifyTarget] = useState<ManagedUser | null>(null);
  const [approveTarget, setApproveTarget] = useState<{ id: string; name: string } | null>(null);
  const [rejectTarget, setRejectTarget] = useState<{ id: string; name: string } | null>(null);
  const [msgTarget, setMsgTarget] = useState<ManagedUser | null>(null);
  const [resetTarget, setResetTarget] = useState<ManagedUser | null>(null);

  // ── Form state for modals with inputs
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendUntil, setSuspendUntil] = useState('');
  const [banReason, setBanReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  // Derive viewUser from store so it auto-updates after actions
  const viewUser = viewUserId ? (managedUsers.find((u) => u.id === viewUserId) ?? null) : null;

  // ── Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ── KPI counts
  const totalUsers = managedUsers.length;
  const newToday = useMemo(() => managedUsers.filter((u) => isToday(u.joinDate)).length, [managedUsers]);
  const pendingOrgsCount = useMemo(() => managedUsers.filter((u) => u.status === 'pending' && u.role === 'organizer').length, [managedUsers]);
  const suspendedCount = useMemo(() => managedUsers.filter((u) => u.status === 'suspended').length, [managedUsers]);

  // ── Filtered users
  const filteredUsers = useMemo(() => {
    let list = [...managedUsers];
    if (quickFilter === 'new_today') {
      list = list.filter((u) => isToday(u.joinDate));
    } else if (quickFilter === 'pending_orgs') {
      list = list.filter((u) => u.status === 'pending' && u.role === 'organizer');
    } else if (quickFilter === 'suspended') {
      list = list.filter((u) => u.status === 'suspended');
    } else {
      if (roleFilter !== 'all') list = list.filter((u) => u.role === roleFilter);
      if (statusFilter !== 'all') list = list.filter((u) => u.status === statusFilter);
    }
    if (debouncedSearch) {
      list = list.filter(
        (u) => u.name.toLowerCase().includes(debouncedSearch) || u.email.toLowerCase().includes(debouncedSearch),
      );
    }
    return list;
  }, [managedUsers, quickFilter, roleFilter, statusFilter, debouncedSearch]);

  // ── CSV Export
  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Status', 'Verified', 'Joined Date', 'Last Login', 'Suspended Until', 'Ban Reason'];
    const rows = filteredUsers.map((u) => [
      u.name, u.email, u.role, u.status,
      u.isVerified ? 'Yes' : 'No',
      formatDate(u.joinDate),
      u.lastLogin ? formatDate(u.lastLogin) : '',
      u.suspendedUntil ? formatDate(u.suspendedUntil) : '',
      u.banReason ?? '',
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eventra-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filteredUsers.length} users to CSV`);
  };

  // ── Loading helper
  const withLoading = (key: string, fn: () => void) => {
    setLoadingKey(key);
    setTimeout(() => { fn(); setLoadingKey(null); }, 600);
  };

  // ── KPI filter toggle
  const handleKPIClick = (filter: typeof quickFilter) => {
    setQuickFilter((prev) => (prev === filter ? 'none' : filter));
    setRoleFilter('all');
    setStatusFilter('all');
  };

  // ── Action handlers
  const handleSuspend = () => {
    if (!suspendTarget || !suspendReason.trim()) { toast.error('Suspension reason is required.'); return; }
    const { id, name } = suspendTarget;
    const reason = suspendReason;
    const until = suspendUntil;
    setSuspendTarget(null); setSuspendReason(''); setSuspendUntil('');
    withLoading(`suspend-${id}`, () => {
      suspendUser(id, reason, until || undefined);
      toast.success(`${name} has been suspended.`);
    });
  };

  const handleUnsuspend = () => {
    if (!unsuspendTarget) return;
    const { id, name } = unsuspendTarget;
    setUnsuspendTarget(null);
    withLoading(`unsuspend-${id}`, () => {
      unsuspendUser(id);
      toast.success(`${name} has been unsuspended.`);
    });
  };

  const handleBan = () => {
    if (!banTarget || !banReason.trim()) { toast.error('Ban reason is required.'); return; }
    const { id, name } = banTarget;
    const reason = banReason;
    setBanTarget(null); setBanReason('');
    withLoading(`ban-${id}`, () => {
      banUser(id, reason);
      toast.success(`${name} has been permanently banned.`);
    });
  };

  const handleGrantVerified = () => {
    if (!verifyTarget) return;
    const { id, name } = verifyTarget;
    setVerifyTarget(null);
    withLoading(`verify-${id}`, () => {
      grantVerifiedStatus(id);
      toast.success(`${name} is now a Verified Organizer.`);
    });
  };

  const handleApprove = () => {
    if (!approveTarget) return;
    const { id, name } = approveTarget;
    setApproveTarget(null);
    withLoading(`approve-${id}`, () => {
      approveOrganizerRequest(id, 'Welcome to the organizer program!');
      toast.success(`${name} approved as organizer.`);
    });
  };

  const handleReject = () => {
    if (!rejectTarget || !rejectReason.trim()) { toast.error('Rejection reason is required.'); return; }
    const { id, name } = rejectTarget;
    const reason = rejectReason;
    setRejectTarget(null); setRejectReason('');
    withLoading(`reject-${id}`, () => {
      rejectOrganizerRequest(id, reason);
      toast.success(`${name}'s request has been rejected.`);
    });
  };

  const handleSendMessage = () => {
    if (!msgTarget || !msgSubject.trim() || !msgBody.trim()) { toast.error('Subject and message are required.'); return; }
    const target = msgTarget;
    const subject = msgSubject;
    const body = msgBody;
    setMsgTarget(null); setMsgSubject(''); setMsgBody('');
    withLoading(`msg-${target.id}`, () => {
      sendAdminMessageToUser(target.id, target.name, subject, body);
      toast.success(`Message sent to ${target.name}.`);
    });
  };

  const handleForceReset = () => {
    if (!resetTarget) return;
    const { id, name } = resetTarget;
    setResetTarget(null);
    withLoading(`reset-${id}`, () => {
      forcePasswordReset(id, name);
      toast.success(`Password reset sent to ${name}.`);
    });
  };

  // ── JSX ───────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">User Management</h1>
          <p className="text-body text-muted-foreground mt-1">Manage platform users, roles, and access</p>
        </div>
        <button type="button" onClick={handleExportCSV} className="btn-secondary flex items-center gap-2 self-start sm:self-auto">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { filter: 'none' as const, label: 'Total Users', value: totalUsers, icon: <Users className="w-3.5 h-3.5" />, color: 'text-foreground', ring: 'hover:ring-foreground/20', activeRing: 'ring-foreground/30' },
          { filter: 'new_today' as const, label: 'New Today', value: newToday, icon: <UserCheck className="w-3.5 h-3.5 text-green-600" />, color: 'text-green-600 dark:text-green-400', ring: 'hover:ring-green-500/30', activeRing: 'ring-green-500/50' },
          { filter: 'pending_orgs' as const, label: 'Pending Orgs', value: pendingOrgsCount, icon: <Clock className="w-3.5 h-3.5 text-yellow-600" />, color: 'text-yellow-600 dark:text-yellow-400', ring: 'hover:ring-yellow-500/30', activeRing: 'ring-yellow-500/50' },
          { filter: 'suspended' as const, label: 'Suspended', value: suspendedCount, icon: <UserX className="w-3.5 h-3.5 text-red-600" />, color: 'text-red-600 dark:text-red-400', ring: 'hover:ring-red-500/30', activeRing: 'ring-red-500/50' },
        ].map((kpi) => (
          <button
            key={kpi.filter}
            type="button"
            onClick={() => handleKPIClick(kpi.filter)}
            className={`kpi-card text-left cursor-pointer transition-all hover:ring-2 ${kpi.ring} ${quickFilter === kpi.filter ? `ring-2 ${kpi.activeRing}` : ''}`}
          >
            <p className="kpi-label flex items-center gap-1.5">{kpi.icon}{kpi.label}</p>
            <p className={`text-h2 font-bold ${kpi.color}`}>{kpi.value.toLocaleString()}</p>
          </button>
        ))}
      </div>

      {/* ── Pending Organizer Requests ── */}
      {pendingOrganizerRequests.length > 0 && (
        <div className="surface-panel p-6 border border-yellow-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-h3 font-bold text-foreground">Pending Organizer Requests</h2>
              <p className="text-caption text-muted-foreground">{pendingOrganizerRequests.length} request{pendingOrganizerRequests.length !== 1 ? 's' : ''} awaiting review</p>
            </div>
          </div>
          <ul className="space-y-3">
            {pendingOrganizerRequests.map((req) => (
              <li key={req.id} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 p-4 rounded-2xl bg-secondary/40 border border-border">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={req.userAvatar || `https://i.pravatar.cc/40?u=${req.userId}`} alt={req.userName} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-body-sm font-bold text-foreground">{req.userName}</p>
                    <p className="text-caption text-muted-foreground truncate">Event: {req.eventTitle}</p>
                    <p className="text-caption text-muted-foreground line-clamp-1 mt-0.5">{req.reason}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    className="px-3 py-2 rounded-2xl bg-green-600 hover:bg-green-700 text-white text-body-sm font-bold transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                    disabled={!!loadingKey}
                    onClick={() => setApproveTarget({ id: req.id, name: req.userName })}
                  >
                    {loadingKey === `approve-${req.id}` ? <Spinner /> : <CheckCircle className="w-4 h-4" />}
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn-secondary text-body-sm inline-flex items-center gap-1.5 disabled:opacity-50"
                    disabled={!!loadingKey}
                    onClick={() => setRejectTarget({ id: req.id, name: req.userName })}
                  >
                    {loadingKey === `reject-${req.id}` ? <Spinner /> : <XCircle className="w-4 h-4" />}
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Search + Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setQuickFilter('none'); }}
            placeholder="Search by name or email…"
            className="w-full pl-10 pr-4 input-base"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value as typeof roleFilter); setQuickFilter('none'); }}
          className="input-base sm:w-40"
        >
          <option value="all">All Roles</option>
          <option value="attendee">Attendee</option>
          <option value="organizer">Organizer</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setQuickFilter('none'); }}
          className="input-base sm:w-44"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {quickFilter !== 'none' && (
        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <Filter className="w-3.5 h-3.5" />
          Showing:
          <span className="font-bold text-foreground">
            {quickFilter === 'new_today' && 'New Today'}
            {quickFilter === 'pending_orgs' && 'Pending Organizers'}
            {quickFilter === 'suspended' && 'Suspended Users'}
          </span>
          <span>({filteredUsers.length})</span>
          <button type="button" onClick={() => setQuickFilter('none')} className="ml-1 font-bold text-red-500 hover:text-red-600">Clear</button>
        </div>
      )}

      {/* ── Users Table ── */}
      <div className="surface-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-surface min-w-[940px]">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">User</th>
                <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">Role</th>
                <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">Joined</th>
                <th className="px-4 py-3 text-left text-caption font-semibold text-foreground">Last Login</th>
                <th className="px-4 py-3 text-center text-caption font-semibold text-foreground">Events</th>
                <th className="px-4 py-3 text-right text-caption font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-body-sm">No users match your filters.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || `https://i.pravatar.cc/40?u=${user.id}`}
                          alt={user.name}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-border"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-body-sm font-bold text-foreground truncate">{user.name}</p>
                            {user.isVerified && <VerificationBadge isVerified size="sm" />}
                          </div>
                          <p className="text-caption text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
                    <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                    <td className="px-4 py-3 text-caption text-muted-foreground whitespace-nowrap">{formatDate(user.joinDate)}</td>
                    <td className="px-4 py-3 text-caption text-muted-foreground whitespace-nowrap">
                      {user.lastLogin ? formatRelativeTime(user.lastLogin) : '—'}
                    </td>
                    <td className="px-4 py-3 text-center text-body-sm font-bold text-foreground">{user.eventsCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" title="View User" className="btn-ghost p-2 rounded-xl"
                          onClick={() => { setViewUserId(user.id); setViewTab('profile'); }}>
                          <Eye className="w-4 h-4" />
                        </button>
                        {user.role === 'organizer' && !user.isVerified && user.status !== 'banned' && (
                          <button type="button" title="Grant Verified Status"
                            className="btn-ghost p-2 rounded-xl text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                            disabled={!!loadingKey} onClick={() => setVerifyTarget(user)}>
                            {loadingKey === `verify-${user.id}` ? <Spinner /> : <ShieldCheck className="w-4 h-4" />}
                          </button>
                        )}
                        {user.status === 'suspended' ? (
                          <button type="button" title="Unsuspend User"
                            className="btn-ghost p-2 rounded-xl text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                            disabled={!!loadingKey} onClick={() => setUnsuspendTarget(user)}>
                            {loadingKey === `unsuspend-${user.id}` ? <Spinner /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                        ) : user.status !== 'banned' && user.role !== 'admin' ? (
                          <button type="button" title="Suspend User"
                            className="btn-ghost p-2 rounded-xl text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                            disabled={!!loadingKey} onClick={() => setSuspendTarget(user)}>
                            {loadingKey === `suspend-${user.id}` ? <Spinner /> : <UserX className="w-4 h-4" />}
                          </button>
                        ) : null}
                        {user.status !== 'banned' && user.role !== 'admin' && (
                          <button type="button" title="Ban User (permanent)"
                            className="btn-ghost p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            disabled={!!loadingKey} onClick={() => setBanTarget(user)}>
                            {loadingKey === `ban-${user.id}` ? <Spinner /> : <Ban className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border text-caption text-muted-foreground">
          Showing {filteredUsers.length} of {totalUsers} users
        </div>
      </div>

      {/* ════════════════════ MODALS ════════════════════ */}

      {/* View User */}
      <Modal open={!!viewUser} onClose={() => setViewUserId(null)} title="User Profile" maxWidth="max-w-2xl">
        {viewUser && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <img src={viewUser.avatar || `https://i.pravatar.cc/80?u=${viewUser.id}`} alt={viewUser.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-border flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-h3 font-bold text-foreground">{viewUser.name}</h3>
                  {viewUser.isVerified && <VerificationBadge isVerified />}
                </div>
                <p className="text-body-sm text-muted-foreground">{viewUser.email}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <RoleBadge role={viewUser.role} />
                  <StatusBadge status={viewUser.status} />
                </div>
              </div>
            </div>

            <div className="flex border-b border-border gap-4">
              {(['profile', 'activity'] as const).map((tab) => (
                <button key={tab} type="button" onClick={() => setViewTab(tab)}
                  className={`pb-2 text-body-sm font-bold border-b-2 transition-colors ${
                    viewTab === tab ? 'border-red-500 text-red-600 dark:text-red-400' : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}>
                  {tab === 'activity' ? 'Activity Log' : 'Profile'}
                </button>
              ))}
            </div>

            {viewTab === 'profile' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Joined', value: formatDate(viewUser.joinDate) },
                    { label: 'Last Login', value: viewUser.lastLogin ? formatRelativeTime(viewUser.lastLogin) : '—' },
                    { label: 'Events', value: String(viewUser.eventsCount) },
                    { label: 'Verified Organizer', value: viewUser.isVerified ? 'Yes ✓' : 'No' },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-2xl bg-secondary/40 border border-border">
                      <p className="text-caption text-muted-foreground">{label}</p>
                      <p className="text-body-sm font-bold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>

                {viewUser.status === 'suspended' && (
                  <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                    <p className="text-body-sm font-bold text-orange-700 dark:text-orange-300 mb-1">Suspended</p>
                    {viewUser.suspendReason && <p className="text-caption text-orange-600 dark:text-orange-400">Reason: {viewUser.suspendReason}</p>}
                    {viewUser.suspendedUntil && <p className="text-caption text-orange-600 dark:text-orange-400 mt-0.5">Until: {formatDate(viewUser.suspendedUntil)}</p>}
                  </div>
                )}
                {viewUser.status === 'banned' && (
                  <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className="text-body-sm font-bold text-red-700 dark:text-red-300 mb-1">Permanently Banned</p>
                    {viewUser.banReason && <p className="text-caption text-red-600 dark:text-red-400">Reason: {viewUser.banReason}</p>}
                  </div>
                )}

                {viewUser.role !== 'admin' && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    <button type="button" onClick={() => setMsgTarget(viewUser)}
                      className="btn-secondary text-body-sm inline-flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Send Message
                    </button>
                    <button type="button" onClick={() => setResetTarget(viewUser)}
                      className="btn-secondary text-body-sm inline-flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" /> Force Password Reset
                    </button>
                    {viewUser.role === 'organizer' && !viewUser.isVerified && viewUser.status !== 'banned' && (
                      <button type="button" onClick={() => setVerifyTarget(viewUser)}
                        className="btn-secondary text-body-sm inline-flex items-center gap-2 text-cyan-600">
                        <ShieldCheck className="w-4 h-4" /> Grant Verified
                      </button>
                    )}
                    {viewUser.status === 'suspended' ? (
                      <button type="button" onClick={() => setUnsuspendTarget(viewUser)}
                        className="btn-secondary text-body-sm inline-flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" /> Unsuspend
                      </button>
                    ) : viewUser.status !== 'banned' && (
                      <button type="button" onClick={() => setSuspendTarget(viewUser)}
                        className="btn-secondary text-body-sm inline-flex items-center gap-2 text-orange-500">
                        <UserX className="w-4 h-4" /> Suspend
                      </button>
                    )}
                    {viewUser.status !== 'banned' && (
                      <button type="button" onClick={() => setBanTarget(viewUser)}
                        className="btn-secondary text-body-sm inline-flex items-center gap-2 text-red-600">
                        <Ban className="w-4 h-4" /> Ban User
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {viewTab === 'activity' && (
              <div className="space-y-2">
                {(mockUserActivity[viewUser.id] ?? []).length === 0 ? (
                  <p className="text-center text-body-sm text-muted-foreground py-8">No activity recorded.</p>
                ) : (
                  (mockUserActivity[viewUser.id] ?? []).map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30">
                      <span className="text-lg flex-shrink-0">{entry.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-bold text-foreground">{entry.action}</p>
                        <p className="text-caption text-muted-foreground">{entry.detail}</p>
                      </div>
                      <span className="text-caption text-muted-foreground whitespace-nowrap">{formatRelativeTime(entry.timestamp)}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Suspend */}
      <Modal open={!!suspendTarget} onClose={() => { setSuspendTarget(null); setSuspendReason(''); setSuspendUntil(''); }} title="Suspend User">
        {suspendTarget && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <p className="text-body-sm text-orange-700 dark:text-orange-300">
                Suspending <strong>{suspendTarget.name}</strong> will invalidate their active sessions.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Reason <span className="text-red-500">*</span></label>
              <textarea rows={3} value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Explain the reason for suspension…" className="w-full px-3 py-2 input-base resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Suspend Until <span className="text-muted-foreground font-normal">(optional — default 30 days)</span></label>
              <input type="date" value={suspendUntil} min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setSuspendUntil(e.target.value)} className="w-full px-3 py-2 input-base" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setSuspendTarget(null); setSuspendReason(''); setSuspendUntil(''); }} className="btn-secondary flex-1">Cancel</button>
              <button type="button" onClick={handleSuspend} disabled={!!loadingKey}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingKey?.startsWith('suspend-') ? <Spinner /> : <UserX className="w-4 h-4" />}
                Suspend
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Unsuspend */}
      <Modal open={!!unsuspendTarget} onClose={() => setUnsuspendTarget(null)} title="Unsuspend User">
        {unsuspendTarget && (
          <div className="space-y-4">
            <p className="text-body text-foreground">
              Restore <strong>{unsuspendTarget.name}</strong>'s account? They will regain full platform access.
            </p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setUnsuspendTarget(null)} className="btn-secondary flex-1">Cancel</button>
              <button type="button" onClick={handleUnsuspend} disabled={!!loadingKey}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingKey?.startsWith('unsuspend-') ? <Spinner /> : <CheckCircle className="w-4 h-4" />}
                Unsuspend
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Ban */}
      <Modal open={!!banTarget} onClose={() => { setBanTarget(null); setBanReason(''); }} title="Permanently Ban User">
        {banTarget && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-body-sm font-bold text-red-700 dark:text-red-300 mb-1">⚠ Irreversible Action</p>
              <p className="text-caption text-red-600 dark:text-red-400">
                Banning <strong>{banTarget.name}</strong> is permanent and cannot be undone.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Reason <span className="text-red-500">*</span></label>
              <textarea rows={3} value={banReason} onChange={(e) => setBanReason(e.target.value)}
                placeholder="Explain the reason for the permanent ban…" className="w-full px-3 py-2 input-base resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setBanTarget(null); setBanReason(''); }} className="btn-secondary flex-1">Cancel</button>
              <button type="button" onClick={handleBan} disabled={!!loadingKey}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingKey?.startsWith('ban-') ? <Spinner /> : <Ban className="w-4 h-4" />}
                Ban Permanently
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Grant Verified */}
      <Modal open={!!verifyTarget} onClose={() => setVerifyTarget(null)} title="Grant Verified Status">
        {verifyTarget && (
          <div className="space-y-4">
            <p className="text-body text-foreground">
              Grant Verified Organizer status to <strong>{verifyTarget.name}</strong>? They will be able to publish events directly without admin review.
            </p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setVerifyTarget(null)} className="btn-secondary flex-1">Cancel</button>
              <button type="button" onClick={handleGrantVerified} disabled={!!loadingKey}
                className="flex-1 btn-primary flex items-center justify-center gap-2">
                {loadingKey?.startsWith('verify-') ? <Spinner /> : <ShieldCheck className="w-4 h-4" />}
                Grant Verified
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Approve Organizer */}
      <Modal open={!!approveTarget} onClose={() => setApproveTarget(null)} title="Approve Organizer Request">
        {approveTarget && (
          <div className="space-y-4">
            <p className="text-body text-foreground">
              Approve <strong>{approveTarget.name}</strong>'s request to become an organizer? They will be notified and can start creating events.
            </p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setApproveTarget(null)} className="btn-secondary flex-1">Cancel</button>
              <button type="button" onClick={handleApprove} disabled={!!loadingKey}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingKey?.startsWith('approve-') ? <Spinner /> : <CheckCircle className="w-4 h-4" />}
                Approve
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Organizer */}
      <Modal open={!!rejectTarget} onClose={() => { setRejectTarget(null); setRejectReason(''); }} title="Reject Organizer Request">
        {rejectTarget && (
          <div className="space-y-4">
            <p className="text-body text-foreground">Reject <strong>{rejectTarget.name}</strong>'s organizer request? They will be notified with your reason.</p>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Reason <span className="text-red-500">*</span></label>
              <textarea rows={3} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why the request is being rejected…" className="w-full px-3 py-2 input-base resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setRejectTarget(null); setRejectReason(''); }} className="btn-secondary flex-1">Cancel</button>
              <button type="button" onClick={handleReject} disabled={!!loadingKey}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loadingKey?.startsWith('reject-') ? <Spinner /> : <XCircle className="w-4 h-4" />}
                Reject
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Send Message */}
      <Modal open={!!msgTarget} onClose={() => { setMsgTarget(null); setMsgSubject(''); setMsgBody(''); }} title="Send Message to User">
        {msgTarget && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/40">
              <img src={msgTarget.avatar || `https://i.pravatar.cc/40?u=${msgTarget.id}`} alt={msgTarget.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <p className="text-body-sm font-bold text-foreground">{msgTarget.name}</p>
                <p className="text-caption text-muted-foreground">{msgTarget.email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Subject <span className="text-red-500">*</span></label>
              <input type="text" value={msgSubject} onChange={(e) => setMsgSubject(e.target.value)}
                placeholder="Message subject…" className="w-full px-3 py-2 input-base" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Message <span className="text-red-500">*</span></label>
              <textarea rows={4} value={msgBody} onChange={(e) => setMsgBody(e.target.value)}
                placeholder="Type your message…" className="w-full px-3 py-2 input-base resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { setMsgTarget(null); setMsgSubject(''); setMsgBody(''); }} className="btn-secondary flex-1">Cancel</button>
              <button type="button" onClick={handleSendMessage} disabled={!!loadingKey}
                className="flex-1 btn-primary flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600">
                {loadingKey?.startsWith('msg-') ? <Spinner /> : <Send className="w-4 h-4" />}
                Send Message
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Force Password Reset */}
      <Modal open={!!resetTarget} onClose={() => setResetTarget(null)} title="Force Password Reset">
        {resetTarget && (
          <div className="space-y-4">
            <p className="text-body text-foreground">
              Send a password reset link to <strong>{resetTarget.name}</strong> ({resetTarget.email})? They will receive a notification with the reset link.
            </p>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setResetTarget(null)} className="btn-secondary flex-1">Cancel</button>
              <button type="button" onClick={handleForceReset} disabled={!!loadingKey}
                className="flex-1 btn-primary flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600">
                {loadingKey?.startsWith('reset-') ? <Spinner /> : <RefreshCw className="w-4 h-4" />}
                Send Reset Link
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
