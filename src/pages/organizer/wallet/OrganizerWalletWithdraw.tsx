import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Banknote, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppStore } from '../../../store/useAppStore';

const METHOD_LABELS: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  vodafone_cash: 'Vodafone Cash',
  instapay: 'InstaPay',
};

export default function OrganizerWalletWithdraw() {
  const navigate = useNavigate();
  const { getWallet, requestPayout, systemConfig } = useAppStore();
  const wallet = getWallet();
  const balance = wallet?.balance ?? 0;
  const methods = wallet?.payoutMethods ?? [];
  const minAmount = systemConfig?.minPayoutAmount ?? 500;

  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(methods.find((m) => m.isDefault)?.id ?? methods[0]?.id ?? '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const parsed = parseFloat(amount);
  const isValid = parsed >= minAmount && parsed <= balance && selectedMethod;
  const insufficient = parsed > balance;
  const belowMin = parsed > 0 && parsed < minAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const ok = requestPayout(parsed, selectedMethod);
    setLoading(false);
    if (ok) {
      setSuccess(true);
      toast.success('Payout request submitted!');
      setTimeout(() => navigate('/organizer/wallet'), 1500);
    } else {
      toast.error('Payout failed. Check your balance.');
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <div className="text-center">
          <h2 className="text-h2 text-foreground font-black">Request Submitted!</h2>
          <p className="text-body text-muted-foreground mt-2">EGP {parsed.toFixed(2)} payout request is under review.</p>
        </div>
      </div>
    );
  }

  if (methods.length === 0) {
    return (
      <div className="max-w-lg mx-auto space-y-8">
        <div>
          <h1 className="text-h1 text-foreground">Request Payout</h1>
        </div>
        <div className="surface-panel text-center py-12 space-y-4">
          <Banknote className="w-12 h-12 mx-auto text-muted-foreground opacity-40" />
          <p className="text-body font-bold text-foreground">No payout methods added</p>
          <p className="text-body-sm text-muted-foreground">Add a payout method before requesting a withdrawal.</p>
          <Link to="/organizer/wallet/methods" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Payout Method
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="text-h1 text-foreground">Request Payout</h1>
        <p className="text-body text-muted-foreground mt-1">Transfer your earnings to your payout account.</p>
      </div>

      <div className="kpi-card">
        <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest mb-1">Available Balance</p>
        <p className="text-h2 font-black text-foreground">EGP {balance.toLocaleString()}</p>
        <p className="text-caption text-muted-foreground mt-1">Minimum payout: EGP {minAmount.toLocaleString()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payout method */}
        <div className="surface-panel space-y-4">
          <h2 className="text-h3 text-foreground">Payout Method</h2>
          <div className="space-y-3">
            {methods.map((m) => (
              <label key={m.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedMethod === m.id ? 'border-cyan-500 bg-cyan-500/5' : 'border-border hover:border-cyan-500/40'}`}>
                <input type="radio" name="method" value={m.id} checked={selectedMethod === m.id} onChange={() => setSelectedMethod(m.id)} className="sr-only" />
                <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
                  {selectedMethod === m.id && <div className="w-2 h-2 rounded-full bg-cyan-500" />}
                </div>
                <div>
                  <p className="text-body-sm font-bold text-foreground">{METHOD_LABELS[m.type] ?? m.type} — {m.details.bankName ?? ''} ****{m.details.accountNumber.slice(-4)}</p>
                  <p className="text-caption text-muted-foreground">{m.details.accountName}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Amount + notes */}
        <div className="surface-panel space-y-4">
          <h2 className="text-h3 text-foreground">Amount</h2>
          <div>
            <div className="flex items-center input-base gap-2">
              <span className="text-muted-foreground font-bold">EGP</span>
              <input
                type="number"
                min={minAmount}
                max={balance}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent outline-none text-foreground font-bold"
              />
            </div>
            {insufficient && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-caption font-bold">
                <AlertCircle className="w-4 h-4" /> Amount exceeds your available balance.
              </div>
            )}
            {belowMin && (
              <div className="flex items-center gap-2 mt-2 text-orange-500 text-caption font-bold">
                <AlertCircle className="w-4 h-4" /> Minimum payout is EGP {minAmount.toLocaleString()}.
              </div>
            )}
          </div>
          <div>
            <label className="text-caption font-bold text-muted-foreground uppercase tracking-widest block mb-2">Notes (optional)</label>
            <input className="input-base w-full" placeholder="e.g. Monthly earnings" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <button type="submit" disabled={!isValid || loading} className="w-full py-4 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Banknote className="w-5 h-5" />
              Submit Payout Request
            </>
          )}
        </button>
      </form>
    </div>
  );
}
