import { useState } from 'react';
import { CreditCard, Trash2, ShieldCheck, Plus } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmationModal from '../../../components/business/ConfirmationModal';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '../../../app/components/ui/dialog';

const MOCK_CARDS = [
  { id: 'card-001', brand: 'Visa',       last4: '4242', expiry: '12/27', isDefault: true },
  { id: 'card-002', brand: 'Mastercard', last4: '5151', expiry: '08/26', isDefault: false },
];

export default function WalletMethods() {
  const [cards, setCards] = useState(MOCK_CARDS);
  const [removeTarget, setRemoveTarget] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newExpiry, setNewExpiry] = useState('');
  const [newCvv, setNewCvv] = useState('');

  const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const handleRemove = () => {
    if (!removeTarget) return;
    setCards((prev) => prev.filter((c) => c.id !== removeTarget));
    setRemoveTarget(null);
    toast.success('Card removed.');
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newNumber.replace(/\s/g, '').length < 16 || newExpiry.length < 5 || newCvv.length < 3) return;
    const brand = newNumber.startsWith('4') ? 'Visa' : 'Mastercard';
    const last4 = newNumber.replace(/\s/g, '').slice(-4);
    setCards((prev) => [...prev, { id: `card-${Date.now()}`, brand, last4, expiry: newExpiry, isDefault: false }]);
    setShowAdd(false);
    setNewName(''); setNewNumber(''); setNewExpiry(''); setNewCvv('');
    toast.success('Card added successfully.');
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-foreground">Payment Methods</h1>
          <p className="text-body text-muted-foreground mt-1">Manage your saved cards for deposits.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Card
        </button>
      </div>

      <div className="space-y-3">
        {cards.map((card) => (
          <div key={card.id} className="card-surface p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-body-sm font-bold text-foreground">{card.brand} ****{card.last4}</p>
                  {card.isDefault && (
                    <span className="status-pill status-active flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Default
                    </span>
                  )}
                </div>
                <p className="text-caption text-muted-foreground">Expires {card.expiry}</p>
              </div>
            </div>
            {!card.isDefault && (
              <button
                onClick={() => setRemoveTarget(card.id)}
                className="w-9 h-9 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add card dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-h3 text-foreground">Add New Card</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4 mt-2">
            <input className="input-base w-full" placeholder="Cardholder name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <input
              className="input-base w-full font-mono"
              placeholder="0000 0000 0000 0000"
              value={newNumber}
              onChange={(e) => setNewNumber(formatCard(e.target.value))}
              maxLength={19}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                className="input-base w-full font-mono"
                placeholder="MM/YY"
                value={newExpiry}
                onChange={(e) => setNewExpiry(formatExpiry(e.target.value))}
                maxLength={5}
              />
              <input
                className="input-base w-full font-mono"
                placeholder="CVV"
                type="password"
                value={newCvv}
                onChange={(e) => setNewCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                maxLength={3}
              />
            </div>
            <button type="submit" className="btn-primary w-full">Save Card</button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Remove confirmation */}
      <ConfirmationModal
        open={!!removeTarget}
        onOpenChange={(open) => { if (!open) setRemoveTarget(null); }}
        title="Remove Card?"
        message="This card will be removed from your account."
        confirmLabel="Remove"
        destructive
        onConfirm={handleRemove}
      />
    </div>
  );
}
