import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, Search } from 'lucide-react';
import { mockCommunities } from '../../data/mockData';

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/app/discover" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">Communities</h1>
            </div>
            <div className="w-20"></div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search communities..."
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-2">Your Communities</h2>
          <p className="text-muted-foreground">
            Join communities to connect with like-minded people and discover exclusive events
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Communities List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bento-header">
              <h2 className="bento-title">Featured Communities</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {mockCommunities.map((community) => (
                <div key={community.id} className="card-surface p-5 hover:border-primary/20 transition-all group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      <Users className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-body font-bold text-foreground truncate">{community.name}</h3>
                      <p className="text-caption text-muted-foreground">{community.memberCount.toLocaleString()} members</p>
                    </div>
                  </div>
                  <p className="text-caption text-muted-foreground line-clamp-2 mb-5 h-8">
                    {community.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <img key={i} src={`https://i.pravatar.cc/24?img=${i + 30}`} className="w-6 h-6 rounded-full border-2 border-background" alt="" />
                      ))}
                    </div>
                    <button
                      className="btn-primary text-body-sm px-4"
                    >
                      {community.isJoined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discussions / Trends */}
          <div className="space-y-6">
            <div className="bento-section">
              <div className="bento-header">
                <div className="bento-title-wrapper">
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

            <div className="bento-section">
              <div className="bento-header">
                <div className="bento-title-wrapper">
                  <Users className="w-5 h-5 text-primary" />
                  <h2 className="bento-title">Recent Activity</h2>
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-start gap-3">
                    <img src={`https://i.pravatar.cc/32?img=${i + 40}`} className="w-8 h-8 rounded-full border border-border" alt="" />
                    <div className="flex-1 min-w-0">
                      <p className="text-caption text-foreground leading-tight">
                        <span className="font-bold">User {i}</span> joined <span className="text-primary font-bold">Tech Cairo</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{i * 5}m ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Communities */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-6">Suggested for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Cairo Foodies',
                category: 'Food & Drink',
                members: 4200,
                image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
              },
              {
                name: 'Fitness & Wellness',
                category: 'Health',
                members: 3800,
                image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800',
              },
              {
                name: 'Art & Culture Enthusiasts',
                category: 'Art',
                members: 2900,
                image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01f8bcc?w=800',
              },
            ].map((community, index) => (
              <div
                key={index}
                className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="relative h-40">
                  <img
                    src={community.image}
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-1">{community.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {community.members.toLocaleString()} members
                  </p>
                  <button className="w-full px-4 py-2 border-2 border-primary text-primary rounded-xl hover:bg-primary/10 font-semibold transition-all">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
