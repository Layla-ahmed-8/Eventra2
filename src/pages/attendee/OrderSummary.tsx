import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Download, Share2, CheckCircle2, Zap, MessageSquare, Users } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppStore } from '../../store/useAppStore';

export default function OrderSummary() {
  const { bookingId, id } = useParams<{ bookingId?: string; id?: string }>();
  const routeId = bookingId || id;
  const { events, bookings, currentUser } = useAppStore();

  const booking = bookings.find((b) => b.eventId === routeId || b.id === routeId);
  const event = events.find((e) => e.id === routeId || (booking && booking.eventId === e.id));
  const eng = event?.engagement;

  // Confetti on mount
  useEffect(() => {
    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#7C5CFF', '#00D4FF', '#FF4FD8', '#FF9B3D'],
      });
    });
  }, []);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="surface-panel p-12 text-center max-w-md">
          <h2 className="text-h2 font-bold text-foreground mb-2">Event not found</h2>
          <Link to="/app/discover" className="btn-primary mt-4">Back to Discover</Link>
        </div>
      </div>
    );
  }

  const qrValue = booking?.qrData
    ? JSON.stringify(booking.qrData)
    : JSON.stringify({ bookingId: `EVT-${event.id}`, eventId: event.id, valid: true });

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/app/my-events" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">My Events</span>
            </Link>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Download className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Banner */}
        <div className="surface-panel p-6 mb-6 text-center border border-green-500/20 bg-gradient-to-r from-green-500/5 to-cyan-500/5">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce-in">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-h2 font-bold text-foreground mb-2">You're going! 🎉</h2>
          <p className="text-body text-muted-foreground mb-4">
            Your spot is confirmed. Keep this summary for entry and support.
          </p>
          {/* XP Reward */}
          {eng && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-full">
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-body-sm font-bold text-orange-600 dark:text-orange-400">
                +{eng.xpReward} XP earned for this booking
              </span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - QR Code */}
          <div className="md:col-span-1">
            <div className="surface-panel p-6 sticky top-24">
              <h3 className="text-body font-bold text-foreground mb-4 text-center">Your Ticket</h3>

              {/* Real QR Code */}
              <div className="bg-white rounded-2xl p-4 mb-4 flex items-center justify-center shadow-inner">
                <QRCodeSVG
                  value={qrValue}
                  size={160}
                  bgColor="#ffffff"
                  fgColor="#111827"
                  level="M"
                />
              </div>

              <div className="text-center mb-4">
                <p className="text-caption text-muted-foreground mb-1">Booking Reference</p>
                <p className="font-mono font-bold text-body text-foreground">
                  {booking?.bookingRef || `EVT-${event.id.toUpperCase().slice(0, 6)}`}
                </p>
              </div>

              <button className="btn-primary w-full">
                <Download className="w-4 h-4" />
                Download Ticket
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Event Details */}
            <div className="surface-panel p-6">
              <h3 className="text-h3 font-bold text-foreground mb-4">Event Details</h3>
              <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-xl mb-4" />
              <h2 className="text-h2 font-bold text-foreground mb-4">{event.title}</h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#9B8CFF] flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-body-sm font-bold text-foreground">Date & Time</p>
                    <p className="text-body-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-body-sm text-muted-foreground">
                      {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#4ADEFF] flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-body-sm font-bold text-foreground">Location</p>
                    <p className="text-body-sm text-muted-foreground">{event.location.venue}</p>
                    <p className="text-body-sm text-muted-foreground">{event.location.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            {booking ? (
              <div className="surface-panel p-6">
                <h3 className="text-h3 font-bold text-foreground mb-4">Payment Summary</h3>
                <div className="space-y-3 mb-4">
                  {booking.tickets.map((ticket, index) => (
                    <div key={index} className="flex justify-between text-body-sm">
                      <span className="text-muted-foreground">{ticket.type} × {ticket.qty}</span>
                      <span className="font-semibold text-foreground">{booking.currency} {ticket.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                  {booking.serviceFee > 0 && (
                    <div className="flex justify-between text-body-sm">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span className="font-semibold text-foreground">{booking.currency} {booking.serviceFee.toFixed(2)}</span>
                    </div>
                  )}
                  {booking.discount > 0 && (
                    <div className="flex justify-between text-body-sm text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">-{booking.currency} {booking.discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-body font-bold text-foreground">Total Paid</span>
                  <span className="text-h3 font-bold text-[#7C5CFF]">
                    {booking.currency} {booking.total.toFixed(2)}
                  </span>
                </div>
                {booking.paymentMethod && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-caption text-muted-foreground">
                      Paid with {booking.paymentMethod.brand} ending in {booking.paymentMethod.last4}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="surface-panel p-6">
                <h3 className="text-h3 font-bold text-foreground mb-2">Booking Details</h3>
                <p className="text-body-sm text-muted-foreground mb-4">
                  Your spot is confirmed. View the event page for full details.
                </p>
                <Link to={`/app/events/${event.id}`} className="btn-primary">View event details</Link>
              </div>
            )}

            {/* Social Actions */}
            <div className="surface-panel p-6">
              <h3 className="text-h3 font-bold text-foreground mb-4">What's next?</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/app/messages"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-muted/40 hover:bg-muted/70 hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C5CFF] to-[#9B8CFF] flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-body-sm font-bold text-foreground">Event Chat</p>
                    <p className="text-caption text-muted-foreground">Meet attendees</p>
                  </div>
                </Link>
                <Link
                  to="/app/community"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-muted/40 hover:bg-muted/70 hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#4ADEFF] flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-body-sm font-bold text-foreground">Community</p>
                    <p className="text-caption text-muted-foreground">Join discussions</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Help */}
            <div className="surface-panel p-5 border border-[#7C5CFF]/15 bg-gradient-to-r from-[#7C5CFF]/5 to-[#00D4FF]/5">
              <h4 className="text-body font-bold text-foreground mb-2">Need Help?</h4>
              <p className="text-body-sm text-muted-foreground mb-4">
                Contact the event organizer or our support team if you have any questions.
              </p>
              <div className="flex gap-3">
                <Link to="/app/messages" className="btn-secondary text-body-sm">
                  Message Organizer
                </Link>
                <button className="btn-primary text-body-sm">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
