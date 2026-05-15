# Eventra — AI-Powered Social Event Platform

> A premium frontend demo for an intelligent event discovery and community engagement platform. Built with React, TypeScript, Tailwind CSS v4, and Zustand.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
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
- [Engagement UX System](#engagement-ux-system)
- [Design System](#design-system)
- [Project Structure](#project-structure)
- [Routing Map](#routing-map)

---

## Overview

Eventra is a full-featured frontend demo of an AI-native social event ecosystem. It combines intelligent event discovery, community-driven engagement, gamified participation, real-time social interaction, and organizer growth tools — all wrapped in a premium, responsive UI.

The platform is designed around three distinct user experiences:

| Role | Purpose |
|------|---------|
| **Attendee** | Discover events, join communities, earn XP & badges, RSVP, and engage socially |
| **Organizer** | Create and manage events, view analytics, message attendees, grow audience |
| **Admin** | Moderate content, manage users, review events, monitor platform health |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 + custom CSS design system |
| State Management | Zustand v5 with `persist` middleware |
| Routing | React Router v7 |
| UI Primitives | Radix UI (shadcn/ui pattern) |
| Icons | Lucide React |
| Charts | Custom SVG bar/donut charts |
| QR Codes | qrcode.react |
| Confetti | canvas-confetti |
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
Landing / Signup
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
  → Browse recommended & trending events
  → AI Search (natural language)
  → Filter by category, price, mode, AI-recommended
    ↓
Event Detail Page
  → Cinematic hero with vibe tags + live activity pulse
  → Social proof: avatar clusters, momentum labels, activity signals
  → AI match reason + identity label
  → Live Social Energy section (discussions, reactions, bookmarks)
  → Join conversation (+15 XP)
    ↓
RSVP / Checkout
  → Select ticket type & quantity
  → Payment form (simulated)
  → Confetti + XP award on success
  → Redirect to Order Summary with real QR code
    ↓
My Events
  → Upcoming / Past / Bookmarked tabs
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
  → Click to mark as read, navigate to action URL
    ↓
Achievements
  → XP progress bar + level display
  → Earned badges grid + locked badges grid
  → Link to Reward Store
    ↓
Reward Store
  → Redeem points for free tickets, VIP access, profile highlights, vouchers
  → Points balance tracked in store
    ↓
Profile
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
Signup (Organizer type)
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
  → Recent Activity feed (live indicator)
  → Fill Rate radial chart per event
  → This Month metrics
  → Quick Actions
    ↓
My Events
  → Searchable, filterable table (All / Upcoming / Past / Drafts)
  → Per-event: image, date, attendees/capacity, revenue, status, actions
  → Scrollable on mobile
    ↓
Create Event (4-step wizard)
  1. Basics — title, category, date, time
  2. Location — venue, address, city
  3. Description & Media — description, image URL
  4. Ticketing — capacity, price, preview card
    ↓
Manage Event (4 tabs)
  → Attendees — scrollable table with export
  → Analytics — 4 KPI cards + registration bar chart
  → Community — post update CTA
  → Check-in — QR scanner placeholder
    ↓
Analytics
  → Period selector: 7d / 30d / 90d / All
  → KPI row: page views, registrations, conversion, revenue
  → Registration timeline bar chart (period-aware)
  → Traffic sources + age demographics horizontal bars
  → Conversion funnel (page views → bookings)
  → Revenue & attendance by event
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
  4. Ready — launch checklist
    ↓
Admin Dashboard
  → Greeting + platform status
  → KPI cards: Users, Events, Revenue, Flags (with sparklines)
  → Real-time Activity feed (live indicator, flag highlighting)
  → Pending Reviews panel: events, reports, flagged posts, organizer requests
  → Quick Actions
  → User Growth bar chart (12 months)
  → User Breakdown donut chart (attendees / organizers / admins)
  → System Health progress bars (API, DB, AI Engine, Storage, CDN)
  → Top Organizers list
  → AI Platform Intelligence metrics (accuracy, precision, fraud detection, response time)
    ↓
Event Moderation
  → Pending Approval list with full event details
  → Approve / Reject / View Details actions
  → Recently Approved section
    ↓
User Management
  → Search bar
  → Stats: total, attendees, organizers, suspended
  → Scrollable user table with role/status pills
  → Actions: View, Grant Organizer, Suspend
    ↓
Community Moderation
  → Flagged content list with type, author, reason, report count
  → Approve / Remove / View / Warn actions
  → Recent moderator actions
    ↓
Moderation Center
  → AI trust score badge
  → Pending reviews with urgency levels (high/medium)
  → Approve / Escalate / Reject per item
  → AI moderation signals sidebar
  → Quick action links
    ↓
Analytics
  → Period selector: 7d / 30d / 6m / 1y
  → KPI row: active users, events, revenue, retention
  → User Growth + Revenue bar charts (period-aware)
  → Category Performance grid (6 categories with growth %)
  → Top Cities geographic breakdown
  → Engagement metrics (DAU, WAU, MAU, session time, bounce rate)
  → Revenue breakdown (ticket sales, fees, VIP, partnerships)
    ↓
Platform Settings
  → Feature flags (toggles)
  → Email templates
  → Integrations (connect/configure)
  → General settings (name, email, currency, fee)
  → Notification preferences
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
| Signup | `/signup` | Account type selection (Attendee / Organizer). Admin accounts are internal only |
| Onboarding | `/onboarding` | 6-step attendee setup wizard |

### Attendee Features

| Feature | Route | Description |
|---------|-------|-------------|
| Discover | `/app/discover` | AI-powered event feed with search, filters, recommended & trending sections |
| Event Detail | `/app/events/:id` | Cinematic event page with social proof, vibe tags, AI matching, live energy section |
| RSVP | `/app/events/:id/rsvp` | Ticket selection, payment form, confetti celebration, XP award |
| Order Summary | `/app/orders/:id` | Booking confirmation with real QR code, payment summary, social next-steps |
| Calendar | `/app/calendar` | Month/week view with event dots, upcoming events list |
| My Events | `/app/my-events` | Upcoming / Past / Bookmarked tabs |
| Community | `/app/community` | Browse joined + suggested communities |
| Community Detail | `/app/community/:id` | Discussions, events, members tabs |
| Messages | `/app/messages` | Multi-type messaging: DMs, groups, event rooms, organizer broadcasts |
| Notifications | `/app/notifications` | Real store notifications with mark-as-read |
| Achievements | `/app/profile/achievements` | XP, level, earned/locked badges |
| Reward Store | `/app/rewards/store` | Redeem points for perks |
| Profile | `/app/profile` | Full attendee profile with tabs, organizer request flow |

### Organizer Features

| Feature | Route | Description |
|---------|-------|-------------|
| Onboarding | `/organizer/onboarding` | 5-step brand setup wizard |
| Dashboard | `/organizer/dashboard` | Bento layout with KPIs, AI insights, activity feed, fill rate radial |
| My Events | `/organizer/events` | Searchable event table with filters |
| Create Event | `/organizer/events/create` | 4-step event creation wizard |
| Manage Event | `/organizer/events/:id/manage` | Attendees, analytics, community, check-in tabs |
| Analytics | `/organizer/analytics` | Period-aware charts, funnel, demographics, revenue breakdown |
| Messages | `/organizer/messages` | Broadcast to attendees |
| Profile | `/organizer/profile` | Organizer profile with stats and AI insights |

### Admin Features

| Feature | Route | Description |
|---------|-------|-------------|
| Onboarding | `/admin/onboarding` | 4-step admin setup with permissions acknowledgment |
| Dashboard | `/admin/dashboard` | Platform KPIs, real-time activity, system health, AI intelligence |
| Event Moderation | `/admin/events` | Approve/reject pending events |
| User Management | `/admin/users` | Search, view, grant organizer, suspend users |
| Community | `/admin/community` | Flagged content moderation |
| Moderation Center | `/admin/moderation` | AI-assisted content review queue |
| Analytics | `/admin/analytics` | Platform-wide metrics with period selector |
| Settings | `/admin/settings` | Feature flags, email templates, integrations, general config |
| Profile | `/admin/profile` | Admin profile with permissions and system info |

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

### XP Micro-Rewards

| Action | XP Earned |
|--------|-----------|
| RSVP to event | Event's `xpReward` (80–200 XP) |
| Bookmark event | +10 XP |
| Join discussion | +15 XP |
| Complete onboarding | Starter XP |

Level formula: `level = Math.floor(xp / 500) + 1`

---

## Design System

### Color Palette

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--primary` | `#6C4CF1` | `#8B7CFF` | Buttons, active states, AI interactions |
| `--purple-core` | `#7C5CFF` | `#7C5CFF` | Brand, gradients |
| `--cyan-core` | `#00D4FF` | `#00D4FF` | Search, messaging, organizer theme |
| `--orange-core` | `#FF9B3D` | `#FF9B3D` | Rewards, XP, energy |
| `--background` | `#F7F6FF` | `#0F172A` | Page background |

### Surface Classes

| Class | Description |
|-------|-------------|
| `.surface-panel` | Primary glass card (white/dark with blur) |
| `.hero-surface` | Larger hero card with stronger shadow |
| `.card-surface` | Compact card for lists and grids |
| `.glow-card` | Dark atmospheric card with purple glow |

### Typography Scale

| Class | Size | Weight | Usage |
|-------|------|--------|-------|
| `.text-display` | 32px | 800 | Hero numbers |
| `.text-h1` | 26px | 700 | Page titles |
| `.text-h2` | 20px | 700 | Section headings |
| `.text-h3` | 17px | 600 | Card titles |
| `.text-body` | 14px | 400 | Body text |
| `.text-body-sm` | 13px | 400 | Secondary text |
| `.text-caption` | 12px | 400 | Labels, timestamps |

### Button Classes

| Class | Style |
|-------|-------|
| `.btn-primary` | Purple gradient pill with glow shadow |
| `.btn-secondary` | Ghost border pill |
| `.btn-ghost` | Transparent, hover background |

---

## Project Structure

```
src/
├── app/
│   └── App.tsx                  # Router + auth guards (RequireAuth, RedirectIfAuth)
├── components/
│   ├── Logo.tsx                 # SVG logo (small / horizontal / large, light/dark theme)
│   ├── AISearchModal.tsx        # AI natural language search modal
│   └── layout/
│       ├── AttendeeLayout.tsx   # Sidebar + mobile nav for attendees
│       ├── OrganizerLayout.tsx  # Sidebar + mobile nav for organizers
│       └── AdminLayout.tsx      # Sidebar + mobile nav for admins
├── data/
│   ├── mockData.ts              # Events, communities, bookings + EngagementData types
│   ├── users.ts                 # Demo accounts + OrganizerRequest types
│   └── notifications.ts        # Notification data per user
├── pages/
│   ├── public/
│   │   ├── Landing.tsx
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── Onboarding.tsx
│   ├── attendee/
│   │   ├── Discover.tsx
│   │   ├── EventDetail.tsx
│   │   ├── RSVP.tsx
│   │   ├── OrderSummary.tsx
│   │   ├── Calendar.tsx
│   │   ├── MyEvents.tsx
│   │   ├── Community.tsx
│   │   ├── CommunityDetail.tsx
│   │   ├── Messages.tsx
│   │   ├── Notifications.tsx
│   │   ├── Achievements.tsx
│   │   ├── RewardStore.tsx
│   │   ├── Profile.tsx          # Smart router → role-specific profile
│   │   └── AttendeeProfile.tsx
│   ├── organizer/
│   │   ├── OrganizerDashboard.tsx
│   │   ├── OrganizerEvents.tsx
│   │   ├── CreateEvent.tsx
│   │   ├── ManageEvent.tsx
│   │   ├── OrganizerAnalytics.tsx
│   │   ├── OrganizerMessages.tsx
│   │   ├── OrganizerOnboarding.tsx
│   │   └── OrganizerProfile.tsx
│   └── admin/
│       ├── AdminDashboard.tsx
│       ├── AdminEvents.tsx
│       ├── AdminUsers.tsx
│       ├── AdminCommunity.tsx
│       ├── AdminModeration.tsx
│       ├── AdminAnalytics.tsx
│       ├── AdminSettings.tsx
│       ├── AdminOnboarding.tsx
│       └── AdminProfile.tsx
├── store/
│   └── useAppStore.ts           # Zustand store: auth, events, bookmarks, XP, behavior
└── styles/
    ├── globals.css              # Design system: surfaces, buttons, inputs, animations
    ├── theme.css                # CSS custom properties (light + dark tokens)
    ├── fonts.css                # Poppins font import
    └── index.css                # Entry point
```

---

## Routing Map

### Auth Guards

- **`RequireAuth`** — redirects unauthenticated users to `/login`. If authenticated but wrong role, redirects to the correct dashboard.
- **`RedirectIfAuth`** — redirects already-authenticated users away from public pages to their dashboard.

### Route Table

| Path | Component | Auth |
|------|-----------|------|
| `/` | Landing | Public |
| `/login` | Login | Public (redirect if auth) |
| `/signup` | Signup | Public (redirect if auth) |
| `/onboarding` | Onboarding | Public |
| `/app/discover` | Discover | Attendee only |
| `/app/events/:id` | EventDetail | Attendee only |
| `/app/events/:id/rsvp` | RSVP | Attendee only |
| `/app/orders/:id` | OrderSummary | Attendee only |
| `/app/calendar` | Calendar | Attendee only |
| `/app/my-events` | MyEvents | Attendee only |
| `/app/community` | Community | Attendee only |
| `/app/community/:id` | CommunityDetail | Attendee only |
| `/app/messages` | Messages | Attendee only |
| `/app/notifications` | Notifications | Attendee only |
| `/app/profile` | Profile | Attendee only |
| `/app/profile/achievements` | Achievements | Attendee only |
| `/app/rewards/store` | RewardStore | Attendee only |
| `/organizer/onboarding` | OrganizerOnboarding | Public |
| `/organizer/dashboard` | OrganizerDashboard | Organizer only |
| `/organizer/events` | OrganizerEvents | Organizer only |
| `/organizer/events/create` | CreateEvent | Organizer only |
| `/organizer/events/:id/manage` | ManageEvent | Organizer only |
| `/organizer/analytics` | OrganizerAnalytics | Organizer only |
| `/organizer/messages` | OrganizerMessages | Organizer only |
| `/organizer/profile` | Profile | Organizer only |
| `/admin/onboarding` | AdminOnboarding | Public |
| `/admin/dashboard` | AdminDashboard | Admin only |
| `/admin/events` | AdminEvents | Admin only |
| `/admin/users` | AdminUsers | Admin only |
| `/admin/community` | AdminCommunity | Admin only |
| `/admin/moderation` | AdminModeration | Admin only |
| `/admin/analytics` | AdminAnalytics | Admin only |
| `/admin/settings` | AdminSettings | Admin only |
| `/admin/profile` | Profile | Admin only |
| `*` | → `/` | Catch-all |

---

## State Management

The Zustand store (`useAppStore`) persists to `localStorage` under the key `eventra-storage`.

### Persisted State

```ts
{
  currentUser,        // logged-in user object
  isAuthenticated,    // boolean
  bookmarkedEvents,   // string[]
  rsvpedEvents,       // string[]
  pointsBalance,      // number
  rewardHistory,      // redemption log
  theme,              // 'light' | 'dark'
  userBehaviorType,   // 'passive' | 'fomo' | 'community' | 'gamified'
  engagementActions,  // total micro-actions count
  browseCount,        // passive browse count
  discussionCount,    // discussions joined count
}
```

### Key Actions

| Action | Effect |
|--------|--------|
| `login(email, password)` | Authenticates against demo accounts, loads notifications |
| `logout()` | Clears user state |
| `rsvpEvent(id)` | Creates booking, awards XP, shifts behavior type |
| `toggleBookmark(id)` | Adds/removes bookmark, awards +10 XP on add |
| `awardXP(amount, reason)` | Increments XP, recalculates level |
| `recordDiscussion()` | Awards +15 XP, shifts to `community` behavior at 3+ |
| `redeemReward(id)` | Deducts points, logs redemption |
| `toggleTheme()` | Switches light/dark mode |
| `requestOrganizerStatus(eventId, reason)` | Creates pending organizer request |
| `approveOrganizerRequest(id, notes)` | Updates request status to approved |

---

*Built as a frontend demo — all data is mocked and persisted in localStorage. No backend required.*
