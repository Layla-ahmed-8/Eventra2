import { useEffect, useState } from 'react';
import { Clock, XCircle } from 'lucide-react';
import { cn } from '../../app/components/ui/utils';

interface CancellationCountdownProps {
  eventDate: string;
  cancellationWindowHours?: number;
  className?: string;
}

function getDeadline(eventDate: string, windowHours: number): Date {
  return new Date(new Date(eventDate).getTime() - windowHours * 3600 * 1000);
}

export default function CancellationCountdown({
  eventDate,
  cancellationWindowHours = 48,
  className,
}: CancellationCountdownProps) {
  const deadline = getDeadline(eventDate, cancellationWindowHours);
  const [msLeft, setMsLeft] = useState(() => deadline.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => setMsLeft(deadline.getTime() - Date.now()), 60_000);
    return () => clearInterval(id);
  }, [deadline]);

  const expired = msLeft <= 0;
  const hoursLeft = Math.floor(msLeft / 3_600_000);
  const isWarning = !expired && hoursLeft < 6;

  if (expired) {
    return (
      <div className={cn('flex items-center gap-1.5 text-xs text-muted-foreground', className)}>
        <XCircle className="w-3.5 h-3.5 text-red-500" />
        <span>Cancellation window closed</span>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center gap-1.5 text-xs',
      isWarning ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground',
      className
    )}>
      <Clock className="w-3.5 h-3.5 shrink-0" />
      <span>
        Cancel by{' '}
        <strong>
          {deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          {' '}
          {deadline.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </strong>
        {isWarning && ` · ${hoursLeft}h left`}
      </span>
    </div>
  );
}
