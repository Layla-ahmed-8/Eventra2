import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Calendar, Users, Trophy, Search, ArrowRight, Zap,
  Brain, Target, BarChart3, MessageSquare, Shield, Star, TrendingUp,
  Award, Bot, Moon, Sun, Play, CheckCircle2, Hash, Heart,
  ThumbsUp, MessageCircle, Share2, Flame, Globe, ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Logo from '../../components/Logo';

// ── Floating avatar cluster ───────────────────────────────────────────────────
function AvatarCluster({ avatars, label }: { avatars: string[]; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {avatars.map((src, i) => (
          <img key={i} src={src} alt="" className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover" />
        ))}
      </div>
      <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{label}</span>
    </div>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center px-6 py-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/40 dark:border-slate-700/40 shadow-lg">
      <span className={`text-2xl font-extrabold ${color}`}>{value}</span>
      <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 text-center">{label}</span>
    </div>
  );
}

const communityThreads = [
  {
    community: 'Cairo Music Lovers',
    category: 'Music',
    avatar: 'https://i.pravatar.cc/40?img=11',
    author: 'Nour Ahmed',
    time: '2 min ago',
    title: 'Best jazz venues in Cairo this summer? 🎷',
    replies: 24,
    likes: 87,
    hot: true,
    color: 'from-purple-500 to-pink-500',
    emoji: '🎵',
  },
  {
    community: 'Tech Cairo Hub',
    category: 'Tech',
    avatar: 'https://i.pravatar.cc/40?img=22',
    author: 'Omar Farouk',
    time: '8 min ago',
    title: 'Who else is going to the AI Summit next week?',
    replies: 41,
    likes: 132,
    hot: true,
    color: 'from-cyan-500 to-blue-500',
    emoji: '🚀',
  },
  {
    community: 'Cairo Foodies',
    category: 'Food',
    avatar: 'https://i.pravatar.cc/40?img=33',
    author: 'Amira Hassan',
    time: '15 min ago',
    title: 'Street Food Festival vendor lineup just dropped 🍜',
    replies: 18,
    likes: 64,
    hot: false,
    color: 'from-orange-400 to-yellow-400',
    emoji: '🍜',
  },
  {
    community: 'Art & Culture Enthusiasts',
    category: 'Art',
    avatar: 'https://i.pravatar.cc/40?img=44',
    author: 'Farida Zaki',
    time: '32 min ago',
    title: 'Voices of the Nile exhibition — my honest review 🎨',
    replies: 9,
    likes: 38,
    hot: false,
    color: 'from-pink-500 to-rose-500',
    emoji: '🎨',
  },
];

const liveActivities = [
  { icon: '🎟️', text: 'Karim just RSVPed to Cairo Jazz Night', time: 'just now' },
  { icon: '💬', text: 'New discussion in Tech Cairo Hub', time: '1 min ago' },
  { icon: '🏆', text: 'Sarah unlocked "Music Lover" badge', time: '3 min ago' },
  { icon: '👥', text: '12 people joined Cairo Foodies today', time: '5 min ago' },
  { icon: '⚡', text: 'AI Summit is trending in your area', time: '8 min ago' },
];

export default function Landing() {
  const { theme, toggleTheme } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F7F6FF] dark:bg-[#0A0F1E] text-foreground transition-colors duration-500 overflow-x-hidden">

        {/* ── Ambient background orbs ── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-400/15 to-cyan-400/10 blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-pink-400/10 to-purple-400/10 blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/8 blur-3xl" />
        </div>

        {/* ── Navbar ── */}
        <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-white/75 dark:bg-[#0A0F1E]/80 border-b border-purple-200/20 dark:border-purple-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Logo variant="horizontal" theme={theme === 'dark' ? 'dark' : 'light'} className="h-8 w-auto" />

              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-1 text-sm">
                {[
                  { href: '#features', label: 'Features' },
                  { href: '#ai', label: 'AI Powered' },
                  { href: '#community', label: 'Community' },
                  { href: '#organizers', label: 'For Organizers' },
                ].map(item => (
                  <a key={item.href} href={item.href}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-purple-100/60 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-all">
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button onClick={toggleTheme}
                  className="p-2 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-purple-100/60 dark:hover:bg-purple-900/30 transition-all"
                  aria-label="Toggle dark mode">
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <Link to="/login" className="hidden sm:block text-sm text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all px-3 py-2">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary text-sm">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="relative z-10 pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left copy */}
              <div className="space-y-7">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-cyan-100 dark:from-purple-900/50 dark:to-cyan-900/50 border border-purple-200/40 dark:border-purple-700/40 text-purple-700 dark:text-purple-300 text-sm font-semibold shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-powered event discovery · 2026
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.08] tracking-tight">
                  Discover events<br />
                  that actually{' '}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-[#7C5CFF] via-[#C084FC] to-[#00D4FF] bg-clip-text text-transparent">
                      matter to you.
                    </span>
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] rounded-full opacity-40" />
                  </span>
                </h1>

                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                  AI-powered matching, gamified engagement, live community connections, and organizer tools — all in one premium platform.
                </p>

                {/* Social proof avatars */}
                <AvatarCluster
                  avatars={['https://i.pravatar.cc/40?img=25','https://i.pravatar.cc/40?img=12','https://i.pravatar.cc/40?img=47','https://i.pravatar.cc/40?img=33','https://i.pravatar.cc/40?img=22']}
                  label="50,000+ people already exploring"
                />

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <Link to="/signup" className="btn-primary px-6 py-3 text-base">
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-base hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all">
                    <Play className="w-4 h-4 fill-current" />
                    See Demo
                  </Link>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <StatPill value="3.4K+" label="Events matched / month" color="text-purple-600 dark:text-purple-400" />
                  <StatPill value="320+" label="Active communities" color="text-cyan-600 dark:text-cyan-400" />
                  <StatPill value="+28%" label="Avg RSVP uplift" color="text-green-600 dark:text-green-400" />
                </div>
              </div>

              {/* Right — hero card */}
              <div className="relative">
                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 z-20 flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Live activity</span>
                </div>

                {/* Floating XP badge */}
                <div className="absolute -bottom-4 -left-4 z-20 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl shadow-xl text-white">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-bold">+120 XP earned!</span>
                </div>

                <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-purple-100/60 dark:border-purple-900/40 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700"
                    alt="Event"
                    className="w-full h-52 object-cover"
                  />
                  {/* Gradient overlay on image */}
                  <div className="absolute top-0 left-0 right-0 h-52 bg-gradient-to-b from-transparent via-transparent to-white/20 dark:to-slate-800/40" />

                  {/* AI badge on image */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300">95% Match</span>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">Music · Cairo</p>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Cairo Jazz Night: Live at Sunset</h3>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">May 15 · 7:00 PM</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">EGP 150</span>
                    </div>

                    {/* Vibe tags */}
                    <div className="flex flex-wrap gap-2">
                      {['Music lovers', 'Chill atmosphere', 'Networking-friendly'].map(tag => (
                        <span key={tag} className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-100 dark:border-purple-800/50">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Avatar cluster + momentum */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                          {['11','12','13','14','15'].map(n => (
                            <img key={n} src={`https://i.pravatar.cc/32?img=${n}`} alt="" className="w-7 h-7 rounded-full ring-2 ring-white dark:ring-slate-800" />
                          ))}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">People are joining right now</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">Trending</span>
                      </div>
                    </div>

                    <Link to="/signup" className="btn-primary w-full justify-center text-sm">
                      Reserve Your Spot
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TICKER_PLACEHOLDER */}
        <section className="py-12 border-y border-slate-200/40 dark:border-slate-800/40 bg-white/30 dark:bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8">
              Trusted by leading communities and event organizers
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-50 grayscale dark:invert">
              {['Tech Cairo', 'MusicHub', 'ArtVibe', 'FoodConnect', 'DevSummit', 'CairoJazz'].map(name => (
                <span key={name} className="text-xl font-black tracking-tighter text-slate-900">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-[0.2em]">Platform Features</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Everything you need to discover, attend, and connect
              </h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Sparkles className="w-6 h-6 text-purple-500" />,
                  title: 'Personalized Discovery',
                  desc: 'Our AI learns your taste to suggest events you\'ll actually love, not just what\'s trending.'
                },
                {
                  icon: <Search className="w-6 h-6 text-cyan-500" />,
                  title: 'Ask, Don\'t Filter',
                  desc: 'Search like a human. "Jazz concerts this weekend under EGP 200" — our AI handles the rest.'
                },
                {
                  icon: <Users className="w-6 h-6 text-pink-500" />,
                  title: 'Build Lasting Connections',
                  desc: 'Join community threads before the event starts. Meet your tribe and keep the vibe going.'
                },
                {
                  icon: <Trophy className="w-6 h-6 text-orange-500" />,
                  title: 'Earn & Achieve',
                  desc: 'Get rewarded for your passion. Unlock badges, earn XP, and get exclusive event perks.'
                },
                {
                  icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
                  title: 'Organizer Dashboard',
                  desc: 'Powerful tools for organizers to manage tickets, analyze audience, and grow communities.'
                },
                {
                  icon: <Shield className="w-6 h-6 text-green-500" />,
                  title: 'Secure & Seamless',
                  desc: 'Fast checkout, secure digital tickets, and verified organizer profiles for peace of mind.'
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 hover:border-purple-200 dark:hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-24 bg-purple-50/50 dark:bg-purple-900/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Your journey to great experiences</h2>
              <p className="text-slate-600 dark:text-slate-400">Four simple steps to elevate your social life</p>
            </div>

            <div className="relative">
              {/* Connector line (desktop) */}
              <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-dashed bg-purple-200 dark:bg-purple-800" />
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                {[
                  { step: '01', title: 'Tell us what you love', desc: 'Pick your interests and let our AI curate your personalized feed.' },
                  { step: '02', title: 'RSVP with one click', desc: 'Find your event and secure your spot instantly with seamless checkout.' },
                  { step: '03', title: 'Connect with community', desc: 'Join the discussion, meet attendees, and coordinate before you go.' },
                  { step: '04', title: 'Level up your experience', desc: 'Attend, earn XP, unlock rewards, and build your event reputation.' }
                ].map((item, i) => (
                  <div key={i} className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 border-4 border-purple-100 dark:border-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400 font-black text-xl mx-auto shadow-lg">
                      {item.step}
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 px-4">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FOR ORGANIZERS ── */}
        <section id="organizers" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.2em]">For Organizers</h2>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    Host events that people<br />will never forget
                  </h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    Powerful tools to grow your community and sell out every event.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    'AI-powered audience targeting',
                    'Built-in community engagement tools',
                    'Real-time analytics and reporting',
                    'Seamless ticket management',
                    'Customizable event landing pages'
                  ].map(item => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <Link to="/signup" className="btn-primary px-8 py-4 text-base">
                  Start Organizing
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-[3rem] blur-2xl group-hover:opacity-100 transition-opacity opacity-0" />
                <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400">Analytics Overview</p>
                        <h4 className="font-bold text-slate-900 dark:text-white">Cairo Jazz Festival</h4>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold">
                      Live
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 mb-1">Total Revenue</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">EGP 142.5K</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-500 mb-1">Tickets Sold</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">842 / 1000</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Attendee Vibe Match</span>
                      <span className="text-purple-600">92% Optimal</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 w-[92%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMMUNITY SHOWCASE ── */}
        <section id="community" className="py-24 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-500 blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-cyan-500 blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl font-extrabold leading-tight">
                  Join the most vibrant<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    event communities
                  </span>
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Don't just attend — belong. Our community-first approach ensures you meet people who share your passions before you even arrive.
                </p>
                <div className="flex items-center gap-8 pt-4">
                  <div>
                    <p className="text-3xl font-black text-white">50K+</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Active Members</p>
                  </div>
                  <div className="w-px h-12 bg-slate-800" />
                  <div>
                    <p className="text-3xl font-black text-white">1.2K</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Daily Threads</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {communityThreads.map((thread, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all group">
                    <div className="flex items-start gap-4">
                      <img src={thread.avatar} alt="" className="w-10 h-10 rounded-full border-2 border-slate-800" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-400">{thread.community}</span>
                          <span className="text-[10px] text-slate-500">{thread.time}</span>
                        </div>
                        <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-1">
                          {thread.title}
                        </h4>
                        <div className="flex items-center gap-4 pt-1">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <MessageSquare className="w-3.5 h-3.5" /> {thread.replies}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Heart className="w-3.5 h-3.5" /> {thread.likes}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-purple-600 to-blue-700 p-12 lg:p-20 text-center text-white">
              <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#ffffff,transparent)]" />
              </div>
              
              <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                <h2 className="text-4xl sm:text-5xl font-black leading-tight">
                  Ready to discover your next favorite experience?
                </h2>
                <p className="text-lg text-purple-100">
                  Join 50,000+ people discovering events that actually matter. No credit card required. Free forever.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Link to="/signup" className="px-10 py-5 rounded-full bg-white text-purple-600 font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-black/20">
                    Get Started Free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-slate-900 text-slate-400 py-20 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
              <div className="col-span-2 space-y-6">
                <Logo variant="horizontal" theme="dark" className="h-8 w-auto opacity-80" />
                <p className="max-w-xs text-sm leading-relaxed">
                  The AI-powered social ecosystem for discovering experiences and building real-world communities.
                </p>
                <div className="flex gap-4">
                  {[Globe, Heart, MessageSquare, Share2].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all">
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs">Product</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Discover</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">AI Search</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Communities</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Rewards</a></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs">Resources</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">For Organizers</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">API Docs</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Guidelines</a></li>
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-white font-bold uppercase tracking-widest text-xs">Company</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest">
              <p>© 2026 Eventra AI. Built for the future of social.</p>
              <div className="flex gap-8">
                <a href="#" className="hover:text-white transition-colors">English (US)</a>
                <a href="#" className="hover:text-white transition-colors">Status: Operational</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
