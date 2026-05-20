import { useState } from 'react';
import { Building2, Smartphone, Zap, Trash2, Plus, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../../store/useAppStore';
import type { PayoutMethodType } from '../../../types';
import ConfirmationModal from '../../../components/business/ConfirmationModal';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '../../../app/components/ui/dialog';

const METHOD_OPTIONS: { type: PayoutMethodType; label: string; icon: typeof Building2 }[] = [
  { type: 'bank_transfer', label: 'Bank Transfer',  icon: Building2 },
  { type: 'vodafone_cash', label: 'Vodafone Cash',  icon: Smartphone },
  { type: 'instapay',      label: 'InstaPay',        icon: Zap },
];

const METHOD_ICONS: Record<PayoutMethodType, typeof Building2> = {
  bank_transfer: Building2,
  vodafone_cash: Smartphone,
  instapay: Zap,
};

export default function OrganizerWalletMethods() {
  const { getWallet, addPayoutMethod, removePayoutMethod, currentUser } = useAppStore();
  const wallet = getWallet();
  const methods = wallet?.payoutMethods ?? [];

  const [showAdd, setShowAdd] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [methodType, setMethodType] = useState<PayoutMethodType>('bank_transfer');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');

  const resetForm = () => {
    setAccountName(''); setAccountNumber(''); setBankName('');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim() || !accountNumber.trim()) return;
    addPayoutMethod({
      userId: currentUser?.id ?? '',
      type: methodType,
      details: {
        accountName,
        accountNumber,
        ...(methodType === 'bank_transfer' ? { bankName } : {}),
        ...(methodType !== 'bank_transfer' ? { phone: accountNumber } : {}),
      },
      isDefault: methods.length === 0,
    });
    resetForm();
    setShowAdd(false);
    toast.success('Payout method added.');
  };

  const handleRemove = () => {
    if (!removeTarget) return;
    removePayoutMethod(removeTarget);
    setRemoveTarget(null);
    toast.success('Payout method removed.');
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-foreground">Payout Methods</h1>
          <p className="text-body text-muted-foreground mt-1">Manage where your payouts are sent.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="py-3 px-5 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Method
        </button>
      </div>

      {methods.length === 0 ? (
        <div className="surface-panel text-center py-12 space-y-3">
          <Building2 className="w-12 h-12 mx-auto text-muted-foreground opacity-30" />
          <p className="text-body font-bold text-foreground">No payout methods yet</p>
          <p className="text-body-sm text-muted-foreground">Add a bank account or mobile wallet to receive payouts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {methods.map((m) => {
            const Icon = METHOD_ICONS[m.type] ?? Building2;
            return (
              <div key={m.id} className="card-surface p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-body-sm font-bold text-foreground">
                        {m.details.bankName ?? (m.type === 'vodafone_cash' ? 'Vodafone Cash' : 'InstaPay')} ****{m.details.accountNumber.slice(-4)}
                      </p>
                      {m.isDefault && (
                        <span className="status-pill status-active flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-caption text-muted-foreground">{m.details.accountName}</p>
                  </div>
                </div>
                {!m.isDefault && (
                  <button
                    onClick={() => setRemoveTarget(m.id)}
                    className="w-9 h-9 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add method dialog */}
      <Dialog open={showAdd} onOpenChange={(open) => { if (!open) { setShowAdd(false); resetForm(); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-h3 text-foreground">Add Payout Method</DialogTitle>
          </DialogHeader>

          {/* Type selector */}
          <div className="grid grid-cols-3 gap-2 mt-2">
            {METHOD_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => setMethodType(opt.type)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all text-caption font-bold ${methodType === opt.type ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500' : 'border-border text-muted-foreground hover:border-cyan-500/40'}`}
              >
                <opt.icon className="w-5 h-5" />
                {opt.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-caption font-bold text-muted-foreground uppercase tracking-widest block mb-2">Account Holder Name</label>
              <input className="input-base w-full" placeholder="Full legal name" value={accountName} onChange={(e) => setAccountName(e.target.value)} required />
            </div>
            {methodType === 'bank_transfer' && (
              <div>
                <label className="text-caption font-bold text-muted-foreground uppercase tracking-widest block mb-2">Bank Name</label>
                <input className="input-base w-full" placeholder="e.g. CIB Egypt" value={bankName} onChange={(e) => setBankName(e.target.value)} />
              </div>
            )}
            <div>
              <label className="text-caption font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                {methodType === 'bank_transfer' ? 'Account Number' : methodType === 'instapay' ? 'InstaPay ID' : 'Phone Number'}
              </label>
              <input
                className="input-base w-full"
                placeholder={methodType === 'bank_transfer' ? '1234567890' : methodType === 'instapay' ? 'name@instapay' : '01012345678'}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full py-3 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold transition-all">
              Add Payout Method
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove confirmation */}
      <ConfirmationModal
        open={!!removeTarget}
        onOpenChange={(open) => { if (!open) setRemoveTarget(null); }}
        title="Remove Payout Method?"
        message="This payout method will be removed from your account."
        confirmLabel="Remove"
        destructive
        onConfirm={handleRemove}
      />
    </div>
  );
}
