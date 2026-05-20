import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music, Code, Trophy, Palette, UtensilsCrossed, Briefcase,
  Heart, Gamepad2, Film, Shirt, FlaskConical, Users,
  MapPin, Check, Calendar, ChevronRight, Sparkles,
  ThumbsUp, ThumbsDown, Zap, Star, ArrowRight,
  CheckCircle2, Image, ArrowLeft, Award
} from 'lucide-react';
import { categories } from '../../data/mockData';
import Logo from '../../components/Logo';

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

const TOTAL_STEPS = 4;

const stepMeta = [
  { label: 'Welcome', icon: Sparkles },
  { label: 'Avatar', icon: Users },
  { label: 'Interests', icon: Star },
  { label: 'Summary', icon: CheckCircle2 },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/150?img=33');

  const toggleInterest = (cat: string) =>
    setInterests(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      navigate('/login?afterOnboarding=1');
    }
  };

  const canContinue = () => {
    if (step === 3) return interests.length >= 3;
    return true;
  };

  const pct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo variant="horizontal" className="h-10 w-auto" />
          </div>
          <h1 className="text-h1 font-bold text-foreground mb-2">Welcome to the future of events</h1>
          <p className="text-body text-muted-foreground">Let's personalize your experience in just a few steps</p>
        </div>

        {/* Step indicator */}
        <div className="w-full max-w-2xl mb-10">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-primary transition-all duration-700 ease-out shadow-[0_0_12px_rgba(108,76,241,0.4)]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            {stepMeta.map((s, i) => {
              const num = i + 1;
              const done = num < step;
              const active = num === step;
              return (
                <div key={s.label} className="flex flex-col items-center gap-2 group">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    done ? 'bg-primary text-white' :
                    active ? 'bg-primary/20 border-2 border-primary text-primary scale-110 shadow-lg shadow-primary/20' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {done ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className={`w-5 h-5 ${active ? 'animate-pulse' : ''}`} />}
                  </div>
                  <span className={`text-caption font-bold uppercase tracking-widest hidden sm:block ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-2xl bento-section p-10 animate-in fade-in zoom-in-95 duration-500">

          {/* Step 1 — Welcome */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h2 className="text-display font-bold text-foreground leading-tight">Ready for a <span className="gradient-text">smarter</span> way to discover?</h2>
                <p className="text-body-lg text-muted-foreground leading-relaxed">
                  Eventra uses AI to understand your unique interests and connect you with experiences you'll actually love.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: Zap, label: 'Smart Recs', color: 'text-orange-500' },
                  { icon: Users, label: 'Community', color: 'text-cyan-500' },
                  { icon: Award, label: 'Rewards', color: 'text-primary' },
                ].map((f) => (
                  <div key={f.label} className="p-4 rounded-2xl bg-secondary/30 border border-border/50 text-center space-y-2">
                    <f.icon className={`w-6 h-6 mx-auto ${f.color}`} />
                    <span className="text-caption font-bold text-foreground block">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Avatar */}
          {step === 2 && (
            <div className="space-y-8 text-center">
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-2">Set your identity</h2>
                <p className="text-body text-muted-foreground">This is how the community will see you</p>
              </div>

              <div className="relative group mx-auto w-40">
                <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-500 shadow-2xl">
                  <img
                    src={avatar || 'https://i.pravatar.cc/150?img=33'}
                    alt="Profile"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                  <Image className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-caption font-black uppercase tracking-widest text-muted-foreground">Quick Select</p>
                <div className="flex justify-center gap-4">
                  {[33, 25, 12, 47, 60].map(id => (
                    <button
                      key={id}
                      onClick={() => setAvatar(`https://i.pravatar.cc/150?img=${id}`)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                        avatar.includes(`img=${id}`) ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={`https://i.pravatar.cc/150?img=${id}`} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Interests */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-h2 font-bold text-foreground mb-2">What moves you?</h2>
                <p className="text-body text-muted-foreground">Select at least 3 categories to train your AI discovery engine</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleInterest(cat)}
                    className={`p-4 rounded-2xl text-body-sm font-bold border transition-all duration-300 text-center ${
                      interests.includes(cat)
                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 -translate-y-1'
                        : 'bg-secondary/40 border-border/50 text-muted-foreground hover:bg-secondary/60 hover:border-primary/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {interests.length > 0 && interests.length < 3 && (
                <div className="flex items-center justify-center gap-2 text-primary font-bold animate-pulse">
                  <Sparkles className="w-4 h-4" />
                  <p className="text-body-sm">{3 - interests.length} more to unlock recommendations</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4 — Summary */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-h2 font-bold text-foreground mb-2">Your profile is ready</h2>
                <p className="text-body text-muted-foreground">Here's a snapshot of your new identity</p>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-secondary/30 border border-border/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Logo variant="small" className="w-24 h-auto" />
                </div>
                <div className="flex items-center gap-6 relative z-10">
                  <img src={avatar} alt="" className="w-24 h-24 rounded-3xl object-cover shadow-xl ring-4 ring-primary/10" />
                  <div>
                    <h3 className="text-h2 font-bold text-foreground mb-2">The Explorer</h3>
                    <div className="flex items-center gap-3 text-body-sm font-bold text-primary">
                      <Zap className="w-4 h-4" />
                      <span>Level 1 · 0 XP</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border/50 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-caption font-black uppercase tracking-widest text-muted-foreground mb-3">Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {interests.map(i => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-micro font-black uppercase tracking-wider border border-primary/20">
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-caption font-black uppercase tracking-widest text-muted-foreground mb-3">Status</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-500/10 text-green-600 text-micro font-black uppercase tracking-wider border border-green-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-10 pt-8 border-t border-border/50 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="btn-ghost flex items-center gap-2 font-bold text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={!canContinue()}
              className="btn-primary px-8 h-14 text-body font-bold shadow-xl shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              {step === TOTAL_STEPS ? (
                <>
                  Enter the App <Sparkles className="ml-2 w-5 h-5" />
                </>
              ) : (
                <>
                  Continue <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-12 text-caption font-medium text-muted-foreground flex items-center gap-2">
          Securely powered by <Logo variant="horizontal" className="h-4 w-auto grayscale opacity-50" />
        </p>
      </div>
    </div>
  );
}
