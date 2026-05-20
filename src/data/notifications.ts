// Notifications for different user accounts

export interface Notification {
  id: string;
  userId: string;
  type: 'event_reminder' | 'rsvp_confirmed' | 'badge_earned' | 'community_reply' | 'ai_recommendation' | 'organizer_request' | 'organizer_approved' | 'organizer_rejected' | 'event_update';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  icon?: string;
  aiGenerated?: boolean;
}

export const sarahNotifications: Notification[] = [
  {
    id: 'notif-001',
    userId: 'user-001',
    type: 'ai_recommendation',
    title: 'New Events Match Your Interests',
    message: 'We found 3 new music events you might love! Electronic Music Night is 95% match.',
    timestamp: '2026-05-06T09:00:00Z',
    isRead: false,
    actionUrl: '/app/discover',
    icon: '✨',
    aiGenerated: true
  },
  {
    id: 'notif-002',
    userId: 'user-001',
    type: 'event_reminder',
    title: 'Event Tomorrow: Cairo Jazz Night',
    message: 'Your event starts tomorrow at 7:00 PM. Get ready to enjoy live jazz music!',
    timestamp: '2026-05-14T10:00:00Z',
    isRead: false,
    actionUrl: '/app/events/event-001',
    icon: '🎵'
  },
  {
    id: 'notif-003',
    userId: 'user-001',
    type: 'badge_earned',
    title: 'New Badge Unlocked!',
    message: 'Congratulations! You earned the "Music Lover" badge for attending 5 music events.',
    timestamp: '2026-05-05T18:30:00Z',
    isRead: true,
    actionUrl: '/app/profile/achievements',
    icon: '🏆'
  },
  {
    id: 'notif-004',
    userId: 'user-001',
    type: 'community_reply',
    title: 'New Reply in Cairo Music Lovers',
    message: 'Ahmed replied to your post about jazz recommendations.',
    timestamp: '2026-05-05T14:20:00Z',
    isRead: true,
    actionUrl: '/app/community/comm-001',
    icon: '💬'
  }
];

export const ahmedNotifications: Notification[] = [
  {
    id: 'notif-101',
    userId: 'user-002',
    type: 'ai_recommendation',
    title: 'AI Insight: Boost Your Event Attendance',
    message: 'Your AI & ML Summit could get 40% more registrations if you send reminder emails this week.',
    timestamp: '2026-05-06T08:00:00Z',
    isRead: false,
    actionUrl: '/organizer/events/event-002/manage',
    icon: '🤖',
    aiGenerated: true
  },
  {
    id: 'notif-102',
    userId: 'user-002',
    type: 'rsvp_confirmed',
    title: '50 New RSVPs Today!',
    message: 'AI & Machine Learning Summit 2026 just hit 400 attendees. Great momentum!',
    timestamp: '2026-05-06T16:30:00Z',
    isRead: false,
    actionUrl: '/organizer/events/event-002/manage',
    icon: '🎉'
  },
  {
    id: 'notif-103',
    userId: 'user-002',
    type: 'ai_recommendation',
    title: 'Perfect Time to Create New Event',
    message: 'AI analysis shows high demand for "Web3 Development" events in your network. Create one now?',
    timestamp: '2026-05-05T11:00:00Z',
    isRead: true,
    actionUrl: '/organizer/events/create',
    icon: '💡',
    aiGenerated: true
  }
];

export const laylaNotifications: Notification[] = [
  {
    id: 'notif-201',
    userId: 'user-003',
    type: 'organizer_request',
    title: 'New Organizer Request',
    message: 'Mohamed Ali requested organizer status for "Weekend Hiking Adventure". Review now.',
    timestamp: '2026-05-04T10:35:00Z',
    isRead: false,
    actionUrl: '/admin/users',
    icon: '👤'
  },
  {
    id: 'notif-202',
    userId: 'user-003',
    type: 'event_update',
    title: 'Event Flagged for Review',
    message: 'Community reported "Crypto Investment Workshop" for potential scam. Needs moderation.',
    timestamp: '2026-05-05T09:15:00Z',
    isRead: false,
    actionUrl: '/admin/events',
    icon: '⚠️'
  },
  {
    id: 'notif-203',
    userId: 'user-003',
    type: 'ai_recommendation',
    title: 'AI Platform Health Alert',
    message: 'User engagement dropped 8% this week. AI suggests promoting trending categories.',
    timestamp: '2026-05-06T07:00:00Z',
    isRead: true,
    actionUrl: '/admin/analytics',
    icon: '📊',
    aiGenerated: true
  }
];

export const getNotificationsForUser = (userId: string): Notification[] => {
  switch (userId) {
    case 'user-001': return sarahNotifications;
    case 'user-002': return ahmedNotifications;
    case 'user-003': return laylaNotifications;
    default: return [];
  }
};
