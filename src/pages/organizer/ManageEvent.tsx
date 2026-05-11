import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Users, BarChart, MessageSquare, QrCode, Download } from 'lucide-react';

export default function ManageEvent() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'attendees' | 'analytics' | 'community' | 'checkin'>('attendees');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Link
            to="/organizer/events"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-body">My Events</span>
          </Link>
        </div>
        <h1 className="text-h1 font-bold text-foreground">
          Manage Event: Cairo Jazz Night
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-[#F5F3FF] p-2 rounded-2xl inline-flex">
        {[
          { key: 'attendees', label: 'Attendees' },
          { key: 'analytics', label: 'Analytics' },
          { key: 'community', label: 'Community' },
          { key: 'checkin', label: 'Check-in' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`filter-chip ${activeTab === tab.key ? 'active' : 'inactive'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'attendees' && (
          <div className="surface-panel p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-h2 font-semibold text-foreground">Attendees (142)</h2>
              <button className="btn-secondary flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export List
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table-surface w-full">
                <thead className="bg-[#F8F5FF] border-b border-[#E9E4FF]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Ticket Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Booked
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Array.from({ length: 10 }, (_, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://i.pravatar.cc/40?img=${i + 1}`}
                            alt=""
                            className="w-10 h-10 rounded-full"
                          />
                          <span className="font-medium text-gray-900">
                            Attendee {i + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        attendee{i + 1}@example.com
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {i % 3 === 0 ? 'VIP Table' : 'General Admission'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">May {i + 1}, 2026</td>
                      <td className="px-4 py-3">
                        <span className="status-pill bg-green-100 text-green-700">Confirmed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="surface-panel p-5">
                <p className="text-caption text-muted-foreground mb-1">Page Views</p>
                <p className="text-display font-semibold text-foreground">2,847</p>
                <p className="text-caption text-green-600 mt-1">+18% vs last week</p>
              </div>
              <div className="surface-panel p-5">
                <p className="text-caption text-muted-foreground mb-1">Conversion Rate</p>
                <p className="text-display font-semibold text-foreground">24%</p>
                <p className="text-caption text-green-600 mt-1">+5% vs average</p>
              </div>
              <div className="surface-panel p-5">
                <p className="text-caption text-muted-foreground mb-1">Revenue</p>
                <p className="text-display font-semibold text-foreground">21.3K</p>
                <p className="text-caption text-muted-foreground mt-1">EGP</p>
              </div>
              <div className="surface-panel p-5">
                <p className="text-caption text-muted-foreground mb-1">Avg Ticket Price</p>
                <p className="text-display font-semibold text-foreground">150</p>
                <p className="text-caption text-muted-foreground mt-1">EGP</p>
              </div>
            </div>

            <div className="surface-panel p-5">
              <h3 className="text-h3 font-semibold text-foreground mb-4">Registration Timeline</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {Array.from({ length: 14 }, (_, i) => {
                  const height = Math.random() * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col justify-end">
                      <div
                        className="bg-gradient-to-t from-[#6C4CF1] to-[#00C2FF] rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="surface-panel p-5">
            <h2 className="text-h2 font-semibold text-foreground mb-4">Event Community</h2>
            <p className="text-body text-muted-foreground mb-6">
              Engage with your attendees through discussions and updates
            </p>
            <button className="btn-primary inline-flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Post Update
            </button>
          </div>
        )}

        {activeTab === 'checkin' && (
          <div className="surface-panel p-5">
            <h2 className="text-h2 font-semibold text-foreground mb-4">Check-in System</h2>
            <div className="text-center py-12">
              <QrCode className="w-24 h-24 text-[#6C4CF1] mx-auto mb-4" />
              <h3 className="text-h3 font-semibold text-foreground mb-2">
                Scan QR Codes
              </h3>
              <p className="text-body text-muted-foreground mb-6">
                Use the mobile app to scan attendee tickets at the door
              </p>
              <button className="btn-primary">
                Open Scanner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
