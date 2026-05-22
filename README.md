# Eventra — AI-Powered Social Event Platform

> A premium frontend demo for an intelligent event discovery and community engagement platform. Built with React 18, TypeScript, Tailwind CSS v4, Zustand v5, and React Router v7.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Accounts](#demo-accounts)
- [User Roles & Flows](#user-roles--flows)
  - [Attendee Flow](#attendee-flow)
  - [Organizer Flow](#organizer-flow)
  - [Admin Flow](#admin-flow)
- [Feature Breakdown](#feature-breakdown)
  - [Public Pages](#public-pages)
  - [Attendee Features](#attendee-features)
  - [Organizer Features](#organizer-features)
  - [Admin Features](#admin-features)
- [Wallet System](#wallet-system)
- [Messaging System](#messaging-system)
- [Event Chat System](#event-chat-system)
- [Global UX Components](#global-ux-components)
- [Accessibility & Navigation](#accessibility--navigation)
- [Form Validation System](#form-validation-system)
- [Loading States](#loading-states)
- [Engagement UX System](#engagement-ux-system)
- [Gamification System](#gamification-system)
- [Design System](#design-system)
- [Project Structure](#project-structure)
- [Routing Map](#routing-map)
- [State Management](#state-management)
- [System Configuration](#system-configuration)

---

## Overview

Eventra is a full-featured frontend demo of an AI-native social event ecosystem. It combines intelligent event discovery, community-driven engagement, gamified participation, real-time social interaction, and organizer growth tools — all wrapped in a premium, responsive UI.

The platform is designed around three distinct user experiences:

| Role | Purpose |
|------|---------|
| **Attendee** | Discover events, join communities, earn XP & badges, RSVP, engage socially, chat in event rooms |
| **Organizer** | Create and manage events, view analytics, message attendees, moderate event chats, grow audience |
| **Admin** | Moderate content, manage users, review events, monitor platform health, broadcast messages, view audit logs |

All data is mocked and persisted in `localStorage` via Zustand's `persist` middleware. No backend is required.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 + custom CSS design system |
| State Management | Zustand v5 with `persist` middleware |
| Routing | React Router v7 (including `useBlocker` for unsaved-changes guards) |
| UI Primitives | Radix UI (shadcn/ui pattern) |
| HTTP Client | Axios (with request/response interceptors, mock-mode aware) |
| Icons | Lucide React |
| Charts | Custom SVG bar/donut charts |
| QR Codes | qrcode.react |
| Confetti | canvas-confetti |
| Toasts | Sonner |
| Animations | CSS keyframes + tw-animate-css |
| Package Manager | pnpm |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The app runs at `http://localhost:5173` by default.

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values as needed. All variables are optional in demo mode — the app works without them using mock data.

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend API base URL. If unset, all calls use mock data |
| `VITE_GOOGLE_MAPS_API_KEY` | No | Google Maps API key for location features |
| `VITE_PAYMENT_GATEWAY_PUBLIC_KEY` | No | Payment gateway public key for checkout |
| `VITE_SENTRY_DSN` | No | Sentry DSN for error tracking |
| `VITE_POSTHOG_KEY` | No | PostHog key for analytics |
| `VITE_ENABLE_MOCK_AI` | No | Set to `true` to force mock AI even when API URL is set |

---

## Demo Accounts

Use these credentials on the Login page for instant access to each role. Email and password are both validated against the demo accounts below.

| Role | Email | Password | Level |
|------|-------|----------|-------|
| **Attendee** — Sarah Johnson | `sarah@demo.com` | `demo123` | Level 8 · 1,580 XP |
| **Organizer** — Ahmed Hassan | `ahmed@demo.com` | `demo123` | Level 15 · 3,240 XP |
| **Admin** — Layla Mostafa | `admin@demo.com` | `demo123` | Level 20 · 5,000 XP |

Each account auto-redirects to the correct dashboard after login. Attempting to access a route for a different role redirects you to your own dashboard.

---

## User Roles & Flows

### Attendee Flow

```
Landing → Register (/register)
  → Role selection screen: "Join as Attendee" card or "Join as Organizer" card
  → Select Attendee → attendee form (2-step flow):
      Fill name, email, password + confirm (side-by-side), location
      Select 3+ interest chips (Music, Art, Technology, Food & Drink, Sports, Business, Science, Gaming)
  → Inline field validation on blur (red border + error text per field)
  → On success: toast "+50 XP earned" before redirect to /login
    ↓
Onboarding (6 steps)
  1. Welcome — platform intro
  2. Interests — pick 3+ categories
  3. Location — city + radius + travel preference
  4. Calendar — optional Google/Apple/Outlook sync
  5. AI Feed Training — like/skip preview events
  6. Launch — personalized feed ready
    ↓
Discover Feed
  → 800ms skeleton loader on initial load
  → Browse recommended & trending events
  → AI Search (natural language, Ctrl+K shortcut)
  → Filter by category, price, mode, AI-recommended
  → J/K keyboard shortcut to navigate events (focused card highlighted)
    ↓
Event Detail Page
  → Cinematic hero with vibe tags + live activity pulse
  → Social proof: avatar clusters, momentum labels, activity signals
  → AI match reason + identity label
  → Live Social Energy section (discussions, reactions, bookmarks)
  → Join conversation (+15 XP)
  → Share button awards +10 XP once per event
  → Copy Link button — copies URL to clipboard with toast confirmation
  → "Open Chat" button → Event Chat room
    ↓
Event Chat (/app/events/:id/chat)
  → Real-time group chat room scoped to an event
  → All attendees and the event organizer can participate
  → Sending a message awards +5 XP (chat_message reason)
  → Messages show user name, avatar, role badge, and timestamp
  → Organizer messages highlighted with a cyan accent
    ↓
RSVP / Checkout
  → Select ticket type & quantity (up to 10 per booking)
  → 15-minute ticket hold timer starts on first selection (urgent red at < 2 min)
  → Payment method toggle: Card (default) or Eventra Wallet
      – Wallet button disabled + dimmed when balance is insufficient
      – Wallet selected: card fields hidden; balance summary panel shows balance & amount after payment
  → Card payment: inline validation (cardholder name + card number required)
  → Processing spinner on checkout button
  → Confetti + XP award on success
  → Redirect to Order Summary with real QR code
    ↓
My Events
  → Upcoming / Past / Bookmarked tabs
  → Empty state cards when tabs have no events
  → Cancellation countdown (48-hour window enforcement)
  → Cancel booking with partial-quantity selector (how many tickets to cancel)
  → Refund credited to Eventra Wallet instantly (no failure simulation)
  → Past events: "Write a Review" modal (star rating + text) awards +20 XP on submit
  → View ticket → Order Summary with QR
    ↓
Wallet
  → Balance hero with available EGP balance + wallet status
  → Quick-action cards: Add Funds · Withdraw · History · Payment Methods
  → 5 most recent transactions (inline debit/credit coloring)
  → Link to full transaction history
    ↓
Wallet — Add Funds (/app/wallet/deposit)
  → Quick-amount buttons (EGP 100 / 250 / 500 / 1000) or custom amount (min 50)
  → Card form: cardholder name, card number (auto-formatted), expiry, CVV
  → 700 ms mock processing → balance updated → success screen
    ↓
Wallet — Transaction History (/app/wallet/transactions)
  → Filter chips: All · Deposits · Payments · Refunds · Withdrawals
  → Full scrollable list with amount, running balance, type badge, date
    ↓
Wallet — Withdraw (/app/wallet/withdraw)
  → Amount input with min (50) and max (balance) enforcement
  → Static linked bank destination (demo)
  → Remaining balance preview before submit
    ↓
Wallet — Payment Methods (/app/wallet/methods)
  → Two mock saved cards displayed as card-surface rows
  → Add new card via Dialog (card number auto-formatted, brand inferred)
  → Remove non-default cards via ConfirmationModal (destructive)
    ↓
Community
  → Browse joined & suggested communities
  → Community Detail: Discussions / Events / Members tabs
  → Join discussions (+15 XP each)
    ↓
Messages (/app/messages)
  → Two tabs: Announcements (organizer broadcasts) and Direct Messages
  → DM threads: list of conversations with unread counts
  → Open a thread to read and reply inline
  → Mobile: thread list collapses when conversation is open
    ↓
Notifications
  → Real store notifications + fallback static data
  → Relative timestamps ("2 minutes ago", "yesterday")
  → Click to mark as read, navigate to action URL
  → Mark all as read
  → Empty state when no notifications
    ↓
Achievements
  → Level display + XP progress bar (progressive formula)
  → Current streak 🔥 and longest streak
  → Earned badges grid (colored, with tier labels)
  → Locked badges grid (grayscale)
  → Link to Reward Store
    ↓
Reward Store
  → Redeem points for free tickets, VIP access, profile highlights, vouchers
  → Copyable promo codes shown on each eligible reward (Copy icon → Check icon for 2s)
  → Points balance tracked in store
  → Real redemption history from store shown in sidebar (empty state when none)
  → Toast feedback on each redemption showing item name and points deducted
    ↓
Profile
  → Dismissible email verification banner (resend email action)
  → Hero banner + avatar + level badge
  → XP progress bar
  → Stats: events, communities, badges, bookmarks
  → Tabs: Overview / Badges / Activity
  → Request Organizer Status (modal with reason + event selector)
  → Sign Out
```

---

### Organizer Flow

```
Register (/register)
  → Role selection screen: "Join as Organizer" card
  → Organizer form: fill name, email, password + confirm (side-by-side), location,
      organization name (optional), event planning experience (textarea)
      Select event type chips (Conferences, Workshops, Concerts, Meetups, Festivals, Exhibitions)
  → Submit → redirected to /register/pending
  → 60-second auto-approval simulation (demo); "Check Status Now" for manual check
  → On approval: redirected to /organizer/onboarding
    ↓
Organizer Onboarding (5 steps)
  1. Identity — Solo Creator or Brand & Venue
  2. Organization — name, category, team size, website
  3. Verification — email / phone / ID upload
  4. Branding — tagline, brand color, logo upload, live preview
  5. Launch — team invite + checklist
    ↓
Organizer Dashboard
  → Greeting + date-aware welcome
  → KPI cards: Revenue, Attendees, Active Events, Fill Rate (with sparklines)
  → Active Events bento: fill bars, manage links, "almost full" badges
  → AI Insights panel: tabbed insights with impact levels
  → Recent Activity feed with relative timestamps (live indicator)
  → Fill Rate radial chart per event
  → This Month metrics
  → Quick Actions
    ↓
My Events
  → Searchable, filterable table (All / Upcoming / Past / Drafts / Rejected)
  → Per-event: image, date, attendees/capacity, revenue, status, actions
  → Rejected tab: shows rejection reason + "Edit & Resubmit" button
    ↓
Event Chat (/organizer/events/:id/chat)
  → Organizer view of the event group chat room
  → Can read all attendee messages and post as organizer (cyan-highlighted)
  → Sending a message awards +5 XP
    ↓
Wallet (/organizer/wallet)
  → Cyan-themed balance hero with available balance + pending payout indicator
  → "Request Payout" CTA button links to withdraw page
  → 3 KPI cards: Total Earned · Platform Fees Deducted · Available Balance
  → 5 most recent transactions (earnings, fees, payouts) with running balance
  → Link to full transaction history
    ↓
Wallet — Request Payout (/organizer/wallet/withdraw)
  → Empty state if no payout methods added (prompts to add one first)
  → Radio-button selector for configured payout methods
  → Amount input with min (configurable, default EGP 500) and balance validation
  → Optional notes field
  → Submitted request appears in Admin payout queue; organizer balance decremented immediately
    ↓
Wallet — Transaction History (/organizer/wallet/transactions)
  → Filter chips: All · Earnings · Fees · Payouts
  → Full scrollable list with credit/debit coloring
    ↓
Wallet — Payout Methods (/organizer/wallet/methods)
  → Lists saved methods (bank transfer, Vodafone Cash, InstaPay) as card-surface rows
  → Add method via Dialog: choose type → fill account name, bank/phone/InstaPay ID
  → Remove non-default methods via ConfirmationModal (destructive)
  → First added method auto-set as default
    ↓
Create Event (4-step wizard, with per-step validation)
  1. Basics — title, category, date, time (all required, validated before advance)
  2. Location — venue, address, city (all required)
  3. Description & Media — description (required), image URL, vibe tags (up to 3)
  4. Ticketing — capacity (required ≥ 1), price, preview card
  → Inline field error messages on validation failure
  → Unsaved-changes warning: navigating away mid-form shows "Discard changes?" confirmation
  → Publish button shows spinner during submission
  → Critical edit warning banner when date/time/venue/city/price/capacity change in edit mode
    ↓
Manage Event (4 tabs)
  → Attendees — scrollable table with export
  → Analytics — 4 KPI cards + registration bar chart
  → Community — post update CTA
  → Check-in — manual attendee list with "Check In" buttons; each check-in toasts "+50 XP awarded"
    ↓
Analytics
  → Period selector: 7d / 30d / 90d / All
  → KPI row: page views, registrations, conversion, revenue
  → Registration timeline bar chart (period-aware)
  → Traffic sources + age demographics horizontal bars
  → Conversion funnel (page views → bookings)
  → Revenue & attendance by event
  → AI Insights panel: peak booking window, audience fit score, retention opportunity, revenue forecast
  → Retention metrics
    ↓
Messages (/organizer/messages)
  → Two tabs: Broadcast (compose to all attendees or VIP segment) and Inbox (DMs from attendees)
  → Broadcast: subject + body compose form with recipient count preview
  → Inbox: thread list with unread indicators; click to open conversation
    ↓
Notifications (/organizer/notifications)
  → All platform notifications for the organizer
  → Relative timestamps; mark-as-read; mark-all-read
  → Empty state when no notifications
    ↓
Profile
  → Organizer-specific hero (cyan theme)
  → Stats: events, attendees, revenue, communities
  → Tabs: Overview / Events / Stats
  → AI Insights panel
  → Sign Out
```

---

### Admin Flow

```
Login (admin@demo.com)
    ↓
Admin Onboarding (4 steps) — first-time setup
  1. Welcome — platform overview + warning notice
  2. Permissions — acknowledge 6 admin capabilities
  3. Notifications — configure alert preferences
  4. Ready — "Enter Dashboard" → navigates to /admin/dashboard
    ↓
Admin Dashboard
  → Greeting + platform status
  → KPI cards: Users, Events, Revenue, Flags (with sparklines)
  → Real-time Activity feed with relative timestamps (live indicator, flag highlighting)
  → Pending Reviews panel: events, reports, flagged posts, organizer requests
  → Quick Actions
  → User Growth bar chart (12 months)
  → User Breakdown donut chart (attendees / organizers / admins)
  → System Health progress bars (API, DB, AI Engine, Storage, CDN)
  → Top Organizers list
  → AI Platform Intelligence metrics
    ↓
Event Moderation
  → Pending Approval list with full event details
  → AI risk score indicator per pending event
  → Verification badge on organizer name
  → All / Flagged tabs
  → Approve / Reject via confirmation modal
  → Recently Approved section
    ↓
User Management
  → 4 KPI quick-filter cards: Total Users · Attendees · Organizers · Suspended
      (click a card to filter the table; click again to clear)
  → Debounced search by name or email
  → Role filter chips: All / Attendee / Organizer / Admin
  → Status filter chips: All / Active / Pending / Suspended / Banned
  → Export CSV — downloads all users (filtered or full) as a .csv file
  → Pending Organizers panel: approve or reject (reject requires reason text)
  → Per-user action buttons (each shows loading spinner while processing):
      View User — profile info + Activity Log tab (timestamped action history)
      Grant Verified Status — organizers only; adds cyan verified badge
      Suspend — modal with required reason + optional date picker (default 30 days)
      Unsuspend — appears only for currently suspended users; confirmation modal
      Ban — destructive red modal; required reason; permanent action
      Send Message — subject + body form; creates notification + DM thread for user
      Force Password Reset — creates a notification prompting user to reset
  → All actions show success/error toasts and persist to localStorage
    ↓
Community Moderation
  → Flagged content list with type, author, reason, report count
  → Approve / Remove / Warn actions via ConfirmationModal (Remove uses destructive styling)
  → Context button shows inline toast
  → KPI card tracks resolved count dynamically
  → Recent moderator actions
    ↓
Moderation Center
  → AI trust score badge
  → Per-item checkboxes for bulk selection
  → Select-all toggle + "Approve Selected" / "Remove Selected" bulk action bar
  → Per-item: Approve / Escalate / Reject actions
  → Empty state when queue is clear or search returns no results
  → AI moderation signals sidebar
  → Quick action links
    ↓
Analytics
  → Period selector: 7d / 30d / 6m / 1y
  → Chart skeleton shown for 500ms on period change
  → KPI row: active users, events, revenue, retention
  → User Growth + Revenue bar charts (period-aware)
  → Category Performance grid (6 categories with growth %)
  → Top Cities geographic breakdown
  → Engagement metrics (DAU, WAU, MAU, session time, bounce rate)
  → Revenue breakdown (ticket sales, fees, VIP, partnerships)
    ↓
Audit Logs
  → 20 mock audit log entries across all action types
  → Search by admin, action, or target ID
  → Filter by target type: all / user / event / booking / config
  → Table: Timestamp (relative, with absolute on hover), Admin, Action, Target, IP Address
  → Expandable rows showing previousState / newState as JSON diff
  → CSV export with "Changes" column (diffs previous → new state per field)
    ↓
Messages (/admin/messages)
  → Two tabs: Broadcast (send platform-wide messages to organizers) and Inbox (DMs from organizers)
  → Broadcast: subject + body form with recipient-count preview
  → Inbox: thread list of admin ↔ organizer direct conversations
    ↓
Platform Settings
  → Feature flags (AI recommendations, AI chat, fraud detection)
  → Email templates
  → Integrations (connect/configure)
  → General settings (platform name, email, currency, fee %)
  → Cancellation window hours, ticket hold timeout
  → Payout Settings section: minimum payout amount + auto-approve threshold
  → Notification preferences
  → "Save Changes" shows spinner (1.2s) then persists to Zustand store
    ↓
Wallet (/admin/wallet)
  → Red-themed; 4 KPI cards: Total Fees Collected · This Month's Fees · Pending Payouts · Active Organizers
  → Platform Settings summary (fee %, min payout, auto-approve threshold)
  → Preview of up to 3 pending payout requests with organizer name, method, amount
  → "Manage all" link to full payout management page
    ↓
Wallet — Payout Requests (/admin/wallet/payouts)
  → Filter chips: All · Pending · Approved · Rejected · Completed
  → Pending count badge on the Pending chip
  → Per-request card: organizer name, request date, amount, payout method detail, optional notes
  → Approve via ConfirmationModal (with optional admin notes field)
  → Reject via ConfirmationModal (destructive; reason required; refunds balance to organizer)
  → Approved/rejected status pills update in real time
    ↓
Profile (Admin)
  → Red/dark hero theme
  → Platform stats (reads live organizer requests)
  → Tabs: Overview / Access / System
  → Permissions grid
  → System health + AI engine versions
  → Sign Out
```

---

## Feature Breakdown

### Public Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing page with hero, AI features, gamification, organizer section, CTA |
| Login | `/login` | 3 demo account cards + manual email/password form. Password is not validated — credential checking is deferred to the backend. Role-based redirect on success |
| Register | `/register` | Two-step flow: role selection screen (Attendee / Organizer cards) → role-specific form. Attendee form includes interest chip selection (min 3). Organizer form includes org name, experience, and event-type chips. Per-field inline validation on blur. Organizer routes to `/register/pending` after submit |
| Pending Approval | `/register/pending` | 60-second auto-approval simulation; "Check Status Now" button; manual check approves after 30 s |
| Forgot Password | `/forgot-password` | Email input + success state ("Check your email") |
| Reset Password | `/reset-password/:token` | New password + confirm fields. Invalid/missing token shows error. Redirects to login on success |
| Verify Email | `/verify-email/:token` | Token present = success; absent = failure with resend button |
| Account Suspended | `/suspended` | Suspension message + mailto support link + "Try a different account" link |
| Onboarding | `/onboarding` | 6-step attendee setup wizard |

### Attendee Features

| Feature | Route | Description |
|---------|-------|-------------|
| Discover | `/app/discover` | AI-powered event feed; 800ms skeleton on load; J/K keyboard navigation; AI Search (Ctrl+K) |
| Event Detail | `/app/events/:id` | Cinematic event page with social proof, vibe tags, AI matching, live energy; Share (+10 XP) and Copy Link buttons; "Open Chat" button to enter event chat room |
| Event Chat | `/app/events/:id/chat` | Real-time group chat room for the event; all attendees and organizer participate; +5 XP per message sent |
| RSVP | `/app/events/:id/rsvp` | Ticket selection with 15-min hold timer; Card or Wallet payment toggle; wallet disabled when balance insufficient; processing spinner; confetti + XP on success |
| Order Summary | `/app/orders/:id` | Booking confirmation with real QR code; shows "Paid with Eventra Wallet" when wallet was used |
| Calendar | `/app/calendar` | Month/week view with event dots, upcoming events list |
| My Events | `/app/my-events` | Upcoming/Past/Bookmarked tabs with empty states; partial-quantity cancel; instant wallet refund on cancel; "Write Review" (+20 XP) |
| Community | `/app/community` | Browse joined + suggested communities |
| Community Detail | `/app/community/:id` | Discussions, events, members tabs |
| Messages | `/app/messages` | Announcements tab (organizer broadcasts) + Direct Messages tab with thread list and inline reply |
| Notifications | `/app/notifications` | Real store notifications; relative timestamps; mark-as-read; empty state |
| Achievements | `/app/profile/achievements` | XP level, streaks, earned/locked badges with tier colors |
| Reward Store | `/app/rewards/store` | Redeem points for perks; copyable promo codes on reward cards; real redemption history |
| Profile | `/app/profile` | Full attendee profile with dismissible email verification banner, tabs, organizer request flow |
| Wallet | `/app/wallet` | Balance hero (purple); quick-action cards; 5 recent transactions; live balance badge in sidebar |
| Wallet — Add Funds | `/app/wallet/deposit` | Quick-amount presets + custom card form; 700 ms mock processing |
| Wallet — History | `/app/wallet/transactions` | Type-filter chips; full scrollable list with running balances |
| Wallet — Withdraw | `/app/wallet/withdraw` | Amount input with balance validation; static linked bank destination |
| Wallet — Methods | `/app/wallet/methods` | Manage saved cards; add via Dialog; remove via ConfirmationModal |

### Organizer Features

| Feature | Route | Description |
|---------|-------|-------------|
| Onboarding | `/organizer/onboarding` | 5-step brand setup wizard |
| Dashboard | `/organizer/dashboard` | Bento layout with KPIs, AI insights, relative-timestamp activity feed |
| My Events | `/organizer/events` | Searchable event table with All/Upcoming/Past/Drafts/Rejected filters; Rejected tab shows reason + Edit & Resubmit |
| Create Event | `/organizer/events/create` | 4-step wizard; per-field inline errors; unsaved-changes navigation blocker; publish spinner |
| Manage Event | `/organizer/events/:id/manage` | Attendees, analytics, community, and manual check-in tabs (check-in toasts +50 XP per attendee) |
| Event Chat | `/organizer/events/:id/chat` | Organizer view of the event chat room; messages appear with cyan organizer highlight; +5 XP per message |
| Analytics | `/organizer/analytics` | Period-aware charts, funnel, demographics, revenue breakdown, AI Insights panel |
| Messages | `/organizer/messages` | Broadcast tab (compose to all attendees or VIP segment) + Inbox tab (DMs from attendees) |
| Notifications | `/organizer/notifications` | All organizer notifications with relative timestamps; mark-as-read; mark-all-read; empty state |
| Profile | `/organizer/profile` | Organizer profile with stats and AI insights |
| Wallet | `/organizer/wallet` | Cyan-themed balance hero; Total Earned / Fees / Available KPI cards; live balance badge in sidebar |
| Wallet — Payout | `/organizer/wallet/withdraw` | Request payout to configured method; submitted to admin queue |
| Wallet — History | `/organizer/wallet/transactions` | Earnings / Fees / Payouts filter chips; running-balance list |
| Wallet — Methods | `/organizer/wallet/methods` | Add/remove bank transfer, Vodafone Cash, InstaPay payout methods |

### Admin Features

| Feature | Route | Description |
|---------|-------|-------------|
| Onboarding | `/admin/onboarding` | 4-step admin setup with permissions acknowledgment |
| Dashboard | `/admin/dashboard` | Platform KPIs, relative-timestamp real-time activity, system health, AI intelligence |
| Event Moderation | `/admin/events` | Approve/reject pending events with AI risk scores and confirmation modals |
| User Management | `/admin/users` | 4 KPI quick-filter cards; debounced search + role/status filters; Export CSV; View User modal (Profile + Activity Log tabs); Grant Verified (organizers only); Suspend (reason + date); Unsuspend; Ban (destructive, permanent); Send Message; Force Password Reset — all with loading spinners and toast feedback |
| Community | `/admin/community` | Flagged content moderation |
| Moderation Center | `/admin/moderation` | Bulk-selectable review queue; empty states for clear queue and no-match search |
| Analytics | `/admin/analytics` | Platform-wide metrics with period selector; chart skeleton on period change |
| Audit Logs | `/admin/audit-logs` | Searchable, filterable, expandable audit trail; relative timestamps with absolute on hover; CSV export |
| Messages | `/admin/messages` | Broadcast tab (compose to organizers) + Inbox tab (DMs from organizers) |
| Settings | `/admin/settings` | Feature flags, email templates, general config, payout settings (min payout + auto-approve threshold); Save shows spinner + persists to store |
| Profile | `/admin/profile` | Admin profile with permissions and system info |
| Wallet | `/admin/wallet` | Platform fee KPIs; pending payout preview list; platform settings summary |
| Wallet — Payouts | `/admin/wallet/payouts` | Approve/reject organizer payout requests; filter by status; admin notes via ConfirmationModal |

---

## Wallet System

The wallet system is a complete in-app financial layer for all three roles, persisted in Zustand and stored under `eventra-storage`. No real payment processing occurs — all operations are instant mock transactions.

### Data Model

| Type | Fields | Notes |
|------|--------|-------|
| `UserWallet` | `userId`, `balance`, `currency`, `status`, `payoutMethods[]` | One wallet per user; balance is the authoritative source for gating payments |
| `WalletTransaction` | `id`, `userId`, `type`, `amount`, `balanceAfter`, `description`, `referenceId?`, `createdAt` | Audit log; `amount` is positive for credits, negative for debits |
| `PayoutMethod` | `id`, `userId`, `type` (`bank_transfer`\|`vodafone_cash`\|`instapay`), `details`, `isDefault`, `createdAt` | Organizer payout destinations |
| `PayoutRequest` | `id`, `organizerId`, `amount`, `methodId`, `status`, `notes?`, `adminNotes?`, `requestedAt`, `processedAt?` | Submitted by organizer; reviewed by admin |

### Transaction Types

| Type | Role | Direction | Trigger |
|------|------|-----------|---------|
| `deposit` | Attendee | Credit | Add Funds page |
| `withdrawal` | Attendee | Debit | Withdraw page |
| `payment` | Attendee | Debit | RSVP checkout (wallet selected) |
| `refund` | Attendee | Credit | Booking cancellation |
| `earning` | Organizer | Credit | RSVP checkout auto-credits organizer |
| `fee` | Organizer | Debit | Platform fee deducted alongside each earning |
| `payout` | Organizer | Debit | Payout request approved by admin |

### Mock Seed Data (`src/data/walletData.ts`)

| Account | Balance | Transactions |
|---------|---------|--------------|
| Sarah (attendee, `user-001`) | EGP 250 | 8: 2 deposits, 3 payments, 2 refunds, 1 withdrawal |
| Ahmed (organizer, `user-002`) | EGP 12,500 | 10: 5 earnings, 4 fees, 1 payout |
| Pending payout requests | — | 3: Ahmed EGP 5,000 · Mona EGP 1,800 · Tarek EGP 750 |

### Integration Points

- **RSVP** — payment method toggle (Card / Wallet); wallet button disabled when `balance < total`; on wallet checkout calls `payWithWallet(total, bookingId)` and sets `booking.paymentMethod = { brand: 'Wallet', last4: '' }`
- **My Events** — cancellation calls `refundToWallet(amount, bookingId)` instead of simulating a 30% failure; refund is instant
- **Order Summary** — detects `booking.paymentMethod.brand === 'Wallet'` and shows wallet icon + "Paid with Eventra Wallet"
- **Organizer earnings** — `rsvpEventFull` calls `recordOrganizerEarning(bookingId, subtotal, 'user-002')` after every paid booking, crediting earnings and deducting the platform fee in one `set()` call
- **Admin Settings** — Payout Settings section persists `minPayoutAmount` and `autoApprovePayoutThreshold` to `systemConfig`
- **Sidebar** — `WalletBalanceBadge` shows live EGP balance below the user card in attendee (purple) and organizer (cyan) layouts

---

## Messaging System

The platform includes a structured in-app messaging system across all three roles.

### Message Types

| Type | Interface | Description |
|------|-----------|-------------|
| `DirectMessage` | `id`, `conversationId`, `senderId/Name/Avatar/Role`, `receiverId/Name/Role`, `content`, `timestamp`, `isRead` | 1-to-1 conversation between two users |
| `BroadcastMessage` | `id`, `senderId/Name/Role`, `targetRole`, `subject`, `content`, `timestamp`, `recipientCount` | One-to-many announcements from organizer or admin |
| `DMThread` | `conversationId`, `partnerId/Name/Avatar/Role`, `lastMessage`, `lastMessageAt`, `unreadCount` | Thread summary shown in the inbox list |

### Per-Role Inbox

| Role | Tab 1 | Tab 2 |
|------|-------|-------|
| **Attendee** | Announcements (broadcasts from organizers) | Direct Messages (DM threads with organizers/admin) |
| **Organizer** | Broadcast (compose to all attendees or VIP segment) | Inbox (DMs from attendees and admin) |
| **Admin** | Broadcast (compose to organizers) | Inbox (DMs from organizers) |

### Seed Data (`src/data/messagesData.ts`)

Pre-populated with sample DM threads and broadcast messages covering all role combinations.

---

## Event Chat System

Each event has a dedicated group chat room accessible to all booked attendees and the event organizer.

### Architecture

- **Business component**: `src/components/business/EventChat.tsx` — shared chat UI (message list + input) used by both the attendee and organizer chat pages
- **Attendee page**: `src/pages/attendee/EventChat.tsx` — renders `EventChat` component; accessible at `/app/events/:id/chat`
- **Organizer page**: `src/pages/organizer/OrganizerEventChat.tsx` — renders `EventChat` component with organizer context; accessible at `/organizer/events/:id/chat`
- **Seed data**: `src/data/eventChatData.ts` — mock `EventMessage[]` keyed by event ID

### Message Type

```ts
interface EventMessage {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole: 'attendee' | 'organizer' | 'admin';
  content: string;
  createdAt: string;
}
```

Organizer messages are highlighted with a cyan accent. Each message sent awards **+5 XP** (`chat_message` reason).

---

## Global UX Components

These components are mounted at the app root (`App.tsx`) and appear across all roles:

| Component | File | Behavior |
|-----------|------|----------|
| `SessionTimeoutWarning` | `src/components/business/SessionTimeoutWarning.tsx` | Polls `tokenExpiry` every 5 s; shows a modal 2 minutes before expiry with countdown; "Extend Session" adds 30 min; on expiry auto-logs out and redirects to `/login` with an error toast |
| `PrivacyConsentModal` | `src/components/business/PrivacyConsentModal.tsx` | Checks `localStorage` for `eventra-privacy-consent`; shown once on first login. "Allow all" enables location; "Essential only" skips location |
| `ErrorBoundary` | `src/components/business/ErrorBoundary.tsx` | React class component wrapping the entire app; catches render errors and shows a fallback card with "Try again" (reload) and "Back to home" links |
| `OfflineBanner` | `src/components/business/OfflineBanner.tsx` | Listens to `online`/`offline` browser events; shows a fixed amber top banner with a WiFi-off icon when the network is unavailable; disappears automatically on reconnect |
| `KeyboardShortcutsModal` | `src/components/business/KeyboardShortcutsModal.tsx` | Triggered by pressing `?`; lists all global keyboard shortcuts in a Radix Dialog |
| Skip Link | `src/app/App.tsx` | Visually hidden `<a href="#main-content">` that becomes visible on focus; allows keyboard users to skip sidebar navigation |

---

## Accessibility & Navigation

### Keyboard Shortcuts

Registered globally via the `useKeyboardShortcuts` hook. Shortcuts do not fire when focus is inside an input or textarea.

| Shortcut | Action |
|----------|--------|
| `Ctrl / Cmd + K` | Open AI Search modal |
| `?` | Open Keyboard Shortcuts modal |
| `Esc` | Close any open modal |
| `J` | Focus next event card (Discover page) |
| `K` | Focus previous event card (Discover page) |

### Mobile Bottom Tab Bar

A fixed bottom navigation bar (`MobileBottomNav`) is rendered inside each role layout and is hidden on `lg` screens and above. It supplements the existing hamburger sidebar — both exist simultaneously on mobile.

| Role | Tabs |
|------|------|
| Attendee | Discover · My Events · Community · Wallet · Profile |
| Organizer | Dashboard · My Events · Analytics · Wallet · Profile |
| Admin | Dashboard · Events · Users · Wallet · Analytics |

The bar respects iOS safe-area insets (`env(safe-area-inset-bottom)`). Main content gets `pb-24 lg:pb-0` to prevent overlap.

### Breadcrumb Navigation

Breadcrumbs are rendered automatically inside each layout's `<main>` when the current route is 2 or more segments deep. They use the existing `Breadcrumb` component family from `src/app/components/ui/breadcrumb.tsx`.

Examples:
- `/organizer/events/create` → **Dashboard › Events › Create Event**
- `/admin/audit-logs` → **Dashboard › Audit Logs**
- `/admin/messages` → **Dashboard › Messages**
- `/app/events/:id` → **Discover › Event Detail**
- `/app/events/:id/chat` → **Event Detail › Event Chat**
- `/app/wallet/deposit` → **Wallet › Add Funds**
- `/organizer/wallet/withdraw` → **Wallet › Request Payout**
- `/admin/wallet/payouts` → **Wallet › Payout Requests**

### Focus Management

- Every layout's `<main>` element carries `id="main-content"` — the target of the skip link.
- `ConfirmationModal` uses a Radix `Dialog` which automatically traps focus and responds to `Esc`.

---

## Form Validation System

Inline field validation is applied consistently across all key forms:

| Form | Validated Fields | Trigger |
|------|-----------------|---------|
| Register (Attendee) | Name, Email, Password, Confirm Password; interests chip count (min 3) | `onBlur` per field; interests checked on submit |
| Register (Organizer) | Name, Email, Password, Confirm Password | `onBlur` per field; full check before submit |
| Create Event | Title, Date, Location, Description, Capacity | Per-step before advancing; field error clears on change |
| RSVP / Checkout | Cardholder Name, Card Number | `onBlur`; both required before processing starts |

**CSS classes:**
- `.input-error` — adds red border + red glow on top of `.input-base`; applied conditionally
- `.field-error-msg` — 12px red text below the input; visible only when an error is present

---

## Loading States

Every user-triggered async action provides visual feedback:

| Surface | Trigger | Feedback |
|---------|---------|---------|
| Discover page | Initial mount | 5 skeleton cards for ~800ms |
| Admin Analytics | Period button click | Chart area replaced by skeleton for 500ms |
| Create Event publish | Publish button click | Button disabled + spinner for ~800ms |
| RSVP checkout | Checkout button click | Button disabled + "Processing…" spinner |
| Admin Settings save | Save Changes click | Button disabled + spinner for 1.2s |
| Admin Users actions | Confirm suspend / unsuspend / ban / verify / message / reset | Button replaced by spinner for 600ms |

Spinners use `.btn-spinner` — a 16×16 CSS keyframe-animated border circle, styled to match the button's color context.

---

## Engagement UX System

Eventra implements an ethical behavioral design system that avoids fake numbers while creating genuine social momentum.

### Social Proof (no raw attendee counts)

Instead of "142 attendees", the platform shows:

- **Momentum labels** — "People are joining right now", "Trending among tech enthusiasts", "Popular this weekend"
- **Atmosphere labels** — "High-energy crowd expected", "Small intimate event", "Curated community event"
- **Vibe tags** — "Creative crowd", "Networking-friendly", "Chill atmosphere"
- **Avatar clusters** — real attendee avatars with interest labels
- **Activity signals** — "5 people bookmarked in the last hour", "New discussion activity"
- **Soft activity feedback** — "People are planning their evening together"

### User Behavior Types

The store tracks behavior and adapts the UX:

| Type | Trigger | UX Adaptation |
|------|---------|---------------|
| `passive` | Browsing without RSVPing | Softer CTAs, "Easy to join" framing |
| `fomo` | RSVPed 1–2 events | "Trending now", "Spots filling quickly" |
| `community` | 3+ discussions or 5+ bookmarks | Community previews, conversation prompts |
| `gamified` | 5+ RSVPs or 1000+ XP | XP opportunities, badge unlocks, leaderboard |

---

## Gamification System

### XP & Points Table

| Action | XP | Points |
|--------|----|--------|
| RSVP to event | 10 | 5 |
| Attend event | 50 | 25 |
| Check-in (organizer marks attendee) | +50 XP toast | — |
| Join discussion | 15 | 5 |
| Bookmark event | 5 | 2 |
| Signup bonus | 50 | — |
| Daily streak bonus | 100 | 50 |
| Share event | 10 (once per event) | 5 |
| Copy event link | 10 (once per event, shared with Share) | 5 |
| Send event chat message | 5 | — |
| Leave review | 20 | 10 |
| Referral | 200 | 100 |

### Level Formula

Levels use a progressive staircase formula:

```ts
getXPForLevel(level) = 100 * level + 50 * (level * (level - 1)) / 2
```

Level boundaries: Level 1 = 0 XP, Level 2 = 100 XP, Level 3 = 250 XP, Level 4 = 450 XP, …

### Activity Streaks

The store tracks `currentStreak`, `longestStreak`, and `lastActivityDate`. `checkStreak()` is called on every login and compares today's date against the last activity date to increment or reset the streak.

### Badge Definitions

| Badge | Tier | Unlock Condition | XP Bonus |
|-------|------|-----------------|---------|
| First Attendee | Bronze | RSVP to your first event | +50 XP |
| Event Explorer | Silver | Attend 5 events | +100 XP |
| Community Builder | Bronze | Join 3 discussions | +75 XP |
| Streak Master | Gold | Maintain a 7-day activity streak | +150 XP |
| Super Fan | Platinum | Attend 10 events from same organizer | +200 XP |
| Early Bird | Bronze | RSVP within 1 hour of an event being published | +50 XP |
| Influencer | Silver | Share 5 events on social media | +75 XP |
| Verified Attendee | Bronze | Complete all profile fields | +25 XP |

---

## Design System

### Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--primary` | `#6C4CF1` | `#8B7CFF` | Buttons, active states, AI interactions |
| `--purple-core` | `#7C5CFF` | `#7C5CFF` | Brand, gradients |
| `--cyan-core` | `#00D4FF` | `#00D4FF` | Search, messaging, organizer theme |
| `--orange-core` | `#FF9B3D` | `#FF9B3D` | Rewards, XP, energy |
| `--pink-core` | `#FF4FD8` | `#FF4FD8` | Accent for AI and glow effects |
| `--background` | `#F7F6FF` | `#0A0F1E` | Page background |

### Surface Classes

| Class | Description |
|-------|-------------|
| `.surface-panel` | Primary glass card (white/dark with blur) |
| `.hero-surface` | Larger hero card with stronger shadow |
| `.card-surface` | Compact card for lists and grids |
| `.glow-card` | Dark atmospheric card with purple glow |
| `.atmo-panel` | Deep dark glass for immersive sections |
| `.bento-section` | Standard bento-box content block |
| `.kpi-card` | KPI stat card with hover lift |

### Typography Scale

| Class | Size | Weight | Usage |
|-------|------|--------|-------|
| `.text-display` | 48px | 800 | Hero numbers and large displays |
| `.text-h1` | 32px | 700 | Page titles |
| `.text-h2` | 24px | 700 | Section headings |
| `.text-h3` | 18px | 600 | Card titles |
| `.text-h4` | 15px | 600 | Sub-headings |
| `.text-body` | 16px | 400 | Body text |
| `.text-body-sm` | 14px | 400 | Secondary text |
| `.text-caption` | 12px | 400 | Labels, timestamps |
| `.text-micro` | 11px | 500 | Chips, tags |

### Button Classes

| Class | Style |
|-------|-------|
| `.btn-primary` | Purple gradient pill with glow shadow |
| `.btn-secondary` | Ghost border pill |
| `.btn-ghost` | Transparent, hover background |

### Form & Feedback Classes

| Class | Description |
|-------|-------------|
| `.input-base` | Base input style with focus ring |
| `.input-error` | Additive class — red border + red glow on top of `.input-base` |
| `.field-error-msg` | 12px red error text rendered below a field |
| `.btn-spinner` | 16×16 CSS-animated border spinner for use inside buttons (`<span className="btn-spinner" />`) |

### Component Classes

| Class | Description |
|-------|-------------|
| `.icon-box` | Square icon container with rounded corners |
| `.icon-box-primary` / `-cyan` / `-orange` / `-red` / `-green` | Color variants for icon boxes |
| `.activity-item` | Row layout for activity feed entries |
| `.status-pill` | Uppercase inline status badge |
| `.filter-chip` | Selectable filter pill (`.active` / `.inactive` states) |
| `.bento-header` | Flex row header inside `.bento-section` |
| `.bento-title` | Section heading inside a bento block |
| `.kpi-value` / `.kpi-label` | KPI number and label text |
| `.gradient-text` | Purple-to-cyan gradient text |
| `.glass` | Frosted glass overlay |
| `.badge-ai` | AI feature badge pill |

---

## Project Structure

```
src/
├── app/
│   └── App.tsx                    # Router + RequireAuth + RedirectIfAuth guards + global components
│                                  # Includes AppShell inner component (inside BrowserRouter) for:
│                                  #   OfflineBanner, SessionTimeoutWarning, PrivacyConsentModal,
│                                  #   KeyboardShortcutsModal, useKeyboardShortcuts, skip link
├── components/
│   ├── Logo.tsx                   # SVG logo (small / horizontal / large, light/dark)
│   ├── AISearchModal.tsx          # AI natural language search modal
│   ├── layout/
│   │   ├── AttendeeLayout.tsx     # Sidebar + MobileBottomNav + breadcrumbs (id="main-content")
│   │   ├── OrganizerLayout.tsx    # Sidebar + MobileBottomNav + breadcrumbs (id="main-content")
│   │   ├── AdminLayout.tsx        # Sidebar + MobileBottomNav + breadcrumbs (id="main-content")
│   │   └── MobileBottomNav.tsx    # Fixed bottom tab bar (lg:hidden); active path detection
│   ├── business/
│   │   ├── StatusBadge.tsx        # Color-coded badge for event/booking/account status
│   │   ├── VerificationBadge.tsx  # Cyan checkmark for verified organizers
│   │   ├── ConfirmationModal.tsx  # Reusable confirm dialog (destructive prop for red styling)
│   │   ├── WalletBalanceBadge.tsx # Live EGP balance pill (accepts colorClass for role theming)
│   │   ├── TicketHoldTimer.tsx    # 15-min countdown; urgent red at < 2 min; onExpire callback
│   │   ├── CancellationCountdown.tsx  # Countdown to cancellation deadline
│   │   ├── AIScoreIndicator.tsx   # Visual meter for risk / confidence / match scores (0–100)
│   │   ├── EventChat.tsx          # Shared event chat UI (message list + compose); used by attendee + organizer chat pages
│   │   ├── SessionTimeoutWarning.tsx  # Global modal: warns 2 min before tokenExpiry; extend adds 30 min; auto-logout + redirect on expiry
│   │   ├── PrivacyConsentModal.tsx    # Global modal: shown once on first login for consent preferences
│   │   ├── ErrorBoundary.tsx      # React class component; catches render errors; fallback card with reload + home link
│   │   ├── OfflineBanner.tsx      # Fixed amber banner on offline; disappears on reconnect
│   │   └── KeyboardShortcutsModal.tsx # Lists all keyboard shortcuts; triggered by ?
│   └── shared/
│       ├── XPProgressBar.tsx      # XP progress to next level using progressive formula
│       ├── PointsBalance.tsx      # Points balance widget with optional redeem link
│       └── EmptyState.tsx         # Reusable empty state: icon + title + description + optional CTA button
├── constants/
│   ├── badges.ts                  # BADGE_DEFINITIONS array + getBadgeById()
│   └── config.ts                  # DEFAULT_SYSTEM_CONFIG, XP_TABLE, POINTS_TABLE
├── data/
│   ├── mockData.ts                # Events, communities, bookings + EngagementData types
│   ├── users.ts                   # Demo accounts + OrganizerRequest types
│   ├── notifications.ts           # Notification data per user (types include admin_message, force_password_reset)
│   ├── adminUsersData.ts          # ManagedUser[], UserActivityEntry, initialManagedUsers (12 users), mockUserActivity
│   ├── messagesData.ts            # Seed DirectMessage[], BroadcastMessage[], DMThread[] for all roles
│   ├── eventChatData.ts           # Seed EventMessage[] keyed by event ID for event chat rooms
│   └── walletData.ts              # Seed wallets, transactions (Sarah 8, Ahmed 10), 3 pending payout requests, platform fee constants
├── hooks/
│   ├── useKeyboardShortcuts.ts    # Maps key combos → handlers; guards against firing in inputs
│   └── useBreadcrumbs.ts          # Returns {label, path?}[] from location/params; empty when depth < 2
├── lib/
│   ├── axios.ts                   # Axios instance with auth interceptors + mock-mode guard
│   └── utils.ts                   # cn(), formatCurrency, formatDate, formatRelativeTime,
│                                  # getXPForLevel, getLevelFromXP
├── pages/
│   ├── public/
│   │   ├── Landing.tsx
│   │   ├── Login.tsx              # Demo cards + manual form; password accepted as-is (no frontend credential check)
│   │   ├── Register.tsx           # Two-step flow: role selection cards → role-specific form; attendee interest chips (min 3); organizer event-type chips; state resets on role switch
│   │   ├── PendingApproval.tsx    # 60-s auto-approval simulation + manual status check
│   │   ├── ForgotPassword.tsx     # Email input + success state
│   │   ├── ResetPassword.tsx      # New password form with token validation
│   │   ├── VerifyEmail.tsx        # Email verification success/failure
│   │   ├── AccountSuspended.tsx   # Suspension notice with support contact
│   │   └── Onboarding.tsx         # 6-step attendee wizard
│   ├── attendee/
│   │   ├── Discover.tsx           # Skeleton loader on mount; J/K keyboard navigation; focused card ring
│   │   ├── EventDetail.tsx        # Share (+10 XP once) + Copy Link button; "Open Chat" button
│   │   ├── EventChat.tsx          # Event group chat room page for attendees
│   │   ├── RSVP.tsx               # Card / Wallet payment toggle; wallet balance check; processing spinner
│   │   ├── OrderSummary.tsx       # Wallet payment display (icon + "Paid with Eventra Wallet")
│   │   ├── Calendar.tsx
│   │   ├── MyEvents.tsx           # Empty states per tab; partial-qty cancel; instant wallet refund; Write Review (+20 XP)
│   │   ├── Messages.tsx           # Announcements + Direct Messages tabs
│   │   ├── wallet/
│   │   │   ├── AttendeeWallet.tsx       # Balance hero, quick-action kpi-cards, recent transactions
│   │   │   ├── WalletTransactions.tsx   # Filter chips + full transaction list
│   │   │   ├── WalletDeposit.tsx        # Quick-amount buttons + card form, 700 ms mock processing
│   │   │   ├── WalletWithdraw.tsx       # Amount input with balance validation
│   │   │   └── WalletMethods.tsx        # Saved cards; add via Dialog; remove via ConfirmationModal
│   │   ├── Community.tsx
│   │   ├── CommunityDetail.tsx
│   │   ├── Notifications.tsx      # Relative timestamps; EmptyState when no notifications
│   │   ├── Achievements.tsx       # Streaks, XPProgressBar, badge tiers from BADGE_DEFINITIONS
│   │   ├── RewardStore.tsx        # Copyable promo codes on reward cards; real redemption history
│   │   ├── Profile.tsx            # Smart router → role-specific profile
│   │   └── AttendeeProfile.tsx    # Dismissible email verification banner
│   ├── organizer/
│   │   ├── OrganizerDashboard.tsx # Relative timestamps on recent activity feed
│   │   ├── OrganizerEvents.tsx    # Rejected tab with reason + Edit & Resubmit
│   │   ├── CreateEvent.tsx        # 4-step wizard; field errors; useBlocker unsaved-changes guard; publish spinner
│   │   ├── ManageEvent.tsx        # Manual check-in list; each check-in toasts +50 XP
│   │   ├── OrganizerEventChat.tsx # Organizer view of event chat room
│   │   ├── OrganizerAnalytics.tsx # AI Insights panel included
│   │   ├── OrganizerMessages.tsx  # Broadcast + Inbox tabs
│   │   ├── OrganizerNotifications.tsx  # Full notifications page for organizers
│   │   ├── OrganizerOnboarding.tsx
│   │   ├── OrganizerProfile.tsx
│   │   └── wallet/
│   │       ├── OrganizerWallet.tsx            # Cyan balance hero, earnings KPIs, recent activity
│   │       ├── OrganizerWalletWithdraw.tsx    # Method radio selector + amount input
│   │       ├── OrganizerWalletTransactions.tsx # Earnings / Fees / Payouts filter chips
│   │       └── OrganizerWalletMethods.tsx     # Add via Dialog; remove via ConfirmationModal
│   └── admin/
│       ├── AdminDashboard.tsx     # Relative timestamps on real-time activity feed
│       ├── AdminEvents.tsx        # AI risk scores + verification badges + confirm modals
│       ├── AdminUsers.tsx         # KPI quick-filters, debounced search, role+status filters, CSV export,
│       │                          # View User (Profile + Activity Log tabs), Grant Verified, Suspend,
│       │                          # Unsuspend, Ban, Send Message, Force Password Reset — all with spinners
│       ├── AdminCommunity.tsx
│       ├── AdminMessages.tsx      # Admin Broadcast + Inbox tabs (messages with organizers)
│       ├── AdminModeration.tsx    # Bulk checkboxes; EmptyState for clear queue and no-match search
│       ├── AdminAnalytics.tsx     # Chart skeleton on period change
│       ├── AdminSettings.tsx      # Save spinner (1.2s); payout settings section wired to updateSystemConfig
│       ├── AdminOnboarding.tsx
│       ├── AdminAuditLogs.tsx     # Relative timestamps with absolute title on hover; filterable + CSV export
│       ├── AdminProfile.tsx       # Rendered via Profile.tsx smart router
│       └── wallet/
│           ├── AdminWallet.tsx          # Platform fee KPIs, pending payout preview, settings summary
│           └── AdminWalletPayouts.tsx   # Status filter chips; approve/reject via ConfirmationModal
├── store/
│   └── useAppStore.ts             # Zustand store: auth, events, gamification, behavior, config, wallet, messaging, user management
├── styles/
│   ├── globals.css                # Design system: surfaces, buttons, inputs, animations, spinners
│   ├── theme.css                  # CSS custom properties (light + dark tokens)
│   ├── fonts.css                  # Poppins font import
│   └── index.css                  # Entry point
└── types/
    └── index.ts                   # Centralized TypeScript interfaces (AccountStatus, Badge, Booking, AuditLogEntry,
                                   # SystemConfig, DirectMessage, BroadcastMessage, DMThread, EventMessage,
                                   # ManagedUser, WalletTransaction, PayoutRequest, etc.)
```

---

## Routing Map

### Auth Guards

- **`RequireAuth`** — redirects unauthenticated users to `/login`. If authenticated but wrong role, redirects to the correct dashboard (`/admin/dashboard`, `/organizer/dashboard`, or `/app/discover`).
- **`RedirectIfAuth`** — redirects already-authenticated users away from public pages to their role's dashboard.

### Route Table

| Path | Component | Auth | Notes |
|------|-----------|------|-------|
| `/` | Landing | Public | |
| `/login` | Login | Public (redirect if auth) | |
| `/register` | Register | Public (redirect if auth) | Replaces `/signup` |
| `/register/pending` | PendingApproval | Public | Organizer review with auto-approval demo |
| `/forgot-password` | ForgotPassword | Public | |
| `/reset-password/:token` | ResetPassword | Public | |
| `/verify-email/:token` | VerifyEmail | Public | |
| `/suspended` | AccountSuspended | Public | |
| `/signup` | → `/register` | — | Compat redirect |
| `/onboarding` | Onboarding | Public | |
| `/app` | → `/app/discover` | — | |
| `/app/discover` | Discover | Attendee only | |
| `/app/search` | → `/app/discover` | — | Compat redirect |
| `/app/events/:id` | EventDetail | Attendee only | |
| `/app/events/:id/chat` | EventChat | Attendee only | Event group chat room |
| `/app/events/:id/rsvp` | RSVP | Attendee only | |
| `/app/checkout/:id` | RSVP | Attendee only | Compat redirect |
| `/app/calendar` | Calendar | Attendee only | |
| `/app/my-events` | MyEvents | Attendee only | |
| `/app/my-events/:bookingId/summary` | OrderSummary | Attendee only | |
| `/app/orders/:id` | OrderSummary | Attendee only | |
| `/app/community` | Community | Attendee only | |
| `/app/community/:id` | CommunityDetail | Attendee only | |
| `/app/rewards` | → `/app/profile/achievements` | — | Compat redirect |
| `/app/profile` | Profile | Attendee only | |
| `/app/settings` | → `/app/profile` | — | Compat redirect |
| `/app/profile/achievements` | Achievements | Attendee only | |
| `/app/notifications` | Notifications | Attendee only | |
| `/app/messages` | Messages | Attendee only | Announcements + DM tabs |
| `/app/rewards/store` | RewardStore | Attendee only | |
| `/app/wallet` | AttendeeWallet | Attendee only | |
| `/app/wallet/transactions` | WalletTransactions | Attendee only | |
| `/app/wallet/deposit` | WalletDeposit | Attendee only | |
| `/app/wallet/withdraw` | WalletWithdraw | Attendee only | |
| `/app/wallet/methods` | WalletMethods | Attendee only | |
| `/organizer` | → `/organizer/dashboard` | — | |
| `/organizer/onboarding` | OrganizerOnboarding | Public | |
| `/organizer/dashboard` | OrganizerDashboard | Organizer only | |
| `/organizer/events` | OrganizerEvents | Organizer only | |
| `/organizer/events/create` | CreateEvent | Organizer only | `?editId=` param enables edit mode |
| `/organizer/events/:id/manage` | ManageEvent | Organizer only | |
| `/organizer/events/:id/chat` | OrganizerEventChat | Organizer only | Organizer view of event chat room |
| `/organizer/analytics` | OrganizerAnalytics | Organizer only | |
| `/organizer/messages` | OrganizerMessages | Organizer only | Broadcast + Inbox tabs |
| `/organizer/notifications` | OrganizerNotifications | Organizer only | Full notifications page |
| `/organizer/reports` | → `/organizer/analytics` | — | Compat redirect |
| `/organizer/profile` | OrganizerProfile | Organizer only | |
| `/organizer/wallet` | OrganizerWallet | Organizer only | |
| `/organizer/wallet/withdraw` | OrganizerWalletWithdraw | Organizer only | |
| `/organizer/wallet/transactions` | OrganizerWalletTransactions | Organizer only | |
| `/organizer/wallet/methods` | OrganizerWalletMethods | Organizer only | |
| `/admin` | → `/admin/dashboard` | — | |
| `/admin/onboarding` | AdminOnboarding | Public | |
| `/admin/dashboard` | AdminDashboard | Admin only | |
| `/admin/events` | AdminEvents | Admin only | |
| `/admin/users` | AdminUsers | Admin only | |
| `/admin/community` | AdminCommunity | Admin only | |
| `/admin/moderation` | AdminModeration | Admin only | |
| `/admin/analytics` | AdminAnalytics | Admin only | |
| `/admin/settings` | AdminSettings | Admin only | |
| `/admin/audit-logs` | AdminAuditLogs | Admin only | |
| `/admin/messages` | AdminMessages | Admin only | Broadcast + Inbox tabs |
| `/admin/wallet` | AdminWallet | Admin only | |
| `/admin/wallet/payouts` | AdminWalletPayouts | Admin only | |
| `/admin/audit-log` | → `/admin/audit-logs` | — | Compat redirect |
| `/admin/fraud` | → `/admin/users` | — | Compat redirect |
| `/admin/ai-health` | → `/admin/analytics` | — | Compat redirect |
| `/admin/profile` | Profile | Admin only | |
| `*` | → `/` | — | Catch-all |

---

## State Management

The Zustand store (`useAppStore`) persists to `localStorage` under the key `eventra-storage`. New fields added to the store default gracefully on hydration — no migration needed.

### Persisted State

```ts
{
  // Auth
  currentUser,             // logged-in User object
  isAuthenticated,         // boolean
  accessToken,             // string | null  (JWT slot, null in demo)
  refreshToken,            // string | null
  tokenExpiry,             // number | null  (Unix ms; set to now+30min on login)

  // User data
  events,                  // Event[]
  bookmarkedEvents,        // string[]  (event IDs)
  rsvpedEvents,            // string[]
  bookings,                // Booking[]
  communities,             // Community[]
  organizerRequests,       // OrganizerRequest[]
  pointsBalance,           // number
  rewardHistory,           // { id, title, redeemedAt }[]

  // Gamification
  xp,                      // number  (top-level, mirrors currentUser.xp)
  level,                   // number  (top-level, computed from xp)
  earnedBadges,            // Badge[]
  currentStreak,           // number  (days)
  longestStreak,           // number
  lastActivityDate,        // string | null  (ISO date)

  // AI & behavior
  userBehaviorType,        // 'passive' | 'fomo' | 'community' | 'gamified'
  engagementActions,       // total micro-action count
  browseCount,             // passive browse count
  discussionCount,         // discussions joined
  interests,               // string[]
  locationEnabled,         // boolean
  userCity,                // string | null
  userCoordinates,         // { lat, lng } | null
  dismissedRecommendations,// string[]  (event IDs)

  // Notifications
  notifications,           // Notification[]

  // Messaging
  directMessages,          // DirectMessage[]  — all DM records across users
  broadcastMessages,       // BroadcastMessage[]  — all broadcast records
  eventMessages,           // Record<eventId, EventMessage[]>  — event chat rooms

  // User management (admin)
  managedUsers,            // ManagedUser[]  — platform user list (12 seed users)

  // UI (not persisted across sessions)
  theme,                   // 'light' | 'dark'
  unreadCount,             // number
  activeModal,             // string | null

  // System config (admin-editable)
  systemConfig,            // SystemConfig

  // Wallet
  wallets,                 // Record<userId, UserWallet>  — balance + payoutMethods per user
  walletTransactions,      // WalletTransaction[]  — full audit log (all users)
  payoutRequests,          // PayoutRequest[]  — organizer payout requests
}
```

### Key Actions

| Action | Effect |
|--------|--------|
| `login(email, password)` | **Async.** Finds user by matching both email and password against the hardcoded demo accounts. Loads notifications, sets `xp`/`level`/`interests`/`unreadCount`, sets `tokenExpiry` to now+30 min, calls `checkStreak()`. Replace with `await api.post('/auth/login', { email, password })` when integrating backend |
| `logout()` | Clears user + auth + gamification state |
| `register(data)` | Mock registration; organizer type returns `status: 'pending'` |
| `refreshAccessToken()` | No-op in demo mode |
| `extendSession()` | Resets `tokenExpiry` to `Date.now() + 30 * 60 * 1000`; called by SessionTimeoutWarning "Extend Session" button |
| `updateProfile(data)` | Patches `currentUser` fields |
| `changePassword(current, new)` | No-op in demo mode |
| `rsvpEvent(id)` | Creates booking, awards XP, shifts behavior type |
| `rsvpEventFull(id, ticketTypeId, qty, paymentSource?)` | Full booking; if `paymentSource === 'wallet'` sets `paymentMethod.brand = 'Wallet'`; auto-calls `recordOrganizerEarning` for paid bookings |
| `cancelBooking(bookingId)` | Sets booking status to `'cancelled'` |
| `toggleBookmark(id)` | Adds/removes bookmark, awards +5 XP on add |
| `awardXP(amount, reason)` | Increments XP, recalculates level via progressive formula, checks badge unlocks |
| `checkStreak()` | Compares `lastActivityDate` to today; increments or resets `currentStreak`; called on every login |
| `recordDiscussion()` | Awards +15 XP, shifts to `community` behavior at 3+ discussions |
| `dismissRecommendation(eventId)` | Adds to `dismissedRecommendations` list |
| `updateBehaviorType()` | Re-runs `detectBehaviorType()` and persists result |
| `redeemReward(id)` | Deducts points, logs redemption |
| `markNotificationAsRead(id)` | Sets notification `isRead: true`, decrements `unreadCount` |
| `markAllRead()` | Marks all notifications read, sets `unreadCount` to 0 |
| `fetchNotifications()` | Async no-op that resolves current state |
| `toggleTheme()` | Switches light/dark mode |
| `setActiveModal(modal)` | Sets `activeModal` to the given string or null |
| `requestOrganizerStatus(eventId, reason)` | Creates pending organizer request |
| `approveOrganizerRequest(id, notes)` | Updates request status to approved |
| `rejectOrganizerRequest(id, notes)` | Updates request status to rejected |
| `updateSystemConfig(config)` | Merges partial config into `systemConfig` |
| `suspendUser(userId, reason, suspendUntil?)` | Updates `managedUsers` entry: `status = 'suspended'`, stores reason + date; creates suspension notification for user |
| `unsuspendUser(userId)` | Restores `managedUsers` entry to `status = 'active'`; clears suspend fields; creates notification |
| `banUser(userId, reason)` | Updates `managedUsers` entry: `status = 'banned'`, stores reason; creates ban notification |
| `grantVerifiedStatus(userId)` | Sets `isVerified = true` on organizer's `managedUsers` entry; creates notification |
| `sendAdminMessageToUser(userId, userName, subject, body)` | Creates `admin_message` notification for user + appends a `DirectMessage` into the DM system |
| `forcePasswordReset(userId, userName)` | Creates `force_password_reset` notification for user |
| `getWallet(userId?)` | Returns `UserWallet` for given user (defaults to `currentUser`); null if no wallet found |
| `addFunds(amount, paymentDetails)` | Credits balance, appends `deposit` transaction |
| `payWithWallet(amount, bookingId)` | Debits balance if sufficient; appends `payment` transaction; returns `false` if insufficient |
| `refundToWallet(amount, bookingId, reason?)` | Credits balance; appends `refund` transaction; called on booking cancellation |
| `withdrawFunds(amount)` | Debits balance; appends `withdrawal` transaction |
| `requestPayout(amount, methodId)` | Debits organizer balance; creates `PayoutRequest` with `status: 'pending'`; appends `payout` transaction; returns `false` if insufficient |
| `approvePayoutRequest(requestId, adminNotes?)` | Sets request `status: 'approved'`; records `processedAt` |
| `rejectPayoutRequest(requestId, adminNotes)` | Sets request `status: 'rejected'`; refunds amount back to organizer balance; appends `refund` transaction |
| `addPayoutMethod(method)` | Appends payout method to organizer's wallet |
| `removePayoutMethod(methodId)` | Removes payout method from organizer's wallet |
| `recordOrganizerEarning(bookingId, grossAmount, organizerId)` | Credits organizer `earning` and simultaneously debits platform `fee` (based on `systemConfig.platformFeePercentage`) in one `set()` call |

### Helper Functions (exported from store)

| Function | Description |
|----------|-------------|
| `getXPForLevel(level)` | Returns XP threshold for a given level using progressive formula |
| `getLevelFromXP(xp)` | Computes current level from total XP |

### Utility Functions (`src/lib/utils.ts`)

| Function | Description |
|----------|-------------|
| `cn(...inputs)` | Merges Tailwind class names (clsx + twMerge) |
| `formatCurrency(amount)` | Formats number as EGP currency string |
| `formatDate(dateStr)` | Short locale date string |
| `formatDateTime(dateStr)` | Date + time locale string |
| `formatRelativeTime(dateStr)` | Human-readable relative time ("2 minutes ago", "yesterday") using `Intl.RelativeTimeFormat`; falls back to `formatDateTime` on error |
| `getXPForLevel(level)` | Progressive XP threshold formula |
| `getLevelFromXP(xp)` | Derives level from total XP |

---

## System Configuration

Default system config values (editable via Admin → Settings):

| Setting | Default | Description |
|---------|---------|-------------|
| `cancellationWindowHours` | 48 | Hours before event when cancellation closes |
| `ticketHoldTimeoutMinutes` | 15 | Minutes a ticket is held after selection |
| `maxTicketsPerBooking` | 10 | Maximum tickets per order |
| `platformFeePercentage` | 5 | Platform fee % on paid tickets |
| `currencySymbol` | EGP | Display currency |
| `reminderIntervals` | [24, 1] | Hours before event to send reminders |
| `xpPerRSVP` | 10 | Base XP for RSVPing |
| `xpPerAttendance` | 50 | XP awarded for attending |
| `xpPerDiscussion` | 15 | XP per discussion joined |
| `streakBonusMultiplier` | 2 | Multiplier applied on streak-bonus XP |
| `aiRecommendationsEnabled` | true | Toggle AI event recommendations |
| `aiChatEnabled` | true | Toggle AI chat assistant |
| `aiFraudDetectionEnabled` | true | Toggle AI fraud detection |
| `minPayoutAmount` | 500 | Minimum EGP amount for organizer payout requests |
| `autoApprovePayoutThreshold` | 2000 | Payout requests below this EGP amount are auto-approved (UI hint only in demo) |

---

## Changelog

### 2026-05-22

#### Fixed
- Fixed variable order issue in Discover.tsx (trending useMemo declared before filteredEvents)
- Fixed filteredEvents useMemo missing trending dependency
- Removed duplicate hero section JSX in Discover.tsx
- Removed extra closing div tags in Discover.tsx

#### Updated
- Changed budget filter in Discover page from range slider to number input
- Modified calendar integration: replaced Google Calendar with app's own calendar modal
  - Updated CalendarAddEventModal to accept initialEvent prop for pre-filling details
  - Updated EventDetail.tsx to use modal with pre-filled event details
  - Updated Calendar.tsx to use modal with pre-filled event details

---

*Built as a frontend demo — all data is mocked and persisted in localStorage. No backend required.*
