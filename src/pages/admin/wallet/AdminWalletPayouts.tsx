import { useState } from 'react';
import { Wallet, Building2, Smartphone, Zap, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../../store/useAppStore';
import type { PayoutStatus } from '../../../types';
import ConfirmationModal from '../../../components/business/ConfirmationModal';

const STATUS_FILTERS: { label: string; value: PayoutStatus | 'all' }[] = [
  { label: 'All',       value: 'all' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Approved',  value: 'approved' },
  { label: 'Rejected',  value: 'rejected' },
  { label: 'Completed', value: 'completed' },
];

const STATUS_CONFIG: Record<PayoutStatus, { label: string; pill: string }> = {
  pending:    { label: 'Pending',    pill: 'status-pill status-pending' },
  approved:   { label: 'Approved',   pill: 'status-pill status-active' },
  rejected:   { label: 'Rejected',   pill: 'status-pill status-cancelled' },
  processing: { label: 'Processing', pill: 'status-pill status-pending' },
  completed:  { label: 'Completed',  pill: 'status-pill status-active' },
};

const METHOD_ICONS: Record<string, typeof Wallet> = {
  bank_transfer: Building2,
  vodafone_cash: Smartphone,
  instapay: Zap,
};

export default function AdminWalletPayouts() {
  const { payoutRequests, approvePayoutRequest, rejectPayoutRequest } = useAppStore();
  const [statusFilter, setStatusFilter] = useState<PayoutStatus | 'all'>('all');
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [approveTarget, setApproveTarget] = useState<string | null>(null);
  const [approveNotes, setApproveNotes] = useState('');

  const filtered = payoutRequests
    .filter((r) => statusFilter === 'all' || r.status === statusFilter)
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

  const { notifyOrganizerPayoutUpdate } = useAppStore();

  const handleApprove = () => {
    if (!approveTarget) return;
    const req = payoutRequests.find((r) => r.id === approveTarget);
    approvePayoutRequest(approveTarget, approveNotes);
    if (req) notifyOrganizerPayoutUpdate(req.organizerId, req.amount, 'approved');
    setApproveTarget(null);
    setApproveNotes('');
    toast.success('Payout approved. Organizer has been notified.');
  };

  const handleReject = () => {
    if (!rejectTarget || !adminNotes.trim()) return;
    const req = payoutRequests.find((r) => r.id === rejectTarget);
    rejectPayoutRequest(rejectTarget, adminNotes);
    if (req) notifyOrganizerPayoutUpdate(req.organizerId, req.amount, 'rejected', adminNotes);
    setRejectTarget(null);
    setAdminNotes('');
    toast.success('Payout rejected. Funds returned to organizer balance.');
  };

  const approveReq = payoutRequests.find((r) => r.id === approveTarget);
  const rejectReq  = payoutRequests.find((r) => r.id === rejectTarget);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-h1 text-foreground">Payout Requests</h1>
        <p className="text-body text-muted-foreground mt-1">Review and approve organizer payout requests.</p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`filter-chip ${statusFilter === f.value ? 'active' : ''}`}
          >
            {f.label}
            {f.value === 'pending' && (
              <span className="ml-1.5 inline-flex w-5 h-5 rounded-full bg-orange-500 text-white text-micro font-black items-center justify-center">
                {payoutRequests.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Requests list */}
      <div className="surface-panel">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-body font-bold">No requests found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((req) => {
              const Icon = METHOD_ICONS[req.method.type] ?? Wallet;
              const statusCfg = STATUS_CONFIG[req.status];
              const isPending = req.status === 'pending';
              return (
                <div key={req.id} className="card-surface p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                        <Wallet className="w-6 h-6 text-red-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-body font-bold text-foreground">{req.organizerName}</p>
                        <p className="text-caption text-muted-foreground">
                          Requested {new Date(req.requestedAt).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-h3 font-black text-foreground">EGP {req.amount.toLocaleString()}</p>
                      <span className={statusCfg.pill}>{statusCfg.label}</span>
                    </div>
                  </div>

                  {/* Payout method */}
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl">
                    <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-body-sm font-bold text-foreground">
                        {req.method.details.bankName ?? (req.method.type === 'vodafone_cash' ? 'Vodafone Cash' : 'InstaPay')}
                        {' ****'}{req.method.details.accountNumber.slice(-4)}
                      </p>
                      <p className="text-caption text-muted-foreground">{req.method.details.accountName}</p>
                    </div>
                  </div>

                  {req.notes && (
                    <p className="text-caption text-muted-foreground italic">"{req.notes}"</p>
                  )}
                  {req.adminNotes && (
                    <div className="flex items-start gap-2 text-caption text-muted-foreground">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Admin notes: {req.adminNotes}</span>
                    </div>
                  )}

                  {isPending && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setApproveTarget(req.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-green-500/10 text-green-500 font-bold hover:bg-green-500/20 transition-all text-body-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => { setRejectTarget(req.id); setAdminNotes(''); }}
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all text-body-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Approve modal */}
      <ConfirmationModal
        open={!!approveTarget}
        onOpenChange={(open) => { if (!open) { setApproveTarget(null); setApproveNotes(''); } }}
        title="Approve Payout"
        message={`Approve EGP ${approveReq?.amount.toLocaleString() ?? ''} payout for ${approveReq?.organizerName ?? ''}?`}
        confirmLabel="Approve"
        onConfirm={handleApprove}
      >
        <div className="space-y-2">
          <label className="text-caption font-bold text-muted-foreground uppercase tracking-widest block">Notes (optional)</label>
          <input
            className="input-base w-full"
            placeholder="Internal notes..."
            value={approveNotes}
            onChange={(e) => setApproveNotes(e.target.value)}
          />
        </div>
      </ConfirmationModal>

      {/* Reject modal */}
      <ConfirmationModal
        open={!!rejectTarget}
        onOpenChange={(open) => { if (!open) { setRejectTarget(null); setAdminNotes(''); } }}
        title="Reject Payout"
        message={`Rejecting this request will refund EGP ${rejectReq?.amount.toLocaleString() ?? ''} back to ${rejectReq?.organizerName ?? ''}'s balance.`}
        confirmLabel="Reject"
        destructive
        onConfirm={handleReject}
      >
        <div className="space-y-2">
          <label className="text-caption font-bold text-muted-foreground uppercase tracking-widest block">Reason (required)</label>
          <input
            className="input-base w-full"
            placeholder="Explain why this request is rejected..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />
        </div>
      </ConfirmationModal>
    </div>
  );
}
