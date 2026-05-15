import { useState } from 'react';
import { Link } from 'react-router-dom';

import { demoToast } from '../../lib/demoFeedback';
import { Bell, Calendar, Award, MessageSquare, Users, Settings, CheckCheck, Trash2, Sparkles, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

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

  const { notifications, markNotificationAsRead, currentUser, clearMyNotifications } = useAppStore();
  const [clearedLocal, setClearedLocal] = useState(false);

  const mine = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id)
    : notifications;
  const allNotifications = clearedLocal ? [] : mine.length > 0 ? mine : fallbackNotifications;
  const unreadCount = allNotifications.filter((n) => !n.isRead).length;

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

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="bento-title">Recent Updates</h2>
            </div>
            <button
              onClick={() => demoToast('Cleared', 'All notifications marked as read.')}
              className="text-caption font-bold text-primary hover:underline"
            >
              Mark all as read
            </button>
          </div>

          <div className="space-y-3">
            {allNotifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                  <Bell className="w-8 h-8" />
                </div>
                <p className="text-body-sm text-muted-foreground">No notifications yet.</p>
              </div>
            ) : (
              allNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`activity-item ${n.isRead ? 'opacity-60 grayscale-[0.5]' : 'border-primary/20 bg-primary/5'}`}
                >
                  <div className="activity-icon-wrapper scale-90">
                    {n.type === 'booking' && <Zap className="w-4 h-4 text-green-500" />}
                    {n.type === 'community' && <Users className="w-4 h-4 text-primary" />}
                    {n.type === 'system' && <Zap className="w-4 h-4 text-orange-500" />}
                    {n.type === 'social' && <Sparkles className="w-4 h-4 text-pink-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-body-sm font-bold text-foreground truncate">{n.title}</p>
                      <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-caption text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                  {!n.isRead && (
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          {allNotifications.length > 0 && (
            <button className="w-full mt-6 py-3 text-caption font-bold text-muted-foreground hover:text-foreground transition-colors border-t border-border/50">
              View older notifications
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

