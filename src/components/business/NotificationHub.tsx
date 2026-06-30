import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, BellOff, CheckCheck, ChevronRight, Search, Trash2, X,
  Calendar, Award, MessageSquare, Users, Sparkles, Zap, Ticket, Wallet,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import type { Notification } from '../../data/notifications';
import {
  filterNotifications,
  groupByDate,
  formatNotificationTime,
  type NotificationFilter,
} from '../../lib/notificationUtils';
import { demoToast } from '../../lib/demoFeedback';
import EmptyState from '../shared/EmptyState';

const PAGE_SIZE = 12;

type RoleAccent = 'attendee' | 'organizer' | 'admin';

const ROLE_STYLES: Record<RoleAccent, { chip: string; unread: string }> = {
  attendee: { chip: 'bg-primary/10 text-primary border-primary/20', unread: 'bg-primary' },
  organizer: { chip: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20', unread: 'bg-cyan-500' },
  admin: { chip: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', unread: 'bg-red-500' },
};

function getIcon(type: string) {
  switch (type) {
    case 'event_reminder':
    case 'event_approved':
    case 'event_rejected':
    case 'event_update':
      return <Calendar className="w-4 h-4" />;
    case 'rsvp_confirmed':
    case 'new_booking':
      return <Ticket className="w-4 h-4" />;
    case 'badge_earned':
      return <Award className="w-4 h-4" />;
    case 'community_reply':
    case 'new_chat_message':
      return <MessageSquare className="w-4 h-4" />;
    case 'ai_recommendation':
      return <Sparkles className="w-4 h-4" />;
    case 'payout_approved':
    case 'payout_rejected':
      return <Wallet className="w-4 h-4" />;
    case 'organizer_request':
    case 'organizer_approved':
    case 'organizer_rejected':
      return <Users className="w-4 h-4" />;
    default:
      return <Bell className="w-4 h-4" />;
  }
}

interface NotificationHubProps {
  role?: RoleAccent;
  title?: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  settingsTo?: string;
}

export default function NotificationHub({
  role = 'attendee',
  title = 'Notifications',
  subtitle = 'Stay on top of updates, reminders, and actionable alerts.',
  backTo,
  backLabel = 'Back',
  settingsTo,
}: NotificationHubProps) {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllRead,
    removeNotification,
    clearMyNotifications,
  } = useAppStore();

  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const accent = ROLE_STYLES[role];

  const mine = useMemo(
    () => (currentUser ? notifications.filter((n) => n.userId === currentUser.id) : []),
    [notifications, currentUser],
  );

  const filtered = useMemo(() => {
    setPage(1);
    return filterNotifications(mine, filter, search);
  }, [mine, filter, search]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;
  const unreadCount = mine.filter((n) => !n.isRead).length;
  const grouped = groupByDate(paginated);

  const handleMarkRead = (n: Notification) => {
    if (!n.isRead) markNotificationAsRead(n.id);
  };

  const handleDismiss = (id: string) => {
    removeNotification(id);
    demoToast('Dismissed', 'Notification removed from your inbox.');
  };

  const handleClearAll = () => {
    clearMyNotifications();
    demoToast('Inbox cleared', 'All your notifications have been removed.');
  };

  return (
    <div className="space-y-6">
      <div className="surface-panel px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            {backTo && (
              <Link to={backTo} className="btn-ghost inline-flex items-center gap-2 px-3 py-2 mt-0.5">
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>{backLabel}</span>
              </Link>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-h1 font-bold text-foreground">{title}</h1>
                {unreadCount > 0 && (
                  <span className={`status-pill text-white border-0 ${accent.unread}`}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-body-sm text-muted-foreground mt-1">{subtitle}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="btn-secondary inline-flex items-center gap-2 text-body-sm">
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
            {mine.length > 0 && (
              <button onClick={handleClearAll} className="btn-ghost inline-flex items-center gap-2 text-body-sm text-muted-foreground">
                <Trash2 className="w-4 h-4" />
                Clear all
              </button>
            )}
            {settingsTo && (
              <Link to={settingsTo} className="btn-secondary inline-flex items-center gap-2 text-body-sm">
                Settings
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-secondary/50 border border-border text-body-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <EmptyState
              icon={BellOff}
              title="No notifications"
              description={search ? 'Try a different search term.' : "You're all caught up."}
            />
          ) : (
            <div className="space-y-6">
              {grouped.map((group) => (
                <div key={group.label}>
                  <p className="text-micro font-bold text-muted-foreground uppercase tracking-widest mb-3">
                    {group.label}
                  </p>
                  <div className="space-y-3">
                    {group.items.map((n) => (
                      <div
                        key={n.id}
                        className={`card-surface p-4 transition-all ${!n.isRead ? 'ring-1 ring-primary/20' : ''}`}
                      >
                        <div className="flex gap-4">
                          <div className={`icon-box-primary flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${accent.chip}`}>
                            {getIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-bold text-foreground text-body-sm">{n.title}</p>
                                <p className="text-body-sm text-muted-foreground mt-1">{n.message}</p>
                              </div>
                              <span className="text-micro text-muted-foreground whitespace-nowrap">
                                {formatNotificationTime(n.timestamp)}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              {n.actionUrl && (
                                <Link
                                  to={n.actionUrl}
                                  onClick={() => handleMarkRead(n)}
                                  className="btn-primary text-micro px-3 py-1.5 h-auto inline-flex items-center gap-1"
                                >
                                  View <ChevronRight className="w-3 h-3" />
                                </Link>
                              )}
                              {!n.isRead && (
                                <button
                                  onClick={() => handleMarkRead(n)}
                                  className="btn-ghost text-micro px-3 py-1.5 h-auto"
                                >
                                  Mark read
                                </button>
                              )}
                              <button
                                onClick={() => handleDismiss(n.id)}
                                className="btn-ghost text-micro px-3 py-1.5 h-auto text-muted-foreground"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="btn-secondary w-full py-3 text-body-sm font-semibold"
                >
                  Load more ({filtered.length - paginated.length} remaining)
                </button>
              )}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="bento-section p-4 space-y-3">
            <p className="text-micro font-bold text-muted-foreground uppercase tracking-widest">Filter</p>
            {(['all', 'unread', 'actionable'] as NotificationFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-body-sm font-semibold capitalize transition-all ${
                  filter === f
                    ? `${accent.chip} border`
                    : 'text-muted-foreground hover:bg-secondary/50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="kpi-card p-4">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-micro font-bold uppercase tracking-widest">Inbox stats</span>
            </div>
            <p className="text-h3 font-bold text-foreground">{mine.length}</p>
            <p className="text-body-sm text-muted-foreground">Total notifications</p>
            <p className="text-body-sm text-muted-foreground mt-2">{unreadCount} unread</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
