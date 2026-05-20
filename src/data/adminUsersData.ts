export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: 'attendee' | 'organizer' | 'admin';
  status: 'active' | 'pending' | 'suspended' | 'banned';
  isVerified: boolean;
  joinDate: string;
  lastLogin?: string;
  eventsCount: number;
  avatar?: string;
  suspendedUntil?: string;
  suspendReason?: string;
  banReason?: string;
}

export interface UserActivityEntry {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
  icon: string;
}

export const initialManagedUsers: ManagedUser[] = [
  {
    id: 'user-001',
    name: 'Sarah Johnson',
    email: 'sarah@demo.com',
    role: 'attendee',
    status: 'active',
    isVerified: false,
    joinDate: '2025-12-15T00:00:00Z',
    lastLogin: '2026-05-18T14:30:00Z',
    eventsCount: 12,
    avatar: 'https://i.pravatar.cc/150?img=25',
  },
  {
    id: 'user-002',
    name: 'Ahmed Hassan',
    email: 'ahmed@demo.com',
    role: 'organizer',
    status: 'active',
    isVerified: true,
    joinDate: '2025-08-10T00:00:00Z',
    lastLogin: '2026-05-19T09:00:00Z',
    eventsCount: 24,
    avatar: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 'user-003',
    name: 'Layla Mostafa',
    email: 'admin@demo.com',
    role: 'admin',
    status: 'active',
    isVerified: false,
    joinDate: '2025-06-01T00:00:00Z',
    lastLogin: '2026-05-19T08:00:00Z',
    eventsCount: 0,
    avatar: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 'user-004',
    name: 'Mohamed Ali',
    email: 'mohamed@example.com',
    role: 'organizer',
    status: 'pending',
    isVerified: false,
    joinDate: '2026-05-01T00:00:00Z',
    lastLogin: '2026-05-04T10:00:00Z',
    eventsCount: 3,
    avatar: 'https://i.pravatar.cc/150?img=33',
  },
  {
    id: 'user-005',
    name: 'Yasmine Khaled',
    email: 'yasmine@example.com',
    role: 'attendee',
    status: 'active',
    isVerified: false,
    joinDate: '2026-02-28T00:00:00Z',
    lastLogin: '2026-05-17T20:00:00Z',
    eventsCount: 8,
    avatar: 'https://i.pravatar.cc/150?img=44',
  },
  {
    id: 'user-006',
    name: 'Nour Ibrahim',
    email: 'nour@example.com',
    role: 'attendee',
    status: 'suspended',
    isVerified: false,
    joinDate: '2026-03-10T00:00:00Z',
    lastLogin: '2026-05-10T11:00:00Z',
    eventsCount: 3,
    suspendedUntil: '2026-06-10T00:00:00Z',
    suspendReason: 'Multiple reports of harassment from other attendees.',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 'user-007',
    name: 'Karim Farid',
    email: 'karim@example.com',
    role: 'attendee',
    status: 'banned',
    isVerified: false,
    joinDate: '2026-01-05T00:00:00Z',
    lastLogin: '2026-04-01T08:00:00Z',
    eventsCount: 2,
    banReason: 'Fraudulent ticket resale activity.',
    avatar: 'https://i.pravatar.cc/150?img=15',
  },
  {
    id: 'user-008',
    name: 'Dina Salah',
    email: 'dina@example.com',
    role: 'attendee',
    status: 'active',
    isVerified: false,
    joinDate: '2026-04-12T00:00:00Z',
    lastLogin: '2026-05-18T18:00:00Z',
    eventsCount: 5,
    avatar: 'https://i.pravatar.cc/150?img=9',
  },
  {
    id: 'user-009',
    name: 'Tech Cairo Events',
    email: 'info@techcairo.com',
    role: 'organizer',
    status: 'active',
    isVerified: true,
    joinDate: '2025-10-05T00:00:00Z',
    lastLogin: '2026-05-19T07:30:00Z',
    eventsCount: 38,
    avatar: 'https://i.pravatar.cc/150?img=20',
  },
  {
    id: 'user-010',
    name: 'Omar Farouk',
    email: 'omar@example.com',
    role: 'attendee',
    status: 'active',
    isVerified: false,
    joinDate: '2026-05-19T00:00:00Z',
    lastLogin: '2026-05-19T10:00:00Z',
    eventsCount: 0,
    avatar: 'https://i.pravatar.cc/150?img=30',
  },
  {
    id: 'user-011',
    name: 'Hana El-Sheikh',
    email: 'hana@example.com',
    role: 'attendee',
    status: 'active',
    isVerified: false,
    joinDate: '2026-05-19T00:00:00Z',
    lastLogin: '2026-05-19T11:00:00Z',
    eventsCount: 1,
    avatar: 'https://i.pravatar.cc/150?img=38',
  },
  {
    id: 'user-012',
    name: 'Rania Mahmoud',
    email: 'rania@example.com',
    role: 'organizer',
    status: 'pending',
    isVerified: false,
    joinDate: '2026-05-15T00:00:00Z',
    lastLogin: '2026-05-18T16:00:00Z',
    eventsCount: 0,
    avatar: 'https://i.pravatar.cc/150?img=41',
  },
];

export const mockUserActivity: Record<string, UserActivityEntry[]> = {
  'user-001': [
    { id: 'a1', action: 'Login', detail: 'Logged in from Cairo, Egypt', timestamp: '2026-05-18T14:30:00Z', icon: '🔐' },
    { id: 'a2', action: 'Ticket Purchase', detail: 'Purchased ticket for Cairo Jazz Night', timestamp: '2026-05-15T10:00:00Z', icon: '🎟️' },
    { id: 'a3', action: 'RSVP', detail: 'RSVPed to AI & ML Summit 2026', timestamp: '2026-05-10T09:00:00Z', icon: '✅' },
    { id: 'a4', action: 'Badge Earned', detail: 'Unlocked "Music Lover" badge', timestamp: '2026-05-05T18:30:00Z', icon: '🏆' },
    { id: 'a5', action: 'Login', detail: 'Logged in from Cairo, Egypt', timestamp: '2026-05-01T08:00:00Z', icon: '🔐' },
  ],
  'user-002': [
    { id: 'b1', action: 'Login', detail: 'Logged in from Cairo, Egypt', timestamp: '2026-05-19T09:00:00Z', icon: '🔐' },
    { id: 'b2', action: 'Event Published', detail: 'Published "AI & ML Summit 2026"', timestamp: '2026-05-12T11:00:00Z', icon: '📅' },
    { id: 'b3', action: 'Booking Received', detail: '50 new bookings for AI Summit', timestamp: '2026-05-06T16:30:00Z', icon: '🎟️' },
    { id: 'b4', action: 'Broadcast Sent', detail: 'Sent announcement to 387 attendees', timestamp: '2026-05-04T10:00:00Z', icon: '📢' },
    { id: 'b5', action: 'Login', detail: 'Logged in from Alexandria, Egypt', timestamp: '2026-05-01T07:45:00Z', icon: '🔐' },
  ],
  'user-006': [
    { id: 'c1', action: 'Account Suspended', detail: 'Suspended by admin due to reports', timestamp: '2026-05-10T12:00:00Z', icon: '⚠️' },
    { id: 'c2', action: 'Report Received', detail: 'Received 3 harassment complaints', timestamp: '2026-05-09T15:00:00Z', icon: '🚩' },
    { id: 'c3', action: 'Login', detail: 'Logged in from Cairo, Egypt', timestamp: '2026-05-10T11:00:00Z', icon: '🔐' },
    { id: 'c4', action: 'RSVP', detail: 'RSVPed to Street Food Festival', timestamp: '2026-04-20T09:00:00Z', icon: '✅' },
  ],
  'user-007': [
    { id: 'd1', action: 'Account Banned', detail: 'Permanently banned for ToS violation', timestamp: '2026-04-01T09:00:00Z', icon: '🔴' },
    { id: 'd2', action: 'Fraud Alert', detail: 'Detected ticket resale fraud activity', timestamp: '2026-03-31T16:00:00Z', icon: '🚨' },
    { id: 'd3', action: 'Login', detail: 'Logged in from Cairo, Egypt', timestamp: '2026-04-01T08:00:00Z', icon: '🔐' },
  ],
  'user-009': [
    { id: 'e1', action: 'Login', detail: 'Logged in from Cairo, Egypt', timestamp: '2026-05-19T07:30:00Z', icon: '🔐' },
    { id: 'e2', action: 'Event Created', detail: 'Created "Street Food Festival 2026"', timestamp: '2026-05-10T14:00:00Z', icon: '📅' },
    { id: 'e3', action: 'Payout Requested', detail: 'Requested EGP 12,500 payout', timestamp: '2026-05-08T10:00:00Z', icon: '💰' },
    { id: 'e4', action: 'Verified Status Granted', detail: 'Granted verified organizer status by admin', timestamp: '2025-10-20T11:00:00Z', icon: '✅' },
  ],
};
