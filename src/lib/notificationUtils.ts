import type { Notification } from '../data/notifications';

export type NotificationFilter = 'all' | 'unread' | 'actionable';

export function filterNotifications(
  notifications: Notification[],
  filter: NotificationFilter,
  search: string,
): Notification[] {
  let result = [...notifications];

  if (filter === 'unread') {
    result = result.filter((n) => !n.isRead);
  } else if (filter === 'actionable') {
    result = result.filter((n) => Boolean(n.actionUrl));
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q) ||
        n.type.toLowerCase().includes(q),
    );
  }

  return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function groupByDate(notifications: Notification[]): { label: string; items: Notification[] }[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const groups: Record<string, Notification[]> = {
    Today: [],
    Yesterday: [],
    'This week': [],
    Earlier: [],
  };

  for (const n of notifications) {
    const d = new Date(n.timestamp);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === today.getTime()) groups.Today.push(n);
    else if (d.getTime() === yesterday.getTime()) groups.Yesterday.push(n);
    else if (d >= weekAgo) groups['This week'].push(n);
    else groups.Earlier.push(n);
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}

export function formatNotificationTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
