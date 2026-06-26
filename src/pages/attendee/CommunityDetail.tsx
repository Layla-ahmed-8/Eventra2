import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Image as ImageIcon,
  MessageCircle,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { mockEvents } from '../../data/mockData';
import { useAppStore } from '../../store/useAppStore';
import { BADGE_DEFINITIONS } from '../../constants/badges';
import { XP_TABLE } from '../../constants/config';
import { formatRelativeTime } from '../../lib/utils';
import { toast } from 'sonner';
import type { CommunityPost } from '../../types';

// ── sub-view types ────────────────────────────────────────────────────────────
type View = 'list' | 'post';

// ── XP sidebar widget ─────────────────────────────────────────────────────────
function CommunityXPWidget() {
  const { xp, level, earnedBadges, discussionCount, communityXP, postsCount } = useAppStore();

  const communityBadge = BADGE_DEFINITIONS.find((b) => b.id === 'badge-003');
  const voiceBadge     = BADGE_DEFINITIONS.find((b) => b.id === 'badge-009');
  const earnedIds      = new Set(earnedBadges.map((b) => b.id));

  const builderProgress = Math.min(100, Math.round((discussionCount / 3) * 100));
  const voiceProgress   = Math.min(100, Math.round((postsCount / 5) * 100));

  return (
    <div className="space-y-4">
      {/* XP earned from community */}
      <div className="bento-section p-4 bg-gradient-to-br from-primary/10 via-background to-purple-500/10 border-primary/15">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="bento-title">Community XP</h3>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl font-black text-foreground">{communityXP}</span>
          <span className="text-caption text-muted-foreground">XP from communities</span>
        </div>
        <p className="text-caption text-muted-foreground">
          Total XP: <span className="font-bold text-foreground">{xp.toLocaleString()}</span> · Level <span className="font-bold text-foreground">{level}</span>
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-background border border-border px-3 py-2 text-center">
            <p className="text-lg font-black text-primary">{discussionCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Discussions</p>
          </div>
          <div className="rounded-xl bg-background border border-border px-3 py-2 text-center">
            <p className="text-lg font-black text-primary">{postsCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Posts</p>
          </div>
        </div>
      </div>

      {/* Badge progress */}
      <div className="bento-section p-4">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-primary" />
          <h3 className="bento-title">Badge Progress</h3>
        </div>
        <div className="space-y-3">
          {communityBadge && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{communityBadge.icon}</span>
                  <div>
                    <p className="text-body-sm font-bold text-foreground leading-none">{communityBadge.name}</p>
                    <p className="text-caption text-muted-foreground">{communityBadge.description}</p>
                  </div>
                </div>
                {earnedIds.has('badge-003') && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                )}
              </div>
              {!earnedIds.has('badge-003') && (
                <>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-700"
                      style={{ width: `${builderProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{discussionCount}/3 discussions</p>
                </>
              )}
            </div>
          )}
          {voiceBadge && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{voiceBadge.icon}</span>
                  <div>
                    <p className="text-body-sm font-bold text-foreground leading-none">{voiceBadge.name}</p>
                    <p className="text-caption text-muted-foreground">{voiceBadge.description}</p>
                  </div>
                </div>
                {earnedIds.has('badge-009') && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                )}
              </div>
              {!earnedIds.has('badge-009') && (
                <>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-700"
                      style={{ width: `${voiceProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{postsCount}/5 posts</p>
                </>
              )}
            </div>
          )}
        </div>
        <Link
          to="/app/rewards/hub"
          className="mt-3 w-full btn-secondary text-body-sm inline-flex items-center justify-center gap-1.5"
        >
          <Star className="w-3.5 h-3.5" />
          View all badges
        </Link>
      </div>

      {/* XP actions hint */}
      <div className="bento-section p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="bento-title">Earn XP here</h3>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Post a discussion', xp: XP_TABLE.discussion },
            { label: 'Reply to a thread', xp: XP_TABLE.discussion },
            { label: 'Send a chat message', xp: 5 },
            { label: 'Join a community', xp: XP_TABLE.discussion },
          ].map(({ label, xp: amt }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-caption text-muted-foreground">{label}</span>
              <span className="text-caption font-bold text-primary">+{amt} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Post thread view ──────────────────────────────────────────────────────────
function PostThread({
  postId,
  communityId,
  onBack,
}: {
  postId: string;
  communityId: string;
  onBack: () => void;
}) {
  const { currentUser, addCommunityReply, togglePostReaction, communityPosts } = useAppStore();
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Derive post directly from persisted store state so replies re-render instantly
  const livePost = (communityPosts[communityId] ?? []).find((p) => p.id === postId);

  // Scroll to bottom whenever reply count changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [livePost?.replyCount]);

  if (!livePost) {
    return (
      <div className="bento-section p-10 text-center text-muted-foreground">
        <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p className="text-body font-semibold">Post not found</p>
        <button onClick={onBack} className="btn-secondary mt-4 text-body-sm">Back</button>
      </div>
    );
  }

  const handleReply = () => {
    const text = reply.trim();
    if (!text || submitting) return;
    setSubmitting(true);
    addCommunityReply(communityId, livePost.id, text);
    setReply('');
    // reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    toast.success('Reply posted! +15 XP');
    setSubmitting(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  const REACTIONS = ['❤️', '🔥', '👏', '😂', '🎯'];

  return (
    <div className="space-y-4">
      {/* Back */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-body-sm font-semibold transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to discussions
      </button>

      {/* ── Original post ────────────────────────────────────────────────── */}
      <div className="bento-section p-5">
        {/* Author row */}
        <div className="flex items-start gap-3 mb-4">
          <img
            src={livePost.authorAvatar ?? `https://i.pravatar.cc/40?u=${livePost.authorId}`}
            alt={livePost.authorName}
            className="w-10 h-10 rounded-full ring-2 ring-border flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-body-sm font-bold text-foreground">{livePost.authorName}</span>
              {livePost.hot && (
                <span className="badge-ai inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Hot
                </span>
              )}
            </div>
            <p className="text-caption text-muted-foreground">{formatRelativeTime(livePost.createdAt)}</p>
          </div>
        </div>

        {/* Title + body */}
        <h2 className="text-h3 font-bold text-foreground mb-3">{livePost.title}</h2>
        <p className="text-body text-foreground/90 leading-relaxed whitespace-pre-wrap mb-4">{livePost.body}</p>

        {/* Optional image */}
        {livePost.imageUrl && (
          <div className="rounded-xl overflow-hidden mb-4">
            <img src={livePost.imageUrl} alt="" className="w-full max-h-72 object-cover" />
          </div>
        )}

        {/* Reaction bar */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
          {REACTIONS.map((emoji) => {
            const users = livePost.reactions[emoji] ?? [];
            const reacted = currentUser ? users.includes(currentUser.id) : false;
            return (
              <button
                key={emoji}
                onClick={() => togglePostReaction(communityId, livePost.id, emoji)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-body-sm font-semibold transition-all border ${
                  reacted
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-background border-border hover:border-primary/30 hover:bg-primary/5 text-muted-foreground'
                }`}
              >
                <span>{emoji}</span>
                {users.length > 0 && <span className="text-[11px] font-bold">{users.length}</span>}
              </button>
            );
          })}
          <span className="ml-auto text-caption text-muted-foreground flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" />
            {livePost.replyCount} {livePost.replyCount === 1 ? 'reply' : 'replies'}
          </span>
        </div>
      </div>

      {/* ── Replies list ─────────────────────────────────────────────────── */}
      {livePost.replies.length > 0 && (
        <div className="space-y-2">
          {livePost.replies.map((r, idx) => {
            const isOwn = r.userId === currentUser?.id;
            return (
              <div
                key={r.id}
                className={`bento-section p-4 flex gap-3 transition-all ${
                  idx === livePost.replies.length - 1 ? 'border-primary/20' : ''
                }`}
              >
                <img
                  src={r.userAvatar ?? `https://i.pravatar.cc/40?u=${r.userId}`}
                  alt={r.userName}
                  className="w-9 h-9 rounded-full ring-2 ring-border flex-shrink-0 self-start mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-body-sm font-bold ${isOwn ? 'text-primary' : 'text-foreground'}`}>
                      {isOwn ? 'You' : r.userName}
                    </span>
                    {isOwn && (
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                    <span className="text-caption text-muted-foreground">{formatRelativeTime(r.createdAt)}</span>
                  </div>
                  <p className="text-body-sm text-foreground/90 leading-relaxed">{r.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}

      {livePost.replies.length === 0 && (
        <div className="bento-section p-6 text-center text-muted-foreground">
          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-body-sm font-semibold">No replies yet</p>
          <p className="text-caption mt-0.5">Be the first to reply and earn +15 XP</p>
        </div>
      )}

      {/* ── Reply composer ────────────────────────────────────────────────── */}
      <div className="bento-section p-4">
        <div className="flex items-center gap-2 mb-3">
          <img
            src={currentUser?.avatar ?? `https://i.pravatar.cc/40?u=me`}
            alt="You"
            className="w-8 h-8 rounded-full ring-2 ring-border flex-shrink-0"
          />
          <span className="text-body-sm font-semibold text-foreground">
            {currentUser?.name ?? 'You'}
          </span>
          <span className="ml-auto text-caption text-primary font-bold">+15 XP per reply</span>
        </div>
        <textarea
          ref={textareaRef}
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write your reply… (Enter to send, Shift+Enter for new line)"
          rows={3}
          className="input-base w-full resize-none mb-3 text-body-sm"
          maxLength={1000}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = 'auto';
            t.style.height = `${Math.min(t.scrollHeight, 160)}px`;
          }}
        />
        <div className="flex items-center justify-between gap-3">
          <span className="text-caption text-muted-foreground">{reply.length}/1000</span>
          <button
            onClick={handleReply}
            disabled={!reply.trim() || submitting}
            className="btn-primary text-body-sm px-5 py-2.5 inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Posting…' : 'Post reply'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Live community chat ───────────────────────────────────────────────────────
function CommunityChat({ communityId }: { communityId: string }) {
  const { currentUser, sendCommunityMessage, getCommunityMessages } = useAppStore();
  const messages = getCommunityMessages(communityId);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendCommunityMessage(communityId, input);
    setInput('');
    toast.success('+5 XP');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-22rem)] min-h-[420px]">
      {/* messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 px-1 pb-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
              <MessageSquare className="w-7 h-7 text-primary" />
            </div>
            <p className="text-body font-semibold text-foreground">No messages yet</p>
            <p className="text-body-sm text-muted-foreground mt-1">Be the first to say something!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.userId === currentUser?.id;
            return (
              <div key={msg.id} className={`flex gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                <img
                  src={msg.userAvatar ?? `https://i.pravatar.cc/40?u=${msg.userId}`}
                  alt={msg.userName}
                  className="w-8 h-8 rounded-full ring-2 ring-border flex-shrink-0 self-end"
                />
                <div className={`max-w-[72%] flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
                  {!isOwn && (
                    <span className="text-caption font-bold text-muted-foreground px-1">{msg.userName}</span>
                  )}
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-body-sm leading-relaxed ${
                      isOwn
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-card border border-border rounded-bl-sm text-foreground'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-micro text-muted-foreground px-1">{formatRelativeTime(msg.createdAt)}</span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="bento-section p-3 mt-3 flex items-end gap-3">
        <img
          src={currentUser?.avatar ?? `https://i.pravatar.cc/40?u=me`}
          alt="You"
          className="w-9 h-9 rounded-full ring-2 ring-border flex-shrink-0"
        />
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Message the community… (Enter to send, +5 XP)"
          rows={1}
          className="flex-1 input-base resize-none min-h-[44px] max-h-32 py-2.5 text-body-sm"
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = 'auto';
            t.style.height = `${Math.min(t.scrollHeight, 128)}px`;
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="btn-primary h-11 px-4 flex-shrink-0 disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ── New Post Modal ────────────────────────────────────────────────────────────
function NewPostModal({
  communityId,
  onClose,
  onPosted,
}: {
  communityId: string;
  onClose: () => void;
  onPosted: (post: CommunityPost) => void;
}) {
  const { addCommunityPost } = useAppStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageField, setShowImageField] = useState(false);

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) return;
    const post = addCommunityPost(communityId, title, body, imageUrl.trim() || undefined);
    toast.success('Discussion posted! +15 XP');
    onPosted(post);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-h3 font-bold text-foreground">New Discussion</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-body-sm font-semibold text-foreground mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you want to discuss?"
              className="input-base w-full"
              maxLength={120}
            />
            <p className="text-[10px] text-muted-foreground mt-1 text-right">{title.length}/120</p>
          </div>

          <div>
            <label className="block text-body-sm font-semibold text-foreground mb-1.5">
              Post body <span className="text-red-500">*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your thoughts, questions, or ideas…"
              rows={5}
              className="input-base w-full resize-none"
              maxLength={2000}
            />
            <p className="text-[10px] text-muted-foreground mt-1 text-right">{body.length}/2000</p>
          </div>

          {/* Optional image URL */}
          <div>
            <button
              type="button"
              onClick={() => setShowImageField((v) => !v)}
              className="inline-flex items-center gap-1.5 text-caption text-muted-foreground hover:text-primary transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              {showImageField ? 'Remove image' : 'Add image URL (optional)'}
            </button>
            {showImageField && (
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/…"
                className="input-base w-full mt-2"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-5 border-t border-border">
          <p className="text-caption text-muted-foreground">
            Posting earns <span className="text-primary font-bold">+{XP_TABLE.discussion} XP</span>
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary text-body-sm px-4 py-2">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !body.trim()}
              className="btn-primary text-body-sm px-5 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CommunityDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    communities,
    toggleJoinCommunity,
    recordDiscussion,
    currentUser,
    getCommunityPosts,
    sendDirectMessage,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'discussions' | 'chat' | 'events' | 'members'>('discussions');
  const [view, setView] = useState<View>('list');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);

  const community = communities.find((c) => c.id === id);
  const communityEvents = mockEvents.filter((e) => e.communityId === id);
  const posts = getCommunityPosts(id ?? '');

  const handleToggleJoin = () => {
    if (!community) return;
    toggleJoinCommunity(community.id);
    if (community.isJoined) {
      toast.info(`Left ${community.name}.`);
    } else {
      recordDiscussion();
      toast.success(`Joined ${community.name}! +15 XP`);
    }
  };

  const handleOpenPost = (post: CommunityPost) => {
    setSelectedPostId(post.id);
    setView('post');
    recordDiscussion();
  };

  const handleMessageMember = (memberName: string, memberId: string) => {
    sendDirectMessage(memberId, memberName, 'attendee', `Hi ${memberName}! I saw you in ${community?.name ?? 'the community'} and wanted to connect 👋`);
    toast.success(`Message sent to ${memberName}!`);
    navigate('/app/messages');
  };

  if (!community) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Users className="w-14 h-14 text-muted-foreground/40 mb-4" />
        <h2 className="text-h2 font-bold text-foreground mb-2">Community not found</h2>
        <p className="text-body-sm text-muted-foreground mb-6">
          This community doesn't exist or may have been removed.
        </p>
        <Link to="/app/community" className="btn-primary">
          Back to Communities
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden mb-6">
        <div className="h-52 md:h-64">
          <img
            src={community.coverImage}
            alt={community.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        </div>

        <Link
          to="/app/community"
          className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-white/80 hover:text-white text-body-sm font-semibold transition-colors bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" />
          Communities
        </Link>

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20 mb-3 inline-block">
            {community.category}
          </span>
          <h1 className="text-h2 md:text-h1 font-bold leading-tight mb-1">{community.name}</h1>
          <p className="text-white/80 text-body-sm mb-3 max-w-2xl">{community.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-body-sm">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{community.memberCount.toLocaleString()} members</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{community.eventCount} events</span>
            </div>
            <div className="flex items-center gap-1.5 text-green-300">
              <TrendingUp className="w-4 h-4" />
              <span>Active community</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab bar + Join button ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl flex-wrap">
          {(['discussions', 'chat', 'events', 'members'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setView('list'); }}
              className={`px-4 py-2 rounded-lg text-body-sm font-semibold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'chat' ? 'Live Chat' : tab}
            </button>
          ))}
        </div>

        <button
          onClick={handleToggleJoin}
          className={`text-body-sm px-5 py-2.5 inline-flex items-center gap-2 rounded-xl font-semibold transition-all flex-shrink-0 ${
            community.isJoined
              ? 'border-2 border-green-500/50 text-green-600 bg-green-50 dark:bg-green-900/10 hover:bg-green-100'
              : 'btn-primary'
          }`}
        >
          {community.isJoined && <CheckCircle2 className="w-4 h-4" />}
          {community.isJoined ? 'Joined' : 'Join Community'}
        </button>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-6">
        {/* Main content */}
        <div>
          {/* ── Discussions tab ────────────────────────────────────────────── */}
          {activeTab === 'discussions' && (
            <>
              {view === 'post' && selectedPostId ? (
                <PostThread
                  postId={selectedPostId}
                  communityId={community.id}
                  onBack={() => { setView('list'); setSelectedPostId(null); }}
                />
              ) : (
                <div className="space-y-3">
                  {posts.length === 0 && (
                    <div className="bento-section p-10 text-center text-muted-foreground">
                      <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-body font-semibold">No discussions yet</p>
                      <p className="text-caption mt-1">Be the first to start a conversation.</p>
                    </div>
                  )}

                  {posts.map((post) => {
                    const totalReactions = Object.values(post.reactions).reduce((s, a) => s + a.length, 0);
                    const topEmojis = Object.entries(post.reactions)
                      .filter(([, users]) => users.length > 0)
                      .sort((a, b) => b[1].length - a[1].length)
                      .slice(0, 3);

                    return (
                      <div
                        key={post.id}
                        className="bento-section p-4 hover:border-primary/30 transition-all cursor-pointer group"
                        onClick={() => handleOpenPost(post)}
                      >
                        <div className="flex gap-3">
                          <img
                            src={post.authorAvatar ?? `https://i.pravatar.cc/40?u=${post.authorId}`}
                            alt={post.authorName}
                            className="w-10 h-10 rounded-full ring-2 ring-border flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h3 className="text-body font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                                {post.title}
                              </h3>
                              {post.hot && (
                                <span className="badge-ai flex-shrink-0 inline-flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" /> Hot
                                </span>
                              )}
                            </div>
                            <p className="text-caption text-muted-foreground mb-2">
                              {post.authorName} · {formatRelativeTime(post.createdAt)}
                            </p>
                            <p className="text-caption text-muted-foreground line-clamp-2 mb-3">
                              {post.body}
                            </p>
                            {post.imageUrl && (
                              <div className="rounded-xl overflow-hidden mb-3 h-24">
                                <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="flex items-center gap-1.5 text-caption text-muted-foreground">
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>{post.replyCount} replies</span>
                              </div>
                              {topEmojis.length > 0 && (
                                <div className="flex items-center gap-1">
                                  {topEmojis.map(([emoji, users]) => (
                                    <span key={emoji} className="text-body-sm">
                                      {emoji} <span className="text-caption text-muted-foreground">{users.length}</span>
                                    </span>
                                  ))}
                                </div>
                              )}
                              <span className="ml-auto text-caption text-primary font-semibold">
                                +{XP_TABLE.discussion} XP to reply
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    onClick={() => setShowNewPost(true)}
                    className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:border-primary/50 hover:text-primary font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Start a new discussion
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── Live Chat tab ─────────────────────────────────────────────── */}
          {activeTab === 'chat' && <CommunityChat communityId={community.id} />}

          {/* ── Events tab ────────────────────────────────────────────────── */}
          {activeTab === 'events' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {communityEvents.length === 0 ? (
                <div className="col-span-2 bento-section p-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-body font-semibold text-muted-foreground">No events yet</p>
                  <p className="text-caption text-muted-foreground mt-1">
                    Events from this community will appear here.
                  </p>
                </div>
              ) : (
                communityEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/app/events/${event.id}`}
                    className="card-surface overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-body font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 text-caption text-muted-foreground mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {event.engagement && (
                        <p className="text-caption text-primary font-semibold">
                          {event.engagement.momentumLabel}
                        </p>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* ── Members tab ───────────────────────────────────────────────── */}
          {activeTab === 'members' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 12 }, (_, i) => {
                const memberId = `member-${community.id}-${i}`;
                const memberName = community.members[i]
                  ? community.members[i].name
                  : `Member ${i + 1}`;
                const memberAvatar = community.members[i]
                  ? community.members[i].avatar
                  : `https://i.pravatar.cc/60?img=${i + 10}`;
                const bio = ['Jazz enthusiast', 'Music lover', 'Event goer', 'Community builder', 'Startup founder', 'Tech enthusiast', 'Sports fanatic', 'Art lover', 'Film buff', 'Foodie', 'Traveler', 'Photographer'][i % 12];

                return (
                  <div
                    key={i}
                    className="bento-section p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
                  >
                    <img
                      src={memberAvatar}
                      alt={memberName}
                      className="w-11 h-11 rounded-full ring-2 ring-border flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-bold text-foreground truncate">{memberName}</p>
                      <p className="text-caption text-muted-foreground">{bio}</p>
                    </div>
                    <button
                      onClick={() => handleMessageMember(memberName, memberId)}
                      className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-caption font-semibold border border-border rounded-full hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Message
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar — XP & badges widget */}
        <div className="hidden lg:block">
          <CommunityXPWidget />
        </div>
      </div>

      {/* New post modal */}
      {showNewPost && (
        <NewPostModal
          communityId={community.id}
          onClose={() => setShowNewPost(false)}
          onPosted={(post) => {
            setSelectedPostId(post.id);
            setView('post');
          }}
        />
      )}
    </div>
  );
}
