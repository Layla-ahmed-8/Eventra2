import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, MessageSquare, Settings } from 'lucide-react';
import { mockCommunities, mockEvents } from '../../data/mockData';

export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'discussions' | 'events' | 'members'>('discussions');

  const community = mockCommunities.find((c) => c.id === id);
  const communityEvents = mockEvents.filter((e) => e.communityId === id);

  if (!community) {
    return <div>Community not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link to="/app/community" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Communities</span>
          </Link>
        </div>
      </div>

      {/* Community Header */}
      <div className="relative">
        <div className="h-64">
          <img
            src={community.coverImage}
            alt={community.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-6xl mx-auto">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-xs font-semibold rounded-full mb-3 inline-block">
              {community.category}
            </span>
            <h1 className="text-4xl font-bold mb-2">{community.name}</h1>
            <p className="text-white/90 mb-4">{community.description}</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{community.memberCount.toLocaleString()} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{community.eventCount} events</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          {/* Tabs */}
          <div className="flex gap-1 bg-white p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab('discussions')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'discussions'
                  ? 'bg-[#6C4CF1] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Discussions
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'events'
                  ? 'bg-[#6C4CF1] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'members'
                  ? 'bg-[#6C4CF1] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Members
            </button>
          </div>

          {community.isJoined && (
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'discussions' && (
          <div className="space-y-4">
            {[
              {
                title: 'Best jazz venues in Cairo?',
                author: 'Sarah Ahmed',
                avatar: 'https://i.pravatar.cc/40?img=1',
                replies: 12,
                time: '2 hours ago',
              },
              {
                title: 'Looking for band members - Jazz fusion project',
                author: 'Mike Johnson',
                avatar: 'https://i.pravatar.cc/40?img=2',
                replies: 8,
                time: '5 hours ago',
              },
              {
                title: 'Upcoming Jazz Night was amazing!',
                author: 'Emily Chen',
                avatar: 'https://i.pravatar.cc/40?img=3',
                replies: 24,
                time: '1 day ago',
              },
            ].map((discussion, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <img
                    src={discussion.avatar}
                    alt={discussion.author}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{discussion.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Posted by {discussion.author} • {discussion.time}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MessageSquare className="w-4 h-4" />
                      <span>{discussion.replies} replies</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#6C4CF1] hover:text-[#6C4CF1] font-medium transition-colors">
              Start a new discussion
            </button>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {communityEvents.map((event) => (
              <Link
                key={event.id}
                to={`/app/events/${event.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-500">{event.rsvpCount} attending</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                <img
                  src={`https://i.pravatar.cc/60?img=${i + 10}`}
                  alt="Member"
                  className="w-14 h-14 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Member {i + 1}</p>
                  <p className="text-sm text-gray-600">Jazz enthusiast</p>
                </div>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:border-[#6C4CF1] hover:text-[#6C4CF1]">
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
