import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, MessageSquare, Settings, TrendingUp, Sparkles, Plus } from 'lucide-react';
import { mockEvents } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'discussions' | 'events' | 'members'>('discussions');
  const { recordDiscussion, communities } = useAppStore();

  const community = communities.find((c) => c.id === id);
  const communityEvents = mockEvents.filter((e) => e.communityId === id);

  if (!community) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="surface-panel p-12 text-center max-w-md">
          <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h2 className="text-h2 font-bold text-foreground mb-2">Community not found</h2>
          <Link to="/app/community" className="btn-primary mt-4">Back to Communities</Link>
        </div>
      </div>
    );
  }

  const discussions = [
    { title: 'Best jazz venues in Cairo?', author: 'Sarah Ahmed', avatar: 'https://i.pravatar.cc/40?img=1', replies: 12, time: '2 hours ago', hot: true },
    { title: 'Looking for band members — Jazz fusion project', author: 'Mike Johnson', avatar: 'https://i.pravatar.cc/40?img=2', replies: 8, time: '5 hours ago', hot: false },
    { title: 'Upcoming Jazz Night was amazing!', author: 'Emily Chen', avatar: 'https://i.pravatar.cc/40?img=3', replies: 24, time: '1 day ago', hot: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link to="/app/community" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Communities</span>
          </Link>
        </div>
      </div>

      {/* Community Header */}
      <div className="relative">
        <div className="h-64">
          <img src={community.coverImage} alt={community.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-6xl mx-auto">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-bold rounded-full mb-3 inline-block border border-white/20">
              {community.category}
            </span>
            <h1 className="text-h1 font-bold mb-2">{community.name}</h1>
            <p className="text-white/85 mb-4 text-body">{community.description}</p>
            <div className="flex items-center gap-6 text-body-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{community.memberCount.toLocaleString()} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{community.eventCount} events</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-300">Active community</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
            {(['discussions', 'events', 'members'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-body-sm font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {community.isJoined && (
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <div className="space-y-4">
            {discussions.map((discussion, index) => (
              <div
                key={index}
                className="surface-panel p-5 hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => recordDiscussion()}
              >
                <div className="flex gap-4">
                  <img src={discussion.avatar} alt={discussion.author} className="w-11 h-11 rounded-full ring-2 ring-border flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-body font-bold text-foreground">{discussion.title}</h3>
                      {discussion.hot && (
                        <span className="badge-ai flex-shrink-0">
                          <Sparkles className="w-3 h-3" /> Hot
                        </span>
                      )}
                    </div>
                    <p className="text-caption text-muted-foreground mb-2">
                      Posted by {discussion.author} · {discussion.time}
                    </p>
                    <div className="flex items-center gap-2 text-caption text-muted-foreground">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{discussion.replies} replies</span>
                      <span className="text-muted-foreground/40">·</span>
                      <span className="text-[#7C5CFF] font-semibold">+15 XP to reply</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => recordDiscussion()}
              className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:border-primary/50 hover:text-primary font-semibold transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Start a new discussion
            </button>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communityEvents.length === 0 ? (
              <div className="col-span-3 surface-panel p-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-body text-muted-foreground">No events in this community yet.</p>
              </div>
            ) : communityEvents.map((event) => (
              <Link
                key={event.id}
                to={`/app/events/${event.id}`}
                className="card-surface overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-body font-bold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-caption text-muted-foreground mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  {event.engagement && (
                    <p className="text-caption text-[#7C5CFF] font-semibold">{event.engagement.momentumLabel}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="surface-panel p-4 flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
                <img
                  src={`https://i.pravatar.cc/60?img=${i + 10}`}
                  alt="Member"
                  className="w-12 h-12 rounded-full ring-2 ring-border"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-bold text-foreground truncate">Member {i + 1}</p>
                  <p className="text-caption text-muted-foreground">
                    {['Jazz enthusiast', 'Music lover', 'Event goer', 'Community builder'][i % 4]}
                  </p>
                </div>
                <button className="px-3 py-1.5 text-caption font-semibold border border-border rounded-full hover:border-primary/50 hover:text-primary transition-all flex-shrink-0">
                  Follow
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
