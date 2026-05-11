import { ShieldAlert, ShieldCheck, Search, Flag, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const moderationItems = [
  { id: 'mod-001', type: 'Content flag', title: 'Event description includes unsupported claims', source: 'AI moderation engine', urgency: 'high', status: 'Pending review', flaggedAt: '5 minutes ago' },
  { id: 'mod-002', type: 'User report', title: 'Inappropriate chat behavior in event room', source: 'User report', urgency: 'medium', status: 'Pending review', flaggedAt: '18 minutes ago' },
  { id: 'mod-003', type: 'Suspicious organizer signup', title: 'New organizer request needs fraud review', source: 'AI risk scoring', urgency: 'high', status: 'Escalated', flaggedAt: '32 minutes ago' },
];

export default function AdminModeration() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">Moderation Center</h1>
          <p className="text-body text-muted-foreground mt-1">Review flagged content, AI spam signals, and quality reports.</p>
        </div>
        <div className="surface-panel px-4 py-2 self-start sm:self-auto">
          <span className="text-body-sm font-semibold text-primary">AI trust score: 92%</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
        {/* Main Panel */}
        <div className="surface-panel p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-h2 font-bold text-foreground">Pending reviews</h2>
                <p className="text-caption text-muted-foreground">Focus on highest-risk items first.</p>
              </div>
            </div>
            <button className="btn-secondary flex items-center gap-2 self-start sm:self-auto">
              <Search className="w-4 h-4" />
              Search flags
            </button>
          </div>

          <div className="space-y-4">
            {moderationItems.map((item) => (
              <div key={item.id} className="card-surface p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-caption text-muted-foreground">{item.type}</p>
                    <h3 className="text-body font-semibold text-foreground mt-1">{item.title}</h3>
                    <p className="text-caption text-muted-foreground mt-1">Source: {item.source}</p>
                  </div>
                  <div className="flex sm:flex-col sm:items-end gap-2">
                    <span className={`status-pill ${item.urgency === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'}`}>
                      {item.urgency}
                    </span>
                    <p className="text-caption text-muted-foreground">{item.flaggedAt}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className="btn-primary text-body-sm">Approve</button>
                  <button className="btn-secondary text-body-sm">Escalate</button>
                  <button className="btn-secondary text-body-sm">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="surface-panel p-5">
            <h3 className="text-h3 font-bold text-foreground mb-4">AI moderation signals</h3>
            <div className="space-y-3 text-body-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>High-risk content is auto-flagged using toxicity and fraud models.</span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Moderators can override AI decisions and provide feedback to improve models.</span>
              </div>
              <div className="flex items-start gap-3">
                <Flag className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Escalations are prioritized by urgency, user reputation, and community impact.</span>
              </div>
            </div>
          </div>

          <div className="surface-panel p-5">
            <h3 className="text-h3 font-bold text-foreground mb-4">Quick actions</h3>
            <div className="space-y-2">
              <button className="btn-secondary w-full">View user reports</button>
              <button className="btn-secondary w-full">Review community health</button>
              <button className="btn-secondary w-full">Access audit log</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
