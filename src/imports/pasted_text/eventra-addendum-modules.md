# EVENTRA — ADDENDUM PROMPT: MAP, PAYMENT, ORDER SUMMARY & MESSAGES
# Paste this AFTER the main upgrade prompt. Treat as additional modules.

---

## MODULE 1: MAP INTEGRATION & LOCATION UX

### Library
Use Leaflet.js via react-leaflet (npm install react-leaflet leaflet).
Tile layer: OpenStreetMap (free, no API key required).
  URL: https://tile.openstreetmap.org/{z}/{x}/{y}.png

### Where Maps Appear

A) Event Detail Page — Venue Map Section
  Position: Below the event info grid, above the description tabs.
  Component: 
  - MapContainer: height 260px, rounded-2xl, overflow hidden, border border-gray-200
  - Center: event lat/lng from mock data
  - Zoom: 15
  - Marker: custom purple SVG pin marker (use Leaflet.divIcon with inline SVG)
  - Popup on marker click: venue name + address + "Get Directions" link
    "Get Directions" opens: https://www.google.com/maps/dir/?api=1&destination={lat},{lng}
  - Disable scroll zoom by default (scrollWheelZoom={false})
  - Show "Open in Maps" text button below map (Google Maps link)
  - Show "📍 {venue name}, {city}" text row above map with copy-address icon

B) Discover Page — Map View Toggle
  Add a toggle at the top of the discover feed: [Grid View] [Map View]
  When Map View active:
    Replace event grid with a full-width MapContainer (height: calc(100vh - 64px))
    Each event: purple circle marker, size proportional to rsvpCount (min 24px, max 48px)
    Marker hover: show mini EventCard tooltip (title + date + price + "View Event" link)
    Marker click: open a side panel (right, w-80) with the full EventCard + RSVP button
    Side panel slides in from right with transition
    Cluster nearby markers when zoomed out (use react-leaflet-cluster)
    Top-left map controls: zoom in/out, recenter to user location
  User Location:
    "Use my location" button calls navigator.geolocation.getCurrentPosition()
    On success: add a blue pulsing dot marker at user position + recenter map
    On deny: show a subtle banner "Enable location for nearby events"
    Store coordinates in UserContext: { lat, lng }
    Persist to localStorage

C) Onboarding — Location Step (enhanced)
  After user enters city or grants geolocation:
    Show a mini MapContainer (height 200px) centered on detected location
    Non-interactive (dragging={false}, zoomControl={false})
    Show a purple circle at center with radius matching the selected km radius
    Radius circle: use Leaflet.circle — update dynamically as slider changes
    Below map: "Showing events within {X} km of {City}"

D) Event Creation Wizard — Location Step (Organizer)
  Location search input: type venue name or address
  Use OpenStreetMap Nominatim API for geocoding (free):
    GET https://nominatim.openstreetmap.org/search?q={query}&format=json&limit=5
  Show autocomplete dropdown of results (address + lat/lng)
  On selection:
    Populate address fields automatically
    Show confirmation map (height 200px, non-interactive) with marker at selected location
    "Move pin" toggle: makes map draggable — user can fine-tune marker position
    On drag end: update lat/lng in form state
  Virtual event option: hide map, show "Virtual Event" badge instead

### Mock Data — Add to all events
  location: {
    venue: "Cairo Jazz Club",
    address: "197 26th of July Corridor, Agouza",
    city: "Cairo",
    country: "EG",
    lat: 30.0626,
    lng: 31.2138,
    isVirtual: false,
    virtualLink: null,  // or Zoom/Meet URL for virtual
  }

### Location-Based Filtering (Discover Page)
  When user has granted location:
    Calculate distance from user to each event using Haversine formula:
      function haversine(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) *
                  Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      }
    Add distanceKm to each event object at filter time
    Show "X km away" badge on EventCards when location is known
    "Near Me" filter chip: filters events within user's radius preference
    Sort option: "Nearest first"

### Nearby Events Section (Discover Page)
  When location is known: show a new section "Events Near You"
  Top of discover feed (above Recommended)
  4 EventCards sorted by distance
  Each card shows: "{X} km away" distance badge (cyan)

---

## MODULE 2: PAYMENT FLOW (Full UX)

### Overview
All payments are mock — no real payment processing.
Simulate realistic payment UX with proper states and validation.
Use a mock delay of 1800ms to simulate processing.

### Payment Flow Entry Points
1. Event RSVP (paid event) — /app/events/:id/rsvp
2. Organizer promotional boost (optional, in create event wizard)
3. VIP ticket upgrade (in My Events, before event)

### Payment Flow — Steps

#### Step 1: Order Summary Screen
  Component: 
  Show before any payment details are entered.
  
  Layout (max-w-lg, centered card):
    Header: "Complete your registration"
    
    Event summary row:
      Event thumbnail (60×60, rounded-lg) + title + date + location
    
    Ticket breakdown table:
      Columns: Ticket Type | Qty | Unit Price | Subtotal
      Rows: one per ticket type selected
      Divider
      Subtotal row
      Service fee row: "Eventra service fee (3%)" — calculated
      Promo code row: input field + "Apply" button
        On valid code ("EVENTRA20"): show green checkmark + "-20% discount" row
        On invalid: red error "Invalid promo code"
      Divider
      Total row: bold, large, purple
    
    Cancellation policy: "Free cancellation up to 48 hours before event"
    
    "Proceed to Payment" button (full-width primary)
    "Back" link

#### Step 2: Payment Method Selection
  Component: 
  
  Layout (max-w-lg card):
    Header: "Choose payment method"
    
    Saved cards section (if user has saved cards in mock data):
      Card rows: card icon + "•••• •••• •••• 4242" + expiry + "Use this card" radio
      Each row: click to select (highlight border purple)
    
    Divider: "Or pay with"
    
    Express payment buttons row:
      Apple Pay button (black, Apple icon, "Pay with Apple Pay")
      Google Pay button (white, Google icon, "Pay with Google Pay")
      On click: skip to Step 4 (Confirmation) after 1800ms processing mock
    
    "Add new card" toggle (expands card form below):
      Card number input: format as user types (#### #### #### ####)
        Detect card brand from first digits:
          Visa: starts with 4 → show Visa icon
          Mastercard: starts with 51-55 → show MC icon
          Amex: starts with 34/37 → show Amex icon
      Expiry input: MM/YY format
      CVV input: 3-4 digits, show info tooltip icon ("3 digits on back of card")
      Cardholder name input
      "Save this card for future payments" checkbox (default checked)
      
    Billing address section (collapsible, expand if needed):
      Toggle: "Same as profile address" (default on)
      If off: show full address form (line 1, city, postal code, country)
    
    SSL badge row: 🔒 "Secured by 256-bit SSL encryption" (gray, small)
    
    "Pay {Total}" button (full-width primary, shows exact amount)
    "Back to Order Summary" link

#### Step 3: Processing Screen
  Component: 
  
  Full-screen overlay or centered card.
  Animated: spinning purple circle + "Processing your payment..."
  Duration: 1800ms then transition to Step 4
  Do NOT allow back navigation during processing (disable browser back)
  Sub-text: "Please don't close this window"

#### Step 4: Confirmation Screen
  Component: 
  
  Success state:
    Large animated checkmark (SVG, draw animation 600ms, green)
    "Payment successful! 🎉"
    Confirmation number: "Booking #EVT-2026-{random 6 digits}"
    
    Booking summary card (white, shadow, rounded-2xl):
      Event name + date + location
      Ticket(s): type + quantity
      Total paid: amount
      Payment method: "•••• 4242"
    
    QR Code section (important — see Module 4 for full QR spec):
      "Your entry ticket"
      QR code image (use qrcode.react library)
      QR data: JSON.stringify({ bookingId, userId, eventId, timestamp })
      "Save to Wallet" button (mock)
      "Download PDF Ticket" button (mock — just triggers window.print())
      "Send to Messages" button → opens SendToMessagesModal (see Module 4)
    
    4 action buttons:
      "Add to Calendar" (primary) — generates .ics file and triggers download
      "Join Event Community" (secondary) → navigate to community/:communityId
      "Share with Friends" (ghost) → opens share sheet (Web Share API or copy link)
      "View My Tickets" (ghost) → navigate to /app/my-events
  
  Failure state (triggered if mock payment fails — use 10% random failure rate):
    Red X icon animation
    "Payment failed"
    Error message: "Your card was declined. Please check your details and try again."
    "Try Again" button → back to Step 2
    "Use a different card" link
    "Contact support" link

#### Promo Code Logic (mock)
  Valid codes (hardcoded):
    "EVENTRA20" → 20% off
    "WELCOME10" → 10% off
    "VIP50" → 50% off (only valid for VIP tickets)
  Invalid: any other string → error message
  Applied discount: recalculate total live, show savings in green

### Payment State in Context
  Add to UserContext:
    savedCards: [{ id, last4, brand, expiry, isDefault }]
    bookings: [{ id, eventId, tickets, total, paymentMethod, status, qrData, createdAt }]
  
  On successful payment: push new booking to bookings array

---

## MODULE 3: ORDER SUMMARY PAGE

Route: /app/my-events/:bookingId/summary

This is the full post-purchase summary page, accessible from:
  - Payment confirmation redirect
  - My Events tab (each booking has "View Order" link)
  - Messages inbox (QR ticket message has "View Full Summary" link)

### Layout
  TopNav (attendee)
  Max-w-2xl centered, py-10

### Sections

1. Header
   "Booking Confirmed" (H1, green checkmark inline)
   Booking reference: "#EVT-2026-XXXXXX"
   Date booked: "Booked on May 7, 2026 at 3:42 PM"

2. Event Info Card
   Full-width card (white, shadow-md, rounded-2xl, p-6)
   Event cover image (full width, h-48, object-cover, rounded-xl)
   Below image:
     Category badge + "Verified Event" badge
     Event title (H2)
     Organizer: avatar + name + "Follow" button
     Info grid (2×2):
       📅 Full date + time (with timezone)
       📍 Venue + address + "Get Directions" link
       🎟️ X ticket(s) — ticket type name
       💰 Total paid

3. Your Tickets Section
   "Your Tickets" (H3)
   One card per ticket type purchased:
     White card, border, rounded-xl
     Left: QR Code (qrcode.react, size 120px)
     Right:
       Ticket type name (semibold)
       "Admit 1" label
       Booking ref + ticket number (e.g. "Ticket 1 of 2")
       Event date + time
       Venue name
       Status badge: "Active" (green) | "Used" (gray) | "Cancelled" (red)
     Bottom: "Send to Messages" button (see Module 4) + "Download" button

4. Payment Summary
   "Payment Details" (H3)
   Table rows:
     Ticket breakdown (type × qty × price)
     Service fee
     Discount (if promo applied, show in green)
     Total charged
   Payment method row: card icon + "•••• 4242" + "Visa"
   Transaction ID: mock UUID

5. Cancellation & Refund Policy
   Expandable section (click to expand):
     Policy text based on event's refund policy field
     "Request Cancellation" button (danger/outline) if event is >48h away
     Cancellation modal:
       "Are you sure?" warning
       Refund amount shown
       Confirm Cancellation → updates booking status to Cancelled

6. Add to Calendar Section
   Three buttons: Google Calendar | Apple Calendar (.ics) | Outlook
   Google Calendar: open Google Calendar event creation URL with prefilled params
   Apple/Outlook: trigger .ics download
   .ics content (generate as string):
     BEGIN:VCALENDAR
     VERSION:2.0
     BEGIN:VEVENT
     DTSTART:{eventDate in iCal format}
     DTEND:{endDate}
     SUMMARY:{eventTitle}
     LOCATION:{venue + address}
     DESCRIPTION:{eventDescription (first 200 chars)}
     END:VEVENT
     END:VCALENDAR

7. Share Section
   "Share this event"
   3 buttons: Copy link | Share on WhatsApp | Share on X (Twitter)
   Copy link: copies /app/events/:id to clipboard, shows "Copied!" toast
   WhatsApp: opens https://wa.me/?text={encodedMessage}
   X: opens https://x.com/intent/tweet?text={encodedMessage}

---

## MODULE 4: MESSAGES TAB & QR CODE DELIVERY

### Overview
A full messaging inbox where:
  - System sends QR ticket automatically after RSVP/payment
  - Organizers can message all attendees of their events
  - Users can send QR tickets to contacts (mock contacts list)
  - The inbox supports thread-style conversations

### Route: /app/messages

Add "Messages" to:
  - TopNav icon (chat bubble icon, with unread badge count)
  - Mobile Bottom Nav (5th tab, replacing or alongside Profile)
  - Left sidebar (attendee layout if sidebar is shown)

### Message Types
  1. system — automated (booking confirmations, reminders, platform alerts)
  2. organizer → attendee — event updates, announcements
  3. attendee → attendee — QR ticket sharing, event invites
  4. attendee → contact — forward ticket / invite friend

### /app/messages — Inbox Layout

Two-panel layout (desktop): Left panel (w-80) = conversation list | Right panel = active conversation
Mobile: show list; tap conversation → full-screen conversation view; back arrow returns to list

#### Left Panel — Conversation List
  Search bar: "Search messages..."
  Filter tabs: All | Tickets | Organizer | System
  
  Conversation rows (sorted by most recent):
    Avatar (or event thumbnail for system msgs) | Name / Sender | Preview text | Timestamp | Unread dot
    Types:
      System message: Eventra logo avatar, "Eventra" sender
      Organizer message: organizer avatar, organizer name
      Contact: contact avatar, contact name
    
    Active/selected: purple-50 bg
    Unread: bold preview text + purple dot
    Hover: gray-50 bg

#### Right Panel — Conversation View

Header:
  Avatar + Name + (for organizer: "Event Organizer" tag | for system: "Eventra Official" tag)
  Actions: (for organizer msgs) "View Event" link

Message Bubbles:
  System/Organizer messages: left-aligned, gray bg, rounded-2xl rounded-tl-sm
  User's outgoing: right-aligned, purple bg, white text, rounded-2xl rounded-tr-sm
  Timestamp below each bubble (small, gray)
  Date divider between messages on different days

#### Ticket Message (auto-sent on booking confirmation)
  This is a special rich message type rendered inside a conversation bubble:
  
  Sender: "Eventra" (system)
  
  Message card inside bubble (white card, border, rounded-xl, p-4, max-w-xs):
    Header row: 🎟️ "Your Ticket" label (purple badge)
    Event thumbnail (full width, h-24, rounded-lg, object-cover)
    Event name (semibold, 14px)
    Date + time (gray, 12px)
    Venue name (gray, 12px)
    Divider
    QR Code (centered, size 160px, generated with qrcode.react)
      QR data: JSON string:
        {
          "bookingId": "EVT-2026-XXXXXX",
          "userId": "user_123",
          "eventId": "event_456",
          "ticketType": "General Admission",
          "qty": 1,
          "issuedAt": "2026-05-07T15:42:00Z",
          "valid": true
        }
    Booking ref (monospace, 11px, gray): "#EVT-2026-XXXXXX"
    Status chip: "Active" (green) | "Used" (gray)
    Divider
    Two action buttons (full-width, stacked):
      "View Full Summary" → /app/my-events/:bookingId/summary
      "Forward Ticket" → opens ForwardTicketModal
  
  Below the card (as plain text in same bubble):
    "Show this QR code at the entrance. Have a great time! 🎉"
  
  System text message below bubble:
    "Tap 'View Full Summary' to add to calendar or request a refund."

#### Organizer Message Thread
  Organizer can send messages to all attendees from their Event Management page.
  Message appears in each attendee's inbox as a conversation with the organizer.
  Message types organizer can send:
    - Plain text announcement ("Parking update: use Gate B")
    - Event reminder (pre-formatted card with event details)
    - Updated venue/time info (highlight changed fields in amber)
    - Day-of instructions (rich text)
  
  Attendee can reply (text only, no file uploads).
  Organizer sees all replies in their organizer messages view (under /organizer/messages).

#### /organizer/messages Route
  Add to organizer sidebar: Messages (chat icon)
  Inbox shows all conversations with attendees (grouped by event)
  Compose button → opens ComposeModal:
    "Send to all attendees of:" → event dropdown
    Subject line input
    Message body (textarea with rich text option)
    Preview toggle (shows how message will appear in attendee inbox)
    Send button

### ForwardTicketModal
  Triggered by: "Forward Ticket" button on QR ticket message, or "Send to Messages" on confirmation

  Component: 
  
  Header: "Send your ticket"
  
  Tabs: Contacts | Phone Number | WhatsApp
  
  Contacts Tab:
    Search input: "Search contacts..."
    Mock contacts list (at least 8 contacts with avatar + name + phone):
      Ahmed Hassan | Sara El-Sayed | Mohamed Ali | Nour Ibrahim | etc.
    Tap contact to select (checkmark appears)
    Selected contacts shown as avatar chips at top
    "Send" button: sends ticket to selected contacts → adds to their mock inbox
    Success state: "Ticket sent to {name}!"
  
  Phone Number Tab:
    Country code selector (default +20 EG flag)
    Phone number input (formatted: ### ### ####)
    "Send via SMS" button (mock)
    Success: "Ticket sent to +20 ###-###-####"
  
  WhatsApp Tab:
    "Share via WhatsApp" large button
    Opens: https://wa.me/?text={encodedTicketMessage}
    encodedTicketMessage includes: event name + date + venue + booking ref
    Note: "QR code will be accessible via your Eventra app"

### Mock Inbox Data (seed in mockData.js)

Pre-populate inbox with:
  1. System ticket message for a past booking (already exists in bookings mock)
  2. Organizer message: "Doors open at 7:30 PM — Arrive early!"
  3. System reminder: "Your event 'Cairo Tech Meetup' is tomorrow!"
  4. System badge notification: "🏆 You earned the 'Explorer' badge!"
  5. Forwarded ticket from "Sara El-Sayed": "Saved you a spot! 🎟️"

  Each message: {
    id, conversationId, senderId, senderType, senderName, senderAvatar,
    type: 'ticket' | 'text' | 'organizer_update' | 'system',
    content: string,
    ticketData: { ... } | null,
    eventId: string | null,
    isRead: boolean,
    createdAt: string,
  }

### Notification Triggers (add to NotificationContext)
  On payment confirmation: auto-create ticket message in inbox (no user action needed)
  On organizer send: add message to each attendee's inbox + push notification
  On ticket forward received: add to recipient's inbox + unread badge +1
  On event day (mock — check if any booked event date === today's mock date):
    Auto-send: "Your event is today! Tap to view your QR ticket." system message

### QR Code Library
  Install: npm install qrcode.react
  Usage:
    import { QRCodeSVG } from 'qrcode.react';
    
  
  Purple foreground color matches brand (#6C4CF1).
  Error correction level H (30%) — allows logo overlay if desired.
  
  On Event Management (Organizer check-in tab):
    Show a QR scanner placeholder: a camera viewfinder box UI (CSS)
    Simulate scan: "Scan QR" button → opens a modal showing a mock scanned result
    Mock result: attendee name + ticket type + "Valid ✓" (green) | "Already used" (red)

---

## MODULE 5: UPDATED NAVIGATION & ROUTES

Add these new routes to the main App.jsx:

/app/messages .......................... Messages inbox
/app/messages/:conversationId .......... Specific conversation
/app/my-events/:bookingId/summary ...... Order summary

/organizer/messages .................... Organizer messages inbox
/organizer/messages/:conversationId .... Organizer conversation view

Update TopNav:
  Add messages icon (MessageSquare from lucide-react) between notification bell and avatar
  Show unread count badge (red dot, number)
  Click → navigate to /app/messages

Update Mobile Bottom Nav (6 items or replace one):
  Option A: Discover | Map | My Events | Messages | Profile  (replace Community with Map, move Community to profile or tab)
  Option B: Discover | Search | My Events | Messages | Profile  (recommended — keeps it simple)
  Messages tab badge: unread count

Update Sidebar (Organizer):
  Add after Analytics:
    Messages (MessageSquare icon) → /organizer/messages
    Badge: unread count from attendee replies

---

## MODULE 6: UPDATED MOCK DATA ADDITIONS

Add to mockData.js:

### Mock Contacts (for ForwardTicketModal)
export const mockContacts = [
  { id: 'c1', name: 'Ahmed Hassan',    avatar: 'https://i.pravatar.cc/40?img=1',  phone: '+201001234567' },
  { id: 'c2', name: 'Sara El-Sayed',   avatar: 'https://i.pravatar.cc/40?img=2',  phone: '+201112345678' },
  { id: 'c3', name: 'Mohamed Ali',     avatar: 'https://i.pravatar.cc/40?img=3',  phone: '+201234567890' },
  { id: 'c4', name: 'Nour Ibrahim',    avatar: 'https://i.pravatar.cc/40?img=4',  phone: '+201098765432' },
  { id: 'c5', name: 'Yasmine Khaled',  avatar: 'https://i.pravatar.cc/40?img=5',  phone: '+201187654321' },
  { id: 'c6', name: 'Omar Farouk',     avatar: 'https://i.pravatar.cc/40?img=6',  phone: '+201065432198' },
  { id: 'c7', name: 'Layla Mostafa',   avatar: 'https://i.pravatar.cc/40?img=7',  phone: '+201176543210' },
  { id: 'c8', name: 'Karim Adel',      avatar: 'https://i.pravatar.cc/40?img=8',  phone: '+201243215678' },
];

### Mock Bookings (at least 3)
export const mockBookings = [
  {
    id: 'booking-001',
    eventId: 'event-001',
    userId: 'user-001',
    tickets: [{ type: 'General Admission', qty: 2, unitPrice: 150, subtotal: 300 }],
    serviceFee: 9,
    discount: 0,
    total: 309,
    currency: 'EGP',
    paymentMethod: { brand: 'Visa', last4: '4242' },
    status: 'confirmed',
    qrData: { bookingId: 'EVT-2026-001234', userId: 'user-001', eventId: 'event-001', valid: true },
    bookingRef: 'EVT-2026-001234',
    createdAt: '2026-05-01T10:30:00Z',
  },
  // add 2 more with different events and statuses
];

### Mock Conversations (for Messages)
export const mockConversations = [
  {
    id: 'conv-001',
    participants: ['user-001', 'system'],
    lastMessage: 'Your ticket for Cairo Jazz Night is ready',
    lastMessageAt: '2026-05-07T15:42:00Z',
    unread: true,
    messages: [
      {
        id: 'msg-001',
        senderId: 'system',
        senderName: 'Eventra',
        type: 'ticket',
        ticketData: { bookingId: 'booking-001', eventId: 'event-001' },
        content: 'Show this QR code at the entrance. Have a great time! 🎉',
        isRead: false,
        createdAt: '2026-05-07T15:42:00Z',
      }
    ]
  },
  {
    id: 'conv-002',
    participants: ['user-001', 'organizer-001'],
    lastMessage: 'Doors open at 7:30 PM — Arrive early for the best seats!',
    lastMessageAt: '2026-05-06T18:00:00Z',
    unread: true,
    messages: [
      {
        id: 'msg-002',
        senderId: 'organizer-001',
        senderName: 'Cairo Jazz Club',
        type: 'organizer_update',
        content: 'Doors open at 7:30 PM — Arrive early for the best seats!',
        isRead: false,
        createdAt: '2026-05-06T18:00:00Z',
      }
    ]
  },
  // add 3 more mock conversations
];

---

## MODULE 7: UPDATED FOLDER STRUCTURE (additions only)

src/
  components/
    map/
      EventLocationMap.jsx       (single event map)
      DiscoverMapView.jsx        (discover page map toggle)
      LocationRadiusMap.jsx      (onboarding radius selector)
      EventCreateLocationMap.jsx (organizer venue picker)
      MapMarker.jsx              (custom purple Leaflet divIcon)
    
    payment/
      OrderSummary.jsx
      PaymentMethod.jsx
      CardInput.jsx              (formatted card number/expiry/CVV)
      PaymentProcessing.jsx
      PaymentConfirmation.jsx
      PromoCodeInput.jsx
    
    messages/
      MessageInbox.jsx           (two-panel layout)
      ConversationList.jsx       (left panel)
      ConversationView.jsx       (right panel / full mobile)
      MessageBubble.jsx          (text message)
      TicketMessageCard.jsx      (rich QR ticket message)
      ForwardTicketModal.jsx     (contacts/phone/whatsapp tabs)
      ComposeModal.jsx           (organizer compose)
    
    qr/
      QRTicket.jsx               (QR code + ticket info card)
      QRScanner.jsx              (organizer check-in UI)

  pages/
    attendee/
      Messages.jsx               (wraps MessageInbox)
      OrderSummary.jsx           (full order summary page)
    organizer/
      Messages.jsx               (organizer message inbox)

---

## QUALITY ADDITIONS (for these modules)

[ ] Map loads correctly without API key (OpenStreetMap tiles)
[ ] Map does not throw errors if geolocation is denied
[ ] Leaflet CSS imported in index.html or main.jsx: import 'leaflet/dist/leaflet.css'
[ ] Leaflet default marker icon fix applied (known React-Leaflet issue):
    import L from 'leaflet';
    import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
    import markerIcon from 'leaflet/dist/images/marker-icon.png';
    import markerShadow from 'leaflet/dist/images/marker-shadow.png';
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });
[ ] Card number input formats live as user types (#### #### #### ####)
[ ] Payment processing mock delay shows spinner — no click-through
[ ] QR code renders with brand purple color
[ ] Messages unread badge updates when messages are read
[ ] ForwardTicketModal sends ticket and shows success state
[ ] Order summary page accessible from My Events + Messages + Confirmation
[ ] .ics calendar download actually triggers file download
[ ] Mobile: Messages shows full-screen conversation on tap, back arrow returns to list
[ ] All new routes are protected (require auth)
[ ] Map view and grid view toggle state persists in sessionStorage (not lost on back navigation)
  