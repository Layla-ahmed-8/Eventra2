import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, Mail, Lock, Users, Briefcase, Shield, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { demoAccounts } from '../../data/users';
import Logo from '../../components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login, theme, toggleTheme } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);

    if (success) {
      searchParams.delete('afterOnboarding');
      searchParams.delete('afterOrganizerOnboarding');
      searchParams.delete('afterAdminOnboarding');
      setSearchParams(searchParams, { replace: true });
      const user = demoAccounts.find(u => u.email === email);
      // Redirect based on role
      if (user?.role === 'organizer') {
        navigate('/organizer/dashboard');
      } else if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/app/discover');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    const success = login(demoEmail, demoPassword);

    if (success) {
      searchParams.delete('afterOnboarding');
      searchParams.delete('afterOrganizerOnboarding');
      searchParams.delete('afterAdminOnboarding');
      setSearchParams(searchParams, { replace: true });
      const user = demoAccounts.find(u => u.email === demoEmail);
      if (user?.role === 'organizer') {
        navigate('/organizer/dashboard');
      } else if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/app/discover');
      }
    }
  };

  const onboardingHint =
    searchParams.get('afterOnboarding') === '1'
      ? 'Attendee setup is complete. Sign in with a demo attendee account (Sarah) to open the app.'
      : searchParams.get('afterOrganizerOnboarding') === '1'
      ? 'Organizer setup is complete. Sign in with ahmed@demo.com to manage events.'
      : searchParams.get('afterAdminOnboarding') === '1'
      ? 'Admin orientation is complete. Sign in with admin@demo.com to open the admin console.'
      : null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      {onboardingHint && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="surface-panel px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-primary/30 bg-primary/5">
            <p className="text-body-sm font-medium text-foreground">{onboardingHint}</p>
            <button
              type="button"
              onClick={() => {
                searchParams.delete('afterOnboarding');
                searchParams.delete('afterOrganizerOnboarding');
                searchParams.delete('afterAdminOnboarding');
                setSearchParams(searchParams, { replace: true });
              }}
              className="text-primary font-bold hover:text-primary-soft transition-colors whitespace-nowrap"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center border border-border/50 hover:bg-secondary/80 transition-all active:scale-95 z-50"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
      </button>

      <div className="w-full max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Logo variant="horizontal" className="h-12 w-auto" />
          </div>
          <h1 className="text-h1 font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-body text-muted-foreground">Select a demo profile or enter your credentials</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Sarah - Attendee */}
          <button
            onClick={() => handleDemoLogin('sarah@demo.com', 'demo123')}
            className="surface-panel p-6 text-left group hover:-translate-y-2 hover:border-primary/40 transition-all duration-300"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/150?img=25"
                  alt="Sarah"
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-primary/10 shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-background">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-h3 font-bold text-foreground">Sarah Johnson</h3>
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-caption font-black uppercase tracking-widest">
                Attendee
              </span>
              <p className="text-caption text-muted-foreground leading-relaxed pt-2">
                Discover events and join communities
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-border/50 space-y-2 text-micro font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> sarah@demo.com
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" /> Level 8 • 1,580 XP
              </div>
            </div>
          </button>

          {/* Ahmed - Organizer */}
          <button
            onClick={() => handleDemoLogin('ahmed@demo.com', 'demo123')}
            className="surface-panel p-6 text-left group hover:-translate-y-2 hover:border-cyan-500/40 transition-all duration-300"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="Ahmed"
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-cyan-500/10 shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-background">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-h3 font-bold text-foreground">Ahmed Hassan</h3>
              <span className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-caption font-black uppercase tracking-widest">
                Organizer
              </span>
              <p className="text-caption text-muted-foreground leading-relaxed pt-2">
                Create and manage platform events
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-border/50 space-y-2 text-micro font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> ahmed@demo.com
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" /> Level 15 • 3,240 XP
              </div>
            </div>
          </button>

          {/* Layla - Admin */}
          <button
            onClick={() => handleDemoLogin('admin@demo.com', 'demo123')}
            className="surface-panel p-6 text-left group hover:-translate-y-2 hover:border-orange-500/40 transition-all duration-300"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/150?img=47"
                  alt="Layla"
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-orange-500/10 shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-background">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-h3 font-bold text-foreground">Layla Mostafa</h3>
              <span className="inline-block px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-caption font-black uppercase tracking-widest">
                Admin
              </span>
              <p className="text-caption text-muted-foreground leading-relaxed pt-2">
                Full platform moderation and analytics
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-border/50 space-y-2 text-micro font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> admin@demo.com
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" /> Level 20 • 5,000 XP
              </div>
            </div>
          </button>
        </div>

        {/* Manual Login Form */}
        <div className="max-w-md mx-auto bento-section p-10">
          <h2 className="text-h3 font-bold text-foreground mb-8 text-center">Manual Entry</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-body-sm font-medium animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-base w-full pl-12"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-caption font-black uppercase tracking-widest text-muted-foreground ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-base w-full pl-12"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 text-body font-bold shadow-xl shadow-primary/20 mt-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-border/50 text-center space-y-4">
            <p className="text-body-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary font-bold hover:text-primary-soft transition-colors">Create one</Link>
            </p>
            <Link to="/" className="block text-caption font-bold text-muted-foreground hover:text-foreground transition-colors">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
