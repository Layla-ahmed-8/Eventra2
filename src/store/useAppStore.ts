import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockEvents, mockBookings, mockCommunities, Event } from '../data/mockData';
import { demoAccounts, sarahAccount, ahmedAccount, laylaAccount, User, mockOrganizerRequests, OrganizerRequest } from '../data/users';
import { getNotificationsForUser, Notification } from '../data/notifications';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;

  // Events
  events: Event[];
  bookmarkedEvents: string[];
  rsvpedEvents: string[];

  // Bookings
  bookings: typeof mockBookings;

  // Communities
  communities: typeof mockCommunities;

  // Organizer Requests
  organizerRequests: OrganizerRequest[];

  // Rewards
  pointsBalance: number;
  rewardHistory: Array<{ id: string; title: string; redeemedAt: string }>;

  // Notifications
  notifications: Notification[];

  // UI
  theme: 'light' | 'dark';

  // Actions
  login: (email: string, password: string) => boolean;
  logout: () => void;
  requestOrganizerStatus: (eventId: string, reason: string) => void;
  approveOrganizerRequest: (requestId: string, adminNotes: string) => void;
  rejectOrganizerRequest: (requestId: string, adminNotes: string) => void;
  toggleBookmark: (eventId: string) => void;
  rsvpEvent: (eventId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  toggleTheme: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  redeemReward: (rewardId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      events: mockEvents,
      bookmarkedEvents: [],
      rsvpedEvents: [],
      bookings: mockBookings,
      communities: mockCommunities,
      organizerRequests: mockOrganizerRequests,
      pointsBalance: 1320,
      rewardHistory: [],
      notifications: [],
      theme: 'light',

      // Login with demo accounts
      login: (email, password) => {
        const user = demoAccounts.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const notifications = getNotificationsForUser(user.id);
          set({
            currentUser: user,
            isAuthenticated: true,
            bookmarkedEvents: user.bookmarkedEvents,
            rsvpedEvents: user.rsvpedEvents,
            notifications
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          bookmarkedEvents: [],
          rsvpedEvents: [],
          notifications: []
        });
      },

      // Request organizer status for a specific event
      requestOrganizerStatus: (eventId, reason) => {
        const { currentUser, events } = get();
        if (!currentUser || currentUser.role !== 'attendee') return;

        const event = events.find(e => e.id === eventId);
        if (!event) return;

        const newRequest: OrganizerRequest = {
          id: `req-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          eventId,
          eventTitle: event.title,
          requestDate: new Date().toISOString(),
          status: 'pending',
          reason
        };

        // Add notification for admin
        const adminNotification: Notification = {
          id: `notif-${Date.now()}`,
          userId: 'user-003', // Admin
          type: 'organizer_request',
          title: 'New Organizer Request',
          message: `${currentUser.name} requested organizer status for "${event.title}". Review now.`,
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: '/admin/users',
          icon: '👤'
        };

        set((state) => ({
          organizerRequests: [...state.organizerRequests, newRequest],
          currentUser: {
            ...currentUser,
            organizerStatus: 'pending',
            organizerRequestEventId: eventId
          }
        }));

        // In a real app, this would trigger a backend notification
        console.log('Admin notification created:', adminNotification);
      },

      // Admin approves organizer request
      approveOrganizerRequest: (requestId, adminNotes) => {
        const { organizerRequests } = get();
        const request = organizerRequests.find(r => r.id === requestId);
        if (!request) return;

        // Update request status
        const updatedRequests = organizerRequests.map(r =>
          r.id === requestId
            ? { ...r, status: 'approved' as const, adminNotes }
            : r
        );

        // Create notification for user
        const userNotification: Notification = {
          id: `notif-${Date.now()}`,
          userId: request.userId,
          type: 'organizer_approved',
          title: 'Organizer Request Approved! 🎉',
          message: `Your request to become an organizer for "${request.eventTitle}" has been approved. You can now create events!`,
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: '/organizer/dashboard',
          icon: '✅'
        };

        // Create message notification
        const messageNotification: Notification = {
          id: `notif-msg-${Date.now()}`,
          userId: request.userId,
          type: 'event_update',
          title: 'Message from Admin',
          message: `Your organizer request was approved. ${adminNotes || 'Welcome to the organizer community!'}`,
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: '/app/messages',
          icon: '✉️'
        };

        set({
          organizerRequests: updatedRequests
        });

        console.log('User notifications created:', [userNotification, messageNotification]);
      },

      // Admin rejects organizer request
      rejectOrganizerRequest: (requestId, adminNotes) => {
        const { organizerRequests } = get();
        const request = organizerRequests.find(r => r.id === requestId);
        if (!request) return;

        const updatedRequests = organizerRequests.map(r =>
          r.id === requestId
            ? { ...r, status: 'rejected' as const, adminNotes }
            : r
        );

        const userNotification: Notification = {
          id: `notif-${Date.now()}`,
          userId: request.userId,
          type: 'organizer_rejected',
          title: 'Organizer Request Update',
          message: `Your request for "${request.eventTitle}" was not approved at this time. Check messages for details.`,
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: '/app/messages',
          icon: 'ℹ️'
        };

        set({
          organizerRequests: updatedRequests
        });

        console.log('User notification created:', userNotification);
      },

      rsvpEvent: (eventId) => {
        set((state) => {
          if (state.rsvpedEvents.includes(eventId)) {
            return state;
          }

          const event = state.events.find((e) => e.id === eventId);
          const bookingExists = state.bookings.some((b) => b.eventId === eventId);
          const firstTicket = event?.ticketTypes[0];

          const booking = bookingExists
            ? []
            : event
            ? [
                {
                  id: `booking-${Date.now()}`,
                  eventId: event.id,
                  userId: state.currentUser?.id || 'guest',
                  tickets: [
                    {
                      type: firstTicket?.name || 'General Admission',
                      qty: 1,
                      unitPrice: firstTicket?.price || 0,
                      subtotal: firstTicket?.price || 0,
                    },
                  ],
                  serviceFee: Number(((firstTicket?.price || 0) * 0.03).toFixed(2)),
                  discount: 0,
                  total: Number((firstTicket?.price || 0) * 1.03),
                  currency: 'EGP',
                  paymentMethod: {
                    brand: 'Visa',
                    last4: '4242',
                  },
                  status: 'confirmed',
                  qrData: {
                    bookingId: `EVT-${Date.now()}`,
                    userId: state.currentUser?.id || 'guest',
                    eventId: event.id,
                    valid: true,
                  },
                  bookingRef: `EVT-${Date.now()}`,
                  createdAt: new Date().toISOString(),
                },
              ]
            : [];

          return {
            rsvpedEvents: [...state.rsvpedEvents, eventId],
            bookings: bookingExists ? state.bookings : [...state.bookings, ...booking],
            currentUser: state.currentUser
              ? {
                  ...state.currentUser,
                  rsvpedEvents: [...state.currentUser.rsvpedEvents, eventId],
                }
              : state.currentUser,
          };
        });
      },

      toggleBookmark: (eventId) => {
        set((state) => {
          const isBookmarked = state.bookmarkedEvents.includes(eventId);
          const updatedBookmarks = isBookmarked
            ? state.bookmarkedEvents.filter((id) => id !== eventId)
            : [...state.bookmarkedEvents, eventId];

          return {
            bookmarkedEvents: updatedBookmarks,
            currentUser: state.currentUser
              ? {
                  ...state.currentUser,
                  bookmarkedEvents: updatedBookmarks,
                }
              : state.currentUser,
          };
        });
      },

      markNotificationAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        }));
      },

      redeemReward: (rewardId) => {
        const rewardCatalog: Record<string, { title: string; cost: number }> = {
          'reward-001': { title: 'Free Event Ticket', cost: 1000 },
          'reward-002': { title: 'VIP Lounge Access', cost: 1800 },
          'reward-003': { title: 'Profile Highlight', cost: 700 },
          'reward-004': { title: 'Partner Discount Voucher', cost: 500 },
        };
        const reward = rewardCatalog[rewardId];
        if (!reward) return;
        set((state) => {
          if (state.pointsBalance < reward.cost) return state;
          return {
            pointsBalance: state.pointsBalance - reward.cost,
            rewardHistory: [
              {
                id: rewardId,
                title: reward.title,
                redeemedAt: new Date().toISOString(),
              },
              ...state.rewardHistory,
            ],
          };
        });
      },

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}`,
          timestamp: new Date().toISOString()
        };

        set((state) => ({
          notifications: [newNotification, ...state.notifications]
        }));
      },

      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
      }
    }),
    {
      name: 'eventra-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        bookmarkedEvents: state.bookmarkedEvents,
        rsvpedEvents: state.rsvpedEvents,
        pointsBalance: state.pointsBalance,
      rewardHistory: state.rewardHistory,
      theme: state.theme
      })
    }
  )
);
