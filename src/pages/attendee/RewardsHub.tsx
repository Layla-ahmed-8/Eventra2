import { useMemo, useState } from 'react';
import { Star, Flame, Zap, Lock, Trophy, Award, Copy, Check, Search, Gift, Clock4, ShieldCheck, CheckCircle2, Crown, BadgeDollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import { BADGE_DEFINITIONS } from '../../constants/badges';
import XPProgressBar from '../../components/shared/XPProgressBar';

const rewardsCatalog = [
  { id: 'reward-001', title: 'Free Event Ticket', description: 'Redeem 1,000 points for a free ticket to any eligible event.', cost: 1000, badge: '🎟️', category: 'Event', code: 'EVTRA-FREE-TICKET' },
  { id: 'reward-002', title: 'VIP Lounge Access', description: 'Unlock VIP event lounge access or priority seating for your next booking.', cost: 1800, badge: '✨', category: 'Premium', code: 'EVTRA-VIP-2026' },
  { id: 'reward-003', title: 'Profile Highlight', description: 'Get featured in the community leaderboard and organizer network.', cost: 700, badge: '🌟', category: 'Community' },
  { id: 'reward-004', title: 'Partner Discount Voucher', description: 'Redeem for a sponsored food/drink discount voucher at select events.', cost: 500, badge: '🍹', category: 'Partner', code: 'EVTRA-FOOD-500' },
];

export default function RewardsHub() {
  const { currentUser, xp, level, earnedBadges, currentStreak, longestStreak, pointsBalance, rewardHistory, redeemReward } = useAppStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.id));
  const earnedList = BADGE_DEFINITIONS.filter((b) => earnedBadgeIds.has(b.id));
  const lockedList = BADGE_DEFINITIONS.filter((b) => !earnedBadgeIds.has(b.id));

  const badgeTiers = {
    bronze: earnedList.filter((b) => b.tier === 'bronze').length,
    silver: earnedList.filter((b) => b.tier === 'silver').length,
    gold: earnedList.filter((b) => b.tier === 'gold').length,
    platinum: earnedList.filter((b) => b.tier === 'platinum').length,
  };

  const categories = useMemo(() => ['all', ...new Set(rewardsCatalog.map((r) => r.category))], []);

  const filteredRewards = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rewardsCatalog.filter((r) => {
      const catMatch = selectedCategory === 'all' || r.category === selectedCategory;
      const searchMatch = q.length === 0 || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [search, selectedCategory]);

  const nextUnlock = [...rewardsCatalog].filter((r) => r.cost > pointsBalance).sort((a, b) => a.cost - b.cost)[0];
  const progressValue = nextUnlock ? Math.min(100, Math.round((pointsBalance / nextUnlock.cost) * 100)) : 100;

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Code copied!');
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => toast.error('Could not copy code'));
  };

  if (!currentUser) return <div className="p-8 text-center text-muted-foreground">Not logged in.</div>;

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-h1 font-bold text-foreground">Rewards Hub</h1>
        <p className="text-body-sm text-muted-foreground mt-1">Your progress, badges, and reward store — all in one place.</p>
      </div>

      {/* Hero: Level + Streak */}
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Level hero */}
        <div className="bg-gradient-to-br from-primary to-[#00C2FF] rounded-3xl shadow-lg p-5 text-white">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/80 text-caption uppercase tracking-[0.2em] mb-1">Current level</p>
              <h2 className="text-4xl font-bold leading-none">Level {level}</h2>
              <p className="text-white/90 text-body-sm mt-1.5">{xp.toLocaleString()} XP · {earnedList.length} badges earned</p>
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

        {/* Quick stats */}
        <div className="surface-panel p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-caption text-muted-foreground uppercase tracking-[0.2em]">Quick stats</p>
              <h3 className="text-body font-bold text-foreground">Overview</h3>
            </div>
            <div className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
              {lockedList.length} locked
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { icon: Award, color: 'text-primary', value: earnedList.length, label: 'Badges' },
              { icon: Star, color: 'text-orange-500', value: xp.toLocaleString(), label: 'XP' },
              { icon: Flame, color: 'text-red-500', value: currentStreak, label: 'Streak' },
              { icon: Trophy, color: 'text-cyan-500', value: level, label: 'Level' },
            ].map(({ icon: Icon, color, value, label }) => (
              <div key={label} className="rounded-2xl border border-border bg-background p-2.5 text-center">
                <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                <p className="text-lg font-bold text-foreground leading-none">{value}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1.5 text-center">
            {([['B', badgeTiers.bronze], ['S', badgeTiers.silver], ['G', badgeTiers.gold], ['P', badgeTiers.platinum]] as const).map(([lbl, count]) => (
              <div key={lbl} className="rounded-xl border border-border bg-secondary/40 py-2">
                <p className="text-xs font-black text-muted-foreground">{lbl}</p>
                <p className="text-sm font-bold text-foreground">{count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* XP Progress + Streak */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bento-section p-4">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="bento-title-wrapper">
              <Star className="w-4 h-4 text-orange-500" />
              <h2 className="bento-title">XP Progress</h2>
            </div>
            <p className="text-caption text-muted-foreground">Next level</p>
          </div>
          <XPProgressBar xp={xp} level={level} showNumbers />
        </div>

        {(currentStreak > 0 || longestStreak > 0) && (
          <div className="bento-section p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="bento-title-wrapper">
                <Flame className="w-4 h-4 text-red-500" />
                <h2 className="bento-title">Activity Streak</h2>
              </div>
            </div>
            <div className="grid gap-2.5 grid-cols-2">
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
      </div>

      {/* Main grid: Badges (left) + Store (right) */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ── Badges column ── */}
        <div className="space-y-6">
          {/* Earned badges */}
          {earnedList.length > 0 && (
            <div>
              <h2 className="text-h2 font-bold text-foreground mb-4">Earned Badges</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {earnedList.map((badge) => (
                  <div key={badge.id} className="surface-panel p-3.5 text-center hover:-translate-y-1 transition-transform">
                    <div className="text-3xl mb-1.5">{badge.icon}</div>
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-2"
                      style={{
                        background: badge.tier === 'platinum' ? 'linear-gradient(135deg,#e5e5ea,#9b9ba4)' : badge.tier === 'gold' ? '#fef3c7' : badge.tier === 'silver' ? '#f1f5f9' : '#fde8cc',
                        color: badge.tier === 'platinum' ? '#4b5563' : badge.tier === 'gold' ? '#92400e' : badge.tier === 'silver' ? '#475569' : '#92400e',
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

          {/* Locked badges */}
          <div>
            <h2 className="text-h2 font-bold text-foreground mb-4">
              Locked Badges
              <span className="ml-2 text-caption font-normal text-muted-foreground">({lockedList.length} remaining)</span>
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
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

        {/* ── Store column ── */}
        <div className="space-y-5">
          {/* Points balance + progress */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-card rounded-3xl shadow border border-border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-caption text-muted-foreground">Points balance</p>
                  <p className="text-h2 font-bold text-foreground">{pointsBalance}</p>
                </div>
              </div>
              <p className="text-caption text-muted-foreground">Earn points through RSVPs, reviews, discussions, and streaks.</p>
            </div>

            <div className="bg-card rounded-3xl shadow border border-border p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-caption text-muted-foreground">Next unlock</p>
                  <h3 className="text-body-sm font-bold text-foreground">{nextUnlock ? nextUnlock.title : 'All unlocked!'}</h3>
                </div>
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                  {nextUnlock ? <Crown className="h-5 w-5" /> : <BadgeDollarSign className="h-5 w-5" />}
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>{pointsBalance} pts</span>
                  <span>{nextUnlock ? `${nextUnlock.cost} pts` : '100%'}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#6C4CF1] to-[#00C2FF]" style={{ width: `${progressValue}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Search + filter */}
          <div className="bg-card rounded-3xl shadow border border-border p-4 space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rewards"
                className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${selectedCategory === cat ? 'border-primary bg-primary text-white' : 'border-border text-muted-foreground hover:bg-secondary'}`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Reward catalog */}
          <div className="space-y-3">
            {filteredRewards.map((reward) => {
              const canRedeem = pointsBalance >= reward.cost;
              const alreadyRedeemed = rewardHistory.some((e) => e.title === reward.title);
              return (
                <div key={reward.id} className="bg-card border border-border rounded-3xl shadow transition hover:-translate-y-0.5">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{reward.badge}</span>
                        <div>
                          <h3 className="text-body-sm font-bold text-foreground">{reward.title}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{reward.category}</span>
                        </div>
                      </div>
                      {alreadyRedeemed && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary flex-shrink-0">Claimed</span>}
                    </div>
                    <p className="text-caption text-muted-foreground mb-3">{reward.description}</p>
                    {reward.code && (
                      <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-secondary/60 border border-border/50">
                        <code className="flex-1 text-xs font-mono text-foreground truncate">{reward.code}</code>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(reward.id, reward.code!)}
                          className="p-1 rounded-lg hover:bg-secondary transition-colors flex-shrink-0"
                        >
                          {copiedId === reward.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                        </button>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-body-sm font-semibold text-foreground">{reward.cost} pts</span>
                      <button
                        onClick={() => {
                          if (!canRedeem) return;
                          redeemReward(reward.id);
                          toast.success(`${reward.title} redeemed! −${reward.cost} pts`);
                        }}
                        disabled={!canRedeem}
                        className={`px-4 py-2 rounded-2xl text-body-sm font-semibold transition ${canRedeem ? 'bg-primary text-white hover:bg-primary/90' : 'border border-border text-muted-foreground cursor-not-allowed'}`}
                      >
                        {canRedeem ? 'Redeem' : 'Locked'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* How rewards work */}
          <div className="bg-card border border-border rounded-3xl shadow p-5">
            <div className="flex items-center gap-3 mb-4">
              <Gift className="w-5 h-5 text-primary" />
              <h3 className="text-body-sm font-bold text-foreground">How rewards work</h3>
            </div>
            <ul className="space-y-3 text-caption text-muted-foreground">
              <li className="flex items-start gap-3">
                <Clock4 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                Earn points for attendance, community participation, event shares, and milestone streaks.
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                Rewards are gated by quality: helpful engagement and verified attendance perform better.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                Use points instantly or save them for seasonal VIP unlocks and partner benefits.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Redemption history */}
      <div className="bg-card border border-border rounded-3xl shadow p-6">
        <h3 className="text-h3 font-bold text-foreground mb-4">Redemption History</h3>
        {rewardHistory.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">No redemptions yet. Use your points above!</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {rewardHistory.slice(0, 6).map((entry, i) => (
              <div key={i} className="rounded-2xl bg-secondary p-4">
                <p className="text-body-sm font-semibold text-foreground">{entry.title}</p>
                <p className="text-caption text-muted-foreground mt-1">{new Date(entry.redeemedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
