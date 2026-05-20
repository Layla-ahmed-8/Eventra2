import { useState } from 'react';
import { Flag, Check, X, Eye, MessageSquare, Zap, Activity } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmationModal from '../../components/business/ConfirmationModal';

type FlaggedItem = {
  id: number;
  type: string;
  content: string;
  author: string;
  reason: string;
  reports: number;
  timestamp: string;
};

const INITIAL_FLAGGED: FlaggedItem[] = [
  { id: 1, type: 'post', content: "This event looks amazing! Can't wait to attend...", author: 'John Doe', reason: 'Spam', reports: 3, timestamp: '2 hours ago' },
  { id: 2, type: 'comment', content: 'Check out my website for similar events...', author: 'Jane Smith', reason: 'Promotional spam', reports: 5, timestamp: '4 hours ago' },
  { id: 3, type: 'post', content: "This is the worst event I've ever seen...", author: 'Mike Johnson', reason: 'Harassment', reports: 2, timestamp: '1 day ago' },
];

type PendingAction = { type: 'approve' | 'remove' | 'warn'; item: FlaggedItem };

export default function AdminCommunity() {
  const [flaggedContent, setFlaggedContent] = useState<FlaggedItem[]>(INITIAL_FLAGGED);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const resolveItem = (id: number) => setFlaggedContent((prev) => prev.filter((i) => i.id !== id));

  const handleConfirm = () => {
    if (!pendingAction) return;
    const { type, item } = pendingAction;
    if (type === 'approve') {
      resolveItem(item.id);
      toast.success(`Content by ${item.author} approved and flag cleared.`);
    } else if (type === 'remove') {
      resolveItem(item.id);
      toast.success(`Content by ${item.author} removed from the platform.`);
    } else {
      resolveItem(item.id);
      toast.info(`Warning sent to ${item.author}.`);
    }
    setPendingAction(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold text-foreground">Community Moderation</h1>
        <p className="text-body text-muted-foreground mt-1">Review flagged content and moderator actions</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pending Flags', value: flaggedContent.length, icon: Flag, bg: 'icon-box-red' },
          { label: 'Resolved Today', value: INITIAL_FLAGGED.length - flaggedContent.length + 24, icon: Check, bg: 'icon-box-green' },
          { label: 'Total Reports', value: 147, icon: MessageSquare, bg: 'icon-box-primary' },
          { label: 'Response Time', value: '2.4h', icon: Zap, bg: 'icon-box-cyan' },
        ].map((stat) => (
          <div key={stat.label} className="kpi-card">
            <div className="flex items-center justify-between">
              <div className={`icon-box ${stat.bg}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <p className="kpi-value">{stat.value}</p>
              <p className="kpi-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bento-section">
        <div className="bento-header">
          <div className="bento-title-wrapper">
            <Flag className="w-5 h-5 text-red-500" />
            <h2 className="bento-title">Flagged Content</h2>
          </div>
        </div>

        {flaggedContent.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-body-sm">
            All flagged content has been reviewed. Great work!
          </div>
        ) : (
          <div className="space-y-4">
            {flaggedContent.map((item) => (
              <div key={item.id} className="card-surface p-5 hover:border-red-200 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                      <Flag className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-body-sm font-black text-foreground uppercase tracking-tight">
                        {item.type === 'post' ? 'Discussion Post' : 'Comment'}
                      </p>
                      <p className="text-caption text-muted-foreground mt-0.5">
                        by <span className="text-foreground font-semibold">{item.author}</span> • {item.timestamp}
                      </p>
                    </div>
                  </div>
                  <span className="status-pill bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 font-black uppercase text-[10px]">
                    {item.reports} reports
                  </span>
                </div>

                <div className="rounded-2xl bg-secondary/30 p-4 border border-border/50 mb-4">
                  <p className="text-body-sm text-foreground leading-relaxed italic">"{item.content}"</p>
                </div>

                <div className="mb-4">
                  <p className="text-caption text-red-600 font-black uppercase tracking-widest">Reason: {item.reason}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                  <button
                    onClick={() => setPendingAction({ type: 'approve', item })}
                    className="btn-primary text-body-sm inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => setPendingAction({ type: 'remove', item })}
                    className="btn-secondary text-body-sm inline-flex items-center gap-1.5 text-red-500 hover:text-red-600 hover:border-red-200"
                  >
                    <X className="w-4 h-4" />
                    Remove
                  </button>
                  <button
                    onClick={() => toast.info(`Showing context for ${item.author}'s ${item.type} (demo).`)}
                    className="btn-secondary text-body-sm inline-flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" />
                    Context
                  </button>
                  <button
                    onClick={() => setPendingAction({ type: 'warn', item })}
                    className="btn-secondary text-body-sm border-orange-300 text-orange-700 hover:border-orange-400"
                  >
                    Warn User
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bento-section">
        <div className="bento-header">
          <div className="bento-title-wrapper">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="bento-title">Recent Moderator Actions</h2>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { action: 'Removed spam comment', user: 'Sarah Ahmed', time: '10 minutes ago' },
            { action: 'Approved discussion post', user: 'Mohamed Ali', time: '1 hour ago' },
            { action: 'Warned user for harassment', user: 'John Doe', time: '2 hours ago' },
          ].map((action, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon-wrapper">
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-body-sm font-bold text-foreground truncate">{action.action}</p>
                  <span className="text-caption text-muted-foreground whitespace-nowrap">{action.time}</span>
                </div>
                <p className="text-caption text-muted-foreground">Moderator: {action.user}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation modals */}
      <ConfirmationModal
        open={pendingAction?.type === 'approve'}
        onOpenChange={(open) => { if (!open) setPendingAction(null); }}
        title="Approve Content"
        message={`Approve this ${pendingAction?.item.type} by ${pendingAction?.item.author}? The flag will be cleared and the content will remain visible.`}
        confirmLabel="Approve"
        onConfirm={handleConfirm}
      />
      <ConfirmationModal
        open={pendingAction?.type === 'remove'}
        onOpenChange={(open) => { if (!open) setPendingAction(null); }}
        title="Remove Content"
        message={`Remove this ${pendingAction?.item.type} by ${pendingAction?.item.author}? It will be hidden from the platform.`}
        confirmLabel="Remove"
        destructive
        onConfirm={handleConfirm}
      />
      <ConfirmationModal
        open={pendingAction?.type === 'warn'}
        onOpenChange={(open) => { if (!open) setPendingAction(null); }}
        title="Warn User"
        message={`Send a warning to ${pendingAction?.item.author} about their ${pendingAction?.item.type}? They will receive an in-app notification.`}
        confirmLabel="Send Warning"
        onConfirm={handleConfirm}
      />
    </div>
  );
}
