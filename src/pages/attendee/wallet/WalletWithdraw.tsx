import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../../store/useAppStore';

export default function WalletWithdraw() {
  const navigate = useNavigate();
  const { getWallet, withdrawFunds } = useAppStore();
  const wallet = getWallet();
  const balance = wallet?.balance ?? 0;

  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const parsed = parseFloat(amount);
  const isValid = parsed >= 50 && parsed <= balance;
  const insufficient = parsed > balance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    withdrawFunds(parsed);
    setLoading(false);
    setSuccess(true);
    toast.success(`EGP ${parsed.toFixed(2)} withdrawal initiated.`);
    setTimeout(() => navigate('/app/wallet'), 1500);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <div className="text-center">
          <h2 className="text-h2 text-foreground font-black">Withdrawal Initiated!</h2>
          <p className="text-body text-muted-foreground mt-2">EGP {parsed.toFixed(2)} will arrive in 1–3 business days.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="text-h1 text-foreground">Withdraw</h1>
        <p className="text-body text-muted-foreground mt-1">Transfer funds from your wallet to your bank account.</p>
      </div>

      {/* Balance summary */}
      <div className="kpi-card">
        <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest mb-1">Available Balance</p>
        <p className="text-h2 font-black text-foreground">EGP {balance.toLocaleString()}</p>
      </div>

      {/* Destination */}
      <div className="surface-panel flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <p className="text-body-sm font-bold text-foreground">CIB Egypt — ****4242</p>
          <p className="text-caption text-muted-foreground">Linked bank account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="surface-panel space-y-4">
        <h2 className="text-h3 text-foreground">Amount</h2>
        <div>
          <label className="text-caption font-bold text-muted-foreground uppercase tracking-widest block mb-2">
            Withdraw Amount (min. EGP 50)
          </label>
          <div className="flex items-center input-base gap-2">
            <span className="text-muted-foreground font-bold">EGP</span>
            <input
              type="number"
              min={50}
              max={balance}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground font-bold"
            />
          </div>
          {insufficient && (
            <div className="flex items-center gap-2 mt-2 text-red-500 text-caption font-bold">
              <AlertCircle className="w-4 h-4" />
              Amount exceeds your available balance.
            </div>
          )}
        </div>

        {parsed > 0 && isValid && (
          <div className="p-4 bg-muted/30 rounded-2xl space-y-2">
            <div className="flex justify-between text-body-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-foreground">EGP {parsed.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-muted-foreground">Remaining balance</span>
              <span className="font-bold text-foreground">EGP {(balance - parsed).toFixed(2)}</span>
            </div>
          </div>
        )}

        <button type="submit" disabled={!isValid || loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ArrowUpRight className="w-5 h-5" />
              Withdraw {amount ? `EGP ${parsed.toFixed(2)}` : ''}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
