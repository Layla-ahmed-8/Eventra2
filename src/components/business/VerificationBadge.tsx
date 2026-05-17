import { cn } from '../../app/components/ui/utils';

interface VerificationBadgeProps {
  isVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: { icon: 'w-3 h-3', wrapper: 'px-1.5 py-0.5 text-xs gap-1' },
  md: { icon: 'w-4 h-4', wrapper: 'px-2 py-0.5 text-xs gap-1.5' },
  lg: { icon: 'w-5 h-5', wrapper: 'px-2.5 py-1 text-sm gap-1.5' },
};

export default function VerificationBadge({ isVerified, size = 'md', className }: VerificationBadgeProps) {
  if (!isVerified) return null;
  const { icon, wrapper } = SIZE_MAP[size];
  return (
    <span className={cn('inline-flex items-center rounded-full font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400', wrapper, className)}>
      <svg className={cn(icon, 'shrink-0')} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Verified
    </span>
  );
}
