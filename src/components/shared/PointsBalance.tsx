import { Link } from 'react-router-dom';
import { Coins } from 'lucide-react';
import { cn } from '../../app/components/ui/utils';

interface PointsBalanceProps {
  balance: number;
  showHistory?: boolean;
  className?: string;
}

export default function PointsBalance({ balance, showHistory = false, className }: PointsBalanceProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-semibold text-sm">
        <Coins className="w-4 h-4" />
        {balance.toLocaleString()} pts
      </span>
      {showHistory && (
        <Link
          to="/app/rewards/store"
          className="text-xs text-primary hover:underline"
        >
          Redeem →
        </Link>
      )}
    </div>
  );
}
