import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, ShieldCheck, Building2, Users, Image,
  CheckCircle2, ArrowRight, Crown, Zap, BarChart3,
  MessageSquare, Check, Upload, Mail, Phone, FileText,
  Star, Globe, ChevronRight
} from 'lucide-react';

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-[#00D4FF]/8 blur-3xl animate-orb" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full bg-[#7C5CFF]/6 blur-3xl animate-orb" style={{ animationDelay: '5s' }} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#00D4FF] to-[#7C5CFF] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00D4FF]/30">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-h1 font-bold text-foreground mb-1">Organizer Setup</h1>
          <p className="text-body text-muted-foreground">Build your brand and launch your first event in minutes</p>
        </div>

        {/* Step indicator */}
        <div className="w-full max-w-2xl mb-6">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00D4FF] to-[#7C5CFF] transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            {stepMeta.map((s, i) => {
              const num = i + 1;
              const done = num < step;
              const active = num === step;
              return (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    done ? 'bg-[#00D4FF] text-white' :
                    active ? 'bg-[#00D4FF]/20 border-2 border-[#00D4FF] text-[#00D4FF]' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {done ? <Check className="w-4 h-4" /> : <s.icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-caption hidden sm:block ${active ? 'text-[#00D4FF] font-semibold' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-2xl surface-panel p-6 sm:p-8">

          {/* Step 1 — Identity */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-1">Choose your organizer identity</h2>
                <p className="text-body text-muted-foreground">How will you be creating events on Eventra?</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    id: 'solo' as const,
                    icon: Users,
                    title: 'Solo Creator',
                    desc: 'Manage events independently and build your personal brand.',
                    perks: ['Personal profile', 'Direct attendee messaging', 'Full analytics'],
                    color: 'from-[#7C5CFF] to-[#9B8CFF]',
                    border: 'border-[#7C5CFF]',
                    bg: 'bg-[#7C5CFF]/10',
                  },
                  {
                    id: 'brand' as const,
                    icon: Building2,
                    title: 'Brand & Venue',
                    desc: 'Set up a verified company or venue account for professional operations.',
                    perks: ['Team collaboration', 'Verified badge', 'Priority support'],
                    color: 'from-[#00D4FF] to-[#4ADEFF]',
                    border: 'border-[#00D4FF]',
                    bg: 'bg-[#00D4FF]/10',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setIdentityType(opt.id)}
                    className={`p-5 rounded-2xl border-2 text-left transition-all hover:-translate-y-0.5 ${
                      identityType === opt.id
                        ? `${opt.border} ${opt.bg}`
                        : 'border-border bg-muted/30 hover:border-border/80'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center mb-4 shadow-md`}>
                      <opt.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-h3 font-bold text-foreground mb-1">{opt.title}</h3>
                    <p className="text-body-sm text-muted-foreground mb-3">{opt.desc}</p>
                    <ul className="space-y-1">
                      {opt.perks.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-caption text-muted-foreground">
                          <Check className="w-3 h-3 text-green-500 flex-shrink-0" />{p}
                        </li>
                      ))}
                    </ul>
                    {identityType === opt.id && (
                      <div className="mt-3 flex items-center gap-1 text-caption font-bold text-[#7C5CFF]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Organization */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-1">Organization details</h2>
                <p className="text-body text-muted-foreground">Tell us about your event brand and audience.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-2">
                    {identityType === 'brand' ? 'Organization name' : 'Your name / alias'} *
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder={identityType === 'brand' ? 'Eventra Studios' : 'Ahmed Hassan'}
                    className="w-full input-base"
                  />
                </div>
                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-2">Primary event category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Tech, Music, Wellness..."
                    className="w-full input-base"
                  />
                </div>
              </div>
              {identityType === 'brand' && (
                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-2">Team size</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTeamSize(Math.max(1, teamSize - 1))}
                      className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground font-bold hover:bg-muted/80 transition"
                    >−</button>
                    <span className="text-h3 font-bold text-foreground w-8 text-center">{teamSize}</span>
                    <button
                      onClick={() => setTeamSize(teamSize + 1)}
                      className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground font-bold hover:bg-muted/80 transition"
                    >+</button>
                    <span className="text-body-sm text-muted-foreground">team members</span>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-2">Website (optional)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="url"
                    placeholder="https://yourwebsite.com"
                    className="w-full pl-10 input-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Verification */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-1">Verify your identity</h2>
                <p className="text-body text-muted-foreground">Choose a verification method to unlock organizer privileges.</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { id: 'email' as const, icon: Mail, label: 'Email', desc: 'Quick verification via email', time: '~2 min' },
                  { id: 'phone' as const, icon: Phone, label: 'Phone', desc: 'SMS code verification', time: '~1 min' },
                  { id: 'id' as const, icon: FileText, label: 'ID Upload', desc: 'Secure identity verification', time: '~24h' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setVerificationMethod(opt.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      verificationMethod === opt.id
                        ? 'border-[#00D4FF] bg-[#00D4FF]/10'
                        : 'border-border bg-muted/30 hover:border-[#00D4FF]/40'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                      verificationMethod === opt.id ? 'bg-[#00D4FF]/20' : 'bg-muted'
                    }`}>
                      <opt.icon className={`w-4 h-4 ${verificationMethod === opt.id ? 'text-[#00D4FF]' : 'text-muted-foreground'}`} />
                    </div>
                    <p className="text-body-sm font-bold text-foreground">{opt.label}</p>
                    <p className="text-caption text-muted-foreground mt-0.5">{opt.desc}</p>
                    <p className="text-caption text-[#00D4FF] font-semibold mt-1">{opt.time}</p>
                  </button>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-[#7C5CFF]/8 border border-[#7C5CFF]/15">
                <p className="text-body-sm text-foreground">
                  <span className="font-semibold">Why verify?</span> Verified organizers get a trust badge, higher event visibility, and access to advanced analytics.
                </p>
              </div>
            </div>
          )}

          {/* Step 4 — Branding */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-1">Brand your profile</h2>
                <p className="text-body text-muted-foreground">Give your organizer page a polished, launch-ready look.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-2">Brand tagline</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Curating premium experiences in Cairo"
                    className="w-full input-base"
                  />
                </div>
                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-2">Brand color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="w-12 h-12 rounded-xl border border-border cursor-pointer"
                    />
                    <span className="text-body-sm text-muted-foreground font-mono">{brandColor}</span>
                  </div>
                </div>
              </div>
              {/* Upload area */}
              <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-[#7C5CFF]/40 transition cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-body-sm font-semibold text-foreground">Upload logo & cover image</p>
                <p className="text-caption text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              </div>
              {/* Preview */}
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <p className="text-caption text-muted-foreground mb-2 font-semibold uppercase tracking-wide">Preview</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-body-sm"
                    style={{ background: brandColor }}
                  >
                    {brandName.charAt(0) || 'E'}
                  </div>
                  <div>
                    <p className="text-body-sm font-bold text-foreground">{brandName || 'Your Brand'}</p>
                    <p className="text-caption text-muted-foreground">{tagline || 'Your tagline here'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5 — Team & Launch */}
          {step === 5 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-1">Team & launch</h2>
                <p className="text-body text-muted-foreground">Invite collaborators and review your launch checklist.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <p className="text-body-sm font-semibold text-foreground">Invite team members</p>
                  <p className="text-caption text-muted-foreground">Collaborate on events, messaging, and analytics.</p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                      className="flex-1 input-base"
                    />
                    <button className="btn-secondary text-body-sm px-3">Invite</button>
                  </div>
                </div>
                <div className="surface-panel p-4">
                  <p className="text-body-sm font-bold text-foreground mb-3">Launch checklist</p>
                  <ul className="space-y-2">
                    {[
                      { label: 'Identity selected', done: identityType !== null },
                      { label: 'Brand details complete', done: brandName.trim().length > 0 },
                      { label: 'Verification method chosen', done: true },
                      { label: 'Profile branded', done: tagline.trim().length > 0 },
                    ].map((item) => (
                      <li key={item.label} className="flex items-center gap-2 text-body-sm">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.done ? 'bg-green-500' : 'bg-muted'
                        }`}>
                          {item.done && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* What's next */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#00D4FF]/8 to-[#7C5CFF]/8 border border-[#00D4FF]/15">
                <p className="text-body-sm font-bold text-foreground mb-2">What happens next?</p>
                <div className="grid sm:grid-cols-3 gap-2">
                  {[
                    { icon: BarChart3, text: 'Access full analytics dashboard' },
                    { icon: MessageSquare, text: 'Message your attendees directly' },
                    { icon: Sparkles, text: 'AI-powered event insights' },
                  ].map((f) => (
                    <div key={f.text} className="flex items-center gap-2 text-caption text-muted-foreground">
                      <f.icon className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0" />
                      {f.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <div className="flex gap-2">
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)} className="btn-secondary text-body-sm">
                  Back
                </button>
              )}
              <button
                onClick={() => navigate('/login?afterOrganizerOnboarding=1')}
                className="text-body-sm text-muted-foreground hover:text-foreground transition px-3 py-2"
              >
                Skip
              </button>
            </div>
            {step < TOTAL_STEPS ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canContinue()}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/login?afterOrganizerOnboarding=1')}
                className="btn-primary"
                style={{ background: 'linear-gradient(135deg, #00D4FF 0%, #7C5CFF 100%)' }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Sign in to open dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
