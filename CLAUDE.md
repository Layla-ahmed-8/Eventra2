# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install       # install dependencies
pnpm dev           # dev server at http://localhost:5173
pnpm build         # production build
pnpm preview       # preview production build
```

No test runner or linter is configured. TypeScript is checked implicitly by Vite during build; there is no standalone `tsc` check script.

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Attendee | `sarah@demo.com` | `demo123` |
| Organizer | `ahmed@demo.com` | `demo123` |
| Admin | `admin@demo.com` | `demo123` |

## Architecture

**Pure frontend demo** — no backend. All data is mocked in `src/data/` and persisted to `localStorage` via Zustand's `persist` middleware under the key `eventra-storage`. The Axios instance in `src/lib/axios.ts` detects mock mode when `VITE_API_URL` is unset and skips real HTTP calls.

### Three-role system

Every route belongs to exactly one role. `RequireAuth` and `RedirectIfAuth` guards in `src/app/App.tsx` enforce this: wrong-role access redirects to that role's dashboard rather than a 403. The three layout components (`AttendeeLayout`, `OrganizerLayout`, `AdminLayout`) each provide their own sidebar and mobile nav.

- Attendee routes: `/app/**`
- Organizer routes: `/organizer/**`
- Admin routes: `/admin/**`

`src/pages/attendee/Profile.tsx` is a smart router — it renders `AttendeeProfile` or `AdminProfile` based on `currentUser.role`, so it is reused for both the `/app/profile` and `/admin/profile` routes.

### State (`src/store/useAppStore.ts`)

Single Zustand store. Key things to know:

- `login()` is synchronous (returns `boolean`); it authenticates against the hardcoded demo accounts in `src/data/users.ts`.
- `awardXP(amount, reason)` increments XP, recomputes `level` via `getLevelFromXP`, and triggers badge unlock checks against `BADGE_DEFINITIONS`.
- `systemConfig` is admin-editable at runtime (Admin → Settings) and controls `cancellationWindowHours`, `ticketHoldTimeoutMinutes`, `platformFeePercentage`, and AI feature flags.
- UI state (`theme`, `unreadCount`, `activeModal`) is part of the store interface but `theme` and `unreadCount` are NOT listed in the `persist` partialize — they reset on page reload.

### Data layer

| File | Contents |
|------|----------|
| `src/data/mockData.ts` | `Event[]`, `Community[]`, `Booking[]`, engagement/social types |
| `src/data/users.ts` | Demo `User` objects (`sarahAccount`, `ahmedAccount`, `laylaAccount`), `OrganizerRequest` type |
| `src/data/notifications.ts` | Per-user `Notification[]` keyed by user ID |
| `src/constants/badges.ts` | `BADGE_DEFINITIONS` array; `getBadgeById()` helper |
| `src/constants/config.ts` | `DEFAULT_SYSTEM_CONFIG`, `XP_TABLE`, `POINTS_TABLE` |
| `src/types/index.ts` | Centralized TS interfaces; re-exports types from data files |

### Design system

All visual primitives live in `src/styles/globals.css` (utility classes) and `src/styles/theme.css` (CSS custom properties). Do not use inline Tailwind for surfaces, buttons, or typography that has a design-system class — use the established classes instead:

- **Surfaces**: `.surface-panel`, `.hero-surface`, `.card-surface`, `.glow-card`, `.bento-section`, `.kpi-card`
- **Buttons**: `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- **Typography**: `.text-display`, `.text-h1`–`.text-h4`, `.text-body`, `.text-body-sm`, `.text-caption`, `.text-micro`
- **Badges/chips**: `.status-pill`, `.filter-chip`, `.badge-ai`, `.gradient-text`

Role themes: purple (`--purple-core`) = attendee/default, cyan (`--cyan-core`) = organizer, red = admin.

### Shared business components (`src/components/business/`)

| Component | Purpose |
|-----------|---------|
| `ConfirmationModal` | Reusable confirm dialog; pass `destructive` prop for red styling (used for ban/suspend) |
| `TicketHoldTimer` | 15-min countdown; calls `onExpire` when time runs out |
| `CancellationCountdown` | Countdown to the 48-hour cancellation deadline |
| `AIScoreIndicator` | Visual 0–100 meter for risk / confidence / match scores |
| `StatusBadge` | Color-coded badge for event, booking, or account status |
| `VerificationBadge` | Cyan checkmark for verified organizers |

### Gamification

XP level formula: `getXPForLevel(level) = 100 * level + 50 * (level * (level - 1)) / 2` — exported from the store. All XP awards go through `awardXP()` so badge checks and level recalculation are automatic. Never mutate `xp` or `level` directly in the store.

### Behavior adaptation

`userBehaviorType` (`'passive' | 'fomo' | 'community' | 'gamified'`) is recalculated by `updateBehaviorType()` / `detectBehaviorType()` when RSVPs, discussions, or bookmarks change. Pages like Discover and EventDetail use this to adapt CTAs and social proof framing.
