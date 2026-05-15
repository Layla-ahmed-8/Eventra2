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
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-4xl">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <Logo variant="horizontal" className="h-10 w-auto" />
          </div>

          <div className="text-center mb-12">
            <h2 className="text-display font-bold text-foreground mb-3">Create Your Account</h2>
            <p className="text-body-lg text-muted-foreground">Join the next generation of event discovery</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 mb-10">
            {/* Attendee */}
            <button
              onClick={() => { setAccountType('attendee'); setStep('form'); }}
              className="surface-panel p-10 text-left group hover:-translate-y-2 hover:border-primary/40 transition-all duration-500"
            >
              <div className="w-16 h-16 bg-primary rounded-[1.25rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-primary/20">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-h2 font-bold text-foreground mb-4">Join as Attendee</h3>
              <p className="text-body text-muted-foreground mb-8 leading-relaxed">
                Discover events, join communities, earn rewards, and connect with people who share your interests.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'AI-powered recommendations',
                  'Join vibrant communities',
                  'Earn XP, badges & rewards'
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-body-sm font-medium text-foreground">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-body font-bold text-primary group-hover:gap-4 transition-all">
                Get Started <ArrowRight className="w-5 h-5" />
              </div>
            </button>

            {/* Organizer */}
            <button
              onClick={() => { setAccountType('organizer'); setStep('form'); }}
              className="surface-panel p-10 text-left group hover:-translate-y-2 hover:border-cyan-500/40 transition-all duration-500"
            >
              <div className="w-16 h-16 bg-cyan-500 rounded-[1.25rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl shadow-cyan-500/20">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-h2 font-bold text-foreground mb-4">Join as Organizer</h3>
              <p className="text-body text-muted-foreground mb-8 leading-relaxed">
                Create events, manage attendees, grow your audience, and get AI-powered insights to maximize impact.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Create & manage unlimited events',
                  'AI analytics & growth insights',
                  'Community & messaging tools'
                ].map(f => (
                  <li key={f} className="flex items-center gap-3 text-body-sm font-medium text-foreground">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-body font-bold text-cyan-600 dark:text-cyan-400 group-hover:gap-4 transition-all">
                Get Started <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>

          <div className="bento-section py-4 px-6 flex items-center gap-4 mb-10">
            <div className="icon-box bg-secondary text-muted-foreground">
              <Shield className="w-5 h-5" />
            </div>
            <p className="text-caption font-medium text-muted-foreground">
              Admin accounts are restricted. Contact <span className="text-foreground font-bold">support@eventra.com</span> for access.
            </p>
          </div>

          <div className="text-center space-y-4">
            <p className="text-body-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:text-primary-soft transition-colors">Sign in</Link>
            </p>
            <Link to="/" className="inline-block text-caption font-bold text-muted-foreground hover:text-foreground transition-colors">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Registration form ───────────────────────────────────────────────────────
  const isOrganizer = accountType === 'organizer';
  const accentColor = isOrganizer ? 'text-cyan-500' : 'text-primary';
  const iconBg = isOrganizer ? 'bg-cyan-500' : 'bg-primary';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <button
          onClick={() => setStep('select')}
          className="mb-8 flex items-center gap-2 text-caption font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Change Account Type
        </button>

        <div className="text-center mb-10">
          <div className={`w-16 h-16 ${iconBg} rounded-[1.25rem] flex items-center justify-center mx-auto mb-6 shadow-xl`}>
            {isOrganizer ? <Briefcase className="w-8 h-8 text-white" /> : <User className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-h1 font-bold text-foreground mb-2">
            {isOrganizer ? 'Organizer Registration' : 'Attendee Registration'}
          </h1>
          <p className="text-body text-muted-foreground">
            {isOrganizer ? 'Launch your next big event' : 'Join a world of curated experiences'}
          </p>
        </div>

        <div className="bento-section p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="input-base w-full pl-11"
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="input-base w-full pl-11"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="input-base w-full pl-11"
                    placeholder="Min 8 characters"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input-base w-full pl-11"
                    placeholder="Repeat password"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="input-base w-full pl-11"
                  placeholder="Cairo, Egypt"
                  required
                />
              </div>
            </div>

            {/* Attendee interests */}
            {!isOrganizer && (
              <div className="space-y-4">
                <label className="block text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Your Interests <span className="text-muted-foreground font-medium normal-case">(select at least 3)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-xl text-caption font-bold transition-all border ${
                        formData.interests.includes(interest)
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                          : 'bg-secondary/40 border-border/50 text-muted-foreground hover:bg-secondary/60'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {formData.interests.length > 0 && formData.interests.length < 3 && (
                  <p className="text-micro font-bold text-orange-500 animate-pulse">{3 - formData.interests.length} more to continue</p>
                )}
              </div>
            )}

            {/* Organizer fields */}
            {isOrganizer && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">Organization Name <span className="text-muted-foreground font-medium normal-case">(optional)</span></label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={e => setFormData({ ...formData, organization: e.target.value })}
                      className="input-base w-full pl-11"
                      placeholder="Company or organization"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">Experience</label>
                  <textarea
                    value={formData.experience}
                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    className="input-base w-full min-h-[120px] py-4 resize-none leading-relaxed"
                    placeholder="Tell us about your event planning background..."
                    required
                  />
                </div>

                <div className="space-y-4">
                  <label className="block text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">Event Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {eventTypeOptions.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleEventType(type)}
                        className={`px-4 py-2 rounded-xl text-caption font-bold transition-all border ${
                          formData.eventTypes.includes(type)
                            ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                            : 'bg-secondary/40 border-border/50 text-muted-foreground hover:bg-secondary/60'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!isOrganizer && formData.interests.length < 3}
              className="btn-primary w-full py-4 text-body font-bold shadow-xl shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed mt-4"
            >
              <UserPlus className="w-5 h-5" />
              Create {isOrganizer ? 'Organizer' : 'Attendee'} Account
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border/50 text-center space-y-4">
            <p className="text-body-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:text-primary-soft transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
