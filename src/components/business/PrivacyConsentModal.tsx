import { useState, useEffect } from 'react';
import { Shield, MapPin, BarChart2, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

const CONSENT_KEY = 'eventra-privacy-consent';

export default function PrivacyConsentModal() {
  const { locationEnabled, isAuthenticated } = useAppStore();
  const setLocationEnabled = useAppStore((s) => s.updateProfile);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    const already = localStorage.getItem(CONSENT_KEY);
    if (!already) setOpen(true);
  }, [isAuthenticated]);

  const handle = (allowLocation: boolean) => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    if (allowLocation) {
      // Update store — locationEnabled is part of persist state
      useAppStore.setState({ locationEnabled: true });
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="surface-panel w-full max-w-md p-7 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <button onClick={() => handle(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-h2 font-bold text-foreground mb-2">Your privacy, your choice</h2>
        <p className="text-body-sm text-muted-foreground mb-6 leading-relaxed">
          Eventra uses data to personalise your experience. You control what we collect.
        </p>

        <div className="space-y-3 mb-6">
          {[
            { icon: MapPin, label: 'Location', desc: 'Find events near you and improve recommendations', color: 'text-cyan-500' },
            { icon: BarChart2, label: 'Behavioural data', desc: 'Personalise your feed based on browsing and RSVPs', color: 'text-primary' },
          ].map(({ icon: Icon, label, desc, color }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 border border-border/50">
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${color}`} />
              <div>
                <p className="text-body-sm font-bold text-foreground">{label}</p>
                <p className="text-caption text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={() => handle(true)} className="btn-primary w-full justify-center">
            Allow all & continue
          </button>
          <button
            onClick={() => handle(false)}
            className="btn-secondary w-full justify-center text-body-sm"
          >
            Essential only (no location or personalisation)
          </button>
        </div>
      </div>
    </div>
  );
}
