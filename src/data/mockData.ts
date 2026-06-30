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

export interface EventScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  endDate: string;
  schedule?: EventScheduleItem[];
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
    schedule: [
      { time: '7:00 PM', title: 'Doors Open & Welcome Drinks', description: 'Arrive early for a welcome cocktail and settle in before the first set.' },
      { time: '7:30 PM', title: 'Opening Jazz Set', description: 'Local ensemble opens with soulful standards and original grooves.' },
      { time: '8:30 PM', title: 'Headline Performance', description: 'International headliner takes the stage for the main set.' },
      { time: '10:00 PM', title: 'Late-Night Jam', description: 'Stick around for a spontaneous late-night jazz jam session.' },
    ],
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    category: 'Music',
    date: '2026-07-15T19:00:00Z',
    endDate: '2026-07-15T23:00:00Z',
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
    id: 'event-001a',
    title: 'Virtual Startup Pitch Night',
    description: 'Pitch your startup in a live online room, get instant feedback from investors, and network with founders from across the MENA region.',
    schedule: [
      { time: '6:00 PM', title: 'Virtual Check-In', description: 'Join the online room early, meet founders, and test audio/video.' },
      { time: '6:15 PM', title: 'Pitch Session', description: 'Founders deliver 3-minute pitches to investors and mentors.' },
      { time: '7:05 PM', title: 'Investor Q&A', description: 'Live feedback from investors with an interactive Q&A round.' },
      { time: '7:25 PM', title: 'Networking Lounge', description: 'Stay online for breakout networking rooms and follow-up chats.' },
    ],
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
    category: 'Business',
    date: '2026-07-10T18:00:00Z',
    endDate: '2026-07-10T19:30:00Z',
    location: {
      venue: 'Online',
      address: 'Virtual room',
      city: 'Online',
      country: 'EG',
      lat: 0,
      lng: 0,
      isVirtual: true,
      virtualLink: 'https://meet.eventra.com/pitch-night'
    },
    organizer: {
      id: 'org-003',
      name: 'Eventra Labs',
      avatar: 'https://i.pravatar.cc/150?img=30',
      verified: true,
      followerCount: 7600
    },
    price: 0,
    ticketTypes: [{ name: 'Free Pass', price: 0, available: 150 }],
    capacity: 150,
    rsvpCount: 87,
    tags: ['startup', 'pitch', 'virtual', 'networking'],
    isRecommended: true,
    relevanceScore: 0.87,
    communityId: 'comm-003',
    attendees: [],
    engagement: {
      momentumLabel: 'Trending among tech enthusiasts',
      atmosphereLabel: 'High-energy crowd expected',
      vibeTags: ['Tech-forward', 'Networking-friendly', 'Creative crowd'],
      activitySignals: [
        { text: 'Investors are joining from across the region', icon: '💼', timestamp: '20 min ago' },
        { text: '20 people bookmarked the pitch room today', icon: '🔖', timestamp: '15 min ago' },
        { text: 'Founders are prepping final decks', icon: '📊', timestamp: '35 min ago' },
      ],
      recentAttendees: [
        { avatar: 'https://i.pravatar.cc/40?img=26', name: 'Laila', interest: 'Startups' },
        { avatar: 'https://i.pravatar.cc/40?img=27', name: 'Omar', interest: 'Investing' },
        { avatar: 'https://i.pravatar.cc/40?img=28', name: 'Yara', interest: 'Product' },
      ],
      sharedInterests: ['Startups', 'Pitching', 'Networking'],
      discussionCount: 42,
      bookmarkCount: 56,
      reactionCount: 110,
      xpReward: 140,
      badgeUnlock: 'Startup Star',
      identityLabel: 'Pitch Pro',
      aiMatchReason: 'You may connect well with other founders and investors',
      softActivityFeedback: 'Attendees are getting ready for the live Q&A',
    }
  },
  {
    id: 'event-001b',
    title: 'Online Wellness Workshop: Mindful Meetings',
    description: 'Set the tone for your week with a guided virtual wellness session. Learn practical breathing exercises, productivity rituals, and mindful networking techniques designed for remote professionals.',
    schedule: [
      { time: '4:00 PM', title: 'Welcome & Centering', description: 'Gather online, introduce the instructor, and set your intention.' },
      { time: '4:10 PM', title: 'Guided Breathwork', description: 'Follow a calming breath sequence designed for focus and balance.' },
      { time: '4:30 PM', title: 'Mindful Networking', description: 'Share a quick check-in and best practices for remote work wellness.' },
      { time: '5:00 PM', title: 'Closing Reflection', description: 'Finish with a grounding ritual and take-home productivity tips.' },
    ],
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
    category: 'Health & Wellness',
    date: '2026-08-01T16:00:00Z',
    endDate: '2026-08-01T17:30:00Z',
    location: {
      venue: 'Online Wellness Studio',
      address: 'Virtual session',
      city: 'Online',
      country: 'EG',
      lat: 0,
      lng: 0,
      isVirtual: true,
      virtualLink: 'https://meet.eventra.com/mindful-meetings'
    },
    organizer: {
      id: 'org-004',
      name: 'ZenZone',
      avatar: 'https://i.pravatar.cc/150?img=44',
      verified: true,
      followerCount: 5200
    },
    price: 10,
    ticketTypes: [{ name: 'Pay What You Can', price: 10, available: 120 }],
    capacity: 120,
    rsvpCount: 62,
    tags: ['wellness', 'mindfulness', 'virtual', 'career'],
    isRecommended: false,
    relevanceScore: 0.74,
    communityId: 'comm-004',
    attendees: [],
    engagement: {
      momentumLabel: 'A calm crowd is gathering online',
      atmosphereLabel: 'Relaxed and focused',
      vibeTags: ['Chill atmosphere', 'Creative crowd', 'Community builders'],
      activitySignals: [
        { text: '20 people bookmarked this session today', icon: '🔖', timestamp: '1 hr ago' },
        { text: 'Early birds are joining from Cairo and Alexandria', icon: '🌍', timestamp: '45 min ago' },
        { text: 'People are sharing their favorite productivity rituals', icon: '🧘', timestamp: '30 min ago' },
      ],
      recentAttendees: [
        { avatar: 'https://i.pravatar.cc/40?img=31', name: 'Mona', interest: 'Wellness' },
        { avatar: 'https://i.pravatar.cc/40?img=32', name: 'Youssef', interest: 'Mindfulness' },
        { avatar: 'https://i.pravatar.cc/40?img=33', name: 'Sara', interest: 'Remote work' },
      ],
      sharedInterests: ['Mindfulness', 'Wellness', 'Remote Work'],
      discussionCount: 18,
      bookmarkCount: 34,
      reactionCount: 58,
      xpReward: 85,
      badgeUnlock: 'Wellness Seeker',
      identityLabel: 'Mindful Pro',
      aiMatchReason: 'You may enjoy events that help with balance and remote productivity',
      softActivityFeedback: 'Attendees are ready to reset before their next week',
    }
  },
  {
    id: 'event-001c',
    title: 'Global Design Jam: Remote Creative Sprint',
    description: 'Collaborate with designers around the world in a fast-paced virtual sprint. This online event features rapid ideation, peer feedback, and live build sessions for product and UX thinkers.',
    schedule: [
      { time: '2:00 PM', title: 'Kickoff Briefing', description: 'Meet the hosts, review the challenge, and join your breakout team.' },
      { time: '2:20 PM', title: 'Rapid Ideation', description: 'Sketch concepts and share ideas with your team.' },
      { time: '3:20 PM', title: 'Feedback Studio', description: 'Present your concept for peer feedback and iteration.' },
      { time: '4:15 PM', title: 'Demo & Wrap-Up', description: 'Show final concepts and hear closing inspiration from the hosts.' },
    ],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    category: 'Design',
    date: '2026-07-25T14:00:00Z',
    endDate: '2026-07-25T17:00:00Z',
    location: {
      venue: 'Global Design Jam',
      address: 'Virtual creative room',
      city: 'Online',
      country: 'EG',
      lat: 0,
      lng: 0,
      isVirtual: true,
      virtualLink: 'https://meet.eventra.com/design-jam'
    },
    organizer: {
      id: 'org-005',
      name: 'Creative Collective',
      avatar: 'https://i.pravatar.cc/150?img=45',
      verified: false,
      followerCount: 4800
    },
    price: 5,
    ticketTypes: [{ name: 'Standard Pass', price: 5, available: 180 }],
    capacity: 180,
    rsvpCount: 105,
    tags: ['design', 'remote', 'virtual', 'workshop'],
    isRecommended: true,
    relevanceScore: 0.84,
    communityId: 'comm-005',
    attendees: [],
    engagement: {
      momentumLabel: 'Design teams are joining from multiple time zones',
      atmosphereLabel: 'Energetic and collaborative',
      vibeTags: ['Creative crowd', 'Networking-friendly', 'Tech-forward'],
      activitySignals: [
        { text: 'Designers are sharing mood boards in the chat', icon: '🎨', timestamp: '15 min ago' },
        { text: '20 new RSVPs in the last hour', icon: '📈', timestamp: '10 min ago' },
        { text: 'Live feedback sessions are getting booked fast', icon: '💬', timestamp: '25 min ago' },
      ],
      recentAttendees: [
        { avatar: 'https://i.pravatar.cc/40?img=34', name: 'Hany', interest: 'UI/UX' },
        { avatar: 'https://i.pravatar.cc/40?img=35', name: 'Dalia', interest: 'Product Design' },
        { avatar: 'https://i.pravatar.cc/40?img=36', name: 'Fady', interest: 'Creative Tech' },
      ],
      sharedInterests: ['Design', 'Remote Collaboration', 'Productivity'],
      discussionCount: 37,
      bookmarkCount: 68,
      reactionCount: 94,
      xpReward: 130,
      badgeUnlock: 'Design Sprint Champion',
      identityLabel: 'Creative Collaborator',
      aiMatchReason: 'You may connect well with fast-moving virtual creative experiences',
      softActivityFeedback: 'Participants are already exchanging quick-win ideas',
    }
  },
  {
    id: 'event-002',
    title: 'AI & Machine Learning Summit 2026',
    description: 'Join industry leaders, researchers, and developers for a full-day conference on the latest developments in AI and ML. Featuring keynote speakers from top tech companies, hands-on workshops, and networking opportunities.',
    schedule: [
      { time: '9:00 AM', title: 'Registration & Coffee', description: 'Check in, grab a coffee, and connect with early arrivals.' },
      { time: '10:00 AM', title: 'Keynote: The Future of AI', description: 'Opening keynote from an industry leader on AI innovation.' },
      { time: '11:30 AM', title: 'Panel Discussion', description: 'Top speakers debate the latest AI opportunities and ethics.' },
      { time: '1:00 PM', title: 'Lunch & Networking', description: 'Enjoy lunch and meet peers from the AI community.' },
      { time: '2:30 PM', title: 'Breakout Workshops', description: 'Choose hands-on sessions on ML, product, and growth.' },
      { time: '4:30 PM', title: 'Closing Remarks', description: 'Summary, next steps, and community announcements.' },
    ],
    image: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=800',
    category: 'Tech',
    date: '2026-07-20T09:00:00Z',
    endDate: '2026-07-20T18:00:00Z',
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
    schedule: [
      { time: '7:00 AM', title: 'Meet & Gear Check', description: 'Meet the group, check your gear, and review the trail plan.' },
      { time: '7:30 AM', title: 'Trail Briefing', description: 'Safety briefing and warm-up before heading out.' },
      { time: '8:00 AM', title: 'Hike Begins', description: 'Start the scenic 8km guided hike through the canyon.' },
      { time: '10:00 AM', title: 'Summit Break', description: 'Take a rest break, enjoy the view, and refuel.' },
      { time: '11:30 AM', title: 'Closing Circle', description: 'Finish the hike together and share highlights.' },
    ],
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    category: 'Sports',
    date: '2026-08-05T07:00:00Z',
    endDate: '2026-08-05T12:00:00Z',
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
    schedule: [
      { time: '6:00 PM', title: 'Opening Reception', description: 'Welcome drink and first look at the new installations.' },
      { time: '6:30 PM', title: 'Artist Walkthrough', description: 'Guided tour with featured artists sharing inspiration.' },
      { time: '7:30 PM', title: 'Live Painting', description: 'Watch a live art performance and meet the creator.' },
      { time: '8:30 PM', title: 'Curator Q&A', description: 'Ask questions about the works and exhibition themes.' },
    ],
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800',
    category: 'Art',
    date: '2026-07-28T18:00:00Z',
    endDate: '2026-07-28T22:00:00Z',
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
    schedule: [
      { time: '4:00 PM', title: 'Festival Gates Open', description: 'Enter the park and explore food stalls across the venue.' },
      { time: '5:00 PM', title: 'Chef Tasting Session', description: 'Join a guided tasting of local street food favorites.' },
      { time: '6:30 PM', title: 'Live Music Set', description: 'Enjoy live performers while you sample the food.' },
      { time: '8:00 PM', title: 'Cultural Dance Showcase', description: 'Watch a performance inspired by Egyptian street culture.' },
      { time: '9:30 PM', title: 'Night Bites & Wrap', description: 'Finish the evening with dessert and good company.' },
    ],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    category: 'Food & Drink',
    date: '2026-08-12T16:00:00Z',
    endDate: '2026-08-12T23:00:00Z',
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

export interface Community {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  category: string;
  memberCount: number;
  eventCount: number;
  isJoined: boolean;
  tags: string[];
  threads: Array<{
    id: string;
    title: string;
    author: string;
    avatar: string;
    replies: number;
    time: string;
    hot: boolean;
  }>;
  members: Array<{ avatar: string; name: string }>;
}

export const mockCommunities: Community[] = [
  {
    id: 'comm-001',
    name: 'Cairo Music Lovers',
    description: 'For everyone who loves live music, from jazz to rock to electronic.',
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200',
    category: 'Music',
    memberCount: 12500,
    eventCount: 45,
    isJoined: true,
    tags: ['Live Music', 'Jazz', 'Concerts'],
    threads: [
      { id: 't1', title: 'Best jazz venues in Cairo?', author: 'Sarah Ahmed', avatar: 'https://i.pravatar.cc/40?img=1', replies: 12, time: '2 hours ago', hot: true },
      { id: 't2', title: 'Looking for band members — Jazz fusion project', author: 'Mike Johnson', avatar: 'https://i.pravatar.cc/40?img=2', replies: 8, time: '5 hours ago', hot: false },
      { id: 't3', title: 'Upcoming Jazz Night was amazing!', author: 'Emily Chen', avatar: 'https://i.pravatar.cc/40?img=3', replies: 24, time: '1 day ago', hot: true },
    ],
    members: [
      { avatar: 'https://i.pravatar.cc/60?img=11', name: 'Sarah Ahmed' },
      { avatar: 'https://i.pravatar.cc/60?img=12', name: 'Karim Nour' },
      { avatar: 'https://i.pravatar.cc/60?img=13', name: 'Dina Walid' },
    ]
  },
  {
    id: 'comm-002',
    name: 'Tech Cairo Hub',
    description: 'Community for developers, designers, and tech entrepreneurs in the Cairo ecosystem.',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
    category: 'Tech',
    memberCount: 8900,
    eventCount: 38,
    isJoined: true,
    tags: ['Developers', 'Startups', 'Design'],
    threads: [
      { id: 't4', title: 'Which AI tools are you using this month?', author: 'Omar Sherif', avatar: 'https://i.pravatar.cc/40?img=4', replies: 31, time: '3 hours ago', hot: true },
      { id: 't5', title: 'Open-source project seeking contributors', author: 'Layla Hassan', avatar: 'https://i.pravatar.cc/40?img=5', replies: 7, time: '8 hours ago', hot: false },
      { id: 't6', title: 'Recap: Cairo Tech Summit 2026', author: 'Ahmed Fathy', avatar: 'https://i.pravatar.cc/40?img=6', replies: 18, time: '2 days ago', hot: true },
    ],
    members: [
      { avatar: 'https://i.pravatar.cc/60?img=14', name: 'Omar Sherif' },
      { avatar: 'https://i.pravatar.cc/60?img=15', name: 'Layla Hassan' },
      { avatar: 'https://i.pravatar.cc/60?img=16', name: 'Ahmed Fathy' },
    ]
  },
  {
    id: 'comm-003',
    name: 'Startup Founders Egypt',
    description: 'A network for entrepreneurs, investors, and startup enthusiasts across Egypt and MENA.',
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200',
    category: 'Business',
    memberCount: 5400,
    eventCount: 22,
    isJoined: false,
    tags: ['Startups', 'Networking', 'Investors'],
    threads: [
      { id: 't7', title: 'How to find your first 10 customers?', author: 'Yara Khaled', avatar: 'https://i.pravatar.cc/40?img=7', replies: 45, time: '1 hour ago', hot: true },
      { id: 't8', title: 'Seed funding landscape in Egypt 2026', author: 'Tarek Mostafa', avatar: 'https://i.pravatar.cc/40?img=8', replies: 22, time: '6 hours ago', hot: false },
      { id: 't9', title: 'Co-founder wanted for fintech idea', author: 'Nour Ali', avatar: 'https://i.pravatar.cc/40?img=9', replies: 14, time: '1 day ago', hot: false },
    ],
    members: [
      { avatar: 'https://i.pravatar.cc/60?img=17', name: 'Yara Khaled' },
      { avatar: 'https://i.pravatar.cc/60?img=18', name: 'Tarek Mostafa' },
      { avatar: 'https://i.pravatar.cc/60?img=19', name: 'Nour Ali' },
    ]
  },
  {
    id: 'comm-004',
    name: 'Cairo Sports Club',
    description: 'Unite over football, padel, running clubs, and all things sports in Cairo.',
    coverImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200',
    category: 'Sports',
    memberCount: 7200,
    eventCount: 61,
    isJoined: false,
    tags: ['Football', 'Running', 'Padel'],
    threads: [
      { id: 't10', title: 'Weekly 5K run — who is joining Saturday?', author: 'Hana Magdy', avatar: 'https://i.pravatar.cc/40?img=20', replies: 19, time: '30 min ago', hot: true },
      { id: 't11', title: 'Best padel courts in Maadi?', author: 'Sherif Adel', avatar: 'https://i.pravatar.cc/40?img=21', replies: 11, time: '4 hours ago', hot: false },
      { id: 't12', title: 'Pre-season football tryouts — join us!', author: 'Amr Galal', avatar: 'https://i.pravatar.cc/40?img=22', replies: 9, time: '2 days ago', hot: false },
    ],
    members: [
      { avatar: 'https://i.pravatar.cc/60?img=20', name: 'Hana Magdy' },
      { avatar: 'https://i.pravatar.cc/60?img=21', name: 'Sherif Adel' },
      { avatar: 'https://i.pravatar.cc/60?img=22', name: 'Amr Galal' },
    ]
  },
  {
    id: 'comm-005',
    name: 'Art & Culture Cairo',
    description: 'Connecting artists, gallery-goers, and culture lovers across the city.',
    coverImage: 'https://images.unsplash.com/photo-1577083552431-6e5fd01f8bcc?w=1200',
    category: 'Art',
    memberCount: 3900,
    eventCount: 29,
    isJoined: false,
    tags: ['Art', 'Galleries', 'Culture'],
    threads: [
      { id: 't13', title: 'Must-see exhibitions this summer', author: 'Rima Fares', avatar: 'https://i.pravatar.cc/40?img=23', replies: 16, time: '2 hours ago', hot: true },
      { id: 't14', title: 'Open call: collaborative mural project', author: 'Sami Nader', avatar: 'https://i.pravatar.cc/40?img=24', replies: 6, time: '9 hours ago', hot: false },
      { id: 't15', title: 'Photography walk — Zamalek this Friday?', author: 'Lina Samir', avatar: 'https://i.pravatar.cc/40?img=25', replies: 21, time: '3 days ago', hot: true },
    ],
    members: [
      { avatar: 'https://i.pravatar.cc/60?img=23', name: 'Rima Fares' },
      { avatar: 'https://i.pravatar.cc/60?img=24', name: 'Sami Nader' },
      { avatar: 'https://i.pravatar.cc/60?img=25', name: 'Lina Samir' },
    ]
  },
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
