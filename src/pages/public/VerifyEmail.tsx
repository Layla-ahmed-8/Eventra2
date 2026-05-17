import { Link, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import Logo from '../../components/Logo';

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [resent, setResent] = useState(false);

  // Demo: any non-empty token = success
  const isValid = !!token && token !== 'invalid';

  const handleResend = () => setResent(true);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo variant="small" />
        </div>

        <div className="surface-panel p-8 rounded-2xl text-center">
          {isValid ? (
            <>
              <div className="flex justify-center mb-5">
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </span>
              </div>
              <h1 className="text-h1 font-bold mb-2">Email verified!</h1>
              <p className="text-body-sm text-muted-foreground mb-6">
                Your account is now active. You can sign in to get started.
              </p>
              <Link to="/login" className="btn-primary inline-block px-6 py-2.5 rounded-xl font-semibold">
                Go to Login
              </Link>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-5">
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30">
                  <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </span>
              </div>
              <h1 className="text-h1 font-bold mb-2">Verification failed</h1>
              <p className="text-body-sm text-muted-foreground mb-6">
                This link is invalid or has expired. Request a new verification email below.
              </p>
              {resent ? (
                <p className="text-sm text-green-600 dark:text-green-400">
                  A new verification email has been sent!
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold"
                >
                  <RefreshCw className="w-4 h-4" />
                  Resend Verification Email
                </button>
              )}
              <div className="mt-4">
                <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
