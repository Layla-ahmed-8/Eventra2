import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Filter,
  MessageSquareMore,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { categories } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import { BADGE_DEFINITIONS } from '../../constants/badges';
import { toast } from 'sonner';

export default function Community() {
  const { communities, toggleJoinCommunity, recordDiscussion, xp, level, earnedBadges, discussionCount, communityXP, postsCount } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [viewFilter, setViewFilter] = useState<'all' | 'joined' | 'discover'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'events' | 'name'>('popular');

  const handleToggleJoin = (id: string, name: string, currentlyJoined: boolean) => {
    toggleJoinCommunity(id);
    if (currentlyJoined) {
      toast.info(`Left ${name}.`);
    } else {
      recordDiscussion();
      toast.success(`Joined ${name}! +15 XP`);
    }
  };

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return communities
      .map((c) => ({
        ...c,
        score: c.memberCount + c.eventCount * 250 + (c.isJoined ? 1500 : 0),
      }))
      .filter((c) => {
        const matchesSearch =
          !query || [c.name, c.category, c.description].join(' ').toLowerCase().includes(query);
        const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
        const matchesView =
          viewFilter === 'all' ||
          (viewFilter === 'joined' && c.isJoined) ||
          (viewFilter === 'discover' && !c.isJoined);
        return matchesSearch && matchesCategory && matchesView;
      })
      .sort((a, b) => {
        if (sortBy === 'events') return b.eventCount - a.eventCount;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return b.score - a.score;
      });
  }, [communities, categoryFilter, searchQuery, sortBy, viewFilter]);

  const stats = useMemo(
    () => ({
      total: communities.length,
      joined: communities.filter((c) => c.isJoined).length,
      discoverable: communities.filter((c) => !c.isJoined).length,
      events: communities.reduce((sum, c) => sum + c.eventCount, 0),
    }),
    [communities]
  );

  const trendingCommunities = [...communities]
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, 3);

  // Badge progress data for the sidebar
  const earnedIds = new Set(earnedBadges.map((b) => b.id));
  const communityBadge = BADGE_DEFINITIONS.find((b) => b.id === 'badge-003');
  const voiceBadge     = BADGE_DEFINITIONS.find((b) => b.id === 'badge-009');
  const builderPct     = Math.min(100, Math.round((discussionCount / 3) * 100));
  const voicePct       = Math.min(100, Math.round((postsCount / 5) * 100));

  return (
    <div className="space-y-6">
      {/* ── Hero Header ──────────────────────────────────────────────────── */}
      <div className="rounded-[2rem] border border-border/60 bg-background/90 p-4 shadow-sm backdrop-blur-xl md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              Communities
            </div>
            <div>
              <h1 className="text-h2 md:text-h1 font-bold text-foreground leading-tight">
                Find your people.
              </h1>
              <p className="text-body-sm text-muted-foreground mt-1">
                Browse active groups, filter by interest, and join communities that match your vibe.
              </p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-2 lg:min-w-[380px]">
            {(
              [
                ['Total', stats.total],
                ['Joined', stats.joined],
                ['New', stats.discoverable],
                ['Events', stats.events],
              ] as const
            ).map(([label, count]) => (
              <div
                key={label}
                className="rounded-2xl border border-border/70 bg-background/70 backdrop-blur-sm px-3 py-2.5 text-center shadow-sm"
              >
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                  {label}
                </div>
                <div className="text-lg font-black text-foreground tabular-nums">{count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search + view/sort filters */}
        <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities or categories…"
              className="input-base w-full pl-11 pr-4 text-body h-11"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'joined', 'discover'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setViewFilter(key)}
                className={`filter-chip ${viewFilter === key ? 'active' : 'inactive'} capitalize`}
              >
                {key === 'all' ? 'All' : key === 'joined' ? 'Joined' : 'Discover'}
              </button>
            ))}
            {(['popular', 'events', 'name'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`filter-chip ${sortBy === key ? 'active' : 'inactive'} inline-flex items-center gap-1.5`}
              >
                <Filter className="w-3 h-3" />
                {key === 'popular' ? 'Popular' : key === 'events' ? 'Most Events' : 'A–Z'}
              </button>
            ))}
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`filter-chip ${categoryFilter === cat ? 'active' : 'inactive'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-6">
        {/* Left: community grid */}
        <div className="space-y-6">
          <div className="bento-section p-4 md:p-5">
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h2 className="bento-title">Communities</h2>
                <p className="text-body-sm text-muted-foreground">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-caption text-muted-foreground">
                <TrendingUp className="w-3.5 h-3.5" />
                Live groups
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-body font-semibold">No communities found</p>
                <p className="text-caption mt-1">Try a different search or filter</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {filtered.map((community) => (
                  <div
                    key={community.id}
                    className="card-surface overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col"
                  >
                    {/* Cover image — entire top section links to detail */}
                    <Link
                      to={`/app/community/${community.id}`}
                      className="relative h-36 overflow-hidden block flex-shrink-0"
                    >
                      <img
                        src={community.coverImage}
                        alt={community.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                      {/* Top-left badges */}
                      <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white shadow">
                          {community.category}
                        </span>
                        {community.isJoined && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-black uppercase tracking-widest text-white shadow">
                            Joined
                          </span>
                        )}
                      </div>

                      {/* Bottom meta */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-body font-bold text-white truncate">{community.name}</h3>
                        <p className="text-[11px] text-white/75 truncate mt-0.5">{community.description}</p>
                      </div>
                    </Link>

                    {/* Card body */}
                    <div className="p-4 flex flex-col gap-3 flex-1">
                      {/* Stats row */}
                      <div className="flex items-center justify-between text-caption text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {community.memberCount.toLocaleString()} members
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          {community.eventCount} events
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {community.tags.map((tag) => (
                          <span key={tag} className="filter-chip inactive text-[11px] py-0.5 px-2">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Member avatars + join button */}
                      <div className="flex items-center justify-between gap-3 mt-auto pt-1">
                        <div className="flex -space-x-2">
                          {community.members.slice(0, 3).map((m, i) => (
                            <img
                              key={i}
                              src={m.avatar}
                              alt={m.name}
                              title={m.name}
                              className="w-6 h-6 rounded-full border-2 border-background"
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/app/community/${community.id}`}
                            className="btn-secondary text-body-sm px-3 py-2 inline-flex items-center gap-1"
                          >
                            View
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                          <button
                            onClick={() =>
                              handleToggleJoin(community.id, community.name, community.isJoined)
                            }
                            className={`text-body-sm px-4 py-2 inline-flex items-center gap-1.5 rounded-xl font-semibold transition-all ${
                              community.isJoined
                                ? 'border-2 border-green-500/50 text-green-600 bg-green-50 dark:bg-green-900/10'
                                : 'btn-primary'
                            }`}
                          >
                            {community.isJoined && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {community.isJoined ? 'Joined' : 'Join'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Community XP & badge progress */}
          <div className="bento-section p-4 md:p-5 bg-gradient-to-br from-primary/10 via-background to-purple-500/10 border-primary/15">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <h2 className="bento-title">Your Community XP</h2>
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-3xl font-black text-foreground">{communityXP}</span>
              <span className="text-caption text-muted-foreground">community XP</span>
            </div>
            <p className="text-caption text-muted-foreground mb-4">
              Total: <span className="font-bold text-foreground">{xp.toLocaleString()} XP</span> · Level <span className="font-bold text-foreground">{level}</span>
            </p>

            {/* Badge progress */}
            <div className="space-y-3">
              {communityBadge && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{communityBadge.icon}</span>
                      <span className="text-body-sm font-semibold text-foreground">{communityBadge.name}</span>
                    </div>
                    {earnedIds.has('badge-003')
                      ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                      : <span className="text-caption text-muted-foreground">{discussionCount}/3</span>
                    }
                  </div>
                  {!earnedIds.has('badge-003') && (
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-700" style={{ width: `${builderPct}%` }} />
                    </div>
                  )}
                </div>
              )}
              {voiceBadge && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{voiceBadge.icon}</span>
                      <span className="text-body-sm font-semibold text-foreground">{voiceBadge.name}</span>
                    </div>
                    {earnedIds.has('badge-009')
                      ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                      : <span className="text-caption text-muted-foreground">{postsCount}/5</span>
                    }
                  </div>
                  {!earnedIds.has('badge-009') && (
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-700" style={{ width: `${voicePct}%` }} />
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/app/rewards/hub"
              className="mt-4 w-full btn-secondary text-body-sm inline-flex items-center justify-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5" />
              View Rewards Hub
            </Link>
          </div>

          {/* Community Highlights */}
          <div className="bento-section p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquareMore className="w-4 h-4 text-primary" />
              <h2 className="bento-title">Community Highlights</h2>
            </div>
            <div className="space-y-3">
              {[
                'Live discussions are happening right now across your joined groups.',
                'New event announcements surface first in active communities.',
                'Member-only threads keep conversations focused and useful.',
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/75 backdrop-blur-sm p-3"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-caption text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trending communities */}
          <div className="bento-section p-4 md:p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="bento-title">Trending Groups</h2>
            </div>
            <div className="space-y-3">
              {trendingCommunities.map((c) => (
                <Link
                  key={c.id}
                  to={`/app/community/${c.id}`}
                  className="flex items-center gap-3 group"
                >
                  <img
                    src={c.coverImage}
                    alt={c.name}
                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {c.name}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {c.memberCount.toLocaleString()} members
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Earn XP hint */}
          <div className="bento-section p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-primary" />
              <h2 className="bento-title">Earn XP in communities</h2>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Join a community', xp: 15 },
                { label: 'Post a discussion', xp: 15 },
                { label: 'Reply to a thread', xp: 15 },
                { label: 'Send a chat message', xp: 5 },
              ].map(({ label, xp: amt }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-caption text-muted-foreground">{label}</span>
                  <span className="text-caption font-bold text-primary">+{amt} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick join bar — joined communities */}
          {stats.joined > 0 && (
            <div className="bento-section p-4 md:p-5">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-primary" />
                <h2 className="bento-title">Your Communities</h2>
              </div>
              <div className="space-y-3">
                {communities
                  .filter((c) => c.isJoined)
                  .map((c) => (
                    <Link
                      key={c.id}
                      to={`/app/community/${c.id}`}
                      className="flex items-center gap-3 group"
                    >
                      <img
                        src={c.coverImage}
                        alt={c.name}
                        className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-body-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {c.name}
                        </p>
                        <p className="text-caption text-muted-foreground">{c.eventCount} events</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
