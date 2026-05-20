import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Plus, Lock, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../../store/useAppStore';

const QUICK_AMOUNTS = [100, 250, 500, 1000];

export default function WalletDeposit() {
  const navigate = useNavigate();
  const { addFunds } = useAppStore();
  const [amount, setAmount] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const parsedAmount = parseFloat(amount);
  const isValid = parsedAmount >= 50 && cardName.trim() && cardNumber.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv.length === 3;

  const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const last4 = cardNumber.replace(/\s/g, '').slice(-4);
    addFunds(parsedAmount, { brand: 'Visa', last4 });
    setLoading(false);
    setSuccess(true);
    toast.success(`EGP ${parsedAmount.toFixed(2)} added to your wallet!`);
    setTimeout(() => navigate('/app/wallet'), 1500);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <div className="text-center">
          <h2 className="text-h2 text-foreground font-black">Funds Added!</h2>
          <p className="text-body text-muted-foreground mt-2">EGP {parsedAmount.toFixed(2)} is now in your wallet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="text-h1 text-foreground">Add Funds</h1>
        <p className="text-body text-muted-foreground mt-1">Top up your Eventra Wallet using a debit or credit card.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div className="surface-panel space-y-4">
          <h2 className="text-h3 text-foreground">Amount</h2>
          <div className="grid grid-cols-4 gap-3">
            {QUICK_AMOUNTS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setAmount(String(q))}
                className={`py-3 rounded-2xl text-body-sm font-bold border-2 transition-all ${
                  amount === String(q)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          <div>
            <label className="text-caption font-bold text-muted-foreground uppercase tracking-widest block mb-2">Custom Amount (min. 50)</label>
            <div className="flex items-center input-base gap-2">
              <span className="text-muted-foreground font-bold">EGP</span>
              <input
                type="number"
                min={50}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent outline-none text-foreground font-bold"
              />
            </div>
          </div>
        </div>

        {/* Card Details */}
        <div className="surface-panel space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-h3 text-foreground">Card Details</h2>
          </div>
          <div>
            <label className="text-caption font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cardholder Name</label>
            <input className="input-base w-full" placeholder="Name on card" value={cardName} onChange={(e) => setCardName(e.target.value)} />
          </div>
          <div>
            <label className="text-caption font-bold text-muted-foreground uppercase tracking-widest block mb-2">Card Number</label>
            <input
              className="input-base w-full font-mono"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCard(e.target.value))}
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-caption font-bold text-muted-foreground uppercase tracking-widest block mb-2">Expiry</label>
              <input
                className="input-base w-full font-mono"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
              />
            </div>
            <div>
              <label className="text-caption font-bold text-muted-foreground uppercase tracking-widest block mb-2">CVV</label>
              <input
                className="input-base w-full font-mono"
                placeholder="•••"
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                maxLength={3}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-caption text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span>Your payment information is encrypted and secure.</span>
        </div>

        <button type="submit" disabled={!isValid || loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Add {amount ? `EGP ${parseFloat(amount || '0').toFixed(2)}` : 'Funds'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
