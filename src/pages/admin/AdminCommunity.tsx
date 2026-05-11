import { Flag, Check, X, Eye } from 'lucide-react';

const flaggedContent = [
  {
    id: 1,
    type: 'post',
    content: 'This event looks amazing! Can\'t wait to attend...',
    author: 'John Doe',
    reason: 'Spam',
    reports: 3,
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    type: 'comment',
    content: 'Check out my website for similar events...',
    author: 'Jane Smith',
    reason: 'Promotional spam',
    reports: 5,
    timestamp: '4 hours ago',
  },
  {
    id: 3,
    type: 'post',
    content: 'This is the worst event I\'ve ever seen...',
    author: 'Mike Johnson',
    reason: 'Harassment',
    reports: 2,
    timestamp: '1 day ago',
  },
];

export default function AdminCommunity() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-h1 font-bold text-foreground">Community Moderation</h1>
        <p className="text-body text-muted-foreground mt-1">Review flagged content and moderator actions</p>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="surface-panel p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-caption text-muted-foreground">Pending Flags</p>
              <Flag className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-display font-semibold text-foreground">8</p>
          </div>
          <div className="surface-panel p-5">
            <p className="text-caption text-muted-foreground mb-3">Resolved Today</p>
            <p className="text-display font-semibold text-green-600">24</p>
          </div>
          <div className="surface-panel p-5">
            <p className="text-caption text-muted-foreground mb-3">Total Reports</p>
            <p className="text-display font-semibold text-foreground">147</p>
          </div>
          <div className="surface-panel p-5">
            <p className="text-caption text-muted-foreground mb-3">Response Time</p>
            <p className="text-display font-semibold text-foreground">2.4h</p>
          </div>
        </div>

        <div className="surface-panel p-6 border-red-100 border">
          <h2 className="text-h2 font-semibold text-foreground mb-6">Flagged Content</h2>

          <div className="space-y-4">
            {flaggedContent.map((item) => (
              <div
                key={item.id}
                className="surface-panel border border-red-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Flag className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {item.type === 'post' ? 'Discussion Post' : 'Comment'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        by {item.author} • {item.timestamp}
                      </p>
                    </div>
                  </div>
                  <span className="status-pill bg-red-100 text-red-700">
                    {item.reports} reports
                  </span>
                </div>

                <div className="rounded-3xl bg-background p-4 mb-4">
                  <p className="text-body text-muted-foreground">{item.content}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-red-700 font-semibold">
                    Reason: {item.reason}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="btn-primary bg-green-600 hover:bg-green-700">
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button className="btn-primary bg-red-600 hover:bg-red-700">
                    <X className="w-4 h-4" />
                    Remove
                  </button>
                  <button className="btn-secondary flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Context
                  </button>
                  <button className="btn-secondary border-orange-300 text-orange-700 hover:border-orange-400">
                    Warn User
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-panel p-6">
          <h2 className="text-h2 font-semibold text-foreground mb-4">Recent Moderator Actions</h2>
          <div className="space-y-3">
            {[
              { action: 'Removed spam comment', user: 'Sarah Ahmed', time: '10 minutes ago' },
              { action: 'Approved discussion post', user: 'Mohamed Ali', time: '1 hour ago' },
              { action: 'Warned user for harassment', user: 'John Doe', time: '2 hours ago' },
            ].map((action, index) => (
              <div
                key={index}
                className="surface-panel p-4 border border-border"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-body text-muted-foreground">
                    <span className="font-semibold text-foreground">{action.action}</span> • {action.user}
                  </p>
                  <p className="text-sm text-muted-foreground">{action.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
