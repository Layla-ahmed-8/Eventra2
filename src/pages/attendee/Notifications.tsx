import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Award, MessageSquare, Users, Settings, Sparkles, Zap, Filter, Clock3, BadgeCheck, Flame } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { demoToast } from '../../lib/demoFeedback';
import EmptyState from '../../components/shared/EmptyState';
import { formatRelativeTime } from '../../lib/utils';

export default function Notifications() {
  const { notifications, markAllRead, currentUser } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'ai' | 'system'>('all');

  const mine = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id)
    : notifications;

  const filtered = useMemo(() => {
    switch (activeFilter) {
      case 'unread':
        return mine.filter((n) => !n.isRead);
      case 'ai':
        return mine.filter((n) => n.aiGenerated || n.type === 'ai_recommendation');
      case 'system':
        return mine.filter((n) => ['event_reminder', 'rsvp_confirmed', 'event_update', 'organizer_request', 'organizer_approved', 'organizer_rejected'].includes(n.type));
      default:
        return mine;
    }
  }, [activeFilter, mine]);

  const unreadCount = mine.filter((n) => !n.isRead).length;
  const aiCount = mine.filter((n) => n.aiGenerated || n.type === 'ai_recommendation').length;
  const latestLabel = mine[0] ? formatRelativeTime(mine[0].timestamp) : '—';

  const handleMarkAllRead = () => {
    markAllRead();
    demoToast('All caught up', 'All notifications marked as read.');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'event_reminder':    return <Calendar className="w-4 h-4 text-primary" />;
      case 'rsvp_confirmed':    return <Zap className="w-4 h-4 text-green-500" />;
      case 'badge_earned':      return <Award className="w-4 h-4 text-orange-500" />;
      case 'community_reply':   return <MessageSquare className="w-4 h-4 text-cyan-500" />;
      case 'ai_recommendation': return <Sparkles className="w-4 h-4 text-pink-500" />;
      case 'organizer_request':
      case 'organizer_approved':
      case 'organizer_rejected': return <Users className="w-4 h-4 text-primary" />;
      case 'event_update':      return <Zap className="w-4 h-4 text-orange-500" />;
      default:                  return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8 space-y-6">
        <div className="surface-panel sticky top-4 z-10 px-5 py-4 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <Link to="/app/discover" className="btn-ghost inline-flex items-center gap-2 px-3 py-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-h1 font-bold text-foreground">Notifications</h1>
                  {unreadCount > 0 && (
                    <span className="status-pill bg-red-500 text-white border-0">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <p className="text-body-sm text-muted-foreground mt-1">Keep up with event reminders, community replies, and AI suggestions.</p>
              </div>
            </div>
            <Link to="/app/profile" className="btn-secondary inline-flex items-center gap-2 px-4 py-2" title="Notification settings">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="kpi-card">
            <div className="flex items-center justify-between">
              <span className="icon-box icon-box-primary"><Bell className="w-4 h-4" /></span>
              <span className="kpi-trend text-primary"><Flame className="w-3.5 h-3.5" /> Live</span>
            </div>
            <div>
              <div className="kpi-value">{mine.length}</div>
              <div className="kpi-label">Total notifications</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="flex items-center justify-between">
              <span className="icon-box icon-box-orange"><BadgeCheck className="w-4 h-4" /></span>
              <span className="kpi-trend text-orange-500"><Clock3 className="w-3.5 h-3.5" /> Now</span>
            </div>
            <div>
              <div className="kpi-value">{unreadCount}</div>
              <div className="kpi-label">Unread messages</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="flex items-center justify-between">
              <span className="icon-box icon-box-cyan"><Sparkles className="w-4 h-4" /></span>
              <span className="kpi-trend text-cyan-500">AI</span>
            </div>
            <div>
              <div className="kpi-value">{aiCount}</div>
              <div className="kpi-label">AI-generated alerts</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="flex items-center justify-between">
              <span className="icon-box icon-box-green"><Calendar className="w-4 h-4" /></span>
              <span className="kpi-trend text-green-500">Latest</span>
            </div>
            <div>
              <div className="kpi-value text-[20px]">{latestLabel}</div>
              <div className="kpi-label">Most recent update</div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px] items-start">
          <div className="bento-section">
            <div className="bento-header gap-4 flex-wrap">
              <div className="bento-title-wrapper">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="bento-title">Recent Updates</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={() => setActiveFilter('all')} className={`filter-chip ${activeFilter === 'all' ? 'active' : 'inactive'}`}>
                  All
                </button>
                <button onClick={() => setActiveFilter('unread')} className={`filter-chip ${activeFilter === 'unread' ? 'active' : 'inactive'}`}>
                  Unread
                </button>
                <button onClick={() => setActiveFilter('ai')} className={`filter-chip ${activeFilter === 'ai' ? 'active' : 'inactive'}`}>
                  AI
                </button>
                <button onClick={() => setActiveFilter('system')} className={`filter-chip ${activeFilter === 'system' ? 'active' : 'inactive'}`}>
                  System
                </button>
                <button
                  onClick={handleMarkAllRead}
                  disabled={unreadCount === 0}
                  className="btn-secondary inline-flex items-center gap-2 px-4 py-2 disabled:opacity-50"
                >
                  Mark all as read
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {mine.length === 0 ? (
                <EmptyState icon={Bell} title="You're all caught up" description="No notifications yet." />
              ) : filtered.length === 0 ? (
                <EmptyState icon={Filter} title="No results for this filter" description="Try a different notification category." />
              ) : (
                filtered.map((n) => (
                  <Link
                    key={n.id}
                    to={n.actionUrl || '#'}
                    className={`group block rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                      n.isRead
                        ? 'bg-secondary/20 border-border/60'
                        : 'bg-primary/5 border-primary/20 shadow-[0_0_0_1px_rgba(124,92,255,0.04)]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`activity-icon-wrapper shrink-0 ${n.isRead ? '' : 'ring-2 ring-primary/10'}`}>
                        {getIcon(n.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-body-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                {n.title}
                              </p>
                              {!n.isRead && <span className="status-pill bg-primary/10 text-primary border-primary/20">New</span>}
                              {(n.aiGenerated || n.type === 'ai_recommendation') && (
                                <span className="status-pill bg-pink-500/10 text-pink-600 border-pink-500/20">AI insight</span>
                              )}
                            </div>
                            <p className="text-caption text-muted-foreground mt-1 leading-6">{n.message}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2 text-right shrink-0">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                              {formatRelativeTime(n.timestamp)}
                            </span>
                            {!n.isRead && <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_0_4px_rgba(124,92,255,0.12)]" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {mine.length > 0 && (
              <button className="w-full mt-6 py-3 text-caption font-bold text-muted-foreground hover:text-foreground transition-colors border-t border-border/50">
                View older notifications
              </button>
            )}
          </div>

          <aside className="bento-section lg:sticky lg:top-24 space-y-5">
            <div>
              <div className="bento-title-wrapper mb-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <h2 className="bento-title">Quick Summary</h2>
              </div>
              <p className="text-caption text-muted-foreground">A compact overview of what needs attention right now.</p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-border/60 bg-secondary/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-caption font-bold uppercase tracking-[0.18em] text-muted-foreground">Unread</span>
                  <span className="text-h3 font-bold text-foreground">{unreadCount}</span>
                </div>
                <p className="text-body-sm text-muted-foreground mt-2">New items still need your attention.</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-secondary/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-caption font-bold uppercase tracking-[0.18em] text-muted-foreground">AI alerts</span>
                  <span className="text-h3 font-bold text-foreground">{aiCount}</span>
                </div>
                <p className="text-body-sm text-muted-foreground mt-2">Recommendations, insights, and smart prompts.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
              <p className="text-caption font-black uppercase tracking-[0.22em] text-primary mb-2">Tip</p>
              <p className="text-body-sm text-muted-foreground leading-6">
                Use the filters to separate reminders from AI suggestions. The unread state now has a stronger visual anchor so it’s easier to scan.
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
