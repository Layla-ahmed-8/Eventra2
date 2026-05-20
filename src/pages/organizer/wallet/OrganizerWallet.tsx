import { Link } from 'react-router-dom';
import { Wallet, ArrowRight, ArrowDownLeft, ArrowUpRight, TrendingUp, DollarSign, Banknote } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

const typeConfig: Record<string, { label: string; color: string }> = {
  earning:    { label: 'Earning',    color: 'text-green-500' },
  fee:        { label: 'Platform Fee', color: 'text-orange-500' },
  payout:     { label: 'Payout',     color: 'text-cyan-500' },
  deposit:    { label: 'Deposit',    color: 'text-green-500' },
  withdrawal: { label: 'Withdrawal', color: 'text-red-500' },
  payment:    { label: 'Payment',    color: 'text-red-500' },
  refund:     { label: 'Refund',     color: 'text-green-500' },
};

export default function OrganizerWallet() {
  const { getWallet, walletTransactions, currentUser, payoutRequests } = useAppStore();
  const wallet = getWallet();
  const myTx = walletTransactions
    .filter((t) => t.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalEarned = myTx.filter((t) => t.type === 'earning').reduce((s, t) => s + t.amount, 0);
  const totalFees   = myTx.filter((t) => t.type === 'fee').reduce((s, t) => s + Math.abs(t.amount), 0);
  const pendingPayouts = payoutRequests.filter((r) => r.organizerId === currentUser?.id && r.status === 'pending');
  const recentTx = myTx.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h1 text-foreground">Organizer Wallet</h1>
        <p className="text-body text-muted-foreground mt-1">Track your earnings, fees, and payouts.</p>
      </div>

      {/* Balance Hero */}
      <div className="hero-surface p-5 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-cyan-400/10 to-transparent pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-body-sm font-bold mb-3">
              <Wallet className="w-4 h-4 text-cyan-500" />
              <span>Available Balance</span>
            </div>
            <p className="text-display font-black text-foreground">
              <span className="text-h3 font-bold text-muted-foreground mr-2">EGP</span>
              {(wallet?.balance ?? 0).toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            {pendingPayouts.length > 0 && (
              <p className="text-caption text-cyan-500 font-bold mt-2">
                {pendingPayouts.length} payout request{pendingPayouts.length > 1 ? 's' : ''} pending review
              </p>
            )}
          </div>
          <Link to="/organizer/wallet/withdraw" className="btn-primary flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 shadow-cyan-500/25">
            <Banknote className="w-5 h-5" />
            Request Payout
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">Total Earned</span>
          </div>
          <p className="text-h2 font-black text-foreground">EGP {totalEarned.toLocaleString()}</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">Platform Fees</span>
          </div>
          <p className="text-h2 font-black text-foreground">EGP {totalFees.toLocaleString()}</p>
        </div>
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-5 h-5 text-cyan-500" />
            <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">Available</span>
          </div>
          <p className="text-h2 font-black text-foreground">EGP {(wallet?.balance ?? 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="surface-panel">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h3 text-foreground">Recent Activity</h2>
          <Link to="/organizer/wallet/transactions" className="flex items-center gap-1 text-cyan-500 text-body-sm font-bold hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentTx.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-body font-bold">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {recentTx.map((tx) => {
              const cfg = typeConfig[tx.type] ?? { label: tx.type, color: 'text-foreground' };
              const isCredit = tx.amount > 0;
              return (
                <div key={tx.id} className="activity-item flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isCredit ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                      {isCredit
                        ? <ArrowDownLeft className="w-5 h-5 text-green-500" />
                        : <ArrowUpRight className="w-5 h-5 text-orange-500" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-body-sm font-bold text-foreground truncate">{tx.description}</p>
                      <p className="text-caption text-muted-foreground">
                        {cfg.label} · {new Date(tx.createdAt).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-body-sm font-black ${cfg.color}`}>
                      {isCredit ? '+' : ''}EGP {Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      Bal: {tx.balanceAfter.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
