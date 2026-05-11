import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Briefcase, MapPin, ArrowRight, ArrowLeft, Sparkles, Check, Shield } from 'lucide-react';
import Logo from '../../components/Logo';

type AccountType = 'attendee' | 'organizer' | null;

const interestOptions = ['Music', 'Art', 'Technology', 'Food & Drink', 'Sports', 'Business', 'Science', 'Gaming', 'Film', 'Fashion'];
const eventTypeOptions = ['Conferences', 'Workshops', 'Concerts', 'Meetups', 'Festivals', 'Exhibitions', 'Networking', 'Sports'];

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'select' | 'form'>('select');
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    interests: [] as string[],
    organization: '',
    experience: '',
    eventTypes: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Route to the correct onboarding based on role
    if (accountType === 'organizer') {
      navigate('/organizer/onboarding');
    } else {
      navigate('/onboarding');
    }
  };

  const toggleInterest = (interest: string) =>
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));

  const toggleEventType = (type: string) =>
    setFormData(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(type)
        ? prev.eventTypes.filter(t => t !== type)
        : [...prev.eventTypes, type],
    }));

  // ── Account type selection ──────────────────────────────────────────────────
  if (step === 'select') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {/* Ambient orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#00D4FF]/6 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-3xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo variant="horizontal" className="h-9 w-auto" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-h1 font-bold text-foreground mb-2">Create your account</h2>
            <p className="text-body text-muted-foreground">Choose how you want to use Eventra</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            {/* Attendee */}
            <button
              onClick={() => { setAccountType('attendee'); setStep('form'); }}
              className="surface-panel p-6 sm:p-8 text-left group hover:-translate-y-1 hover:border-primary/40 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#7C5CFF] to-[#9B8CFF] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                <User className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-h3 font-bold text-foreground mb-2">Join as Attendee</h3>
              <p className="text-body-sm text-muted-foreground mb-5 leading-relaxed">
                Discover events, join communities, earn rewards, and connect with people who share your interests.
              </p>
              <ul className="space-y-2 mb-5">
                {['AI-powered event recommendations', 'Join vibrant communities', 'Earn XP badges & rewards'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-body-sm text-muted-foreground">
                    <div className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-primary" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-body-sm font-bold text-primary group-hover:gap-3 transition-all">
                Get Started <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Organizer */}
            <button
              onClick={() => { setAccountType('organizer'); setStep('form'); }}
              className="surface-panel p-6 sm:p-8 text-left group hover:-translate-y-1 hover:border-[#00D4FF]/40 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#00D4FF] to-[#4ADEFF] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/20">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-h3 font-bold text-foreground mb-2">Join as Organizer</h3>
              <p className="text-body-sm text-muted-foreground mb-5 leading-relaxed">
                Create events, manage attendees, grow your audience, and get AI-powered insights to maximize impact.
              </p>
              <ul className="space-y-2 mb-5">
                {['Create & manage unlimited events', 'AI analytics & growth insights', 'Community & messaging tools'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-body-sm text-muted-foreground">
                    <div className="w-4 h-4 rounded-full bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-body-sm font-bold text-cyan-600 dark:text-cyan-400 group-hover:gap-3 transition-all">
                Get Started <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* Admin note */}
          <div className="surface-panel p-4 flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <p className="text-caption text-muted-foreground">
              Admin accounts are created internally. Contact <span className="text-primary font-semibold">support@eventra.com</span> to request admin access.
            </p>
          </div>

          <p className="text-center text-body-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
          <div className="mt-3 text-center">
            <Link to="/" className="text-caption text-muted-foreground hover:text-foreground transition-colors">← Back to homepage</Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration form ───────────────────────────────────────────────────────
  const isOrganizer = accountType === 'organizer';
  const accentClass = isOrganizer ? 'from-[#00D4FF] to-[#4ADEFF]' : 'from-[#7C5CFF] to-[#9B8CFF]';
  const accentText = isOrganizer ? 'text-cyan-600 dark:text-cyan-400' : 'text-primary';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#00D4FF]/6 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <button
          onClick={() => setStep('select')}
          className="mb-5 flex items-center gap-2 text-body-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Change account type
        </button>

        <div className="flex justify-center mb-6">
          <Logo variant="horizontal" className="h-8 w-auto" />
        </div>

        <div className="text-center mb-6">
          <div className={`w-12 h-12 bg-gradient-to-br ${accentClass} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
            {isOrganizer ? <Briefcase className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
          </div>
          <h1 className="text-h2 font-bold text-foreground mb-1">
            {isOrganizer ? 'Create Organizer Account' : 'Create Attendee Account'}
          </h1>
          <p className="text-body-sm text-muted-foreground">
            {isOrganizer ? 'Share your details to start creating events' : 'Tell us about yourself to get personalized recommendations'}
          </p>
        </div>

        <div className="surface-panel p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-body-sm font-semibold text-foreground mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 input-base"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-body-sm font-semibold text-foreground mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 input-base"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 input-base"
                    placeholder="Min 8 characters"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 input-base"
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-body-sm font-semibold text-foreground mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-4 input-base"
                  placeholder="Cairo, Egypt"
                  required
                />
              </div>
            </div>

            {/* Attendee interests */}
            {!isOrganizer && (
              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-3">
                  Your interests <span className="text-muted-foreground font-normal">(select at least 3)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`filter-chip ${formData.interests.includes(interest) ? 'active' : 'inactive'}`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {formData.interests.length > 0 && formData.interests.length < 3 && (
                  <p className="text-caption text-amber-500 mt-2">{3 - formData.interests.length} more to continue</p>
                )}
              </div>
            )}

            {/* Organizer fields */}
            {isOrganizer && (
              <>
                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-2">Organization Name <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={e => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full pl-10 pr-4 input-base"
                      placeholder="Company or organization"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-2">Event organizing experience</label>
                  <textarea
                    value={formData.experience}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 input-base min-h-[100px] resize-none"
                    style={{ height: 'auto' }}
                    placeholder="Tell us about your event planning background..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-3">Types of events you'll create</label>
                  <div className="flex flex-wrap gap-2">
                    {eventTypeOptions.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleEventType(type)}
                        className={`filter-chip ${formData.eventTypes.includes(type) ? 'active' : 'inactive'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={!isOrganizer && formData.interests.length < 3}
              className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-4 h-4" />
              Create {isOrganizer ? 'Organizer' : 'Attendee'} Account
            </button>
          </form>

          <p className="mt-5 text-center text-body-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
