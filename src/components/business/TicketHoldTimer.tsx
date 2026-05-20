import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../app/components/ui/utils';

interface TicketHoldTimerProps {
  expiresAt: Date;
  onExpire: () => void;
  className?: string;
}

export default function TicketHoldTimer({ expiresAt, onExpire, className }: TicketHoldTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))
  );

  useEffect(() => {
    if (secondsLeft <= 0) {
      onExpire();
      return;
    }
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          onExpire();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft < 120;

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
      isUrgent
        ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
        : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800',
      className
    )}>
      <Clock className="w-4 h-4 shrink-0" />
      <span>
        Tickets held for{' '}
        <strong>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </strong>
        {isUrgent && ' — complete payment soon!'}
      </span>
    </div>
  );
}
