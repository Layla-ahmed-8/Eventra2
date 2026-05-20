import { cn } from '../../app/components/ui/utils';

type Status =
  | 'active' | 'pending' | 'suspended' | 'banned'
  | 'draft' | 'pending_approval' | 'published' | 'rejected'
  | 'confirmed' | 'cancelled'
  | 'standard' | 'verified'
  | 'approved';

const STATUS_MAP: Record<Status, { label: string; className: string }> = {
  active:           { label: 'Active',          className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  pending:          { label: 'Pending',          className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  suspended:        { label: 'Suspended',        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  banned:           { label: 'Banned',           className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  draft:            { label: 'Draft',            className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  pending_approval: { label: 'Pending Review',   className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  published:        { label: 'Published',        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  rejected:         { label: 'Rejected',         className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  confirmed:        { label: 'Confirmed',        className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  cancelled:        { label: 'Cancelled',        className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  standard:         { label: 'Standard',         className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  verified:         { label: 'Verified',         className: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400' },
  approved:         { label: 'Approved',         className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', config.className, className)}>
      {config.label}
    </span>
  );
}
