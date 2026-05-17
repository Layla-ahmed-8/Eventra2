import { cn } from '../../app/components/ui/utils';
import { getXPForLevel } from '../../store/useAppStore';

interface XPProgressBarProps {
  xp: number;
  level: number;
  showNumbers?: boolean;
  className?: string;
}

export default function XPProgressBar({ xp, level, showNumbers = true, className }: XPProgressBarProps) {
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const progress = nextLevelXP > currentLevelXP
    ? Math.min(100, ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100)
    : 100;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {showNumbers && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Level {level}</span>
          <span>{xp.toLocaleString()} / {nextLevelXP.toLocaleString()} XP</span>
        </div>
      )}
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      {showNumbers && (
        <p className="text-xs text-muted-foreground text-right">
          {Math.round(nextLevelXP - xp)} XP to Level {level + 1}
        </p>
      )}
    </div>
  );
}
