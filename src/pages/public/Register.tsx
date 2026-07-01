import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Briefcase, Mail, Lock, User, ArrowLeft, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import Logo from '../../components/Logo';

type Role = 'attendee' | 'organizer';
type Step = 'select' | 'form';

function validateField(name: string, value: string, form: Record<string, string>): string {
  switch (name) {
    case 'name':     return value.trim() ? '' : 'Full name is required';
    case 'email':    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address';
    case 'password': return value.length >= 8 ? '' : 'Password must be at least 8 characters';
    case 'confirm':  return value === form.password ? '' : 'Passwords do not match';
    default:         return '';
  }
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAppStore();

  const [step, setStep] = useState<Step>('select');
  const [role, setRole] = useState<Role>('attendee');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', organization: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const selectRole = (newRole: Role) => {
    setRole(newRole);
    setForm({ name: '', email: '', password: '', confirm: '', organization: '' });
    setErrors({});
    setStep('form');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value, { ...form, [name]: value }) }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    for (const f of ['name', 'email', 'password', 'confirm'] as const) {
      newErrors[f] = validateField(f, form[f], form);
    }
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const result = await register({ name: form.name, email: form.email, phone: '', password: form.password, role });
      if (result.success) {
        if (role === 'attendee') toast.success('Account created! Sign in to get started.');
        navigate(role === 'organizer' ? '/register/pending' : '/login');
      } else {
        setErrors(prev => ({ ...prev, email: result.message }));
      }
    } finally {
      setLoading(false);
    }
  };

  const isAttendee = role === 'attendee';
  const focusRing = isAttendee
    ? 'focus:ring-2 focus:ring-purple-200 focus:border-purple-400'
    : 'focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400';
  const inputBase = `w-full pl-10 pr-4 py-3 rounded-3xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none transition-all ${focusRing}`;

  // ── STEP 1: Role selection ────────────────────────────────────────────────
  if (step === 'select') {
    return (
      <div className="min-h-screen bg-[#F7F6FF] dark:bg-[#050816] flex items-center justify-center px-6 py-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-10 w-72 h-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-7xl grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="hidden lg:flex flex-col justify-between rounded-[2rem] bg-white/90 dark:bg-slate-950/90 border border-slate-200/70 dark:border-slate-800/70 p-10 shadow-2xl shadow-slate-900/5 backdrop-blur-xl">
            <div>
              <div className="inline-flex items-center gap-3 rounded-3xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-3 text-white font-semibold mb-8 shadow-lg shadow-purple-500/20">
                <Logo variant="small" className="w-9 h-9" />
                <span>Eventra Registration</span>
              </div>
              <h2 className="text-4xl font-extrabold text-slate-950 dark:text-white leading-tight mb-6">Start your Eventra journey with a secure, modern signup.</h2>
              <p className="max-w-xl text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                Choose the account type that fits your role. Admins always sign in on a separate secure page.
              </p>
            </div>
            <div className="mt-10 grid gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span>Attendee and organizer registration are separate from admin access.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                <span>Clean, structured onboarding for every user role.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-500" />
                <span>Sign up now and complete your profile after registration.</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 p-10 shadow-2xl shadow-slate-900/10">
            <div className="mb-8 flex flex-col gap-4 text-center">
              <Logo variant="small" className="mx-auto h-12 w-12" />
              <div>
                <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Create your Eventra account</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Choose the flow that fits your role and we’ll guide you into the right experience.</p>
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <button
                type="button"
                onClick={() => selectRole('attendee')}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 py-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-purple-600 text-white mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-950 mb-2">Attendee</h2>
                <p className="text-sm text-slate-500">Browse events, join communities, and earn rewards.</p>
              </button>

              <button
                type="button"
                onClick={() => selectRole('organizer')}
                className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 py-6 text-left transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-cyan-500 text-white mb-4">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-950 mb-2">Organizer</h2>
                <p className="text-sm text-slate-500">Create events, manage registrations, and grow your audience.</p>
              </button>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-4 text-left text-sm text-slate-600 dark:border-slate-800/70 dark:bg-slate-900/70 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">What to expect next</p>
              <p className="mt-1">Attendees get a personalized discovery feed, while organizers continue into onboarding and approval readiness.</p>
            </div>

            <div className="mt-4 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
            </div>
            <div className="text-center text-sm text-slate-500 mt-2">
              Admin access?{' '}
              <Link to="/admin-login" className="font-semibold text-cyan-600 hover:underline">Sign in here</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6FF] dark:bg-[#050816] flex items-center justify-center px-6 py-10 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 left-10 w-72 h-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="hidden lg:flex flex-col justify-between rounded-[2rem] bg-white/90 dark:bg-slate-950/90 border border-slate-200/70 dark:border-slate-800/70 p-10 shadow-2xl shadow-slate-900/5 backdrop-blur-xl">
          <div>
            <div className="inline-flex items-center gap-3 rounded-3xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-3 text-white font-semibold mb-8 shadow-lg shadow-purple-500/20">
              <Logo variant="small" className="w-9 h-9" />
              <span>Eventra Registration</span>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-950 dark:text-white leading-tight mb-6">Finish your signup with one secure form.</h2>
            <p className="max-w-xl text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              Complete your account details and get ready to explore events or manage your community.
            </p>
          </div>
          <div className="mt-10 grid gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
              <span>Fast registration for attendees and organizers.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-500" />
              <span>Separate admin login keeps elevated access secure.</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-500" />
              <span>Everything is built around the same modern auth experience.</span>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 p-10 shadow-2xl shadow-slate-900/10">
          <button
            type="button"
            onClick={() => setStep('select')}
            className="mb-8 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Change account type
          </button>

          <div className="flex flex-col gap-4 mb-8 text-center">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${isAttendee ? 'bg-purple-600' : 'bg-cyan-500'} text-white`}>
              {isAttendee ? <Users className="w-8 h-8" /> : <Briefcase className="w-8 h-8" />}
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">{isAttendee ? 'Create Attendee Account' : 'Create Organizer Account'}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {isAttendee
                  ? 'Quick setup — you’ll personalize your feed during onboarding.'
                  : 'Register your account — we’ll set up your event profile after approval.'}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200/70 dark:border-slate-800/70">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Full Name</label>
                <div className="relative mt-3">
                  <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className={`${inputBase}${errors.name ? ' border-red-400 focus:ring-red-200' : ''}`}
                  />
                </div>
                {errors.name && <p className="field-error-msg">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Email Address</label>
                <div className="relative mt-3">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    className={`${inputBase}${errors.email ? ' border-red-400 focus:ring-red-200' : ''}`}
                  />
                </div>
                {errors.email && <p className="field-error-msg">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Password</label>
                  <div className="relative mt-3">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      name="password"
                      type="password"
                      placeholder="Min 8 characters"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                      className={`${inputBase}${errors.password ? ' border-red-400 focus:ring-red-200' : ''}`}
                    />
                  </div>
                  {errors.password && <p className="field-error-msg">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Confirm Password</label>
                  <div className="relative mt-3">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      name="confirm"
                      type="password"
                      placeholder="Re-enter password"
                      value={form.confirm}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                      className={`${inputBase}${errors.confirm ? ' border-red-400 focus:ring-red-200' : ''}`}
                    />
                  </div>
                  {errors.confirm && <p className="field-error-msg">{errors.confirm}</p>}
                </div>
              </div>

              {!isAttendee && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">Organization Name <span className="text-slate-500 dark:text-slate-400 font-normal">(Optional)</span></label>
                  <div className="relative mt-3">
                    <Briefcase className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      name="organization"
                      type="text"
                      placeholder="Company or Organization"
                      value={form.organization}
                      onChange={handleChange}
                      className={inputBase}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-3xl font-semibold text-white transition-all disabled:opacity-60 ${
                  isAttendee
                    ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
                    : 'bg-cyan-500 hover:bg-cyan-600'
                }`}
              >
                {loading ? <span className="btn-spinner" /> : <UserPlus className="w-5 h-5" />}
                {loading ? 'Creating account…' : isAttendee ? 'Create Attendee Account' : 'Create Organizer Account'}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
            </div>
            <div className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
              Admin access?{' '}
              <Link to="/admin-login" className="font-semibold text-cyan-600 hover:text-white transition-colors">Sign in here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
