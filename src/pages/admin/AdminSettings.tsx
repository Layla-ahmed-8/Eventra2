import { useState } from 'react';
import { Save, Mail, Bell, Shield, Palette, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { demoToast } from '../../lib/demoFeedback';
import { useAppStore } from '../../store/useAppStore';

type FeatureFlag = { id: string; name: string; description: string; enabled: boolean };
type Integration = { name: string; status: 'connected' | 'disconnected' };

export default function AdminSettings() {
  const { systemConfig, updateSystemConfig } = useAppStore();
  const [isSaving, setIsSaving] = useState(false);

  const [features, setFeatures] = useState<FeatureFlag[]>([
    { id: 'auto', name: 'Event Auto-Approval', description: 'Automatically approve events from verified organizers', enabled: false },
    { id: 'ai', name: 'AI Recommendations', description: 'Enable AI-powered event recommendations for users', enabled: systemConfig.aiRecommendationsEnabled },
    { id: 'community', name: 'Community Features', description: 'Enable community discussions and forums', enabled: true },
    { id: 'pay', name: 'Payment Processing', description: 'Enable online payment processing', enabled: true },
    { id: 'virtual', name: 'Virtual Events', description: 'Allow organizers to create virtual events', enabled: true },
  ]);
  const [integrations, setIntegrations] = useState<Integration[]>([
    { name: 'Google Analytics', status: 'connected' },
    { name: 'Stripe Payment', status: 'connected' },
    { name: 'SendGrid Email', status: 'connected' },
    { name: 'Twilio SMS', status: 'disconnected' },
    { name: 'Facebook Events', status: 'disconnected' },
  ]);
  const [platformName, setPlatformName] = useState(systemConfig.platformName);
  const [contactEmail, setContactEmail] = useState(systemConfig.contactEmail);
  const [platformFee, setPlatformFee] = useState(systemConfig.platformFeePercentage);

  const toggleFeature = (id: string) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  const handleSave = () => {
    setIsSaving(true);
    const aiFlag = features.find((f) => f.id === 'ai');
    setTimeout(() => {
      updateSystemConfig({
        platformName: platformName.trim() || systemConfig.platformName,
        contactEmail: contactEmail.trim() || systemConfig.contactEmail,
        platformFeePercentage: platformFee,
        aiRecommendationsEnabled: aiFlag?.enabled ?? systemConfig.aiRecommendationsEnabled,
      });
      toast.success('Settings saved successfully.');
      setIsSaving(false);
    }, 1200);
  };

  const connectIntegration = (name: string) => {
    setIntegrations((prev) => prev.map((i) => (i.name === name ? { ...i, status: 'connected' } : i)));
    demoToast('Connected', `${name} (demo).`);
  };

  const openIntegrationConfig = (name: string) => {
    demoToast('Configure', `Open settings for ${name} (demo).`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">Platform Settings</h1>
          <p className="text-body text-muted-foreground mt-1">Configure platform features, integrations, and preferences</p>
        </div>
        <button
          type="button"
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 disabled:opacity-70"
          onClick={handleSave}
        >
          {isSaving ? <span className="btn-spinner" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="surface-panel p-5">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-[#6C4CF1]" />
              <h2 className="text-h2 font-semibold text-foreground">Feature Flags</h2>
            </div>

            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature.id} className="surface-panel p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{feature.name}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={feature.enabled}
                    onClick={() => toggleFeature(feature.id)}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                      feature.enabled ? 'bg-[#6C4CF1]' : 'bg-[#F4F3FF] dark:bg-muted'
                    }`}
                  >

                    <span
                      className={`absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white border border-gray-300 transition-transform ${
                        feature.enabled ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>


          <div className="surface-panel p-5">
            <div className="flex items-center gap-3 mb-6">
              <Mail className="w-5 h-5 text-[#6C4CF1]" />
              <h2 className="text-h2 font-semibold text-foreground">Email Templates</h2>
            </div>

            <div className="space-y-3">
              {['Welcome Email', 'Booking Confirmation', 'Event Reminder', 'Password Reset', 'Event Published'].map((template) => (
                <div key={template} className="surface-panel p-4 flex items-center justify-between gap-4">
                  <p className="font-medium text-foreground">{template}</p>
                  <button
                    type="button"
                    className="px-3 py-1 text-sm border border-[#6C4CF1] text-[#6C4CF1] rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/30"
                    onClick={() => demoToast('Editor', `Open template: ${template} (demo).`)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-5 h-5 text-[#6C4CF1]" />
              <h2 className="text-h2 font-semibold text-foreground">Integrations</h2>
            </div>

            <div className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.name} className="surface-panel p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        integration.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    />
                    <p className="font-semibold text-foreground truncate">{integration.name}</p>
                  </div>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-xl font-semibold text-body-sm transition-all flex-shrink-0 ${
                      integration.status === 'connected' ? 'btn-secondary' : 'btn-primary'
                    }`}
                    onClick={() =>
                      integration.status === 'connected'
                        ? openIntegrationConfig(integration.name)
                        : connectIntegration(integration.name)
                    }
                  >
                    {integration.status === 'connected' ? 'Configure' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="surface-panel p-5">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-5 h-5 text-[#6C4CF1]" />
              <h2 className="text-h2 font-semibold text-foreground">General</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-2">Platform Name</label>
                <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="w-full px-4 py-2 input-base" />
              </div>
              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-2">Support Email</label>
                <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full px-4 py-2 input-base" />
              </div>
              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-2">Default Currency</label>
                <select className="w-full px-4 py-2 input-base">
                  <option>EGP - Egyptian Pound</option>
                  <option>USD - US Dollar</option>
                  <option>EUR - Euro</option>
                </select>
              </div>
              <div>
                <label className="block text-body-sm font-semibold text-foreground mb-2">Service Fee (%)</label>
                <input type="number" value={platformFee} onChange={(e) => setPlatformFee(Number(e.target.value))} className="w-full px-4 py-2 input-base" />
              </div>
            </div>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-[#6C4CF1]" />
              <h2 className="text-h2 font-semibold text-foreground">Notifications</h2>
            </div>

            <div className="space-y-3">
              {['New User Signups', 'Event Submissions', 'Payment Alerts', 'Flagged Content', 'System Errors'].map((notification, index) => (
                <label key={notification} className="flex items-center justify-between p-3 surface-panel cursor-pointer">
                  <span className="text-body text-foreground">{notification}</span>
                  <input type="checkbox" defaultChecked={index < 3} className="rounded text-[#6C4CF1] focus:ring-[#6C4CF1]" />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

