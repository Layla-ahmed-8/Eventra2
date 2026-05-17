import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, Mail, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '../../components/Logo';

type Status = 'pending' | 'approved' | 'rejected';

export default function PendingApproval() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('pending');
  const [checking, setChecking] = useState(false);
  const [secondsUntilAuto, setSecondsUntilAuto] = useState(60);

  // Auto-simulate approval after 60 seconds for demo
  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsUntilAuto((s) => {
        if (s <= 1) {
          clearInterval(tick);
          setStatus('approved');
          toast.success('Your organizer account has been approved!');
          setTimeout(() => navigate('/organizer/onboarding'), 2000);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [navigate]);

  const handleCheckNow = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      if (secondsUntilAuto <= 30) {
        setStatus('approved');
        toast.success('Your organizer account has been approved!');
        setTimeout(() => navigate('/organizer/onboarding'), 2000);
      } else {
        toast.info('Status unchanged — still under review. We\'ll notify you by email.');
      }
    }, 1200);
  };

  if (status === 'approved') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-8">
            <Logo variant="small" />
          </div>
          <div className="surface-panel p-8 rounded-2xl">
            <div className="flex justify-center mb-6">
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </span>
            </div>
            <h1 className="text-h1 font-bold mb-3">Account Approved!</h1>
            <p className="text-body text-muted-foreground mb-4">
              Welcome to Eventra as an organizer. Redirecting you to complete your profile…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-8">
          <Logo variant="small" />
        </div>

        <div className="surface-panel p-8 rounded-2xl">
          <div className="flex justify-center mb-6">
            <span className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </span>
          </div>

          <h1 className="text-h1 font-bold mb-3">Account Under Review</h1>
          <p className="text-body text-muted-foreground mb-2">
            Your organizer account is currently being reviewed by our team. This typically takes
            <strong className="text-foreground"> 1–2 business days</strong>.
          </p>
          <p className="text-caption text-muted-foreground mb-6">
            Demo: auto-approving in <span className="font-bold text-amber-600">{secondsUntilAuto}s</span>
          </p>

          <div className="space-y-3 text-left mb-6">
            {[
              { icon: Mail, text: "You'll receive an email when your account is approved or if we need more information." },
              { icon: CheckCircle, text: 'Once approved, you can complete your organizer profile and start creating events.' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/40">
                <Icon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-body-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleCheckNow}
              disabled={checking}
              className="btn-primary w-full justify-center inline-flex items-center gap-2 disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Checking…' : 'Check Status Now'}
            </button>
            <a
              href="mailto:support@eventra.com"
              className="btn-secondary w-full py-2.5 rounded-xl text-sm font-medium text-center"
            >
              Contact Support
            </a>
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
