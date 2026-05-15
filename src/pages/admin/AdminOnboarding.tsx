import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Check, Users, BarChart3,
  Settings, AlertCircle, CheckCircle2, Lock,
  Database, Cpu, Activity, Eye, Flag, ArrowRight,
  ArrowLeft, Sparkles
} from 'lucide-react';
import Logo from '../../components/Logo';

const TOTAL_STEPS = 4;

const stepMeta = [
  { label: 'Welcome', icon: Shield },
  { label: 'Permissions', icon: Lock },
  { label: 'Platform', icon: Settings },
  { label: 'Ready', icon: CheckCircle2 },
];

export default function AdminOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [acknowledgedPermissions, setAcknowledgedPermissions] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({
    newUsers: true,
    eventSubmissions: true,
    payments: true,
    flaggedContent: true,
    systemErrors: true,
  });

  const pct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100);

  const canContinue = () => {
    if (step === 2) return acknowledgedPermissions;
    return true;
  };

  const toggleNotif = (key: keyof typeof notifPrefs) =>
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));

  const permissions = [
    { icon: Users, label: 'User Management', desc: 'Create, suspend, promote, and manage all user accounts' },
    { icon: Eye, label: 'Event Moderation', desc: 'Approve, reject, and flag events across the platform' },
    { icon: Settings, label: 'Platform Configuration', desc: 'Modify global settings, feature flags, and integrations' },
    { icon: BarChart3, label: 'Analytics & Reports', desc: 'Full access to platform metrics and financial data' },
    { icon: Cpu, label: 'AI Engine Control', desc: 'Configure recommendation models and moderation thresholds' },
    { icon: Database, label: 'Audit Log Access', desc: 'Complete visibility into all platform actions and changes' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Logo variant="horizontal" className="h-10 w-auto" />
          </div>
          <h1 className="text-h1 font-bold text-foreground mb-2">Configure administrator access</h1>
          <p className="text-body text-muted-foreground">Set up your command center for platform-wide management</p>
        </div>

        {/* Step indicator */}
        <div className="w-full max-w-2xl mb-10">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-red-500 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(239,68,68,0.4)]"
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
                    done ? 'bg-red-500 text-white' :
                    active ? 'bg-red-500/20 border-2 border-red-500 text-red-500 scale-110 shadow-lg shadow-red-500/20' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {done ? <CheckCircle2 className="w-5 h-5" /> : <s.icon className={`w-5 h-5 ${active ? 'animate-pulse' : ''}`} />}
                  </div>
                  <span className={`text-caption font-bold uppercase tracking-widest hidden sm:block ${active ? 'text-red-500' : 'text-muted-foreground'}`}>
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
            <div className="space-y-8 animate-fade-up">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto text-red-500">
                  <Shield className="w-10 h-10" />
                </div>
                <h2 className="text-h2 font-bold text-foreground">Welcome, Administrator</h2>
                <p className="text-body text-muted-foreground leading-relaxed">
                  You have been granted super administrator access to the Eventra platform. This setup will configure your control center.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Users, title: 'User Control', desc: 'Manage all 12K+ users', color: 'bg-primary' },
                  { icon: Flag, title: 'Content Safety', desc: 'AI-assisted moderation', color: 'bg-red-500' },
                  { icon: BarChart3, title: 'Platform Analytics', desc: 'Real-time metrics', color: 'bg-cyan-500' },
                  { icon: Activity, title: 'System Health', desc: 'Monitor all services', color: 'bg-green-500' },
                ].map((f) => (
                  <div key={f.title} className="p-4 rounded-2xl bg-secondary/30 border border-border/50 space-y-3">
                    <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center shadow-lg`}>
                      <f.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-body-sm font-bold text-foreground">{f.title}</p>
                      <p className="text-caption text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/20 flex items-start gap-4">
                <div className="icon-box bg-red-500/10 text-red-500 mt-1">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <p className="text-body-sm font-medium text-foreground leading-relaxed">
                  <span className="font-bold text-red-500 uppercase tracking-wider">Audit Warning:</span> All administrator actions are logged and audited. Use your platform privileges responsibly.
                </p>
              </div>
            </div>
          )}

          {/* Step 2 — Permissions */}
          {step === 2 && (
            <div className="space-y-8 animate-fade-up">
              <div className="text-center">
                <h2 className="text-h2 font-bold text-foreground mb-2">Review permissions</h2>
                <p className="text-body text-muted-foreground">Understand your capabilities as a super administrator.</p>
              </div>
              <div className="grid gap-3">
                {permissions.map((p, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50 group hover:border-green-500/30 transition-colors">
                    <div className="icon-box bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                      <p.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-body-sm font-bold text-foreground">{p.label}</p>
                      <p className="text-caption text-muted-foreground">{p.desc}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                ))}
              </div>
              <label className="flex items-start gap-4 p-6 rounded-[2rem] border-2 border-border cursor-pointer hover:border-red-500/40 transition-all group bg-secondary/20">
                <div className="pt-1">
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${acknowledgedPermissions ? 'bg-red-500 border-red-500 shadow-lg shadow-red-500/20' : 'border-border bg-background'}`}>
                    {acknowledgedPermissions && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={acknowledgedPermissions}
                    onChange={(e) => setAcknowledgedPermissions(e.target.checked)}
                    className="sr-only"
                  />
                </div>
                <p className="text-body-sm font-medium text-foreground leading-relaxed">
                  I acknowledge my administrator responsibilities and agree to use platform access in accordance with security policies and ethical guidelines.
                </p>
              </label>
            </div>
          )}

          {/* Step 3 — Platform Config */}
          {step === 3 && (
            <div className="space-y-8 animate-fade-up">
              <div className="text-center">
                <h2 className="text-h2 font-bold text-foreground mb-2">Alert Configuration</h2>
                <p className="text-body text-muted-foreground">Choose which system events trigger immediate notifications.</p>
              </div>
              <div className="grid gap-3">
                {(Object.entries(notifPrefs) as [keyof typeof notifPrefs, boolean][]).map(([key, val]) => {
                  const labels: Record<keyof typeof notifPrefs, { label: string; desc: string }> = {
                    newUsers: { label: 'New User Signups', desc: 'Alert when new accounts are created' },
                    eventSubmissions: { label: 'Event Submissions', desc: 'Alert when organizers submit events' },
                    payments: { label: 'Payment Alerts', desc: 'Alert on large transactions or failures' },
                    flaggedContent: { label: 'Flagged Content', desc: 'Alert when content is reported' },
                    systemErrors: { label: 'System Errors', desc: 'Alert on critical platform errors' },
                  };
                  const info = labels[key];
                  return (
                    <div key={key} className="flex items-center justify-between p-5 rounded-2xl bg-secondary/30 border border-border/50">
                      <div>
                        <p className="text-body-sm font-bold text-foreground">{info.label}</p>
                        <p className="text-caption text-muted-foreground">{info.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={val}
                          onChange={() => toggleNotif(key)}
                          className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-secondary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500 shadow-inner" />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4 — Ready */}
          {step === 4 && (
            <div className="text-center py-4 animate-fade-up space-y-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-red-500/30 animate-bounce-in">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-display font-bold text-foreground mb-2">Command Center Ready</h2>
                <p className="text-body-lg text-muted-foreground max-w-sm mx-auto">
                  Your administrator profile is fully configured. You have complete authority over the Eventra platform.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                {[
                  { label: 'Permissions', value: '6 / 6' },
                  { label: 'Alerts', value: `${Object.values(notifPrefs).filter(Boolean).length} Active` },
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                    <p className="text-h2 font-bold text-foreground">{s.value}</p>
                    <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/20 text-left">
                <p className="text-body-sm font-medium text-foreground">
                  <span className="font-bold text-red-500 uppercase tracking-wider">Priority Tasks:</span> You have 8 pending moderation items and 5 organizer requests waiting for review.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
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
              onClick={() => step < TOTAL_STEPS ? setStep(step + 1) : navigate('/login?afterAdminOnboarding=1')}
              disabled={!canContinue()}
              className="btn-primary bg-red-500 hover:bg-red-600 border-red-500 px-10 h-14 text-body font-bold shadow-xl shadow-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              {step === TOTAL_STEPS ? (
                <>
                  Enter Dashboard <Sparkles className="ml-2 w-5 h-5" />
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
