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
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            to={`/app/events/${event.id}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Event</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {alreadyRsvped && (
          <div className="mb-6 p-4 rounded-2xl border border-green-500/30 bg-green-500/5 text-body-sm text-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">You already have a booking for this event.</p>
                <p className="text-muted-foreground">Open your ticket or event details anytime.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to={`/app/orders/${event.id}`} className="btn-primary text-center">
                View ticket
              </Link>
              <Link to={`/app/events/${event.id}`} className="btn-secondary text-center">
                Event details
              </Link>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Ticket Selection */}
          <div className="md:col-span-2 space-y-6 order-2 md:order-1">
            <div className={`bg-card border border-border rounded-2xl shadow-lg p-6 ${alreadyRsvped ? 'opacity-60 pointer-events-none' : ''}`}>
              <h1 className="text-2xl font-bold text-foreground mb-6">Select Tickets</h1>

              <div className="space-y-4">
                {event.ticketTypes.map((ticket, index) => (
                  <div
                    key={index}
                    className="border-2 border-border rounded-xl p-4 hover:border-primary transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-bold text-foreground">{ticket.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {ticket.available} available
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">
                          {ticket.price === 0 ? 'Free' : `EGP ${ticket.price}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">Quantity:</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(ticket.name, -1)}
                          disabled={!quantities[ticket.name] || alreadyRsvped}
                          className="w-8 h-8 flex items-center justify-center border-2 border-border rounded-lg hover:border-[#6C4CF1] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {quantities[ticket.name] || 0}
                        </span>
                        <button
                          onClick={() => updateQuantity(ticket.name, 1)}
                          disabled={quantities[ticket.name] >= 10 || alreadyRsvped}
                          className="w-8 h-8 flex items-center justify-center border-2 border-border rounded-lg hover:border-[#6C4CF1] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            {!alreadyRsvped && totalTickets > 0 && subtotal > 0 && (
              <div className="bg-card border border-border rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">Payment Details</h2>
                {paymentState === 'error' && (
                  <div className="mb-4 p-3 rounded-xl border border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-900 text-red-700 dark:text-red-300 text-sm flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                    <span>{paymentError}</span>
                  </div>
                )}
                {paymentState === 'success' && (
                  <div className="mb-4 p-3 rounded-xl border border-green-300 bg-green-50 dark:bg-green-950/30 dark:border-green-900 text-green-700 dark:text-green-300 text-sm flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-0.5" />
                    <span>Booking confirmed. Redirecting to your ticket…</span>
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="md:col-span-1 order-1 md:order-2">
            <div className="bg-card border border-border rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>

              {/* Event Info */}
              <div className="mb-6 pb-6 border-b border-border">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-bold text-foreground mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{event.location.venue}</span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                {event.ticketTypes.map((ticket, index) => {
                  const qty = quantities[ticket.name] || 0;
                  if (qty === 0) return null;
                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {ticket.name} x {qty}
                      </span>
                      <span className="font-semibold">
                        EGP {(ticket.price * qty).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
                {subtotal > 0 ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service Fee (3%)</span>
                      <span className="font-semibold">EGP {serviceFee.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-border flex justify-between">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="text-xl font-bold text-[#6C4CF1]">
                        EGP {total.toFixed(2)}
                      </span>
                    </div>
                  </>
                ) : (
                  totalTickets > 0 && (
                    <div className="pt-3 border-t border-border flex justify-between">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="text-xl font-bold text-[#6C4CF1]">Free</span>
                    </div>
                  )
                )}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={
                  alreadyRsvped ||
                  totalTickets === 0 ||
                  paymentState === 'processing' ||
                  paymentState === 'success'
                }
                className="w-full bg-gradient-to-r from-[#6C4CF1] to-[#5739D4] hover:shadow-xl text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <CreditCard className="w-5 h-5" />
                {alreadyRsvped
                  ? 'Already booked'
                  : totalTickets === 0
                  ? 'Select Tickets'
                  : paymentState === 'processing'
                  ? total <= 0
                    ? 'Confirming…'
                    : 'Processing Payment...'
                  : paymentState === 'success'
                  ? '🎉 Booking Confirmed!'
                  : paymentState === 'error'
                  ? 'Retry Payment'
                  : total <= 0
                  ? 'Confirm free booking'
                  : `Pay EGP ${total.toFixed(2)}`}
              </button>

              {/* XP Preview */}
              {event.engagement && totalTickets > 0 && paymentState !== 'success' && (
                <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 rounded-xl flex items-center gap-3">
                  <Zap className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-orange-700 dark:text-orange-300">+{event.engagement.xpReward} XP on confirmation</p>
                    {event.engagement.badgeUnlock && (
                      <p className="text-xs text-muted-foreground">Unlocks "{event.engagement.badgeUnlock}" badge</p>
                    )}
                  </div>
                </div>
              )}

              <p className="mt-4 text-xs text-center text-muted-foreground">
                Your booking is protected by Eventra's secure payment system
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
