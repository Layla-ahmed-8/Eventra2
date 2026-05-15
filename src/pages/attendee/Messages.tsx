import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { demoToast } from '../../lib/demoFeedback';
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
          <div className="bento-section text-center py-20">
            <Mail className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">No conversations found</h3>
            <p className="text-muted-foreground">Try clearing filters or searching for another thread.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-280px)] min-h-[500px]">
            <div className="lg:col-span-1 bento-section flex flex-col p-0 overflow-hidden">
              <div className="p-4 border-b border-border bg-secondary/20">
                <p className="text-caption font-black text-muted-foreground uppercase tracking-widest">Conversations</p>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border/50">
                {filteredThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full p-4 text-left transition-all hover:bg-secondary/40 relative ${
                      activeThread?.id === thread.id ? 'bg-primary/5' : ''
                    }`}
                  >
                    {activeThread?.id === thread.id && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                    )}
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={`text-body-sm font-bold truncate ${thread.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {thread.title}
                      </h3>
                      <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">{thread.time}</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/70 mb-2">{thread.from}</p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-caption text-muted-foreground line-clamp-1 flex-1">{thread.preview}</p>
                      {thread.unread && <div className="w-2 h-2 bg-primary rounded-full shadow-sm shadow-primary/40" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 bento-section flex flex-col p-0 overflow-hidden">
              {activeThread ? (
                <>
                  <div className="p-4 border-b border-border bg-secondary/20 flex items-center justify-between">
                    <div>
                      <h3 className="text-body font-bold text-foreground leading-none">{activeThread.title}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">
                        {activeThread.type.replace('-', ' ')}
                      </p>
                    </div>
                    <button className="btn-secondary p-2 rounded-xl">
                      <ShieldAlert className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/30">
                    <div className="flex flex-col gap-1 max-w-[80%]">
                      <div className="p-4 rounded-2xl bg-secondary border border-border text-body-sm text-foreground">
                        {activeThread.preview}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground px-1">{activeThread.time}</span>
                    </div>

                    <div className="flex flex-col gap-1 max-w-[80%] ml-auto items-end">
                      <div className="p-4 rounded-2xl bg-primary text-primary-foreground text-body-sm shadow-lg shadow-primary/20">
                        Got it. I will be there 15 minutes early.
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground px-1">Just now</span>
                    </div>
                  </div>

                  <div className="p-4 border-t border-border bg-secondary/10">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-body-sm focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      <button
                        type="button"
                        className="btn-primary p-3 rounded-xl flex-shrink-0"
                        disabled={!draft.trim()}
                        onClick={() => {
                          demoToast('Message sent', `“${draft.trim().slice(0, 80)}${draft.length > 80 ? '…' : ''}”`);
                          setDraft('');
                        }}
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                  <Mail className="w-16 h-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose any thread from the left panel to start chatting.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

