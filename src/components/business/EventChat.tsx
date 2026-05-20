import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Send, Trash2, Crown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { formatRelativeTime } from '../../lib/utils';

interface EventChatProps {
  eventId: string;
  eventName: string;
  userRole: 'attendee' | 'organizer' | 'admin';
  onBack: () => void;
}

export default function EventChat({ eventId, eventName, userRole, onBack }: EventChatProps) {
  const { getEventMessages, sendEventMessage, deleteEventMessage, currentUser } = useAppStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const messages = getEventMessages(eventId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendEventMessage(eventId, input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
      {/* Header */}
      <div className="surface-panel p-4 flex items-center gap-3 mb-4 rounded-2xl">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h2 className="text-h3 font-bold text-foreground">{eventName}</h2>
          <p className="text-caption text-muted-foreground">{messages.length} message{messages.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 px-1 pb-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Send className="w-8 h-8 text-primary" />
            </div>
            <p className="text-body font-semibold text-foreground">No messages yet</p>
            <p className="text-body-sm text-muted-foreground mt-1">Be the first to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.userId === currentUser?.id;
            const isOrganizer = msg.userRole === 'organizer';

            return (
              <div key={msg.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <img
                  src={msg.userAvatar || `https://i.pravatar.cc/40?u=${msg.userId}`}
                  alt={msg.userName}
                  className="w-9 h-9 rounded-xl object-cover flex-shrink-0 self-end"
                />

                {/* Bubble */}
                <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className="flex items-center gap-2">
                    {!isOwn && (
                      <span className="text-caption font-bold text-muted-foreground">{msg.userName}</span>
                    )}
                    {isOrganizer && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 rounded-full text-micro font-bold">
                        <Crown className="w-3 h-3" />
                        Organizer
                      </span>
                    )}
                  </div>

                  <div className="flex items-end gap-2 group">
                    {(userRole === 'organizer' || userRole === 'admin') && !isOwn && (
                      <button
                        onClick={() => deleteEventMessage(eventId, msg.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 flex-shrink-0"
                        title="Delete message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div
                      className={`px-4 py-2.5 rounded-2xl text-body-sm leading-relaxed ${
                        isOwn
                          ? isOrganizer
                            ? 'bg-cyan-500 text-white rounded-br-sm'
                            : 'bg-primary text-white rounded-br-sm'
                          : 'bg-card border border-border rounded-bl-sm text-foreground'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {isOwn && (userRole === 'organizer' || userRole === 'admin') && (
                      <button
                        onClick={() => deleteEventMessage(eventId, msg.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 flex-shrink-0"
                        title="Delete message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <span className="text-micro text-muted-foreground px-1">
                    {formatRelativeTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="surface-panel p-3 mt-4 rounded-2xl flex items-end gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send)"
          rows={1}
          className="flex-1 input-base resize-none min-h-[44px] max-h-32 py-2.5 text-body-sm"
          style={{ height: 'auto' }}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = 'auto';
            t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="btn-primary h-11 px-4 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
