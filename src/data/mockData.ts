// Mock data for Eventra application

export const categories = [
  'Music', 'Tech', 'Sports', 'Art', 'Food & Drink', 'Business',
  'Health & Wellness', 'Gaming', 'Film', 'Fashion', 'Science', 'Community'
];

// Engagement UX types
export type UserBehaviorType = 'passive' | 'fomo' | 'community' | 'gamified';

export type MomentumLabel =
  | 'People are joining right now'
  | 'Growing community'
  | 'Active discussion'
  | 'Trending among tech enthusiasts'
  | 'Popular this weekend'
  | 'Early interest building'
  | 'Attendees from your communities'
  | 'Recently gaining traction'
  | 'Trending now'
  | 'Most discussed today'
  | 'High activity this evening';

export type AtmosphereLabel =
  | 'Small intimate event'
  | 'Limited group experience'
  | 'High-energy crowd expected'
  | 'Curated community event'
  | 'Private-style atmosphere'
  | 'Welcoming community'
  | 'Friendly for solo attendees';

export type VibeTag =
  | 'Creative crowd'
  | 'Networking-friendly'
  | 'Chill atmosphere'
  | 'High-energy'
  | 'Tech-forward'
  | 'Artistic vibes'
  | 'Foodie paradise'
  | 'Adventure seekers'
  | 'Music lovers'
  | 'Community builders';

export interface ActivitySignal {
  text: string;
  icon: string;
  timestamp: string; // relative like "2 min ago"
}

export interface SocialAttendee {
  avatar: string;
  name: string;
  interest?: string;
}

export interface EngagementData {
  momentumLabel: MomentumLabel;
  atmosphereLabel: AtmosphereLabel;
  vibeTags: VibeTag[];
  activitySignals: ActivitySignal[];
  recentAttendees: SocialAttendee[];
  sharedInterests: string[];
  discussionCount: number;
  bookmarkCount: number;
  reactionCount: number;
  xpReward: number; // XP earned for attending
  badgeUnlock?: string; // badge name if attending unlocks one
  identityLabel?: string; // "Tech Explorer", "Creative Insider" etc.
  aiMatchReason?: string; // "You may connect well with attendees interested in AI + startups"
  softActivityFeedback: string; // "New conversations happening"
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  endDate: string;
  location: {
    venue: string;
    address: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
    isVirtual: boolean;
    virtualLink: string | null;
  };
  organizer: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    followerCount: number;
  };
  price: number;
  ticketTypes: Array<{
    name: string;
    price: number;
    available: number;
  }>;
  capacity: number;
  rsvpCount: number;
  tags: string[];
  isRecommended: boolean;
  relevanceScore: number;
  communityId: string;
  attendees: any[];
  engagement: EngagementData;
}

export const mockEvents: Event[] = [
  {
    id: 'event-001',
    title: 'Cairo Jazz Night: Live at Sunset',
    description: 'Experience an unforgettable evening of smooth jazz under the Cairo sky. Featuring renowned local and international jazz musicians, this event promises a night of soulful melodies, improvisation, and rhythm. Enjoy craft cocktails and a curated menu while you immerse yourself in the timeless art of jazz.',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    category: 'Music',
    date: '2026-05-15T19:00:00Z',
    endDate: '2026-05-15T23:00:00Z',
    location: {
      venue: 'Cairo Jazz Club',
      address: '197 26th of July Corridor, Agouza',
      city: 'Cairo',
      country: 'EG',
      lat: 30.0626,
      lng: 31.2138,
      isVirtual: false,
      virtualLink: null
    },
    organizer: {
      id: 'org-001',
      name: 'Cairo Jazz Club',
      avatar: 'https://i.pravatar.cc/150?img=10',
      verified: true,
      followerCount: 12500
    },
    price: 150,
    ticketTypes: [
      { name: 'General Admission', price: 150, available: 80 },
      { name: 'VIP Table', price: 350, available: 12 }
    ],
    capacity: 200,
    rsvpCount: 142,
    tags: ['jazz', 'live-music', 'cocktails', 'nightlife'],
    isRecommended: true,
    relevanceScore: 0.95,
    communityId: 'comm-001',
    attendees: [],
    engagement: {
      momentumLabel: 'People are joining right now',
      atmosphereLabel: 'High-energy crowd expected',
      vibeTags: ['Music lovers', 'Chill atmosphere', 'Networking-friendly'],
      activitySignals: [
        { text: '5 people bookmarked in the last hour', icon: '🔖', timestamp: '1 hr ago' },
        { text: 'New discussion activity in Cairo Music Lovers', icon: '💬', timestamp: '20 min ago' },
        { text: 'Attendees are sharing their playlists', icon: '🎵', timestamp: '45 min ago' },
      ],
      recentAttendees: [
        { avatar: 'https://i.pravatar.cc/40?img=11', name: 'Nour', interest: 'Jazz' },
        { avatar: 'https://i.pravatar.cc/40?img=12', name: 'Karim', interest: 'Live Music' },
        { avatar: 'https://i.pravatar.cc/40?img=13', name: 'Dina', interest: 'Nightlife' },
        { avatar: 'https://i.pravatar.cc/40?img=14', name: 'Tarek', interest: 'Music' },
        { avatar: 'https://i.pravatar.cc/40?img=15', name: 'Salma', interest: 'Jazz' },
      ],
      sharedInterests: ['Jazz', 'Live Music', 'Cocktails', 'Nightlife'],
      discussionCount: 24,
      bookmarkCount: 38,
      reactionCount: 91,
      xpReward: 120,
      badgeUnlock: 'Music Lover',
      identityLabel: 'Music Lover',
      aiMatchReason: 'You may connect well with attendees who love jazz and live music experiences',
      softActivityFeedback: 'People are planning their evening together',
    }
  },
  {
    id: 'event-002',
    title: 'AI & Machine Learning Summit 2026',
    description: 'Join industry leaders, researchers, and developers for a full-day conference on the latest developments in AI and ML. Featuring keynote speakers from top tech companies, hands-on workshops, and networking opportunities.',
    image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800',
    category: 'Tech',
    date: '2026-05-20T09:00:00Z',
    endDate: '2026-05-20T18:00:00Z',
    location: {
      venue: 'Nile Ritz-Carlton',
      address: 'Corniche El Nil, Tahrir Square',
      city: 'Cairo',
      country: 'EG',
      lat: 30.0444,
      lng: 31.2357,
      isVirtual: false,
      virtualLink: null
    },
    organizer: {
      id: 'org-002',
      name: 'Tech Cairo',
      avatar: 'https://i.pravatar.cc/150?img=20',
      verified: true,
      followerCount: 8900
    },
    price: 0,
    ticketTypes: [{ name: 'Free Admission', price: 0, available: 200 }],
    capacity: 500,
    rsvpCount: 387,
    tags: ['ai', 'machine-learning', 'tech', 'conference'],
    isRecommended: true,
    relevanceScore: 0.92,
    communityId: 'comm-002',
    attendees: [],
    engagement: {
      momentumLabel: 'Trending among tech enthusiasts',
      atmosphereLabel: 'High-energy crowd expected',
      vibeTags: ['Tech-forward', 'Networking-friendly', 'Community builders'],
      activitySignals: [
        { text: 'People from Cairo Tech Hub joined recently', icon: '🚀', timestamp: '30 min ago' },
        { text: 'Active discussion: "What to expect from the keynote"', icon: '💬', timestamp: '15 min ago' },
        { text: '12 people bookmarked this week', icon: '🔖', timestamp: '2 hrs ago' },
      ],
      recentAttendees: [
        { avatar: 'https://i.pravatar.cc/40?img=21', name: 'Omar', interest: 'AI' },
        { avatar: 'https://i.pravatar.cc/40?img=22', name: 'Hana', interest: 'ML' },
        { avatar: 'https://i.pravatar.cc/40?img=23', name: 'Youssef', interest: 'Startups' },
        { avatar: 'https://i.pravatar.cc/40?img=24', name: 'Rana', interest: 'Tech' },
        { avatar: 'https://i.pravatar.cc/40?img=25', name: 'Adel', interest: 'AI' },
      ],
      sharedInterests: ['AI', 'Machine Learning', 'Startups', 'Tech'],
      discussionCount: 67,
      bookmarkCount: 112,
      reactionCount: 203,
      xpReward: 200,
      badgeUnlock: 'Tech Explorer',
      identityLabel: 'Tech Explorer',
      aiMatchReason: 'You may connect well with attendees interested in AI + startups',
      softActivityFeedback: 'Community members are actively preparing for this summit',
    }
  },
  {
    id: 'event-003',
    title: 'Weekend Hiking Adventure: Wadi Degla',
    description: 'Escape the city and explore the natural beauty of Wadi Degla Protected Area. This guided hiking tour covers 8km of scenic trails through the canyon.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    category: 'Sports',
    date: '2026-05-10T07:00:00Z',
    endDate: '2026-05-10T12:00:00Z',
    location: {
      venue: 'Wadi Degla Protected Area',
      address: 'Ring Road, Maadi',
      city: 'Cairo',
      country: 'EG',
      lat: 29.9511,
      lng: 31.3197,
      isVirtual: false,
      virtualLink: null
    },
    organizer: {
      id: 'org-003',
      name: 'Cairo Hikers',
      avatar: 'https://i.pravatar.cc/150?img=30',
      verified: false,
      followerCount: 2400
    },
    price: 50,
    ticketTypes: [{ name: 'Hiker Pass', price: 50, available: 25 }],
    capacity: 30,
    rsvpCount: 28,
    tags: ['hiking', 'outdoor', 'nature', 'fitness'],
    isRecommended: false,
    relevanceScore: 0.78,
    communityId: 'comm-003',
    attendees: [],
    engagement: {
      momentumLabel: 'Early interest building',
      atmosphereLabel: 'Small intimate event',
      vibeTags: ['Adventure seekers', 'Chill atmosphere', 'Friendly for solo attendees'],
      activitySignals: [
        { text: 'Attendees are sharing trail tips', icon: '🥾', timestamp: '1 hr ago' },
        { text: 'Recent RSVP activity', icon: '✅', timestamp: '3 hrs ago' },
        { text: 'Attendees are introducing themselves', icon: '👋', timestamp: '2 hrs ago' },
      ],
      recentAttendees: [
        { avatar: 'https://i.pravatar.cc/40?img=31', name: 'Mona', interest: 'Hiking' },
        { avatar: 'https://i.pravatar.cc/40?img=32', name: 'Sami', interest: 'Outdoors' },
        { avatar: 'https://i.pravatar.cc/40?img=33', name: 'Lina', interest: 'Fitness' },
      ],
      sharedInterests: ['Hiking', 'Outdoor', 'Nature', 'Fitness'],
      discussionCount: 8,
      bookmarkCount: 14,
      reactionCount: 22,
      xpReward: 80,
      identityLabel: 'Adventure Seeker',
      aiMatchReason: 'Great for meeting active outdoor enthusiasts in Cairo',
      softActivityFeedback: 'People are planning their gear and carpools',
    }
  },
  {
    id: 'event-004',
    title: 'Contemporary Art Exhibition: Voices of the Nile',
    description: 'A curated exhibition featuring 30+ contemporary Egyptian artists exploring themes of identity, heritage, and modernity.',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
    category: 'Art',
    date: '2026-05-12T18:00:00Z',
    endDate: '2026-05-12T22:00:00Z',
    location: {
      venue: 'Townhouse Gallery',
      address: '10 Nabrawy St, Downtown',
      city: 'Cairo',
      country: 'EG',
      lat: 30.0489,
      lng: 31.2421,
      isVirtual: false,
      virtualLink: null
    },
    organizer: {
      id: 'org-004',
      name: 'Townhouse Gallery',
      avatar: 'https://i.pravatar.cc/150?img=40',
      verified: true,
      followerCount: 6700
    },
    price: 0,
    ticketTypes: [{ name: 'Free Entry', price: 0, available: 150 }],
    capacity: 150,
    rsvpCount: 89,
    tags: ['art', 'exhibition', 'contemporary', 'culture'],
    isRecommended: true,
    relevanceScore: 0.85,
    communityId: 'comm-004',
    attendees: [],
    engagement: {
      momentumLabel: 'Growing community',
      atmosphereLabel: 'Curated community event',
      vibeTags: ['Artistic vibes', 'Creative crowd', 'Chill atmosphere'],
      activitySignals: [
        { text: 'Artists are sharing previews in the community', icon: '🎨', timestamp: '40 min ago' },
        { text: '7 people bookmarked recently', icon: '🔖', timestamp: '1 hr ago' },
        { text: 'New discussion: "Favourite piece from the preview"', icon: '💬', timestamp: '25 min ago' },
      ],
      recentAttendees: [
        { avatar: 'https://i.pravatar.cc/40?img=41', name: 'Farida', interest: 'Art' },
        { avatar: 'https://i.pravatar.cc/40?img=42', name: 'Ziad', interest: 'Culture' },
        { avatar: 'https://i.pravatar.cc/40?img=43', name: 'Heba', interest: 'Contemporary Art' },
        { avatar: 'https://i.pravatar.cc/40?img=44', name: 'Ramy', interest: 'Photography' },
      ],
      sharedInterests: ['Art', 'Culture', 'Contemporary', 'Photography'],
      discussionCount: 19,
      bookmarkCount: 31,
      reactionCount: 58,
      xpReward: 100,
      badgeUnlock: 'Creative Insider',
      identityLabel: 'Creative Insider',
      aiMatchReason: 'Great for meeting creative professionals and art enthusiasts',
      softActivityFeedback: 'Attendees are sharing their favourite artists',
    }
  },
  {
    id: 'event-005',
    title: 'Street Food Festival: Flavors of Cairo',
    description: 'Celebrate Cairo\'s vibrant street food culture with over 40 vendors serving traditional and modern Egyptian cuisine.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    category: 'Food & Drink',
    date: '2026-05-18T16:00:00Z',
    endDate: '2026-05-18T23:00:00Z',
    location: {
      venue: 'Al-Azhar Park',
      address: 'Salah Salem St, Al Darb Al Ahmar',
      city: 'Cairo',
      country: 'EG',
      lat: 30.0333,
      lng: 31.2627,
      isVirtual: false,
      virtualLink: null
    },
    organizer: {
      id: 'org-005',
      name: 'Cairo Food Collective',
      avatar: 'https://i.pravatar.cc/150?img=50',
      verified: true,
      followerCount: 15200
    },
    price: 75,
    ticketTypes: [
      { name: 'General Entry', price: 75, available: 500 },
      { name: 'VIP Tasting Pass', price: 200, available: 50 }
    ],
    capacity: 1000,
    rsvpCount: 654,
    tags: ['food', 'festival', 'street-food', 'egyptian-cuisine'],
    isRecommended: true,
    relevanceScore: 0.88,
    communityId: 'comm-005',
    attendees: [],
    engagement: {
      momentumLabel: 'Popular this weekend',
      atmosphereLabel: 'High-energy crowd expected',
      vibeTags: ['Foodie paradise', 'Community builders', 'High-energy'],
      activitySignals: [
        { text: 'Vendors are posting sneak peeks', icon: '🍜', timestamp: '30 min ago' },
        { text: 'People from your communities joined', icon: '👥', timestamp: '1 hr ago' },
        { text: '20+ bookmarks in the last 24 hours', icon: '🔖', timestamp: '24 hrs ago' },
      ],
      recentAttendees: [
        { avatar: 'https://i.pravatar.cc/40?img=51', name: 'Amira', interest: 'Food' },
        { avatar: 'https://i.pravatar.cc/40?img=52', name: 'Hassan', interest: 'Street Food' },
        { avatar: 'https://i.pravatar.cc/40?img=53', name: 'Nadia', interest: 'Festivals' },
        { avatar: 'https://i.pravatar.cc/40?img=54', name: 'Khaled', interest: 'Egyptian Cuisine' },
        { avatar: 'https://i.pravatar.cc/40?img=55', name: 'Iman', interest: 'Food' },
      ],
      sharedInterests: ['Food', 'Street Food', 'Festivals', 'Egyptian Cuisine'],
      discussionCount: 45,
      bookmarkCount: 89,
      reactionCount: 176,
      xpReward: 150,
      badgeUnlock: 'Community Builder',
      identityLabel: 'Foodie Explorer',
      aiMatchReason: 'This matches your interest in food culture and community events',
      softActivityFeedback: 'People are planning their food routes together',
    }
  }
];

export const mockContacts = [
  { id: 'c1', name: 'Ahmed Hassan', avatar: 'https://i.pravatar.cc/40?img=1', phone: '+201001234567' },
  { id: 'c2', name: 'Sara El-Sayed', avatar: 'https://i.pravatar.cc/40?img=2', phone: '+201112345678' },
  { id: 'c3', name: 'Mohamed Ali', avatar: 'https://i.pravatar.cc/40?img=3', phone: '+201234567890' },
  { id: 'c4', name: 'Nour Ibrahim', avatar: 'https://i.pravatar.cc/40?img=4', phone: '+201098765432' },
  { id: 'c5', name: 'Yasmine Khaled', avatar: 'https://i.pravatar.cc/40?img=5', phone: '+201187654321' },
  { id: 'c6', name: 'Omar Farouk', avatar: 'https://i.pravatar.cc/40?img=6', phone: '+201065432198' },
  { id: 'c7', name: 'Layla Mostafa', avatar: 'https://i.pravatar.cc/40?img=7', phone: '+201176543210' },
  { id: 'c8', name: 'Karim Adel', avatar: 'https://i.pravatar.cc/40?img=8', phone: '+201243215678' },
];

export const mockBookings = [
  {
    id: 'booking-001',
    eventId: 'event-001',
    userId: 'user-001',
    tickets: [{ type: 'General Admission', qty: 2, unitPrice: 150, subtotal: 300 }],
    serviceFee: 9,
    discount: 0,
    total: 309,
    currency: 'EGP',
    paymentMethod: { brand: 'Visa', last4: '4242' },
    status: 'confirmed',
    qrData: { bookingId: 'EVT-2026-001234', userId: 'user-001', eventId: 'event-001', valid: true },
    bookingRef: 'EVT-2026-001234',
    createdAt: '2026-05-01T10:30:00Z',
  },
  {
    id: 'booking-002',
    eventId: 'event-002',
    userId: 'user-001',
    tickets: [{ type: 'Free Admission', qty: 1, unitPrice: 0, subtotal: 0 }],
    serviceFee: 0,
    discount: 0,
    total: 0,
    currency: 'EGP',
    paymentMethod: null,
    status: 'confirmed',
    qrData: { bookingId: 'EVT-2026-002456', userId: 'user-001', eventId: 'event-002', valid: true },
    bookingRef: 'EVT-2026-002456',
    createdAt: '2026-04-28T14:20:00Z',
  }
];

export const mockCommunities = [
  {
    id: 'comm-001',
    name: 'Cairo Music Lovers',
    description: 'For everyone who loves live music, from jazz to rock to electronic.',
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200',
    category: 'Music',
    memberCount: 12500,
    eventCount: 45,
    isJoined: true,
    threads: []
  },
  {
    id: 'comm-002',
    name: 'Tech Cairo Hub',
    description: 'Community for developers, designers, and tech entrepreneurs.',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
    category: 'Tech',
    memberCount: 8900,
    eventCount: 38,
    isJoined: true,
    threads: []
  }
];

export const mockCurrentUser = {
  id: 'user-001',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  avatar: 'https://i.pravatar.cc/150?img=33',
  role: 'attendee' as const,
  interests: ['Music', 'Tech', 'Food & Drink'],
  location: 'Cairo, Egypt',
  radius: 15,
  joinDate: '2025-12-15T00:00:00Z',
  level: 12,
  xp: 2340,
  badges: [],
  rsvpedEvents: ['event-001', 'event-002', 'event-005'],
  bookmarkedEvents: ['event-004']
};
