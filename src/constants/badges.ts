import type { Badge } from '../types';

export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'badge-001',
    name: 'First Attendee',
    description: 'RSVP to your first event',
    icon: '🎫',
    tier: 'bronze',
    xpBonus: 50,
  },
  {
    id: 'badge-002',
    name: 'Event Explorer',
    description: 'Attend 5 events',
    icon: '🗺️',
    tier: 'silver',
    xpBonus: 100,
  },
  {
    id: 'badge-003',
    name: 'Community Builder',
    description: 'Join 3 discussions',
    icon: '💬',
    tier: 'bronze',
    xpBonus: 75,
  },
  {
    id: 'badge-004',
    name: 'Streak Master',
    description: 'Maintain a 7-day activity streak',
    icon: '🔥',
    tier: 'gold',
    xpBonus: 150,
  },
  {
    id: 'badge-005',
    name: 'Super Fan',
    description: 'Attend 10 events from the same organizer',
    icon: '⭐',
    tier: 'platinum',
    xpBonus: 200,
  },
  {
    id: 'badge-006',
    name: 'Early Bird',
    description: 'RSVP within 1 hour of an event being published',
    icon: '⏰',
    tier: 'bronze',
    xpBonus: 50,
  },
  {
    id: 'badge-007',
    name: 'Influencer',
    description: 'Share 5 events on social media',
    icon: '📢',
    tier: 'silver',
    xpBonus: 75,
  },
  {
    id: 'badge-008',
    name: 'Verified Attendee',
    description: 'Complete all profile fields',
    icon: '✅',
    tier: 'bronze',
    xpBonus: 25,
  },
];

export const getBadgeById = (id: string): Badge | undefined =>
  BADGE_DEFINITIONS.find((b) => b.id === id);
