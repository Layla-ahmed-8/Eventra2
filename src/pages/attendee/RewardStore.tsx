import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Gift, Clock4, ShieldCheck, CheckCircle2, Star, Copy, Check, Search, Ticket, Crown, BadgeDollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';

const rewardsCatalog = [
  {
    id: 'reward-001',
    title: 'Free Event Ticket',
    description: 'Redeem 1,000 points for a free ticket to any eligible event.',
    cost: 1000,
    badge: '🎟️',
    category: 'Event',
    type: 'free-ticket',
    code: 'EVTRA-FREE-TICKET',
  },
  {
    id: 'reward-002',
    title: 'VIP Lounge Access',
    description: 'Unlock VIP event lounge access or priority seating for your next booking.',
    cost: 1800,
    badge: '✨',
    category: 'Premium',
    type: 'vip-access',
    code: 'EVTRA-VIP-2026',
  },
  {
    id: 'reward-003',
    title: 'Profile Highlight',
    description: 'Get featured in the community leaderboard and organizer network.',
    cost: 700,
    badge: '🌟',
    category: 'Community',
    type: 'profile-highlight',
  },
  {
    id: 'reward-004',
    title: 'Partner Discount Voucher',
    description: 'Redeem for a sponsored food/drink discount voucher at select events.',
    cost: 500,
    badge: '🍹',
    category: 'Partner',
    type: 'voucher',
    code: 'EVTRA-FOOD-500',
  },
];

export default function RewardStore() {
  const { currentUser, pointsBalance, rewardHistory, redeemReward } = useAppStore();
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [search, setSearch] = useState('');

  const categories = useMemo(() => ['all', ...new Set(rewardsCatalog.map((reward) => reward.category))], []);

  const filteredRewards = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rewardsCatalog.filter((reward) => {
      const categoryMatch = selectedCategory === 'all' || reward.category === selectedCategory;
      const searchMatch =
        query.length === 0 ||
        reward.title.toLowerCase().includes(query) ||
        reward.description.toLowerCase().includes(query) ||
        reward.category.toLowerCase().includes(query);
      return categoryMatch && searchMatch;
    });
  }, [search, selectedCategory]);

  const redeemableCount = filteredRewards.filter((reward) => pointsBalance >= reward.cost).length;
  const nextUnlock = [...rewardsCatalog].filter((reward) => reward.cost > pointsBalance).sort((a, b) => a.cost - b.cost)[0];
  const progressValue = nextUnlock ? Math.min(100, Math.round((pointsBalance / nextUnlock.cost) * 100)) : 100;
  const recentRewardTitle = rewardHistory[0]?.title ?? 'No redemptions yet';

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success('Code copied!');
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => toast.error('Could not copy code'));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Please log in to view rewards</h2>
          <Link to="/login" className="text-primary hover:text-primary/80">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card/95 backdrop-blur border-b border-border md:sticky md:top-0 md:z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <Link to="/app/profile" className="mt-1 flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Profile</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Reward Store</h1>
              <p className="text-sm text-muted-foreground">Redeem your engagement points for tickets, perks, and VIP upgrades.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-[#6C4CF1]/10 to-[#00C2FF]/10 px-4 py-3 text-sm font-semibold text-primary">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                {pointsBalance} points available
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{redeemableCount}</span> rewards unlocked
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
            <div className="bg-card rounded-3xl shadow-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reward Boost</p>
                  <h2 className="text-2xl font-bold text-foreground">Make your engagement count</h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Use your points to unlock free tickets, VIP access, community boosts, partner discounts, and premium features.
              </p>
            </div>

            <div className="bg-card rounded-3xl shadow-lg border border-border p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Next unlock</p>
                  <h3 className="text-lg font-bold text-foreground">{nextUnlock ? nextUnlock.title : 'All rewards unlocked'}</h3>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-primary">
                  {nextUnlock ? <Crown className="h-5 w-5" /> : <BadgeDollarSign className="h-5 w-5" />}
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>{pointsBalance} pts</span>
                  <span>{nextUnlock ? `${nextUnlock.cost} pts` : '100%'}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#6C4CF1] to-[#00C2FF]" style={{ width: `${progressValue}%` }} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {nextUnlock ? `You’re ${Math.max(0, nextUnlock.cost - pointsBalance)} points away from your next reward.` : 'You can redeem every reward in the store.'}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-3xl shadow-lg border border-border p-4 md:p-5 space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rewards"
                  className="w-full rounded-2xl border border-border bg-background pl-10 pr-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selectedCategory === category
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    {category === 'all' ? 'All' : category}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: 'Available', value: filteredRewards.length, icon: Gift },
                { label: 'Redeemable', value: redeemableCount, icon: CheckCircle2 },
                { label: 'Recent', value: recentRewardTitle, icon: Clock4 },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-secondary/30 px-4 py-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    <stat.icon className="h-3.5 w-3.5" />
                    {stat.label}
                  </div>
                  <div className="text-sm font-bold text-foreground truncate">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredRewards.map((reward) => {
              const canRedeem = pointsBalance >= reward.cost;
              const alreadyRedeemed = rewardHistory.some((entry) => entry.title === reward.title);
              return (
                <div key={reward.id} className="bg-card border border-border rounded-3xl shadow transition hover:-translate-y-0.5 hover:shadow-xl">
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="text-4xl">{reward.badge}</div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{reward.category}</span>
                        {alreadyRedeemed && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">Claimed</span>}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{reward.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{reward.description}</p>
                    {reward.code && (
                      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-secondary/60 border border-border/50">
                        <code className="flex-1 text-xs font-mono text-foreground truncate">{reward.code}</code>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(reward.id, reward.code!)}
                          className="p-1 rounded-lg hover:bg-secondary transition-colors flex-shrink-0"
                          title="Copy code"
                        >
                          {copiedId === reward.id
                            ? <Check className="w-4 h-4 text-green-500" />
                            : <Copy className="w-4 h-4 text-muted-foreground" />}
                        </button>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-foreground">{reward.cost} pts</span>
                      <button
                        onClick={() => {
                          if (!canRedeem) return;
                          redeemReward(reward.id);
                          setSelectedReward(reward.id);
                          toast.success(`${reward.title} redeemed! −${reward.cost} pts`);
                        }}
                        className={`px-4 py-3 rounded-2xl font-semibold transition ${
                          canRedeem
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'border border-border text-muted-foreground cursor-not-allowed'
                        }`}
                        disabled={!canRedeem}
                      >
                        {canRedeem ? 'Redeem' : 'Locked'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="bg-card border border-border rounded-3xl shadow-lg p-6 md:sticky md:top-24">
            <div className="flex items-center gap-3 mb-4">
              <Gift className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-bold text-foreground">How rewards work</h2>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <Clock4 className="w-4 h-4 mt-1 text-primary" />
                Earn points for attendance, community participation, event shares, and milestone streaks.
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 mt-1 text-primary" />
                Rewards are gated by quality: helpful engagement and verified attendance perform better.
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 mt-1 text-primary" />
                Use points instantly or save them for seasonal VIP unlocks and partner benefits.
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-3xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-3">Recent redemptions</h3>
            {rewardHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground">No redemptions yet. Use your points above!</p>
            ) : (
              <div className="space-y-3 text-sm text-muted-foreground">
                {rewardHistory.slice(0, 5).map((entry, i) => (
                  <div key={i} className="rounded-2xl bg-secondary p-4">
                    <p className="font-semibold text-foreground">{entry.title}</p>
                    <p>{new Date(entry.redeemedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {selectedReward && (
        <div className="fixed bottom-6 right-6 rounded-3xl border border-border bg-card p-4 shadow-xl w-[min(380px,calc(100%-2rem))]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Reward claimed</p>
              <p className="font-semibold text-foreground">{rewardsCatalog.find((item) => item.id === selectedReward)?.title}</p>
            </div>
            <button onClick={() => setSelectedReward(null)} className="px-3 py-2 rounded-2xl border border-border text-sm text-muted-foreground">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
