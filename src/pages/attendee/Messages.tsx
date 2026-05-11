import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Search, Clock, MessageCircle, Users, Megaphone, Send, Bell, ShieldAlert } from 'lucide-react';

type ChannelType = 'dm' | 'group' | 'event-room' | 'broadcast';
type FilterType = 'all' | 'unread' | 'priority';

interface MessageThread {
  id: string;
  type: ChannelType;
  title: string;
  from: string;
  preview: string;
  time: string;
  unread: boolean;
  priority?: boolean;
  phase?: 'pre-event' | 'live' | 'post-event';
}

const threadTypes: { id: ChannelType | 'all'; label: string; icon: any }[] = [
  { id: 'all', label: 'All', icon: Mail },
  { id: 'dm', label: 'Direct', icon: MessageCircle },
  { id: 'group', label: 'Groups', icon: Users },
  { id: 'event-room', label: 'Event Rooms', icon: Bell },
  { id: 'broadcast', label: 'Organizer', icon: Megaphone },
];

const threads: MessageThread[] = [
  { id: 't1', type: 'dm', title: 'Mariam Hassan', from: 'Mariam', preview: 'Are you joining the networking session after the keynote?', time: '2m', unread: true, priority: true },
  { id: 't2', type: 'event-room', title: 'AI Summit Cairo 2026', from: 'Event Room', preview: 'Live poll: Which track are you attending now?', time: '12m', unread: true, phase: 'live' },
  { id: 't3', type: 'group', title: 'Tech Founders Community', from: 'Community', preview: 'Weekly challenge: Attend 2 events this week to unlock XP bonus.', time: '1h', unread: false },
  { id: 't4', type: 'broadcast', title: 'Organizer Announcement', from: 'Tech Cairo Team', preview: 'Venue gate changed to Hall B. Please bring your QR check-in code.', time: '3h', unread: false, priority: true },
  { id: 't5', type: 'event-room', title: 'Design Jam Meetup', from: 'Event Room', preview: 'Post-event room is now open for resources and photos.', time: '1d', unread: false, phase: 'post-event' },
];

export default function Messages() {
  const [selectedType, setSelectedType] = useState<ChannelType | 'all'>('all');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [activeThreadId, setActiveThreadId] = useState<string>(threads[0].id);
  const [draft, setDraft] = useState('');

  const filteredThreads = useMemo(() => {
    return threads.filter((thread) => {
      const typeMatch = selectedType === 'all' || thread.type === selectedType;
      const queryMatch =
        search.trim().length === 0 ||
        thread.title.toLowerCase().includes(search.toLowerCase()) ||
        thread.preview.toLowerCase().includes(search.toLowerCase());
      const filterMatch =
        selectedFilter === 'all' ||
        (selectedFilter === 'unread' && thread.unread) ||
        (selectedFilter === 'priority' && thread.priority);
      return typeMatch && queryMatch && filterMatch;
    });
  }, [search, selectedFilter, selectedType]);

  const activeThread = filteredThreads.find((thread) => thread.id === activeThreadId) || filteredThreads[0];
  const unreadCount = threads.filter((m) => m.unread).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/app/discover" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Messages</h1>
              {unreadCount > 0 && <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">{unreadCount}</span>}
            </div>
            <button className="text-sm px-3 py-2 rounded-xl border border-border text-foreground hover:bg-secondary">Mute Settings</button>
          </div>

          <div className="flex flex-wrap gap-2">
            {threadTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-3 py-2 rounded-xl border text-sm font-semibold flex items-center gap-2 ${
                  selectedType === type.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground'
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages, events, communities..."
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'unread', 'priority'] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-2 rounded-xl border text-sm capitalize ${
                    selectedFilter === filter ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredThreads.length === 0 ? (
          <div className="surface-panel p-12 text-center">
            <Mail className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-h3 font-bold text-foreground mb-2">No conversations found</h3>
            <p className="text-muted-foreground">Try clearing filters or searching for another thread.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Thread list — hidden on mobile when a thread is active */}
            <div className={`md:col-span-1 ${activeThreadId ? 'hidden md:block' : 'block'}`}>
              <div className="surface-panel overflow-hidden">
                {filteredThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full p-4 text-left border-b border-border hover:bg-secondary/50 transition-colors ${
                      activeThread?.id === thread.id ? 'bg-primary/8' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-body-sm font-semibold text-foreground truncate pr-2">{thread.title}</h3>
                      {thread.unread && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />}
                    </div>
                    <p className="text-caption text-muted-foreground mb-1">{thread.from}</p>
                    <p className="text-caption text-muted-foreground line-clamp-1 mb-2">{thread.preview}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-caption text-muted-foreground/70">
                        <Clock className="w-3 h-3" />
                        <span>{thread.time}</span>
                      </div>
                      {thread.priority && (
                        <span className="text-caption px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                          Priority
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation view — full width on mobile */}
            <div className={`md:col-span-2 ${activeThreadId ? 'block' : 'hidden md:block'}`}>
              <div className="surface-panel p-4 sm:p-6">
                {activeThread ? (
                  <div className="space-y-4">
                    {/* Mobile back button */}
                    <button
                      onClick={() => setActiveThreadId('')}
                      className="md:hidden flex items-center gap-2 text-body-sm text-muted-foreground hover:text-foreground mb-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to messages
                    </button>

                    <div className="pb-4 border-b border-border">
                      <h3 className="text-h3 font-bold text-foreground">{activeThread.title}</h3>
                      <p className="text-caption text-muted-foreground">
                        {activeThread.type === 'event-room' && activeThread.phase
                          ? `Event room (${activeThread.phase})`
                          : activeThread.type === 'broadcast'
                          ? 'Organizer broadcast channel'
                          : activeThread.type === 'group'
                          ? 'Community group chat'
                          : 'Direct message'}
                      </p>
                    </div>

                    <div className="space-y-3 min-h-[120px]">
                      <div className="p-3 rounded-xl bg-secondary text-foreground max-w-[85%] text-body-sm">
                        {activeThread.preview}
                      </div>
                      <div className="p-3 rounded-xl bg-primary text-primary-foreground max-w-[85%] ml-auto text-body-sm">
                        Got it. I will be there 15 minutes early.
                      </div>
                    </div>

                    <div className="rounded-xl border border-dashed border-border p-3 text-caption text-muted-foreground flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                      Safety tools: report, block, and AI toxicity filtering are active in this chat.
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 input-base"
                      />
                      <button
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground disabled:opacity-60 flex-shrink-0"
                        disabled={!draft.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Mail className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-h3 font-bold text-foreground mb-2">Select a conversation</h3>
                    <p className="text-body text-muted-foreground">Choose any thread from the left panel.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
