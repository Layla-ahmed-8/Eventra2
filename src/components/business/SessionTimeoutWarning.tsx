import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAppStore } from '../../store/useAppStore';

const WARNING_BEFORE_MS = 2 * 60 * 1000; // show warning 2 min before expiry

export default function SessionTimeoutWarning() {
  const { tokenExpiry, logout, extendSession } = useAppStore();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const checkRef = useRef<ReturnType<typeof setInterval>>();
  const tickRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!tokenExpiry) return;

    const check = () => {
      const remaining = tokenExpiry - Date.now();
      if (remaining <= 0) {
        clearInterval(checkRef.current);
        logout();
        toast.error('Your session has expired. Please log in again.');
        navigate('/login');
      } else if (remaining <= WARNING_BEFORE_MS) {
        setSecondsLeft(Math.floor(remaining / 1000));
        setVisible(true);
      }
    };

    checkRef.current = setInterval(check, 5000);
    check();
    return () => clearInterval(checkRef.current);
  }, [tokenExpiry, logout]);

  useEffect(() => {
    if (!visible) { clearInterval(tickRef.current); return; }
    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { clearInterval(tickRef.current); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [visible]);

  const handleExtend = () => {
    extendSession();
    setVisible(false);
    toast.success('Session extended for 30 more minutes.');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[min(420px,calc(100%-2rem))]">
      <div className="surface-panel border-2 border-orange-400/60 p-5 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-bold text-foreground">Session expiring soon</p>
            <p className="text-caption text-muted-foreground mt-1">
              Your session expires in{' '}
              <span className="font-bold text-orange-500">{secondsLeft}s</span>.
              Extend to stay signed in.
            </p>
          </div>
          <button onClick={() => setVisible(false)} className="text-muted-foreground hover:text-foreground flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleExtend}
            className="btn-primary flex-1 justify-center text-body-sm inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Extend Session
          </button>
          <button
            onClick={logout}
            className="btn-secondary text-body-sm text-red-500 hover:border-red-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
