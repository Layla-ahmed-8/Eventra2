// Mock data for Eventra application

export const categories = [
  'Music', 'Tech', 'Sports', 'Art', 'Food & Drink', 'Business',
  'Health & Wellness', 'Gaming', 'Film', 'Fashion', 'Science', 'Community'
];

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
    attendees: []
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
    attendees: []
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
    attendees: []
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
    attendees: []
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
    attendees: []
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
