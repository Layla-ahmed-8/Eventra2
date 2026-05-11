import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Gift, Clock4, ShieldCheck, CheckCircle2, Star, ShieldAlert } from 'lucide-react';
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
  },
  {
    id: 'reward-002',
    title: 'VIP Lounge Access',
    description: 'Unlock VIP event lounge access or priority seating for your next booking.',
    cost: 1800,
    badge: '✨',
    category: 'Premium',
    type: 'vip-access',
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
  },
];

export default function RewardStore() {
  const { currentUser, pointsBalance, redeemReward } = useAppStore();
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

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
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link to="/app/profile" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Profile</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Reward Store</h1>
              <p className="text-sm text-muted-foreground">Redeem your engagement points for exclusive benefits.</p>
            </div>
          </div>
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-[#6C4CF1]/10 to-[#00C2FF]/10 px-4 py-3 text-sm font-semibold text-primary">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              {pointsBalance} points available
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-6">
          <div className="bg-card rounded-3xl shadow-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reward Boost</p>
                <h2 className="text-2xl font-bold text-foreground">Make your engagement count</h2>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your Activity Score powers an intelligent reward pipeline. Use your points to unlock free tickets, VIP access, community boosts, partner discounts, and premium features.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {rewardsCatalog.map((reward) => {
              const canRedeem = pointsBalance >= reward.cost;
              return (
                <div key={reward.id} className="bg-card border border-border rounded-3xl shadow transition hover:shadow-xl">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl">{reward.badge}</div>
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{reward.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{reward.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{reward.description}</p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-foreground">{reward.cost} pts</span>
                      <button
                        onClick={() => {
                          setSelectedReward(reward.id);
                          if (canRedeem) redeemReward(reward.id);
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
          <div className="bg-card border border-border rounded-3xl shadow-lg p-6">
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
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-2xl bg-secondary p-4">
                <p className="font-semibold text-foreground">Early Bird competitive badge</p>
                <p>Earned 500 points toward bonus rewards.</p>
              </div>
              <div className="rounded-2xl bg-secondary p-4">
                <p className="font-semibold text-foreground">Community leader boost</p>
                <p>Saved 200 points for exclusive event seating.</p>
              </div>
            </div>
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
