import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Award, MessageSquare, Users, Settings } from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    type: 'reminder',
    icon: Calendar,
    title: 'Event reminder',
    message: 'Cairo Jazz Night is tomorrow at 7:00 PM',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 2,
    type: 'achievement',
    icon: Award,
    title: 'Badge unlocked!',
    message: 'You earned the "Social Butterfly" badge',
    time: '3 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'community',
    icon: MessageSquare,
    title: 'New discussion in Cairo Music Lovers',
    message: 'Sarah Ahmed started a new discussion',
    time: '5 hours ago',
    read: true,
  },
  {
    id: 4,
    type: 'event',
    icon: Calendar,
    title: 'New event recommendation',
    message: 'Street Food Festival matches your interests',
    time: '1 day ago',
    read: true,
  },
  {
    id: 5,
    type: 'community',
    icon: Users,
    title: 'Community update',
    message: 'Tech Cairo Hub has a new event',
    time: '2 days ago',
    read: true,
  },
];

export default function Notifications() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/app/discover" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <Link to="/app/settings/notifications" className="p-2 hover:bg-secondary rounded-lg">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Actions */}
        <div className="flex items-center justify-between mb-6">
          <button className="text-primary hover:text-primary/80 font-semibold">
            Mark all as read
          </button>
          <button className="text-muted-foreground hover:text-foreground font-semibold">
            Clear all
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {mockNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`bg-card border border-border rounded-2xl shadow-lg p-4 hover:shadow-2xl hover-lift transition-all ${
                  !notification.read ? 'border-l-4 border-primary' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      notification.type === 'reminder'
                        ? 'bg-blue-100'
                        : notification.type === 'achievement'
                        ? 'bg-purple-100'
                        : notification.type === 'community'
                        ? 'bg-green-100'
                        : 'bg-orange-100'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        notification.type === 'reminder'
                          ? 'text-blue-600'
                          : notification.type === 'achievement'
                          ? 'text-purple-600'
                          : notification.type === 'community'
                          ? 'text-green-600'
                          : 'text-orange-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-foreground">{notification.title}</h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#6C4CF1] rounded-full"></div>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-1">{notification.message}</p>
                    <p className="text-sm text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {mockNotifications.length === 0 && (
          <div className="bg-card border border-border rounded-2xl shadow-lg p-12 text-center">
            <Bell className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No notifications</h3>
            <p className="text-muted-foreground">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
