import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import Logo from '../../components/Logo';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="surface-panel p-8 rounded-2xl text-center max-w-md w-full">
          <p className="text-body text-red-600">Invalid or expired reset link.</p>
          <Link to="/forgot-password" className="btn-primary mt-4 inline-block px-6 py-2 rounded-xl text-sm font-semibold">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    // Demo: show success then redirect
    setDone(true);
    setTimeout(() => navigate('/login'), 2500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo variant="small" />
        </div>

        <div className="surface-panel p-8 rounded-2xl">
          {done ? (
            <div className="text-center">
              <div className="flex justify-center mb-5">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                </span>
              </div>
              <h1 className="text-h1 font-bold mb-2">Password updated!</h1>
              <p className="text-body-sm text-muted-foreground">Redirecting to login…</p>
            </div>
          ) : (
            <>
              <h1 className="text-h1 font-bold mb-2">Set new password</h1>
              <p className="text-body-sm text-muted-foreground mb-6">
                Choose a strong password of at least 8 characters.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password" required placeholder="New password"
                    value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className="input-field pl-10 w-full"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password" required placeholder="Confirm new password"
                    value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                    className="input-field pl-10 w-full"
                  />
                </div>
                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
                <button type="submit" className="btn-primary w-full py-3 rounded-xl font-semibold">
                  Update Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
