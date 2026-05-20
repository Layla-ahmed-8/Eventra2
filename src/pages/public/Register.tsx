import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Briefcase, Mail, Lock, User, MapPin, ArrowLeft, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';
import Logo from '../../components/Logo';

type Role = 'attendee' | 'organizer';
type Step = 'select' | 'form';

const ATTENDEE_INTERESTS = ['Music', 'Art', 'Technology', 'Food & Drink', 'Sports', 'Business', 'Science', 'Gaming'];
const ORGANIZER_EVENT_TYPES = ['Conferences', 'Workshops', 'Concerts', 'Meetups', 'Festivals', 'Exhibitions'];

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
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', location: '', organization: '', experience: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);

  const selectRole = (newRole: Role) => {
    setRole(newRole);
    setForm({ name: '', email: '', password: '', confirm: '', location: '', organization: '', experience: '' });
    setErrors({});
    setSelectedInterests([]);
    setSelectedEventTypes([]);
    setStep('form');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors(prev => ({ ...prev, [name]: validateField(name, value, { ...form, [name]: value }) }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const toggleInterest = (interest: string) =>
    setSelectedInterests(prev => prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]);

  const toggleEventType = (type: string) =>
    setSelectedEventTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    for (const f of ['name', 'email', 'password', 'confirm'] as const) {
      newErrors[f] = validateField(f, form[f], form);
    }
    if (role === 'attendee' && selectedInterests.length < 3) {
      newErrors.interests = 'Please select at least 3 interests';
    }
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const result = await register({ name: form.name, email: form.email, phone: '', password: form.password, role });
      if (result.success) {
        if (role === 'attendee') toast.success('Account created! You earned +50 XP — sign in to get started.');
        navigate(role === 'organizer' ? '/register/pending' : '/login');
      } else {
        setErrors(prev => ({ ...prev, email: result.message }));
      }
    } finally {
      setLoading(false);
    }
  };

  const pageStyle: React.CSSProperties = {
    background: 'linear-gradient(145deg, #f0edff 0%, #f8f4ff 40%, #edf6ff 100%)',
    minHeight: '100vh',
  };

  // ── STEP 1: Role selection ────────────────────────────────────────────────
  if (step === 'select') {
    return (
      <div style={pageStyle} className="flex flex-col items-center justify-center px-4 py-8 min-h-screen">
        <div className="w-full max-w-2xl">
          <div className="flex flex-col items-center mb-7">
            <Logo variant="small" className="w-12 h-12" />
            <h1 className="text-2xl font-bold mt-4 mb-1 text-gray-900">Join Eventra</h1>
            <p className="text-gray-500 text-sm">Choose how you want to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Attendee card */}
            <div
              onClick={() => selectRole('attendee')}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-bold mb-1.5 text-gray-900">Join as Attendee</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Discover amazing events, connect with communities, and earn rewards as you explore new experiences.
              </p>
              <ul className="space-y-1.5 mb-4">
                {['AI-powered event recommendations', 'Join vibrant communities', 'Earn badges and level up'].map(feat => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              <span className="text-purple-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Get Started <span>→</span>
              </span>
            </div>

            {/* Organizer card */}
            <div
              onClick={() => selectRole('organizer')}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-lg font-bold mb-1.5 text-gray-900">Join as Organizer</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Create and manage events, reach thousands of attendees, and grow your community with powerful tools.
              </p>
              <ul className="space-y-1.5 mb-4">
                {['Create unlimited events', 'AI-powered insights & analytics', 'Advanced attendee management'].map(feat => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              <span className="text-cyan-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                Get Started <span>→</span>
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 font-semibold hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-sm text-gray-400 mt-2">
            <Link to="/" className="hover:text-gray-600 transition-colors">← Back to homepage</Link>
          </p>
        </div>
      </div>
    );
  }

  // ── STEP 2: Registration form ─────────────────────────────────────────────
  const isAttendee = role === 'attendee';
  const focusRing = isAttendee
    ? 'focus:ring-2 focus:ring-purple-200 focus:border-purple-400'
    : 'focus:ring-2 focus:ring-cyan-200 focus:border-cyan-400';
  const inputBase = `w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none transition-all ${focusRing}`;

  return (
    <div style={pageStyle} className="flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-xl">
        {/* Back */}
        <button
          type="button"
          onClick={() => setStep('select')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Change account type
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isAttendee ? 'bg-purple-600' : 'bg-cyan-500'}`}>
            {isAttendee ? <Users className="w-8 h-8 text-white" /> : <Briefcase className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isAttendee ? 'Create Attendee Account' : 'Create Organizer Account'}
          </h1>
          <p className="text-gray-500 text-sm text-center">
            {isAttendee
              ? 'Tell us about your interests to get personalized recommendations'
              : 'Share your organization details to start creating events'}
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  name="name" type="text" placeholder="John Doe" value={form.name}
                  onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                  className={`${inputBase}${errors.name ? ' border-red-400 focus:ring-red-200' : ''}`}
                />
              </div>
              {errors.name && <p className="field-error-msg">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  name="email" type="email" placeholder="you@example.com" value={form.email}
                  onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                  className={`${inputBase}${errors.email ? ' border-red-400 focus:ring-red-200' : ''}`}
                />
              </div>
              {errors.email && <p className="field-error-msg">{errors.email}</p>}
            </div>

            {/* Password + Confirm */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    name="password" type="password" placeholder="Min 8 characters" value={form.password}
                    onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                    className={`${inputBase}${errors.password ? ' border-red-400 focus:ring-red-200' : ''}`}
                  />
                </div>
                {errors.password && <p className="field-error-msg">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    name="confirm" type="password" placeholder="Re-enter password" value={form.confirm}
                    onChange={handleChange} onBlur={handleBlur} onFocus={handleFocus}
                    className={`${inputBase}${errors.confirm ? ' border-red-400 focus:ring-red-200' : ''}`}
                  />
                </div>
                {errors.confirm && <p className="field-error-msg">{errors.confirm}</p>}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  name="location" type="text" placeholder="Cairo, Egypt" value={form.location}
                  onChange={handleChange}
                  className={inputBase}
                />
              </div>
            </div>

            {/* Organizer-only fields */}
            {!isAttendee && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Organization Name{' '}
                    <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      name="organization" type="text" placeholder="Company or Organization" value={form.organization}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none transition-all ${focusRing}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Event Organization Experience</label>
                  <textarea
                    name="experience"
                    placeholder="Tell us about your event planning experience..."
                    value={form.experience}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none transition-all resize-none ${focusRing}`}
                  />
                </div>
              </>
            )}

            {/* Chips */}
            {isAttendee ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What are your interests?{' '}
                  <span className="text-gray-400 font-normal">(Select at least 3)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {ATTENDEE_INTERESTS.map(interest => (
                    <button
                      key={interest} type="button" onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-sm border transition-all ${
                        selectedInterests.includes(interest)
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {errors.interests && <p className="field-error-msg mt-2">{errors.interests}</p>}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">What type of events will you create?</label>
                <div className="flex flex-wrap gap-2">
                  {ORGANIZER_EVENT_TYPES.map(type => (
                    <button
                      key={type} type="button" onClick={() => toggleEventType(type)}
                      className={`px-4 py-2 rounded-full text-sm border transition-all ${
                        selectedEventTypes.includes(type)
                          ? 'bg-cyan-500 text-white border-cyan-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-cyan-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60 ${
                isAttendee
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600'
                  : 'bg-cyan-500 hover:bg-cyan-600'
              }`}
            >
              {loading ? <span className="btn-spinner" /> : <UserPlus className="w-5 h-5" />}
              {loading ? 'Creating account…' : isAttendee ? 'Create Attendee Account' : 'Create Organizer Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
