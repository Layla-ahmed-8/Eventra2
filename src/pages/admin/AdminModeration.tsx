
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Search, Flag, CheckCircle2, XCircle, AlertTriangle, Zap } from 'lucide-react';
import { demoToast, demoInfo } from '../../lib/demoFeedback';


type ModItem = {
  id: string;
  type: string;
  title: string;
  source: string;
  urgency: 'high' | 'medium' | 'low';
  status: string;
  flaggedAt: string;
};

const seedItems: ModItem[] = [
  { id: 'mod-001', type: 'Content flag', title: 'Event description includes unsupported claims', source: 'AI moderation engine', urgency: 'high', status: 'Pending review', flaggedAt: '5 minutes ago' },
  { id: 'mod-002', type: 'User report', title: 'Inappropriate chat behavior in event room', source: 'User report', urgency: 'medium', status: 'Pending review', flaggedAt: '18 minutes ago' },
  { id: 'mod-003', type: 'Suspicious organizer signup', title: 'New organizer request needs fraud review', source: 'AI risk scoring', urgency: 'high', status: 'Escalated', flaggedAt: '32 minutes ago' },
];

export default function AdminModeration() {
  const [items, setItems] = useState<ModItem[]>(seedItems);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.type.toLowerCase().includes(q) ||
        i.source.toLowerCase().includes(q)
    );
  }, [items, query]);

  const remove = (id: string, action: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    demoToast(action, 'Queue updated for this demo session.');
  };

  return (

    <div className="space-y-6">
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
        <div className="bento-section">
          <div className="bento-header">
            <div className="bento-title-wrapper">
              <ShieldAlert className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <h2 className="bento-title">Pending reviews</h2>
                <p className="text-caption text-muted-foreground">Focus on highest-risk items first.</p>
              </div>
            </div>
            <div className="relative w-full sm:max-w-xs self-start sm:self-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search flags…"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-body-sm"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-body-sm">
              {items.length === 0 ? 'Queue is clear. Great work.' : 'No items match your search.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((item) => (
                <div key={item.id} className="card-surface p-5 hover:border-primary/20 transition-all">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-caption text-muted-foreground uppercase tracking-widest font-black">{item.type}</p>
                      <h3 className="text-body font-bold text-foreground mt-1">{item.title}</h3>
                      <p className="text-caption text-muted-foreground mt-1">Source: {item.source}</p>
                    </div>
                    <div className="flex sm:flex-col sm:items-end gap-2">
                      <span
                        className={`status-pill px-3 py-1 font-black uppercase text-[10px] ${
                          item.urgency === 'high'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                        }`}
                      >
                        {item.urgency}
                      </span>
                      <p className="text-caption text-muted-foreground font-semibold">{item.flaggedAt}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn-primary text-body-sm inline-flex items-center gap-1.5"
                      onClick={() => remove(item.id, 'Item resolved')}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Approve / Resolve
                    </button>
                    <button
                      type="button"
                      className="btn-secondary text-body-sm"
                      onClick={() => demoInfo('Escalated', 'In a full build this would assign a senior moderator and notify legal.')}
                    >
                      Escalate
                    </button>
                    <button
                      type="button"
                      className="btn-secondary text-body-sm inline-flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:border-red-200"
                      onClick={() => remove(item.id, 'Item dismissed')}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bento-section">
            <h3 className="bento-title mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              AI moderation signals
            </h3>
            <div className="space-y-4 text-body-sm text-muted-foreground">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10">
                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>High-risk content is auto-flagged using toxicity and fraud models.</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Moderators can override AI decisions and provide feedback to improve models.</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                <Flag className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>Escalations are prioritized by urgency, user reputation, and community impact.</span>
              </div>
            </div>
          </div>

          <div className="bento-section">
            <h3 className="bento-title mb-4">Quick actions</h3>
            <div className="space-y-2">
              <Link to="/admin/users" className="btn-secondary w-full text-center text-body-sm">
                View user reports
              </Link>
              <Link to="/admin/community" className="btn-secondary w-full text-center text-body-sm">
                Review community health
              </Link>
              <Link to="/admin/audit-log" className="btn-secondary w-full text-center text-body-sm">
                Access audit log
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

