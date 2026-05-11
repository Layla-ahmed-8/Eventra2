import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Download, Share2, QrCode } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

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
          <h2 className="text-2xl font-bold text-foreground mb-2">Event not found</h2>
          <Link to="/app/discover" className="text-primary hover:text-primary/80">
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/app/my-events" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to My Events</span>
            </Link>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Banner */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">
            Your tickets have been reserved. Keep this summary for entry and support.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - QR Code */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 text-center">Your Ticket</h3>

              {/* QR Code Placeholder */}
              <div className="bg-gray-100 rounded-xl p-8 mb-4">
                <QrCode className="w-full h-auto text-gray-400" />
              </div>

              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                <p className="font-mono font-bold text-lg text-gray-900">
                  {booking?.bookingRef || `EVT-${event.id.toUpperCase().slice(0, 6)}`}
                </p>
              </div>

              <button className="w-full px-4 py-3 bg-[#6C4CF1] hover:bg-[#5a3dd1] text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Ticket
              </button>
            </div>
          </div>

          {/* Right Column - Event & Payment Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Event Details</h3>

              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#6C4CF1] mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Date & Time</p>
                    <p className="text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-gray-600">
                      {new Date(event.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#6C4CF1] mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location.venue}</p>
                    <p className="text-gray-600">{event.location.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {booking ? (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h3>

                <div className="space-y-3 mb-4">
                  {booking.tickets.map((ticket, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">
                        {ticket.type} x {ticket.qty}
                      </span>
                      <span className="font-semibold">
                        {booking.currency} {ticket.subtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}

                  {booking.serviceFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-semibold">
                        {booking.currency} {booking.serviceFee.toFixed(2)}
                      </span>
                    </div>
                  )}

                  {booking.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">
                        -{booking.currency} {booking.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Paid</span>
                  <span className="text-2xl font-bold text-[#6C4CF1]">
                    {booking.currency} {booking.total.toFixed(2)}
                  </span>
                </div>

                {booking.paymentMethod && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Paid with {booking.paymentMethod.brand} ending in{' '}
                      {booking.paymentMethod.last4}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Details</h3>
                <p className="text-gray-600 mb-4">
                  We couldn’t find a stored booking for this event, but your ticket details can still be accessed through the event page.
                </p>
                <Link
                  to={`/app/events/${event.id}`}
                  className="inline-flex items-center gap-2 px-4 py-3 bg-[#6C4CF1] text-white rounded-lg hover:bg-[#5a3dd1] transition"
                >
                  View event details
                </Link>
              </div>
            )}

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-2">Need Help?</h4>
              <p className="text-gray-600 mb-4">
                Contact the event organizer or our support team if you have any questions.
              </p>
              <div className="flex gap-3">
                <Link
                  to="/app/messages"
                  className="px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 font-semibold"
                >
                  Message Organizer
                </Link>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/app/my-events" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to My Events</span>
            </Link>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Banner */}
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">
            Your tickets have been sent to your email
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - QR Code */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 text-center">Your Ticket</h3>

              {/* QR Code Placeholder */}
              <div className="bg-gray-100 rounded-xl p-8 mb-4">
                <QrCode className="w-full h-auto text-gray-400" />
              </div>

              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
                <p className="font-mono font-bold text-lg text-gray-900">
                  {booking.bookingRef}
                </p>
              </div>

              <button className="w-full px-4 py-3 bg-[#6C4CF1] hover:bg-[#5a3dd1] text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Ticket
              </button>
            </div>
          </div>

          {/* Right Column - Event & Payment Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Event Details</h3>

              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h2>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#6C4CF1] mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Date & Time</p>
                    <p className="text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-gray-600">
                      {new Date(event.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#6C4CF1] mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location.venue}</p>
                    <p className="text-gray-600">{event.location.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Summary</h3>

              <div className="space-y-3 mb-4">
                {booking.tickets.map((ticket, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-gray-600">
                      {ticket.type} x {ticket.qty}
                    </span>
                    <span className="font-semibold">
                      {booking.currency} {ticket.subtotal.toFixed(2)}
                    </span>
                  </div>
                ))}

                {booking.serviceFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-semibold">
                      {booking.currency} {booking.serviceFee.toFixed(2)}
                    </span>
                  </div>
                )}

                {booking.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">
                      -{booking.currency} {booking.discount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Paid</span>
                <span className="text-2xl font-bold text-[#6C4CF1]">
                  {booking.currency} {booking.total.toFixed(2)}
                </span>
              </div>

              {booking.paymentMethod && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Paid with {booking.paymentMethod.brand} ending in{' '}
                    {booking.paymentMethod.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Help */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <h4 className="font-bold text-gray-900 mb-2">Need Help?</h4>
              <p className="text-gray-600 mb-4">
                Contact the event organizer or our support team if you have any questions
              </p>
              <div className="flex gap-3">
                <Link
                  to="/app/messages"
                  className="px-4 py-2 bg-white border-2 border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 font-semibold"
                >
                  Message Organizer
                </Link>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
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
