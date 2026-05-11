import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music, Code, Trophy, Palette, UtensilsCrossed, Briefcase,
  Heart, Gamepad2, Film, Shirt, FlaskConical, Users,
  MapPin, Check, Calendar, ChevronRight, Sparkles,
  ThumbsUp, ThumbsDown, Zap, Star, ArrowRight
} from 'lucide-react';
import { categories } from '../../data/mockData';

const categoryIcons: Record<string, any> = {
  Music, Tech: Code, Sports: Trophy, Art: Palette,
  'Food & Drink': UtensilsCrossed, Business: Briefcase,
  'Health & Wellness': Heart, Gaming: Gamepad2,
  Film, Fashion: Shirt, Science: FlaskConical, Community: Users,
};

const categoryColors: Record<string, string> = {
  Music: 'from-purple-500 to-pink-500',
  Tech: 'from-cyan-500 to-blue-500',
  Sports: 'from-green-500 to-teal-500',
  Art: 'from-pink-500 to-rose-500',
  'Food & Drink': 'from-orange-400 to-yellow-400',
  Business: 'from-blue-500 to-indigo-500',
  'Health & Wellness': 'from-emerald-400 to-green-500',
  Gaming: 'from-violet-500 to-purple-500',
  Film: 'from-red-500 to-orange-500',
  Fashion: 'from-pink-400 to-fuchsia-500',
  Science: 'from-cyan-400 to-teal-500',
  Community: 'from-amber-400 to-orange-400',
};

const previewEvents = [
  { id: 'ai-1', title: 'AI Builders Meetup', category: 'Tech', img: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=400', reason: 'Matches Tech + Business interests' },
  { id: 'ai-2', title: 'Jazz Rooftop Night', category: 'Music', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', reason: 'Popular near your location' },
  { id: 'ai-3', title: 'Weekend Run Crew', category: 'Sports', img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400', reason: 'Fits your weekend rhythm' },
];

const TOTAL_STEPS = 6;

const stepMeta = [
  { label: 'Welcome', icon: Sparkles },
  { label: 'Interests', icon: Star },
  { label: 'Location', icon: MapPin },
  { label: 'Calendar', icon: Calendar },
  { label: 'AI Feed', icon: Zap },
  { label: 'Launch', icon: Check },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(15);
  const [travelPref, setTravelPref] = useState<'local' | 'city' | 'anywhere'>('city');
  const [likedEvents, setLikedEvents] = useState<string[]>([]);
  const [calendarProvider, setCalendarProvider] = useState<string | null>(null);

  const toggleInterest = (cat: string) =>
    setSelectedInterests(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const toggleLike = (id: string, like: boolean) =>
    setLikedEvents(prev =>
      like ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter(e => e !== id)
    );

  const canContinue = () => {
    if (step === 2) return selectedInterests.length >= 3;
    if (step === 3) return location.trim().length > 1;
    return true;
  };

  const pct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Atmospheric background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#7C5CFF]/8 blur-3xl animate-orb" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#00D4FF]/6 blur-3xl animate-orb" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 py-8">
        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#7C5CFF] to-[#00D4FF] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#7C5CFF]/30">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-h1 font-bold text-foreground mb-1">Welcome to Eventra</h1>
          <p className="text-body text-muted-foreground">Set up your personalized experience in {TOTAL_STEPS} steps</p>
        </div>

        {/* ── Step indicator ── */}
        <div className="w-full max-w-2xl mb-6">
          {/* Progress bar */}
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex items-center justify-between">
            {stepMeta.map((s, i) => {
              const num = i + 1;
              const done = num < step;
              const active = num === step;
              return (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    done ? 'bg-[#7C5CFF] text-white' :
                    active ? 'bg-[#7C5CFF]/20 border-2 border-[#7C5CFF] text-[#7C5CFF]' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {done ? <Check className="w-4 h-4" /> : <s.icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-caption hidden sm:block ${active ? 'text-[#7C5CFF] font-semibold' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Card ── */}
        <div className="w-full max-w-2xl surface-panel p-6 sm:p-8">

          {/* Step 1 — Welcome */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-up">
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-2">Your AI-powered event journey starts now</h2>
                <p className="text-body text-muted-foreground">
                  Eventra learns from your interests, location, and behavior to surface events you'll genuinely love.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: Sparkles, title: 'Smart Recommendations', desc: 'AI matches events to your taste', color: 'from-[#7C5CFF] to-[#9B8CFF]' },
                  { icon: Zap, title: 'Explainable AI', desc: 'Always know why we suggest something', color: 'from-[#00D4FF] to-[#4ADEFF]' },
                  { icon: Star, title: 'Earn as You Go', desc: 'XP, badges, and rewards for attending', color: 'from-[#FF9B3D] to-[#FFD56A]' },
                ].map((f) => (
                  <div key={f.title} className="p-4 rounded-2xl bg-muted/40 border border-border">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-3`}>
                      <f.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-body-sm font-bold text-foreground mb-1">{f.title}</p>
                    <p className="text-caption text-muted-foreground">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Interests */}
          {step === 2 && (
            <div className="animate-fade-up">
              <h2 className="text-h2 font-bold text-foreground mb-1">Pick your interests</h2>
              <p className="text-body text-muted-foreground mb-1">Select at least 3 categories to personalize your feed.</p>
              {selectedInterests.length > 0 && selectedInterests.length < 3 && (
                <p className="text-caption text-amber-500 font-semibold mb-4">
                  {3 - selectedInterests.length} more to continue
                </p>
              )}
              {selectedInterests.length >= 3 && (
                <p className="text-caption text-green-500 font-semibold mb-4">
                  ✓ {selectedInterests.length} selected — great choice!
                </p>
              )}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mt-4">
                {categories.map((cat) => {
                  const Icon = categoryIcons[cat] || Users;
                  const active = selectedInterests.includes(cat);
                  const grad = categoryColors[cat] || 'from-[#7C5CFF] to-[#9B8CFF]';
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleInterest(cat)}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                        active
                          ? 'border-[#7C5CFF] bg-[#7C5CFF]/10 scale-[1.03]'
                          : 'border-border bg-muted/30 hover:border-[#7C5CFF]/40'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-caption font-semibold text-foreground text-center leading-tight">{cat}</p>
                      {active && <Check className="w-3 h-3 text-[#7C5CFF]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3 — Location */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-1">Set your location</h2>
                <p className="text-body text-muted-foreground">We'll show events near you first.</p>
              </div>
              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-2">Your city</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7C5CFF]" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Cairo, Egypt"
                    className="w-full pl-10 pr-4 input-base"
                  />
                </div>
              </div>
              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-2">
                  Discovery radius: <span className="text-[#7C5CFF]">{radius} km</span>
                </label>
                <input
                  type="range" min="5" max="75" value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full accent-[#7C5CFF]"
                />
                <div className="flex justify-between text-caption text-muted-foreground mt-1">
                  <span>5 km</span><span>75 km</span>
                </div>
              </div>
              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-2">Travel preference</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'local', label: 'Local only', desc: 'Walking distance' },
                    { id: 'city', label: 'Same city', desc: 'Nearby areas' },
                    { id: 'anywhere', label: 'Open to travel', desc: 'Any distance' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setTravelPref(p.id as any)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        travelPref === p.id
                          ? 'border-[#7C5CFF] bg-[#7C5CFF]/10'
                          : 'border-border bg-muted/30 hover:border-[#7C5CFF]/40'
                      }`}
                    >
                      <p className="text-body-sm font-bold text-foreground">{p.label}</p>
                      <p className="text-caption text-muted-foreground">{p.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Calendar */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-1">Connect your calendar</h2>
                <p className="text-body text-muted-foreground">Optional — enables reminders and conflict detection.</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { name: 'Google Calendar', icon: '📅', color: 'from-blue-500 to-blue-600' },
                  { name: 'Apple Calendar', icon: '🍎', color: 'from-gray-600 to-gray-700' },
                  { name: 'Outlook', icon: '📧', color: 'from-blue-600 to-indigo-600' },
                ].map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setCalendarProvider(p.name)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      calendarProvider === p.name
                        ? 'border-[#7C5CFF] bg-[#7C5CFF]/10'
                        : 'border-border bg-muted/30 hover:border-[#7C5CFF]/40'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{p.icon}</span>
                    <p className="text-body-sm font-bold text-foreground">{p.name}</p>
                    <p className="text-caption text-muted-foreground mt-0.5">
                      {calendarProvider === p.name ? '✓ Connected' : 'Connect now'}
                    </p>
                  </button>
                ))}
              </div>
              <p className="text-caption text-muted-foreground">
                You can always connect your calendar later from Settings.
              </p>
            </div>
          )}

          {/* Step 5 — AI Feed Training */}
          {step === 5 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-1">Train your AI feed</h2>
                <p className="text-body text-muted-foreground">Like or skip these suggestions to calibrate your recommendations.</p>
              </div>
              <div className="space-y-3">
                {previewEvents.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-4 p-3 rounded-2xl border border-border bg-muted/30">
                    <img
                      src={ev.img}
                      alt={ev.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-bold text-foreground truncate">{ev.title}</p>
                      <p className="text-caption text-muted-foreground">{ev.category}</p>
                      <p className="text-caption text-[#7C5CFF] mt-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />{ev.reason}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleLike(ev.id, true)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                          likedEvents.includes(ev.id)
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-muted text-muted-foreground hover:bg-green-500/20 hover:text-green-500'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleLike(ev.id, false)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted text-muted-foreground hover:bg-red-500/20 hover:text-red-500 transition-all"
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 6 — Launch */}
          {step === 6 && (
            <div className="text-center py-4 animate-fade-up">
              <div className="w-20 h-20 bg-gradient-to-br from-[#7C5CFF] to-[#00D4FF] rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-[#7C5CFF]/30 animate-bounce-in">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-h1 font-bold text-foreground mb-2">You're all set!</h2>
              <p className="text-body text-muted-foreground mb-6 max-w-sm mx-auto">
                Your AI feed is ready. We'll prioritize{' '}
                <span className="text-[#7C5CFF] font-semibold">
                  {selectedInterests.slice(0, 2).join(' & ') || 'your interests'}
                </span>{' '}
                near <span className="text-[#00D4FF] font-semibold">{location || 'your location'}</span>.
              </p>
              <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-6">
                {[
                  { label: 'AI Readiness', value: '95%' },
                  { label: 'Interests', value: `${selectedInterests.length}` },
                  { label: 'Radius', value: `${radius} km` },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-muted/40 border border-border">
                    <p className="text-h3 font-bold text-foreground">{s.value}</p>
                    <p className="text-caption text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <div className="flex gap-2">
              {step > 1 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="btn-secondary text-body-sm"
                >
                  Back
                </button>
              )}
              <button
                onClick={() => navigate('/app/discover')}
                className="text-body-sm text-muted-foreground hover:text-foreground transition px-3 py-2"
              >
                Skip
              </button>
            </div>
            <button
              onClick={() => step < TOTAL_STEPS ? setStep(s => s + 1) : navigate('/app/discover')}
              disabled={!canContinue()}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === TOTAL_STEPS ? (
                <>Start Exploring <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Continue <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
