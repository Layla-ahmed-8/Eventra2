import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ShieldCheck, Building2, Users,
  CheckCircle2, ArrowRight, Crown, Zap,
  Mail, Phone, FileText, Clock, ArrowLeft,
  Calendar, Mic2, Ticket, Music, Code, Trophy,
  Palette, UtensilsCrossed, Globe, Check,
} from 'lucide-react';
import Logo from '../../components/Logo';
import { useAppStore } from '../../store/useAppStore';

const TOTAL_STEPS = 5;

const EVENT_TYPE_OPTIONS = [
  { id: 'Conferences', icon: Mic2, color: 'from-blue-500 to-indigo-500' },
  { id: 'Workshops', icon: Code, color: 'from-cyan-500 to-teal-500' },
  { id: 'Concerts', icon: Music, color: 'from-purple-500 to-pink-500' },
  { id: 'Meetups', icon: Users, color: 'from-green-500 to-emerald-500' },
  { id: 'Festivals', icon: Trophy, color: 'from-orange-400 to-yellow-400' },
  { id: 'Exhibitions', icon: Palette, color: 'from-pink-500 to-rose-500' },
  { id: 'Sports Events', icon: Trophy, color: 'from-green-400 to-teal-400' },
  { id: 'Food & Drink', icon: UtensilsCrossed, color: 'from-amber-400 to-orange-400' },
  { id: 'Networking', icon: Globe, color: 'from-cyan-400 to-blue-400' },
  { id: 'Corporate', icon: Building2, color: 'from-slate-400 to-blue-500' },
  { id: 'Cultural', icon: Calendar, color: 'from-fuchsia-500 to-purple-500' },
  { id: 'Tickets', icon: Ticket, color: 'from-red-400 to-pink-500' },
];

const stepMeta = [
  { label: 'Identity', icon: Crown },
  { label: 'Event Types', icon: Calendar },
  { label: 'Verification', icon: ShieldCheck },
  { label: 'Branding', icon: Palette },
  { label: 'Launch', icon: Zap },
];

const BRAND_COLORS = [
  '#7C5CFF', '#06B6D4', '#10B981', '#F59E0B',
  '#EF4444', '#8B5CF6', '#EC4899', '#3B82F6',
];

export default function OrganizerOnboarding() {
  const navigate = useNavigate();
  const { updateProfile, setOnboardingCompleted } = useAppStore();

  const [step, setStep] = useState(1);
  const [identityType, setIdentityType] = useState<'solo' | 'brand' | null>(null);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [verificationMethod, setVerificationMethod] = useState<'phone' | 'email' | 'id'>('email');
  const [tagline, setTagline] = useState('');
  const [brandColor, setBrandColor] = useState('#7C5CFF');

  const pct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);

  const toggleEventType = (id: string) =>
    setEventTypes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const canContinue = () => {
    if (step === 1) return identityType !== null;
    if (step === 2) return eventTypes.length >= 1;
    return true;
  };

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }
    await updateProfile({
      organizerType: identityType ?? undefined,
      eventTypePreferences: eventTypes,
      brandColor,
    } as any);
    setOnboardingCompleted(true);
    navigate('/organizer/analytics');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo variant="horizontal" className="h-10 w-auto" />
          </div>
          <h1 className="text-h1 font-bold text-foreground mb-2">Launch your event brand</h1>
          <p className="text-body text-muted-foreground">Professional tools to create, manage, and grow your audience</p>
        </div>

        {/* Step indicator */}
        <div className="w-full max-w-3xl mb-10">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-cyan-500 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(6,182,212,0.4)]"
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
                    done ? 'bg-cyan-500 text-white' :
                    active ? 'bg-cyan-500/20 border-2 border-cyan-500 text-cyan-500 scale-110 shadow-lg shadow-cyan-500/20' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {done ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className={`w-5 h-5 ${active ? 'animate-pulse' : ''}`} />}
                  </div>
                  <span className={`text-caption font-bold uppercase tracking-widest hidden sm:block ${active ? 'text-cyan-500' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-3xl bento-section p-10 animate-in fade-in zoom-in-95 duration-500">

          {/* Step 1 — Identity */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-h2 font-bold text-foreground mb-2">Choose your identity</h2>
                <p className="text-body text-muted-foreground">How will you be creating events on Eventra?</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    id: 'solo' as const,
                    icon: Users,
                    title: 'Solo Creator',
                    desc: 'Manage events independently and build your personal brand.',
                    perks: ['Personal profile', 'Direct attendee messaging', 'Full analytics'],
                    color: 'bg-primary',
                    activeBorder: 'border-primary',
                    activeBg: 'bg-primary/5',
                  },
                  {
                    id: 'brand' as const,
                    icon: Building2,
                    title: 'Brand & Venue',
                    desc: 'Set up a verified company or venue account for professional operations.',
                    perks: ['Team collaboration', 'Verified badge', 'Priority support'],
                    color: 'bg-cyan-500',
                    activeBorder: 'border-cyan-500',
                    activeBg: 'bg-cyan-500/5',
                  },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setIdentityType(opt.id)}
                    className={`p-8 rounded-[2rem] border-2 text-left transition-all duration-300 group hover:-translate-y-1 ${
                      identityType === opt.id
                        ? `${opt.activeBorder} ${opt.activeBg} shadow-xl`
                        : 'border-border bg-secondary/30 hover:border-border/80'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl ${opt.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                      <opt.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-h3 font-bold text-foreground mb-3">{opt.title}</h3>
                    <p className="text-body-sm text-muted-foreground mb-6 leading-relaxed">{opt.desc}</p>
                    <ul className="space-y-3">
                      {opt.perks.map(p => (
                        <li key={p} className="flex items-center gap-3 text-caption font-bold text-muted-foreground">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${identityType === opt.id ? 'bg-green-500/20' : 'bg-muted'}`}>
                            <Check className={`w-3 h-3 ${identityType === opt.id ? 'text-green-500' : 'text-muted-foreground'}`} />
                          </div>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Event Types */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-h2 font-bold text-foreground mb-2">What events will you create?</h2>
                <p className="text-body text-muted-foreground">Select all the event categories that apply to your work</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {EVENT_TYPE_OPTIONS.map(type => (
                  <button
                    key={type.id}
                    onClick={() => toggleEventType(type.id)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left flex items-center gap-3 ${
                      eventTypes.includes(type.id)
                        ? 'border-cyan-500 bg-cyan-500/5 shadow-lg shadow-cyan-500/10 -translate-y-0.5'
                        : 'border-border bg-secondary/30 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <type.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-body-sm font-bold text-foreground">{type.id}</span>
                    {eventTypes.includes(type.id) && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 ml-auto flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              {eventTypes.length > 0 && (
                <p className="text-caption text-center text-cyan-600 font-bold">
                  {eventTypes.length} {eventTypes.length === 1 ? 'category' : 'categories'} selected
                </p>
              )}
            </div>
          )}

          {/* Step 3 — Verification */}
          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-h2 font-bold text-foreground mb-2">Verify your account</h2>
                <p className="text-body text-muted-foreground">Choose a method to unlock organizer privileges.</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { id: 'email' as const, icon: Mail, label: 'Email', desc: 'OTP verification', time: '~2 min' },
                  { id: 'phone' as const, icon: Phone, label: 'Phone', desc: 'SMS code', time: '~1 min' },
                  { id: 'id' as const, icon: FileText, label: 'ID Upload', desc: 'Manual review', time: '~24h' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setVerificationMethod(opt.id)}
                    className={`p-6 rounded-[2rem] border-2 text-left transition-all duration-300 ${
                      verificationMethod === opt.id
                        ? 'border-cyan-500 bg-cyan-500/5 shadow-xl'
                        : 'border-border bg-secondary/30 hover:border-cyan-500/40'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                      verificationMethod === opt.id ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'bg-secondary text-muted-foreground'
                    }`}>
                      <opt.icon className="w-6 h-6" />
                    </div>
                    <p className="text-body font-bold text-foreground">{opt.label}</p>
                    <p className="text-caption text-muted-foreground mt-1">{opt.desc}</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-micro font-bold">
                      <Clock className="w-3 h-3" /> {opt.time}
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/20 flex items-start gap-4">
                <div className="icon-box bg-primary/20 text-primary mt-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-body-sm font-bold text-foreground mb-1">Verification is required for payouts</p>
                  <p className="text-caption text-muted-foreground">You can skip this for now, but you'll need to verify before withdrawing event revenue.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Branding */}
          {step === 4 && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-h2 font-bold text-foreground mb-2">Brand your profile</h2>
                <p className="text-body text-muted-foreground">Give your organizer profile a distinctive look</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">Tagline (Optional)</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    placeholder="Creating unforgettable experiences since 2024"
                    className="input-base w-full h-14"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">Brand Color</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    {BRAND_COLORS.map(color => (
                      <button
                        key={color}
                        onClick={() => setBrandColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-10 h-10 rounded-2xl transition-all ${brandColor === color ? 'scale-125 shadow-lg ring-4 ring-white ring-offset-2 ring-offset-background' : 'hover:scale-110'}`}
                      />
                    ))}
                    <div className="flex items-center gap-2 ml-2">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={e => setBrandColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer border-0 p-1 bg-secondary"
                      />
                      <span className="text-caption font-bold text-muted-foreground">Custom</span>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="p-6 rounded-[2rem] bg-secondary/30 border border-border/50">
                  <p className="text-caption font-black uppercase tracking-widest text-muted-foreground mb-4">Profile Preview</p>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: brandColor }}>
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-body font-bold text-foreground">Your Organizer Profile</p>
                      {tagline && <p className="text-caption text-muted-foreground mt-0.5">{tagline}</p>}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {eventTypes.slice(0, 3).map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-lg text-micro font-bold text-white" style={{ backgroundColor: brandColor }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5 — Launch */}
          {step === 5 && (
            <div className="space-y-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center mx-auto text-cyan-500 mb-4">
                  <Zap className="w-10 h-10" />
                </div>
                <h2 className="text-h2 font-bold text-foreground mb-2">Ready to start organizing!</h2>
                <p className="text-body text-muted-foreground">Your organizer profile is configured. Here's a summary.</p>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-secondary/30 border border-border/50 space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-caption font-black uppercase tracking-widest text-muted-foreground mb-2">Identity</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: brandColor }}>
                        {identityType === 'brand' ? <Building2 className="w-5 h-5 text-white" /> : <Users className="w-5 h-5 text-white" />}
                      </div>
                      <p className="text-body font-bold text-foreground capitalize">
                        {identityType === 'brand' ? 'Brand & Venue' : 'Solo Creator'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-caption font-black uppercase tracking-widest text-muted-foreground mb-2">Brand Color</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl shadow" style={{ backgroundColor: brandColor }} />
                      <span className="text-body font-bold text-foreground uppercase">{brandColor}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-caption font-black uppercase tracking-widest text-muted-foreground mb-3">Event Types</p>
                  <div className="flex flex-wrap gap-2">
                    {eventTypes.length > 0 ? eventTypes.map(t => (
                      <span key={t} className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-micro font-black uppercase tracking-wider border border-cyan-500/20">
                        {t}
                      </span>
                    )) : (
                      <span className="text-caption text-muted-foreground">None selected</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/50 grid sm:grid-cols-3 gap-3">
                  {[
                    { icon: Zap, label: 'Create Events', color: 'text-cyan-500' },
                    { icon: Crown, label: 'Manage Bookings', color: 'text-primary' },
                    { icon: CheckCircle2, label: 'View Analytics', color: 'text-green-500' },
                  ].map(f => (
                    <div key={f.label} className="p-3 rounded-2xl bg-secondary/50 border border-border/30 flex items-center gap-2">
                      <f.icon className={`w-4 h-4 ${f.color}`} />
                      <span className="text-caption font-bold text-foreground">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-12 pt-8 border-t border-border/50 flex items-center justify-between">
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
              className="btn-primary bg-cyan-500 hover:bg-cyan-600 border-cyan-500 px-10 h-14 text-body font-bold shadow-xl shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              {step === TOTAL_STEPS ? (
                <>Start Organizing <Sparkles className="ml-2 w-5 h-5" /></>
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
