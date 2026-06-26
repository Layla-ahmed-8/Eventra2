import { useMemo, useState } from 'react';
import { Star, Flame, Zap, Trophy, Award, Copy, Check, Search, Gift, Clock4, ShieldCheck, CheckCircle2 } from 'lucide-react';
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

  const categories = useMemo(() => ['all', ...new Set(rewardsCatalog.map((r) => r.category))], []);

  const filteredRewards = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rewardsCatalog.filter((reward) => {
      const categoryMatch = selectedCategory === 'all' || reward.category === selectedCategory;
      const textMatch = query.length === 0 || reward.title.toLowerCase().includes(query) || reward.description.toLowerCase().includes(query);
      return categoryMatch && textMatch;
    });
  }, [search, selectedCategory]);

  const nextUnlock = [...rewardsCatalog].filter((reward) => reward.cost > pointsBalance).sort((a, b) => a.cost - b.cost)[0];
  const progressValue = nextUnlock ? Math.min(100, Math.round((pointsBalance / nextUnlock.cost) * 100)) : 100;

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Code copied!');
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => toast.error('Could not copy code'));
  };

  if (!currentUser) {
    return <div className="p-8 text-center text-muted-foreground">Not logged in.</div>;
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-border bg-card p-7 shadow-xl">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Rewards Hub</p>
            <h1 className="mt-3 text-4xl font-bold text-foreground">Unlock perks with every activity.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">Spend points on event tickets, partner offers, premium access, and exclusive community rewards.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[28px] bg-gradient-to-br from-primary to-cyan-500 p-5 text-white shadow-lg">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/80">Points available</p>
              <p className="mt-3 text-3xl font-semibold">{pointsBalance}</p>
            </div>
            <div className="rounded-[28px] border border-border bg-background p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Badges earned</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{earnedList.length}</p>
            </div>
            <div className="rounded-[28px] border border-border bg-background p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Rewards claimed</p>
              <p className="mt-3 text-3xl font-semibold text-foreground">{rewardHistory.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-[32px] border border-border bg-card p-6 shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Points progress</p>
              <h2 className="mt-2 text-3xl font-bold text-foreground">Next reward in reach</h2>
              <p className="mt-3 text-sm text-muted-foreground">Continue earning points to claim premium perks and partner coupons.</p>
            </div>
            <div className="rounded-[28px] border border-border bg-background p-5 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Next target</p>
              <p className="mt-3 text-xl font-semibold text-foreground">{nextUnlock?.title ?? 'All rewards unlocked'}</p>
              <p className="mt-2 text-sm text-muted-foreground">{nextUnlock ? `${Math.max(0, nextUnlock.cost - pointsBalance)} points away` : 'You can claim everything now.'}</p>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-border bg-background p-5">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <span>{pointsBalance} pts</span>
              <span>{nextUnlock ? `${nextUnlock.cost} pts` : 'Done'}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" style={{ width: `${progressValue}%` }} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] border border-border bg-background p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Current level</p>
              <p className="mt-3 text-2xl font-semibold text-foreground">{level}</p>
              <p className="mt-2 text-sm text-muted-foreground">Keep building XP to unlock more rewards.</p>
            </div>
            <div className="rounded-[28px] border border-border bg-background p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Current streak</p>
              <p className="mt-3 text-2xl font-semibold text-foreground">{currentStreak}</p>
              <p className="mt-2 text-sm text-muted-foreground">Maintain activity to stay ahead.</p>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Recent claims</p>
                <h3 className="mt-2 text-h3 font-bold text-foreground">Activity feed</h3>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{rewardHistory.length} total</span>
            </div>

            {rewardHistory.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-secondary/60 p-5 text-center">
                <p className="text-body-sm text-muted-foreground">No claims yet. Redeem a reward to populate your feed.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rewardHistory.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="rounded-3xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{entry.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(entry.redeemedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Redeemed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[32px] border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Gift className="w-5 h-5 text-primary" />
              <h3 className="text-h3 font-bold text-foreground">Rewards guidance</h3>
            </div>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <Clock4 className="mt-1 h-4 w-4 text-primary flex-shrink-0" />
                Earn points by RSVPing, attending, and engaging with your community.
              </li>
              <li className="flex gap-3">
                <ShieldCheck className="mt-1 h-4 w-4 text-primary flex-shrink-0" />
                Save points for premium rewards or redeem instantly for partner offers.
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 text-primary flex-shrink-0" />
                Use offer codes immediately or save them for your next event purchase.
              </li>
            </ul>
          </div>
        </aside>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Reward store</p>
            <h2 className="mt-2 text-h2 font-bold text-foreground">Available perks</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${selectedCategory === cat ? 'bg-primary text-white' : 'border border-border text-muted-foreground hover:bg-secondary'}`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {filteredRewards.map((reward) => {
            const alreadyRedeemed = rewardHistory.some((entry) => entry.id === reward.id);
            const canRedeem = pointsBalance >= reward.cost && !alreadyRedeemed;

            return (
              <div key={reward.id} className="overflow-hidden rounded-[28px] border border-border bg-card shadow-xl transition-transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-cyan-500 text-2xl shadow-lg">
                        {reward.badge}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{reward.category}</p>
                        <h3 className="mt-2 text-xl font-bold text-foreground">{reward.title}</h3>
                      </div>
                    </div>
                    {alreadyRedeemed ? (
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">Claimed</span>
                    ) : (
                      <span className="rounded-full bg-secondary/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{reward.cost} pts</span>
                    )}
                  </div>

                  <p className="mt-4 text-body-sm text-muted-foreground leading-relaxed">{reward.description}</p>

                  {reward.code && (
                    <div className="mt-4 flex items-center gap-3 rounded-3xl border border-border bg-background px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-lg text-primary">#{reward.code.slice(-3)}</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Offer code</p>
                        <p className="text-sm font-semibold text-foreground truncate">{reward.code}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(reward.id, reward.code!)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-secondary hover:bg-secondary/80 transition"
                      >
                        {copiedId === reward.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                      </button>
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-semibold text-foreground">
                      {alreadyRedeemed ? 'Already claimed' : canRedeem ? 'Ready to claim' : 'Needs more points'}
                    </div>
                    <button
                      onClick={() => {
                        if (!canRedeem) return;
                        redeemReward(reward.id);
                        toast.success(`${reward.title} redeemed! −${reward.cost} pts`);
                      }}
                      disabled={!canRedeem}
                      className={`rounded-3xl px-5 py-3 text-sm font-semibold transition ${canRedeem ? 'bg-primary text-white hover:bg-primary/90' : 'border border-border bg-background text-muted-foreground cursor-not-allowed'}`}
                    >
                      {alreadyRedeemed ? 'Claimed' : canRedeem ? 'Redeem now' : 'Locked'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
