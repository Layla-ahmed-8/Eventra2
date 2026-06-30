import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, ArrowLeft, Moon, Sun, Activity, KeyRound } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Logo from '../../components/Logo';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, theme, toggleTheme } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(email.trim(), password);
    if (success) {
      const user = useAppStore.getState().currentUser;
      if (user?.role === 'admin') {
        navigate('/admin/analytics');
      } else if (user) {
        setError('This account does not have admin access.');
      } else {
        setError('Invalid email or password');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6FF] dark:bg-[#050816] flex items-center justify-center p-6 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-red-500/10 blur-3xl" />
        <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
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
            <div className="inline-flex items-center gap-3 rounded-3xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-3 text-white font-semibold mb-8 shadow-lg shadow-red-500/20">
              <Shield className="w-5 h-5" />
              <span>Eventra Admin Portal</span>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-950 dark:text-white leading-tight mb-6">
              Secure control panel for platform operations.
            </h2>
            <p className="max-w-xl text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
              Manage users, moderate content, review analytics, and configure system settings from a dedicated admin workspace.
            </p>
            <div className="mt-10 grid gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-3">
                <Activity className="w-4 h-4 mt-0.5 text-red-500" />
                <span>Real-time platform health and moderation tools.</span>
              </div>
              <div className="flex items-start gap-3">
                <KeyRound className="w-4 h-4 mt-0.5 text-primary" />
                <span>Separate admin sign-in keeps user and admin flows isolated.</span>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 mt-0.5 text-cyan-500" />
                <span>Role-gated access — only administrator accounts can enter.</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 p-10 shadow-2xl shadow-slate-900/10">
            <div className="flex flex-col gap-3 mb-8">
              <Logo variant="horizontal" className="mx-auto h-10 w-auto" />
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 mb-1">Administrator</p>
                <h1 className="text-3xl font-semibold text-slate-950 dark:text-white">Admin sign in</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Use your admin credentials to access the control panel.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-3xl border border-red-200/80 bg-red-50/80 dark:bg-red-500/10 dark:border-red-500/20 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                  {error}
                </div>
              )}

              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Admin email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@demo.com"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-3xl bg-gradient-to-r from-red-600 to-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:-translate-y-0.5"
              >
                Sign in as admin
              </button>
            </form>

            <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/70 px-4 py-3 text-center text-xs text-slate-500 dark:text-slate-400">
              Demo: <span className="font-semibold text-slate-700 dark:text-slate-200">admin@demo.com</span> / <span className="font-semibold text-slate-700 dark:text-slate-200">demo123</span>
            </div>

            <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400 text-center">
              <Link to="/login" className="inline-flex items-center justify-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to user login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
