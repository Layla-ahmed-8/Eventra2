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
      <div className="flex flex-wrap gap-1 p-1 bg-muted/50 rounded-xl inline-flex">
        {[
          { key: 'attendees', label: 'Attendees' },
          { key: 'analytics', label: 'Analytics' },
          { key: 'community', label: 'Community' },
          { key: 'checkin', label: 'Check-in' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-lg text-caption font-bold transition-all ${activeTab === tab.key ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'attendees' && (
          <div className="bento-section">
            <div className="bento-header">
              <div className="bento-title-wrapper">
                <Users className="w-5 h-5 text-primary" />
                <h2 className="bento-title">Attendees (142)</h2>
              </div>
              <button className="btn-secondary text-body-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table-surface w-full min-w-[600px]">
                <thead className="bg-secondary border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-caption font-black text-foreground uppercase tracking-widest">Name</th>
                    <th className="px-4 py-3 text-left text-caption font-black text-foreground uppercase tracking-widest">Ticket Type</th>
                    <th className="px-4 py-3 text-left text-caption font-black text-foreground uppercase tracking-widest">Booked</th>
                    <th className="px-4 py-3 text-left text-caption font-black text-foreground uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Array.from({ length: 8 }, (_, i) => (
                    <tr key={i} className="hover:bg-secondary/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={`https://i.pravatar.cc/40?img=${i + 20}`} alt="" className="w-9 h-9 rounded-full flex-shrink-0 border border-border" />
                          <div className="min-w-0">
                            <p className="text-body-sm font-bold text-foreground truncate">Attendee {i + 1}</p>
                            <p className="text-[10px] font-medium text-muted-foreground truncate">attendee{i + 1}@example.com</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-caption font-bold text-muted-foreground">{i % 3 === 0 ? 'VIP' : 'GA'}</td>
                      <td className="px-4 py-3 text-caption font-bold text-muted-foreground whitespace-nowrap">May {i + 10}, 2026</td>
                      <td className="px-4 py-3">
                        <span className="status-pill bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 font-black uppercase text-[10px]">Confirmed</span>
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Page Views', value: '2,847', change: '+18%', icon: Eye, bg: 'icon-box-primary' },
                { label: 'Conversion', value: '24%', change: '+5%', icon: BarChart, bg: 'icon-box-cyan' },
                { label: 'Revenue', value: '21.3K', icon: DollarSign, bg: 'icon-box-orange' },
                { label: 'Avg Ticket', value: '150', icon: DollarSign, bg: 'icon-box-green' },
              ].map((kpi) => (
                <div key={kpi.label} className="kpi-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`icon-box ${kpi.bg}`}>
                      <kpi.icon className="w-4 h-4" />
                    </div>
                    {kpi.change && (
                      <span className="kpi-trend text-green-600 dark:text-green-400">
                        <ArrowUpRight className="w-3 h-3" />{kpi.change}
                      </span>
                    )}
                  </div>
                  <p className="kpi-value">{kpi.value}</p>
                  <p className="kpi-label">{kpi.label}</p>
                </div>
              ))}
            </div>

            <div className="bento-section">
              <div className="bento-header">
                <div className="bento-title-wrapper">
                  <BarChart className="w-5 h-5 text-primary" />
                  <h2 className="bento-title">Registration Timeline</h2>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-1.5 pt-4">
                {Array.from({ length: 14 }, (_, i) => {
                  const h = 20 + Math.random() * 80;
                  return (
                    <div key={i} className="flex-1 bg-primary/20 rounded-t-lg hover:bg-primary/40 transition-colors" style={{ height: `${h}%` }} />
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
