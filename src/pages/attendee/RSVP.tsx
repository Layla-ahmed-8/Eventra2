import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, CreditCard, Calendar, MapPin, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function RSVP() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, rsvpEvent, rsvpedEvents } = useAppStore();
  const event = id ? events.find((e) => e.id === id) : undefined;

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'error' | 'success'>('idle');
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    if (event) {
      setQuantities(event.ticketTypes.reduce((acc, ticket) => ({ ...acc, [ticket.name]: 0 }), {}));
    }
  }, [event?.id]);

  if (!id) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="surface-panel p-8 text-center max-w-md">
          <p className="text-foreground font-semibold mb-2">Missing event</p>
          <Link to="/app/discover" className="btn-primary">Back to Discover</Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="surface-panel p-8 text-center max-w-md">
          <p className="text-foreground font-semibold mb-2">Event not found</p>
          <Link to="/app/discover" className="btn-primary">Back to Discover</Link>
        </div>
      </div>
    );
  }

  const alreadyRsvped = rsvpedEvents.includes(event.id);

  const updateQuantity = (ticketName: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketName]: Math.max(0, Math.min(10, (prev[ticketName] || 0) + delta)),
    }));
  };

  const subtotal = event.ticketTypes.reduce(
    (sum, ticket) => sum + ticket.price * (quantities[ticket.name] || 0),
    0
  );

  const serviceFee = subtotal * 0.03;
  const total = subtotal + serviceFee;
  const totalTickets = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);

  const handleCheckout = () => {
    if (alreadyRsvped) return;
    setPaymentState('processing');
    setPaymentError('');

    setTimeout(() => {
      rsvpEvent(event.id);
      setPaymentState('success');

      // Confetti celebration
      import('canvas-confetti').then((confetti) => {
        confetti.default({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#7C5CFF', '#00D4FF', '#FF4FD8', '#FF9B3D'],
        });
      });

      setTimeout(() => navigate(`/app/orders/${event.id}`), 1200);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-xl bg-background/80">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link
            to={`/app/events/${event.id}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="font-medium">Back to Event Details</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-display font-bold text-foreground mb-2">Complete Your RSVP</h1>
          <p className="text-muted-foreground">Secure your spot for this amazing event</p>
        </div>

        {alreadyRsvped && (
          <div className="mb-8 bento-section border-green-500/20 bg-green-500/5 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="icon-box bg-green-500/10 text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-h3 font-bold text-foreground">Booking Confirmed</p>
                  <p className="text-muted-foreground">You already have a ticket for this event. Check your orders for details.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to={`/app/orders/${event.id}`} className="btn-primary">
                  View Ticket
                </Link>
                <Link to={`/app/events/${event.id}`} className="btn-secondary">
                  Event Details
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column - Ticket Selection */}
          <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
            <div className={`bento-section ${alreadyRsvped ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="bento-header">
                <div className="bento-title-wrapper">
                  <div className="icon-box bg-primary/10 text-primary">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h2 className="bento-title">Select Your Tickets</h2>
                </div>
              </div>

              <div className="grid gap-4">
                {event.ticketTypes.map((ticket, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/40 hover:bg-secondary/50 transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-h3 font-bold text-foreground">{ticket.name}</p>
                          {ticket.price === 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-micro font-bold uppercase tracking-wider">
                              Free
                            </span>
                          )}
                        </div>
                        <p className="text-caption text-muted-foreground">
                          {ticket.available} spots remaining
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10">
                        <div className="text-right">
                          <p className="text-h3 font-bold text-foreground">
                            {ticket.price === 0 ? '0.00' : `EGP ${ticket.price.toLocaleString()}`}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 bg-background/50 rounded-xl p-1.5 border border-border">
                          <button
                            onClick={() => updateQuantity(ticket.name, -1)}
                            disabled={!quantities[ticket.name] || alreadyRsvped}
                            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-6 text-center font-bold text-foreground">
                            {quantities[ticket.name] || 0}
                          </span>
                          <button
                            onClick={() => updateQuantity(ticket.name, 1)}
                            disabled={quantities[ticket.name] >= 10 || alreadyRsvped}
                            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            {!alreadyRsvped && totalTickets > 0 && subtotal > 0 && (
              <div className="bento-section animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bento-header">
                  <div className="bento-title-wrapper">
                    <div className="icon-box bg-cyan-500/10 text-cyan-500">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <h2 className="bento-title">Payment Details</h2>
                  </div>
                </div>

                {paymentState === 'error' && (
                  <div className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 text-body-sm flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 mt-0.5" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <div className="grid gap-6">
                  <div>
                    <label className="block text-caption font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      className="input-base w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-caption font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="input-base w-full pr-12"
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-caption font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="input-base w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-caption font-bold text-muted-foreground uppercase tracking-wider mb-2 ml-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="input-base w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="bento-section sticky top-28">
              <h2 className="text-h3 font-bold text-foreground mb-6">Order Summary</h2>

              {/* Event Info Card */}
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border/50 mb-6">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 object-cover rounded-xl mb-4 shadow-sm"
                />
                <h3 className="text-h4 font-bold text-foreground mb-3 line-clamp-2">
                  {event.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-body-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-cyan-500" />
                    <span className="truncate">{event.location.venue}</span>
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-body-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">EGP {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-body-sm text-muted-foreground">
                  <span>Service Fee (3%)</span>
                  <span className="font-semibold text-foreground">EGP {serviceFee.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-h4 font-bold text-foreground">Total Amount</span>
                  <span className="text-h2 font-bold gradient-text">EGP {total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={totalTickets === 0 || paymentState === 'processing' || alreadyRsvped}
                className="btn-primary w-full py-4 text-h4 h-auto shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paymentState === 'processing' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : alreadyRsvped ? (
                  'Already RSVPed'
                ) : totalTickets === 0 ? (
                  'Select Tickets'
                ) : (
                  `Confirm & Pay EGP ${total.toLocaleString()}`
                )}
              </button>

              {/* XP Preview */}
              {event.engagement && totalTickets > 0 && paymentState !== 'success' && (
                <div className="mt-6 p-4 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-4">
                  <div className="icon-box bg-orange-500/20 text-orange-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-body-sm font-bold text-foreground">+{event.engagement.xpReward} XP Reward</p>
                    <p className="text-caption text-muted-foreground">Unlocks "{event.engagement.badgeUnlock}" badge</p>
                  </div>
                </div>
              )}

              <p className="mt-4 text-center text-micro text-muted-foreground px-4">
                By confirming, you agree to our Terms of Service and Event Refund Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
