import { cn } from '../../app/components/ui/utils';

interface AIScoreIndicatorProps {
  score: number;
  type: 'risk' | 'confidence' | 'match';
  showLabel?: boolean;
  className?: string;
}

function getColor(score: number, type: 'risk' | 'confidence' | 'match') {
  if (type === 'risk') {
    if (score >= 70) return 'bg-red-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-green-500';
  }
  if (score >= 70) return 'bg-green-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

function getTextColor(score: number, type: 'risk' | 'confidence' | 'match') {
  if (type === 'risk') {
    if (score >= 70) return 'text-red-600 dark:text-red-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-green-600 dark:text-green-400';
  }
  if (score >= 70) return 'text-green-600 dark:text-green-400';
  if (score >= 40) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

const LABEL_MAP = {
  risk: 'Risk Score',
  confidence: 'Confidence',
  match: 'Match Score',
};

export default function AIScoreIndicator({ score, type, showLabel = true, className }: AIScoreIndicatorProps) {
  const clampedScore = Math.min(100, Math.max(0, score));
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground font-medium">{LABEL_MAP[type]}</span>
          <span className={cn('text-xs font-bold', getTextColor(clampedScore, type))}>
            {clampedScore}%
          </span>
        </div>
      )}
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', getColor(clampedScore, type))}
          style={{ width: `${clampedScore}%` }}
        />
      </div>
    </div>
  );
}
