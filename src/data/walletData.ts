import type { UserWallet, WalletTransaction, PayoutMethod, PayoutRequest } from '../types';

// ── Attendee wallet (Sarah, user-001) ────────────────────────────────────────

export const sarahWallet: UserWallet = {
  userId: 'user-001',
  balance: 250,
  currency: 'EGP',
  status: 'active',
  payoutMethods: [],
};

export const sarahTransactions: WalletTransaction[] = [
  { id: 'wt-001', userId: 'user-001', type: 'deposit',    amount: 500,  balanceAfter: 500,  description: 'Deposit via Visa ****4242',                       createdAt: '2026-04-01T10:00:00Z' },
  { id: 'wt-002', userId: 'user-001', type: 'payment',    amount: -309, balanceAfter: 191,  description: 'Payment for Cairo Jazz Night',   referenceId: 'booking-001', createdAt: '2026-04-10T14:20:00Z' },
  { id: 'wt-003', userId: 'user-001', type: 'refund',     amount: 100,  balanceAfter: 291,  description: 'Partial refund — cancelled 1 ticket', referenceId: 'booking-001', createdAt: '2026-04-15T09:00:00Z' },
  { id: 'wt-004', userId: 'user-001', type: 'deposit',    amount: 300,  balanceAfter: 591,  description: 'Deposit via Mastercard ****5151',                  createdAt: '2026-04-20T16:00:00Z' },
  { id: 'wt-005', userId: 'user-001', type: 'payment',    amount: -180, balanceAfter: 411,  description: 'Payment for AI Summit 2026',     referenceId: 'booking-002', createdAt: '2026-04-25T11:30:00Z' },
  { id: 'wt-006', userId: 'user-001', type: 'withdrawal', amount: -200, balanceAfter: 211,  description: 'Withdrawal to linked bank account',                createdAt: '2026-04-28T08:00:00Z' },
  { id: 'wt-007', userId: 'user-001', type: 'refund',     amount: 90,   balanceAfter: 301,  description: 'Refund — booking cancelled',     referenceId: 'booking-003', createdAt: '2026-05-02T13:00:00Z' },
  { id: 'wt-008', userId: 'user-001', type: 'payment',    amount: -51,  balanceAfter: 250,  description: 'Payment for Food Festival ticket', referenceId: 'booking-004', createdAt: '2026-05-10T15:45:00Z' },
];

// ── Organizer wallet (Ahmed, user-002) ───────────────────────────────────────

export const ahmedPayoutMethod: PayoutMethod = {
  id: 'pm-001',
  userId: 'user-002',
  type: 'bank_transfer',
  details: { accountName: 'Ahmed Hassan', accountNumber: '1234567890', bankName: 'CIB Egypt' },
  isDefault: true,
  createdAt: '2026-03-01T00:00:00Z',
};

export const ahmedWallet: UserWallet = {
  userId: 'user-002',
  balance: 12500,
  currency: 'EGP',
  status: 'active',
  payoutMethods: [ahmedPayoutMethod],
};

export const ahmedTransactions: WalletTransaction[] = [
  { id: 'wt-101', userId: 'user-002', type: 'earning', amount: 2850,  balanceAfter: 2850,  description: 'Earnings — Cairo Jazz Night (19 tickets)',    referenceId: 'booking-001', createdAt: '2026-04-01T00:00:00Z' },
  { id: 'wt-102', userId: 'user-002', type: 'fee',     amount: -150,  balanceAfter: 2700,  description: 'Platform fee (5%) — Cairo Jazz Night',                           createdAt: '2026-04-01T00:01:00Z' },
  { id: 'wt-103', userId: 'user-002', type: 'earning', amount: 3200,  balanceAfter: 5900,  description: 'Earnings — AI Summit 2026 (32 tickets)',      referenceId: 'booking-002', createdAt: '2026-04-15T00:00:00Z' },
  { id: 'wt-104', userId: 'user-002', type: 'fee',     amount: -168,  balanceAfter: 5732,  description: 'Platform fee (5%) — AI Summit 2026',                             createdAt: '2026-04-15T00:01:00Z' },
  { id: 'wt-105', userId: 'user-002', type: 'earning', amount: 1900,  balanceAfter: 7632,  description: 'Earnings — Street Food Festival (12 tickets)',                    createdAt: '2026-04-20T00:00:00Z' },
  { id: 'wt-106', userId: 'user-002', type: 'fee',     amount: -100,  balanceAfter: 7532,  description: 'Platform fee (5%) — Street Food Festival',                       createdAt: '2026-04-20T00:01:00Z' },
  { id: 'wt-107', userId: 'user-002', type: 'payout',  amount: -3000, balanceAfter: 4532,  description: 'Payout to CIB Egypt ****7890',               referenceId: 'pr-001',       createdAt: '2026-04-28T10:00:00Z' },
  { id: 'wt-108', userId: 'user-002', type: 'earning', amount: 4500,  balanceAfter: 9032,  description: 'Earnings — Tech Summit Cairo (30 tickets)',                       createdAt: '2026-05-01T00:00:00Z' },
  { id: 'wt-109', userId: 'user-002', type: 'fee',     amount: -236,  balanceAfter: 8796,  description: 'Platform fee (5%) — Tech Summit Cairo',                          createdAt: '2026-05-01T00:01:00Z' },
  { id: 'wt-110', userId: 'user-002', type: 'earning', amount: 3704,  balanceAfter: 12500, description: 'Earnings — Photo Walk event (8 tickets)',                        createdAt: '2026-05-08T00:00:00Z' },
];

// ── Pending payout requests (for admin to approve) ───────────────────────────

export const mockPayoutRequests: PayoutRequest[] = [
  {
    id: 'pr-002',
    organizerId: 'user-002',
    organizerName: 'Ahmed Hassan',
    amount: 5000,
    methodId: 'pm-001',
    method: ahmedPayoutMethod,
    status: 'pending',
    notes: 'Monthly withdrawal',
    requestedAt: '2026-05-12T10:00:00Z',
  },
  {
    id: 'pr-003',
    organizerId: 'user-005',
    organizerName: 'Mona Samir',
    amount: 1800,
    methodId: 'pm-002',
    method: {
      id: 'pm-002',
      userId: 'user-005',
      type: 'vodafone_cash',
      details: { accountName: 'Mona Samir', accountNumber: '01012345678', phone: '01012345678' },
      isDefault: true,
      createdAt: '2026-04-01T00:00:00Z',
    },
    status: 'pending',
    requestedAt: '2026-05-14T08:30:00Z',
  },
  {
    id: 'pr-004',
    organizerId: 'user-006',
    organizerName: 'Tarek Nasser',
    amount: 750,
    methodId: 'pm-003',
    method: {
      id: 'pm-003',
      userId: 'user-006',
      type: 'instapay',
      details: { accountName: 'Tarek Nasser', accountNumber: 'tarek.nasser@instapay' },
      isDefault: true,
      createdAt: '2026-04-15T00:00:00Z',
    },
    status: 'pending',
    requestedAt: '2026-05-15T12:00:00Z',
  },
];

// ── Initial wallets record (keyed by userId) ──────────────────────────────────

export const initialWallets: Record<string, UserWallet> = {
  'user-001': sarahWallet,
  'user-002': ahmedWallet,
};

// ── All mock transactions ─────────────────────────────────────────────────────

export const initialWalletTransactions: WalletTransaction[] = [
  ...sarahTransactions,
  ...ahmedTransactions,
];

// ── Platform fee summary constants (for AdminWallet) ─────────────────────────

export const MOCK_PLATFORM_FEES_TOTAL = 3400;
export const MOCK_PLATFORM_FEES_MONTH = 654;
