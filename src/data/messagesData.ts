import type { DirectMessage, BroadcastMessage } from '../types';

const convId = (a: string, b: string) => [a, b].sort().join('--');

export const initialDirectMessages: DirectMessage[] = [
  // Sarah (attendee, user-001) ↔ Ahmed (organizer, user-002)
  {
    id: 'dm-001',
    conversationId: convId('user-001', 'user-002'),
    senderId: 'user-001',
    senderName: 'Sarah Johnson',
    senderAvatar: 'https://i.pravatar.cc/150?img=25',
    senderRole: 'attendee',
    receiverId: 'user-002',
    receiverName: 'Ahmed Hassan',
    receiverRole: 'organizer',
    content: 'Hi Ahmed! Is parking available near the Cairo Jazz Night venue?',
    timestamp: '2026-05-17T10:00:00Z',
    isRead: true,
  },
  {
    id: 'dm-002',
    conversationId: convId('user-001', 'user-002'),
    senderId: 'user-002',
    senderName: 'Ahmed Hassan',
    senderAvatar: 'https://i.pravatar.cc/150?img=12',
    senderRole: 'organizer',
    receiverId: 'user-001',
    receiverName: 'Sarah Johnson',
    receiverRole: 'attendee',
    content: "Hi Sarah! Yes, there's free parking in Lot B behind the Opera House. Doors open at 6:30 PM 🎷",
    timestamp: '2026-05-17T10:15:00Z',
    isRead: true,
  },
  {
    id: 'dm-003',
    conversationId: convId('user-001', 'user-002'),
    senderId: 'user-001',
    senderName: 'Sarah Johnson',
    senderAvatar: 'https://i.pravatar.cc/150?img=25',
    senderRole: 'attendee',
    receiverId: 'user-002',
    receiverName: 'Ahmed Hassan',
    receiverRole: 'organizer',
    content: "Perfect, thank you so much! Can't wait for the event!",
    timestamp: '2026-05-17T10:22:00Z',
    isRead: false,
  },
  // Ahmed (organizer, user-002) ↔ Layla (admin, user-003)
  {
    id: 'dm-101',
    conversationId: convId('user-002', 'user-003'),
    senderId: 'user-002',
    senderName: 'Ahmed Hassan',
    senderAvatar: 'https://i.pravatar.cc/150?img=12',
    senderRole: 'organizer',
    receiverId: 'user-003',
    receiverName: 'Layla Mostafa',
    receiverRole: 'admin',
    content: 'Hi Layla, my AI Summit event has been under review for 3 days. Could you give me a status update?',
    timestamp: '2026-05-16T14:00:00Z',
    isRead: true,
  },
  {
    id: 'dm-102',
    conversationId: convId('user-002', 'user-003'),
    senderId: 'user-003',
    senderName: 'Layla Mostafa',
    senderAvatar: 'https://i.pravatar.cc/150?img=47',
    senderRole: 'admin',
    receiverId: 'user-002',
    receiverName: 'Ahmed Hassan',
    receiverRole: 'organizer',
    content: "Hi Ahmed, our team is reviewing it now. I'll prioritise it and get back to you by tomorrow.",
    timestamp: '2026-05-16T14:30:00Z',
    isRead: false,
  },
];

export const initialBroadcastMessages: BroadcastMessage[] = [
  // Ahmed (organizer) → Attendees
  {
    id: 'bc-001',
    senderId: 'user-002',
    senderName: 'Ahmed Hassan',
    senderRole: 'organizer',
    targetRole: 'attendee',
    subject: 'Event Reminder — Cairo Jazz Night Tomorrow!',
    content:
      "Don't forget — Cairo Jazz Night is TOMORROW at 7:30 PM at the Cairo Opera House. Doors open at 6:30 PM. Please bring your QR ticket code for fast entry. Free parking is available in Lot B. See you there!",
    timestamp: '2026-05-17T09:00:00Z',
    recipientCount: 142,
  },
  {
    id: 'bc-002',
    senderId: 'user-002',
    senderName: 'Ahmed Hassan',
    senderRole: 'organizer',
    targetRole: 'attendee',
    subject: 'VIP Lounge Now Available',
    content:
      'Great news for VIP ticket holders! We have added an exclusive lounge with reserved seating and complimentary drink vouchers. Show your VIP QR at the side entrance.',
    timestamp: '2026-05-16T11:00:00Z',
    recipientCount: 22,
  },
  // Layla (admin) → Organizers
  {
    id: 'bc-101',
    senderId: 'user-003',
    senderName: 'Layla Mostafa',
    senderRole: 'admin',
    targetRole: 'organizer',
    subject: 'Platform Fee Reduction — June 2026',
    content:
      "We're excited to announce that starting June 1st, the platform fee will decrease from 5% to 4% for all verified organizers. This is our way of thanking you for your continued partnership with Eventra. Questions? Reply to this message.",
    timestamp: '2026-05-15T08:00:00Z',
    recipientCount: 48,
  },
];
