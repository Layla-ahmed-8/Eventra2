import { useLocation, useParams } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

type RouteMap = Record<string, (params: Record<string, string>, overrides: Record<string, string>) => BreadcrumbItem[]>;

const ROUTE_MAP: RouteMap = {
  // Attendee
  '/app/events/:id': (p, o) => [
    { label: 'Discover', path: '/app/discover' },
    { label: o.eventTitle || p.id },
  ],
  '/app/events/:id/chat': (p, o) => [
    { label: 'Discover', path: '/app/discover' },
    { label: o.eventTitle || p.id, path: `/app/events/${p.id}` },
    { label: 'Event Chat' },
  ],
  '/app/events/:id/rsvp': (p, o) => [
    { label: 'Discover', path: '/app/discover' },
    { label: o.eventTitle || p.id, path: `/app/events/${p.id}` },
    { label: 'RSVP' },
  ],
  '/app/orders/:id': () => [
    { label: 'My Events', path: '/app/my-events' },
    { label: 'Order Summary' },
  ],
  '/app/community/:id': (p, o) => [
    { label: 'Community', path: '/app/community' },
    { label: o.communityName || p.id },
  ],
  '/app/rewards/hub': () => [
    { label: 'Profile', path: '/app/profile' },
    { label: 'Rewards Hub' },
  ],
  // Organizer
  '/organizer/events/create': () => [
    { label: 'Analytics', path: '/organizer/analytics' },
    { label: 'Events', path: '/organizer/events' },
    { label: 'Create Event' },
  ],
  '/organizer/events/:id/manage': (p, o) => [
    { label: 'Analytics', path: '/organizer/analytics' },
    { label: 'Events', path: '/organizer/events' },
    { label: o.eventTitle || 'Event', path: `/organizer/events/${p.id}/manage` },
    { label: 'Manage' },
  ],
  '/organizer/events/:id/chat': (p, o) => [
    { label: 'Analytics', path: '/organizer/analytics' },
    { label: 'Events', path: '/organizer/events' },
    { label: o.eventTitle || 'Event', path: `/organizer/events/${p.id}/manage` },
    { label: 'Event Chat' },
  ],
  '/organizer/notifications': () => [
    { label: 'Analytics', path: '/organizer/analytics' },
    { label: 'Notifications' },
  ],
  '/organizer/messages': () => [
    { label: 'Analytics', path: '/organizer/analytics' },
    { label: 'Messages' },
  ],
  '/organizer/profile': () => [
    { label: 'Analytics', path: '/organizer/analytics' },
    { label: 'Profile' },
  ],
  // Admin
  '/admin/messages': () => [
    { label: 'Analytics', path: '/admin/analytics' },
    { label: 'Messages' },
  ],
  '/admin/events': () => [
    { label: 'Analytics', path: '/admin/analytics' },
    { label: 'Event Moderation' },
  ],
  '/admin/users': () => [
    { label: 'Analytics', path: '/admin/analytics' },
    { label: 'User Management' },
  ],
  '/admin/community': () => [
    { label: 'Analytics', path: '/admin/analytics' },
    { label: 'Community' },
  ],
  '/admin/moderation': () => [
    { label: 'Analytics', path: '/admin/analytics' },
    { label: 'Moderation Center' },
  ],
  '/admin/settings': () => [
    { label: 'Analytics', path: '/admin/analytics' },
    { label: 'Settings' },
  ],
  '/admin/audit-logs': () => [
    { label: 'Analytics', path: '/admin/analytics' },
    { label: 'Audit Logs' },
  ],
  // Attendee wallet
  '/app/wallet': () => [
    { label: 'Profile', path: '/app/profile' },
    { label: 'Wallet' },
  ],
  '/app/wallet/transactions': () => [
    { label: 'Wallet', path: '/app/wallet' },
    { label: 'Transaction History' },
  ],
  '/app/wallet/deposit': () => [
    { label: 'Wallet', path: '/app/wallet' },
    { label: 'Add Funds' },
  ],
  '/app/wallet/withdraw': () => [
    { label: 'Wallet', path: '/app/wallet' },
    { label: 'Withdraw' },
  ],
  '/app/wallet/methods': () => [
    { label: 'Wallet', path: '/app/wallet' },
    { label: 'Payment Methods' },
  ],
  // Organizer wallet
  '/organizer/wallet': () => [
    { label: 'Analytics', path: '/organizer/analytics' },
    { label: 'Wallet' },
  ],
  '/organizer/wallet/withdraw': () => [
    { label: 'Wallet', path: '/organizer/wallet' },
    { label: 'Request Payout' },
  ],
  '/organizer/wallet/transactions': () => [
    { label: 'Wallet', path: '/organizer/wallet' },
    { label: 'Transaction History' },
  ],
  '/organizer/wallet/methods': () => [
    { label: 'Wallet', path: '/organizer/wallet' },
    { label: 'Payout Methods' },
  ],
  // Admin wallet
  '/admin/wallet': () => [
    { label: 'Analytics', path: '/admin/analytics' },
    { label: 'Wallet' },
  ],
  '/admin/wallet/payouts': () => [
    { label: 'Wallet', path: '/admin/wallet' },
    { label: 'Payout Requests' },
  ],
};

function matchRoute(pathname: string): { pattern: string; params: Record<string, string> } | null {
  for (const pattern of Object.keys(ROUTE_MAP)) {
    const segments = pattern.split('/');
    const pathSegs = pathname.split('/');
    if (segments.length !== pathSegs.length) continue;
    const params: Record<string, string> = {};
    let match = true;
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].startsWith(':')) {
        params[segments[i].slice(1)] = pathSegs[i];
      } else if (segments[i] !== pathSegs[i]) {
        match = false;
        break;
      }
    }
    if (match) return { pattern, params };
  }
  return null;
}

export function useBreadcrumbs(overrides: Record<string, string> = {}): BreadcrumbItem[] {
  const { pathname } = useLocation();
  const params = useParams<Record<string, string>>();

  // Only show breadcrumbs for paths with 3+ segments
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 2) return [];

  const matched = matchRoute(pathname);
  if (!matched) return [];

  return ROUTE_MAP[matched.pattern](params as Record<string, string>, overrides);
}
