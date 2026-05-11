import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Check, ChevronRight, Users, BarChart3,
  Settings, AlertCircle, CheckCircle2, Lock,
  Database, Cpu, Activity, Eye, Flag, ArrowRight
} from 'lucide-react';

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-72 h-72 rounded-full bg-red-500/6 blur-3xl animate-orb" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-[#FF9B3D]/5 blur-3xl animate-orb" style={{ animationDelay: '6s' }} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/30">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-h1 font-bold text-foreground mb-1">Admin Control Center</h1>
          <p className="text-body text-muted-foreground">Configure your administrator access and platform preferences</p>
        </div>

        {/* Step indicator */}
        <div className="w-full max-w-xl mb-6">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
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
                    done ? 'bg-red-500 text-white' :
                    active ? 'bg-red-500/20 border-2 border-red-500 text-red-500' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {done ? <Check className="w-4 h-4" /> : <s.icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`text-caption hidden sm:block ${active ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card */}
        <div className="w-full max-w-xl surface-panel p-6 sm:p-8">

          {/* Step 1 — Welcome */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-2">Welcome, Administrator</h2>
                <p className="text-body text-muted-foreground">
                  You have been granted super administrator access to the Eventra platform. This setup will configure your control center.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Users, title: 'User Control', desc: 'Manage all 12K+ platform users', color: 'from-[#7C5CFF] to-[#9B8CFF]' },
                  { icon: Flag, title: 'Content Safety', desc: 'AI-assisted moderation tools', color: 'from-red-500 to-red-600' },
                  { icon: BarChart3, title: 'Platform Analytics', desc: 'Real-time metrics and insights', color: 'from-[#00D4FF] to-[#4ADEFF]' },
                  { icon: Activity, title: 'System Health', desc: 'Monitor all platform services', color: 'from-green-500 to-teal-500' },
                ].map((f) => (
                  <div key={f.title} className="p-4 rounded-2xl bg-muted/40 border border-border">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-3`}>
                      <f.icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-body-sm font-bold text-foreground">{f.title}</p>
                    <p className="text-caption text-muted-foreground mt-0.5">{f.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-red-500/8 border border-red-500/15">
                <p className="text-body-sm text-foreground flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <span className="font-semibold">Important:</span> Admin actions are logged and audited. Use your access responsibly.
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Step 2 — Permissions */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-1">Review your permissions</h2>
                <p className="text-body text-muted-foreground">Understand what you can do as a super administrator.</p>
              </div>
              <div className="space-y-2">
                {permissions.map((p, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/30 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
                      <p.icon className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold text-foreground">{p.label}</p>
                      <p className="text-caption text-muted-foreground">{p.desc}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 ml-auto mt-0.5" />
                  </div>
                ))}
              </div>
              {/* Acknowledge */}
              <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-border cursor-pointer hover:border-red-500/40 transition">
                <input
                  type="checkbox"
                  checked={acknowledgedPermissions}
                  onChange={(e) => setAcknowledgedPermissions(e.target.checked)}
                  className="mt-0.5 accent-red-500"
                />
                <p className="text-body-sm text-foreground">
                  I understand my administrator responsibilities and agree to use this access in accordance with platform policies.
                </p>
              </label>
            </div>
          )}

          {/* Step 3 — Platform Config */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-h2 font-bold text-foreground mb-1">Notification preferences</h2>
                <p className="text-body text-muted-foreground">Choose which platform events you want to be alerted about.</p>
              </div>
              <div className="space-y-2">
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
                    <div key={key} className="flex items-center justify-between p-3.5 rounded-xl bg-muted/30 border border-border">
                      <div>
                        <p className="text-body-sm font-semibold text-foreground">{info.label}</p>
                        <p className="text-caption text-muted-foreground">{info.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                        <input
                          type="checkbox"
                          checked={val}
                          onChange={() => toggleNotif(key)}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-muted rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-4 after:transition-all peer-checked:bg-red-500" />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4 — Ready */}
          {step === 4 && (
            <div className="text-center py-4 animate-fade-up">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-red-500/30 animate-bounce-in">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-h1 font-bold text-foreground mb-2">Control Center Ready</h2>
              <p className="text-body text-muted-foreground mb-6 max-w-sm mx-auto">
                Your administrator access is fully configured. You have complete control over the Eventra platform.
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-6">
                {[
                  { label: 'Permissions', value: '6 / 6' },
                  { label: 'Notifications', value: `${Object.values(notifPrefs).filter(Boolean).length} active` },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-xl bg-muted/40 border border-border">
                    <p className="text-h3 font-bold text-foreground">{s.value}</p>
                    <p className="text-caption text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-xl bg-red-500/8 border border-red-500/15 text-left">
                <p className="text-body-sm text-foreground">
                  <span className="font-semibold">First steps:</span> Review the 8 pending moderation items and 5 organizer requests waiting for your approval.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <div>
              {step > 1 && (
                <button onClick={() => setStep(s => s - 1)} className="btn-secondary text-body-sm">
                  Back
                </button>
              )}
            </div>
            {step < TOTAL_STEPS ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canContinue()}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="btn-primary"
                style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' }}
              >
                <CheckCircle2 className="w-4 h-4" />
                Enter Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
