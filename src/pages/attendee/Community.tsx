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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockCommunities.map((community) => (
            <div
              key={community.id}
              className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <Link to={`/app/community/${community.id}`}>
                <div className="relative h-32">
                  <img
                    src={community.coverImage}
                    alt={community.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-semibold rounded-full">
                      {community.category}
                    </span>
                  </div>
                </div>
              </Link>

              <div className="p-6">
                <Link to={`/app/community/${community.id}`}>
                  <h3 className="text-xl font-bold text-foreground mb-2 hover:text-primary transition-colors">
                    {community.name}
                  </h3>
                </Link>
                <p className="text-muted-foreground mb-4 line-clamp-2">{community.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{community.memberCount.toLocaleString()} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{community.eventCount} events</span>
                  </div>
                </div>

                {community.isJoined ? (
                  <button className="w-full px-4 py-2 border-2 border-green-500 text-green-600 rounded-lg font-semibold">
                    Joined
                  </button>
                ) : (
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-[#6C4CF1] to-[#5739D4] hover:shadow-lg text-white rounded-xl font-bold transform hover:scale-105 transition-all">
                    Join Community
                  </button>
                )}
              </div>
            </div>
          ))}
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
