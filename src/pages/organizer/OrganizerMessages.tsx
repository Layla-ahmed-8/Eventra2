import { Send, Users } from 'lucide-react';

export default function OrganizerMessages() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-h1 font-bold text-foreground">Messages</h1>
        <p className="text-body text-muted-foreground mt-1">Communicate with your event attendees</p>
      </div>
        <div className="surface-panel p-8 space-y-8">
          <div>
            <h2 className="text-h2 font-semibold text-foreground mb-2">
              Send Message to Attendees
            </h2>
            <p className="text-body text-muted-foreground">
              Share event updates with your registered audience.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Select Event
              </label>
              <select className="w-full px-4 py-3 input-base">
                <option>Cairo Jazz Night: Live at Sunset</option>
                <option>AI & Machine Learning Summit 2026</option>
                <option>Street Food Festival</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Recipients
              </label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-3xl cursor-pointer hover:border-[#6C4CF1]">
                  <input type="radio" name="recipients" defaultChecked className="accent-[#6C4CF1]" />
                  <span className="text-body text-foreground">All Attendees (142)</span>
                </label>
                <label className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-3xl cursor-pointer hover:border-[#6C4CF1]">
                  <input type="radio" name="recipients" className="accent-[#6C4CF1]" />
                  <span className="text-body text-foreground">VIP Only (12)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Subject
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 input-base"
                placeholder="e.g., Important Update About Your Event"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Message
              </label>
              <textarea
                rows={8}
                className="w-full px-4 py-3 input-base resize-none"
                placeholder="Type your message here..."
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="btn-primary flex-1 justify-center">
                <Send className="w-5 h-5" />
                Send Message
              </button>
              <button className="btn-secondary w-full sm:w-auto">
                Save Draft
              </button>
            </div>
          </div>

          <div className="border-t border-border pt-8 space-y-4">
            <div>
              <h3 className="text-h3 font-semibold text-foreground mb-2">Recent Messages</h3>
              <p className="text-body text-muted-foreground">
                Review the latest communications sent to your attendees.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  subject: 'Event Reminder - Tomorrow!',
                  event: 'Cairo Jazz Night',
                  sent: '2 hours ago',
                  recipients: 142,
                },
                {
                  subject: 'Parking Information',
                  event: 'AI & ML Summit',
                  sent: '1 day ago',
                  recipients: 387,
                },
              ].map((msg, index) => (
                <div
                  key={index}
                  className="surface-panel p-4 border border-border flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-foreground">{msg.subject}</p>
                    <p className="text-sm text-muted-foreground">
                      {msg.event} • {msg.sent}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{msg.recipients} recipients</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
