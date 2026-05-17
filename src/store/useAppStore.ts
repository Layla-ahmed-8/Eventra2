import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockEvents, mockBookings, mockCommunities, Event, UserBehaviorType } from '../data/mockData';
import { demoAccounts, sarahAccount, ahmedAccount, laylaAccount, User, mockOrganizerRequests, OrganizerRequest } from '../data/users';
import { getNotificationsForUser, Notification } from '../data/notifications';
import type { Badge, RegisterRequest, RegisterResponse, Booking, XPReason } from '../types';
import { BADGE_DEFINITIONS } from '../constants/badges';
import { XP_TABLE, POINTS_TABLE, DEFAULT_SYSTEM_CONFIG } from '../constants/config';
import type { SystemConfig } from '../types';

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getXPForLevel(level: number): number {
  return 100 * level + 50 * (level * (level - 1)) / 2;
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  while (xp >= getXPForLevel(level + 1)) level++;
  return level;
}

// ── Store interface ───────────────────────────────────────────────────────────

interface AppState {
  // ── AUTH (persisted) ────────────────────────────────────────────────────────
  currentUser: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;

  // ── USER DATA (persisted) ───────────────────────────────────────────────────
  events: Event[];
  bookmarkedEvents: string[];
  rsvpedEvents: string[];
  bookings: typeof mockBookings;
  communities: typeof mockCommunities;
  organizerRequests: OrganizerRequest[];
  pointsBalance: number;
  rewardHistory: Array<{ id: string; title: string; redeemedAt: string }>;

  // ── GAMIFICATION (persisted) ────────────────────────────────────────────────
  xp: number;
  level: number;
  earnedBadges: Badge[];
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;

  // ── AI & BEHAVIOR (persisted) ───────────────────────────────────────────────
  userBehaviorType: UserBehaviorType;
  engagementActions: number;
  browseCount: number;
  discussionCount: number;
  interests: string[];
  locationEnabled: boolean;
  userCity: string | null;
  userCoordinates: { lat: number; lng: number } | null;
  dismissedRecommendations: string[];

  // ── NOTIFICATIONS (persisted) ────────────────────────────────────────────────
  notifications: Notification[];

  // ── UI STATE (NOT persisted) ────────────────────────────────────────────────
  theme: 'light' | 'dark';
  unreadCount: number;
  activeModal: string | null;

  // ── SYSTEM CONFIG (persisted) ───────────────────────────────────────────────
  systemConfig: SystemConfig;

  // ── ACTIONS ─────────────────────────────────────────────────────────────────

  // Auth (legacy sync signature preserved for compat)
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  refreshAccessToken: () => Promise<void>;

  // Profile
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  requestOrganizerStatus: (eventId: string, reason: string) => void;
  approveOrganizerRequest: (requestId: string, adminNotes: string) => void;
  rejectOrganizerRequest: (requestId: string, adminNotes: string) => void;

  // Events
  toggleBookmark: (eventId: string) => void;
  rsvpEvent: (eventId: string) => void;
  rsvpEventFull: (eventId: string, ticketTypeId: string, quantity: number) => Promise<Booking | null>;
  cancelBooking: (bookingId: string) => Promise<void>;
  dismissRecommendation: (eventId: string) => void;

  // Gamification
  awardXP: (amount: number, reason: string) => void;
  checkStreak: () => void;
  recordBrowse: () => void;
  recordDiscussion: () => void;
  detectBehaviorType: () => UserBehaviorType;
  updateBehaviorType: () => void;
  redeemReward: (rewardId: string) => void;

  // Notifications
  markNotificationAsRead: (notificationId: string) => void;
  markAllRead: () => void;
  clearMyNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  fetchNotifications: () => Promise<void>;

  // Session
  extendSession: () => void;

  // UI
  toggleTheme: () => void;
  setActiveModal: (modal: string | null) => void;

  // Admin
  updateSystemConfig: (config: Partial<SystemConfig>) => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null,

      events: mockEvents,
      bookmarkedEvents: [],
      rsvpedEvents: [],
      bookings: mockBookings,
      communities: mockCommunities,
      organizerRequests: mockOrganizerRequests,
      pointsBalance: 1320,
      rewardHistory: [],

      xp: 0,
      level: 1,
      earnedBadges: [],
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,

      userBehaviorType: 'passive',
      engagementActions: 0,
      browseCount: 0,
      discussionCount: 0,
      interests: [],
      locationEnabled: false,
      userCity: null,
      userCoordinates: null,
      dismissedRecommendations: [],

      notifications: [],
      theme: 'light',
      unreadCount: 0,
      activeModal: null,
      systemConfig: DEFAULT_SYSTEM_CONFIG,

      // ── Auth ────────────────────────────────────────────────────────────────

      login: (email, password) => {
        const user = demoAccounts.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          const base = getNotificationsForUser(user.id);
          const persistedForUser = get().notifications.filter(
            (n) => n.userId === user.id && !base.some((b) => b.id === n.id)
          );
          const notifications = [...persistedForUser, ...base].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          const unreadCount = notifications.filter((n) => !n.isRead && n.userId === user.id).length;
          set({
            currentUser: user,
            isAuthenticated: true,
            accessToken: 'demo-token',
            tokenExpiry: Date.now() + 30 * 60 * 1000, // 30 min demo session
            bookmarkedEvents: user.bookmarkedEvents,
            rsvpedEvents: user.rsvpedEvents,
            xp: user.xp,
            level: getLevelFromXP(user.xp),
            interests: user.interests,
            notifications,
            unreadCount,
          });
          get().checkStreak();
          return true;
        }
        return false;
      },

      logout: () => {
        set((state) => {
          const uid = state.currentUser?.id;
          return {
            currentUser: null,
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
            tokenExpiry: null,
            bookmarkedEvents: [],
            rsvpedEvents: [],
            xp: 0,
            level: 1,
            earnedBadges: [],
            currentStreak: 0,
            interests: [],
            dismissedRecommendations: [],
            unreadCount: 0,
            notifications: uid
              ? state.notifications.filter((n) => n.userId !== uid)
              : state.notifications,
          };
        });
      },

      register: async (data) => {
        // Demo mock: organizer registration requires admin approval
        return {
          success: true,
          message: data.role === 'organizer'
            ? 'Your account is under review. You will be notified once approved.'
            : 'Registration successful! Please check your email to verify your account.',
          requiresActivation: data.role === 'organizer',
          userId: `user-${Date.now()}`,
        };
      },

      refreshAccessToken: async () => {
        // No-op in demo mode
      },

      extendSession: () => {
        set({ tokenExpiry: Date.now() + 30 * 60 * 1000 });
      },

      // ── Profile ──────────────────────────────────────────────────────────────

      updateProfile: async (data) => {
        set((state) => ({
          currentUser: state.currentUser ? { ...state.currentUser, ...data } : null,
          interests: data.interests ?? state.interests,
        }));
      },

      changePassword: async (_currentPassword, _newPassword) => {
        // No-op in demo mode — would call PUT /auth/change-password
      },

      requestOrganizerStatus: (eventId, reason) => {
        const { currentUser, events } = get();
        if (!currentUser || currentUser.role !== 'attendee') return;
        const event = events.find((e) => e.id === eventId);
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
          reason,
        };

        const adminNotification: Notification = {
          id: `notif-${Date.now()}`,
          userId: 'user-003',
          type: 'organizer_request',
          title: 'New Organizer Request',
          message: `${currentUser.name} requested organizer status for "${event.title}". Review now.`,
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: '/admin/users',
          icon: '👤',
        };

        set((state) => ({
          organizerRequests: [...state.organizerRequests, newRequest],
          currentUser: {
            ...currentUser,
            organizerStatus: 'pending',
            organizerRequestEventId: eventId,
          },
          notifications: [adminNotification, ...state.notifications],
        }));
      },

      approveOrganizerRequest: (requestId, adminNotes) => {
        const { organizerRequests } = get();
        const request = organizerRequests.find((r) => r.id === requestId);
        if (!request) return;

        const updatedRequests = organizerRequests.map((r) =>
          r.id === requestId ? { ...r, status: 'approved' as const, adminNotes } : r
        );

        const userNotification: Notification = {
          id: `notif-${Date.now()}`,
          userId: request.userId,
          type: 'organizer_approved',
          title: 'Organizer Request Approved! 🎉',
          message: `Your request to become an organizer for "${request.eventTitle}" has been approved.`,
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: '/organizer/dashboard',
          icon: '✅',
        };

        const messageNotification: Notification = {
          id: `notif-msg-${Date.now()}`,
          userId: request.userId,
          type: 'event_update',
          title: 'Message from Admin',
          message: `Your organizer request was approved. ${adminNotes || 'Welcome to the organizer community!'}`,
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: '/app/messages',
          icon: '✉️',
        };

        set((state) => ({
          organizerRequests: updatedRequests,
          notifications: [messageNotification, userNotification, ...state.notifications],
        }));
      },

      rejectOrganizerRequest: (requestId, adminNotes) => {
        const { organizerRequests } = get();
        const request = organizerRequests.find((r) => r.id === requestId);
        if (!request) return;

        const updatedRequests = organizerRequests.map((r) =>
          r.id === requestId ? { ...r, status: 'rejected' as const, adminNotes } : r
        );

        const userNotification: Notification = {
          id: `notif-${Date.now()}`,
          userId: request.userId,
          type: 'organizer_rejected',
          title: 'Organizer Request Update',
          message: `Your request for "${request.eventTitle}" was not approved at this time.`,
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: '/app/messages',
          icon: 'ℹ️',
        };

        set((state) => ({
          organizerRequests: updatedRequests,
          notifications: [userNotification, ...state.notifications],
        }));
      },

      // ── Events ───────────────────────────────────────────────────────────────

      rsvpEvent: (eventId) => {
        set((state) => {
          if (state.rsvpedEvents.includes(eventId)) return state;

          const event = state.events.find((e) => e.id === eventId);
          const bookingExists = state.bookings.some((b) => b.eventId === eventId);
          const firstTicket = event?.ticketTypes[0];

          const newBooking = !bookingExists && event
            ? [{
                id: `booking-${Date.now()}`,
                eventId: event.id,
                userId: state.currentUser?.id || 'guest',
                tickets: [{
                  type: firstTicket?.name || 'General Admission',
                  qty: 1,
                  unitPrice: firstTicket?.price || 0,
                  subtotal: firstTicket?.price || 0,
                }],
                serviceFee: Number(((firstTicket?.price || 0) * 0.03).toFixed(2)),
                discount: 0,
                total: Number((firstTicket?.price || 0) * 1.03),
                currency: 'EGP',
                paymentMethod: { brand: 'Visa', last4: '4242' },
                status: 'confirmed' as const,
                qrData: {
                  bookingId: `EVT-${Date.now()}`,
                  userId: state.currentUser?.id || 'guest',
                  eventId: event.id,
                  valid: true,
                },
                bookingRef: `EVT-${Date.now()}`,
                createdAt: new Date().toISOString(),
              }]
            : [];

          const newRsvpCount = state.rsvpedEvents.length + 1;
          const behaviorType: UserBehaviorType =
            newRsvpCount >= 5 ? 'gamified' : newRsvpCount >= 2 ? 'fomo' : state.userBehaviorType;

          const xpAmount = XP_TABLE.rsvp;
          const newXP = state.xp + xpAmount;
          const newLevel = getLevelFromXP(newXP);
          const newPoints = state.pointsBalance + POINTS_TABLE.rsvp;

          return {
            rsvpedEvents: [...state.rsvpedEvents, eventId],
            bookings: bookingExists ? state.bookings : [...state.bookings, ...newBooking],
            userBehaviorType: behaviorType,
            engagementActions: state.engagementActions + 1,
            xp: newXP,
            level: newLevel,
            pointsBalance: newPoints,
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
        get().checkStreak();
      },

      rsvpEventFull: async (eventId, ticketTypeId, quantity) => {
        const state = get();
        if (state.rsvpedEvents.includes(eventId)) return null;

        const event = state.events.find((e) => e.id === eventId);
        const ticketType = event?.ticketTypes.find((t) => t.name === ticketTypeId) || event?.ticketTypes[0];
        if (!event) return null;

        const unitPrice = ticketType?.price || 0;
        const subtotal = unitPrice * quantity;
        const serviceFee = Number((subtotal * 0.03).toFixed(2));

        const booking: Booking = {
          id: `booking-${Date.now()}`,
          eventId,
          userId: state.currentUser?.id || 'guest',
          tickets: [{ type: ticketType?.name || 'General Admission', qty: quantity, unitPrice, subtotal }],
          serviceFee,
          discount: 0,
          total: subtotal + serviceFee,
          currency: 'EGP',
          paymentMethod: { brand: 'Visa', last4: '4242' },
          status: 'confirmed',
          qrData: { bookingId: `EVT-${Date.now()}`, userId: state.currentUser?.id || 'guest', eventId, valid: true },
          bookingRef: `EVT-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };

        const xpAmount = XP_TABLE.rsvp;
        const newXP = state.xp + xpAmount;
        const newLevel = getLevelFromXP(newXP);

        set((s) => ({
          rsvpedEvents: [...s.rsvpedEvents, eventId],
          bookings: [...s.bookings, booking as typeof mockBookings[0]],
          xp: newXP,
          level: newLevel,
          pointsBalance: s.pointsBalance + POINTS_TABLE.rsvp,
          currentUser: s.currentUser
            ? { ...s.currentUser, rsvpedEvents: [...s.currentUser.rsvpedEvents, eventId], xp: newXP, level: newLevel }
            : s.currentUser,
        }));
        get().checkStreak();
        return booking;
      },

      cancelBooking: async (bookingId) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' } : b
          ),
          rsvpedEvents: (() => {
            const booking = state.bookings.find((b) => b.id === bookingId);
            return booking ? state.rsvpedEvents.filter((id) => id !== booking.eventId) : state.rsvpedEvents;
          })(),
        }));
      },

      toggleBookmark: (eventId) => {
        const wasBookmarked = get().bookmarkedEvents.includes(eventId);
        set((state) => {
          const isBookmarked = state.bookmarkedEvents.includes(eventId);
          const updatedBookmarks = isBookmarked
            ? state.bookmarkedEvents.filter((id) => id !== eventId)
            : [...state.bookmarkedEvents, eventId];

          const newBookmarkCount = updatedBookmarks.length;
          const behaviorType: UserBehaviorType =
            newBookmarkCount >= 5 ? 'community' : state.userBehaviorType;

          return {
            bookmarkedEvents: updatedBookmarks,
            userBehaviorType: behaviorType,
            currentUser: state.currentUser
              ? { ...state.currentUser, bookmarkedEvents: updatedBookmarks }
              : state.currentUser,
          };
        });
        if (!wasBookmarked) {
          get().awardXP(XP_TABLE.bookmark, 'bookmark');
        }
      },

      dismissRecommendation: (eventId) => {
        set((state) => ({
          dismissedRecommendations: [...state.dismissedRecommendations, eventId],
        }));
      },

      // ── Gamification ─────────────────────────────────────────────────────────

      awardXP: (amount, _reason) => {
        set((state) => {
          if (!state.currentUser) return state;
          const newXP = state.xp + amount;
          const newLevel = getLevelFromXP(newXP);

          // Check badge unlocks
          const earnedBadgeIds = new Set(state.earnedBadges.map((b) => b.id));
          const newBadges: Badge[] = [];

          // First Attendee — first RSVP
          if (!earnedBadgeIds.has('badge-001') && state.rsvpedEvents.length >= 1) {
            const badge = BADGE_DEFINITIONS.find((b) => b.id === 'badge-001');
            if (badge) newBadges.push({ ...badge, unlockedAt: new Date().toISOString() });
          }
          // Community Builder — 3+ discussions
          if (!earnedBadgeIds.has('badge-003') && state.discussionCount >= 3) {
            const badge = BADGE_DEFINITIONS.find((b) => b.id === 'badge-003');
            if (badge) newBadges.push({ ...badge, unlockedAt: new Date().toISOString() });
          }

          return {
            xp: newXP,
            level: newLevel,
            engagementActions: state.engagementActions + 1,
            earnedBadges: [...state.earnedBadges, ...newBadges],
            currentUser: { ...state.currentUser, xp: newXP, level: newLevel },
          };
        });
      },

      checkStreak: () => {
        set((state) => {
          const today = new Date().toISOString().slice(0, 10);
          const last = state.lastActivityDate;

          if (last === today) return state; // already recorded today

          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const newStreak = last === yesterday ? state.currentStreak + 1 : 1;
          const newLongest = Math.max(state.longestStreak, newStreak);

          // Award streak bonus at 7 days
          const shouldBonus = newStreak === 7 || (newStreak > 7 && newStreak % 7 === 0);
          const bonusXP = shouldBonus ? XP_TABLE.streak_bonus : 0;
          const bonusPoints = shouldBonus ? POINTS_TABLE.streak_bonus : 0;

          const newXP = state.xp + bonusXP;
          const newLevel = getLevelFromXP(newXP);

          return {
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastActivityDate: today,
            xp: newXP,
            level: newLevel,
            pointsBalance: state.pointsBalance + bonusPoints,
          };
        });
      },

      recordBrowse: () => {
        set((state) => {
          const newBrowseCount = state.browseCount + 1;
          const behaviorType =
            newBrowseCount > 10 && state.rsvpedEvents.length === 0 ? 'passive' : state.userBehaviorType;
          return { browseCount: newBrowseCount, userBehaviorType: behaviorType };
        });
      },

      recordDiscussion: () => {
        set((state) => {
          const newCount = state.discussionCount + 1;
          const behaviorType: UserBehaviorType = newCount >= 3 ? 'community' : state.userBehaviorType;
          return { discussionCount: newCount, userBehaviorType: behaviorType };
        });
        get().awardXP(XP_TABLE.discussion, 'discussion');
      },

      detectBehaviorType: (): UserBehaviorType => {
        const { rsvpedEvents, bookmarkedEvents, discussionCount: discussions, browseCount: browses, xp } = get();
        const rsvpCount = rsvpedEvents.length;
        const bookmarkCount = bookmarkedEvents.length;

        if (xp > 1000 || rsvpCount > 5) return 'gamified';
        if (discussions >= 3 || bookmarkCount > 5) return 'community';
        if (rsvpCount > 0 && browses > 5) return 'fomo';
        return 'passive';
      },

      updateBehaviorType: () => {
        const type = get().detectBehaviorType();
        set({ userBehaviorType: type });
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
              { id: rewardId, title: reward.title, redeemedAt: new Date().toISOString() },
              ...state.rewardHistory,
            ],
          };
        });
      },

      // ── Notifications ─────────────────────────────────────────────────────────

      markNotificationAsRead: (notificationId) => {
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          );
          const uid = state.currentUser?.id;
          const unreadCount = notifications.filter((n) => !n.isRead && n.userId === uid).length;
          return { notifications, unreadCount };
        });
      },

      markAllRead: () => {
        set((state) => {
          const uid = state.currentUser?.id;
          const notifications = state.notifications.map((n) =>
            n.userId === uid ? { ...n, isRead: true } : n
          );
          return { notifications, unreadCount: 0 };
        });
      },

      clearMyNotifications: () => {
        const uid = get().currentUser?.id;
        if (!uid) return;
        set((state) => ({
          notifications: state.notifications.filter((n) => n.userId !== uid),
          unreadCount: 0,
        }));
      },

      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        set((state) => {
          const notifications = [newNotification, ...state.notifications];
          const uid = state.currentUser?.id;
          const unreadCount = notifications.filter((n) => !n.isRead && n.userId === uid).length;
          return { notifications, unreadCount };
        });
      },

      fetchNotifications: async () => {
        // No-op in demo mode — notifications come from mock data on login
      },

      // ── UI ────────────────────────────────────────────────────────────────────

      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }));
      },

      setActiveModal: (modal) => {
        set({ activeModal: modal });
      },

      // ── Admin ─────────────────────────────────────────────────────────────────

      updateSystemConfig: (config) => {
        set((state) => ({
          systemConfig: { ...state.systemConfig, ...config },
        }));
      },
    }),
    {
      name: 'eventra-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenExpiry: state.tokenExpiry,
        bookmarkedEvents: state.bookmarkedEvents,
        rsvpedEvents: state.rsvpedEvents,
        bookings: state.bookings,
        organizerRequests: state.organizerRequests,
        pointsBalance: state.pointsBalance,
        rewardHistory: state.rewardHistory,
        xp: state.xp,
        level: state.level,
        earnedBadges: state.earnedBadges,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastActivityDate: state.lastActivityDate,
        userBehaviorType: state.userBehaviorType,
        engagementActions: state.engagementActions,
        browseCount: state.browseCount,
        discussionCount: state.discussionCount,
        interests: state.interests,
        locationEnabled: state.locationEnabled,
        userCity: state.userCity,
        userCoordinates: state.userCoordinates,
        dismissedRecommendations: state.dismissedRecommendations,
        notifications: state.notifications,
        theme: state.theme,
        systemConfig: state.systemConfig,
      }),
    }
  )
);
