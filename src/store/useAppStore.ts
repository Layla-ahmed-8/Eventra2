import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockEvents, mockBookings, mockCommunities, Event, UserBehaviorType } from '../data/mockData';
import { demoAccounts, sarahAccount, ahmedAccount, laylaAccount, User, mockOrganizerRequests, OrganizerRequest } from '../data/users';
import { getNotificationsForUser, Notification } from '../data/notifications';

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: 'attendee' | 'organizer' | 'admin';
  location: string;
  interests: string[];
  registrationNote?: string;
};

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  /** Locally registered accounts (persisted); merged with built-in demo accounts for login. */
  registeredAccounts: User[];

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

  // Engagement / Behavior
  userBehaviorType: UserBehaviorType;
  engagementActions: number; // total micro-actions taken (bookmarks, discussions, etc.)
  browseCount: number;       // how many events browsed without RSVP
  discussionCount: number;   // how many discussions joined

  // UI
  theme: 'light' | 'dark';

  // Actions
  login: (email: string, password: string) => User | null;
  register: (input: RegisterInput) => { ok: true } | { ok: false; error: string };
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
  // Engagement micro-actions
  awardXP: (amount: number, reason: string) => void;
  recordBrowse: () => void;
  recordDiscussion: () => void;
  detectBehaviorType: () => UserBehaviorType;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      registeredAccounts: [],
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
      userBehaviorType: 'passive',
      engagementActions: 0,
      browseCount: 0,
      discussionCount: 0,

      register: (input) => {
        const email = input.email.trim().toLowerCase();
        if (input.password.length < 8) {
          return { ok: false, error: 'Password must be at least 8 characters.' };
        }
        const pool = [...demoAccounts, ...get().registeredAccounts];
        if (pool.some((u) => u.email.toLowerCase() === email)) {
          return { ok: false, error: 'An account with this email already exists.' };
        }

        const id = `user-reg-${Date.now()}`;
        const avatar = `https://i.pravatar.cc/150?u=${encodeURIComponent(email)}`;
        const note = input.registrationNote?.trim();
        const newUser: User = {
          id,
          name: input.name.trim(),
          email,
          password: input.password,
          avatar,
          role: input.role,
          interests: input.interests.length > 0 ? input.interests : ['Community'],
          location: input.location.trim(),
          radius: input.role === 'admin' ? 25 : input.role === 'organizer' ? 20 : 15,
          joinDate: new Date().toISOString(),
          level: 1,
          xp: 0,
          badges: [],
          rsvpedEvents: [],
          bookmarkedEvents: [],
          ...(note ? { registrationNote: note.slice(0, 2000) } : {}),
          ...(input.role === 'organizer' ? { organizerStatus: 'approved' as const } : {}),
        };

        set((state) => ({
          registeredAccounts: [...state.registeredAccounts, newUser],
        }));
        return { ok: true };
      },

      // Login: built-in demo accounts + locally registered accounts
      login: (email, password) => {
        const normalized = email.trim().toLowerCase();
        const pool = [...demoAccounts, ...get().registeredAccounts];
        let user =
          pool.find((u) => u.email.toLowerCase() === normalized && u.password === password) ?? null;
        if (!user && normalized === 'layla@demo.com' && laylaAccount.password === password) {
          user = laylaAccount;
        }

        if (user) {
          const base = getNotificationsForUser(user.id);
          const persistedForUser = get().notifications.filter(
            (n) => n.userId === user.id && !base.some((b) => b.id === n.id)
          );
          const notifications = [...persistedForUser, ...base].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          set({
            currentUser: user,
            isAuthenticated: true,
            bookmarkedEvents: user.bookmarkedEvents,
            rsvpedEvents: user.rsvpedEvents,
            notifications
          });
          return user;
        }
        return null;
      },

      logout: () => {
        set((state) => {
          const uid = state.currentUser?.id;
          return {
            currentUser: null,
            isAuthenticated: false,
            bookmarkedEvents: [],
            rsvpedEvents: [],
            notifications: uid
              ? state.notifications.filter((n) => n.userId !== uid)
              : state.notifications,
          };
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
          },
          notifications: [adminNotification, ...state.notifications],
        }));
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

        set((state) => ({
          organizerRequests: updatedRequests,
          notifications: [messageNotification, userNotification, ...state.notifications],
        }));
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

        set((state) => ({
          organizerRequests: updatedRequests,
          notifications: [userNotification, ...state.notifications],
        }));
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

          const newRsvpCount = state.rsvpedEvents.length + 1;
          const behaviorType: UserBehaviorType =
            newRsvpCount >= 5 ? 'gamified' : newRsvpCount >= 2 ? 'fomo' : state.userBehaviorType;

          // Award XP for RSVP
          const xpReward = event?.engagement?.xpReward || 50;
          const newXP = (state.currentUser?.xp || 0) + xpReward;
          const newLevel = Math.floor(newXP / 500) + 1;

          return {
            rsvpedEvents: [...state.rsvpedEvents, eventId],
            bookings: bookingExists ? state.bookings : [...state.bookings, ...booking],
            userBehaviorType: behaviorType,
            engagementActions: state.engagementActions + 1,
            currentUser: state.currentUser
              ? {
                  ...state.currentUser,
                  rsvpedEvents: [...state.currentUser.rsvpedEvents, eventId],
                  xp: newXP,
                  level: newLevel,
                }
              : state.currentUser,
          };
        });
      },

      toggleBookmark: (eventId) => {
        const wasBookmarked = get().bookmarkedEvents.includes(eventId);
        set((state) => {
          const isBookmarked = state.bookmarkedEvents.includes(eventId);
          const updatedBookmarks = isBookmarked
            ? state.bookmarkedEvents.filter((id) => id !== eventId)
            : [...state.bookmarkedEvents, eventId];

          // Detect behavior shift when bookmarking
          const newBookmarkCount = updatedBookmarks.length;
          const behaviorType: UserBehaviorType =
            newBookmarkCount >= 5 ? 'community' : state.userBehaviorType;

          return {
            bookmarkedEvents: updatedBookmarks,
            userBehaviorType: behaviorType,
            currentUser: state.currentUser
              ? {
                  ...state.currentUser,
                  bookmarkedEvents: updatedBookmarks,
                }
              : state.currentUser,
          };
        });
        if (!wasBookmarked) {
          get().awardXP(10, 'Bookmarked an event');
        }
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
      },

      // Award XP for micro-engagement actions
      awardXP: (amount, reason) => {
        set((state) => {
          if (!state.currentUser) return state;
          const newXP = (state.currentUser.xp || 0) + amount;
          const newLevel = Math.floor(newXP / 500) + 1;
          return {
            currentUser: {
              ...state.currentUser,
              xp: newXP,
              level: newLevel,
            },
            engagementActions: state.engagementActions + 1,
          };
        });
      },

      // Record a passive browse (no RSVP)
      recordBrowse: () => {
        set((state) => {
          const newBrowseCount = state.browseCount + 1;
          // Detect behavior shift
          const behaviorType = newBrowseCount > 10 && state.rsvpedEvents.length === 0
            ? 'passive'
            : state.userBehaviorType;
          return { browseCount: newBrowseCount, userBehaviorType: behaviorType };
        });
      },

      // Record joining a discussion
      recordDiscussion: () => {
        set((state) => {
          const newCount = state.discussionCount + 1;
          const behaviorType: UserBehaviorType = newCount >= 3 ? 'community' : state.userBehaviorType;
          return { discussionCount: newCount, userBehaviorType: behaviorType };
        });
        // Award XP for discussion participation
        get().awardXP(15, 'Joined a discussion');
      },

      // Derive behavior type from current state
      detectBehaviorType: (): UserBehaviorType => {
        const state = get();
        const rsvpCount = state.rsvpedEvents.length;
        const bookmarkCount = state.bookmarkedEvents.length;
        const discussions = state.discussionCount;
        const browses = state.browseCount;
        const xp = state.currentUser?.xp || 0;

        if (xp > 1000 || rsvpCount > 5) return 'gamified';
        if (discussions >= 3 || bookmarkCount > 5) return 'community';
        if (rsvpCount > 0 && browses > 5) return 'fomo';
        return 'passive';
      },
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
        theme: state.theme,
        userBehaviorType: state.userBehaviorType,
        engagementActions: state.engagementActions,
        browseCount: state.browseCount,
        discussionCount: state.discussionCount,
        notifications: state.notifications,
        organizerRequests: state.organizerRequests,
        registeredAccounts: state.registeredAccounts,
      })
    }
  )
);
