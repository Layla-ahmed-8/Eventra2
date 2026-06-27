import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Logo from '../../components/Logo';

export default function Login() {
  const navigate = useNavigate();
  const { login, theme, toggleTheme } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const resolvePostLoginRoute = () => {
    const { currentUser } = useAppStore.getState();
    if (!currentUser) return '/app/discover';
    if (currentUser.role === 'admin') return '/admin/analytics';
    if (currentUser.role === 'organizer') return currentUser.onboardingCompleted ? '/organizer/analytics' : '/organizer/onboarding';
    return currentUser.onboardingCompleted ? '/app/discover' : '/onboarding';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate(resolvePostLoginRoute());
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6FF] dark:bg-[#050816] flex items-center justify-center p-6 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 w-12 h-12 rounded-3xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shadow-lg shadow-slate-900/5 transition-all hover:-translate-y-0.5"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
      </button>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-center">
          <div className="hidden lg:block rounded-[2rem] bg-white/90 dark:bg-slate-950/90 border border-slate-200/70 dark:border-slate-800/70 p-12 shadow-2xl shadow-slate-900/5 backdrop-blur-xl">
            <div className="inline-flex items-center gap-3 rounded-3xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-3 text-white font-semibold mb-8 shadow-lg shadow-purple-500/20">
              <Logo variant="small" className="w-10 h-10" />
              <span>Eventra Secure Login</span>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-950 dark:text-white leading-tight mb-6">Access your event dashboard with a secure account.</h2>
            <p className="max-w-xl text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              Create a new account or sign in to continue. Admin access is kept separate to protect the platform control panel.
            </p>
            <div className="mt-10 grid gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                <span>Clean, polished login experience for users and admins.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                <span>Sign up with a modern registration workflow for attendees and organizers.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-500" />
                <span>Admin portal receives a dedicated signin route for better separation.</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 p-10 shadow-2xl shadow-slate-900/10">
            <div className="flex flex-col gap-3 mb-8 text-center">
              <Logo variant="horizontal" className="mx-auto h-10 w-auto" />
              <div>
                <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Sign in to Eventra</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Use your registered account credentials to continue.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-3xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Email address
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-3xl bg-gradient-to-r from-primary to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
              >
                Sign in
              </button>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
              <Link to="/forgot-password" className="text-center hover:text-slate-900 dark:hover:text-white transition-colors">
                Forgot password?
              </Link>
              <div className="text-center">
                Don&rsquo;t have an account?{' '}
                <Link to="/register" className="font-semibold text-primary hover:underline">
                  Sign up
                </Link>
              </div>
              <div className="text-center">
                Admin?{' '}
                <Link to="/admin-login" className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                  Sign in here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

