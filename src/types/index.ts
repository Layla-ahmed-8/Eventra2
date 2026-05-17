// Central TypeScript type definitions — spec §5, §6, §8, §13, §15, §16
// Re-exports types from data files for backward compatibility.

export type { User, OrganizerRequest } from '../data/users';
export type {
  Event,
  EngagementData,
  ActivitySignal,
  SocialAttendee,
  UserBehaviorType,
} from '../data/mockData';

// ── Auth ─────────────────────────────────────────────────────────────────────

export type AccountStatus = 'active' | 'pending' | 'suspended' | 'banned';

export type AuthErrorCode =
  | 'ACCOUNT_PENDING'
  | 'ACCOUNT_SUSPENDED'
  | 'ACCOUNT_BANNED'
  | 'INVALID_CREDENTIALS'
  | 'TOO_MANY_ATTEMPTS'
  | 'EMAIL_NOT_VERIFIED';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: 'attendee' | 'organizer';
  phone: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  requiresActivation: boolean;
  userId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: import('../data/users').User;
}

// ── Events ────────────────────────────────────────────────────────────────────

export type EventStatus = 'draft' | 'pending_approval' | 'published' | 'rejected' | 'suspended';

export type OrganizerVerificationStatus = 'standard' | 'verified';

// ── Bookings ──────────────────────────────────────────────────────────────────

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  tickets: Array<{
    type: string;
    qty: number;
    unitPrice: number;
    subtotal: number;
  }>;
  serviceFee: number;
  discount: number;
  total: number;
  currency: string;
  paymentMethod: { brand: string; last4: string };
  status: BookingStatus;
  qrData: { bookingId: string; userId: string; eventId: string; valid: boolean };
  bookingRef: string;
  createdAt: string;
}

export interface HoldResponse {
  holdId: string;
  expiresAt: Date;
  tickets: { ticketTypeId: string; quantity: number; price: number }[];
  totalAmount: number;
}

// ── Gamification ──────────────────────────────────────────────────────────────

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type XPReason =
  | 'rsvp'
  | 'attendance'
  | 'discussion'
  | 'bookmark'
  | 'signup'
  | 'streak_bonus'
  | 'share'
  | 'review'
  | 'referral';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  tier: BadgeTier;
  xpBonus: number;
  unlockedAt?: string;
}

export interface Redemption {
  id: string;
  title: string;
  pointsCost: number;
  redeemedAt: string;
}

// ── Notifications ─────────────────────────────────────────────────────────────

export type { Notification } from '../data/notifications';

// ── Admin ─────────────────────────────────────────────────────────────────────

export type AuditAction =
  | 'approve_event'
  | 'reject_event'
  | 'approve_organizer'
  | 'reject_organizer'
  | 'grant_verified'
  | 'suspend_user'
  | 'ban_user'
  | 'unsuspend_user'
  | 'config_change'
  | 'content_approve'
  | 'content_remove'
  | 'content_warn'
  | 'booking_cancel'
  | 'refund_failure'
  | 'user_login'
  | 'user_logout';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminId: string;
  adminEmail: string;
  action: AuditAction;
  targetType: 'user' | 'event' | 'booking' | 'config';
  targetId: string;
  previousState?: unknown;
  newState?: unknown;
  ipAddress: string;
}

// ── System Config ─────────────────────────────────────────────────────────────

export interface SystemConfig {
  cancellationWindowHours: number;
  reminderIntervals: number[];
  xpPerRSVP: number;
  xpPerAttendance: number;
  xpPerDiscussion: number;
  streakBonusMultiplier: number;
  maxTicketsPerBooking: number;
  ticketHoldTimeoutMinutes: number;
  aiRecommendationsEnabled: boolean;
  aiChatEnabled: boolean;
  aiFraudDetectionEnabled: boolean;
  platformName: string;
  contactEmail: string;
  currencySymbol: string;
  platformFeePercentage: number;
}
