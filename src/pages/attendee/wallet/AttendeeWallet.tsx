import { Link } from 'react-router-dom';
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight, CreditCard, History, TrendingUp, ArrowRight } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';

const typeConfig: Record<string, { label: string; color: string; sign: string }> = {
  deposit:    { label: 'Deposit',    color: 'text-green-500',  sign: '+' },
  withdrawal: { label: 'Withdrawal', color: 'text-red-500',    sign: '-' },
  payment:    { label: 'Payment',    color: 'text-red-500',    sign: '-' },
  refund:     { label: 'Refund',     color: 'text-green-500',  sign: '+' },
  payout:     { label: 'Payout',     color: 'text-red-500',    sign: '-' },
  fee:        { label: 'Fee',        color: 'text-orange-500', sign: '-' },
  earning:    { label: 'Earning',    color: 'text-green-500',  sign: '+' },
};

export default function AttendeeWallet() {
  const { getWallet, walletTransactions, currentUser } = useAppStore();
  const wallet = getWallet();
  const recentTx = walletTransactions
    .filter((t) => t.userId === currentUser?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-h1 text-foreground">My Wallet</h1>
        <p className="text-body text-muted-foreground mt-1">Manage your balance, deposits, and withdrawals.</p>
      </div>

      {/* Balance Hero */}
      <div className="hero-surface p-5 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-primary/10 to-transparent pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-body-sm font-bold mb-3">
              <Wallet className="w-4 h-4 text-primary" />
              <span>Available Balance</span>
            </div>
            <p className="text-display font-black text-foreground">
              <span className="text-h3 font-bold text-muted-foreground mr-2">EGP</span>
              {(wallet?.balance ?? 0).toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-caption text-muted-foreground mt-2 font-bold uppercase tracking-widest">
              {wallet?.status === 'active' ? '● Active' : '○ Inactive'}
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-background/40 rounded-2xl border border-white/10">
            <TrendingUp className="w-5 h-5 text-primary m-3" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/app/wallet/deposit" className="kpi-card group flex flex-col items-center gap-3 p-6 hover:border-primary/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
            <Plus className="w-6 h-6 text-green-500" />
          </div>
          <span className="text-body-sm font-bold text-foreground">Add Funds</span>
        </Link>

        <Link to="/app/wallet/withdraw" className="kpi-card group flex flex-col items-center gap-3 p-6 hover:border-primary/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
            <ArrowUpRight className="w-6 h-6 text-red-500" />
          </div>
          <span className="text-body-sm font-bold text-foreground">Withdraw</span>
        </Link>

        <Link to="/app/wallet/transactions" className="kpi-card group flex flex-col items-center gap-3 p-6 hover:border-primary/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
            <History className="w-6 h-6 text-blue-500" />
          </div>
          <span className="text-body-sm font-bold text-foreground">History</span>
        </Link>

        <Link to="/app/wallet/methods" className="kpi-card group flex flex-col items-center gap-3 p-6 hover:border-primary/40 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
            <CreditCard className="w-6 h-6 text-purple-500" />
          </div>
          <span className="text-body-sm font-bold text-foreground">Payment Methods</span>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="surface-panel">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h3 text-foreground">Recent Transactions</h2>
          <Link to="/app/wallet/transactions" className="flex items-center gap-1 text-primary text-body-sm font-bold hover:underline">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentTx.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-body font-bold">No transactions yet</p>
            <p className="text-body-sm mt-1">Add funds to get started.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {recentTx.map((tx) => {
              const cfg = typeConfig[tx.type] ?? { label: tx.type, color: 'text-foreground', sign: '' };
              const isCredit = tx.amount > 0;
              return (
                <div key={tx.id} className="activity-item flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isCredit ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                      {isCredit
                        ? <ArrowDownLeft className="w-5 h-5 text-green-500" />
                        : <ArrowUpRight className="w-5 h-5 text-red-500" />
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
