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
| **Attendee** | Discover events, join communities, earn XP & badges, RSVP, and engage socially |
| **Organizer** | Create and manage events, view analytics, message attendees, grow audience |
| **Admin** | Moderate content, manage users, review events, monitor platform health, view audit logs |

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

Use these credentials on the Login page for instant access to each role:

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
    ↓
RSVP / Checkout
  → Select ticket type & quantity (up to 10 per booking)
  → 15-minute ticket hold timer starts on first selection (urgent red at < 2 min)
  → Payment form with inline validation (cardholder name + card number required)
  → Processing spinner on checkout button
  → Confetti + XP award on success
  → Redirect to Order Summary with real QR code
    ↓
My Events
  → Upcoming / Past / Bookmarked tabs
  → Empty state cards when tabs have no events
  → Cancellation countdown (48-hour window enforcement)
  → Cancel booking with partial-quantity selector (how many tickets to cancel)
  → 30% simulated chance of refund failure with explanatory toast
  → Past events: "Write a Review" modal (star rating + text) awards +20 XP on submit
  → View ticket → Order Summary with QR
    ↓
Community
  → Browse joined & suggested communities
  → Community Detail: Discussions / Events / Members tabs
  → Join discussions (+15 XP each)
    ↓
Messages
  → Direct messages, group chats, event rooms, organizer broadcasts
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
Messages
  → Compose to all attendees or VIP segment
  → Recent messages list
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
  → Search bar + role filter chips
  → Stats: total, attendees, organizers, suspended
  → Scrollable user table with role badges + verification badge
  → Pending organizer requests panel with approve/reject
  → Actions: View, Grant Verified Status, Suspend, Ban (with confirmation modals)
  → Action buttons show spinner while processing
  → Ban is destructive/irreversible — red modal styling
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
Platform Settings
  → Feature flags (AI recommendations, AI chat, fraud detection)
  → Email templates
  → Integrations (connect/configure)
  → General settings (platform name, email, currency, fee %)
  → Cancellation window hours, ticket hold timeout
  → Notification preferences
  → "Save Changes" shows spinner (1.2s) then persists to Zustand store
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
| Login | `/login` | 3 demo account cards + manual email/password form. Role-based redirect on success |
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
| Event Detail | `/app/events/:id` | Cinematic event page with social proof, vibe tags, AI matching, live energy; Share (+10 XP) and Copy Link buttons |
| RSVP | `/app/events/:id/rsvp` | Ticket selection with 15-min hold timer; payment field validation; processing spinner; confetti + XP on success |
| Order Summary | `/app/orders/:id` | Booking confirmation with real QR code, payment summary, social next-steps |
| Calendar | `/app/calendar` | Month/week view with event dots, upcoming events list |
| My Events | `/app/my-events` | Upcoming/Past/Bookmarked tabs with empty states; partial-quantity cancel; 30% refund failure simulation; "Write Review" (+20 XP) |
| Community | `/app/community` | Browse joined + suggested communities |
| Community Detail | `/app/community/:id` | Discussions, events, members tabs |
| Messages | `/app/messages` | Multi-type messaging: DMs, groups, event rooms, organizer broadcasts |
| Notifications | `/app/notifications` | Real store notifications; relative timestamps; mark-as-read; empty state |
| Achievements | `/app/profile/achievements` | XP level, streaks, earned/locked badges with tier colors |
| Reward Store | `/app/rewards/store` | Redeem points for perks; copyable promo codes on reward cards; real redemption history |
| Profile | `/app/profile` | Full attendee profile with dismissible email verification banner, tabs, organizer request flow |

### Organizer Features

| Feature | Route | Description |
|---------|-------|-------------|
| Onboarding | `/organizer/onboarding` | 5-step brand setup wizard |
| Dashboard | `/organizer/dashboard` | Bento layout with KPIs, AI insights, relative-timestamp activity feed |
| My Events | `/organizer/events` | Searchable event table with All/Upcoming/Past/Drafts/Rejected filters; Rejected tab shows reason + Edit & Resubmit |
| Create Event | `/organizer/events/create` | 4-step wizard; per-field inline errors; unsaved-changes navigation blocker; publish spinner |
| Manage Event | `/organizer/events/:id/manage` | Attendees, analytics, community, and manual check-in tabs (check-in toasts +50 XP per attendee) |
| Analytics | `/organizer/analytics` | Period-aware charts, funnel, demographics, revenue breakdown, AI Insights panel |
| Messages | `/organizer/messages` | Broadcast to attendees |
| Profile | `/organizer/profile` | Organizer profile with stats and AI insights |

### Admin Features

| Feature | Route | Description |
|---------|-------|-------------|
| Onboarding | `/admin/onboarding` | 4-step admin setup with permissions acknowledgment |
| Dashboard | `/admin/dashboard` | Platform KPIs, relative-timestamp real-time activity, system health, AI intelligence |
| Event Moderation | `/admin/events` | Approve/reject pending events with AI risk scores and confirmation modals |
| User Management | `/admin/users` | Search, filter, grant verified badge, suspend, ban; action spinners per user |
| Community | `/admin/community` | Flagged content moderation |
| Moderation Center | `/admin/moderation` | Bulk-selectable review queue; empty states for clear queue and no-match search |
| Analytics | `/admin/analytics` | Platform-wide metrics with period selector; chart skeleton on period change |
| Audit Logs | `/admin/audit-logs` | Searchable, filterable, expandable audit trail; relative timestamps with absolute on hover; CSV export |
| Settings | `/admin/settings` | Feature flags, email templates, integrations, general config; Save shows spinner + persists to store |
| Profile | `/admin/profile` | Admin profile with permissions and system info |

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
| Attendee | Discover · My Events · Community · Achievements · Profile |
| Organizer | Dashboard · My Events · Analytics · Messages · Profile |
| Admin | Dashboard · Events · Users · Settings · Analytics |

The bar respects iOS safe-area insets (`env(safe-area-inset-bottom)`). Main content gets `pb-24 lg:pb-0` to prevent overlap.

### Breadcrumb Navigation

Breadcrumbs are rendered automatically inside each layout's `<main>` when the current route is 2 or more segments deep. They use the existing `Breadcrumb` component family from `src/app/components/ui/breadcrumb.tsx`.

Examples:
- `/organizer/events/create` → **Dashboard › Events › Create Event**
- `/admin/audit-logs` → **Admin › Audit Logs**
- `/app/events/:id` → **Discover › Event Detail**

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
| Admin Users actions | Confirm suspend / ban / verify | Icon in action button replaced by spinner for 600ms |

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
│   │   ├── TicketHoldTimer.tsx    # 15-min countdown; urgent red at < 2 min; onExpire callback
│   │   ├── CancellationCountdown.tsx  # Countdown to cancellation deadline
│   │   ├── AIScoreIndicator.tsx   # Visual meter for risk / confidence / match scores (0–100)
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
│   └── notifications.ts           # Notification data per user
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
│   │   ├── Login.tsx
│   │   ├── Register.tsx           # Two-step flow: role selection cards → role-specific form; attendee interest chips (min 3); organizer event-type chips; state resets on role switch
│   │   ├── PendingApproval.tsx    # 60-s auto-approval simulation + manual status check
│   │   ├── ForgotPassword.tsx     # Email input + success state
│   │   ├── ResetPassword.tsx      # New password form with token validation
│   │   ├── VerifyEmail.tsx        # Email verification success/failure
│   │   ├── AccountSuspended.tsx   # Suspension notice with support contact
│   │   └── Onboarding.tsx         # 6-step attendee wizard
│   ├── attendee/
│   │   ├── Discover.tsx           # Skeleton loader on mount; J/K keyboard navigation; focused card ring
│   │   ├── EventDetail.tsx        # Share (+10 XP once) + Copy Link button (clipboard API + toast)
│   │   ├── RSVP.tsx               # Payment field validation; processing spinner on checkout
│   │   ├── OrderSummary.tsx
│   │   ├── Calendar.tsx
│   │   ├── MyEvents.tsx           # Empty states per tab; partial-qty cancel; 30% refund failure; Write Review (+20 XP)
│   │   ├── Community.tsx
│   │   ├── CommunityDetail.tsx
│   │   ├── Messages.tsx
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
│   │   ├── OrganizerAnalytics.tsx # AI Insights panel included
│   │   ├── OrganizerMessages.tsx
│   │   ├── OrganizerOnboarding.tsx
│   │   └── OrganizerProfile.tsx
│   └── admin/
│       ├── AdminDashboard.tsx     # Relative timestamps on real-time activity feed
│       ├── AdminEvents.tsx        # AI risk scores + verification badges + confirm modals
│       ├── AdminUsers.tsx         # Grant verified, suspend, ban with confirm modals + action spinners
│       ├── AdminCommunity.tsx
│       ├── AdminModeration.tsx    # Bulk checkboxes; EmptyState for clear queue and no-match search
│       ├── AdminAnalytics.tsx     # Chart skeleton on period change
│       ├── AdminSettings.tsx      # Save spinner (1.2s) wired to updateSystemConfig
│       ├── AdminOnboarding.tsx
│       ├── AdminAuditLogs.tsx     # Relative timestamps with absolute title on hover; filterable + CSV export
│       └── AdminProfile.tsx       # Rendered via Profile.tsx smart router
├── store/
│   └── useAppStore.ts             # Zustand store: auth, events, gamification, behavior, config
├── styles/
│   ├── globals.css                # Design system: surfaces, buttons, inputs, animations, spinners
│   ├── theme.css                  # CSS custom properties (light + dark tokens)
│   ├── fonts.css                  # Poppins font import
│   └── index.css                  # Entry point
└── types/
    └── index.ts                   # Centralized TypeScript interfaces (AccountStatus, Badge, Booking, AuditLogEntry, SystemConfig, etc.)
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
| `/app/messages` | Messages | Attendee only | |
| `/app/rewards/store` | RewardStore | Attendee only | |
| `/organizer` | → `/organizer/dashboard` | — | |
| `/organizer/onboarding` | OrganizerOnboarding | Public | |
| `/organizer/dashboard` | OrganizerDashboard | Organizer only | |
| `/organizer/events` | OrganizerEvents | Organizer only | |
| `/organizer/events/create` | CreateEvent | Organizer only | `?editId=` param enables edit mode |
| `/organizer/events/:id/manage` | ManageEvent | Organizer only | |
| `/organizer/analytics` | OrganizerAnalytics | Organizer only | |
| `/organizer/messages` | OrganizerMessages | Organizer only | |
| `/organizer/reports` | → `/organizer/analytics` | — | Compat redirect |
| `/organizer/profile` | OrganizerProfile | Organizer only | |
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

  // UI (not persisted across sessions)
  theme,                   // 'light' | 'dark'
  unreadCount,             // number
  activeModal,             // string | null

  // System config (admin-editable)
  systemConfig,            // SystemConfig
}
```

### Key Actions

| Action | Effect |
|--------|--------|
| `login(email, password)` | Authenticates against demo accounts, loads notifications, sets `xp`/`level`/`interests`/`unreadCount`, sets `tokenExpiry` to now+30 min, calls `checkStreak()` |
| `logout()` | Clears user + auth + gamification state |
| `register(data)` | Mock registration; organizer type returns `status: 'pending'` |
| `refreshAccessToken()` | No-op in demo mode |
| `extendSession()` | Resets `tokenExpiry` to `Date.now() + 30 * 60 * 1000`; called by SessionTimeoutWarning "Extend Session" button |
| `updateProfile(data)` | Patches `currentUser` fields |
| `changePassword(current, new)` | No-op in demo mode |
| `rsvpEvent(id)` | Creates booking, awards XP, shifts behavior type |
| `rsvpEventFull(id, ticketTypeId, qty)` | Full booking with ticket type and quantity |
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

---

*Built as a frontend demo — all data is mocked and persisted in localStorage. No backend required.*
