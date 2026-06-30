import { Link, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ArrowLeft, Calendar, MapPin, Download, Share2, Wallet, Tag, Gift,
  MessageSquare, Users, CheckCircle2,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { demoToast, downloadTextFile, shareOrCopyLink } from '../../lib/demoFeedback';

export default function OrderSummary() {
  const { bookingId, id } = useParams<{ bookingId?: string; id?: string }>();
  const routeId = bookingId || id;
  const { events, bookings } = useAppStore();

  const booking = bookings.find((b) => b.eventId === routeId || b.id === routeId);
  const event = events.find((e) => e.id === routeId || (booking && booking.eventId === e.id));

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-h2 font-bold text-foreground mb-2">Event not found</h2>
          <Link to="/app/discover" className="text-primary hover:underline">Back to Discover</Link>
        </div>
      </div>
    );
  }

  const ref = booking?.bookingRef || `EVT-${event.id.toUpperCase().slice(0, 6)}`;
  const qrPayload = JSON.stringify(booking?.qrData ?? { eventId: event.id, bookingRef: ref });

  const handleDownloadIcs = () => {
    const start = new Date(event.date);
    const end = new Date(event.endDate || event.date);
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
      `DTSTART:${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:${event.title}`,
      `LOCATION:${event.location.venue}`,
      `DESCRIPTION:Booking ref ${ref}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    downloadTextFile(`eventra-${ref}.ics`, ics);
    demoToast('Calendar file', 'Downloaded .ics file — open it to add to your calendar.');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="surface-panel sticky top-0 z-10 border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/app/my-events" className="btn-ghost inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> My Events
          </Link>
          <div className="flex gap-2">
            <button type="button" className="btn-ghost p-2" onClick={() => shareOrCopyLink(`Ticket: ${event.title}`, 'Join me on Eventra', window.location.href)}>
              <Share2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="btn-ghost p-2"
              onClick={() => downloadTextFile(`eventra-ticket-${ref}.txt`, `Event: ${event.title}\nRef: ${ref}\n${booking ? `Total: ${booking.currency} ${booking.total}` : ''}`)}
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        <div className="bento-section border-green-500/20 bg-green-500/5 text-center py-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-h1 font-bold text-foreground mb-2">Booking Confirmed</h1>
          <p className="text-body text-muted-foreground">Reference: <span className="font-mono font-bold text-foreground">{ref}</span></p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bento-section sticky top-24 text-center">
              <h3 className="text-h3 font-bold mb-4">Your Entry Ticket</h3>
              <div className="bg-white p-4 rounded-2xl inline-block mb-4">
                <QRCodeSVG value={qrPayload} size={180} level="M" />
              </div>
              <p className="text-micro text-muted-foreground mb-4">Show this QR code at the venue</p>
              <button type="button" className="btn-primary w-full" onClick={() => window.print()}>
                <Download className="w-4 h-4" /> Download / Print
              </button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bento-section">
              <h3 className="text-h3 font-bold mb-4">Event Details</h3>
              <img src={event.image} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />
              <h2 className="text-h2 font-bold mb-4">{event.title}</h2>
              <div className="space-y-3 text-body-sm">
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-muted-foreground">{new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">{event.location.venue}</p>
                    <p className="text-muted-foreground">{event.location.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {booking && (
              <div className="bento-section">
                <h3 className="text-h3 font-bold mb-4">Payment Summary</h3>
                <div className="space-y-2 text-body-sm mb-4">
                  {booking.tickets.map((t, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-muted-foreground">{t.type} × {t.qty}</span>
                      <span className="font-semibold">EGP {t.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                  {booking.serviceFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service fee</span>
                      <span>EGP {booking.serviceFee.toFixed(2)}</span>
                    </div>
                  )}
                  {booking.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center gap-1">
                        {booking.voucherCode ? <Gift className="w-3.5 h-3.5" /> : <Tag className="w-3.5 h-3.5" />}
                        Discount {booking.voucherCode ? `(${booking.voucherCode})` : booking.promoCode ? `(${booking.promoCode})` : ''}
                      </span>
                      <span>−EGP {booking.discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="text-h4 font-bold">Total paid</span>
                  <span className="text-h2 font-bold gradient-text">EGP {booking.total.toFixed(2)}</span>
                </div>
                {booking.paymentMethod?.brand === 'Wallet' ? (
                  <p className="mt-4 text-body-sm text-muted-foreground flex items-center gap-2">
                    <Wallet className="w-4 h-4" /> Paid with Eventra Wallet
                  </p>
                ) : booking.paymentMethod ? (
                  <p className="mt-4 text-body-sm text-muted-foreground">
                    Paid with {booking.paymentMethod.brand} •••• {booking.paymentMethod.last4}
                  </p>
                ) : booking.total === 0 ? (
                  <p className="mt-4 text-body-sm text-green-600">Free registration — no payment required</p>
                ) : null}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button onClick={handleDownloadIcs} className="btn-primary">Add to Calendar</button>
              <Link to={`/app/community/${event.communityId}`} className="btn-secondary inline-flex items-center gap-2">
                <Users className="w-4 h-4" /> Join Community
              </Link>
              <Link to="/app/messages" className="btn-ghost inline-flex items-center gap-2">
                <MessageSquare className="w-4 h-4" /> Message Organizer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
