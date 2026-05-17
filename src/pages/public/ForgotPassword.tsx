import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Logo from '../../components/Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: always show success
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo variant="small" />
        </div>

        <div className="surface-panel p-8 rounded-2xl">
          {sent ? (
            <div className="text-center">
              <div className="flex justify-center mb-5">
                <span className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                </span>
              </div>
              <h1 className="text-h1 font-bold mb-2">Check your email</h1>
              <p className="text-body-sm text-muted-foreground mb-6">
                If an account exists for <strong className="text-foreground">{email}</strong>, you'll receive a
                password reset link within a few minutes.
              </p>
              <Link to="/login" className="btn-primary inline-block px-6 py-2.5 rounded-xl text-sm font-semibold">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-h1 font-bold mb-2">Forgot password?</h1>
              <p className="text-body-sm text-muted-foreground mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email" required placeholder="Email address"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10 w-full"
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-3 rounded-xl font-semibold">
                  Send Reset Link
                </button>
              </form>

              <Link to="/login" className="flex items-center gap-2 justify-center mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
