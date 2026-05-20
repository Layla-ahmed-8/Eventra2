import { useRef, useState } from 'react';
import { Send, Users, Inbox, Radio, MessageSquare, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import { formatRelativeTime } from '../../lib/utils';
import type { DMThread } from '../../types';

const MOCK_EVENTS = [
  { label: 'Cairo Jazz Night: Live at Sunset', recipients: 142 },
  { label: 'AI & Machine Learning Summit 2026', recipients: 387 },
  { label: 'Street Food Festival', recipients: 218 },
];

export default function OrganizerMessages() {
  const [activeTab, setActiveTab] = useState<'broadcast' | 'inbox'>('broadcast');
  const [selectedEvent, setSelectedEvent] = useState(MOCK_EVENTS[0].label);
  const [recipientType, setRecipientType] = useState<'all' | 'vip'>('all');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const [selectedThread, setSelectedThread] = useState<DMThread | null>(null);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    currentUser,
    getMyDMThreads,
    getDirectConversation,
    sendDirectMessage,
    markConversationRead,
    sendBroadcastMessage,
    broadcastMessages,
  } = useAppStore();

  const inboxThreads = getMyDMThreads();
  const totalUnread = inboxThreads.reduce((s, t) => s + t.unreadCount, 0);

  const sentBroadcasts = broadcastMessages.filter(
    (b) => b.senderId === currentUser?.id && b.targetRole === 'attendee'
  );

  const conversation = selectedThread ? getDirectConversation(selectedThread.partnerId) : [];

  const eventObj = MOCK_EVENTS.find((e) => e.label === selectedEvent) ?? MOCK_EVENTS[0];
  const recipientCount = recipientType === 'vip' ? Math.round(eventObj.recipients * 0.08) : eventObj.recipients;

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

  const handleBroadcast = () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in both subject and message before sending.');
      return;
    }
    setSending(true);
    setTimeout(() => {
      sendBroadcastMessage(subject.trim(), message.trim(), 'attendee');
      setSubject('');
      setMessage('');
      setSending(false);
      toast.success(`Broadcast sent to ${recipientCount} attendees.`);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold text-foreground">Messages</h1>
        <p className="text-body text-muted-foreground mt-1">Broadcast updates to attendees and respond to direct messages</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('broadcast')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-body-sm border-b-2 transition-colors ${
            activeTab === 'broadcast'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Radio className="w-4 h-4" />
          Broadcast
        </button>
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-body-sm border-b-2 transition-colors relative ${
            activeTab === 'inbox'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Inbox className="w-4 h-4" />
          Inbox
          {totalUnread > 0 && (
            <span className="ml-1 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalUnread}
            </span>
          )}
        </button>
      </div>

      {/* ── Broadcast Tab ── */}
      {activeTab === 'broadcast' && (
        <div className="space-y-6">
          <div className="surface-panel p-8 space-y-6">
            <div>
              <h2 className="text-h2 font-semibold text-foreground mb-2">Send Message to Attendees</h2>
              <p className="text-body text-muted-foreground">Share event updates with your registered audience.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Select Event</label>
                <select
                  className="w-full px-4 py-3 input-base"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  {MOCK_EVENTS.map((ev) => (
                    <option key={ev.label} value={ev.label}>{ev.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Recipients</label>
                <div className="flex flex-wrap gap-2">
                  <label className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-3xl cursor-pointer hover:border-cyan-500">
                    <input
                      type="radio"
                      name="recipients"
                      checked={recipientType === 'all'}
                      onChange={() => setRecipientType('all')}
                      className="accent-cyan-500"
                    />
                    <span className="text-body text-foreground">All Attendees ({eventObj.recipients})</span>
                  </label>
                  <label className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-3xl cursor-pointer hover:border-cyan-500">
                    <input
                      type="radio"
                      name="recipients"
                      checked={recipientType === 'vip'}
                      onChange={() => setRecipientType('vip')}
                      className="accent-cyan-500"
                    />
                    <span className="text-body text-foreground">VIP Only ({Math.round(eventObj.recipients * 0.08)})</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 input-base"
                  placeholder="e.g., Important Update About Your Event"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Message</label>
                <textarea
                  rows={6}
                  className="w-full px-4 py-3 input-base resize-none"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <button
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
                onClick={handleBroadcast}
                disabled={sending}
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {sending ? 'Sending…' : `Send to ${recipientCount} attendees`}
              </button>
            </div>
          </div>

          {/* Sent history */}
          {sentBroadcasts.length > 0 && (
            <div className="surface-panel p-6 space-y-4">
              <h3 className="text-h3 font-bold text-foreground">Recent Broadcasts</h3>
              <div className="space-y-3">
                {sentBroadcasts.map((bc) => (
                  <div key={bc.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <div className="min-w-0">
                      <p className="text-body-sm font-bold text-foreground truncate">{bc.subject}</p>
                      <p className="text-caption text-muted-foreground mt-0.5">{formatRelativeTime(bc.timestamp)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-caption text-muted-foreground flex-shrink-0">
                      <Users className="w-3.5 h-3.5" />
                      {bc.recipientCount || recipientCount} recipients
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Inbox Tab ── */}
      {activeTab === 'inbox' && (
        <div className="grid lg:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-18rem)] min-h-[500px]">
          {/* Thread list */}
          <div className="surface-panel flex flex-col overflow-hidden rounded-2xl">
            <div className="p-4 border-b border-border">
              <p className="text-caption font-black uppercase tracking-widest text-muted-foreground">Conversations</p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-border/50">
              {inboxThreads.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-body-sm">No messages yet.</p>
                  <p className="text-caption mt-1">Direct messages from attendees and admin will appear here.</p>
                </div>
              ) : (
                inboxThreads.map((thread) => (
                  <button
                    key={thread.conversationId}
                    onClick={() => handleSelectThread(thread)}
                    className={`w-full p-4 text-left transition-all hover:bg-secondary/40 ${
                      selectedThread?.conversationId === thread.conversationId ? 'bg-cyan-500/5 border-l-2 border-cyan-500' : ''
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
                            <span className="min-w-[18px] h-[18px] px-1 bg-cyan-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
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
                <p className="text-body-sm text-muted-foreground mt-1">Choose a thread on the left to reply.</p>
              </div>
            ) : (
              <>
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
                            isOwn ? 'bg-cyan-500 text-white rounded-br-sm' : 'bg-card border border-border rounded-bl-sm text-foreground'
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

                <div className="p-3 border-t border-border flex items-center gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder={`Reply to ${selectedThread.partnerName}…`}
                    className="flex-1 input-base text-body-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="btn-primary h-10 px-4 flex-shrink-0 disabled:opacity-40"
                    style={{ '--btn-color': 'var(--cyan-core)' } as React.CSSProperties}
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
