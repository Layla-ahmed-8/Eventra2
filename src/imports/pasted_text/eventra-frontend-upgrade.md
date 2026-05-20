# EVENTRA — FULL FRONTEND UPGRADE PROMPT
# For Trae AI | React + Tailwind CSS | Complete Redesign & UX Overhaul

---

## CONTEXT & GOAL

You are upgrading an existing Eventra (AI EventHub) frontend demo into a fully functional,
production-quality web app. The goal is a complete overhaul covering:

1. A modern, distinctive design system (not generic AI SaaS aesthetics)
2. Correct, seamless UX flows for all three user roles: Attendee, Organizer, Admin
3. Proper navigation architecture with no dead ends
4. All features wired and functional (no placeholder "coming soon" sections)
5. Responsive across mobile, tablet, and desktop

Do not start from scratch — upgrade the existing code. Preserve any working logic
and rewrite what is broken or incomplete.

---

## TECH STACK (DO NOT CHANGE)

- React.js (functional components, hooks)
- Tailwind CSS (utility-first, no inline styles)
- React Router v6 (for all navigation)
- Lucide React (for icons)
- Recharts (for analytics charts)
- Context API or Zustand (for global state: auth, user role, events)
- Mock data layer: all API calls use local mock JSON — no real backend needed

---

## DESIGN SYSTEM — APPLY GLOBALLY

### Color Palette
Primary Purple:    #6C4CF1  (hover: #5739D4, light: #EDE9FE)
Secondary Cyan:    #00C2FF  (light: #E0F7FF)
Accent Orange:     #FF8A00  (light: #FFF3E0)
Success Green:     #22C55E
Warning Amber:     #F59E0B
Error Red:         #EF4444
Text Primary:      #111827
Text Secondary:    #6B7280
Text Muted:        #9CA3AF
Border:            #E5E7EB
BG Primary:        #FFFFFF
BG Secondary:      #F9FAFB
BG Tertiary:       #F3F4F6

Dark mode: use Tailwind dark: variants. BG becomes #0F172A / #1E293B / #1A2236.

### Typography (Inter font via Google Fonts)
Hero H1:     64px / bold / tracking-tight
Page H1:     48px / bold / tracking-tight
Section H2:  32px / semibold
Card H3:     20px / semibold
Body:        16px / normal / leading-relaxed
Small:       14px / normal
Caption:     12px / normal

### Spacing
Use Tailwind spacing scale. Section vertical padding: py-20 or py-28.
Card internal padding: p-6. Grid gap: gap-6 or gap-8.

### Components — build these as reusable components:


  Props: event { id, title, image, date, location, price, rsvpCount, category, isRecommended }
  Layout: image top (h-48 object-cover) → content (p-5) → footer (avatar + count + bookmark)
  States: default, hover (translateY -4px, shadow-lg), bookmarked (orange bookmark icon)
  Variants: Standard | Compact (horizontal) | Featured (purple gradient border)


  Variants: primary (purple gradient), secondary (outline), ghost, danger
  Sizes: sm | md | lg | xl
  States: default, hover, active, disabled, loading (spinner)


  Variants: category (colored), recommended (purple sparkle), status (green/amber/red)


  Sizes: xs (6) | sm (8) | md (10) | lg (12)
  With online indicator option


  Sizes: sm (max-w-md) | md (max-w-lg) | lg (max-w-3xl)
  Backdrop blur, fade+scale animation (200ms)
  Close on overlay click or ESC key


  Floating chat bubble bottom-right (w-14 h-14, purple gradient)
  Expanded panel: w-96 h-[560px], fixed bottom-6 right-6
  Message bubbles: user right (purple), AI left (gray)
  Typing indicator (3 animated dots)
  Suggested prompt chips

  (loading state for all cards and lists)

  (illustration + message + CTA for all empty list views)

  (success/error/info notifications, auto-dismiss 4s)

---

## DESIGN SYSTEM / VISUAL IDENTITY / UI DIRECTION

### OVERALL VISUAL DIRECTION
Design Eventra as a next-generation AI-native social event platform with a premium, emotionally engaging, modern luxury aesthetic.
The interface should feel like a fusion of:

- Airbnb’s warmth
- Linear’s polish
- Discord’s community feel
- Spotify’s immersive energy
- Apple’s refinement
- Notion’s cleanliness

The product must feel:

- Modern
- Elegant
- Luxurious
- Smart
- Vibrant
- Minimal
- Social
- Fun without looking childish
- Premium without feeling corporate

Avoid:

- Generic SaaS dashboards
- Overly flat UI
- Harsh enterprise aesthetics
- Excessive gradients everywhere
- Crypto-style neon overload
- Cluttered interfaces
- Heavy dark shadows
- Gamification looking childish

The experience should feel like a premium social product built for Gen Z + young professionals.

### VISUAL STYLE PRINCIPLES
1. CLEAN + IMMERSIVE
Use:

- Spacious layouts
- Large breathing room
- Soft layering
- Floating surfaces
- Rounded modern cards
- Smooth transitions
- Lightweight UI chrome

The interface should feel airy and intelligent.

2. LUXURY THROUGH SIMPLICITY
Luxury should come from:

- Typography hierarchy
- Motion quality
- Perfect spacing
- Premium surfaces
- Soft shadows
- High-quality imagery
- Glassmorphism accents
- Rich gradients used sparingly

NOT from excessive decoration.

3. SOCIAL + HUMAN
The platform should feel alive.
Include:

- Real user imagery
- Community avatars
- Reactions
- Presence indicators
- Dynamic activity feeds
- Social proof
- Rich community interactions

The app should emotionally feel active and connected.

### DESIGN LANGUAGE
UI STYLE
Use a modern hybrid design system combining:

- Soft minimalism
- Glassmorphism accents
- Layered cards
- Floating UI elements
- Premium gradients
- Frosted surfaces
- Smooth depth

The visual system should feel:

- Dynamic
- Layered
- Interactive
- Soft
- Intelligent

### COLOR SYSTEM DIRECTION
PRIMARY BRAND COLORS
Purple
Main intelligence + AI color.
Use:

- #6C4CF1
- #8B7CFF
- #A78BFA

Cyan / Electric Blue
Used for:

- Smart interactions
- AI highlights
- Focus states
Use:

- #00C2FF
- #38BDF8

Accent Orange
Used sparingly for:

- Rewards
- XP
- Badge unlocks
- Important highlights
Use:

- #FF8A00

### BACKGROUND STRATEGY
LIGHT MODE
Use layered neutral backgrounds:

- #FFFFFF
- #F8F9FB
- #F3F4F6
- #EEF2FF accents

Avoid pure flat white everywhere.
Add subtle gradient lighting sections.

DARK MODE
Dark mode should feel cinematic and premium.
Use:

- #0F172A
- #111827
- #1E293B

Add:

- Frosted surfaces
- Subtle glow edges
- Soft purple ambient highlights

Dark mode should resemble:

- Linear
- The Browser Company’s Arc Browser
- Apple TV
- Spotify Premium

### SURFACE DESIGN
Use layered surfaces with:

- 12–20px border radius
- Soft borders
- Light gradients
- Frost blur
- Floating depth

Cards should feel tactile and interactive.

### CARD DESIGN STYLE
Cards should:

- Float slightly above background
- Have subtle blur/glass accents
- Use soft inner highlights
- Include hover elevation
- Include smooth scaling

Hover behavior:

- Slight lift
- Shadow increase
- Border glow
- Micro animation

### TYPOGRAPHY DIRECTION
Use:

- Inter
- SF Pro Display feel
- Modern geometric spacing

Typography should feel:

- Clean
- Sophisticated
- Digital
- Readable
- Confident

### TYPOGRAPHY HIERARCHY
Hero Headlines

- 32px
- Bold
- Tight tracking
- High contrast

Section Titles

- 20–24px
- Semi-bold

Card Titles

- 18–20px

Body

- 14–16px

Small Labels

- 12–13px
- Medium weight
- Uppercase tracking

### BUTTON DESIGN
Buttons should feel:

- Premium
- Soft
- Touchable
- Animated

Use:

- Pill/rounded buttons
- Smooth hover transitions
- Glow accents
- Depth layering

Primary buttons:

- Purple gradient
- Soft glow
- Light reflection effect

Hover:

- Slight scale
- Elevated shadow
- Gradient movement

### ICONOGRAPHY
Use:

- Rounded icon sets
- Thin modern strokes
- Minimal geometric icons
- Soft filled states

Icons should feel:

- Friendly
- Smart
- Modern
- Not corporate

### ANIMATION SYSTEM
Motion is CRITICAL.
The app should feel fluid and alive.
Use:

- Smooth page transitions
- Staggered reveals
- Hover animations
- Floating particles
- Animated gradients
- Micro-interactions
- Scroll-triggered motion
- Spring-based transitions

Animations should feel:

- Soft
- Natural
- Responsive
- Premium

NOT overly flashy.

### AI VISUAL LANGUAGE
AI interactions should feel magical but subtle.
Use:

- Soft glowing nodes
- Gradient pulse effects
- Ambient highlights
- Smart shimmer effects
- AI typing animations
- Neural-inspired visuals

Avoid robotic sci-fi aesthetics.
AI should feel:

- Helpful
- Elegant
- Invisible
- Intelligent

### COMMUNITY UI STYLE
Communities should feel:

- Energetic
- Social
- Lively
- Dynamic

Use:

- Floating avatars
- Reactions
- Rich message bubbles
- Activity indicators
- Thread cards
- Live presence indicators

Think:
A hybrid of:

- Discord
- Instagram
- Reddit

But cleaner and more premium.

### GAMIFICATION UI STYLE
Gamification should feel:

- Luxurious
- Rewarding
- Aspirational
- NOT childish.

Use:

- Premium badge designs
- Metallic gradients
- Achievement glow effects
- Smooth unlock animations
- Elegant XP bars
- Confetti moments
- Reward cards

Inspiration:

- PlayStation trophies
- Apple Fitness achievements
- Duolingo progression polish

### EVENT EXPERIENCE STYLE
Events should feel immersive and emotional.
Use:

- Large cinematic imagery
- Gradient overlays
- Rich typography
- Atmospheric backgrounds
- Dynamic attendee visuals

Every event page should feel like:

- A digital invitation
- A social destination
- An experience preview

### NAVIGATION DESIGN
Navigation should feel:

- Minimal
- Floating
- Intelligent

Desktop
Use:

- Frosted top navbar
- Floating search
- Animated indicators

Mobile
Use:

- Floating bottom navigation
- Soft blur background
- Rounded active states
- Gesture-friendly interactions

### DASHBOARD DESIGN
Dashboards should:

- Avoid dense enterprise layouts
- Use modular widgets
- Prioritize clarity
- Show visual analytics
- Feel interactive

Use:

- Bento-grid inspired layouts
- Expandable widgets
- Live activity cards
- AI insight cards

### MESSAGE & CHAT DESIGN
Messaging UI should feel:

- Warm
- Real-time
- Community-focused

Use:

- Rounded message bubbles
- Smart spacing
- Reactions
- Rich media cards
- Floating composer
- Gradient typing indicators

The platform must include a fully integrated in-app messaging system instead of relying primarily on external emails.
Messaging should support:

- Direct messages
- Group chats
- Community conversations
- Event-based chats
- Organizer-to-attendee announcements
- AI-assisted replies and moderation

### COMMUNITY + GAMIFICATION CONNECTION SYSTEM
Community engagement and gamification must function as one connected ecosystem.
Every meaningful interaction inside communities contributes toward:

- XP progression
- Achievement unlocks
- Reputation levels
- Community status
- Reward eligibility

Users gain rewards from actions such as:

- Posting discussions
- Commenting
- Reacting
- Attending events
- Joining communities
- Daily engagement streaks
- Completing event participation
- Helping other users
- Receiving upvotes/reactions
- Participating in polls/games/challenges

Rewards include:

- Digital badges
- XP boosts
- Leaderboard progression
- Exclusive community roles
- Event perks
- Discount vouchers
- Free event passes
- VIP access
- Early ticket access
- Partner rewards

Gamification should feel deeply integrated into the social experience rather than appearing as a separate feature.
The progression system should emotionally encourage:

- Participation
- Belonging
- Loyalty
- Community contribution
- Real-world engagement

### PREMIUM DETAILS
Include:

- Ambient background gradients
- Cursor interactions
- Glass blur overlays
- Soft noise textures
- Dynamic lighting
- Floating UI depth
- Subtle 3D feel
- Layer transitions

The product should look visually impressive even when static.

### MOBILE DESIGN DIRECTION
Mobile should feel:

- Native
- Smooth
- Gesture-driven
- Social-first

Use:

- Bottom sheets
- Floating actions
- Swipe interactions
- Full-screen immersive flows
- Sticky CTAs
- Thumb-friendly layouts

### LANDING PAGE DIRECTION
The landing page should feel:

- High-end startup
- AI-native
- Emotionally compelling
- Socially alive

Use:

- Cinematic hero sections
- Floating UI mockups
- Animated community activity
- AI interaction previews
- Large typography
- Smooth scroll storytelling

The experience should immediately communicate:

- Intelligence
- Community
- Personalization
- Energy
- Premium quality

### FINAL VISUAL GOAL
Eventra should visually feel like:

“A luxury AI-powered social ecosystem for discovering experiences and building real-world communities.”

The product should look:

- Investor-ready
- App Store featured
- Dribbble-level polished
- Emotionally engaging
- Modern for 2026+
- Premium across all devices

Every screen should feel intentional, immersive, social, and beautifully crafted.

---

## NAVIGATION ARCHITECTURE

### Route Structure (React Router v6)

/ ..................................... Landing page (public)
/login ................................ Login page
/signup ............................... Signup page
/onboarding ........................... Onboarding wizard (post-signup)

/app .................................. Protected layout wrapper
/app/discover ......................... Main discover feed
/app/discover/search .................. AI search modal (route-based)
/app/events/:id ....................... Event detail page
/app/events/:id/rsvp .................. RSVP flow
/app/calendar ......................... My calendar
/app/my-events ........................ My events (upcoming, past, bookmarked)
/app/my-events/:id .................... Attended event detail + feedback
/app/community ........................ Community list
/app/community/:id .................... Community thread view
/app/profile .......................... User profile
/app/profile/achievements ............. Badges and gamification
/app/notifications .................... Notification center

/organizer ............................ Organizer layout wrapper
/organizer/dashboard .................. Organizer home
/organizer/events ..................... My events list
/organizer/events/create .............. Create event wizard
/organizer/events/:id/edit ............ Edit event
/organizer/events/:id/manage .......... Event management (attendees, analytics, community)
/organizer/analytics .................. Analytics dashboard
/organizer/audience ................... Audience builder

/admin ................................ Admin layout wrapper
/admin/dashboard ...................... Admin home
/admin/events ......................... Event moderation queue
/admin/users .......................... User management
/admin/community ...................... Community moderation
/admin/analytics ...................... Platform analytics
/admin/settings ....................... System config

### Navigation Components

TopNav (sticky, blur backdrop):
  - Logo (left)
  - Search bar (center, opens AI search modal on focus, desktop only)
  - Nav links: Discover | Communities | My Events (attendee only)
  - Right: notification bell (badge count) | avatar dropdown
  - Dropdown: Profile | Switch to Organizer | Sign Out
  - Height: h-16
  - Mobile: hide links, show hamburger → slide drawer

Sidebar (Organizer + Admin layouts):
  - Width: w-60 expanded, w-16 collapsed (toggle button)
  - Icons + labels when expanded, icons only when collapsed
  - Active state: purple bg + white text
  - Collapsible on mobile (slide drawer)
  - Bottom: user avatar + name + role badge

Mobile Bottom Nav (Attendee app, screens < md):
  - 5 tabs: Discover | Search | My Events | Community | Profile
  - h-16, fixed bottom-0
  - Active: purple icon + label
  - Floating 2px above safe area

---

## LANDING PAGE (/)

Rebuild entirely. Sections in order:

### 1. Navbar
  Logo left | Links center (Features, For Organizers, Community, Pricing) | CTA right
  "Get Started Free" (purple) + "Sign In" (ghost)
  Sticky with backdrop blur on scroll

### 2. Hero
  Full viewport height (min-h-screen)
  Left 60%: headline + subheadline + CTAs + trust badge
  Right 40%: animated product mockup (use CSS/SVG, no external images)
    - Show floating EventCard preview
    - AI chat bubble with sample response
    - Calendar mini-widget
    - Subtle connecting lines (suggest AI network)
  Headline: "Discover Events That Actually Matter to You"
    - "Matter to You" has animated purple-to-cyan gradient underline
  Sub: "AI-powered recommendations, vibrant communities, and experiences tailored to your interests"
  CTAs: "Get Started Free" (xl primary) + "Watch Demo" (ghost with play icon)
  Trust: "⭐⭐⭐⭐⭐ Loved by 50,000+ event enthusiasts"
  Background: subtle radial gradient from purple-50 at center

### 3. Social Proof Bar
  "Trusted by leading communities and event organizers"
  6 grayscale community logos (use text logos in sans-serif, mock names)
  Fade in on scroll (Intersection Observer)

### 4. Features Grid (3×2)
  Section label: "PLATFORM FEATURES" (purple, uppercase, tracked)
  H2: "Everything you need to discover, attend, and connect"
  6 cards: Personalized Discovery | Ask Don't Filter | Organizer Dashboard |
           Build Lasting Connections | Earn & Achieve | Never Miss Out
  Each: icon (Lucide) + title (20px semibold) + description (15px gray)
  Cards: white bg, shadow-sm, hover: -translate-y-1 shadow-md, rounded-2xl

### 5. How It Works (4 steps, horizontal timeline)
  Purple-50 bg section
  Steps: Tell us what you love → RSVP with one click →
         Connect with community → Level up your experience
  Connected with dashed purple line
  Each step: numbered circle (purple) + title + description

### 6. For Organizers (split layout)
  Left: content (label + H2 + checklist + CTA)
  Right: organizer dashboard mockup preview (hardcoded UI preview component)
  Checklist items with purple checkmarks

### 7. Community Showcase
  Mock community thread UI (hardcoded realistic-looking component)
  Stats below: 50K Members | 1M Discussions | 10K Communities

### 8. Final CTA Banner
  Purple-to-cyan gradient diagonal bg
  White headline + subtitle + white button (purple text)
  "No credit card required • Free forever"

### 9. Footer
  Dark bg (#111827)
  4 column grid: Brand | Product | Resources | Company
  Social icons: use Lucide Twitter/Linkedin/Instagram/Disc (Discord placeholder)
  Bottom bar: copyright + language selector

---

## ONBOARDING WIZARD (/onboarding)

5-step stepper with progress bar at top (20% → 40% → 60% → 80% → 100%)
Back + Continue buttons on every step.
On complete → redirect to /app/discover with welcome toast.

Step 1 — Welcome
  "Welcome to Eventra, [name]! Let's personalize your experience."
  Simple illustration (CSS/SVG) + CTA "Let's Go"

Step 2 — Interests
  Grid of 12 interest category pills (multi-select):
  Music | Tech | Sports | Art | Food & Drink | Business |
  Health & Wellness | Gaming | Film | Fashion | Science | Community
  Minimum 3 required (show warning if less). AI suggestion: "We think you'll love..."
  Selected state: purple bg, white text, checkmark icon

Step 3 — Location
  "Where are you looking for events?"
  Text input with autocomplete (mock) + "Use my location" button (geolocation API)
  Radius slider: 5–50 miles (show label "Within X miles")
  Add multiple locations option

Step 4 — Calendar Sync (optional)
  3 calendar options: Google Calendar | Apple Calendar | Outlook
  Each: icon + label + "Connect" button (mock action, just marks as connected)
  "Skip for now" text link

Step 5 — AI Preview
  "Here's what we found for you"
  Show 6 personalized EventCard previews in a responsive grid (mock data)
  Swipe/click left (not interested) / right (interested) mechanic
  Counter: "X events matched"
  CTA: "Start Exploring"

---

## DISCOVER PAGE (/app/discover)

### Layout
  TopNav (sticky)
  Below nav: full-width content, no sidebar

### Search Bar (hero-style, top of page)
  Wide search bar with AI icon (sparkle) on left
  Placeholder: "Ask me anything... 'jazz concerts this weekend under $50'"
  On click → opens AISearchModal

### Filter Chips Row (horizontal scroll on mobile)
  All | This Week | Free | Music | Tech | Sports | Art | Food | Near Me
  Active chip: purple bg. Multiple selectable.
  Filter icon button on right → opens FilterDrawer

### Filter Drawer (slides from right on mobile, modal on desktop)
  Date range picker | Category multi-select | Price range slider |
  Distance radius | Event type (in-person/virtual/hybrid)
  Apply + Reset buttons

### Event Feed
  "Recommended for you" section (AI badge) — horizontal scroll row of 4 EventCards
  "This Weekend" section — 3-column grid
  "Trending in Your City" section — 3-column grid
  "Free Events" section — 3-column grid
  Infinite scroll with Skeleton loading on each section
  Empty state if no results matching filters

### AI Search Modal (/app/discover/search)
  Full-screen overlay (backdrop blur)
  Chat interface at center (max-w-2xl)
  AI avatar + "What kind of event are you looking for?"
  User input at bottom with send button + voice icon (mock)
  AI responds with: natural language + filtered EventCard results grid
  Suggested prompts as chips: "Free events this weekend" | "Tech meetups near me" | "Art workshops for beginners"
  "Save this search" option → adds to saved searches list
  Results scroll below chat

### Event Card Click
  Navigate to /app/events/:id (smooth page transition)

---

## EVENT DETAIL PAGE (/app/events/:id)

### Layout
  Full-width hero image (h-72 object-cover) with gradient overlay
  Floating back button (top-left)
  Floating bookmark + share icons (top-right)

### Content (max-w-4xl centered, two-column on desktop)

Left column (60%):
  Category badge
  Event title (H1)
  Organizer row: avatar + name + "Verified" badge → link to organizer profile
  Info grid (2×2): Date & Time | Location (with "Open in Maps" link) | Price | Attendees
  "Add to calendar" button (ghost, calendar icon)
  Tabs: About | Community | Similar Events
    About: full description (expandable) + tags
    Community: 3-4 discussion threads, "Join Community" CTA, comment input
    Similar Events: horizontal scroll of 4 EventCards

Right column (40%, sticky on desktop):
  RSVP Card (white, shadow-lg, rounded-2xl)
    Price display
    Ticket type selector (if multiple)
    Attendee count + capacity bar
    "RSVP Now" button (full-width primary)
    "Share Event" button (ghost)
    Organizer follow button

### Sticky Bottom Bar (mobile only)
  Price + "RSVP Now" button (follows scroll)

---

## RSVP FLOW (/app/events/:id/rsvp)

Multi-step modal or page:

Step 1 — Ticket Selection
  Event summary card (image + title + date)
  Ticket type rows: Early Bird ($15) | General ($25) | VIP ($50)
  Quantity selector per type
  Subtotal calculation (live)

Step 2 — Payment (if paid event)
  Saved payment methods list
  Add new card form (card number, expiry, CVV, name)
  Apple Pay / Google Pay buttons (mock)
  Order summary sidebar

Step 3 — Confirmation
  Confetti animation (CSS keyframes)
  "You're going to [Event Name]! 🎉"
  4 action buttons: Add to Calendar | Share with Friends | Join Community | Set Reminder
  Confirmation number display

---

## CALENDAR PAGE (/app/calendar)

### Month/Week/Day view switcher (tabs)
### Month View
  Full calendar grid (7 columns)
  Events rendered on their dates (colored by category)
  Click date → show events list for that day
  "Today" button to return to current date
  Prev/Next month navigation

### Week View
  Time grid (7:00 AM – 10:00 PM), 7 columns
  Events as colored blocks in time slots

### Day View
  Single column time grid
  Detailed event blocks

### Right Panel (desktop): Upcoming Events list
  Next 5 events, date + title + location
  Quick RSVP status toggle

### Integrations banner (if not connected):
  "Sync with Google Calendar for seamless scheduling"

---

## MY EVENTS PAGE (/app/my-events)

3 tabs: Upcoming | Past | Bookmarked

### Upcoming Tab
  Event cards with:
    Countdown timer (X days left)
    Check-in QR code button (if event today)
    "View Community" link
    Cancel RSVP option (confirm modal)

### Past Tab
  Event cards with:
    "Attended" green badge
    "Leave Feedback" button → opens FeedbackModal
    "View Photos" link (mock gallery)
    Badge earned indicator

### Bookmarked Tab
  Standard EventCards with remove bookmark option
  "RSVP Now" CTA on each

### Feedback Modal
  Star rating (1-5)
  Text comment (optional)
  "What did you like most?" (chip multi-select: Speakers | Venue | Networking | Content | Organization)
  Submit → show badge earned animation

---

## COMMUNITY PAGES

### Community List (/app/community)
  Search communities input
  Filter: All | Joined | Trending | By Category
  Community cards: cover image + name + member count + recent activity + Join/Joined button
  "Suggested for you" AI section (top)

### Community Detail (/app/community/:id)
  Cover image header + community name + member count
  Join/Joined button + share button
  Tabs: Discussions | Events | Members | About

  Discussions Tab:
    Thread list: avatar + author name + thread title + timestamp + reply count + reaction count
    "New Thread" button → opens compose modal
    Click thread → expand inline or navigate to thread detail

  Thread Detail:
    Original post (full content)
    Reply thread (indented)
    Reply input at bottom with emoji picker (mock)
    Like / React / Share on each post

  Events Tab:
    Upcoming events tagged to this community
    Past events

  Members Tab:
    Grid of member avatars + names
    Admin/Moderator badges
    "Message" button (mock)

---

## GAMIFICATION — ACHIEVEMENTS (/app/profile/achievements)

### Profile Header
  Large avatar | Name | Level badge | XP bar progress (e.g. "Level 12 — 2,340 / 3,000 XP")
  Edit Profile button

### Badges Grid (3 columns)
  Earned badges: full color, title, description, date earned
  Locked badges: grayscale, "?" icon, unlock condition shown
  Categories: Attendance | Community | Organizer | Streaks | Special

### Leaderboard Section
  Toggle: Global | Friends | Community
  Top 10 list: rank | avatar | name | level | XP
  User's own rank highlighted

### Milestones
  Progress bars: First Event | 10 Events | 50 Events | Category Streaks
  Claim reward button when milestone reached

### Sample badges:
  🎟️ First Timer — Attended first event
  🔥 On Fire — 3 events in a week
  💬 Conversation Starter — Posted 10 comments
  ⭐ Super Fan — Attended 5 events by same organizer
  🏆 Community Leader — 100 reactions received
  🎯 Explorer — Attended events in 5 categories

---

## ORGANIZER DASHBOARD (/organizer/dashboard)

### Layout: Sidebar + Main content

### Overview Cards Row (4 cards)
  Total Events (active + draft) | Total Attendees | Revenue (if applicable) | Engagement Score (AI)
  Each card: icon + number + trend arrow (% vs last month)

### Active Events Section
  Table or card list:
    Event name | Date | RSVPs / Capacity | Status | Days until | Quick actions
  Quick actions: Edit | View Analytics | Share | Duplicate | Archive
  "Create New Event" button (prominent, top-right)

### AI Insights Panel (right sidebar or bottom section)
  "Your events are performing 20% above average this month"
  Recommendations as cards:
    💡 "Send a reminder email — high impact (estimated +15% attendance)"
    💡 "Add early-bird pricing — similar events saw 2x early RSVPs"
    💡 "Promote on Tuesdays for 2x engagement reach"
  Dismiss / Apply buttons on each

### Recent Activity Feed
  Timeline: new RSVPs, community posts, check-ins, feedback received

---

## EVENT CREATION WIZARD (/organizer/events/create)

6-step wizard with step indicator at top.

Step 1 — Basics
  Event title (text input, AI suggests based on category selection below)
  Category dropdown
  Event type: In-Person | Virtual | Hybrid
  Date & time picker (start + end)
  Location search (for in-person/hybrid)
  Featured image upload (drag-drop zone + preview)
  AI suggestion tooltip: "Events with high-quality photos get 3x more engagement"

Step 2 — Details
  Rich text description editor (bold, italic, lists, links)
  AI Writing Assistant panel (right side or floating):
    Buttons: "Improve clarity" | "Make it more engaging" | "Add call-to-action"
    AI rewrites description inline with diff highlight
  Tags input (AI auto-suggests tags)
  Capacity limit toggle + number input
  Age restriction option

Step 3 — Ticketing
  Free vs Paid toggle
  Ticket type rows (add/remove):
    Type name | Price | Quantity | Description
  Registration deadline picker
  Refund policy dropdown

Step 4 — Community Settings
  Enable community discussion (toggle)
  Pre-event chat (toggle)
  Post-event access duration (7 days / 30 days / Forever)
  Allow attendee photo sharing (toggle)
  Moderation level: Auto | Manual review | Trusted members only

Step 5 — Promotion
  AI Audience Recommendation card:
    "We'll show this to ~4,200 users interested in [category] within [radius]"
    Estimated reach meter (visual bar)
  Promotional boost options (optional, mock paid feature — show UI, no payment)
  Email blast to followers (toggle, shows follower count)
  Share draft link (copy button)

Step 6 — Review & Publish
  Full preview (desktop + mobile toggle)
  AI SEO Checklist:
    ✓ Clear, searchable title
    ✓ High-quality image detected
    ✓ Description is 200+ words
    ✓ Competitive pricing
    ⚠ "Consider adding more tags for discoverability"
  Publish button + Save as Draft button

Post-publish: success animation + share buttons + redirect to manage page

---

## EVENT MANAGEMENT (/organizer/events/:id/manage)

4 tabs: Attendees | Analytics | Community | AI Insights

### Attendees Tab
  Search + filter bar (status: confirmed/checked-in/cancelled)
  Table: Avatar | Name | Ticket Type | RSVP Date | Check-in Status | Actions
  Actions: Send message | Remove attendee
  Bulk: select all → send email / export CSV
  Check-in stats bar: X checked in / Y total

### Analytics Tab
  Charts (Recharts):
    - Registration timeline (line chart, daily RSVPs over time)
    - Traffic sources (pie chart: Direct, Social, Email, Recommendations)
    - Attendee demographics (bar chart: age groups)
    - Engagement funnel (custom bar: Page views → Interested → RSVP → Checked in)
  Export buttons (PNG / CSV mock)

### Community Tab
  Discussion threads list (same as community detail view but with moderation tools)
  Moderator actions per post: Pin | Hide | Delete | Warn User
  "Post Announcement" button → pinned announcement with banner styling
  Member list with role management

### AI Insights Tab
  Performance score (large circular progress, 0-100)
  "Your event score: 87/100 — Great job!"
  Breakdown: Engagement (90) | Reach (82) | Retention (89)
  Historical comparison chart (this event vs your average)
  Predictions: "Estimated final attendance: 142-168"
  Next steps recommendations with priority labels (High / Medium / Low)

---

## ADMIN DASHBOARD (/admin)

### Layout: Full sidebar (wider, 280px) + main content

### Overview (/admin/dashboard)
  Platform metrics cards (4):
    Total Users | Active Events | Platform Revenue | Community Health Score
  Real-time activity feed (right panel):
    New event submissions | User reports | Flagged content | System alerts
  Charts:
    DAU/MAU trend (line chart, 30 days)
    Event category distribution (donut chart)
    Geographic heatmap (simplified — use a visual grid/bar chart by city)

### Event Moderation (/admin/events)
  Queue tabs: Pending Review | Approved | Rejected | Flagged
  Each event row: image thumbnail | title | organizer | submitted date | AI screening score
  AI pre-screening badges: ✓ No policy violations | ⚠ Review recommended | ✗ Likely spam
  Quick actions: Approve | Reject | Request changes | View
  Reject opens modal: reason input + notify organizer toggle

### User Management (/admin/users)
  Table: Avatar | Name | Role | Join Date | Activity Score | Status | Actions
  Filters: role, status, date range
  Search by name or email
  Actions per row: View profile | Suspend | Grant organizer | Reset password | Delete
  Bulk actions: Suspend selected | Export

### Community Moderation (/admin/community)
  Flagged content queue:
    Each item: content preview | community | author | flag reason | AI confidence score | Actions
  Actions: Remove | Warn user | Ban user | Dismiss flag
  AI analysis sidebar: toxicity score, sentiment, classification label
  Audit log: timeline of admin actions

### Platform Analytics (/admin/analytics)
  Full Recharts dashboard:
    User growth (line chart, 12 months)
    Retention cohort heatmap (table-style with color intensity)
    Top performing events (table)
    Category trends (area chart)
    AI platform health score with trend

### Settings (/admin/settings)
  Tabs: General | Moderation | Email Templates | Feature Flags | Integrations
  Feature flags toggle list (e.g., AI search, gamification, community, boost)
  Email template editor (simple textarea)
  Integration status: Payment | Email service | Calendar | Analytics

---

## AI FEATURES — IMPLEMENTATION DETAILS

### 1. AI Recommendation Engine (mock)
  On /app/discover, sort events by relevance score (calculate from user interests set during onboarding)
  Mark top 20% as "Recommended for you" (add isRecommended: true to mock data)
  Show reasoning on hover: "Because you attended Tech Meetups" (tooltip)
  After each RSVP / bookmark, reshuffle recommendations silently (state update)

### 2. AI Chat Search (AIAssistant component)
  Parse user input string for: category keywords, location, price hint ("free", "under $X"), time ("this weekend", "tonight")
  Filter mock events array using extracted criteria
  Respond with: "Found X events matching your search:" + filtered EventCard grid
  Fallback: "No exact match — here are some similar events you might like:"
  Add "Save this search" to user profile mock state

### 3. Event Creation Assistant (Organizer wizard)
  When description textarea loses focus: show "Improve with AI" button
  On click: replace textarea content with improved mock text (use a hardcoded improved version)
  Show diff overlay (original vs improved) with accept/reject
  Tag suggestions: analyze title + description words → suggest from predefined tag library

### 4. Analytics Insights (Organizer)
  Generate insight cards from mock analytics data:
    If attendance rate < 60%: show "Low attendance alert" insight card
    If community posts > 20: show "High engagement" badge
    If event < 7 days away and RSVPs < 50% capacity: show "Send reminder" recommendation

### 5. Admin Content Moderation
  Each community post in mock data has: toxicityScore (0-1), spamScore (0-1)
  Posts with toxicityScore > 0.7 auto-flagged in moderation queue
  Show confidence score as colored badge: High (red) | Medium (amber) | Low (green)

### 6. Smart Notifications
  Notification center (/app/notifications):
    AI-prioritized list (sort by relevance score)
    Types: event_reminder | rsvp_confirmed | badge_earned | community_reply | ai_recommendation
    Read/unread state
    Mark all read button
    Notification preferences link

---

## STATE MANAGEMENT

Use Context API (or Zustand if preferred):

### AuthContext
  currentUser: { id, name, email, avatar, role: 'attendee' | 'organizer' | 'admin' }
  isAuthenticated: boolean
  switchRole(role): updates currentUser.role and redirects to appropriate layout

### UserContext (extends auth)
  interests: string[]
  location: string
  bookmarkedEvents: string[]  (event IDs)
  rsvpedEvents: string[]
  notifications: Notification[]
  achievements: Badge[]
  xp: number, level: number

### EventsContext
  allEvents: Event[]
  myEvents: Event[]  (organizer's created events)
  filteredEvents: Event[]
  searchQuery: string
  activeFilters: FilterState
  updateFilters(filters): applies filters to allEvents → updates filteredEvents

### UIContext
  isSidebarOpen: boolean
  isAIAssistantOpen: boolean
  activeModal: string | null
  theme: 'light' | 'dark'
  toasts: Toast[]

---

## MOCK DATA STRUCTURE

### Event object
{
  id: string,
  title: string,
  description: string,
  image: string,  // use picsum.photos or unsplash source URLs
  category: string,
  date: string,  // ISO format
  endDate: string,
  location: { venue: string, address: string, city: string, lat: number, lng: number },
  isVirtual: boolean,
  organizer: { id: string, name: string, avatar: string, verified: boolean, followerCount: number },
  price: number,  // 0 for free
  ticketTypes: [{ name: string, price: number, available: number }],
  capacity: number,
  rsvpCount: number,
  tags: string[],
  isRecommended: boolean,
  relevanceScore: number,
  communityId: string,
  attendees: [{ id: string, name: string, avatar: string }],
}

### User object
{
  id: string, name: string, email: string, avatar: string,
  role: 'attendee' | 'organizer' | 'admin',
  interests: string[], location: string, radius: number,
  joinDate: string, level: number, xp: number,
  badges: Badge[], rsvpedEvents: string[], bookmarkedEvents: string[],
}

### Community object
{
  id: string, name: string, description: string, coverImage: string,
  category: string, memberCount: number, eventCount: number,
  isJoined: boolean, threads: Thread[],
}

### Thread object
{
  id: string, communityId: string, author: User, title: string,
  content: string, createdAt: string, replyCount: number,
  reactionCount: number, isPinned: boolean, isAnnouncement: boolean,
  toxicityScore: number, spamScore: number,
}

Create at least 20 mock events, 5 communities, 3 organizers in /src/data/mockData.js

---

## ANIMATIONS & INTERACTIONS

### Page transitions
  Use React Router's location key to trigger fade+slide (100ms ease-out)
  Wrap route outlet in motion div (use CSS transitions, not Framer Motion)

### Scroll animations
  Use Intersection Observer for fade-in-up on landing page sections
  Threshold: 0.1, once: true

### Micro-interactions
  Button: scale(0.97) on active, scale(1.02) on hover
  Card: translateY(-4px) + shadow increase on hover
  Modal: opacity 0→1 + scale(0.95→1) on open, reverse on close
  Toast: slide in from right + fade out
  Badge unlock: bounce animation + golden glow
  Confetti on RSVP confirmation: CSS keyframes, 30 colored particles

### Loading states
  All data fetches: show Skeleton components (pulse animation)
  Buttons in loading state: spinner + disabled
  Page-level: full-page spinner centered in layout

---

## RESPONSIVE RULES

### Mobile (< 768px)
  - TopNav: logo + hamburger → slide drawer
  - Show mobile bottom nav in attendee layout
  - Event cards: full-width, stack vertically
  - Organizer sidebar: hidden, toggle via header button
  - Discovery filters: FilterDrawer (slide up from bottom)
  - Calendar: day view only on mobile, week/month toggle available
  - Wizard steps: full-screen, no split layout
  - Modals: full screen bottom sheet style

### Tablet (768px – 1024px)
  - TopNav: show some links
  - 2-column event grid
  - Sidebar: collapsed by default, icon-only
  - Split layouts: reduce to single column or 40/60

### Desktop (> 1024px)
  - Full sidebar, full TopNav with links
  - 3-column event grid
  - Split layouts as designed

---

## QUALITY CHECKLIST

Before completing, verify all of these:

[ ] Every route renders without crashing
[ ] All navigation links go somewhere (no 404s within the app)
[ ] Back buttons work on all detail pages
[ ] Mobile bottom nav highlights active tab correctly
[ ] Role switching (attendee ↔ organizer ↔ admin) works and redirects correctly
[ ] All modals close on ESC and backdrop click
[ ] All forms have validation with inline error messages
[ ] Loading skeletons show for all data fetches (even if mock, add a 600ms delay)
[ ] Empty states on all list pages when no data
[ ] Dark mode works on all pages
[ ] At least 20 mock events cover varied categories, prices, and dates
[ ] AI search filters actual events and returns results
[ ] RSVP flow completes and updates user state
[ ] Achievements page shows earned vs locked badges
[ ] Organizer analytics charts render with Recharts
[ ] Admin moderation queue has at least 5 flagged items to review
[ ] Toast notifications appear for: RSVP success, bookmark, form submit, errors
[ ] No hardcoded colors (use Tailwind classes or CSS variables only)
[ ] No broken images (use placeholder URLs)
[ ] Accessibility: all interactive elements have aria-labels, focus rings visible

---

## FOLDER STRUCTURE

src/
  components/
    ui/           (Button, Badge, Modal, Toast, Skeleton, EmptyState, Avatar)
    layout/       (TopNav, Sidebar, BottomNav, Footer, PageWrapper)
    events/       (EventCard, EventGrid, EventFilters, FilterDrawer)
    ai/           (AIAssistant, AISearchModal, AIInsightCard)
    organizer/    (StatsCard, AnalyticsChart, AttendeeTable)
    community/    (ThreadCard, CommentBox, MemberList)
    gamification/ (BadgeCard, XPBar, Leaderboard)
  pages/
    public/       (Landing, Login, Signup, Onboarding)
    attendee/     (Discover, EventDetail, RSVP, Calendar, MyEvents, Community, Profile, Notifications, Achievements)
    organizer/    (Dashboard, MyEvents, CreateEvent, ManageEvent, Analytics, Audience)
    admin/        (Dashboard, Events, Users, Community, Analytics, Settings)
  context/        (AuthContext, UserContext, EventsContext, UIContext)
  data/           (mockData.js, mockUsers.js, mockCommunities.js, categories.js)
  hooks/          (useAuth, useEvents, useFilters, useIntersection, useToast)
  utils/          (formatDate, formatPrice, calculateRelevance, parseSearchQuery)
  styles/         (globals.css — Tailwind base, custom CSS vars, animations)
  App.jsx         (Router setup, Context providers, route guards)
  main.jsx

---

## START HERE

1. Read through this entire prompt before writing any code.
2. Set up the design system tokens and reusable components first.
3. Build the landing page to validate the design direction.
4. Then build the attendee flows (discover → event detail → RSVP → my events).
5. Then organizer flows (dashboard → create event → manage).
6. Then admin panel.
7. Wire AI features last (they depend on events data being ready).
8. Do a final pass for responsiveness and polish.

Work file by file. After each major page, confirm it renders before moving on.
Do not leave TODO comments — implement everything now.
  