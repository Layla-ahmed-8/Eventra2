import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Users, Briefcase, Shield, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { demoAccounts } from '../../data/users';
import Logo from '../../components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const { login, theme, toggleTheme } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);

    if (success) {
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-3 rounded-xl bg-card border border-border hover:bg-secondary transition"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
      </button>

      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Logo variant="horizontal" className="h-10 w-auto" />
          </div>
          <p className="text-lg text-muted-foreground">Choose a demo account to explore different user experiences</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Sarah - Attendee */}
          <button
            onClick={() => handleDemoLogin('sarah@demo.com', 'demo123')}
            className="bg-card rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-500 text-left"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/150?img=25"
                  alt="Sarah"
                  className="w-24 h-24 rounded-full ring-4 ring-purple-100"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Sarah Johnson</h3>
            <div className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold mb-3">
              Attendee
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Discover events, join communities, earn badges
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>📧 sarah@demo.com</div>
              <div>🔑 demo123</div>
              <div>⭐ Level 8 • 1,580 XP</div>
            </div>
          </button>

          {/* Ahmed - Organizer */}
          <button
            onClick={() => handleDemoLogin('ahmed@demo.com', 'demo123')}
            className="bg-card rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-cyan-500 text-left"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="Ahmed"
                  className="w-24 h-24 rounded-full ring-4 ring-cyan-100"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Ahmed Hassan</h3>
            <div className="inline-block px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm font-semibold mb-3">
              Organizer
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Create events, manage attendees, view analytics
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>📧 ahmed@demo.com</div>
              <div>🔑 demo123</div>
              <div>⭐ Level 15 • 3,240 XP</div>
            </div>
          </button>

          {/* Layla - Admin */}
          <button
            onClick={() => handleDemoLogin('admin@demo.com', 'demo123')}
            className="bg-card rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-transparent hover:border-orange-500 text-left"
          >
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src="https://i.pravatar.cc/150?img=47"
                  alt="Layla"
                  className="w-24 h-24 rounded-full ring-4 ring-orange-100"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Layla Mostafa</h3>
            <div className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold mb-3">
              Administrator
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Platform management, moderation, analytics
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>📧 admin@demo.com</div>
              <div>🔑 demo123</div>
              <div>⭐ Level 20 • 5,000 XP</div>
            </div>
          </button>
        </div>

        {/* Manual Login Form */}
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6 text-center">Or sign in manually</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border bg-input-background rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border bg-input-background rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#6C4CF1] to-[#5739D4] hover:shadow-lg text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Landing */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-muted-foreground hover:text-foreground text-sm transition">
            ← Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
