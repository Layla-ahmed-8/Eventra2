import { Link, useParams } from 'react-router-dom';
<<<<<<< Updated upstream
import { ArrowLeft, Calendar, MapPin, Users, Heart, Share2, Ticket, BadgeCheck, Sparkles, TrendingUp, Clock } from 'lucide-react';
=======
import { shareOrCopyLink } from '../../lib/demoFeedback';
import { ArrowLeft, Calendar, MapPin, Users, Heart, Share2, Ticket, BadgeCheck, Sparkles, TrendingUp, Clock, MessageSquare, Bookmark, Zap, Award, Activity } from 'lucide-react';
>>>>>>> Stashed changes
import { useAppStore } from '../../store/useAppStore';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const { events, bookmarkedEvents, toggleBookmark } = useAppStore();
  const event = events.find((e) => e.id === id);

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
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/app/discover" className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all group">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg">Back</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleBookmark(event.id)}
                className="w-12 h-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isBookmarked
                      ? 'fill-red-500 text-red-500'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                />
              </button>
<<<<<<< Updated upstream
              <button className="w-12 h-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg">
                <Share2 className="w-6 h-6 text-slate-600 dark:text-slate-300" />
=======
              <button
                type="button"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/20 dark:border-slate-700/20 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                aria-label="Share event"
                onClick={() =>
                  shareOrCopyLink(event.title, event.title, `${window.location.origin}/app/events/${event.id}`)
                }
              >
                <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-300" />
>>>>>>> Stashed changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Event Image */}
          <div className="relative rounded-3xl overflow-hidden group shadow-2xl">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="card-image-overlay"></div>
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
                <div>
                  <p className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Attendees</p>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    {event.rsvpCount} / {event.capacity} people attending
                  </p>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-sm"
                      style={{ width: `${(event.rsvpCount / event.capacity) * 100}%` }}
                    ></div>
                  </div>
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
                Reserve Your Spot
              </Link>

              {/* Quick Stats */}
              <div className="pt-8 border-t border-purple-200/20 dark:border-purple-800/20 grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{event.rsvpCount}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Going</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{event.capacity - event.rsvpCount}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Spots Left</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
