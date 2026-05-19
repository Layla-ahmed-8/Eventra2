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
  | 'Community builders'
  | 'Friendly for solo attendees';

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

export interface ScheduleItem {
  time: string;
  title: string;
  desc: string;
  active?: boolean;
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
    venue: string | null;
    address: string | null;
    city: string | null;
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
  schedule?: ScheduleItem[];
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
    },
    schedule: [
      { time: '7:00 PM', title: 'Doors Open', desc: 'Pre-show drinks and seating', active: true },
      { time: '8:00 PM', title: 'Opening Act', desc: 'Acoustic jazz set by The Trio' },
      { time: '9:30 PM', title: 'Main Performance', desc: 'The Cairo Jazz Collective' },
      { time: '11:00 PM', title: 'Late Night Social', desc: 'DJ set and networking' }
    ]
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
    },
    schedule: [
      { time: '9:00 AM', title: 'Registration', desc: 'Welcome coffee and badges', active: true },
      { time: '10:00 AM', title: 'Keynote', desc: 'The Future of Generative AI' },
      { time: '11:30 AM', title: 'Panel Discussion', desc: 'AI in the Middle East' },
      { time: '1:00 PM', title: 'Lunch Break', desc: 'Networking lunch' },
      { time: '2:30 PM', title: 'Workshops', desc: 'Hands-on ML sessions' }
    ]
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
    id: 'event-011',
    title: 'Virtual UX Design Masterclass',
    description: 'A live online masterclass covering advanced UX research methods, prototyping in Figma, and design systems. Includes Q&A with senior designers from top Cairo tech companies.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    category: 'Tech',
    date: '2026-06-05T18:00:00Z',
    endDate: '2026-06-05T21:00:00Z',
    location: {
      venue: null,
      address: null,
      city: null,
      country: 'EG',
      lat: 0,
      lng: 0,
      isVirtual: true,
      virtualLink: 'https://zoom.us/j/example-ux-masterclass',
    },
    organizer: {
      id: 'org-002',
      name: 'Tech Cairo',
      avatar: 'https://i.pravatar.cc/150?img=20',
      verified: true,
      followerCount: 8900,
    },
    price: 0,
    ticketTypes: [{ name: 'Free Registration', price: 0, available: 500 }],
    capacity: 500,
    rsvpCount: 312,
    tags: ['ux', 'design', 'figma', 'virtual', 'masterclass'],
    isRecommended: true,
    relevanceScore: 0.86,
    communityId: 'comm-002',
    attendees: [],
    engagement: {
      momentumLabel: 'Trending among tech enthusiasts',
      atmosphereLabel: 'High-energy crowd expected',
      vibeTags: ['Tech-forward', 'Networking-friendly', 'Creative crowd'],
      activitySignals: [
        { text: 'Designers from 5 companies registered', icon: '🎨', timestamp: '1 hr ago' },
        { text: 'Pre-event resources shared in community', icon: '📚', timestamp: '3 hrs ago' },
      ],
      recentAttendees: [
        { avatar: 'https://i.pravatar.cc/40?img=21', name: 'Omar', interest: 'UX' },
        { avatar: 'https://i.pravatar.cc/40?img=22', name: 'Hana', interest: 'Design' },
      ],
      sharedInterests: ['UX', 'Design', 'Figma', 'Tech'],
      discussionCount: 42,
      bookmarkCount: 85,
      reactionCount: 156,
      xpReward: 150,
      identityLabel: 'Design Specialist',
      aiMatchReason: 'Advanced design masterclass matching your professional interests',
      softActivityFeedback: 'Designers are sharing their portfolios',
    },
    schedule: [
      { time: '6:00 PM', title: 'Welcome & Intro', desc: 'Overview of the masterclass', active: true },
      { time: '6:30 PM', title: 'Advanced Research', desc: 'Quantitative vs Qualitative' },
      { time: '7:30 PM', title: 'Prototyping Workshop', desc: 'Figma best practices' },
      { time: '8:30 PM', title: 'Q&A Panel', desc: 'Meet the industry experts' }
    ]
  },
  {
    id: 'event-012',
    title: 'LIVE: Global Product Design Workshop',
    description: 'JOINING NOW: A live, interactive workshop on modern product design systems. This event is currently active. You can join the session, participate in live polls, and chat with designers worldwide.',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800',
    category: 'Tech',
    date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    location: {
      venue: 'Eventra Virtual Stage',
      address: 'Online',
      city: 'Global',
      country: 'Virtual',
      lat: 0,
      lng: 0,
      isVirtual: true,
      virtualLink: 'https://meet.google.com/abc-defg-hij',
    },
    organizer: {
      id: 'org-002',
      name: 'Tech Cairo',
      avatar: 'https://i.pravatar.cc/150?img=20',
      verified: true,
      followerCount: 8900,
    },
    price: 0,
    ticketTypes: [{ name: 'Live Pass', price: 0, available: 50 }],
    capacity: 500,
    rsvpCount: 428,
    tags: ['live', 'design', 'workshop', 'virtual'],
    isRecommended: true,
    relevanceScore: 0.98,
    communityId: 'comm-002',
    attendees: [],
    engagement: {
      momentumLabel: 'Trending now',
      atmosphereLabel: 'High-energy crowd expected',
      vibeTags: ['Tech-forward', 'Networking-friendly', 'Creative crowd'],
      activitySignals: [
        { text: '150+ people are currently in the room', icon: '🔴', timestamp: 'Just now' },
        { text: 'Live chat is highly active', icon: '💬', timestamp: '2 min ago' },
      ],
      recentAttendees: [
        { avatar: 'https://i.pravatar.cc/40?img=21', name: 'Omar', interest: 'UX' },
        { avatar: 'https://i.pravatar.cc/40?img=22', name: 'Hana', interest: 'Design' },
      ],
      sharedInterests: ['UX', 'Design', 'Figma', 'Tech'],
      discussionCount: 156,
      bookmarkCount: 230,
      reactionCount: 842,
      xpReward: 250,
      identityLabel: 'Live Participant',
      aiMatchReason: 'This event is happening right now and matches your design interests!',
      softActivityFeedback: 'The workshop is currently in the breakout session phase',
    },
    schedule: [
      { time: 'Happening Now', title: 'Live Workshop', desc: 'Interactive design session', active: true },
      { time: 'In 30 Mins', title: 'Q&A Session', desc: 'Direct chat with mentors' },
      { time: 'In 1 Hour', title: 'Closing Remarks', desc: 'Summary and resources' }
    ]
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
    qrData: { bookingId: 'EVT-2026-001235', userId: 'user-001', eventId: 'event-002', valid: true },
    bookingRef: 'EVT-2026-001235',
    createdAt: '2026-05-05T14:20:00Z',
  }
];

export const mockCommunities = [
  {
    id: 'comm-001',
    name: 'Cairo Music Lovers',
    description: 'A community for those who live and breathe music in Cairo. From jazz to electronic, we share the best venues and upcoming gigs.',
    category: 'Music',
    memberCount: 1250,
    eventCount: 8,
    image: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a7?w=800',
    coverImage: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a7?w=1200',
    isJoined: true,
  },
  {
    id: 'comm-002',
    name: 'Tech Cairo Hub',
    description: 'Connecting developers, founders, and tech enthusiasts. We discuss AI, startups, and the growing tech scene in Egypt.',
    category: 'Tech',
    memberCount: 3400,
    eventCount: 12,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
    isJoined: true,
  },
  {
    id: 'comm-003',
    name: 'Outdoor Adventurers',
    description: 'For those who prefer the desert trails and mountain peaks. Weekly hiking, camping, and climbing trips around Cairo.',
    category: 'Sports',
    memberCount: 890,
    eventCount: 4,
    image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800',
    coverImage: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=1200',
    isJoined: false,
  }
];
