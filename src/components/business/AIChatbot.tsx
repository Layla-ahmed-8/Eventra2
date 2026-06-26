// ai chatbot
import { useEffect, useRef, useState } from 'react';
import { Bot, ChevronDown, Maximize2, Minimize2, Send, Sparkles, X } from 'lucide-react';
import { useChatbot, type ChatMessage } from '../../hooks/useChatbot';
import { formatRelativeTime } from '../../lib/utils';

// ── Markdown-lite renderer ────────────────────────────────────────────────────
// Handles **bold**, bullet lines, and newlines only (no external dep needed)
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // bold
    const parts = line.split(/\*\*(.+?)\*\*/g);
    const rendered = parts.map((part, j) =>
      j % 2 === 1 ? <strong key={j} className="font-bold text-foreground">{part}</strong> : <span key={j}>{part}</span>
    );
    return (
      <span key={i} className="block leading-relaxed">
        {rendered}
        {i < lines.length - 1 && line === '' && <br />}
      </span>
    );
  });
}

// ── Role accent config ────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  attendee: {
    gradient: 'from-[#6C4CF1] to-[#00C2FF]',
    ring: 'ring-primary/30',
    badgeBg: 'bg-primary/10 text-primary border-primary/20',
    label: 'Attendee AI',
  },
  organizer: {
    gradient: 'from-cyan-500 to-blue-500',
    ring: 'ring-cyan-500/30',
    badgeBg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    label: 'Organizer AI',
  },
  admin: {
    gradient: 'from-red-500 to-orange-500',
    ring: 'ring-red-500/30',
    badgeBg: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    label: 'Admin AI',
  },
};

// ── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-2.5 items-end">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6C4CF1] to-[#00C2FF] flex items-center justify-center flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Single message bubble ─────────────────────────────────────────────────────
function MessageBubble({
  message,
  onChipClick,
  gradient,
}: {
  message: ChatMessage;
  onChipClick: (intent: string, label: string) => void;
  gradient: string;
}) {
  const isBot = message.role === 'bot';

  return (
    <div className={`flex gap-2.5 items-end animate-fade-up ${isBot ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      {isBot ? (
        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 self-start mt-1`}>
          <Bot className="w-3.5 h-3.5 text-white" />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0 self-start mt-1 text-[11px] font-black text-muted-foreground">
          U
        </div>
      )}

      <div className={`max-w-[82%] flex flex-col gap-2 ${isBot ? 'items-start' : 'items-end'}`}>
        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
            isBot
              ? 'bg-card border border-border rounded-bl-sm text-foreground'
              : `bg-gradient-to-br ${gradient} text-white rounded-br-sm shadow-lg`
          }`}
        >
          {renderMarkdown(message.text)}
        </div>

        {/* Action chips */}
        {isBot && message.chips && message.chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.chips.map((chip) => (
              <button
                key={chip.intent}
                onClick={() => onChipClick(chip.intent, chip.label)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold border border-border bg-background hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
              >
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground px-1">
          {formatRelativeTime(message.timestamp.toISOString())}
        </span>
      </div>
    </div>
  );
}

// ── Main chatbot component ────────────────────────────────────────────────────
export default function AIChatbot() {
  const { getWelcomeMessage, processMessage, role, currentUser } = useChatbot();
  const cfg = ROLE_CONFIG[role] ?? ROLE_CONFIG.attendee;

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message on first open
  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
      const welcome = getWelcomeMessage();
      setMessages([welcome]);
    }
  }, [isOpen, hasOpened]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Reset on user change
  useEffect(() => {
    setMessages([]);
    setHasOpened(false);
  }, [currentUser?.id]);

  const handleSend = (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isTyping) return;

    // Add user message (unless it's a chip intent that starts with intent keyword — show label instead)
    const displayText = content.startsWith('nav:') ? `Go to ${content.replace('nav:', '')}` : content;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: displayText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay (120–400ms)
    const delay = 120 + Math.random() * 280;
    setTimeout(() => {
      const { response, sideEffect } = processMessage(content);
      setIsTyping(false);
      setMessages(prev => [...prev, response]);
      if (sideEffect) {
        setTimeout(sideEffect, 200);
      }
    }, delay);
  };

  const handleChipClick = (intent: string, label: string) => {
    handleSend(intent);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const unreadIndicator = !isOpen && messages.length === 0;

  return (
    <>
      {/* ── Floating button ────────────────────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Assistant"
          className={`fixed bottom-24 right-5 lg:bottom-8 lg:right-8 z-[60] w-14 h-14 rounded-2xl bg-gradient-to-br ${cfg.gradient} text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group`}
        >
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cfg.gradient} opacity-50 blur-md group-hover:opacity-70 transition-opacity`} />
          <Sparkles className="relative w-6 h-6" />
          {/* Pulse ring */}
          <span className={`absolute inset-0 rounded-2xl ring-4 ${cfg.ring} animate-pulse-ring`} />
        </button>
      )}

      {/* ── Chat panel ─────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className={`fixed z-[60] transition-all duration-300 ${
            isExpanded
              ? 'inset-4 lg:inset-8'
              : isMinimized
              ? 'bottom-24 right-5 lg:bottom-8 lg:right-8 w-72 h-14'
              : 'bottom-24 right-5 lg:bottom-8 lg:right-8 w-[360px] lg:w-[400px] h-[580px]'
          } flex flex-col bg-card border border-border rounded-2xl shadow-2xl overflow-hidden`}
        >
          {/* ── Header ───────────────────────────────────────────────────── */}
          <div className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r ${cfg.gradient} flex-shrink-0`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[13px] font-black text-white leading-none">{cfg.label}</p>
                <p className="text-[10px] text-white/70 mt-0.5">Powered by Eventra AI</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Expand / shrink */}
              <button
                onClick={() => { setIsExpanded(v => !v); setIsMinimized(false); }}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label={isExpanded ? 'Shrink' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5 text-white" /> : <Maximize2 className="w-3.5 h-3.5 text-white" />}
              </button>

              {/* Minimize */}
              {!isExpanded && (
                <button
                  onClick={() => setIsMinimized(v => !v)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Minimize"
                >
                  <ChevronDown className={`w-4 h-4 text-white transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* Close */}
              <button
                onClick={() => { setIsOpen(false); setIsMinimized(false); setIsExpanded(false); }}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* ── Body (hidden when minimized) ─────────────────────────────── */}
          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 bg-background/50">
                {messages.map(msg => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    onChipClick={handleChipClick}
                    gradient={cfg.gradient}
                  />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>

              {/* ── Input bar ────────────────────────────────────────────── */}
              <div className="flex-shrink-0 p-3 border-t border-border bg-card">
                <div className="flex items-center gap-2">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${cfg.gradient} flex items-center justify-center`}>
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me about events, bookings, profile, or try “bookmark the rooftop mixer”"
                    className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground/60 outline-none"
                    disabled={isTyping}
                    maxLength={300}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-br ${cfg.gradient} text-white hover:shadow-lg`}
                    aria-label="Send"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground/50 mt-1.5 text-center">
                  Eventra AI · Demo mode · Actions are real
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
