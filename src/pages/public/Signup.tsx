import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Briefcase, MapPin, Tag, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

type AccountType = 'attendee' | 'organizer' | null;

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

  const interestOptions = ['Music', 'Art', 'Technology', 'Food & Drink', 'Sports', 'Business', 'Science', 'Gaming'];
  const eventTypeOptions = ['Conferences', 'Workshops', 'Concerts', 'Meetups', 'Festivals', 'Exhibitions'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding');
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleEventType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(type)
        ? prev.eventTypes.filter(t => t !== type)
        : [...prev.eventTypes, type]
    }));
  };

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type);
    setStep('form');
  };

  if (step === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6C4CF1] to-[#00C2FF] rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#6C4CF1] to-[#00C2FF] bg-clip-text text-transparent">
                Eventra
              </h1>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">Join Eventra</h2>
            <p className="text-lg text-muted-foreground">Choose how you want to get started</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Attendee Card */}
            <button
              onClick={() => handleAccountTypeSelect('attendee')}
              className="bg-card rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-500 text-left group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-3">Join as Attendee</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Discover amazing events, connect with communities, and earn rewards as you explore new experiences.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>AI-powered event recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Join vibrant communities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  <span>Earn badges and level up</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>

            {/* Organizer Card */}
            <button
              onClick={() => handleAccountTypeSelect('organizer')}
              className="bg-card rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-cyan-500 text-left group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-3">Join as Organizer</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Create and manage events, reach thousands of attendees, and grow your community with powerful tools.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Create unlimited events</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>AI-powered insights & analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                  <span>Advanced attendee management</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-cyan-600 font-semibold group-hover:gap-3 transition-all">
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-[#6C4CF1] hover:text-[#5739D4] font-semibold">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-muted-foreground hover:text-foreground text-sm">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <button
          onClick={() => setStep('select')}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Change account type</span>
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${accountType === 'attendee' ? 'from-purple-500 to-purple-600' : 'from-cyan-500 to-cyan-600'} rounded-xl flex items-center justify-center`}>
              {accountType === 'attendee' ? <User className="w-7 h-7 text-white" /> : <Briefcase className="w-7 h-7 text-white" />}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {accountType === 'attendee' ? 'Create Attendee Account' : 'Create Organizer Account'}
          </h1>
          <p className="text-muted-foreground">
            {accountType === 'attendee'
              ? 'Tell us about your interests to get personalized recommendations'
              : 'Share your organization details to start creating events'}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common Fields */}
            <div>
              <label className="block text-sm font-semibold text-card-foreground mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-[#6C4CF1] focus:border-transparent bg-input-background text-foreground"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-card-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-[#6C4CF1] focus:border-transparent bg-input-background text-foreground"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-[#6C4CF1] focus:border-transparent bg-input-background text-foreground"
                    placeholder="Min 8 characters"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-[#6C4CF1] focus:border-transparent bg-input-background text-foreground"
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#6C4CF1] focus:border-transparent"
                  placeholder="Cairo, Egypt"
                  required
                />
              </div>
            </div>

            {/* Attendee-specific Fields */}
            {accountType === 'attendee' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  What are your interests? (Select at least 3)
                </label>
                <div className="flex flex-wrap gap-2">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                        formData.interests.includes(interest)
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                          : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Organizer-specific Fields */}
            {accountType === 'organizer' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Organization Name (Optional)
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-[#6C4CF1] focus:border-transparent bg-input-background text-foreground"
                      placeholder="Company or Organization"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-2">
                    Event Organization Experience
                  </label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-[#6C4CF1] focus:border-transparent h-24 resize-none bg-input-background text-foreground"
                    placeholder="Tell us about your event planning experience..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-card-foreground mb-3">
                    What type of events will you create?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {eventTypeOptions.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleEventType(type)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                          formData.eventTypes.includes(type)
                            ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
                            : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                        }`}
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
              className={`w-full bg-gradient-to-r ${
                accountType === 'attendee'
                  ? 'from-purple-500 to-purple-600'
                  : 'from-cyan-500 to-cyan-600'
              } text-white font-semibold py-4 rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2`}
            >
              <UserPlus className="w-5 h-5" />
              Create {accountType === 'attendee' ? 'Attendee' : 'Organizer'} Account
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-[#6C4CF1] hover:text-[#5739D4] font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
