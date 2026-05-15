import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Image, DollarSign, CheckCircle } from 'lucide-react';
import { categories } from '../../data/mockData';
import { demoToast } from '../../lib/demoFeedback';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    time: '',
    venue: '',
    address: '',
    city: '',
    description: '',
    image: '',
    capacity: 100,
    ticketPrice: 0,
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePublish = () => {
    demoToast('Event published', 'In this demo, new events are not persisted to the catalog. Review flows on My Events.');
    navigate('/organizer/events');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/organizer/events')}
            className="btn-ghost flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Cancel</span>
          </button>
          <div>
            <h1 className="text-h1 font-bold text-foreground">Create Event</h1>
            <p className="text-body text-muted-foreground">Step {step} of {totalSteps}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#6C4CF1] to-[#00C2FF] transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>
        <div className="surface-panel p-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-h2 font-semibold text-foreground mb-2">Event Details</h2>
                <p className="text-body text-muted-foreground">Tell us about your event</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 input-base"
                  placeholder="e.g., Summer Music Festival 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 input-base"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 input-base"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 input-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-h2 font-semibold text-foreground mb-2">Location</h2>
                <p className="text-body text-muted-foreground">Where will your event take place?</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Venue Name *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 input-base"
                    placeholder="e.g., Cairo Opera House"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 input-base"
                  placeholder="e.g., 1 Gezira St, Zamalek"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 input-base"
                  placeholder="e.g., Cairo"
                />
              </div>
            </div>
          )}

          {/* Step 3: Description & Image */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-h2 font-semibold text-foreground mb-2">Description & Media</h2>
                <p className="text-body text-muted-foreground">Add details and visuals for your event</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 input-base min-h-[160px] resize-none"
                  placeholder="Describe what makes your event special..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Image URL
                </label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 input-base"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Ticketing */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-h2 font-semibold text-foreground mb-2">Ticketing</h2>
                <p className="text-body text-muted-foreground">Set up tickets and pricing</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Capacity *
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  className="w-full px-4 py-3 input-base"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket Price (EGP) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({ ...formData, ticketPrice: Number(e.target.value) })}
                      className="w-full pl-10 pr-4 py-3 input-base"
                    placeholder="0 for free events"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Enter 0 for free events
                </p>
              </div>

              <div className="surface-panel p-4 border border-[#E9E4FF]">
                <h4 className="font-semibold text-foreground mb-2">Preview</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>{formData.title || 'Your Event'}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  {formData.date && formData.time
                    ? `${formData.date} at ${formData.time}`
                    : 'Date & Time TBD'}
                </p>
                <p className="text-sm text-gray-600">
                  {formData.venue || 'Venue TBD'}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Capacity: {formData.capacity} • Price:{' '}
                  {formData.ticketPrice === 0 ? 'Free' : `EGP ${formData.ticketPrice}`}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-3 mt-8 pt-6 border-t md:flex-row md:items-center md:justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-secondary"
              >
                Back
              </button>
            )}
            <div className="ml-auto">
              {step < totalSteps ? (
                <button
                  onClick={handleNext}
                  className="btn-primary"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  className="btn-primary bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-5 h-5" />
                  Publish Event
                </button>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
