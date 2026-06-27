import { useMemo, useRef, useState } from 'react';
import { Megaphone, MessageSquare, Send, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatRelativeTime } from '../../lib/utils';
import type { DMThread, User } from '../../types';

export default function Messages() {
  const [activeTab, setActiveTab] = useState<'announcements' | 'messages'>('announcements');
  const [selectedThread, setSelectedThread] = useState<DMThread | null>(null);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const { currentUser, registeredUsers, getMyBroadcasts, getMyDMThreads, getDirectConversation, sendDirectMessage, markConversationRead } = useAppStore();

  const availableUsers = useMemo(
    () => registeredUsers.filter((user) => user.id !== currentUser?.id),
    [registeredUsers, currentUser],
  );

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return availableUsers.filter((user) =>
      user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
    );
  }, [availableUsers, searchQuery]);

  const handleStartConversation = (user: User) => {
    if (!currentUser) return;
    const conversationId = [currentUser.id, user.id].sort().join('--');
    setSelectedThread({
      conversationId,
      partnerId: user.id,
      partnerName: user.name,
      partnerAvatar: user.avatar,
      partnerRole: user.role,
      lastMessage: '',
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
    });
    setSearchQuery('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const broadcasts = getMyBroadcasts();
  const threads = getMyDMThreads();

  const conversation = selectedThread ? getDirectConversation(selectedThread.partnerId) : [];

  const handleSelectThread = (thread: DMThread) => {
    setSelectedThread(thread);
    markConversationRead(thread.partnerId);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const handleSend = () => {
    if (!input.trim() || !selectedThread) return;
    sendDirectMessage(
      selectedThread.partnerId,
      selectedThread.partnerName,
      selectedThread.partnerRole,
      input,
    );
    setInput('');
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const totalUnread = threads.reduce((sum, t) => sum + t.unreadCount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold text-foreground">Messages</h1>
        <p className="text-body text-muted-foreground mt-1">Announcements from organizers and direct conversations</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-body-sm border-b-2 transition-colors ${
            activeTab === 'announcements'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          Announcements
          {broadcasts.length > 0 && (
            <span className="ml-1 text-micro">({broadcasts.length})</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-body-sm border-b-2 transition-colors relative ${
            activeTab === 'messages'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Messages
          {totalUnread > 0 && (
            <span className="ml-1 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalUnread}
            </span>
          )}
        </button>
      </div>

      {/* ── Announcements Tab ── */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {broadcasts.length === 0 ? (
            <div className="surface-panel p-16 text-center rounded-2xl">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <Megaphone className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-body font-semibold text-foreground">No announcements yet</p>
              <p className="text-body-sm text-muted-foreground mt-1">Organizers will post updates here.</p>
            </div>
          ) : (
            broadcasts.map((bc) => (
              <div key={bc.id} className="surface-panel p-6 rounded-2xl space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://i.pravatar.cc/40?u=${bc.senderId}`}
                      alt={bc.senderName}
                      className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                    />
                    <div>
                      <p className="text-body-sm font-bold text-foreground">{bc.senderName}</p>
                      <p className="text-caption text-muted-foreground uppercase tracking-widest text-[10px]">Organizer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-caption text-muted-foreground flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {formatRelativeTime(bc.timestamp)}
                  </div>
                </div>
                <h3 className="text-body font-bold text-foreground">{bc.subject}</h3>
                <p className="text-body-sm text-muted-foreground leading-relaxed">{bc.content}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Messages Tab ── */}
      {activeTab === 'messages' && (
        <div className="grid lg:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-18rem)] min-h-[500px]">
          {/* Thread list */}
          <div className="surface-panel flex flex-col overflow-hidden rounded-2xl">
            <div className="p-4 border-b border-border space-y-3">
              <p className="text-caption font-black uppercase tracking-widest text-muted-foreground">Conversations</p>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all users to message"
                className="w-full input-base text-body-sm"
              />
            </div>
            {searchQuery && (
              <div className="px-4 pb-4 border-b border-border">
                {searchResults.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No users found for “{searchQuery}”.</p>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleStartConversation(user)}
                        className="w-full text-left rounded-3xl border border-border bg-secondary/50 px-4 py-3 transition hover:bg-secondary/80"
                      >
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div className="min-w-0">
                            <p className="text-body-sm font-bold truncate">{user.name}</p>
                            <p className="text-caption text-muted-foreground truncate">{user.email} · {user.role}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="flex-1 overflow-y-auto divide-y divide-border/50">
              {threads.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-body-sm">No conversations yet.</p>
                </div>
              ) : (
                threads.map((thread) => (
                  <button
                    key={thread.conversationId}
                    onClick={() => handleSelectThread(thread)}
                    className={`w-full p-4 text-left transition-all hover:bg-secondary/40 ${
                      selectedThread?.conversationId === thread.conversationId ? 'bg-primary/5 border-l-2 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={thread.partnerAvatar || `https://i.pravatar.cc/40?u=${thread.partnerId}`}
                        alt={thread.partnerName}
                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-body-sm font-bold truncate ${thread.unreadCount > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {thread.partnerName}
                          </p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {formatRelativeTime(thread.lastMessageAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <p className="text-caption text-muted-foreground line-clamp-1 flex-1">{thread.lastMessage}</p>
                          {thread.unreadCount > 0 && (
                            <span className="min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                              {thread.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Conversation pane */}
          <div className="surface-panel flex flex-col overflow-hidden rounded-2xl">
            {!selectedThread ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <MessageSquare className="w-16 h-16 text-muted-foreground/20 mb-4" />
                <p className="text-body font-semibold text-foreground">Select a conversation</p>
                <p className="text-body-sm text-muted-foreground mt-1">Choose a thread on the left to start chatting.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center gap-3">
                  <img
                    src={selectedThread.partnerAvatar || `https://i.pravatar.cc/40?u=${selectedThread.partnerId}`}
                    alt={selectedThread.partnerName}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-body-sm font-bold text-foreground">{selectedThread.partnerName}</p>
                    <p className="text-caption text-muted-foreground capitalize">{selectedThread.partnerRole}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {conversation.map((msg) => {
                    const isOwn = msg.senderId === currentUser?.id;
                    return (
                      <div key={msg.id} className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                        <img
                          src={msg.senderAvatar || `https://i.pravatar.cc/40?u=${msg.senderId}`}
                          alt={msg.senderName}
                          className="w-8 h-8 rounded-xl object-cover flex-shrink-0 self-end"
                        />
                        <div className={`max-w-[70%] flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
                          {!isOwn && <span className="text-caption font-bold text-muted-foreground">{msg.senderName}</span>}
                          <div className={`px-4 py-2.5 rounded-2xl text-body-sm leading-relaxed ${
                            isOwn ? 'bg-primary text-white rounded-br-sm' : 'bg-card border border-border rounded-bl-sm text-foreground'
                          }`}>
                            {msg.content}
                          </div>
                          <span className="text-micro text-muted-foreground px-1">{formatRelativeTime(msg.timestamp)}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-border flex items-center gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={`Message ${selectedThread.partnerName}…`}
                    className="flex-1 input-base text-body-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="btn-primary h-10 px-4 flex-shrink-0 disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
