import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockEvents, mockBookings, mockCommunities, Event, UserBehaviorType } from '../data/mockData';
import { User, demoAccounts, mockOrganizerRequests, OrganizerRequest } from '../data/users';
import { getNotificationsForUser, Notification } from '../data/notifications';
import type { Badge, RegisterRequest, RegisterResponse, Booking, XPReason, UserWallet, WalletTransaction, PayoutRequest, PayoutMethod, EventMessage, DirectMessage, BroadcastMessage, DMThread, CommunityMessage, CommunityPost } from '../types';
import { BADGE_DEFINITIONS } from '../constants/badges';
import { XP_TABLE, POINTS_TABLE, DEFAULT_SYSTEM_CONFIG } from '../constants/config';
import type { SystemConfig } from '../types';
import { initialWallets, initialWalletTransactions, mockPayoutRequests } from '../data/walletData';
import { initialManagedUsers } from '../data/adminUsersData';
import type { ManagedUser } from '../data/adminUsersData';
import { initialEventMessages } from '../data/eventChatData';
import { initialDirectMessages, initialBroadcastMessages } from '../data/messagesData';
import { initialCommunityMessages, initialCommunityPosts } from '../data/communityData';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PersonalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  type: 'personal' | 'reminder';
  category: string;
  createdAt: string;
}

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

  // ── WALLET (persisted) ──────────────────────────────────────────────────────
  wallets: Record<string, UserWallet>;
  walletTransactions: WalletTransaction[];
  payoutRequests: PayoutRequest[];

  // ── EVENT CHAT (persisted) ──────────────────────────────────────────────────
  eventMessages: Record<string, EventMessage[]>;

  // ── COMMUNITY CHAT & POSTS (persisted) ──────────────────────────────────────
  communityMessages: Record<string, CommunityMessage[]>;
  communityPosts: Record<string, CommunityPost[]>;
  communityXP: number; // total XP earned from community actions
  postsCount: number;  // total posts/replies created by user

  // ── DIRECT MESSAGING (persisted) ────────────────────────────────────────────
  directMessages: DirectMessage[];
  broadcastMessages: BroadcastMessage[];

  // ── USER MANAGEMENT (persisted) ──────────────────────────────────────────────
  managedUsers: ManagedUser[];

  // ── ONBOARDING (persisted) ──────────────────────────────────────────────────
  onboardingCompleted: boolean;

  // ── REGISTERED USERS (persisted) ────────────────────────────────────────────
  registeredUsers: User[];

  // ── PERSONAL CALENDAR EVENTS (persisted) ────────────────────────────────────
  personalEvents: PersonalEvent[];

  // ── ACTIONS ─────────────────────────────────────────────────────────────────

  // Auth
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  refreshAccessToken: () => Promise<void>;
  setOnboardingCompleted: (val: boolean) => void;

  // Profile
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  requestOrganizerStatus: (eventId: string, reason: string) => void;
  approveOrganizerRequest: (requestId: string, adminNotes: string) => void;
  rejectOrganizerRequest: (requestId: string, adminNotes: string) => void;

  // Events
  toggleBookmark: (eventId: string) => void;
  rsvpEvent: (eventId: string) => void;
  rsvpEventFull: (eventId: string, ticketTypeId: string | undefined, quantity: number, paymentSource?: 'card' | 'wallet') => Promise<Booking | null>;
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

  // Wallet
  getWallet: (userId?: string) => UserWallet | null;
  addFunds: (amount: number, paymentDetails: { brand: string; last4: string }) => void;
  payWithWallet: (amount: number, bookingId: string) => boolean;
  refundToWallet: (amount: number, bookingId: string, reason?: string) => void;
  withdrawFunds: (amount: number) => void;
  requestPayout: (amount: number, methodId: string) => boolean;
  approvePayoutRequest: (requestId: string, adminNotes?: string) => void;
  rejectPayoutRequest: (requestId: string, adminNotes: string) => void;
  addPayoutMethod: (method: Omit<PayoutMethod, 'id' | 'createdAt'>) => void;
  removePayoutMethod: (methodId: string) => void;
  recordOrganizerEarning: (bookingId: string, grossAmount: number, organizerId: string) => void;

  // Event Chat
  sendEventMessage: (eventId: string, content: string) => void;
  deleteEventMessage: (eventId: string, messageId: string) => void;
  getEventMessages: (eventId: string) => EventMessage[];

  // Organizer notifications
  notifyOrganizerNewBooking: (organizerId: string, eventName: string, attendeeName: string, bookingId: string) => void;
  notifyOrganizerEventDecision: (organizerId: string, eventName: string, status: 'approved' | 'rejected', reason?: string) => void;
  notifyOrganizerPayoutUpdate: (organizerId: string, amount: number, status: 'approved' | 'rejected', reason?: string) => void;
  notifyOrganizerNewChatMessage: (organizerId: string, eventId: string, eventName: string, attendeeName: string, messagePreview: string) => void;

  // Organizer inbox
  getOrganizerInbox: (organizerId: string) => Array<{
    attendeeId: string;
    attendeeName: string;
    attendeeAvatar?: string;
    eventId: string;
    eventName: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
  }>;

  // User management (admin)
  suspendUser: (userId: string, reason: string, suspendUntil?: string) => void;
  unsuspendUser: (userId: string) => void;
  banUser: (userId: string, reason: string) => void;
  grantVerifiedStatus: (userId: string) => void;
  sendAdminMessageToUser: (userId: string, userName: string, subject: string, body: string) => void;
  forcePasswordReset: (userId: string, userName: string) => void;

  // Personal calendar events
  addPersonalEvent: (event: Omit<PersonalEvent, 'id' | 'createdAt'>) => void;
  removePersonalEvent: (eventId: string) => void;

  // Communities
  toggleJoinCommunity: (communityId: string) => void;
  sendCommunityMessage: (communityId: string, content: string) => void;
  getCommunityMessages: (communityId: string) => CommunityMessage[];
  getCommunityPosts: (communityId: string) => CommunityPost[];
  addCommunityPost: (communityId: string, title: string, body: string, imageUrl?: string) => CommunityPost;
  addCommunityReply: (communityId: string, postId: string, content: string) => void;
  togglePostReaction: (communityId: string, postId: string, emoji: string) => void;

  // Direct messaging
  sendDirectMessage: (receiverId: string, receiverName: string, receiverRole: 'attendee' | 'organizer' | 'admin', content: string) => void;
  sendBroadcastMessage: (subject: string, content: string, targetRole: 'attendee' | 'organizer') => void;
  getDirectConversation: (userId: string) => DirectMessage[];
  getMyDMThreads: () => DMThread[];
  getMyBroadcasts: () => BroadcastMessage[];
  markConversationRead: (userId: string) => void;
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

      onboardingCompleted: false,
      registeredUsers: [...demoAccounts],
      personalEvents: [],

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

      wallets: initialWallets,
      walletTransactions: initialWalletTransactions,
      payoutRequests: mockPayoutRequests,
      eventMessages: initialEventMessages,
      communityMessages: initialCommunityMessages,
      communityPosts: initialCommunityPosts,
      communityXP: 0,
      postsCount: 0,
      directMessages: initialDirectMessages,
      broadcastMessages: initialBroadcastMessages,
      managedUsers: initialManagedUsers,

      // ── Auth ────────────────────────────────────────────────────────────────

      login: async (email, password) => {
        // TODO: replace with → const { user, accessToken, refreshToken } = await api.post('/auth/login', { email, password });
        const user = get().registeredUsers.find((u) => u.email === email && u.password === password);
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
            onboardingCompleted: user.onboardingCompleted ?? false,
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
            onboardingCompleted: false,
            dismissedRecommendations: [],
            unreadCount: 0,
            notifications: uid
              ? state.notifications.filter((n) => n.userId !== uid)
              : state.notifications,
          };
        });
      },

      register: async (data) => {
        const existing = get().registeredUsers.find((u) => u.email === data.email);
        if (existing) {
          return { success: false, message: 'An account with this email already exists.' };
        }

        const newUser: User = {
          id: `user-reg-${Date.now()}`,
          name: data.name,
          email: data.email,
          password: data.password,
          avatar: `https://i.pravatar.cc/150?u=${data.email}`,
          role: data.role,
          interests: [],
          location: '',
          radius: 15,
          joinDate: new Date().toISOString(),
          level: 1,
          xp: 0,
          badges: [],
          rsvpedEvents: [],
          bookmarkedEvents: [],
          onboardingCompleted: false,
          organizerStatus: data.role === 'organizer' ? 'pending' : undefined,
        };

        set((state) => ({ registeredUsers: [...state.registeredUsers, newUser] }));

        return {
          success: true,
          message: data.role === 'organizer'
            ? 'Your account is under review. You will be notified once approved.'
            : 'Account created! Sign in to continue.',
          requiresActivation: data.role === 'organizer',
          userId: newUser.id,
        };
      },

      refreshAccessToken: async () => {
        // No-op in demo mode
      },

      extendSession: () => {
        set({ tokenExpiry: Date.now() + 30 * 60 * 1000 });
      },

      setOnboardingCompleted: (val) => {
        set((state) => ({
          onboardingCompleted: val,
          currentUser: state.currentUser ? { ...state.currentUser, onboardingCompleted: val } : null,
          registeredUsers: state.currentUser
            ? state.registeredUsers.map((user) =>
                user.id === state.currentUser?.id ? { ...user, onboardingCompleted: val } : user
              )
            : state.registeredUsers,
        }));
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

      rsvpEventFull: async (eventId, ticketTypeId, quantity, paymentSource = 'card') => {
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
          paymentMethod: paymentSource === 'wallet'
            ? { brand: 'Wallet', last4: '' }
            : { brand: 'Visa', last4: '4242' },
          paymentSource,
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

        if (subtotal > 0) {
          const organizerId = 'user-002';
          get().recordOrganizerEarning(booking.id, subtotal, organizerId);
        }

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
          // Community Voice — 5+ posts/replies
          if (!earnedBadgeIds.has('badge-009') && state.postsCount >= 5) {
            const badge = BADGE_DEFINITIONS.find((b) => b.id === 'badge-009');
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

      // ── Wallet ────────────────────────────────────────────────────────────────

      getWallet: (userId) => {
        const uid = userId ?? get().currentUser?.id;
        if (!uid) return null;
        return get().wallets[uid] ?? null;
      },

      addFunds: (amount, paymentDetails) => {
        const uid = get().currentUser?.id;
        if (!uid) return;
        set((state) => {
          const wallet = state.wallets[uid] ?? { userId: uid, balance: 0, currency: 'EGP', status: 'active' as const, payoutMethods: [] };
          const newBalance = wallet.balance + amount;
          const tx: WalletTransaction = {
            id: `wt-${Date.now()}`,
            userId: uid,
            type: 'deposit',
            amount,
            balanceAfter: newBalance,
            description: `Deposit via ${paymentDetails.brand} ****${paymentDetails.last4}`,
            createdAt: new Date().toISOString(),
          };
          return {
            wallets: { ...state.wallets, [uid]: { ...wallet, balance: newBalance } },
            walletTransactions: [tx, ...state.walletTransactions],
          };
        });
      },

      payWithWallet: (amount, bookingId) => {
        const uid = get().currentUser?.id;
        if (!uid) return false;
        const wallet = get().wallets[uid];
        if (!wallet || wallet.balance < amount) return false;
        set((state) => {
          const newBalance = wallet.balance - amount;
          const tx: WalletTransaction = {
            id: `wt-${Date.now()}`,
            userId: uid,
            type: 'payment',
            amount: -amount,
            balanceAfter: newBalance,
            description: `Payment for booking ${bookingId}`,
            referenceId: bookingId,
            createdAt: new Date().toISOString(),
          };
          return {
            wallets: { ...state.wallets, [uid]: { ...wallet, balance: newBalance } },
            walletTransactions: [tx, ...state.walletTransactions],
          };
        });
        return true;
      },

      refundToWallet: (amount, bookingId, reason) => {
        const uid = get().currentUser?.id;
        if (!uid) return;
        set((state) => {
          const wallet = state.wallets[uid] ?? { userId: uid, balance: 0, currency: 'EGP', status: 'active' as const, payoutMethods: [] };
          const newBalance = wallet.balance + amount;
          const tx: WalletTransaction = {
            id: `wt-${Date.now()}`,
            userId: uid,
            type: 'refund',
            amount,
            balanceAfter: newBalance,
            description: reason ?? `Refund for booking ${bookingId}`,
            referenceId: bookingId,
            createdAt: new Date().toISOString(),
          };
          return {
            wallets: { ...state.wallets, [uid]: { ...wallet, balance: newBalance } },
            walletTransactions: [tx, ...state.walletTransactions],
          };
        });
      },

      withdrawFunds: (amount) => {
        const uid = get().currentUser?.id;
        if (!uid) return;
        set((state) => {
          const wallet = state.wallets[uid];
          if (!wallet || wallet.balance < amount) return state;
          const newBalance = wallet.balance - amount;
          const tx: WalletTransaction = {
            id: `wt-${Date.now()}`,
            userId: uid,
            type: 'withdrawal',
            amount: -amount,
            balanceAfter: newBalance,
            description: 'Withdrawal to linked bank account',
            createdAt: new Date().toISOString(),
          };
          return {
            wallets: { ...state.wallets, [uid]: { ...wallet, balance: newBalance } },
            walletTransactions: [tx, ...state.walletTransactions],
          };
        });
      },

      requestPayout: (amount, methodId) => {
        const uid = get().currentUser?.id;
        if (!uid) return false;
        const wallet = get().wallets[uid];
        if (!wallet || wallet.balance < amount) return false;
        const { systemConfig } = get();
        if (amount < systemConfig.minPayoutAmount) return false;
        const method = wallet.payoutMethods.find((m) => m.id === methodId);
        if (!method) return false;

        const request: PayoutRequest = {
          id: `pr-${Date.now()}`,
          organizerId: uid,
          organizerName: get().currentUser?.name ?? '',
          amount,
          methodId,
          method,
          status: 'pending',
          requestedAt: new Date().toISOString(),
        };

        set((state) => {
          const newBalance = wallet.balance - amount;
          const tx: WalletTransaction = {
            id: `wt-${Date.now()}`,
            userId: uid,
            type: 'payout',
            amount: -amount,
            balanceAfter: newBalance,
            description: `Payout requested — ${method.details.bankName ?? method.type}`,
            referenceId: request.id,
            createdAt: new Date().toISOString(),
          };
          return {
            wallets: { ...state.wallets, [uid]: { ...wallet, balance: newBalance } },
            walletTransactions: [tx, ...state.walletTransactions],
            payoutRequests: [request, ...state.payoutRequests],
          };
        });
        return true;
      },

      approvePayoutRequest: (requestId, adminNotes) => {
        set((state) => ({
          payoutRequests: state.payoutRequests.map((r) =>
            r.id === requestId
              ? { ...r, status: 'approved' as const, adminNotes, processedAt: new Date().toISOString() }
              : r
          ),
        }));
      },

      rejectPayoutRequest: (requestId, adminNotes) => {
        const { payoutRequests } = get();
        const request = payoutRequests.find((r) => r.id === requestId);
        if (!request) return;
        set((state) => {
          const wallet = state.wallets[request.organizerId];
          const newBalance = (wallet?.balance ?? 0) + request.amount;
          const tx: WalletTransaction = {
            id: `wt-${Date.now()}`,
            userId: request.organizerId,
            type: 'refund',
            amount: request.amount,
            balanceAfter: newBalance,
            description: 'Payout rejected — funds returned',
            referenceId: requestId,
            createdAt: new Date().toISOString(),
          };
          return {
            payoutRequests: state.payoutRequests.map((r) =>
              r.id === requestId
                ? { ...r, status: 'rejected' as const, adminNotes, processedAt: new Date().toISOString() }
                : r
            ),
            wallets: wallet
              ? { ...state.wallets, [request.organizerId]: { ...wallet, balance: newBalance } }
              : state.wallets,
            walletTransactions: [tx, ...state.walletTransactions],
          };
        });
      },

      addPayoutMethod: (method) => {
        const uid = get().currentUser?.id;
        if (!uid) return;
        const newMethod: PayoutMethod = {
          ...method,
          id: `pm-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => {
          const wallet = state.wallets[uid];
          if (!wallet) return state;
          const updatedMethods = method.isDefault
            ? [...wallet.payoutMethods.map((m) => ({ ...m, isDefault: false })), newMethod]
            : [...wallet.payoutMethods, newMethod];
          return {
            wallets: { ...state.wallets, [uid]: { ...wallet, payoutMethods: updatedMethods } },
          };
        });
      },

      removePayoutMethod: (methodId) => {
        const uid = get().currentUser?.id;
        if (!uid) return;
        set((state) => {
          const wallet = state.wallets[uid];
          if (!wallet) return state;
          return {
            wallets: {
              ...state.wallets,
              [uid]: { ...wallet, payoutMethods: wallet.payoutMethods.filter((m) => m.id !== methodId) },
            },
          };
        });
      },

      // ── Event Chat ────────────────────────────────────────────────────────────

      sendEventMessage: (eventId, content) => {
        const { currentUser, events } = get();
        if (!currentUser || !content.trim()) return;

        const message: EventMessage = {
          id: `msg-${Date.now()}`,
          eventId,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          userRole: currentUser.role as 'attendee' | 'organizer' | 'admin',
          content: content.trim(),
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          eventMessages: {
            ...state.eventMessages,
            [eventId]: [...(state.eventMessages[eventId] ?? []), message],
          },
        }));

        get().awardXP(5, 'chat_message');

        // Notify organizer if the sender is an attendee
        if (currentUser.role === 'attendee') {
          const event = events.find((e) => e.id === eventId);
          if (event) {
            get().notifyOrganizerNewChatMessage(
              'user-002',
              eventId,
              event.title,
              currentUser.name,
              content.trim().slice(0, 60),
            );
          }
        }
      },

      deleteEventMessage: (eventId, messageId) => {
        const { currentUser } = get();
        if (!currentUser || (currentUser.role !== 'organizer' && currentUser.role !== 'admin')) return;
        set((state) => ({
          eventMessages: {
            ...state.eventMessages,
            [eventId]: (state.eventMessages[eventId] ?? []).filter((m) => m.id !== messageId),
          },
        }));
      },

      getEventMessages: (eventId) => {
        return get().eventMessages[eventId] ?? [];
      },

      // ── Organizer notifications ────────────────────────────────────────────────

      notifyOrganizerNewBooking: (organizerId, eventName, attendeeName, bookingId) => {
        const notification: Notification = {
          id: `notif-booking-${Date.now()}`,
          userId: organizerId,
          type: 'new_booking',
          title: 'New Booking!',
          message: `${attendeeName} just booked a ticket for "${eventName}".`,
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: '/organizer/events',
          icon: '🎟️',
        };
        set((state) => {
          const notifications = [notification, ...state.notifications];
          const uid = state.currentUser?.id;
          const unreadCount = notifications.filter((n) => !n.isRead && n.userId === uid).length;
          return { notifications, unreadCount };
        });
      },

      notifyOrganizerEventDecision: (organizerId, eventName, status, reason) => {
        const notification: Notification = {
          id: `notif-event-${Date.now()}`,
          userId: organizerId,
          type: status === 'approved' ? 'event_approved' : 'event_rejected',
          title: status === 'approved' ? `Event Approved! ✅` : `Event Needs Revision`,
          message: status === 'approved'
            ? `"${eventName}" has been approved and is now live for attendees.`
            : `"${eventName}" was not approved. ${reason ? `Reason: ${reason}` : 'Please review and resubmit.'}`,
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: '/organizer/events',
          icon: status === 'approved' ? '✅' : '⚠️',
        };
        set((state) => {
          const notifications = [notification, ...state.notifications];
          const uid = state.currentUser?.id;
          const unreadCount = notifications.filter((n) => !n.isRead && n.userId === uid).length;
          return { notifications, unreadCount };
        });
      },

      notifyOrganizerPayoutUpdate: (organizerId, amount, status, reason) => {
        const notification: Notification = {
          id: `notif-payout-${Date.now()}`,
          userId: organizerId,
          type: status === 'approved' ? 'payout_approved' : 'payout_rejected',
          title: status === 'approved' ? 'Payout Approved!' : 'Payout Rejected',
          message: status === 'approved'
            ? `Your payout of EGP ${amount.toLocaleString()} has been approved and is being processed.`
            : `Your payout of EGP ${amount.toLocaleString()} was rejected. ${reason ?? 'Please contact support.'}`,
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: '/organizer/wallet',
          icon: status === 'approved' ? '💰' : '❌',
        };
        set((state) => {
          const notifications = [notification, ...state.notifications];
          const uid = state.currentUser?.id;
          const unreadCount = notifications.filter((n) => !n.isRead && n.userId === uid).length;
          return { notifications, unreadCount };
        });
      },

      notifyOrganizerNewChatMessage: (organizerId, eventId, eventName, attendeeName, messagePreview) => {
        const notification: Notification = {
          id: `notif-chat-${Date.now()}`,
          userId: organizerId,
          type: 'new_chat_message',
          title: `New message in "${eventName}"`,
          message: `${attendeeName}: ${messagePreview}`,
          timestamp: new Date().toISOString(),
          isRead: false,
          actionUrl: `/organizer/events/${eventId}/chat`,
          icon: '💬',
        };
        set((state) => {
          const notifications = [notification, ...state.notifications];
          const uid = state.currentUser?.id;
          const unreadCount = notifications.filter((n) => !n.isRead && n.userId === uid).length;
          return { notifications, unreadCount };
        });
      },

      // ── Organizer inbox ───────────────────────────────────────────────────────

      getOrganizerInbox: (organizerId) => {
        const { eventMessages, events } = get();
        const threads: Record<string, {
          attendeeId: string;
          attendeeName: string;
          attendeeAvatar?: string;
          eventId: string;
          eventName: string;
          lastMessage: string;
          lastMessageAt: string;
          unreadCount: number;
        }> = {};

        Object.entries(eventMessages).forEach(([eventId, messages]) => {
          const event = events.find((e) => e.id === eventId);
          if (!event) return;

          messages
            .filter((m) => m.userRole === 'attendee')
            .forEach((m) => {
              const key = `${m.userId}-${eventId}`;
              const existing = threads[key];
              if (!existing || new Date(m.createdAt) > new Date(existing.lastMessageAt)) {
                threads[key] = {
                  attendeeId: m.userId,
                  attendeeName: m.userName,
                  attendeeAvatar: m.userAvatar,
                  eventId,
                  eventName: event.title,
                  lastMessage: m.content,
                  lastMessageAt: m.createdAt,
                  unreadCount: existing ? existing.unreadCount + 1 : 1,
                };
              }
            });
        });

        return Object.values(threads).sort(
          (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );
      },

      // ── Direct Messaging ──────────────────────────────────────────────────────

      sendDirectMessage: (receiverId, receiverName, receiverRole, content) => {
        const { currentUser } = get();
        if (!currentUser || !content.trim()) return;
        const convId = [currentUser.id, receiverId].sort().join('--');
        const msg: DirectMessage = {
          id: `dm-${Date.now()}`,
          conversationId: convId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          senderRole: currentUser.role,
          receiverId,
          receiverName,
          receiverRole,
          content: content.trim(),
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        set((state) => ({ directMessages: [...state.directMessages, msg] }));
      },

      sendBroadcastMessage: (subject, content, targetRole) => {
        const { currentUser } = get();
        if (!currentUser || !subject.trim() || !content.trim()) return;
        const broadcast: BroadcastMessage = {
          id: `bc-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentUser.role as 'organizer' | 'admin',
          targetRole,
          subject: subject.trim(),
          content: content.trim(),
          timestamp: new Date().toISOString(),
          recipientCount: 0,
        };
        set((state) => ({ broadcastMessages: [broadcast, ...state.broadcastMessages] }));
      },

      getDirectConversation: (userId) => {
        const { currentUser, directMessages } = get();
        if (!currentUser) return [];
        const convId = [currentUser.id, userId].sort().join('--');
        return directMessages
          .filter((m) => m.conversationId === convId)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      },

      getMyDMThreads: () => {
        const { currentUser, directMessages } = get();
        if (!currentUser) return [];
        const myMessages = directMessages.filter(
          (m) => m.senderId === currentUser.id || m.receiverId === currentUser.id
        );
        const threadMap = new Map<string, DMThread>();
        for (const msg of myMessages) {
          const isSender = msg.senderId === currentUser.id;
          const partnerId = isSender ? msg.receiverId : msg.senderId;
          const partnerName = isSender ? msg.receiverName : msg.senderName;
          const partnerAvatar = isSender ? undefined : msg.senderAvatar;
          const partnerRole = isSender ? msg.receiverRole : msg.senderRole;
          const isUnread = !msg.isRead && msg.receiverId === currentUser.id;
          const existing = threadMap.get(msg.conversationId);
          if (!existing) {
            threadMap.set(msg.conversationId, {
              conversationId: msg.conversationId,
              partnerId,
              partnerName,
              partnerAvatar,
              partnerRole,
              lastMessage: msg.content,
              lastMessageAt: msg.timestamp,
              unreadCount: isUnread ? 1 : 0,
            });
          } else {
            if (new Date(msg.timestamp) > new Date(existing.lastMessageAt)) {
              existing.lastMessage = msg.content;
              existing.lastMessageAt = msg.timestamp;
            }
            if (isUnread) existing.unreadCount++;
          }
        }
        return Array.from(threadMap.values()).sort(
          (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
        );
      },

      getMyBroadcasts: () => {
        const { currentUser, broadcastMessages } = get();
        if (!currentUser) return [];
        return broadcastMessages
          .filter((b) => b.targetRole === currentUser.role)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      },

      markConversationRead: (userId) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const convId = [currentUser.id, userId].sort().join('--');
        set((state) => ({
          directMessages: state.directMessages.map((m) =>
            m.conversationId === convId && m.receiverId === currentUser.id
              ? { ...m, isRead: true }
              : m
          ),
        }));
      },

      // ── Personal Calendar Events ──────────────────────────────────────────────
      addPersonalEvent: (event) => {
        const newEvent: PersonalEvent = {
          ...event,
          id: `personal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ personalEvents: [...state.personalEvents, newEvent] }));
      },

      removePersonalEvent: (eventId) => {
        set((state) => ({ personalEvents: state.personalEvents.filter((e) => e.id !== eventId) }));
      },

      // ── Communities ───────────────────────────────────────────────────────────

      toggleJoinCommunity: (communityId) => {
        set((state) => ({
          communities: state.communities.map((c) =>
            c.id === communityId
              ? { ...c, isJoined: !c.isJoined, memberCount: c.isJoined ? c.memberCount - 1 : c.memberCount + 1 }
              : c
          ),
        }));
      },

      sendCommunityMessage: (communityId, content) => {
        const { currentUser } = get();
        if (!currentUser || !content.trim()) return;
        const msg: CommunityMessage = {
          id: `comm-msg-${Date.now()}`,
          communityId,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          content: content.trim(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          communityMessages: {
            ...state.communityMessages,
            [communityId]: [...(state.communityMessages[communityId] ?? []), msg],
          },
          communityXP: state.communityXP + 5,
        }));
        get().awardXP(5, 'chat_message');
        get().checkStreak();
      },

      getCommunityMessages: (communityId) => {
        return get().communityMessages[communityId] ?? [];
      },

      getCommunityPosts: (communityId) => {
        return get().communityPosts[communityId] ?? [];
      },

      addCommunityPost: (communityId, title, body, imageUrl) => {
        const { currentUser } = get();
        const post: CommunityPost = {
          id: `comm-post-${Date.now()}`,
          communityId,
          title: title.trim(),
          body: body.trim(),
          imageUrl,
          authorId: currentUser?.id ?? 'anon',
          authorName: currentUser?.name ?? 'Anonymous',
          authorAvatar: currentUser?.avatar,
          createdAt: new Date().toISOString(),
          hot: false,
          reactions: {},
          replyCount: 0,
          replies: [],
        };
        set((state) => ({
          communityPosts: {
            ...state.communityPosts,
            [communityId]: [post, ...(state.communityPosts[communityId] ?? [])],
          },
          discussionCount: state.discussionCount + 1,
          postsCount: state.postsCount + 1,
          communityXP: state.communityXP + XP_TABLE.discussion,
          pointsBalance: state.pointsBalance + POINTS_TABLE.discussion,
        }));
        get().awardXP(XP_TABLE.discussion, 'discussion');
        get().checkStreak();
        return post;
      },

      addCommunityReply: (communityId, postId, content) => {
        const { currentUser } = get();
        if (!currentUser || !content.trim()) return;
        const reply = {
          id: `reply-${Date.now()}`,
          postId,
          communityId,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          content: content.trim(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          communityPosts: {
            ...state.communityPosts,
            [communityId]: (state.communityPosts[communityId] ?? []).map((p) =>
              p.id === postId
                ? { ...p, replies: [...p.replies, reply], replyCount: p.replyCount + 1 }
                : p
            ),
          },
          discussionCount: state.discussionCount + 1,
          postsCount: state.postsCount + 1,
          communityXP: state.communityXP + XP_TABLE.discussion,
          pointsBalance: state.pointsBalance + POINTS_TABLE.discussion,
        }));
        get().awardXP(XP_TABLE.discussion, 'discussion');
        get().checkStreak();
      },

      togglePostReaction: (communityId, postId, emoji) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const uid = currentUser.id;
        set((state) => ({
          communityPosts: {
            ...state.communityPosts,
            [communityId]: (state.communityPosts[communityId] ?? []).map((p) => {
              if (p.id !== postId) return p;
              const prev = p.reactions[emoji] ?? [];
              const already = prev.includes(uid);
              return {
                ...p,
                reactions: {
                  ...p.reactions,
                  [emoji]: already ? prev.filter((id) => id !== uid) : [...prev, uid],
                },
              };
            }),
          },
        }));
      },

      // ── User Management ───────────────────────────────────────────────────────

      suspendUser: (userId, reason, suspendUntil) => {
        const thirtyDaysOut = new Date();
        thirtyDaysOut.setDate(thirtyDaysOut.getDate() + 30);
        const until = suspendUntil || thirtyDaysOut.toISOString().slice(0, 10);
        set((state) => ({
          managedUsers: state.managedUsers.map((u) =>
            u.id === userId
              ? { ...u, status: 'suspended' as const, suspendReason: reason, suspendedUntil: until }
              : u
          ),
        }));
        const notification: Notification = {
          id: `notif-suspend-${Date.now()}`,
          userId,
          type: 'event_update',
          title: 'Account Suspended',
          message: `Your account has been suspended. Reason: ${reason}`,
          timestamp: new Date().toISOString(),
          isRead: false,
          icon: '⚠️',
        };
        set((state) => {
          const notifications = [notification, ...state.notifications];
          const uid = state.currentUser?.id;
          const unreadCount = notifications.filter((n) => !n.isRead && n.userId === uid).length;
          return { notifications, unreadCount };
        });
      },

      unsuspendUser: (userId) => {
        set((state) => ({
          managedUsers: state.managedUsers.map((u) =>
            u.id === userId
              ? { ...u, status: 'active' as const, suspendReason: undefined, suspendedUntil: undefined }
              : u
          ),
        }));
      },

      banUser: (userId, reason) => {
        set((state) => ({
          managedUsers: state.managedUsers.map((u) =>
            u.id === userId ? { ...u, status: 'banned' as const, banReason: reason } : u
          ),
        }));
      },

      grantVerifiedStatus: (userId) => {
        set((state) => ({
          managedUsers: state.managedUsers.map((u) =>
            u.id === userId ? { ...u, isVerified: true } : u
          ),
        }));
      },

      sendAdminMessageToUser: (userId, userName, subject, body) => {
        const { currentUser, managedUsers } = get();
        if (!currentUser) return;
        const notification: Notification = {
          id: `notif-adminmsg-${Date.now()}`,
          userId,
          type: 'admin_message',
          title: subject,
          message: body,
          timestamp: new Date().toISOString(),
          isRead: false,
          icon: '📩',
          actionUrl: '/app/messages',
        };
        set((state) => {
          const notifications = [notification, ...state.notifications];
          const uid = state.currentUser?.id;
          const unreadCount = notifications.filter((n) => !n.isRead && n.userId === uid).length;
          return { notifications, unreadCount };
        });
        const targetUser = managedUsers.find((u) => u.id === userId);
        const receiverRole = (targetUser?.role ?? 'attendee') as 'attendee' | 'organizer' | 'admin';
        const convId = [currentUser.id, userId].sort().join('--');
        const dm: DirectMessage = {
          id: `dm-admin-${Date.now()}`,
          conversationId: convId,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          senderRole: currentUser.role,
          receiverId: userId,
          receiverName: userName,
          receiverRole,
          content: `[${subject}]\n${body}`,
          timestamp: new Date().toISOString(),
          isRead: false,
        };
        set((state) => ({ directMessages: [...state.directMessages, dm] }));
      },

      forcePasswordReset: (userId, _userName) => {
        const notification: Notification = {
          id: `notif-pwreset-${Date.now()}`,
          userId,
          type: 'force_password_reset',
          title: 'Password Reset Required',
          message: 'An administrator has initiated a password reset. Please check your email for the reset link.',
          timestamp: new Date().toISOString(),
          isRead: false,
          icon: '🔑',
          actionUrl: '/forgot-password',
        };
        set((state) => {
          const notifications = [notification, ...state.notifications];
          const uid = state.currentUser?.id;
          const unreadCount = notifications.filter((n) => !n.isRead && n.userId === uid).length;
          return { notifications, unreadCount };
        });
      },

      recordOrganizerEarning: (bookingId, grossAmount, organizerId) => {
        const { systemConfig, wallets } = get();
        const feeRate = systemConfig.platformFeePercentage / 100;
        const fee = Number((grossAmount * feeRate).toFixed(2));
        const net = grossAmount - fee;
        const wallet = wallets[organizerId] ?? { userId: organizerId, balance: 0, currency: 'EGP', status: 'active' as const, payoutMethods: [] };
        const newBalance = wallet.balance + net;
        const now = new Date().toISOString();
        set((state) => {
          const earningTx: WalletTransaction = {
            id: `wt-earn-${Date.now()}`,
            userId: organizerId,
            type: 'earning',
            amount: net,
            balanceAfter: newBalance,
            description: `Earnings for booking ${bookingId}`,
            referenceId: bookingId,
            createdAt: now,
          };
          const feeTx: WalletTransaction = {
            id: `wt-fee-${Date.now() + 1}`,
            userId: organizerId,
            type: 'fee',
            amount: -fee,
            balanceAfter: newBalance,
            description: `Platform fee (${systemConfig.platformFeePercentage}%) for booking ${bookingId}`,
            referenceId: bookingId,
            createdAt: now,
          };
          return {
            wallets: { ...state.wallets, [organizerId]: { ...wallet, balance: newBalance } },
            walletTransactions: [feeTx, earningTx, ...state.walletTransactions],
          };
        });
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
        onboardingCompleted: state.onboardingCompleted,
        registeredUsers: state.registeredUsers,
        personalEvents: state.personalEvents,
        interests: state.interests,
        locationEnabled: state.locationEnabled,
        userCity: state.userCity,
        userCoordinates: state.userCoordinates,
        dismissedRecommendations: state.dismissedRecommendations,
        notifications: state.notifications,
        theme: state.theme,
        systemConfig: state.systemConfig,
        wallets: state.wallets,
        walletTransactions: state.walletTransactions,
        payoutRequests: state.payoutRequests,
        eventMessages: state.eventMessages,
        directMessages: state.directMessages,
        broadcastMessages: state.broadcastMessages,
        managedUsers: state.managedUsers,
      }),
    }
  )
);
