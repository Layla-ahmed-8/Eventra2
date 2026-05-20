import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music, Code, Trophy, Palette, UtensilsCrossed, Briefcase,
  Heart, Gamepad2, Film, Shirt, FlaskConical, Users,
  MapPin, CheckCircle2, Sparkles, ThumbsUp, ThumbsDown,
  Zap, Star, ArrowRight, ArrowLeft, Award, Navigation,
} from 'lucide-react';
import { categories } from '../../data/mockData';
import Logo from '../../components/Logo';
import { useAppStore } from '../../store/useAppStore';

const categoryIcons: Record<string, React.ElementType> = {
  Music, Tech: Code, Sports: Trophy, Art: Palette,
  'Food & Drink': UtensilsCrossed, Business: Briefcase,
  'Health & Wellness': Heart, Gaming: Gamepad2,
  Film, Fashion: Shirt, Science: FlaskConical, Community: Users,
};

const previewEvents = [
  { id: 'ai-1', title: 'AI Builders Meetup', category: 'Tech', img: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?w=400', reason: 'Matches Tech + Business interests' },
  { id: 'ai-2', title: 'Jazz Rooftop Night', category: 'Music', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', reason: 'Popular near your location' },
  { id: 'ai-3', title: 'Weekend Run Crew', category: 'Sports', img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400', reason: 'Fits your weekend rhythm' },
];

const TOTAL_STEPS = 5;

const stepMeta = [
  { label: 'Welcome', icon: Sparkles },
  { label: 'Interests', icon: Star },
  { label: 'Location', icon: MapPin },
  { label: 'AI Training', icon: Zap },
  { label: 'Launch', icon: CheckCircle2 },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { updateProfile, setOnboardingCompleted, dismissRecommendation } = useAppStore();

  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [trainedEvents, setTrainedEvents] = useState<Record<string, 'liked' | 'skipped'>>({});

  const toggleInterest = (cat: string) =>
    setInterests(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);

  const trainEvent = (eventId: string, action: 'liked' | 'skipped') => {
    setTrainedEvents(prev => ({ ...prev, [eventId]: action }));
    if (action === 'skipped') dismissRecommendation(eventId);
  };

  const canContinue = () => {
    if (step === 2) return interests.length >= 3;
    return true;
  };

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }
    // Final step — save everything to store
    await updateProfile({
      interests,
      location: city || undefined,
      locationEnabled,
    } as any);
    setOnboardingCompleted(true);
    navigate('/app/discover');
  };

  const pct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
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
                <div key={s.label} className="flex flex-col items-center gap-2">
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
                <h2 className="text-display font-bold text-foreground leading-tight">
                  Ready for a <span className="gradient-text">smarter</span> way to discover?
                </h2>
                <p className="text-body-lg text-muted-foreground leading-relaxed">
                  Eventra uses AI to understand your unique interests and connect you with experiences you'll actually love.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { icon: Zap, label: 'Smart Recs', color: 'text-orange-500' },
                  { icon: Users, label: 'Community', color: 'text-cyan-500' },
                  { icon: Award, label: 'Rewards', color: 'text-primary' },
                ].map(f => (
                  <div key={f.label} className="p-4 rounded-2xl bg-secondary/30 border border-border/50 text-center space-y-2">
                    <f.icon className={`w-6 h-6 mx-auto ${f.color}`} />
                    <span className="text-caption font-bold text-foreground block">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Interests */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-h2 font-bold text-foreground mb-2">What moves you?</h2>
                <p className="text-body text-muted-foreground">Select at least 3 categories to train your AI discovery engine</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map(cat => {
                  const Icon = categoryIcons[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleInterest(cat)}
                      className={`p-4 rounded-2xl text-body-sm font-bold border transition-all duration-300 text-center flex flex-col items-center gap-2 ${
                        interests.includes(cat)
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 -translate-y-1'
                          : 'bg-secondary/40 border-border/50 text-muted-foreground hover:bg-secondary/60 hover:border-primary/30'
                      }`}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      {cat}
                    </button>
                  );
                })}
              </div>
              {interests.length > 0 && interests.length < 3 && (
                <div className="flex items-center justify-center gap-2 text-primary font-bold animate-pulse">
                  <Sparkles className="w-4 h-4" />
                  <p className="text-body-sm">{3 - interests.length} more to unlock recommendations</p>
                </div>
              )}
              {interests.length >= 3 && (
                <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <p className="text-body-sm">Great picks! AI is ready to personalize your feed.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Location */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-h2 font-bold text-foreground mb-2">Where are you based?</h2>
                <p className="text-body text-muted-foreground">Help us surface events near you</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">Your City</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Cairo, Egypt"
                      className="input-base w-full pl-12 h-14"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setLocationEnabled(!locationEnabled)}
                  className={`w-full p-5 rounded-[2rem] border-2 transition-all duration-300 text-left flex items-center gap-4 ${
                    locationEnabled
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                      : 'border-border bg-secondary/30 hover:border-primary/40'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    locationEnabled ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-secondary text-muted-foreground'
                  }`}>
                    <Navigation className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-body font-bold text-foreground">Enable GPS location</p>
                    <p className="text-caption text-muted-foreground mt-0.5">
                      {locationEnabled ? 'Location access enabled — you\'ll see nearby events' : 'Allow precise location for better nearby event discovery'}
                    </p>
                  </div>
                  <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    locationEnabled ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {locationEnabled && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                </button>

                <p className="text-caption text-muted-foreground text-center">You can update your location anytime in profile settings</p>
              </div>
            </div>
          )}

          {/* Step 4 — AI Feed Training */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-h2 font-bold text-foreground mb-2">Train your AI feed</h2>
                <p className="text-body text-muted-foreground">Tell us what you like — thumbs up or skip each suggestion</p>
              </div>

              <div className="space-y-4">
                {previewEvents.map(event => {
                  const reaction = trainedEvents[event.id];
                  return (
                    <div
                      key={event.id}
                      className={`p-4 rounded-[2rem] border-2 flex items-center gap-4 transition-all duration-300 ${
                        reaction === 'liked' ? 'border-green-500 bg-green-500/5' :
                        reaction === 'skipped' ? 'border-border bg-secondary/20 opacity-50' :
                        'border-border bg-secondary/30'
                      }`}
                    >
                      <img src={event.img} alt={event.title} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-bold text-foreground truncate">{event.title}</p>
                        <p className="text-caption text-muted-foreground mt-0.5">{event.reason}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-micro font-bold">
                          {event.category}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => trainEvent(event.id, 'liked')}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                            reaction === 'liked'
                              ? 'bg-green-500 text-white shadow-lg'
                              : 'bg-secondary text-muted-foreground hover:bg-green-500/20 hover:text-green-600'
                          }`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => trainEvent(event.id, 'skipped')}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                            reaction === 'skipped'
                              ? 'bg-secondary text-muted-foreground'
                              : 'bg-secondary text-muted-foreground hover:bg-red-500/20 hover:text-red-500'
                          }`}
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-caption text-center text-muted-foreground">
                This step is optional — you can skip it and refine your feed later
              </p>
            </div>
          )}

          {/* Step 5 — Launch */}
          {step === 5 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto text-green-600 mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-h2 font-bold text-foreground mb-2">You're all set!</h2>
                <p className="text-body text-muted-foreground">Here's your personalized profile summary</p>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-secondary/30 border border-border/50 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-caption font-black uppercase tracking-widest text-muted-foreground mb-3">Your Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {interests.length > 0 ? interests.map(i => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-micro font-black uppercase tracking-wider border border-primary/20">
                          {i}
                        </span>
                      )) : (
                        <span className="text-caption text-muted-foreground">None selected</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-caption font-black uppercase tracking-widest text-muted-foreground mb-3">Location</p>
                    <p className="text-body font-bold text-foreground flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      {city || 'Not set'}
                    </p>
                    {locationEnabled && (
                      <span className="inline-flex items-center gap-1 mt-1 text-micro font-bold text-green-600">
                        <Navigation className="w-3 h-3" /> GPS enabled
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-body-sm font-bold text-foreground">Level 1 Explorer</p>
                    <p className="text-caption text-muted-foreground">Start attending events to earn XP and badges</p>
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
            ) : <div />}

            <button
              onClick={handleNext}
              disabled={!canContinue()}
              className="btn-primary px-8 h-14 text-body font-bold shadow-xl shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              {step === TOTAL_STEPS ? (
                <>Enter the App <Sparkles className="ml-2 w-5 h-5" /></>
              ) : (
                <>Continue <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </div>
        </div>

        <p className="mt-12 text-caption font-medium text-muted-foreground flex items-center gap-2">
          Securely powered by <Logo variant="horizontal" className="h-4 w-auto grayscale opacity-50" />
        </p>
      </div>
    </div>
  );
}
