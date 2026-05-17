import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { shareOrCopyLink } from '../../lib/demoFeedback';
import { ArrowLeft, Calendar, MapPin, Users, Heart, Share2, Copy, Ticket, BadgeCheck, Sparkles, TrendingUp, Clock, MessageSquare, Bookmark, Zap, Award, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { events, bookmarkedEvents, toggleBookmark, awardXP } = useAppStore();
  const event = events.find((e) => e.id === id);
  const [sharedEvents, setSharedEvents] = useState<Set<string>>(new Set());

  const handleShare = () => {
    if (!event) return;
    shareOrCopyLink(event.title, event.title, `${window.location.origin}/app/events/${event.id}`);
    if (!sharedEvents.has(event.id)) {
      setSharedEvents((prev) => new Set(prev).add(event.id));
      awardXP(10, 'share');
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20 flex items-center justify-center">
        <div className="hero-surface rounded-3xl p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Event not found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">The event you're looking for doesn't exist or has been removed.</p>
          <Link to="/app/discover" className="btn-primary">
            Back to Discover
          </Link>
        </div>
      </div>
    );
  }

  const isBookmarked = bookmarkedEvents.includes(event.id);
  const similarEvents = events.filter(e => e.category === event.category && e.id !== event.id).slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/app/discover" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="font-bold text-body">Back to Discovery</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleBookmark(event.id)}
              className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center transition-all hover:scale-105 border border-border/50"
            >
              <Heart
                className={`w-5 h-5 ${
                  isBookmarked
                    ? 'fill-red-500 text-red-500'
                    : 'text-muted-foreground'
                }`}
              />
            </button>

            <button
              type="button"
              className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center transition-all hover:scale-105 border border-border/50"
              aria-label="Share event"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              type="button"
              className="w-11 h-11 rounded-2xl bg-secondary flex items-center justify-center transition-all hover:scale-105 border border-border/50"
              aria-label="Copy link"
              onClick={() => {
                navigator.clipboard
                  .writeText(window.location.href)
                  .then(() => toast.success('Link copied!'))
                  .catch(() => toast.error('Could not copy link'));
                if (event && !sharedEvents.has(event.id)) {
                  setSharedEvents((prev) => new Set(prev).add(event.id));
                  awardXP(10, 'share');
                }
              }}
            >
              <Copy className="w-5 h-5 text-muted-foreground" />
            </button>

            <Link
              to={`/app/events/${event.id}/rsvp`}
              className="btn-primary h-11 px-6 shadow-lg shadow-primary/20"
            >
              Get Tickets
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Hero Image Section */}
            <div className="relative rounded-[2.5rem] overflow-hidden group shadow-2xl ring-1 ring-border/50">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-[540px] object-cover group-hover:scale-[1.02] transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night-0/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute top-8 left-8 flex gap-3">
                <span className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-caption font-black uppercase tracking-widest rounded-full">
                  {event.category}
                </span>
                {event.isRecommended && (
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full">
                    <Sparkles className="w-4 h-4 text-primary-soft" />
                    <span className="text-caption font-black uppercase tracking-widest text-white">95% Match</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content Details */}
            <div className="bento-section p-10">
              <div className="max-w-3xl">
                <h1 className="text-display font-bold text-foreground mb-8 leading-[1.15]">{event.title}</h1>

                {/* Event Highlights Grid */}
                <div className="grid sm:grid-cols-3 gap-6 mb-12">
                  <div className="p-5 rounded-3xl bg-secondary/30 border border-border/50">
                    <div className="icon-box bg-primary/10 text-primary mb-4">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest mb-1">When</p>
                    <p className="text-body-sm font-bold text-foreground">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-micro text-muted-foreground font-medium">
                      {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="p-5 rounded-3xl bg-secondary/30 border border-border/50">
                    <div className="icon-box bg-cyan-500/10 text-cyan-500 mb-4">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest mb-1">Where</p>
                    <p className="text-body-sm font-bold text-foreground truncate">{event.location.venue}</p>
                    <p className="text-micro text-muted-foreground font-medium truncate">{event.location.city}</p>
                  </div>

                  <div className="p-5 rounded-3xl bg-secondary/30 border border-border/50">
                    <div className="icon-box bg-orange-500/10 text-orange-500 mb-4">
                      <Users className="w-5 h-5" />
                    </div>
                    <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest mb-1">Capacity</p>
                    <p className="text-body-sm font-bold text-foreground">{event.rsvpCount} Attending</p>
                    <p className="text-micro text-muted-foreground font-medium">{event.capacity - event.rsvpCount} spots left</p>
                  </div>
                </div>

                {/* Organizer Info */}
                <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-secondary/20 border border-border/50 mb-12">
                  <div className="relative">
                    <img
                      src={event.organizer.avatar}
                      alt={event.organizer.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-background shadow-xl"
                    />
                    {event.organizer.verified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center ring-2 ring-background shadow-lg">
                        <BadgeCheck className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest mb-1">Organized By</p>
                    <h3 className="text-h3 font-bold text-foreground truncate">{event.organizer.name}</h3>
                  </div>
                  <button className="btn-secondary px-6 font-bold h-11">
                    Follow
                  </button>
                </div>

                {/* About Section */}
                <div className="space-y-6 mb-12">
                  <h2 className="text-h2 font-bold text-foreground flex items-center gap-3">
                    About this event
                    <div className="h-px flex-1 bg-border/50"></div>
                  </h2>
                  <p className="text-body-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>

                {/* Engagement Rewards */}
                {event.engagement && (
                  <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-orange-500/10 via-purple-500/5 to-cyan-500/10 border border-orange-500/20 mb-12">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="icon-box bg-orange-500/20 text-orange-500 scale-125">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-h3 font-bold text-foreground">Engagement Rewards</h3>
                        <p className="text-body-sm text-muted-foreground">Boost your level by attending</p>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-orange-500/20">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 font-bold">
                          +{event.engagement.xpReward}
                        </div>
                        <span className="text-body-sm font-bold text-foreground">Experience Points</span>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-background/50 border border-purple-500/20">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                          <Award className="w-5 h-5" />
                        </div>
                        <span className="text-body-sm font-bold text-foreground">{event.engagement.badgeUnlock} Badge</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2.5">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-secondary/40 text-muted-foreground text-caption font-bold rounded-xl border border-border/50 hover:border-primary/40 hover:text-foreground transition-all cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">
              {/* Ticket Selection Preview */}
              <div className="bento-section">
                <h3 className="text-h3 font-bold text-foreground mb-6">Select Tickets</h3>
                <div className="space-y-4 mb-8">
                  {event.ticketTypes.map((ticket, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/40 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-foreground group-hover:text-primary transition-colors">{ticket.name}</p>
                        <p className="text-h4 font-bold gradient-text">
                          {ticket.price === 0 ? 'FREE' : `EGP ${ticket.price.toLocaleString()}`}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-caption text-muted-foreground">{ticket.available} spots left</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to={`/app/events/${event.id}/rsvp`}
                  className="btn-primary w-full py-4 text-h4 h-auto shadow-xl shadow-primary/25"
                >
                  Reserve Your Spot
                </Link>
                <p className="mt-4 text-center text-micro text-muted-foreground">
                  Powered by Eventra Secure Checkout
                </p>
              </div>

              {/* Quick Action Activity */}
              <div className="bento-section">
                <h3 className="text-h4 font-bold text-foreground mb-5 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Live Activity
                </h3>
                <div className="space-y-4">
                  <div className="activity-item">
                    <div className="activity-icon-wrapper">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-body-sm font-bold text-foreground">Popular choice</p>
                      <p className="text-micro text-muted-foreground">50+ people viewed this today</p>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon-wrapper text-orange-500">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-body-sm font-bold text-foreground">Filling fast</p>
                      <p className="text-micro text-muted-foreground">Only few tickets remaining</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Events */}
        {similarEvents.length > 0 && (
          <div className="mt-20 space-y-8">
            <div className="flex items-center gap-4">
              <div className="icon-box bg-primary/10 text-primary">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-h2 font-bold text-foreground">You Might Also Like</h2>
                <p className="text-body-sm text-muted-foreground">Based on your interest in {event.category}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {similarEvents.map((similarEvent) => (
                <Link
                  key={similarEvent.id}
                  to={`/app/events/${similarEvent.id}`}
                  className="group bento-section p-0 overflow-hidden hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={similarEvent.image}
                      alt={similarEvent.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-background/80 backdrop-blur-md rounded-full text-micro font-bold">
                      {similarEvent.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-h4 font-bold text-foreground line-clamp-2 mb-4 group-hover:text-primary transition-colors">
                      {similarEvent.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-caption font-bold">
                          {new Date(similarEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <span className="text-caption font-black text-primary">
                        {similarEvent.ticketTypes[0]?.price === 0 ? 'FREE' : `EGP ${similarEvent.ticketTypes[0]?.price}`}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

