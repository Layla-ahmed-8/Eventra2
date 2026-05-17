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
  '/app/profile/achievements': () => [
    { label: 'Profile', path: '/app/profile' },
    { label: 'Achievements' },
  ],
  '/app/rewards/store': () => [
    { label: 'Profile', path: '/app/profile' },
    { label: 'Reward Store' },
  ],
  // Organizer
  '/organizer/events/create': () => [
    { label: 'Dashboard', path: '/organizer/dashboard' },
    { label: 'Events', path: '/organizer/events' },
    { label: 'Create Event' },
  ],
  '/organizer/events/:id/manage': (p, o) => [
    { label: 'Dashboard', path: '/organizer/dashboard' },
    { label: 'Events', path: '/organizer/events' },
    { label: o.eventTitle || 'Event', path: `/organizer/events/${p.id}/manage` },
    { label: 'Manage' },
  ],
  '/organizer/analytics': () => [
    { label: 'Dashboard', path: '/organizer/dashboard' },
    { label: 'Analytics' },
  ],
  '/organizer/messages': () => [
    { label: 'Dashboard', path: '/organizer/dashboard' },
    { label: 'Messages' },
  ],
  '/organizer/profile': () => [
    { label: 'Dashboard', path: '/organizer/dashboard' },
    { label: 'Profile' },
  ],
  // Admin
  '/admin/events': () => [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Event Moderation' },
  ],
  '/admin/users': () => [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'User Management' },
  ],
  '/admin/community': () => [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Community' },
  ],
  '/admin/moderation': () => [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Moderation Center' },
  ],
  '/admin/analytics': () => [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Analytics' },
  ],
  '/admin/settings': () => [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Settings' },
  ],
  '/admin/audit-logs': () => [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Audit Logs' },
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
