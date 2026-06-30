import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Minus, Plus, CreditCard, Calendar, MapPin, AlertTriangle,
  CheckCircle2, Zap, Wallet, Ticket, Shield, Gift, Tag, ChevronRight, Lock,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import TicketHoldTimer from '../../components/business/TicketHoldTimer';
import { DEFAULT_SYSTEM_CONFIG } from '../../constants/config';
import {
  calculateDiscount,
  getPromoByCode,
  getRewardVoucherByCode,
  PROMO_CODES,
} from '../../lib/vouchers';

type Step = 'tickets' | 'summary' | 'payment' | 'processing' | 'success';
type DiscountTab = 'promo' | 'voucher';

const STEPS: { key: Step; label: string }[] = [
  { key: 'tickets', label: 'Tickets' },
  { key: 'summary', label: 'Summary' },
  { key: 'payment', label: 'Payment' },
  { key: 'success', label: 'Done' },
];

function formatCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function detectCardBrand(num: string): string {
  const d = num.replace(/\D/g, '');
  if (d.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(d)) return 'Mastercard';
  if (/^3[47]/.test(d)) return 'Amex';
  return 'Card';
}

export default function RSVP() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    events, rsvpEvent, rsvpedEvents, rsvpEventFull, getWallet, payWithWallet,
    notifyOrganizerNewBooking, currentUser, rewardHistory,
  } = useAppStore();

  const event = id ? events.find((e) => e.id === id) : undefined;
  const alreadyRsvped = event ? rsvpedEvents.includes(event.id) : false;

  const [step, setStep] = useState<Step>('tickets');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [paymentState, setPaymentState] = useState<'idle' | 'error'>('idle');
  const [paymentError, setPaymentError] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const [holdExpiry, setHoldExpiry] = useState<Date | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [discountTab, setDiscountTab] = useState<DiscountTab>('promo');
  const [promoInput, setPromoInput] = useState('');
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [bookingRef, setBookingRef] = useState('');
  const holdCreatedRef = useRef(false);

  const wallet = getWallet();
  const walletBalance = wallet?.balance ?? 0;

  useEffect(() => {
    if (event) {
      setQuantities(event.ticketTypes.reduce((acc, ticket) => ({ ...acc, [ticket.name]: 0 }), {}));
    }
  }, [event?.id]);

  const ticketLines = useMemo(() => {
    if (!event) return [];
    return event.ticketTypes
      .filter((t) => (quantities[t.name] || 0) > 0)
      .map((t) => ({
        type: t.name,
        qty: quantities[t.name] || 0,
        unitPrice: t.price,
        subtotal: t.price * (quantities[t.name] || 0),
      }));
  }, [event, quantities]);

  const subtotal = ticketLines.reduce((sum, t) => sum + t.subtotal, 0);
  const serviceFee = subtotal > 0 ? Number((subtotal * 0.03).toFixed(2)) : 0;
  const totalTickets = ticketLines.reduce((sum, t) => sum + t.qty, 0);

  const discountAmount = useMemo(() => {
    const input = { subtotal, serviceFee, ticketLines };
    if (appliedVoucher) {
      const def = getRewardVoucherByCode(appliedVoucher);
      if (def) return calculateDiscount(def, input);
    }
    if (appliedPromo) {
      const def = getPromoByCode(appliedPromo);
      if (def) return calculateDiscount(def, input);
    }
    return 0;
  }, [appliedPromo, appliedVoucher, subtotal, serviceFee, ticketLines]);

  const total = Math.max(0, Number((subtotal + serviceFee - discountAmount).toFixed(2)));
  const isFreeCheckout = total === 0 && totalTickets > 0;

  const activeVouchers = useMemo(
    () => rewardHistory.filter((r) => r.code && !r.usedAt),
    [rewardHistory],
  );

  useEffect(() => {
    if (totalTickets > 0 && !holdExpiry && !holdCreatedRef.current && !alreadyRsvped) {
      holdCreatedRef.current = true;
      setHoldExpiry(new Date(Date.now() + DEFAULT_SYSTEM_CONFIG.ticketHoldTimeoutMinutes * 60 * 1000));
    }
  }, [totalTickets, holdExpiry, alreadyRsvped]);

  const handleHoldExpired = useCallback(() => {
    setHoldExpiry(null);
    holdCreatedRef.current = false;
    setQuantities(event ? event.ticketTypes.reduce((acc, t) => ({ ...acc, [t.name]: 0 }), {}) : {});
    setStep('tickets');
    toast.error('Ticket hold expired', { description: 'Please select your tickets again.' });
  }, [event]);

  const updateQuantity = (ticketName: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketName]: Math.max(0, Math.min(10, (prev[ticketName] || 0) + delta)),
    }));
  };

  const applyPromoCode = () => {
    setPromoError('');
    const def = getPromoByCode(promoInput);
    if (!def) {
      setPromoError('Invalid promo code');
      return;
    }
    setAppliedPromo(def.code);
    setAppliedVoucher(null);
    setVoucherInput('');
    toast.success(`${def.label} applied`);
  };

  const applyVoucherCode = (code: string) => {
    setVoucherError('');
    const normalized = code.trim().toUpperCase();
    const def = getRewardVoucherByCode(normalized);
    if (!def) {
      setVoucherError('Unknown voucher code');
      return;
    }
    const owned = activeVouchers.some((v) => v.code?.toUpperCase() === normalized);
    if (!owned) {
      setVoucherError('Redeem this voucher from Rewards Hub first');
      return;
    }
    setAppliedVoucher(def.code);
    setAppliedPromo(null);
    setPromoInput('');
    toast.success(`${def.label} applied`);
  };

  const validatePayment = () => {
    if (isFreeCheckout) return true;
    if (selectedPaymentMethod === 'wallet') {
      if (walletBalance < total) {
        toast.error('Insufficient wallet balance');
        return false;
      }
      return true;
    }
    const errors: Record<string, string> = {};
    if (!cardholderName.trim()) errors.name = 'Cardholder name is required';
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 15) errors.card = 'Enter a valid card number';
    if (!/^\d{2}\/\d{2}$/.test(expiry)) errors.expiry = 'Use MM/YY format';
    if (cvv.replace(/\D/g, '').length < 3) errors.cvv = 'CVV is required';
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const completeBooking = async () => {
    if (!event || alreadyRsvped || totalTickets === 0) return;

    setStep('processing');
    setPaymentState('idle');

    await new Promise((r) => setTimeout(r, 1800));

    const cardDigits = cardNumber.replace(/\D/g, '');
    const booking = await rsvpEventFull(event.id, {
      tickets: ticketLines,
      discount: discountAmount,
      promoCode: appliedPromo ?? undefined,
      voucherCode: appliedVoucher ?? undefined,
      paymentSource: isFreeCheckout ? 'card' : selectedPaymentMethod,
      cardBrand: detectCardBrand(cardNumber),
      cardLast4: cardDigits.slice(-4) || '4242',
    });

    if (!booking) {
      rsvpEvent(event.id);
      setPaymentState('error');
      setPaymentError('Could not complete booking. Please try again.');
      setStep('payment');
      return;
    }

    if (selectedPaymentMethod === 'wallet' && total > 0) {
      payWithWallet(total, booking.id);
    }

    if (currentUser) {
      notifyOrganizerNewBooking('user-002', event.title, currentUser.name, booking.id);
    }

    setBookingRef(booking.bookingRef);
    setStep('success');

    import('canvas-confetti').then((confetti) => {
      confetti.default({ particleCount: 150, spread: 90, origin: { y: 0.5 }, colors: ['#7C5CFF', '#00D4FF', '#FF4FD8', '#FF9B3D'] });
    });

    setTimeout(() => navigate(`/app/orders/${event.id}`), 2500);
  };

  const handlePay = () => {
    if (!validatePayment()) return;
    completeBooking();
  };

  if (!id || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="surface-panel p-8 text-center max-w-md">
          <p className="text-foreground font-semibold mb-2">{!id ? 'Missing event' : 'Event not found'}</p>
          <Link to="/app/discover" className="btn-primary">Back to Discover</Link>
        </div>
      </div>
    );
  }

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-0 z-20 backdrop-blur-xl bg-background/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link to={`/app/events/${event.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium hidden sm:inline">Back to Event</span>
          </Link>
          {!alreadyRsvped && step !== 'success' && step !== 'processing' && (
            <div className="flex items-center gap-2">
              {STEPS.slice(0, 3).map((s, i) => (
                <div key={s.key} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < stepIndex ? 'bg-green-500 text-white' : i === stepIndex ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {i < stepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-micro font-bold hidden md:inline ${i === stepIndex ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                  {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground hidden md:inline" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {step === 'processing' && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <h2 className="text-h2 font-bold text-foreground">Processing your payment...</h2>
            <p className="text-body-sm text-muted-foreground">Please don&apos;t close this window</p>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-6">
          <div className="text-center max-w-md space-y-4 animate-in fade-in zoom-in">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-h1 font-bold text-foreground">Booking confirmed!</h2>
            <p className="text-body text-muted-foreground">Ref: {bookingRef}</p>
            <p className="text-body-sm text-muted-foreground">Redirecting to your ticket...</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-display font-bold text-foreground mb-2">Complete Your Booking</h1>
          <p className="text-muted-foreground">Secure your spot — {event.title}</p>
        </div>

        {alreadyRsvped && (
          <div className="mb-8 bento-section border-green-500/20 bg-green-500/5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="icon-box bg-green-500/10 text-green-600"><CheckCircle2 className="w-6 h-6" /></div>
                <div>
                  <p className="text-h3 font-bold text-foreground">Already booked</p>
                  <p className="text-muted-foreground">You have a ticket for this event.</p>
                </div>
              </div>
              <Link to={`/app/orders/${event.id}`} className="btn-primary">View Ticket</Link>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: Tickets */}
            {step === 'tickets' && (
              <div className={`bento-section ${alreadyRsvped ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="bento-header">
                  <div className="bento-title-wrapper">
                    <div className="icon-box bg-primary/10 text-primary"><Ticket className="w-5 h-5" /></div>
                    <h2 className="bento-title">Select Tickets</h2>
                  </div>
                </div>
                <div className="grid gap-4">
                  {event.ticketTypes.map((ticket, index) => (
                    <div key={index} className="p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/40 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="text-h3 font-bold text-foreground">{ticket.name}</p>
                          <p className="text-caption text-muted-foreground mt-1">
                            {ticket.price === 0 ? 'Free admission' : `EGP ${ticket.price.toLocaleString()} each`}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-h3 font-bold">{ticket.price === 0 ? 'FREE' : `EGP ${ticket.price}`}</p>
                          <div className="flex items-center gap-3 bg-background/50 rounded-xl p-1.5 border border-border">
                            <button onClick={() => updateQuantity(ticket.name, -1)} disabled={!quantities[ticket.name]} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary disabled:opacity-30">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center font-bold">{quantities[ticket.name] || 0}</span>
                            <button onClick={() => updateQuantity(ticket.name, 1)} disabled={(quantities[ticket.name] || 0) >= 10} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary disabled:opacity-30">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep('summary')}
                  disabled={totalTickets === 0}
                  className="btn-primary w-full mt-6 py-4 text-h4 h-auto disabled:opacity-50"
                >
                  Continue to Summary
                </button>
              </div>
            )}

            {/* STEP 2: Summary + Promo/Voucher */}
            {step === 'summary' && (
              <div className="space-y-6">
                <div className="bento-section">
                  <h2 className="text-h3 font-bold mb-4">Order Review</h2>
                  <table className="w-full text-body-sm">
                    <thead>
                      <tr className="text-muted-foreground border-b border-border">
                        <th className="text-left py-2">Ticket</th>
                        <th className="text-center py-2">Qty</th>
                        <th className="text-right py-2">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticketLines.map((line) => (
                        <tr key={line.type} className="border-b border-border/50">
                          <td className="py-3 font-semibold">{line.type}</td>
                          <td className="py-3 text-center">{line.qty}</td>
                          <td className="py-3 text-right">EGP {line.subtotal.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {subtotal > 0 && (
                  <div className="bento-section">
                    <h2 className="text-h3 font-bold mb-4">Discounts</h2>
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={() => setDiscountTab('promo')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-body-sm font-bold border-2 transition-all ${
                          discountTab === 'promo' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                        }`}
                      >
                        <Tag className="w-4 h-4" /> Promo Code
                      </button>
                      <button
                        onClick={() => setDiscountTab('voucher')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-body-sm font-bold border-2 transition-all ${
                          discountTab === 'voucher' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600' : 'border-border text-muted-foreground'
                        }`}
                      >
                        <Gift className="w-4 h-4" /> Reward Voucher
                        {activeVouchers.length > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-cyan-500 text-white text-[10px]">{activeVouchers.length}</span>
                        )}
                      </button>
                    </div>

                    {discountTab === 'promo' ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            value={promoInput}
                            onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(''); }}
                            placeholder="e.g. EVENTRA20"
                            className="input-base flex-1"
                          />
                          <button onClick={applyPromoCode} className="btn-secondary px-6">Apply</button>
                        </div>
                        {promoError && <p className="text-body-sm text-red-500">{promoError}</p>}
                        {appliedPromo && (
                          <p className="text-body-sm text-green-600 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> {appliedPromo} applied (−EGP {discountAmount})
                          </p>
                        )}
                        <p className="text-micro text-muted-foreground">Try: {PROMO_CODES.map((p) => p.code).join(', ')}</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activeVouchers.length === 0 ? (
                          <div className="p-4 rounded-2xl bg-secondary/30 border border-border text-center">
                            <p className="text-body-sm text-muted-foreground mb-3">No vouchers yet. Redeem rewards from the hub.</p>
                            <Link to="/app/rewards/hub" className="btn-secondary text-body-sm">Go to Rewards Hub</Link>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {activeVouchers.map((v) => {
                              const def = getRewardVoucherByCode(v.code!);
                              const isApplied = appliedVoucher === v.code;
                              return (
                                <button
                                  key={v.id + v.code}
                                  onClick={() => applyVoucherCode(v.code!)}
                                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                                    isApplied ? 'border-cyan-500 bg-cyan-500/5' : 'border-border hover:border-cyan-500/40'
                                  }`}
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div>
                                      <p className="font-bold text-foreground">{v.title}</p>
                                      <p className="text-micro font-mono text-muted-foreground mt-1">{v.code}</p>
                                      {def && <p className="text-caption text-muted-foreground mt-1">{def.description}</p>}
                                    </div>
                                    {isApplied && <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                        <div className="flex gap-2 pt-2 border-t border-border">
                          <input
                            value={voucherInput}
                            onChange={(e) => { setVoucherInput(e.target.value.toUpperCase()); setVoucherError(''); }}
                            placeholder="Or enter voucher code manually"
                            className="input-base flex-1"
                          />
                          <button onClick={() => applyVoucherCode(voucherInput)} className="btn-secondary px-6">Apply</button>
                        </div>
                        {voucherError && <p className="text-body-sm text-red-500">{voucherError}</p>}
                      </div>
                    )}
                  </div>
                )}

                <p className="text-body-sm text-muted-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Free cancellation up to {DEFAULT_SYSTEM_CONFIG.cancellationWindowHours} hours before the event
                </p>

                <div className="flex gap-3">
                  <button onClick={() => setStep('tickets')} className="btn-secondary flex-1 py-3">Back</button>
                  <button
                    onClick={() => setStep(isFreeCheckout ? 'payment' : subtotal > 0 ? 'payment' : 'payment')}
                    className="btn-primary flex-1 py-3"
                  >
                    {isFreeCheckout ? 'Confirm RSVP' : 'Proceed to Payment'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment */}
            {step === 'payment' && (
              <div className="bento-section space-y-6">
                <div className="bento-header">
                  <div className="bento-title-wrapper">
                    <div className="icon-box bg-cyan-500/10 text-cyan-500"><CreditCard className="w-5 h-5" /></div>
                    <h2 className="bento-title">{isFreeCheckout ? 'Confirm Registration' : 'Payment Method'}</h2>
                  </div>
                </div>

                {paymentState === 'error' && (
                  <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 text-body-sm flex gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    {paymentError}
                  </div>
                )}

                {isFreeCheckout ? (
                  <p className="text-body text-muted-foreground">No payment required. Confirm to complete your registration.</p>
                ) : (
                  <>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('card')}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border-2 font-bold text-body-sm ${
                          selectedPaymentMethod === 'card' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" /> Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('wallet')}
                        disabled={walletBalance < total}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border-2 font-bold text-body-sm disabled:opacity-50 ${
                          selectedPaymentMethod === 'wallet' ? 'border-purple-500 bg-purple-500/10 text-purple-600' : 'border-border text-muted-foreground'
                        }`}
                      >
                        <Wallet className="w-4 h-4" /> Wallet (EGP {walletBalance.toLocaleString()})
                      </button>
                    </div>

                    {selectedPaymentMethod === 'wallet' ? (
                      <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-2">
                        <div className="flex justify-between text-body-sm">
                          <span className="text-muted-foreground">Balance after payment</span>
                          <span className="font-bold">EGP {(walletBalance - total).toLocaleString()}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        <div>
                          <label className="text-caption font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Cardholder Name</label>
                          <input value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} className={`input-base w-full${paymentErrors.name ? ' input-error' : ''}`} placeholder="Full name" />
                          {paymentErrors.name && <p className="field-error-msg">{paymentErrors.name}</p>}
                        </div>
                        <div>
                          <label className="text-caption font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Card Number</label>
                          <input
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            className={`input-base w-full${paymentErrors.card ? ' input-error' : ''}`}
                            placeholder="0000 0000 0000 0000"
                          />
                          {paymentErrors.card && <p className="field-error-msg">{paymentErrors.card}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-caption font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Expiry</label>
                            <input value={expiry} onChange={(e) => setExpiry(formatExpiry(e.target.value))} className={`input-base w-full${paymentErrors.expiry ? ' input-error' : ''}`} placeholder="MM/YY" />
                            {paymentErrors.expiry && <p className="field-error-msg">{paymentErrors.expiry}</p>}
                          </div>
                          <div>
                            <label className="text-caption font-bold text-muted-foreground uppercase tracking-wider mb-2 block">CVV</label>
                            <input value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} className={`input-base w-full${paymentErrors.cvv ? ' input-error' : ''}`} placeholder="123" />
                            {paymentErrors.cvv && <p className="field-error-msg">{paymentErrors.cvv}</p>}
                          </div>
                        </div>
                        <p className="text-micro text-muted-foreground flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5" /> Secured by 256-bit SSL encryption (demo)
                        </p>
                      </div>
                    )}
                  </>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep('summary')} className="btn-secondary flex-1 py-3">Back</button>
                  <button onClick={handlePay} className="btn-primary flex-1 py-4 text-h4 h-auto shadow-xl">
                    {isFreeCheckout ? 'Confirm RSVP' : `Pay EGP ${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar summary */}
          <div className="lg:col-span-4">
            <div className="bento-section sticky top-28">
              <h2 className="text-h3 font-bold mb-4">Order Summary</h2>
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/50 mb-6">
                <img src={event.image} alt="" className="w-full h-36 object-cover rounded-xl mb-3" />
                <h3 className="font-bold line-clamp-2 mb-2">{event.title}</h3>
                <div className="space-y-1 text-body-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" />
                    {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-500" /><span className="truncate">{event.location.venue}</span></div>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-body-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">EGP {subtotal.toLocaleString()}</span></div>
                {serviceFee > 0 && <div className="flex justify-between"><span className="text-muted-foreground">Service fee (3%)</span><span className="font-semibold">EGP {serviceFee.toLocaleString()}</span></div>}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount{appliedVoucher ? ' (voucher)' : appliedPromo ? ' (promo)' : ''}</span>
                    <span className="font-semibold">−EGP {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t flex justify-between items-center">
                  <span className="text-h4 font-bold">Total</span>
                  <span className="text-h2 font-bold gradient-text">EGP {total.toLocaleString()}</span>
                </div>
              </div>

              {holdExpiry && step !== 'success' && step !== 'processing' && !alreadyRsvped && totalTickets > 0 && (
                <TicketHoldTimer expiresAt={holdExpiry} onExpire={handleHoldExpired} />
              )}

              {event.engagement && totalTickets > 0 && (
                <div className="mt-4 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3">
                  <Zap className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-body-sm font-bold">+{event.engagement.xpReward} XP</p>
                    <p className="text-caption text-muted-foreground">On completion</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
