import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, BellOff, CheckCheck, Calendar, Wallet, MessageSquare, Ticket, Filter } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatRelativeTime } from '../../lib/utils';

type FilterType = 'all' | 'bookings' | 'events' | 'wallet' | 'messages';

const FILTER_TABS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Bookings', value: 'bookings' },
  { label: 'Events', value: 'events' },
  { label: 'Wallet', value: 'wallet' },
  { label: 'Messages', value: 'messages' },
];

const notifTypeToFilter = (type: string): FilterType => {
  if (type === 'new_booking' || type === 'rsvp_confirmed') return 'bookings';
  if (type === 'event_approved' || type === 'event_rejected' || type === 'event_update') return 'events';
  if (type === 'payout_approved' || type === 'payout_rejected') return 'wallet';
  if (type === 'new_chat_message') return 'messages';
  return 'all';
};

const typeIcon: Record<string, React.ReactNode> = {
  new_booking:     <Ticket className="w-5 h-5" />,
  rsvp_confirmed:  <Ticket className="w-5 h-5" />,
  event_approved:  <Calendar className="w-5 h-5" />,
  event_rejected:  <Calendar className="w-5 h-5" />,
  event_update:    <Calendar className="w-5 h-5" />,
  payout_approved: <Wallet className="w-5 h-5" />,
  payout_rejected: <Wallet className="w-5 h-5" />,
  new_chat_message: <MessageSquare className="w-5 h-5" />,
};

const typeColor: Record<string, string> = {
  new_booking:     'icon-box-primary',
  rsvp_confirmed:  'icon-box-primary',
  event_approved:  'icon-box-green',
  event_rejected:  'icon-box-red',
  event_update:    'icon-box-orange',
  payout_approved: 'icon-box-cyan',
  payout_rejected: 'icon-box-red',
  new_chat_message:'icon-box-primary',
};

export default function OrganizerNotifications() {
  const { notifications, currentUser, markNotificationAsRead, markAllRead } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const myNotifs = notifications.filter((n) => n.userId === currentUser?.id);
  const filtered = myNotifs.filter((n) =>
    activeFilter === 'all' || notifTypeToFilter(n.type) === activeFilter
  );

  const unread = myNotifs.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-h1 font-bold text-foreground">Notifications</h1>
          <p className="text-body text-muted-foreground mt-1">
            {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="btn-secondary flex items-center gap-2 text-body-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <Filter className="w-4 h-4 text-muted-foreground self-center" />
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`filter-chip ${activeFilter === tab.value ? 'active' : ''}`}
          >
            {tab.label}
            {tab.value !== 'all' && (
              <span className="ml-1.5 text-micro">
                ({myNotifs.filter((n) => notifTypeToFilter(n.type) === tab.value).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="surface-panel p-16 text-center rounded-2xl">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <BellOff className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-body font-semibold text-foreground">No notifications</p>
          <p className="text-body-sm text-muted-foreground mt-1">
            {activeFilter === 'all'
              ? "You're all caught up. Notifications will appear here."
              : `No ${activeFilter} notifications yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((notif) => (
            <div
              key={notif.id}
              className={`surface-panel p-4 rounded-2xl flex items-start gap-4 transition-all hover:shadow-md cursor-pointer ${
                !notif.isRead ? 'ring-1 ring-primary/20 bg-primary/5' : ''
              }`}
              onClick={() => markNotificationAsRead(notif.id)}
            >
              {/* Icon */}
              <div className={`icon-box ${typeColor[notif.type] ?? 'icon-box-primary'} flex-shrink-0`}>
                {typeIcon[notif.type] ?? <Bell className="w-5 h-5" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-body-sm font-bold ${!notif.isRead ? 'text-foreground' : 'text-foreground/80'}`}>
                    {notif.title}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                    <span className="text-caption text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(notif.timestamp)}
                    </span>
                  </div>
                </div>
                <p className="text-caption text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                {notif.actionUrl && (
                  <Link
                    to={notif.actionUrl}
                    className="inline-block mt-2 text-caption font-bold text-cyan-500 hover:text-cyan-400 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
