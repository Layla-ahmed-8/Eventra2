import { Link } from 'react-router-dom';
import { Bell, Calendar, Award, MessageSquare, Users, Settings, CheckCheck, Trash2, Sparkles, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const typeConfig: Record<string, { icon: any; bg: string; color: string }> = {
  reminder:           { icon: Calendar,      bg: 'bg-blue-100 dark:bg-blue-900/30',    color: 'text-blue-600 dark:text-blue-400' },
  achievement:        { icon: Award,         bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400' },
  community:          { icon: MessageSquare, bg: 'bg-green-100 dark:bg-green-900/30',   color: 'text-green-600 dark:text-green-400' },
  event:              { icon: Calendar,      bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-400' },
  organizer_request:  { icon: Users,         bg: 'bg-cyan-100 dark:bg-cyan-900/30',     color: 'text-cyan-600 dark:text-cyan-400' },
  organizer_approved: { icon: Award,         bg: 'bg-green-100 dark:bg-green-900/30',   color: 'text-green-600 dark:text-green-400' },
  organizer_rejected: { icon: Bell,          bg: 'bg-red-100 dark:bg-red-900/30',       color: 'text-red-600 dark:text-red-400' },
  event_update:       { icon: Sparkles,      bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400' },
  xp_reward:          { icon: Zap,           bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-400' },
};

// Fallback static notifications for demo when store is empty
const fallbackNotifications = [
  { id: 'f1', type: 'reminder',    title: 'Event reminder',                    message: 'Cairo Jazz Night is tomorrow at 7:00 PM',          timestamp: new Date(Date.now() - 3600000).toISOString(),  isRead: false, actionUrl: '/app/events/event-001', icon: '📅' },
  { id: 'f2', type: 'achievement', title: 'Badge unlocked!',                   message: 'You earned the "Social Butterfly" badge',           timestamp: new Date(Date.now() - 10800000).toISOString(), isRead: false, actionUrl: '/app/profile/achievements', icon: '🏆' },
  { id: 'f3', type: 'community',   title: 'New discussion in Cairo Music Lovers', message: 'Sarah Ahmed started a new discussion',           timestamp: new Date(Date.now() - 18000000).toISOString(), isRead: true,  actionUrl: '/app/community/comm-001', icon: '💬' },
  { id: 'f4', type: 'event',       title: 'New event recommendation',          message: 'Street Food Festival matches your interests',       timestamp: new Date(Date.now() - 86400000).toISOString(), isRead: true,  actionUrl: '/app/events/event-005', icon: '✨' },
  { id: 'f5', type: 'community',   title: 'Community update',                  message: 'Tech Cairo Hub has a new event this week',          timestamp: new Date(Date.now() - 172800000).toISOString(), isRead: true, actionUrl: '/app/community/comm-002', icon: '👥' },
];

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Notifications() {
  const { notifications, markNotificationAsRead, currentUser } = useAppStore();

  const mine = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id)
    : notifications;
  const allNotifications = mine.length > 0 ? mine : fallbackNotifications;
  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-h2 font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-caption font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <Link to="/app/settings" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => allNotifications.forEach(n => !n.isRead && markNotificationAsRead(n.id))}
            className="flex items-center gap-2 text-body-sm text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
          <button className="flex items-center gap-2 text-body-sm text-muted-foreground hover:text-foreground font-semibold transition-colors">
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {allNotifications.map((notification) => {
            const config = typeConfig[notification.type] || typeConfig['event'];
            const Icon = config.icon;
            return (
              <Link
                key={notification.id}
                to={notification.actionUrl || '/app/discover'}
                onClick={() => markNotificationAsRead(notification.id)}
                className={`surface-panel p-4 flex gap-4 hover:-translate-y-0.5 transition-all block ${
                  !notification.isRead ? 'border-l-4 border-primary' : ''
                }`}
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${config.bg}`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-body-sm font-bold text-foreground">{notification.title}</h3>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-body-sm text-muted-foreground mb-1 line-clamp-2">{notification.message}</p>
                  <p className="text-caption text-muted-foreground/70">{timeAgo(notification.timestamp)}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {allNotifications.length === 0 && (
          <div className="surface-panel p-12 text-center">
            <Bell className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-h3 font-bold text-foreground mb-2">All caught up!</h3>
            <p className="text-body text-muted-foreground">No new notifications right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
