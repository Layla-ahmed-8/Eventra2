import { Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Search, Flag, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const moderationItems = [
  {
    id: 'mod-001',
    type: 'Content flag',
    title: 'Event description includes unsupported claims',
    source: 'AI moderation engine',
    urgency: 'high',
    status: 'Pending review',
    flaggedAt: '5 minutes ago',
  },
  {
    id: 'mod-002',
    type: 'User report',
    title: 'Inappropriate chat behavior in event room',
    source: 'User report',
    urgency: 'medium',
    status: 'Pending review',
    flaggedAt: '18 minutes ago',
  },
  {
    id: 'mod-003',
    type: 'Suspicious organizer signup',
    title: 'New organizer request needs fraud review',
    source: 'AI risk scoring',
    urgency: 'high',
    status: 'Escalated',
    flaggedAt: '32 minutes ago',
  },
];

export default function AdminModeration() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Moderation Center</h1>
            <p className="text-muted-foreground">Review flagged content, AI spam signals, and quality reports across the platform.</p>
          </div>
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-[#6C4CF1]/10 to-[#00C2FF]/10 px-4 py-3 text-sm font-semibold text-primary">
            AI trust score: 92%
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="grid lg:grid-cols-[1.6fr_0.9fr] gap-6">
          <div className="bg-card border border-border rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-primary" />
                <div>
                  <h2 className="text-xl font-bold text-foreground">Pending reviews</h2>
                  <p className="text-sm text-muted-foreground">Focus on highest-risk items first.</p>
                </div>
              </div>
              <button className="btn-secondary flex items-center gap-2">
                <Search className="w-4 h-4" />
                Search flags
              </button>
            </div>

            <div className="space-y-4">
              {moderationItems.map((item) => (
                <div key={item.id} className="rounded-3xl border border-border p-5 bg-background shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{item.type}</p>
                      <h3 className="text-lg font-semibold text-foreground mt-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">Source: {item.source}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.urgency === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                        {item.urgency}
                      </span>
                      <p className="text-xs text-muted-foreground mt-2">{item.flaggedAt}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button className="btn-primary text-sm">Approve</button>
                    <button className="btn-secondary text-sm">Escalate</button>
                    <button className="border border-border text-sm rounded-2xl px-4 py-2">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-card border border-border rounded-3xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">AI moderation signals</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span>High-risk content is auto-flagged using toxicity and fraud models.</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Moderators can override AI decisions and provide feedback to improve models.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Flag className="w-4 h-4 text-primary" />
                  <span>Escalations are prioritized by urgency, user reputation, and community impact.</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Quick actions</h3>
              <div className="space-y-3">
                <button className="btn-secondary w-full">View user reports</button>
                <button className="btn-secondary w-full">Review community health</button>
                <button className="btn-secondary w-full">Access audit log</button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
