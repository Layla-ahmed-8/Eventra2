import { useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Wallet } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import type { WalletTransactionType } from '../../../types';

const TYPE_FILTERS: { label: string; value: WalletTransactionType | 'all' }[] = [
  { label: 'All',      value: 'all' },
  { label: 'Earnings', value: 'earning' },
  { label: 'Fees',     value: 'fee' },
  { label: 'Payouts',  value: 'payout' },
];

const typeConfig: Record<string, { label: string; color: string }> = {
  earning:    { label: 'Earning',      color: 'text-green-500' },
  fee:        { label: 'Platform Fee', color: 'text-orange-500' },
  payout:     { label: 'Payout',       color: 'text-cyan-500' },
  deposit:    { label: 'Deposit',      color: 'text-green-500' },
  withdrawal: { label: 'Withdrawal',   color: 'text-red-500' },
  payment:    { label: 'Payment',      color: 'text-red-500' },
  refund:     { label: 'Refund',       color: 'text-green-500' },
};

export default function OrganizerWalletTransactions() {
  const { walletTransactions, currentUser } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<WalletTransactionType | 'all'>('all');

  const transactions = useMemo(() => {
    return walletTransactions
      .filter((t) => t.userId === currentUser?.id)
      .filter((t) => activeFilter === 'all' || t.type === activeFilter)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [walletTransactions, currentUser?.id, activeFilter]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h1 text-foreground">Transaction History</h1>
        <p className="text-body text-muted-foreground mt-1">Your earnings, fees, and payout records.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`filter-chip ${activeFilter === f.value ? 'active' : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="surface-panel">
        {transactions.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-body font-bold">No transactions found</p>
          </div>
        ) : (
          <div className="space-y-1">
            {transactions.map((tx) => {
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
