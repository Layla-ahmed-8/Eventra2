// Three separate demo accounts for testing different user flows

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: 'attendee' | 'organizer' | 'admin';
  interests: string[];
  location: string;
  radius: number;
  joinDate: string;
  level: number;
  xp: number;
  badges: string[];
  rsvpedEvents: string[];
  bookmarkedEvents: string[];
  organizerStatus?: 'pending' | 'approved' | 'rejected';
  organizerRequestEventId?: string;
}

// Demo Account 1: Attendee (Sarah)
export const sarahAccount: User = {
  id: 'user-001',
  name: 'Sarah Johnson',
  email: 'sarah@demo.com',
  password: 'demo123',
  avatar: 'https://i.pravatar.cc/150?img=25',
  role: 'attendee',
  interests: ['Music', 'Art', 'Food & Drink'],
  location: 'Cairo, Egypt',
  radius: 15,
  joinDate: '2025-12-15T00:00:00Z',
  level: 8,
  xp: 1580,
  badges: ['badge-001', 'badge-002', 'badge-003'],
  rsvpedEvents: ['event-001', 'event-004', 'event-005'],
  bookmarkedEvents: ['event-002', 'event-013']
};

// Demo Account 2: Organizer (Ahmed)
export const ahmedAccount: User = {
  id: 'user-002',
  name: 'Ahmed Hassan',
  email: 'ahmed@demo.com',
  password: 'demo123',
  avatar: 'https://i.pravatar.cc/150?img=12',
  role: 'organizer',
  interests: ['Tech', 'Business', 'Science'],
  location: 'Cairo, Egypt',
  radius: 20,
  joinDate: '2025-08-10T00:00:00Z',
  level: 15,
  xp: 3240,
  badges: ['badge-001', 'badge-002', 'badge-003', 'badge-006'],
  rsvpedEvents: ['event-002', 'event-014'],
  bookmarkedEvents: ['event-011'],
  organizerStatus: 'approved'
};

// Demo Account 3: Admin (Layla)
export const laylaAccount: User = {
  id: 'user-003',
  name: 'Layla Mostafa',
  email: 'admin@demo.com',
  password: 'demo123',
  avatar: 'https://i.pravatar.cc/150?img=47',
  role: 'admin',
  interests: ['Community', 'Business', 'Tech'],
  location: 'Cairo, Egypt',
  radius: 25,
  joinDate: '2025-06-01T00:00:00Z',
  level: 20,
  xp: 5000,
  badges: ['badge-001', 'badge-002', 'badge-003', 'badge-005', 'badge-006'],
  rsvpedEvents: [],
  bookmarkedEvents: []
};

export const demoAccounts = [sarahAccount, ahmedAccount, laylaAccount];

// Organizer requests (for admin approval)
export interface OrganizerRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  eventId: string;
  eventTitle: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  adminNotes?: string;
}

export const mockOrganizerRequests: OrganizerRequest[] = [
  {
    id: 'req-001',
    userId: 'user-004',
    userName: 'Mohamed Ali',
    userAvatar: 'https://i.pravatar.cc/150?img=33',
    eventId: 'event-003',
    eventTitle: 'Weekend Hiking Adventure: Wadi Degla',
    requestDate: '2026-05-04T10:30:00Z',
    status: 'pending',
    reason: 'I have organized 5+ hiking trips with 200+ participants. I want to create more community hiking events in Cairo.'
  },
  {
    id: 'req-002',
    userId: 'user-005',
    userName: 'Yasmine Khaled',
    userAvatar: 'https://i.pravatar.cc/150?img=44',
    eventId: 'event-010',
    eventTitle: 'Sustainable Fashion Workshop',
    requestDate: '2026-05-03T14:20:00Z',
    status: 'approved',
    reason: 'Fashion design graduate with 3 years experience in sustainable fashion. Want to organize monthly workshops.',
    adminNotes: 'Approved - Strong background and clear plan'
  }
];
