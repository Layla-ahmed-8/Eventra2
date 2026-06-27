import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, ArrowLeft, Moon, Sun } from 'lucide-react';
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
    const success = await login(email, password);
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
    <div className="min-h-screen bg-[#070b18] flex items-center justify-center p-6 overflow-hidden text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 w-12 h-12 rounded-3xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-center shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
      </button>

      <div className="relative z-10 w-full max-w-5xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className="hidden lg:flex flex-col justify-between rounded-[2rem] bg-white/5 border border-white/10 p-10 shadow-[0_60px_120px_-60px_rgba(15,23,42,0.6)] backdrop-blur-xl text-slate-100">
            <div>
              <div className="inline-flex items-center gap-3 rounded-3xl bg-cyan-500/20 px-4 py-3 text-sm font-semibold text-cyan-200 mb-6">
                <Shield className="w-5 h-5" />
                Admin portal
              </div>
              <h2 className="text-4xl font-semibold leading-tight">Admin login</h2>
              <p className="mt-5 max-w-xl text-slate-300 text-base leading-7">
                Sign in to manage platform settings, moderate content, and review analytics from the secure admin dashboard.
              </p>
            </div>
            <div className="space-y-4 text-sm text-slate-400">
              <p className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-purple-400" />
                Secure access for administrators only.
              </p>
              <p className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                Separate sign in page keeps user and admin workflows distinct.
              </p>
              <p className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-200" />
                Use your registered admin credentials to continue.
              </p>
            </div>
          </div>

          <div className="w-full rounded-[2rem] bg-slate-950/95 border border-slate-800/80 p-10 shadow-2xl shadow-slate-950/30">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Logo variant="small" className="h-10 w-10" />
                <div>
                  <p className="text-sm text-cyan-400 uppercase tracking-[0.24em]">Administrator</p>
                  <h1 className="text-3xl font-bold text-white">Secure sign in</h1>
                </div>
              </div>
              <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                User login
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-3xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <label className="block text-sm font-semibold text-slate-300">
                Admin email
                <div className="mt-3 relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 pl-12 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
              </label>

              <label className="block text-sm font-semibold text-slate-300">
                Password
                <div className="mt-3 relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-4 py-3 pl-12 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="w-full rounded-3xl bg-gradient-to-r from-cyan-500 to-slate-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5"
              >
                Sign in as admin
              </button>
            </form>

            <div className="mt-6 text-sm text-slate-400">
              <p>
                Want to sign in as a user?{' '}
                <Link to="/login" className="text-cyan-300 hover:text-white transition-colors">
                  Go to user login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
