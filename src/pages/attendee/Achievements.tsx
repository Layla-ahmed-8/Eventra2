import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Trophy, Star, Lock, Sparkles, Flame, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { BADGE_DEFINITIONS } from '../../constants/badges';
import XPProgressBar from '../../components/shared/XPProgressBar';

export default function Achievements() {
  const { currentUser, xp, level, earnedBadges, currentStreak, longestStreak } = useAppStore();

  if (!currentUser) {
    return <div>Not logged in</div>;
  }

  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.id));
  const earnedList = BADGE_DEFINITIONS.filter((b) => earnedBadgeIds.has(b.id));
  const lockedList = BADGE_DEFINITIONS.filter((b) => !earnedBadgeIds.has(b.id));
  const badgeTiers = {
    bronze: earnedList.filter((badge) => badge.tier === 'bronze').length,
    silver: earnedList.filter((badge) => badge.tier === 'silver').length,
    gold: earnedList.filter((badge) => badge.tier === 'gold').length,
    platinum: earnedList.filter((badge) => badge.tier === 'platinum').length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-card/95 backdrop-blur border-b border-border md:sticky md:top-0 md:z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Link to="/app/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground leading-none">Achievements</h1>
            <p className="text-sm text-muted-foreground mt-1">Progress, badges, and reward path in one place.</p>
          </div>
          <Link
            to="/app/rewards/store"
            className="inline-flex items-center gap-2 rounded-2xl border border-border px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10 transition"
          >
            <Sparkles className="w-4 h-4" />
            Visit Reward Store
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-5 md:space-y-6">
        <div className="grid gap-3 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="bg-gradient-to-br from-primary to-[#00C2FF] rounded-3xl shadow-lg p-4 sm:p-5 text-white">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white/80 text-caption uppercase tracking-[0.2em] mb-1">Current level</p>
                <h2 className="text-3xl sm:text-[2.15rem] font-bold leading-none">Level {level}</h2>
                <p className="text-white/90 text-body-sm mt-1.5">
                  {xp.toLocaleString()} XP · {earnedList.length} badges earned
                </p>
                <div className="mt-3">
                  <XPProgressBar
                    xp={xp}
                    level={level}
                    showNumbers={false}
                    className="[&_.h-2]:bg-white/20 [&_.bg-gradient-to-r]:from-white/70 [&_.bg-gradient-to-r]:to-white/50"
                  />
                </div>
                <p className="text-caption text-white/80 mt-2">Progress towards Level {level + 1}</p>
              </div>
            </div>
          </div>

          <div className="surface-panel p-3.5 sm:p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-caption text-muted-foreground uppercase tracking-[0.2em]">Quick stats</p>
                <h3 className="text-body font-bold text-foreground">Compact overview</h3>
              </div>
              <div className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                {lockedList.length} locked
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl border border-border bg-background p-2.5 text-center">
                <Award className="w-4.5 h-4.5 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground leading-none">{earnedList.length}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">Badges</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-2.5 text-center">
                <Star className="w-4.5 h-4.5 text-orange-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground leading-none">{xp.toLocaleString()}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">XP</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-2.5 text-center">
                <Flame className="w-4.5 h-4.5 text-red-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground leading-none">{currentStreak}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">Streak</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-2.5 text-center">
                <Trophy className="w-4.5 h-4.5 text-cyan-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground leading-none">{level}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">Level</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-1.5 text-center">
              {([
                ['B', badgeTiers.bronze],
                ['S', badgeTiers.silver],
                ['G', badgeTiers.gold],
                ['P', badgeTiers.platinum],
              ] as const).map(([label, count]) => (
                <div key={label} className="rounded-xl border border-border bg-secondary/40 py-2">
                  <p className="text-xs font-black text-muted-foreground">{label}</p>
                  <p className="text-sm font-bold text-foreground">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {(currentStreak > 0 || longestStreak > 0) && (
          <div className="bento-section p-3.5 sm:p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="bento-title-wrapper">
                <Flame className="w-4 h-4 text-red-500" />
                <h2 className="bento-title">Activity Streak</h2>
              </div>
              <p className="text-caption text-muted-foreground">Stay active to keep momentum.</p>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="rounded-2xl bg-orange-500/10 border border-orange-500/20 px-3 py-2.5 text-center">
                <p className="text-2xl font-bold text-orange-500 leading-none">{currentStreak}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">Current streak</p>
              </div>
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 px-3 py-2.5 text-center">
                <p className="text-2xl font-bold text-red-500 leading-none">{longestStreak}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">Best streak</p>
              </div>
            </div>
            {currentStreak > 0 && (
              <p className="mt-3 text-center text-caption text-muted-foreground">
                <Zap className="w-3.5 h-3.5 inline mr-1 text-yellow-500" />
                Log in tomorrow to maintain your streak.
              </p>
            )}
          </div>
        )}

        <div className="bento-section p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="bento-title-wrapper">
              <Star className="w-4 h-4 text-orange-500" />
              <h2 className="bento-title">XP Progress</h2>
            </div>
            <p className="text-caption text-muted-foreground">Next level progress</p>
          </div>
          <XPProgressBar xp={xp} level={level} showNumbers />
        </div>

        {/* Earned Badges */}
        {earnedList.length > 0 && (
          <div className="mb-8">
            <h2 className="text-h2 font-bold text-foreground mb-4">Earned Badges</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {earnedList.map((badge) => (
                <div key={badge.id} className="surface-panel p-3.5 text-center hover:-translate-y-1 transition-transform">
                  <div className="text-3xl mb-1.5">{badge.icon}</div>
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-2"
                    style={{
                      background: badge.tier === 'platinum' ? 'linear-gradient(135deg,#e5e5ea,#9b9ba4)' :
                        badge.tier === 'gold' ? '#fef3c7' :
                        badge.tier === 'silver' ? '#f1f5f9' : '#fde8cc',
                      color: badge.tier === 'platinum' ? '#4b5563' :
                        badge.tier === 'gold' ? '#92400e' :
                        badge.tier === 'silver' ? '#475569' : '#92400e',
                    }}
                  >
                    {badge.tier}
                  </span>
                  <h3 className="text-body-sm font-bold text-foreground mb-1 leading-tight">{badge.name}</h3>
                  <p className="text-caption text-muted-foreground mb-3 line-clamp-2">{badge.description}</p>
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-caption font-semibold">
                    <Star className="w-3 h-3" />
                    +{badge.xpBonus} XP
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        <div>
          <h2 className="text-h2 font-bold text-foreground mb-4">
            Locked Badges
            <span className="ml-2 text-caption font-normal text-muted-foreground">({lockedList.length} remaining)</span>
          </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {lockedList.map((badge) => (
              <div key={badge.id} className="surface-panel p-3.5 text-center opacity-55">
                <div className="text-3xl mb-1.5 grayscale">{badge.icon}</div>
                <h3 className="text-body-sm font-bold text-foreground mb-1 leading-tight">{badge.name}</h3>
                <p className="text-caption text-muted-foreground mb-3 line-clamp-2">{badge.description}</p>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground rounded-full text-caption font-semibold">
                  <Lock className="w-3 h-3" />
                  +{badge.xpBonus} XP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
