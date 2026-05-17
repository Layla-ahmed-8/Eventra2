import { Link } from 'react-router-dom';
import { ShieldAlert, Mail } from 'lucide-react';
import Logo from '../../components/Logo';

export default function AccountSuspended() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Logo variant="small" />
        </div>

        <div className="surface-panel p-8 rounded-2xl text-center">
          <div className="flex justify-center mb-5">
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30">
              <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
            </span>
          </div>

          <h1 className="text-h1 font-bold mb-2 text-red-600 dark:text-red-400">Account Suspended</h1>
          <p className="text-body text-muted-foreground mb-6">
            Your account has been temporarily suspended. If you believe this is a mistake,
            please contact our support team.
          </p>

          <div className="p-4 rounded-xl bg-muted/40 text-left mb-6 space-y-2">
            <p className="text-body-sm font-medium">What you can do:</p>
            <ul className="space-y-1 text-body-sm text-muted-foreground list-disc list-inside">
              <li>Review our community guidelines</li>
              <li>Contact support with your account email</li>
              <li>Appeal the suspension if you believe it's an error</li>
            </ul>
          </div>

          <a
            href="mailto:support@eventra.com"
            className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold mb-3 w-full justify-center"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>

          <Link
            to="/login"
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Try a different account
          </Link>
        </div>
      </div>
    </div>
  );
}
