import { useState, useMemo } from 'react';
import { Search, Download, ChevronDown, ChevronRight } from 'lucide-react';
import type { AuditLogEntry, AuditAction } from '../../types';
import { formatRelativeTime } from '../../lib/utils';

// ── Mock audit data ───────────────────────────────────────────────────────────

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'a-001', timestamp: '2026-05-16T10:23:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'approve_event',    targetType: 'event',   targetId: 'event-001', newState: { status: 'published' },                                     ipAddress: '197.48.1.22' },
  { id: 'a-002', timestamp: '2026-05-16T09:55:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'approve_organizer', targetType: 'user',    targetId: 'user-002', newState: { status: 'active' },                                         ipAddress: '197.48.1.22' },
  { id: 'a-003', timestamp: '2026-05-15T18:40:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'reject_event',     targetType: 'event',   targetId: 'event-009', newState: { status: 'rejected', reason: 'Insufficient description' },   ipAddress: '197.48.1.22' },
  { id: 'a-004', timestamp: '2026-05-15T14:10:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'suspend_user',     targetType: 'user',    targetId: 'user-007', previousState: { status: 'active' }, newState: { status: 'suspended', reason: 'Policy violation' }, ipAddress: '41.65.200.1' },
  { id: 'a-005', timestamp: '2026-05-15T11:05:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'grant_verified',   targetType: 'user',    targetId: 'user-010', newState: { organizerStatus: 'verified' },                              ipAddress: '41.65.200.1' },
  { id: 'a-006', timestamp: '2026-05-14T16:30:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'config_change',    targetType: 'config',  targetId: 'system',   previousState: { cancellationWindowHours: 24 }, newState: { cancellationWindowHours: 48 }, ipAddress: '197.48.1.22' },
  { id: 'a-007', timestamp: '2026-05-14T13:00:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'content_remove',   targetType: 'event',   targetId: 'post-003', newState: { status: 'removed', reason: 'Spam content' },               ipAddress: '197.48.1.22' },
  { id: 'a-008', timestamp: '2026-05-14T09:15:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'content_warn',     targetType: 'user',    targetId: 'user-012', newState: { warning: 'Inappropriate language' },                        ipAddress: '197.48.1.22' },
  { id: 'a-009', timestamp: '2026-05-13T20:45:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'ban_user',         targetType: 'user',    targetId: 'user-015', previousState: { status: 'suspended' }, newState: { status: 'banned', reason: 'Repeated violations' }, ipAddress: '41.65.200.1' },
  { id: 'a-010', timestamp: '2026-05-13T15:20:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'approve_event',    targetType: 'event',   targetId: 'event-007', newState: { status: 'published' },                                     ipAddress: '197.48.1.22' },
  { id: 'a-011', timestamp: '2026-05-13T11:00:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'reject_organizer', targetType: 'user',    targetId: 'user-019', newState: { status: 'rejected', reason: 'Incomplete verification docs' }, ipAddress: '41.65.200.1' },
  { id: 'a-012', timestamp: '2026-05-12T17:30:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'content_approve',  targetType: 'event',   targetId: 'post-007', newState: { status: 'approved' },                                       ipAddress: '197.48.1.22' },
  { id: 'a-013', timestamp: '2026-05-12T14:00:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'unsuspend_user',   targetType: 'user',    targetId: 'user-007', previousState: { status: 'suspended' }, newState: { status: 'active' },  ipAddress: '197.48.1.22' },
  { id: 'a-014', timestamp: '2026-05-12T10:10:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'booking_cancel',   targetType: 'booking', targetId: 'booking-021', previousState: { status: 'confirmed' }, newState: { status: 'cancelled' }, ipAddress: '197.48.1.22' },
  { id: 'a-015', timestamp: '2026-05-11T19:50:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'config_change',    targetType: 'config',  targetId: 'system',   previousState: { aiChatEnabled: false }, newState: { aiChatEnabled: true }, ipAddress: '41.65.200.1' },
  { id: 'a-016', timestamp: '2026-05-11T14:20:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'approve_event',    targetType: 'event',   targetId: 'event-014', newState: { status: 'published' },                                     ipAddress: '197.48.1.22' },
  { id: 'a-017', timestamp: '2026-05-10T16:45:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'suspend_user',     targetType: 'user',    targetId: 'user-023', previousState: { status: 'active' }, newState: { status: 'suspended', reason: 'Spam activity' }, ipAddress: '197.48.1.22' },
  { id: 'a-018', timestamp: '2026-05-10T11:30:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'grant_verified',   targetType: 'user',    targetId: 'user-028', newState: { organizerStatus: 'verified' },                              ipAddress: '197.48.1.22' },
  { id: 'a-019', timestamp: '2026-05-09T18:00:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'refund_failure',   targetType: 'booking', targetId: 'booking-008', newState: { refundStatus: 'failed', retryScheduled: true },           ipAddress: '41.65.200.1' },
  { id: 'a-020', timestamp: '2026-05-09T09:00:00Z', adminId: 'user-003', adminEmail: 'admin@demo.com', action: 'approve_organizer', targetType: 'user',   targetId: 'user-031', newState: { status: 'active' },                                         ipAddress: '197.48.1.22' },
];

const ACTION_LABELS: Record<AuditAction, string> = {
  approve_event:    'Approve Event',
  reject_event:     'Reject Event',
  approve_organizer:'Approve Organizer',
  reject_organizer: 'Reject Organizer',
  grant_verified:   'Grant Verified',
  suspend_user:     'Suspend User',
  ban_user:         'Ban User',
  unsuspend_user:   'Unsuspend User',
  config_change:    'Config Change',
  content_approve:  'Approve Content',
  content_remove:   'Remove Content',
  content_warn:     'Warn User',
  booking_cancel:   'Cancel Booking',
  refund_failure:   'Refund Failure',
  user_login:       'User Login',
  user_logout:      'User Logout',
};

const ACTION_COLORS: Record<AuditAction, string> = {
  approve_event:    'text-green-600 dark:text-green-400',
  reject_event:     'text-red-600 dark:text-red-400',
  approve_organizer:'text-green-600 dark:text-green-400',
  reject_organizer: 'text-red-600 dark:text-red-400',
  grant_verified:   'text-cyan-600 dark:text-cyan-400',
  suspend_user:     'text-orange-600 dark:text-orange-400',
  ban_user:         'text-red-700 dark:text-red-400 font-bold',
  unsuspend_user:   'text-blue-600 dark:text-blue-400',
  config_change:    'text-purple-600 dark:text-purple-400',
  content_approve:  'text-green-600 dark:text-green-400',
  content_remove:   'text-red-600 dark:text-red-400',
  content_warn:     'text-amber-600 dark:text-amber-400',
  booking_cancel:   'text-orange-600 dark:text-orange-400',
  refund_failure:   'text-red-600 dark:text-red-400',
  user_login:       'text-muted-foreground',
  user_logout:      'text-muted-foreground',
};

const TARGET_TYPE_OPTIONS = ['all', 'user', 'event', 'booking', 'config'] as const;

function formatTimestamp(ts: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(ts));
}

function JsonPreview({ data }: { data: unknown }) {
  if (!data) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <pre className="text-xs bg-muted/60 rounded p-2 overflow-x-auto max-h-40 text-foreground">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default function AdminAuditLogs() {
  const [search, setSearch] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'user' | 'event' | 'booking' | 'config'>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_AUDIT_LOGS.filter((log) => {
      const matchesSearch =
        !q ||
        log.adminEmail.toLowerCase().includes(q) ||
        ACTION_LABELS[log.action].toLowerCase().includes(q) ||
        log.targetId.toLowerCase().includes(q);
      const matchesType = targetType === 'all' || log.targetType === targetType;
      return matchesSearch && matchesType;
    });
  }, [search, targetType]);

  const buildChanges = (log: AuditLogEntry): string => {
    const prev = log.previousState as Record<string, unknown> | undefined;
    const next = log.newState as Record<string, unknown> | undefined;
    if (!next) return '';
    const keys = new Set([...Object.keys(prev ?? {}), ...Object.keys(next)]);
    const parts: string[] = [];
    keys.forEach((k) => {
      const before = prev?.[k];
      const after = next[k];
      if (before !== undefined && before !== after) {
        parts.push(`${k}: ${before} → ${after}`);
      } else if (before === undefined) {
        parts.push(`${k}: ${after}`);
      }
    });
    return parts.join(' | ');
  };

  const escapeCSV = (val: string) =>
    val.includes(',') || val.includes('"') || val.includes('\n')
      ? `"${val.replace(/"/g, '""')}"`
      : val;

  const handleExport = () => {
    const headers = 'Timestamp,Admin,Action,Target Type,Target ID,IP Address,Changes';
    const rows = filtered.map((l) =>
      [
        l.timestamp,
        l.adminEmail,
        ACTION_LABELS[l.action],
        l.targetType,
        l.targetId,
        l.ipAddress,
        buildChanges(l),
      ]
        .map(escapeCSV)
        .join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'audit-logs.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 font-bold">Audit Logs</h1>
          <p className="text-body-sm text-muted-foreground mt-1">
            All admin actions logged with timestamps and IP addresses
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="surface-panel p-4 rounded-xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by admin, action, or target ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-9 w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TARGET_TYPE_OPTIONS.map((type) => (
            <button
              key={type}
              onClick={() => setTargetType(type)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                targetType === type
                  ? 'bg-primary text-white'
                  : 'border border-border hover:bg-muted'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="surface-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-6" />
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Timestamp</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Admin</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Target</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-muted-foreground">
                    No audit log entries match your filters.
                  </td>
                </tr>
              )}
              {filtered.map((log) => (
                <>
                  <tr
                    key={log.id}
                    onClick={() => setExpandedRow(expandedRow === log.id ? null : log.id)}
                    className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-muted-foreground">
                      {expandedRow === log.id
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap" title={formatTimestamp(log.timestamp)}>
                      {formatRelativeTime(log.timestamp)}
                    </td>
                    <td className="px-4 py-3 font-medium">{log.adminEmail}</td>
                    <td className={`px-4 py-3 font-medium ${ACTION_COLORS[log.action]}`}>
                      {ACTION_LABELS[log.action]}
                    </td>
                    <td className="px-4 py-3">
                      <span className="capitalize text-muted-foreground">{log.targetType}</span>
                      <span className="text-xs text-muted-foreground ml-1.5 font-mono">#{log.targetId.slice(-6)}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{log.ipAddress}</td>
                  </tr>
                  {expandedRow === log.id && (
                    <tr key={`${log.id}-detail`} className="bg-muted/20">
                      <td colSpan={6} className="px-8 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                              Previous State
                            </p>
                            <JsonPreview data={log.previousState} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                              New State
                            </p>
                            <JsonPreview data={log.newState} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border/50 text-xs text-muted-foreground">
          Showing {filtered.length} of {MOCK_AUDIT_LOGS.length} entries
        </div>
      </div>
    </div>
  );
}
