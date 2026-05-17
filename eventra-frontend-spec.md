# Eventra — Frontend Implementation Specification
> **Version 2.0 · Production-Ready · SRS v2.0 Compliant**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [Environment Variables](#4-environment-variables)
5. [Authentication System](#5-authentication-system)
6. [User Roles & Permissions](#6-user-roles--permissions)
7. [Routing Map](#7-routing-map)
8. [State Management (Zustand)](#8-state-management-zustand)
9. [API Integration Layer](#9-api-integration-layer)
10. [Component Library](#10-component-library)
11. [Feature Specifications](#11-feature-specifications)
12. [Design System](#12-design-system)
13. [Gamification System](#13-gamification-system)
14. [AI Features](#14-ai-features)
15. [Admin Configuration](#15-admin-configuration)
16. [Audit Trail](#16-audit-trail)
17. [Testing Requirements](#17-testing-requirements)
18. [Deployment & Performance](#18-deployment--performance)
19. [Demo Accounts](#19-demo-accounts)
20. [User Flows](#20-user-flows)
    - [20.1 Attendee Flows](#201-attendee-flows)
    - [20.2 Organizer Flows](#202-organizer-flows)
    - [20.3 Admin Flows](#203-admin-flows)

---

## 1. Project Overview

Eventra is an AI-native social event platform combining intelligent event discovery, community-driven engagement, gamified participation, and organizer growth tools.

### SRS Compliance Matrix

| Section | Feature | Status |
|---|---|---|
| §4.1 | User Management — RBAC, 3 roles, pending approval flow | ✅ Full |
| §4.2 | Event Management — Standard/Verified organizer workflows | ✅ Full |
| §4.3 | Event Discovery — Search, filters, favorites | ✅ Full |
| §4.4 | AI Discovery — Personalized recs + chat assistant | ✅ Full |
| §4.5 | Ticket Booking — Real-time availability + holds | ✅ Full |
| §4.6 | Payments/Refunds — Gateway integration + cancellation window | ✅ Full |
| §4.7 | Notifications — Email/SMS with retry logic | ✅ Full |
| §4.8 | Gamification — XP, badges, streaks, nudges | ✅ Full |
| §4.9 | Organizer Analytics — Predictive attendance + insights | ✅ Full |
| §4.10 | Admin Moderation — AI-assisted fraud + content moderation | ✅ Full |
| §5 | NFRs — Performance, security, scalability | ✅ Full |
| §6 | Business Rules — All 10 BRs implemented | ✅ Full |

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React + TypeScript | 18.x |
| Build Tool | Vite | 6.x |
| Styling | Tailwind CSS | v4 |
| State Management | Zustand (with persist middleware) | v5 |
| Routing | React Router | v7 |
| HTTP Client | Axios | 1.x |
| UI Primitives | Radix UI / shadcn/ui | Latest |
| Icons | Lucide React | Latest |
| Forms | React Hook Form + Zod | Latest |
| Charts | Recharts | Latest |
| QR Codes | qrcode.react | Latest |
| Animations | Framer Motion | Latest |
| Date Handling | date-fns | Latest |
| Package Manager | pnpm | 8.x |

---

## 3. Folder Structure

```
src/
├── app/
│   └── App.tsx                        # Router + auth guards
├── components/
│   ├── ui/                            # shadcn/ui primitives
│   ├── layout/                        # Role-specific layouts
│   ├── forms/                         # Shared form components
│   ├── business/                      # Business logic components
│   └── shared/                        # Generic reusable components
├── pages/
│   ├── public/                        # No auth required
│   ├── attendee/                      # Role: attendee
│   ├── organizer/                     # Role: organizer
│   └── admin/                         # Role: admin
├── store/
│   └── useAppStore.ts                 # Zustand store
├── lib/
│   ├── axios.ts                       # API client + interceptors
│   └── utils.ts                       # Helpers
├── hooks/                             # Custom React hooks
├── types/                             # TypeScript interfaces
└── constants/                         # Enums, config defaults
```

---

## 4. Environment Variables

```env
# Required
VITE_API_URL=https://api.eventra.com
VITE_GOOGLE_MAPS_API_KEY=xxx
VITE_PAYMENT_GATEWAY_PUBLIC_KEY=xxx

# Optional
VITE_SENTRY_DSN=xxx
VITE_POSTHOG_KEY=xxx
VITE_ENABLE_MOCK_AI=true              # Development only
```

---

## 5. Authentication System

### 5.1 Registration

```typescript
// POST /api/auth/register
interface RegisterRequest {
  email: string;       // required, unique
  password: string;    // min 8 chars, 1 uppercase, 1 lowercase, 1 number
  name: string;        // required
  role: 'attendee' | 'organizer';
  phone: string;       // required
}

interface RegisterResponse {
  success: boolean;
  message: string;
  requiresActivation: boolean;   // true for organizers
  userId?: string;
}
```

### 5.2 Login

```typescript
// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;   // default: 3600 seconds
  user: User;
}

type AccountStatus = 'active' | 'pending' | 'suspended' | 'banned';

type AuthErrorCode =
  | 'ACCOUNT_PENDING'
  | 'ACCOUNT_SUSPENDED'
  | 'ACCOUNT_BANNED'
  | 'INVALID_CREDENTIALS'
  | 'TOO_MANY_ATTEMPTS'
  | 'EMAIL_NOT_VERIFIED';
```

### 5.3 Session Management

| Setting | Value |
|---|---|
| Access Token Lifetime | 15 minutes (900s) |
| Refresh Token Lifetime | 7 days |
| Token Refresh | Automatic on 401 response |
| Session Timeout Warning | 2 minutes before expiry |
| Max Failed Attempts | 5 (15-minute lockout) |

### 5.4 Password Reset

```typescript
// POST /api/auth/forgot-password
interface ForgotPasswordRequest {
  email: string;
}

// POST /api/auth/reset-password
interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
```

---

## 6. User Roles & Permissions

### 6.1 Role Matrix

| Permission | Attendee | Organizer (Standard) | Organizer (Verified) | Admin |
|---|:---:|:---:|:---:|:---:|
| Browse events | ✅ | ✅ | ✅ | ✅ |
| Book tickets | ✅ | ❌ | ❌ | ❌ |
| Cancel bookings | ✅ | ❌ | ❌ | ❌ |
| Create events | ❌ | ✅ | ✅ | ❌ |
| Publish events directly | ❌ | ❌ | ✅ | ❌ |
| Edit own events | ❌ | ✅ (critical edits need re-approval) | ✅ | ❌ |
| View analytics | ❌ | ✅ | ✅ | ✅ (platform-wide) |
| Approve organizers | ❌ | ❌ | ❌ | ✅ |
| Grant Verified status | ❌ | ❌ | ❌ | ✅ |
| Suspend/ban users | ❌ | ❌ | ❌ | ✅ |
| Configure system | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ❌ | ❌ | ✅ |

### 6.2 Organizer State Transitions

```
Registration
    ↓
Pending Approval ──(Admin Approves)──→ Active (Standard)
    │                                      │
    └──(Admin Rejects)──→ Rejected         └──(Admin Grants Verified)──→ Verified
```

### 6.3 Account Status Transitions (Admin Only)

```
Active ←──(Unsuspend)──── Suspended ──(Suspend)──→ Active
  │
  └──(Ban)──→ Banned   ← PERMANENT, IRREVERSIBLE
```

---

## 7. Routing Map

### 7.1 Public Routes (No Auth Required)

| Route | Component | Description |
|---|---|---|
| `/` | `Landing.tsx` | Hero, features, testimonials, CTA |
| `/login` | `Login.tsx` | Email, password, forgot password, demo account cards |
| `/register` | `Register.tsx` | Role selection (Attendee/Organizer), name, email, phone, password |
| `/register/pending` | `PendingApproval.tsx` | Organizer review message, ETA, support link |
| `/forgot-password` | `ForgotPassword.tsx` | Email input, success message |
| `/reset-password/:token` | `ResetPassword.tsx` | New password + confirm |
| `/verify-email/:token` | `VerifyEmail.tsx` | Success/failure + redirect to login |
| `/suspended` | `AccountSuspended.tsx` | Suspension reason, end date, support contact |

### 7.2 Attendee Routes (Role: `attendee`)

| Route | Component | Key Features |
|---|---|---|
| `/app/discover` | `Discover.tsx` | AI personalized feed, filters, AI Chat Assistant modal |
| `/app/events/:id` | `EventDetail.tsx` | Cinematic hero, vibe tags, social proof, live energy |
| `/app/events/:id/rsvp` | `RSVP.tsx` | Ticket selection, quantity, payment form, 15-min hold timer |
| `/app/orders/:id` | `OrderSummary.tsx` | QR code, event details, add to calendar |
| `/app/calendar` | `Calendar.tsx` | Month/week view, event dots, sync options |
| `/app/my-events` | `MyEvents.tsx` | Tabs: Upcoming / Past / Bookmarked; cancel option |
| `/app/community` | `Community.tsx` | Joined/Suggested tabs, search, categories |
| `/app/community/:id` | `CommunityDetail.tsx` | Tabs: Discussions / Events / Members |
| `/app/messages` | `Messages.tsx` | DMs, group chats, event rooms, broadcasts |
| `/app/notifications` | `Notifications.tsx` | Real-time list, mark as read, action buttons |
| `/app/profile` | `AttendeeProfile.tsx` | Hero, stats, tabs: Overview / Badges / Activity |
| `/app/profile/achievements` | `Achievements.tsx` | XP bar, level, earned/locked badges, progress |
| `/app/rewards/store` | `RewardStore.tsx` | Items grid, points balance, redemption history |

### 7.3 Organizer Routes (Role: `organizer`)

| Route | Component | Key Features |
|---|---|---|
| `/organizer/onboarding` | `OrganizerOnboarding.tsx` | 5-step wizard: Identity → Org → Verification → Branding → Launch |
| `/organizer/dashboard` | `OrganizerDashboard.tsx` | KPI cards, AI insights panel, active events, activity feed |
| `/organizer/events` | `OrganizerEvents.tsx` | Searchable table, filters, status badges |
| `/organizer/events/create` | `CreateEvent.tsx` | 4-step wizard (see §11.1) |
| `/organizer/events/:id/manage` | `ManageEvent.tsx` | Tabs: Attendees / Analytics / Community / Check-in |
| `/organizer/analytics` | `OrganizerAnalytics.tsx` | Period selector, charts, funnel, demographics |
| `/organizer/messages` | `OrganizerMessages.tsx` | Compose to all/segment, broadcast history |
| `/organizer/profile` | `OrganizerProfile.tsx` | Stats, verification status, AI insights |

### 7.4 Admin Routes (Role: `admin`)

| Route | Component | Key Features |
|---|---|---|
| `/admin/onboarding` | `AdminOnboarding.tsx` | 4-step: Welcome → Permissions → Notifications → Ready |
| `/admin/dashboard` | `AdminDashboard.tsx` | KPI cards, real-time activity, system health, AI metrics |
| `/admin/events` | `AdminEvents.tsx` | Pending approvals, approve/reject, recently approved |
| `/admin/users` | `AdminUsers.tsx` | Search, role filters, suspend/ban, grant verified |
| `/admin/community` | `AdminCommunity.tsx` | Flagged content: approve / remove / warn |
| `/admin/moderation` | `AdminModeration.tsx` | AI risk scores, reasoning, bulk actions |
| `/admin/analytics` | `AdminAnalytics.tsx` | Period selector, growth charts, category performance |
| `/admin/settings` | `AdminSettings.tsx` | Feature flags, cancellation window, reminders, gamification |
| `/admin/audit-logs` | `AdminAuditLogs.tsx` | Filterable log: admin actions, timestamps, IP addresses |
| `/admin/profile` | `AdminProfile.tsx` | Permissions grid, system health, AI engine versions |

---

## 8. State Management (Zustand)

### 8.1 Full Store Schema

```typescript
// store/useAppStore.ts

interface AppStore {

  // ── AUTH (persisted) ───────────────────────────────────────────────────
  currentUser: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpiry: number | null;
  isAuthenticated: boolean;

  // ── USER DATA (persisted) ──────────────────────────────────────────────
  bookmarkedEvents: string[];          // event IDs
  rsvpedEvents: string[];              // event IDs
  bookingHistory: Booking[];
  pointsBalance: number;
  rewardHistory: Redemption[];

  // ── GAMIFICATION (persisted) ───────────────────────────────────────────
  xp: number;
  level: number;
  earnedBadges: Badge[];
  currentStreak: number;               // consecutive days with activity
  longestStreak: number;
  lastActivityDate: string | null;     // ISO date
  engagementActions: number;           // total micro-actions
  browseCount: number;
  discussionCount: number;

  // ── AI & BEHAVIOR (persisted) ─────────────────────────────────────────
  userBehaviorType: 'passive' | 'fomo' | 'community' | 'gamified';
  interests: string[];                 // from onboarding
  locationEnabled: boolean;
  userCity: string | null;
  userCoordinates: { lat: number; lng: number } | null;
  dismissedRecommendations: string[];  // event IDs user dismissed

  // ── UI STATE (NOT persisted) ───────────────────────────────────────────
  theme: 'light' | 'dark';
  notifications: Notification[];
  unreadCount: number;
  activeModal: string | null;

  // ── ACTIONS ───────────────────────────────────────────────────────────

  // Auth
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;

  // Profile
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  requestOrganizerStatus: (eventId: string, reason: string) => Promise<void>;

  // Events
  toggleBookmark: (eventId: string) => Promise<void>;
  rsvpEvent: (eventId: string, ticketTypeId: string, quantity: number) => Promise<Booking>;
  cancelBooking: (bookingId: string) => Promise<void>;

  // Gamification
  awardXP: (amount: number, reason: XPReason) => void;
  checkStreak: () => void;
  recordDiscussion: () => void;
  recordBrowse: () => void;
  redeemReward: (rewardId: string, pointsCost: number) => Promise<void>;

  // AI
  dismissRecommendation: (eventId: string) => void;
  updateBehaviorType: () => void;

  // Notifications
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
}

type XPReason = 'rsvp' | 'attendance' | 'discussion' | 'bookmark' | 'signup' | 'streak_bonus';
```

---

## 9. API Integration Layer

### 9.1 Axios Configuration

```typescript
// lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = useAppStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401, logout on refresh failure
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { accessToken } = await refreshToken();
        useAppStore.getState().setAccessToken(accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        useAppStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### 9.2 API Endpoints Reference

| Method | Endpoint | Purpose | Auth |
|---|---|---|:---:|
| POST | `/auth/register` | User registration | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/logout` | User logout | Yes |
| POST | `/auth/refresh` | Refresh token | Yes |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/forgot-password` | Request reset | No |
| POST | `/auth/reset-password` | Execute reset | No |
| GET | `/auth/verify-email/:token` | Verify email | No |
| POST | `/auth/resend-verification` | Resend email | Yes |
| GET | `/events` | List events | No |
| GET | `/events/:id` | Get event details | No |
| POST | `/events` | Create event | Organizer |
| PUT | `/events/:id` | Update event | Organizer (owner) |
| DELETE | `/events/:id` | Delete event | Admin/Owner |
| POST | `/events/:id/approve` | Approve event | Admin |
| POST | `/events/:id/reject` | Reject event | Admin |
| POST | `/bookings` | Create booking | Attendee |
| GET | `/bookings/my` | User's bookings | Yes |
| DELETE | `/bookings/:id` | Cancel booking | Attendee (owner) |
| POST | `/bookings/:id/hold` | Hold tickets | Attendee |
| POST | `/payments/create` | Create payment | Attendee |
| POST | `/payments/webhook` | Payment callback | External |
| GET | `/analytics/predict/:eventId` | Attendance prediction | Organizer |
| GET | `/analytics/insights` | Smart timing insights | Organizer |
| POST | `/analytics/feedback` | Submit feedback | Attendee |
| GET | `/admin/users` | List users | Admin |
| PUT | `/admin/users/:id/status` | Update user status | Admin |
| POST | `/admin/users/:id/verify` | Grant verified status | Admin |
| GET | `/admin/audit-logs` | View audit trail | Admin |
| GET | `/admin/moderation/flagged` | Get flagged content | Admin |
| POST | `/admin/moderation/:id/review` | Review flagged item | Admin |
| GET | `/gamification/me` | User gamification data | Yes |
| POST | `/gamification/action` | Record engagement | Yes |
| GET | `/rewards/store` | List redeemable items | Yes |
| POST | `/rewards/redeem` | Redeem points | Yes |

---

## 10. Component Library

### 10.1 Core UI Components

| Component | Props | Description |
|---|---|---|
| `AuthGuard` | `allowedRoles: Role[]` | Route protection, redirects unauthorized users |
| `RoleBasedRenderer` | `roles: Role[], children` | Conditionally renders content by role |
| `StatusBadge` | `status: AccountStatus \| EventStatus \| BookingStatus` | Color-coded status indicator |
| `VerificationBadge` | `isVerified: boolean, size?: 'sm' \| 'md' \| 'lg'` | Verified organizer badge |
| `CancellationCountdown` | `cancellationDeadline: Date` | Time remaining to cancel |
| `TicketHoldTimer` | `expiresAt: Date, onExpire: () => void` | Countdown for ticket hold |
| `XPProgressBar` | `currentXP: number, level: number` | Progress to next level |
| `PointsBalance` | `balance: number, showHistory?: boolean` | Points display with redemption link |
| `AIScoreIndicator` | `score: number, type: 'risk' \| 'confidence' \| 'match'` | Visual AI confidence/risk meter |
| `ConfirmationModal` | `title, message, onConfirm, onCancel, destructive?: boolean` | Reusable confirm dialog |
| `DataTable` | `columns, data, searchable, sortable, paginated` | Feature-rich table |
| `ImageUpload` | `onUpload, maxSize, acceptedTypes, crop?: boolean` | Upload with preview |
| `LocationPicker` | `onLocationSelect, initialValue, required` | Address + lat/lng picker |
| `RichTextEditor` | `value, onChange, placeholder` | Event description editor |

### 10.2 Business Logic Components

```typescript
// EventApprovalStatus.tsx
interface EventApprovalProps {
  eventStatus: 'draft' | 'pending_approval' | 'published' | 'rejected' | 'suspended';
  organizerStatus: 'standard' | 'verified';
  onEdit?: () => void;
  onResubmit?: () => void;
}

// CancellationPolicy.tsx
interface CancellationPolicyProps {
  eventDate: Date;
  cancellationWindowHours: number;  // from admin config
  onCancel: () => void;
}

// BookingHoldManager.tsx
interface BookingHoldProps {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  holdDurationMinutes: number;      // default: 15
  onHoldExpired: () => void;
  onBookingConfirmed: (bookingId: string) => void;
}
```

---

## 11. Feature Specifications

### 11.1 Event Creation — 4-Step Wizard

**Step 1: Basics**
- Title — required, max 100 chars
- Category — dropdown: `Tech | Art | Music | Workshop | Social | Sports | Food | Business`
- Date — date picker, cannot be in the past
- Time — time picker

**Step 2: Location**
- Venue name — required for in-person
- Address — autocomplete via Google Places API
- City — auto-populated from address
- Coordinates — lat/lng, auto-populated
- Online Event toggle — if `true`, hides address fields, shows URL field

**Step 3: Description & Media**
- Description — rich text, min 50 chars, max 5000 chars
- Banner image URL — optional, with live preview
- Vibe tags — max 3 (e.g. `"Creative crowd"`, `"Networking-friendly"`)

**Step 4: Ticketing**
- Ticket capacity — number, min 1
- Ticket price — number, 0 = free
- Multiple ticket types — optional, max 5 per event:
  - Type name (e.g. `"Early Bird"`, `"VIP"`)
  - Price
  - Capacity
  - Description
- Preview card — shows how event will appear in the feed

**Organizer Status Impact:**

| Role | After Submission |
|---|---|
| Standard Organizer | Status → `pending_approval` |
| Verified Organizer | Status → `published` immediately |

---

### 11.2 Ticket Booking Flow

**Step 1: Ticket Selection**
- Display available ticket types with real-time availability
- Quantity selector — min 1, max 10 per transaction
- "Hold" button starts 15-minute timer

**Step 2: Hold Confirmation**

```typescript
interface HoldResponse {
  holdId: string;
  expiresAt: Date;  // now + 15 minutes
  tickets: {
    ticketTypeId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
}
```

**Step 3: Payment**
- Redirect to payment gateway (mock in demo)
- Countdown timer for hold expiry visible throughout
- On success → Booking created, XP awarded
- On failure → Hold released, error shown

**Step 4: Confirmation**
- QR code generated for event check-in
- "Add to Calendar" button
- Social sharing options

---

### 11.3 Cancellation & Refund Policy

**Rules:**
- Cancellation window: **48 hours before event start** (configurable by admin)
- Full refund within the cancellation window
- No refund after window closes
- Partial cancellation supported with proportional refund
- Refund failure → log entry created + admin notification sent

**UI Requirements:**
- Show cancellation deadline on My Events page
- Countdown timer on each active booking
- Warning message when fewer than 6 hours remain in the window

---

## 12. Design System

### 12.1 Color Palette (WCAG AA Compliant)

| Role | Primary | Secondary | Accent | Background (Light / Dark) |
|---|---|---|---|---|
| Attendee | `#6C4CF1` | `#8B7CFF` | `#FF9B3D` | `#F7F6FF` / `#0F172A` |
| Organizer | `#00D4FF` | `#2DD4BF` | `#8B5CF6` | Same as Attendee |
| Admin | `#EF4444` | `#DC2626` | `#3B82F6` | Same as Attendee |

### 12.2 Status Colors

| Status | Color |
|---|---|
| Active / Success | `#10B981` (green) |
| Pending / Warning | `#F59E0B` (amber) |
| Error / Rejected | `#EF4444` (red) |
| Info / Neutral | `#6B7280` (gray) |
| Verified | `#00D4FF` (cyan) |

### 12.3 Typography Scale

| Class | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `.text-display` | 48px | 800 | 1.2 | Hero numbers (XP, points) |
| `.text-h1` | 32px | 700 | 1.3 | Page titles |
| `.text-h2` | 24px | 700 | 1.4 | Section headings |
| `.text-h3` | 18px | 600 | 1.4 | Card titles |
| `.text-body` | 16px | 400 | 1.5 | Body text |
| `.text-body-sm` | 14px | 400 | 1.5 | Secondary text |
| `.text-caption` | 12px | 500 | 1.4 | Labels, badges, timestamps |

### 12.4 Spacing (Tailwind Scale)

| Token | Value | Usage |
|---|---|---|
| `p-1` | 4px | Icon padding |
| `p-2` | 8px | Small cards, inline elements |
| `p-4` | 16px | Standard card padding |
| `p-6` | 24px | Section padding, modals |
| `p-8` | 32px | Page margins, hero sections |

---

## 13. Gamification System

### 13.1 XP & Points Per Action

| Action | XP | Points |
|---|:---:|:---:|
| Complete registration | 50 | 0 |
| RSVP to event | 10 | 5 |
| Attend event (check-in) | 50 | 25 |
| Bookmark event | 5 | 2 |
| Join discussion | 15 | 5 |
| Maintain 7-day streak | 100 | 50 |
| Refer a friend | 200 | 100 |
| Write event review | 20 | 10 |
| Share event on social | 10 | 5 |

### 13.2 Level Formula

```typescript
function getXPForLevel(level: number): number {
  // Progressive: 100, 250, 450, 700, 1000 …
  return 100 * level + 50 * (level * (level - 1)) / 2;
}
```

### 13.3 Badge Definitions

| Badge | Criteria | XP Bonus | Tier |
|---|---|:---:|---|
| First Attendee | RSVP to first event | 50 | 🎫 Bronze |
| Event Explorer | Attend 5 events | 100 | 🗺️ Silver |
| Community Builder | Join 3 discussions | 75 | 💬 Bronze |
| Streak Master | 7-day streak | 150 | 🔥 Gold |
| Super Fan | Attend 10 events from same organizer | 200 | ⭐ Platinum |
| Early Bird | RSVP within 1 hour of event publish | 50 | ⏰ Bronze |
| Influencer | Share 5 events | 75 | 📢 Silver |
| Verified Attendee | Complete all profile fields | 25 | ✅ Bronze |

---

## 14. AI Features

### 14.1 Recommendation System

**Cold Start (New User — 0–4 interactions):**
- Use onboarding interests as primary signal
- Show popular events in selected categories
- Label: `"Based on your interests in [Category]"`

**Warm Start (5+ interactions):**

| Signal | Weight |
|---|---|
| Interest match | 40% |
| Location proximity (skip for online events) | 30% |
| Event popularity | 20% |
| Recency | 10% |

Labels: `"Because you attended X"` or `"Popular near you"`

**Dismissal Handling:**
- Dismissed event IDs stored in `dismissedRecommendations`
- Excluded from all future recommendations
- Similar events downweighted by 20% for 30 days

**Fallback Mode (AI Unavailable):**
- Show all published events sorted by date
- Display banner: `"Personalization temporarily unavailable"`

### 14.2 AI Chat Assistant
- Available as a modal from the Discover page
- Controlled by admin feature flag: `aiChatEnabled`

### 14.3 Admin AI Moderation
- Assigns risk scores to events and content
- Provides AI reasoning for flagged items
- Supports bulk moderation actions
- Controlled by flag: `aiFraudDetectionEnabled`

---

## 15. Admin Configuration

All settings configurable at `/admin/settings`:

```typescript
interface SystemConfig {
  // Cancellation Policy
  cancellationWindowHours: number;       // default: 48

  // Reminder Intervals
  reminderIntervals: number[];           // default: [24, 1] (hours before event)

  // Gamification Rules
  xpPerRSVP: number;                     // default: 10
  xpPerAttendance: number;               // default: 50
  xpPerDiscussion: number;               // default: 15
  streakBonusMultiplier: number;         // default: 2

  // Booking Rules
  maxTicketsPerBooking: number;          // default: 10
  ticketHoldTimeoutMinutes: number;      // default: 15

  // AI Feature Flags
  aiRecommendationsEnabled: boolean;     // default: true
  aiChatEnabled: boolean;                // default: true
  aiFraudDetectionEnabled: boolean;      // default: true

  // Platform
  platformName: string;                  // default: "Eventra"
  contactEmail: string;
  currencySymbol: string;                // default: "$"
  platformFeePercentage: number;         // default: 5
}
```

---

## 16. Audit Trail

### 16.1 Always-Logged Actions

- User login / logout
- Admin approves / rejects event
- Admin approves / rejects organizer
- Admin grants Verified status
- Admin suspends / bans user
- Admin modifies system config
- Booking cancellation
- Refund failure
- Content moderation decision

### 16.2 Audit Log Schema

```typescript
interface AuditLogEntry {
  id: string;
  timestamp: Date;
  adminId: string;
  adminEmail: string;
  action: AuditAction;
  targetType: 'user' | 'event' | 'booking' | 'config';
  targetId: string;
  previousState?: any;
  newState?: any;
  ipAddress: string;
}
```

---

## 17. Testing Requirements

### 17.1 Unit Tests (Vitest) — 80% Coverage Required

```typescript
describe('Authentication', () => {
  test('login with valid credentials redirects to role dashboard')
  test('login with pending organizer shows approval message')
  test('login with suspended account shows suspension date')
  test('5 failed attempts triggers lockout')
  test('token refresh on 401 response')
})

describe('Business Rules', () => {
  test('standard organizer events require approval')
  test('verified organizer events publish immediately')
  test('cancellation blocked after 48-hour window')
  test('partial cancellation calculates correct refund')
  test('max 10 tickets per booking')
})

describe('Gamification', () => {
  test('RSVP awards 10 XP and 5 points')
  test('streak maintained with daily activity')
  test('badge awarded at milestone')
  test('level calculation uses progressive formula')
})

describe('AI Features', () => {
  test('recommendations exclude dismissed events')
  test('fallback to date-sorted when AI unavailable')
  test('cold start uses onboarding interests')
})
```

### 17.2 Integration Tests (React Testing Library)

```typescript
describe('Booking Flow Integration', () => {
  test('complete booking from event page to confirmation')
  test('hold timer releases tickets after timeout')
  test('cancellation triggers refund API call')
})

describe('Admin Moderation Integration', () => {
  test('approve event makes it visible to attendees')
  test('reject event sends notification to organizer')
  test('suspended user cannot log in')
})
```

### 17.3 E2E Tests (Playwright) — Critical Paths

1. Register as attendee → Browse events → RSVP → Cancel
2. Register as organizer → Create event → Submit for approval
3. Admin login → Approve event → Verify visibility
4. Standard organizer → Edit event → Re-approval triggered
5. Attendee → Earn XP → Level up → Redeem reward

---

## 18. Deployment & Performance

### 18.1 Build

```bash
# Production build with bundle analysis
pnpm build -- --report
```

**Size Targets:**
- Initial bundle: < 200 KB (gzipped)
- Vendor chunk: < 500 KB (gzipped)
- Total page load: < 2s on 3G

### 18.2 Performance Budgets

| Metric | Target |
|---|---|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Time to Interactive (TTI) | < 3s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| First Input Delay (FID) | < 100ms |

### 18.3 Browser Support

- Chrome, Firefox, Safari, Edge — last 2 versions each
- Mobile: iOS Safari, Chrome for Android

### 18.4 Accessibility (WCAG 2.1 AA)

- Semantic HTML (`header`, `nav`, `main`, `section`)
- ARIA labels on all interactive elements
- Full keyboard navigation (`Tab`, `Enter`, `Escape`)
- Visible focus indicators
- Color contrast ratio minimum 4.5:1
- Alt text on all images
- Form labels associated with inputs
- Error messages announced by screen readers
- Skip-to-main-content link
- Responsive zoom support up to 200%

---

## 19. Demo Accounts

| Role | Email | Password | Level | XP |
|---|---|---|---|---|
| Attendee | `sarah@demo.com` | `demo123` | Level 8 | 1,580 XP |
| Organizer (Standard) | `ahmed@demo.com` | `demo123` | Level 15 | 3,240 XP |
| Admin | `admin@demo.com` | `demo123` | Level 20 | 5,000 XP |

---

---

## 20. User Flows

> These flows define every step a user takes from entry to completion for each major use case. Each node maps to a route and component. Use these as the implementation checklist for page transitions, guards, API calls, and state updates.

---

### 20.1 Attendee Flows

---

#### Flow A1 — Registration & Onboarding

```
[/] Landing Page
  │  CTA: "Get Started"
  ▼
[/register] Register Page
  │  Select role: Attendee
  │  Fill: name, email, phone, password
  │  Submit → POST /auth/register
  │  On success → POST /auth/verify-email (email sent)
  ▼
[/verify-email/:token] Email Verification
  │  Token valid   → show success message
  │  Token invalid → show error + resend button → POST /auth/resend-verification
  ▼
[/login] Login Page
  │  Fill: email, password → POST /auth/login
  │  Store: accessToken, refreshToken, user in Zustand (persisted)
  ▼
[/app/discover] Discover (first visit — Cold Start)
  │  Show interest-selection modal (onboarding step)
  │  User picks categories → stored in state: interests[]
  │  Feed populated from selected categories
  ▼
  ✅ ONBOARDING COMPLETE — attendee active
```

**State updates:** `isAuthenticated = true`, `interests[]`, `userBehaviorType = 'passive'`
**XP awarded:** +50 (signup)

---

#### Flow A2 — Event Discovery & Browsing

```
[/app/discover] Discover Page
  │  AI feed renders (personalized or cold-start)
  │  Filters: category, date range, location, price, online/in-person
  │  Search bar → GET /events?q=...
  │  AI Chat Assistant button → opens modal overlay
  │  Dismiss event card → dismissRecommendation(eventId) + state update
  │  Bookmark icon → toggleBookmark(eventId) → PUT /events/:id/bookmark
  │                   +5 XP, +2 points → check badge progress
  ▼
[/app/events/:id] Event Detail Page
  │  Sections: cinematic hero, vibe tags, description, organizer info,
  │            social proof (attendee count), location map, similar events
  │  Actions:
  │    "Book Ticket" → navigate to /app/events/:id/rsvp
  │    "Bookmark"    → toggleBookmark()
  │    "Share"       → social share sheet (+10 XP, +5 pts)
  ▼
  📌 Branch: user not logged in → redirect to /login with returnUrl
```

**Record:** `browseCount++` on each Discover page visit → `updateBehaviorType()`

---

#### Flow A3 — Ticket Booking (RSVP)

```
[/app/events/:id] Event Detail
  │  Click "Book Ticket"
  ▼
[/app/events/:id/rsvp] RSVP Page — Step 1: Ticket Selection
  │  GET /events/:id → load ticket types & availability
  │  Select ticket type, set quantity (1–10)
  │  Click "Hold Tickets" → POST /bookings/:id/hold
  │  Response: { holdId, expiresAt, totalAmount }
  │  TicketHoldTimer starts (15 min countdown)
  ▼
  Step 2: Payment
  │  Display order summary + hold timer
  │  Fill payment details (mock gateway)
  │  Click "Confirm & Pay" → POST /payments/create
  │
  │  ── On SUCCESS ──────────────────────────────────────
  │  POST /bookings (create booking record)
  │  awardXP(10, 'rsvp') + awardPoints(5)
  │  rsvpedEvents.push(eventId)
  │  checkStreak() → if streak milestone → awardXP(100)
  │  Navigate → /app/orders/:id
  │
  │  ── On FAILURE ──────────────────────────────────────
  │  Hold released automatically
  │  Show error toast with reason
  │  Option to retry or return to event detail
  ▼
[/app/orders/:id] Order Summary — Step 3: Confirmation
  │  QR code generated (qrcode.react)
  │  Event details summary
  │  "Add to Calendar" button (iCal / Google Calendar)
  │  "Share" button
  │  "View My Events" → /app/my-events
  ▼
  ✅ BOOKING COMPLETE
```

**State updates:** `bookingHistory[]`, `rsvpedEvents[]`, `xp`, `pointsBalance`
**Badge checks:** First Attendee, Early Bird

---

#### Flow A4 — Booking Cancellation & Refund

```
[/app/my-events] My Events — "Upcoming" Tab
  │  Each booking shows:
  │    - CancellationCountdown (time left in 48h window)
  │    - "Cancel Booking" button (disabled if window expired)
  ▼
  Click "Cancel Booking"
  │  ConfirmationModal: "Are you sure? This will issue a refund."
  │  Confirm → DELETE /bookings/:id
  │
  │  ── Within 48h window ──────────────────────────────
  │  Full refund processed → PATCH /payments/:id/refund
  │  bookingHistory updated (status: 'cancelled')
  │  rsvpedEvents.filter(id !== eventId)
  │  Show success toast: "Refund issued within 5–10 business days"
  │
  │  ── After 48h window ───────────────────────────────
  │  Cancel button disabled
  │  Tooltip: "Cancellation window closed [date/time]"
  │
  │  ── Refund failure ──────────────────────────────────
  │  Log audit entry
  │  Notify admin via system notification
  │  Show user: "Cancellation noted. Refund processing may take longer."
  ▼
  ✅ CANCELLATION COMPLETE
```

---

#### Flow A5 — Gamification & Rewards

```
Any XP-earning action (RSVP, attendance, share, review…)
  │
  ▼
awardXP(amount, reason) called in store
  │  xp += amount
  │  Check: xp >= getXPForLevel(level + 1) ?
  │    YES → level++, show "Level Up!" toast/animation
  │  Check badge milestones → earnedBadges.push(badge) if criteria met
  │    Show badge unlock modal
  │
  ▼
[/app/profile/achievements] Achievements Page
  │  XPProgressBar → current level, XP to next level
  │  Earned badges grid (with unlock date)
  │  Locked badges grid (with progress %)
  │  Streak display: currentStreak 🔥 / longestStreak
  │
  ▼
[/app/rewards/store] Reward Store
  │  GET /rewards/store → load items
  │  PointsBalance displayed in header
  │  Click item → show cost + confirm modal
  │  Confirm → POST /rewards/redeem { rewardId, pointsCost }
  │  pointsBalance -= pointsCost
  │  rewardHistory.push(redemption)
  ▼
  ✅ REWARD REDEEMED
```

---

#### Flow A6 — Community & Messaging

```
[/app/community] Communities List
  │  Tabs: Joined | Suggested
  │  Search + category filter
  │  "Join" button → POST /communities/:id/join
  │  recordDiscussion() → +15 XP, +5 pts, discussionCount++
  ▼
[/app/community/:id] Community Detail
  │  Tabs: Discussions | Events | Members
  │  Post discussion → +15 XP
  │  View community events → link to /app/events/:id
  ▼
[/app/messages] Messages Center
  │  Sidebar: DMs | Group Chats | Event Rooms | Broadcasts
  │  Click conversation → load thread
  │  Compose new DM → search users
  │  Event Room auto-created for RSVPed events
  ▼
  ✅ COMMUNITY ENGAGED
```

---

### 20.2 Organizer Flows

---

#### Flow O1 — Registration & Pending Approval

```
[/register] Register Page
  │  Select role: Organizer
  │  Fill: name, email, phone, password
  │  Submit → POST /auth/register { role: 'organizer' }
  │  Response: { requiresActivation: true }
  ▼
[/register/pending] Pending Approval Page
  │  Message: "Your account is under review"
  │  Estimated time displayed
  │  "Contact Support" link
  │  Auto-polls or listens for status change (websocket/polling)
  │
  │  ── Admin Approves ──────────────────────────────────
  │  Account status → 'active' (Standard Organizer)
  │  Email notification sent
  │  Redirect → /organizer/onboarding
  │
  │  ── Admin Rejects ───────────────────────────────────
  │  Email sent with rejection reason
  │  Page shows rejection message + option to contact support
  ▼
[/organizer/onboarding] Onboarding Wizard (5 steps)
  │  Step 1: Identity — legal name, bio
  │  Step 2: Organization — org name, type, website
  │  Step 3: Verification — upload ID / business docs (mock)
  │  Step 4: Branding — logo, banner, color accent
  │  Step 5: Launch — summary + "Go to Dashboard"
  ▼
[/organizer/dashboard] Dashboard
  ✅ ORGANIZER ACTIVE
```

---

#### Flow O2 — Create & Publish an Event

```
[/organizer/dashboard] Dashboard
  │  Click "Create Event" CTA
  ▼
[/organizer/events/create] Create Event Wizard
  │
  │  Step 1: Basics
  │    Title, Category, Date, Time → validate, save to local state
  │
  │  Step 2: Location
  │    Venue name, Address (Google Places autocomplete)
  │    lat/lng auto-populated
  │    Toggle "Online Event" → hide address, show URL field
  │
  │  Step 3: Description & Media
  │    RichTextEditor (min 50, max 5000 chars)
  │    Banner image URL + live preview
  │    Vibe tags (max 3)
  │
  │  Step 4: Ticketing
  │    Capacity, price (0 = free)
  │    Add ticket types (max 5): name, price, capacity, description
  │    Preview card renders
  │
  │  Submit → POST /events
  │
  │  ── Standard Organizer ──────────────────────────────
  │  Event status → 'pending_approval'
  │  Toast: "Submitted for review"
  │  Navigate → /organizer/events (shows pending badge)
  │
  │  ── Verified Organizer ──────────────────────────────
  │  Event status → 'published' immediately
  │  Toast: "Event is live!"
  │  Navigate → /organizer/events/:id/manage
  ▼
  ✅ EVENT CREATED
```

---

#### Flow O3 — Edit an Event

```
[/organizer/events] Events Table
  │  Click "Edit" on an event row
  ▼
[/organizer/events/create] Create Event Wizard (pre-filled)
  │  Edit any fields
  │  Submit → PUT /events/:id
  │
  │  ── Non-critical edit (description, media, vibe tags) ─
  │  Update saved, status unchanged
  │
  │  ── Critical edit (date, time, location, ticket price) ─
  │  Standard Organizer → status resets to 'pending_approval'
  │  Verified Organizer → update saved, status unchanged
  │  Attendees notified of change via notifications
  ▼
  ✅ EVENT UPDATED
```

---

#### Flow O4 — Manage a Live Event

```
[/organizer/events] Events Table
  │  Click "Manage" on a published event
  ▼
[/organizer/events/:id/manage] Manage Event
  │
  │  Tab: Attendees
  │    List of RSVPed attendees (name, ticket type, status)
  │    Export CSV button
  │    Check-in mode (scan QR / manual mark)
  │      → POST /events/:id/checkin { attendeeId }
  │      → Attendee awarded +50 XP (attendance)
  │
  │  Tab: Analytics
  │    Attendance count vs capacity
  │    Ticket type breakdown chart (Recharts)
  │    Revenue summary
  │    GET /analytics/predict/:eventId → predicted final attendance
  │    GET /analytics/insights → smart timing insights panel
  │
  │  Tab: Community
  │    Event-specific community thread
  │    Pinned announcements
  │    Broadcast message to all attendees
  │
  │  Tab: Check-in
  │    QR scanner interface
  │    Manual attendee search
  │    Real-time checked-in count
  ▼
  ✅ EVENT MANAGED
```

---

#### Flow O5 — Broadcast Message to Attendees

```
[/organizer/messages] Organizer Messages
  │  Click "New Broadcast"
  │  Select audience: All Attendees | Ticket Type segment
  │  Compose message (subject + body)
  │  Preview → Send → POST /messages/broadcast { eventId, segment, content }
  │  Broadcast history list shows sent status + open rate (mock)
  ▼
  ✅ MESSAGE SENT
```

---

#### Flow O6 — View Analytics

```
[/organizer/analytics] Analytics Page
  │  Period selector: 7d | 30d | 90d | Custom
  │  GET /analytics/insights (with period param)
  │
  │  KPI Cards: Total events, Total attendees, Total revenue, Avg rating
  │  Charts (Recharts):
  │    - Attendance over time (line chart)
  │    - Revenue by event (bar chart)
  │    - Ticket type breakdown (pie chart)
  │    - Conversion funnel: views → RSVPs → check-ins
  │    - Attendee demographics (age, location heatmap)
  │  AI Insights panel:
  │    - "Best day/time to post for your audience"
  │    - "Events similar to yours perform best on Friday evenings"
  ▼
  ✅ ANALYTICS REVIEWED
```

---

### 20.3 Admin Flows

---

#### Flow AD1 — Admin Login & Onboarding

```
[/login] Login Page
  │  Email + password → POST /auth/login
  │  user.role === 'admin' → redirect to /admin/onboarding (first time)
  │                        → redirect to /admin/dashboard (returning)
  ▼
[/admin/onboarding] Onboarding Wizard (4 steps, first login only)
  │  Step 1: Welcome — platform overview
  │  Step 2: Permissions — review admin capabilities grid
  │  Step 3: Notifications — configure alert preferences
  │  Step 4: Ready — "Go to Dashboard"
  ▼
[/admin/dashboard] Dashboard
  ✅ ADMIN ACTIVE
```

---

#### Flow AD2 — Review & Approve / Reject an Organizer

```
[/admin/users] Users Management Page
  │  Filter by role: organizer | status: pending
  │  Click user row → expand detail panel
  │  Review: name, email, phone, submitted docs
  │
  │  Click "Approve"
  │    PUT /admin/users/:id/status { status: 'active' }
  │    Audit log entry created
  │    Email notification sent to organizer
  │    Organizer redirected to /organizer/onboarding on next login
  │
  │  Click "Reject"
  │    ConfirmationModal: input rejection reason (required)
  │    PUT /admin/users/:id/status { status: 'rejected', reason }
  │    Audit log entry created
  │    Email notification sent with reason
  ▼
  ✅ ORGANIZER DECISION RECORDED
```

---

#### Flow AD3 — Grant Verified Status to Organizer

```
[/admin/users] Users Management
  │  Filter: role = organizer, status = active
  │  Find organizer → click "Grant Verified"
  │  ConfirmationModal: "This organizer will be able to publish events directly."
  │  Confirm → POST /admin/users/:id/verify
  │  Organizer role upgraded to Verified
  │  VerificationBadge appears on organizer's profile
  │  Audit log entry created
  │  Email notification sent to organizer
  ▼
  ✅ VERIFIED STATUS GRANTED
```

---

#### Flow AD4 — Suspend or Ban a User

```
[/admin/users] Users Management
  │  Search user by name or email
  │  Click "Suspend" or "Ban"
  │
  │  ── Suspend ─────────────────────────────────────────
  │  ConfirmationModal: input reason + end date (optional)
  │  PUT /admin/users/:id/status { status: 'suspended', reason, until }
  │  User's active sessions invalidated immediately
  │  User sees /suspended page on next login attempt
  │  Audit log entry created
  │  "Unsuspend" button now visible on user row
  │
  │  ── Ban (Permanent) ─────────────────────────────────
  │  ConfirmationModal: destructive=true, "This is permanent and irreversible."
  │  PUT /admin/users/:id/status { status: 'banned', reason }
  │  User's active sessions invalidated immediately
  │  Login attempt returns ACCOUNT_BANNED error
  │  Audit log entry created
  ▼
  ✅ USER ACTION RECORDED
```

---

#### Flow AD5 — Approve or Reject an Event

```
[/admin/events] Event Moderation Page
  │  "Pending Approvals" tab — list of events awaiting review
  │  Click event row → Event Preview panel opens
  │  Review: title, description, organizer, date, location, ticket info
  │  AI Risk Score shown (AIScoreIndicator) if aiFraudDetectionEnabled
  │
  │  Click "Approve"
  │    POST /events/:id/approve
  │    Event status → 'published'
  │    Audit log entry created
  │    Email notification → organizer
  │    Event appears in attendee discover feed
  │
  │  Click "Reject"
  │    ConfirmationModal: input rejection reason (required)
  │    POST /events/:id/reject { reason }
  │    Event status → 'rejected'
  │    Audit log entry created
  │    Email notification → organizer with reason
  ▼
  ✅ EVENT DECISION RECORDED
```

---

#### Flow AD6 — Content Moderation (Flagged Content)

```
[/admin/community] Community Moderation  OR
[/admin/moderation] AI Moderation Queue
  │
  │  Each flagged item shows:
  │    - Content preview
  │    - Flag reason (user report or AI detection)
  │    - AI Risk Score + AI reasoning text
  │    - Flagged by: user count or "AI"
  │    - Organizer / author info
  │
  │  Actions per item:
  │    "Approve" → POST /admin/moderation/:id/review { decision: 'approve' }
  │      Content restored/kept, flag cleared
  │    "Remove"  → POST /admin/moderation/:id/review { decision: 'remove' }
  │      Content hidden from platform
  │    "Warn"    → POST /admin/moderation/:id/review { decision: 'warn' }
  │      Warning sent to content author
  │
  │  Bulk actions:
  │    Select multiple → Apply action to all selected
  │
  │  All decisions → audit log entry created
  ▼
  ✅ CONTENT MODERATION COMPLETE
```

---

#### Flow AD7 — Configure System Settings

```
[/admin/settings] Settings Page
  │  Sections rendered as form groups:
  │
  │  Cancellation Policy
  │    cancellationWindowHours: number input (default 48)
  │
  │  Reminders
  │    reminderIntervals: tag input (e.g. [24, 1])
  │
  │  Gamification Rules
  │    xpPerRSVP, xpPerAttendance, xpPerDiscussion: number inputs
  │    streakBonusMultiplier: number input
  │
  │  Booking Rules
  │    maxTicketsPerBooking: number input
  │    ticketHoldTimeoutMinutes: number input
  │
  │  AI Feature Flags
  │    aiRecommendationsEnabled: toggle
  │    aiChatEnabled: toggle
  │    aiFraudDetectionEnabled: toggle
  │
  │  Platform Info
  │    platformName, contactEmail, currencySymbol, platformFeePercentage
  │
  │  Click "Save Changes"
  │    PUT /admin/settings (full config object)
  │    Audit log entry created (previousState vs newState)
  │    Success toast shown
  ▼
  ✅ SETTINGS UPDATED
```

---

#### Flow AD8 — Review Audit Logs

```
[/admin/audit-logs] Audit Logs Page
  │  GET /admin/audit-logs (paginated)
  │
  │  Filters:
  │    - Admin email (who performed action)
  │    - Action type (approve_event, ban_user, config_change…)
  │    - Target type (user | event | booking | config)
  │    - Date range picker
  │
  │  Table columns: Timestamp | Admin | Action | Target | IP Address
  │  Click row → expand detail panel showing previousState / newState diff
  │  Export CSV button
  ▼
  ✅ AUDIT LOGS REVIEWED
```

---

#### Flow AD9 — Platform Analytics

```
[/admin/analytics] Platform Analytics Page
  │  Period selector: 7d | 30d | 90d | Custom
  │  GET /analytics/platform (with period param)
  │
  │  KPI Cards:
  │    - Total users (attendees / organizers)
  │    - Total events (published / pending)
  │    - Total bookings & revenue
  │    - Platform fee collected
  │
  │  Charts:
  │    - User growth over time (line chart)
  │    - Event category performance (bar chart)
  │    - Booking conversion rate (funnel)
  │    - Revenue trend (area chart)
  │    - Geographic distribution (map or table)
  │    - AI recommendation click-through rate
  ▼
  ✅ ANALYTICS REVIEWED
```

---

*Eventra Frontend Specification v2.0 — Ready for Implementation*
