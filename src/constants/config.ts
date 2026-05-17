import type { SystemConfig } from '../types';

export const DEFAULT_SYSTEM_CONFIG: SystemConfig = {
  cancellationWindowHours: 48,
  reminderIntervals: [24, 1],
  xpPerRSVP: 10,
  xpPerAttendance: 50,
  xpPerDiscussion: 15,
  streakBonusMultiplier: 2,
  maxTicketsPerBooking: 10,
  ticketHoldTimeoutMinutes: 15,
  aiRecommendationsEnabled: true,
  aiChatEnabled: true,
  aiFraudDetectionEnabled: true,
  platformName: 'Eventra',
  contactEmail: 'support@eventra.com',
  currencySymbol: 'EGP',
  platformFeePercentage: 5,
};

export const XP_TABLE = {
  rsvp: 10,
  attendance: 50,
  discussion: 15,
  bookmark: 5,
  signup: 50,
  streak_bonus: 100,
  share: 10,
  review: 20,
  referral: 200,
} as const;

export const POINTS_TABLE = {
  rsvp: 5,
  attendance: 25,
  discussion: 5,
  bookmark: 2,
  streak_bonus: 50,
  share: 5,
  review: 10,
  referral: 100,
} as const;
