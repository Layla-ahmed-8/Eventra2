import { Save, Mail, Bell, Shield, Palette, Globe } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-h1 font-bold text-foreground">Platform Settings</h1>
          <p className="text-body text-muted-foreground mt-1">Configure platform features, integrations, and preferences</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Feature Flags */}
          <div className="md:col-span-2 space-y-6">
            <div className="surface-panel p-5">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-5 h-5 text-[#6C4CF1]" />
                <h2 className="text-h2 font-semibold text-foreground">Feature Flags</h2>
              </div>

              <div className="space-y-4">
                {[
                  {
                    name: 'Event Auto-Approval',
                    description: 'Automatically approve events from verified organizers',
                    enabled: false,
                  },
                  {
                    name: 'AI Recommendations',
                    description: 'Enable AI-powered event recommendations for users',
                    enabled: true,
                  },
                  {
                    name: 'Community Features',
                    description: 'Enable community discussions and forums',
                    enabled: true,
                  },
                  {
                    name: 'Payment Processing',
                    description: 'Enable online payment processing',
                    enabled: true,
                  },
                  {
                    name: 'Virtual Events',
                    description: 'Allow organizers to create virtual events',
                    enabled: true,
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="surface-panel p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{feature.name}</p>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={feature.enabled}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#F4F3FF] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C4CF1]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Templates */}
            <div className="surface-panel p-5">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-5 h-5 text-[#6C4CF1]" />
                <h2 className="text-h2 font-semibold text-foreground">Email Templates</h2>
              </div>

              <div className="space-y-3">
                {[
                  'Welcome Email',
                  'Booking Confirmation',
                  'Event Reminder',
                  'Password Reset',
                  'Event Published',
                ].map((template, index) => (
                  <div
                    key={index}
                    className="surface-panel p-4 flex items-center justify-between cursor-pointer"
                  >
                    <p className="font-medium text-foreground">{template}</p>
                    <button className="px-3 py-1 text-sm border border-[#6C4CF1] text-[#6C4CF1] rounded-lg hover:bg-purple-50">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Integrations */}
            <div className="surface-panel p-5">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-5 h-5 text-[#6C4CF1]" />
                <h2 className="text-h2 font-semibold text-foreground">Integrations</h2>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Google Analytics', status: 'connected', color: 'green' },
                  { name: 'Stripe Payment', status: 'connected', color: 'green' },
                  { name: 'SendGrid Email', status: 'connected', color: 'green' },
                  { name: 'Twilio SMS', status: 'disconnected', color: 'gray' },
                  { name: 'Facebook Events', status: 'disconnected', color: 'gray' },
                ].map((integration, index) => (
                  <div
                    key={index}
                    className="surface-panel p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          integration.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      ></div>
                      <p className="font-semibold text-foreground">{integration.name}</p>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-xl font-semibold text-body-sm transition-all ${
                        integration.status === 'connected'
                          ? 'btn-secondary'
                          : 'btn-primary'
                      }`}
                    >
                      {integration.status === 'connected' ? 'Configure' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* General Settings */}
            <div className="surface-panel p-5">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-5 h-5 text-[#6C4CF1]" />
                <h2 className="text-h2 font-semibold text-foreground">General</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-2">Platform Name</label>
                  <input type="text" defaultValue="Eventra" className="w-full px-4 py-2 input-base" />
                </div>
                <div>
                  <label className="block text-body-sm font-semibold text-foreground mb-2">Support Email</label>
                  <input type="email" defaultValue="support@eventra.com" className="w-full px-4 py-2 input-base" />
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
                  <input type="number" defaultValue="3" className="w-full px-4 py-2 input-base" />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="surface-panel p-5">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-5 h-5 text-[#6C4CF1]" />
                <h2 className="text-h2 font-semibold text-foreground">Notifications</h2>
              </div>

              <div className="space-y-3">
                {[
                  'New User Signups',
                  'Event Submissions',
                  'Payment Alerts',
                  'Flagged Content',
                  'System Errors',
                ].map((notification, index) => (
                  <label
                    key={index}
                    className="flex items-center justify-between p-3 surface-panel cursor-pointer"
                  >
                    <span className="text-body text-foreground">{notification}</span>
                    <input
                      type="checkbox"
                      defaultChecked={index < 3}
                      className="rounded text-[#6C4CF1] focus:ring-[#6C4CF1]"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
