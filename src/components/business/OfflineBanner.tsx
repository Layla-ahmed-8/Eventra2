import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] flex items-center gap-3 px-4 py-2.5 bg-orange-500/10 border-b border-orange-400/40 backdrop-blur-sm">
      <WifiOff className="w-4 h-4 text-orange-500 flex-shrink-0" />
      <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
        You're offline. Some features may be unavailable.
      </p>
    </div>
  );
}
