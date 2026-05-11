import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Users, Trophy, Search, ArrowRight, Zap, Brain, Target, BarChart3, MessageSquare, Shield, Star, TrendingUp, Award, Bot, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Logo from '../../components/Logo';

export default function Landing() {
  const { theme, toggleTheme } = useAppStore();

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-foreground transition-all duration-500">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-purple-200/20 dark:border-purple-800/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <Logo variant="horizontal" className="h-8 w-auto" />
              </div>

              <div className="hidden md:flex items-center gap-8 text-sm text-slate-600 dark:text-slate-300">
                <a href="#features" className="rounded-lg px-3 py-2 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 hover:text-purple-600 transition-all">Features</a>
                <a href="#ai" className="rounded-lg px-3 py-2 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 hover:text-purple-600 transition-all">AI Powered</a>
                <a href="#organizers" className="rounded-lg px-3 py-2 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 hover:text-purple-600 transition-all">For Organizers</a>
                <a href="#community" className="rounded-lg px-3 py-2 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 hover:text-purple-600 transition-all">Community</a>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-all"
                  aria-label="Toggle dark mode"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <Link to="/login" className="text-sm text-slate-600 dark:text-slate-300 hover:text-purple-600 transition-all">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 lg:py-32">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-purple-400/20 to-cyan-400/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-gradient-to-tr from-orange-400/15 to-purple-400/15 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr] items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100/60 to-cyan-100/60 dark:from-purple-900/40 dark:to-cyan-900/40 border border-purple-200/30 dark:border-purple-800/30 text-purple-700 dark:text-purple-300 text-sm font-semibold">
                  <Sparkles className="w-4 h-4" />
                  AI-powered event discovery
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white max-w-3xl leading-[1.05]">
                  Discover events with <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">intelligent</span> recommendations.
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  AI-powered matching, gamified engagement, live community connections, and organizer tools designed to help you find the perfect experience every time.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-2xl">
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-purple-200/20 dark:border-purple-800/20 rounded-2xl p-6 shadow-lg">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Events matched per month</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">3.4K+</p>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-purple-200/20 dark:border-purple-800/20 rounded-2xl p-6 shadow-lg">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Community groups active</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">320+</p>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-purple-200/20 dark:border-purple-800/20 rounded-2xl p-6 shadow-lg">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Average RSVP uplift</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">+28%</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 items-center mt-10">
                  <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg px-8 py-4 inline-flex items-center justify-center">
                    Explore the Platform
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto max-w-lg">
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-3xl bg-gradient-to-br from-cyan-400 to-purple-500 shadow-2xl flex items-center justify-center text-white animate-bounce">
                  <Brain className="w-12 h-12" />
                </div>
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/20 dark:border-purple-800/20 p-8">
                  <img
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600"
                    alt="Event"
                    className="rounded-2xl w-full h-64 object-cover shadow-lg"
                  />
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-semibold">
                      <Sparkles className="w-4 h-4" />
                      AI Recommended for you
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Cairo Jazz Night</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <span>May 15 • 7:00 PM</span>
                      <span>•</span>
                      <span>142 going</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-sm font-medium">Music</span>
                      <span className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 text-sm font-medium">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section id="ai" className="py-32 bg-gradient-to-b from-white/50 to-slate-50/30 dark:from-slate-900 dark:to-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-100/60 to-cyan-100/60 dark:from-purple-900/40 dark:to-cyan-900/40 border border-purple-200/30 dark:border-purple-800/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-bold uppercase tracking-wider mb-6">
                <Bot className="w-5 h-5" />
                AI POWERED PLATFORM
              </div>
              <h2 className="text-5xl lg:text-6xl font-bold mb-8 text-slate-900 dark:text-white">
                Intelligence That <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Works For You</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                Advanced AI features that understand your preferences, predict trends, and optimize every aspect of event discovery and management
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: 'Smart Recommendations',
                  desc: 'Our AI learns from your interests and behavior to suggest events you\'ll genuinely love',
                  color: 'from-purple-500 to-purple-600',
                  stat: '95% match accuracy'
                },
                {
                  icon: Target,
                  title: 'Predictive Analytics',
                  desc: 'Organizers get AI-powered insights on attendance predictions, optimal pricing, and best posting times',
                  color: 'from-cyan-500 to-cyan-600',
                  stat: '+40% attendance'
                },
                {
                  icon: Shield,
                  title: 'Auto Moderation',
                  desc: 'AI screens events and community content to keep the platform safe and spam-free',
                  color: 'from-orange-500 to-orange-600',
                  stat: '99.9% accuracy'
                },
              ].map((feature, idx) => (
                <div key={idx} className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-purple-200/20 dark:border-purple-800/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{feature.desc}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 text-green-700 dark:text-green-300 rounded-full text-sm font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span>{feature.stat}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gamification Section */}
        <section className="py-32 bg-gradient-to-r from-purple-50/30 via-white/50 to-cyan-50/30 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-orange-100/60 to-orange-200/60 dark:from-orange-900/40 dark:to-orange-800/40 border border-orange-200/30 dark:border-orange-800/30 rounded-full text-orange-700 dark:text-orange-300 text-sm font-bold uppercase tracking-wider">
                  <Trophy className="w-5 h-5" />
                  GAMIFICATION
                </div>
                <h2 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                  Level Up Your <span className="bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">Event Journey</span>
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Earn XP, unlock badges, and climb the leaderboards as you attend events, engage with communities, and explore new experiences
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Award, title: 'Earn Badges', desc: '50+ unique badges to collect' },
                    { icon: TrendingUp, title: 'Level System', desc: 'Unlock perks as you progress' },
                    { icon: Users, title: 'Leaderboards', desc: 'Compete with friends' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-purple-200/20 dark:border-purple-800/20 hover:border-purple-300/40 dark:hover:border-purple-700/40 transition-all">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{item.title}</h4>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-200/20 dark:border-purple-800/20 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <img src="https://i.pravatar.cc/150?img=25" alt="User" className="w-20 h-20 rounded-3xl ring-4 ring-purple-200/30 dark:ring-purple-800/30 shadow-lg" />
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Sarah Johnson</h3>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Award className="w-4 h-4 text-orange-500" />
                        <span>Level 8 • 1,580 XP</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/30 dark:to-cyan-900/30 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Level Progress</span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">1,580 / 2,000 XP</span>
                    </div>
                    <div className="h-4 bg-white/50 dark:bg-slate-700/50 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-1000" style={{ width: '79%' }}></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { emoji: '🎵', name: 'Music Lover', color: 'from-purple-500 to-purple-600' },
                      { emoji: '🎨', name: 'Art Explorer', color: 'from-pink-500 to-pink-600' },
                      { emoji: '⚡', name: 'Early Bird', color: 'from-orange-500 to-orange-600' },
                    ].map((badge, idx) => (
                      <div key={idx} className={`bg-gradient-to-br ${badge.color} p-4 rounded-2xl text-center text-white shadow-lg`}>
                        <div className="text-3xl mb-2">{badge.emoji}</div>
                        <div className="text-xs font-bold">{badge.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Grid */}
        <section id="features" className="py-28 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="text-primary font-bold text-sm uppercase tracking-wider mb-4">
                COMPLETE PLATFORM
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-4">
                Everything You Need in <span className="gradient-text">One Place</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Search, title: 'Smart Discovery', desc: 'AI-powered search and filters', color: 'purple' },
                { icon: Calendar, title: 'Never Miss Out', desc: 'Calendar sync & reminders', color: 'cyan' },
                { icon: Users, title: 'Communities', desc: 'Join vibrant interest groups', color: 'orange' },
                { icon: MessageSquare, title: 'Connect', desc: 'Chat with attendees', color: 'pink' },
                { icon: BarChart3, title: 'Analytics', desc: 'Detailed event insights', color: 'purple' },
                { icon: Zap, title: 'Quick RSVP', desc: 'One-click registration', color: 'cyan' },
                { icon: Shield, title: 'Safe & Secure', desc: 'Verified events only', color: 'orange' },
                { icon: Star, title: 'Bookmarks', desc: 'Save favorites for later', color: 'pink' },
              ].map((feature, idx) => (
                <div key={idx} className="bg-card p-6 rounded-2xl shadow-lg border border-border hover:shadow-xl hover:-translate-y-1 transition-all hover-lift group">
                  <feature.icon className={`w-10 h-10 text-${feature.color}-500 mb-4 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Organizer Section */}
        <section id="organizers" className="py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative order-2 md:order-1">
                <div className="glass rounded-3xl p-8 border border-border">
                  <h4 className="text-sm font-bold text-primary mb-4">ORGANIZER DASHBOARD</h4>
                  <div className="space-y-4">
                    <div className="bg-card/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Total Attendees</span>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                      <div className="text-3xl font-bold">1,247</div>
                      <div className="text-xs text-green-500">+23% from last month</div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl p-4 border border-primary/20">
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <Brain className="w-4 h-4" />
                        <span className="text-sm font-bold">AI Insights</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Send reminder emails to boost attendance by 15%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                  <BarChart3 className="w-4 h-4" />
                  FOR ORGANIZERS
                </div>
                <h2 className="text-5xl font-bold mb-6">
                  Create Events That <span className="gradient-text">Stand Out</span>
                </h2>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Powerful tools to create, manage, and grow your events with AI-powered insights and advanced analytics
                </p>
                <div className="space-y-3 mb-8">
                  {[
                    'AI-powered attendance predictions',
                    'Real-time analytics dashboard',
                    'Automated marketing suggestions',
                    'Attendee management tools',
                    'Custom ticketing options',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">✓</span>
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition">
                  Start Creating Events
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6C4CF1] via-[#5739D4] to-[#00C2FF]"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-200 rounded-full blur-3xl"></div>
          </div>
          <div className="relative max-w-4xl mx-auto text-center px-4">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ready to Start Your Event Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join 50,000+ users discovering amazing experiences every day
            </p>
            <Link to="/signup" className="inline-block px-10 py-5 bg-white text-[#6C4CF1] rounded-xl font-bold hover:shadow-2xl transition transform hover:-translate-y-1 text-lg">
              Get Started Free
            </Link>
            <p className="mt-6 text-sm text-white/80">No credit card required • Free forever • Cancel anytime</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Logo variant="horizontal" className="h-7 w-auto" />
                </div>
                <p className="text-muted-foreground text-sm">AI-powered event discovery platform</p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Product</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="hover:text-foreground cursor-pointer transition">Features</div>
                  <div className="hover:text-foreground cursor-pointer transition">For Organizers</div>
                  <div className="hover:text-foreground cursor-pointer transition">Pricing</div>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4">Resources</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="hover:text-foreground cursor-pointer transition">Blog</div>
                  <div className="hover:text-foreground cursor-pointer transition">Help Center</div>
                  <div className="hover:text-foreground cursor-pointer transition">API Docs</div>
                </div>
              </div>
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="hover:text-foreground cursor-pointer transition">About</div>
                  <div className="hover:text-foreground cursor-pointer transition">Careers</div>
                  <div className="hover:text-foreground cursor-pointer transition">Contact</div>
                </div>
              </div>
            </div>
            <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
              <p>&copy; 2026 Eventra. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
