import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ShieldCheck, Building2, Users, Image,
  CheckCircle2, ArrowRight, Crown, Zap, BarChart3,
  MessageSquare, Check, Upload, Mail, Phone, FileText,
  Star, Globe, ChevronRight, Clock, ArrowLeft
} from 'lucide-react';
import Logo from '../../components/Logo';

const TOTAL_STEPS = 5;

const stepMeta = [
  { label: 'Identity', icon: Crown },
  { label: 'Organization', icon: Building2 },
  { label: 'Verification', icon: ShieldCheck },
  { label: 'Branding', icon: Star },
  { label: 'Launch', icon: Zap },
];

export default function OrganizerOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [identityType, setIdentityType] = useState<'solo' | 'brand' | null>(null);
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [teamSize, setTeamSize] = useState(1);
  const [verificationMethod, setVerificationMethod] = useState<'phone' | 'email' | 'id'>('email');
  const [tagline, setTagline] = useState('');
  const [brandColor, setBrandColor] = useState('#7C5CFF');
  const [inviteEmail, setInviteEmail] = useState('');

  const pct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);

  const canContinue = () => {
    if (step === 1) return identityType !== null;
    if (step === 2) return brandName.trim().length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Atmospheric background */}
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
                <div key={s.label} className="flex flex-col items-center gap-2 group">
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
            <div className="space-y-8 animate-fade-up">
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
                ].map((opt) => (
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
                      {opt.perks.map((p) => (
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

          {/* Step 2 — Organization */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-up">
              <div className="text-center">
                <h2 className="text-h2 font-bold text-foreground mb-2">Brand Identity</h2>
                <p className="text-body text-muted-foreground">Tell us about your event brand and audience.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">
                    {identityType === 'brand' ? 'Organization Name' : 'Full Name / Alias'} *
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder={identityType === 'brand' ? 'Eventra Studios' : 'Ahmed Hassan'}
                    className="input-base w-full h-14"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">Primary Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Tech, Music, Wellness..."
                    className="input-base w-full h-14"
                  />
                </div>
              </div>

              {identityType === 'brand' && (
                <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50">
                  <label className="block text-caption font-black uppercase tracking-widest text-muted-foreground mb-4">Team Size</label>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-background rounded-2xl p-1.5 border border-border shadow-inner">
                      <button
                        onClick={() => setTeamSize(Math.max(1, teamSize - 1))}
                        className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-foreground font-bold hover:bg-secondary/80 transition"
                      >−</button>
                      <span className="text-h2 font-bold text-foreground w-16 text-center">{teamSize}</span>
                      <button
                        onClick={() => setTeamSize(teamSize + 1)}
                        className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-foreground font-bold hover:bg-secondary/80 transition"
                      >+</button>
                    </div>
                    <p className="text-body font-bold text-muted-foreground">Team members collaborating on events</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">Website (Optional)</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="url"
                    placeholder="https://yourwebsite.com"
                    className="input-base w-full pl-12 h-14"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Verification */}
          {step === 3 && (
            <div className="space-y-8 animate-fade-up">
              <div className="text-center">
                <h2 className="text-h2 font-bold text-foreground mb-2">Verify your account</h2>
                <p className="text-body text-muted-foreground">Choose a method to unlock organizer privileges.</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { id: 'email' as const, icon: Mail, label: 'Email', desc: 'OTP verification', time: '~2 min' },
                  { id: 'phone' as const, icon: Phone, label: 'Phone', desc: 'SMS code', time: '~1 min' },
                  { id: 'id' as const, icon: FileText, label: 'ID Upload', desc: 'Manual review', time: '~24h' },
                ].map((opt) => (
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
            ) : (
              <div />
            )}

            <button
              onClick={() => step < TOTAL_STEPS ? setStep(step + 1) : navigate('/login?afterOrganizerOnboarding=1')}
              disabled={!canContinue()}
              className="btn-primary bg-cyan-500 hover:bg-cyan-600 border-cyan-500 px-10 h-14 text-body font-bold shadow-xl shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              {step === TOTAL_STEPS ? (
                <>
                  Start Organizing <Sparkles className="ml-2 w-5 h-5" />
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
