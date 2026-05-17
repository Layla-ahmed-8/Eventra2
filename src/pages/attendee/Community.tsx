import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Filter, MessageSquareMore, Search, Sparkles, TrendingUp, Users } from 'lucide-react';
import { mockCommunities, categories } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import { toast } from 'sonner';

export default function Community() {
  const { recordDiscussion } = useAppStore();
  const [joinedIds, setJoinedIds] = useState<Set<string>>(
    () => new Set(mockCommunities.filter((c) => c.isJoined).map((c) => c.id))
  );
  const [suggestedJoined, setSuggestedJoined] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [viewFilter, setViewFilter] = useState<'all' | 'joined' | 'discover'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'events' | 'name'>('popular');

  const toggleJoin = (id: string, name: string) => {
    setJoinedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info(`Left ${name}.`);
      } else {
        next.add(id);
        recordDiscussion();
        toast.success(`Joined ${name}! +15 XP`);
      }
      return next;
    });
  };

  const toggleSuggestedJoin = (index: number, name: string) => {
    setSuggestedJoined((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
        toast.info(`Left ${name}.`);
      } else {
        next.add(index);
        recordDiscussion();
        toast.success(`Joined ${name}! +15 XP`);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return mockCommunities
      .map((community) => ({
        ...community,
        isJoined: joinedIds.has(community.id),
        score: community.memberCount + community.eventCount * 250 + (joinedIds.has(community.id) ? 1500 : 0),
      }))
      .filter((community) => {
        const matchesSearch =
          !query ||
          [community.name, community.category, community.description].join(' ').toLowerCase().includes(query);
        const matchesCategory = categoryFilter === 'All' || community.category === categoryFilter;
        const matchesView =
          viewFilter === 'all' ||
          (viewFilter === 'joined' && community.isJoined) ||
          (viewFilter === 'discover' && !community.isJoined);

        return matchesSearch && matchesCategory && matchesView;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'events':
            return b.eventCount - a.eventCount;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'popular':
          default:
            return b.score - a.score;
        }
      });
  }, [categoryFilter, joinedIds, searchQuery, sortBy, viewFilter]);

  const stats = useMemo(
    () => ({
      total: mockCommunities.length,
      joined: joinedIds.size,
      discoverable: mockCommunities.length - joinedIds.size,
      events: mockCommunities.reduce((sum, community) => sum + community.eventCount, 0),
    }),
    [joinedIds]
  );

  return (
    <div className="space-y-6">
      <div className="hero-surface p-4 md:p-5 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2 max-w-3xl">
            <Link to="/app/discover" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-body-sm font-semibold">
              <ArrowLeft className="w-4 h-4" />
              Back to Discover
            </Link>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-body-sm font-bold uppercase tracking-wider">
              <Users className="w-4 h-4" />
              Communities
            </div>
            <div>
              <h1 className="text-h2 md:text-h1 font-bold text-foreground">Find your people and join the conversations that matter.</h1>
              <p className="text-body-sm text-muted-foreground mt-1 max-w-2xl">Browse active groups, narrow by category, and jump into communities that match your interests.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[440px]">
            {[
              ['Total', stats.total],
              ['Joined', stats.joined],
              ['Discover', stats.discoverable],
              ['Events', stats.events],
            ].map(([label, count]) => (
              <div key={label} className="rounded-2xl border border-border/70 bg-background/70 backdrop-blur-sm px-3 py-2.5 shadow-sm">
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
                <div className="text-lg font-black text-foreground tabular-nums">{count}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities, categories, or descriptions..."
              className="input-base w-full pl-12 pr-4 text-body h-12"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {([
              ['all', 'All'],
              ['joined', 'Joined'],
              ['discover', 'Discover'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setViewFilter(key)}
                className={`filter-chip ${viewFilter === key ? 'active' : 'inactive'} inline-flex items-center gap-2`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
            {([
              ['popular', 'Popular'],
              ['events', 'Most events'],
              ['name', 'A–Z'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`filter-chip ${sortBy === key ? 'active' : 'inactive'} inline-flex items-center gap-2`}
              >
                <Filter className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', ...categories].map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={`filter-chip ${categoryFilter === category ? 'active' : 'inactive'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
        <div className="space-y-4">
          <div className="bento-section p-4 md:p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="bento-title">Communities</h2>
                <p className="text-body-sm text-muted-foreground">{filtered.length} result{filtered.length === 1 ? '' : 's'}</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-caption text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                Active groups updated in real time
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((community) => (
                <div key={community.id} className="card-surface overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-36 overflow-hidden">
                    <img src={community.coverImage} alt={community.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white shadow">
                        {community.category}
                      </span>
                      {community.isJoined && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-[10px] font-black uppercase tracking-widest text-white shadow">
                          Joined
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white gap-3">
                      <div className="min-w-0">
                        <h3 className="text-body font-bold truncate">{community.name}</h3>
                        <p className="text-[11px] text-white/80 truncate">{community.description}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-black/25 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        {community.eventCount}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between gap-3 text-caption text-muted-foreground">
                      <span>{community.memberCount.toLocaleString()} members</span>
                      <span>{community.eventCount} events</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="filter-chip inactive text-[11px]">Community-led</span>
                      <span className="filter-chip inactive text-[11px]">Local</span>
                      <span className="filter-chip inactive text-[11px]">Events</span>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <img key={i} src={`https://i.pravatar.cc/24?img=${i + 30}`} className="w-6 h-6 rounded-full border-2 border-background" alt="" />
                        ))}
                      </div>
                      <button
                        onClick={() => toggleJoin(community.id, community.name)}
                        className={`text-body-sm px-4 py-2.5 inline-flex items-center gap-1.5 ${community.isJoined ? 'btn-secondary text-green-600 border-green-500/40' : 'btn-primary'}`}
                      >
                        {community.isJoined && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {community.isJoined ? 'Joined' : 'Join'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-section p-4 md:p-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="bento-title">Suggested for You</h2>
                <p className="text-body-sm text-muted-foreground">Curated groups that match common attendee interests.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'Cairo Foodies', category: 'Food & Drink', members: 4200, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800' },
                { name: 'Fitness & Wellness', category: 'Health & Wellness', members: 3800, image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800' },
                { name: 'Art & Culture Enthusiasts', category: 'Art', members: 2900, image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01f8bcc?w=800' },
              ].map((community, index) => {
                const isJoined = suggestedJoined.has(index);
                return (
                  <div key={community.name} className="card-surface overflow-hidden group">
                    <div className="relative h-28 overflow-hidden">
                      <img src={community.image} alt={community.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                      <div className="absolute left-3 bottom-3 text-white">
                        <p className="text-[11px] uppercase tracking-widest font-black text-white/70">{community.category}</p>
                        <h3 className="text-body font-bold">{community.name}</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <p className="text-caption text-muted-foreground">{community.members.toLocaleString()} members and growing.</p>
                      <button
                        onClick={() => toggleSuggestedJoin(index, community.name)}
                        className={`w-full px-4 py-2.5 rounded-xl font-semibold transition-all inline-flex items-center justify-center gap-1.5 ${
                          isJoined
                            ? 'border-2 border-green-500 text-green-600 bg-green-50 dark:bg-green-900/10'
                            : 'border-2 border-primary text-primary hover:bg-primary/10'
                        }`}
                      >
                        {isJoined && <CheckCircle2 className="w-4 h-4" />}
                        {isJoined ? 'Joined' : 'Join'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bento-section p-4 md:p-5 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/15">
            <div className="bento-header mb-4">
              <div className="bento-title-wrapper">
                <MessageSquareMore className="w-5 h-5 text-primary" />
                <h2 className="bento-title">Community Highlights</h2>
              </div>
            </div>
            <div className="space-y-3">
              {[
                'Live discussions are happening right now across your joined groups.',
                'New event announcements surface first in active communities.',
                'Member-only threads keep conversations focused and useful.',
              ].map((text) => (
                <div key={text} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background/75 backdrop-blur-sm p-3">
                  <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-caption text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <Link to="/app/discover" className="btn-primary mt-4 w-full inline-flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              Explore more communities
            </Link>
          </div>

          <div className="bento-section p-4 md:p-5">
            <div className="bento-header">
              <div className="bento-title-wrapper">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="bento-title">Trending Now</h2>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { tag: 'JazzInCairo', posts: 142 },
                { tag: 'TechFounders', posts: 89 },
                { tag: 'FoodiesEgypt', posts: 256 },
              ].map((trend) => (
                <div key={trend.tag} className="flex items-center justify-between group cursor-pointer">
                  <p className="text-body-sm font-bold text-foreground group-hover:text-primary transition-colors">#{trend.tag}</p>
                  <span className="text-caption text-muted-foreground">{trend.posts} posts</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-section p-4 md:p-5">
            <div className="bento-header">
              <div className="bento-title-wrapper">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="bento-title">Recent Activity</h2>
              </div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <img src={`https://i.pravatar.cc/32?img=${i + 40}`} className="w-8 h-8 rounded-full border border-border" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-caption text-foreground leading-tight">
                      <span className="font-bold">User {i}</span> joined <span className="text-primary font-bold">Tech Cairo Hub</span>
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{i * 4}m ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
