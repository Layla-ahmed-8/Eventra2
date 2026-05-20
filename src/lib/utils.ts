export { cn } from '../app/components/ui/utils';
export { demoToast, demoInfo, shareOrCopyLink, downloadTextFile } from './demoFeedback';

export function formatCurrency(amount: number, currency = 'EGP'): string {
  return new Intl.NumberFormat('en-EG', { style: 'currency', currency }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(dateStr));
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(dateStr));
}

export function getXPForLevel(level: number): number {
  return 100 * level + 50 * (level * (level - 1)) / 2;
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  while (xp >= getXPForLevel(level + 1)) level++;
  return level;
}

export function formatRelativeTime(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const abs = Math.abs(diff);
    const sign = diff >= 0 ? -1 : 1;
    if (abs < 60_000) return rtf.format(sign * Math.round(abs / 1_000), 'second');
    if (abs < 3_600_000) return rtf.format(sign * Math.round(abs / 60_000), 'minute');
    if (abs < 86_400_000) return rtf.format(sign * Math.round(abs / 3_600_000), 'hour');
    if (abs < 604_800_000) return rtf.format(sign * Math.round(abs / 86_400_000), 'day');
    if (abs < 2_592_000_000) return rtf.format(sign * Math.round(abs / 604_800_000), 'week');
    if (abs < 31_536_000_000) return rtf.format(sign * Math.round(abs / 2_592_000_000), 'month');
    return rtf.format(sign * Math.round(abs / 31_536_000_000), 'year');
  } catch {
    return formatDateTime(dateStr);
  }
}
