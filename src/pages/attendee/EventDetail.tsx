import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Heart, Share2, Ticket, BadgeCheck, Sparkles, TrendingUp, Clock, MessageSquare, Bookmark, Zap, Award, Activity } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { events, bookmarkedEvents, toggleBookmark, currentUser, userBehaviorType, recordDiscussion } = useAppStore();
  const event = events.find((e) => e.id === id);
  const eng = event?.engagement;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900/20">
      {/* Top Navigation */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-b border-purple-200/20 dark:border-purple-800/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-5 flex items-center justify-between">
          <Link to="/app/discover" className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="font-bold hidden sm:inline">Back</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => toggleBookmark(event.id)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
              >
                <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'}`} />
              </button>
              <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Event Image with Vibe Tags */}
          <div className="relative rounded-3xl overflow-hidden group shadow-2xl">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-56 sm:h-80 lg:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="card-image-overlay"></div>
            
            {/* Live Activity Pulse */}
            {eng && (
              <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-full shadow-lg animate-pulse">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">{eng.softActivityFeedback}</span>
              </div>
            )}
            
            <div className="absolute top-6 left-6 flex gap-3">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-lg">
                {event.category}
              </span>
              {event.isRecommended && (
                <div className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">95% Match</span>
                </div>
              )}
            </div>
            
            {/* Vibe Tags - Floating at bottom */}
            {eng && eng.vibeTags && (
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-2">
                {eng.vibeTags.map((vibe, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-900 dark:text-white text-sm font-semibold rounded-full shadow-lg"
                  >
                    {vibe}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Event Info Card */}
          <div className="hero-surface rounded-3xl p-8 shadow-xl">
            {/* Event Title */}
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">{event.title}</h1>

            {/* AI Recommendation Badge */}
            {event.isRecommended && (
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-2 border-purple-200/50 dark:border-purple-800/50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">AI Recommended for You</h4>
                    <p className="text-slate-600 dark:text-slate-400">Based on your interests in {event.category} and past attendance</p>
                  </div>
                </div>
                {eng?.aiMatchReason && (
                  <div className="mt-4 pt-4 border-t border-purple-200/30 dark:border-purple-800/30">
                    <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                      💡 {eng.aiMatchReason}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Momentum Label + Identity Badge */}
            {eng && (
              <div className="mb-8 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-bold text-green-700 dark:text-green-300">{eng.momentumLabel}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-full">
                  <span className="text-sm font-bold text-purple-700 dark:text-purple-300">{eng.atmosphereLabel}</span>
                </div>
                {eng.identityLabel && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-full">
                    <Award className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-bold text-orange-700 dark:text-orange-300">{eng.identityLabel}</span>
                  </div>
                )}
              </div>
            )}

            {/* Organizer */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-purple-200/20 dark:border-purple-800/20">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-16 h-16 rounded-2xl ring-2 ring-purple-200/50 dark:ring-purple-800/50 shadow-lg"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-bold text-slate-900 dark:text-white text-xl">{event.organizer.name}</p>
                  {event.organizer.verified && (
                    <BadgeCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {event.organizer.followerCount.toLocaleString()} followers
                </p>
              </div>
              <button className="px-6 py-3 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 font-bold transition-all hover:scale-105">
                Follow
              </button>
            </div>

            {/* Event Details */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Date & Time</p>
                  <p className="text-slate-600 dark:text-slate-400 font-medium mb-1">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <p className="text-slate-600 dark:text-slate-400">
                      {new Date(event.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' - '}
                      {new Date(event.endDate).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Location</p>
                  <p className="text-slate-600 dark:text-slate-400 font-semibold text-lg mb-1">{event.location.venue}</p>
                  <p className="text-slate-500 dark:text-slate-500">{event.location.address}</p>
                  <p className="text-slate-500 dark:text-slate-500">
                    {event.location.city}, {event.location.country}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Who's Going</p>
                  {/* Avatar cluster instead of raw count */}
                  {eng && eng.recentAttendees && (
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex -space-x-2">
                        {eng.recentAttendees.slice(0, 5).map((attendee, idx) => (
                          <img
                            key={idx}
                            src={attendee.avatar}
                            alt={attendee.name}
                            title={attendee.name}
                            className="w-9 h-9 rounded-full ring-2 ring-white dark:ring-slate-800 object-cover"
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                        {eng.atmosphereLabel}
                      </span>
                    </div>
                  )}
                  {/* Capacity bar without raw numbers */}
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-sm transition-all duration-700"
                      style={{ width: `${Math.min((event.rsvpCount / event.capacity) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {event.rsvpCount / event.capacity > 0.8 ? 'Filling up fast' : event.rsvpCount / event.capacity > 0.5 ? 'Good interest' : 'Spots available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About this event</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{event.description}</p>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">Tags</h3>
              <div className="flex flex-wrap gap-3">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-bold rounded-2xl hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-all hover:scale-105 cursor-pointer shadow-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Social Preview Section */}
          {eng && (
            <div className="hero-surface rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Social Energy</h2>
                  <p className="text-slate-600 dark:text-slate-400">{eng.softActivityFeedback}</p>
                </div>
              </div>

              {/* Activity Signals */}
              <div className="space-y-3 mb-8">
                {eng.activitySignals.map((signal, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <span className="text-2xl">{signal.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{signal.text}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{signal.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shared Interests */}
              <div className="mb-8">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">People attending are into…</h3>
                <div className="flex flex-wrap gap-2">
                  {eng.sharedInterests.map((interest, idx) => (
                    <span key={idx} className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-sm font-semibold rounded-full">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{eng.discussionCount}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Discussions</div>
                </div>
                <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-2xl">
                  <div className="text-2xl font-bold text-pink-700 dark:text-pink-300">{eng.reactionCount}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Reactions</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
                  <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">{eng.bookmarkCount}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Bookmarks</div>
                </div>
              </div>

              {/* Join Discussion CTA */}
              <button
                onClick={() => recordDiscussion()}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-2 border-purple-200/50 dark:border-purple-800/50 rounded-2xl hover:border-purple-400 dark:hover:border-purple-600 transition-all group"
              >
                <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-purple-700 dark:text-purple-300">Join the conversation</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">+15 XP</span>
              </button>
            </div>
          )}

          {/* Similar Events - AI Powered */}
          {similarEvents.length > 0 && (
            <div className="hero-surface rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white">You Might Also Like</h2>
                  <p className="text-slate-600 dark:text-slate-400">Based on your interests</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {similarEvents.map((similarEvent) => (
                  <Link
                    key={similarEvent.id}
                    to={`/app/events/${similarEvent.id}`}
                    className="group card-surface overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    <img
                      src={similarEvent.image}
                      alt={similarEvent.title}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="p-5">
                      <h4 className="font-bold text-slate-900 dark:text-white line-clamp-2 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {similarEvent.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(similarEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Ticket Options */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="hero-surface rounded-3xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Get Tickets</h2>
              <div className="space-y-4 mb-8">
                {event.ticketTypes.map((ticket, index) => (
                  <div
                    key={index}
                    className="p-5 border-2 border-purple-200/50 dark:border-purple-800/50 rounded-2xl hover:border-purple-400 dark:hover:border-purple-600 transition-all hover:scale-[1.02] bg-white/50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-slate-900 dark:text-white text-lg">{ticket.name}</p>
                      <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                        {ticket.price === 0 ? 'Free' : `${ticket.price} EGP`}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {ticket.available} tickets available
                    </p>
                  </div>
                ))}
              </div>

              <Link
                to={`/app/events/${event.id}/rsvp`}
                className="w-full btn-primary flex items-center justify-center gap-3 mb-8"
              >
                <Ticket className="w-5 h-5" />
                {userBehaviorType === 'passive' ? 'Easy to join — Reserve Your Spot' :
                 userBehaviorType === 'fomo' ? 'Join the experience' :
                 userBehaviorType === 'community' ? 'Meet your crowd' :
                 'Be part of the moment'}
              </Link>

              {/* XP Reward Preview */}
              {eng && (
                <div className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-bold text-orange-700 dark:text-orange-300">+{eng.xpReward} XP for attending</p>
                      {eng.badgeUnlock && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">Unlocks "{eng.badgeUnlock}" badge</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Social Proof Stats — no raw attendee count */}
              <div className="pt-8 border-t border-purple-200/20 dark:border-purple-800/20 space-y-4">
                {eng && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Community energy</span>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i <= Math.ceil((event.rsvpCount / event.capacity) * 5) ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Discussions</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{eng.discussionCount} active</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Reactions</span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{eng.reactionCount}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
