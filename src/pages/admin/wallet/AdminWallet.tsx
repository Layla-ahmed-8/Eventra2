import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, ArrowRight, Clock, CheckCircle2, DollarSign, Users } from 'lucide-react';
import { useAppStore } from '../../../store/useAppStore';
import { MOCK_PLATFORM_FEES_TOTAL, MOCK_PLATFORM_FEES_MONTH } from '../../../data/walletData';

export default function AdminWallet() {
  const { payoutRequests, walletTransactions, systemConfig } = useAppStore();
  const pendingRequests = payoutRequests.filter((r) => r.status === 'pending');
  const approvedRequests = payoutRequests.filter((r) => r.status === 'approved' || r.status === 'completed');
  const totalPayouts = payoutRequests.reduce((s, r) => (r.status === 'approved' || r.status === 'completed' ? s + r.amount : s), 0);
  const uniqueOrganizers = new Set(walletTransactions.filter((t) => t.type === 'earning').map((t) => t.userId)).size;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h1 text-foreground">Platform Wallet</h1>
        <p className="text-body text-muted-foreground mt-1">Overview of platform fees, payouts, and financial health.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-red-500" />
            <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">Total Fees Collected</span>
          </div>
          <p className="text-h2 font-black text-foreground">EGP {MOCK_PLATFORM_FEES_TOTAL.toLocaleString()}</p>
          <p className="text-caption text-muted-foreground mt-1">All time</p>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">This Month</span>
          </div>
          <p className="text-h2 font-black text-foreground">EGP {MOCK_PLATFORM_FEES_MONTH.toLocaleString()}</p>
          <p className="text-caption text-muted-foreground mt-1">May 2026</p>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">Pending Payouts</span>
          </div>
          <p className="text-h2 font-black text-foreground">{pendingRequests.length}</p>
          <p className="text-caption text-muted-foreground mt-1">
            EGP {pendingRequests.reduce((s, r) => s + r.amount, 0).toLocaleString()} total
          </p>
        </div>

        <div className="kpi-card">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-purple-500" />
            <span className="text-caption font-bold text-muted-foreground uppercase tracking-widest">Active Organizers</span>
          </div>
          <p className="text-h2 font-black text-foreground">{uniqueOrganizers || 1}</p>
          <p className="text-caption text-muted-foreground mt-1">with earnings</p>
        </div>
      </div>

      {/* Config summary */}
      <div className="surface-panel">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h3 text-foreground">Platform Settings</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest mb-1">Platform Fee</p>
            <p className="text-h3 font-black text-foreground">{systemConfig?.platformFeePercentage ?? 5}%</p>
          </div>
          <div>
            <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest mb-1">Min Payout</p>
            <p className="text-h3 font-black text-foreground">EGP {(systemConfig?.minPayoutAmount ?? 500).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest mb-1">Auto-Approve Below</p>
            <p className="text-h3 font-black text-foreground">EGP {(systemConfig?.autoApprovePayoutThreshold ?? 2000).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Pending Payout Requests */}
      <div className="surface-panel">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-h3 text-foreground">Pending Payout Requests</h2>
          <Link to="/admin/wallet/payouts" className="flex items-center gap-1 text-red-500 text-body-sm font-bold hover:underline">
            Manage all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-500 opacity-60" />
            <p className="text-body font-bold">All caught up!</p>
            <p className="text-body-sm mt-1">No pending payout requests.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {pendingRequests.slice(0, 3).map((req) => (
              <div key={req.id} className="activity-item flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-sm font-bold text-foreground">{req.organizerName}</p>
                    <p className="text-caption text-muted-foreground">
                      {req.method.type === 'bank_transfer' ? `${req.method.details.bankName ?? 'Bank'} ****${req.method.details.accountNumber.slice(-4)}` : req.method.type}
                      {' · '}{new Date(req.requestedAt).toLocaleDateString('en-EG', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-body-sm font-black text-orange-500">EGP {req.amount.toLocaleString()}</p>
                  <span className="status-pill status-pending">Pending</span>
                </div>
              </div>
            ))}
            {pendingRequests.length > 3 && (
              <div className="pt-2 text-center">
                <Link to="/admin/wallet/payouts" className="text-body-sm text-red-500 font-bold hover:underline">
                  +{pendingRequests.length - 3} more
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
