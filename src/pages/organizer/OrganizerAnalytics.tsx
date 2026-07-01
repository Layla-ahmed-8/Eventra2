
import React, { useEffect, useMemo, useState } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Funnel, FunnelChart, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Activity, ArrowDown, ArrowUp, Calendar, ChevronDown, DollarSign, Download, Filter, Search, Star, TrendingUp, Users, X } from 'lucide-react';

const COLORS = ['#7C5CFF', '#00D4FF', '#FF9B3D', '#22C55E', '#FF4FD8', '#EF4444'];

const MockOrganizerEvents = [
  { id: '1', name: 'Cairo Tech Summit 2026', category: 'Tech', date: '2026-05-15', capacity: 500, attendees: 420, revenue: 84000 },
  { id: '2', name: 'Alexandria Art Expo', category: 'Art', date: '2026-05-20', capacity: 200, attendees: 180, revenue: 45000 },
  { id: '3', name: 'Giza Music Festival', category: 'Music', date: '2026-06-01', capacity: 1000, attendees: 950, revenue: 190000 },
  { id: '4', name: 'Mansoura Sports Day', category: 'Sports', date: '2026-06-10', capacity: 300, attendees: 280, revenue: 42000 },
  { id: '5', name: 'Cairo Business Workshop', category: 'Business', date: '2026-06-20', capacity: 100, attendees: 90, revenue: 27000 },
  { id: '6', name: 'Aswan Photography Retreat', category: 'Workshop', date: '2026-06-25', capacity: 50, attendees: 45, revenue: 67500 },
];

const MockTicketTypes = [
  { eventId: '1', type: 'General', price: 150, count: 250, revenue: 37500 },
  { eventId: '1', type: 'VIP', price: 350, count: 120, revenue: 42000 },
  { eventId: '1', type: 'Early Bird', price: 100, count: 50, revenue: 5000 },
  { eventId: '2', type: 'General', price: 200, count: 100, revenue: 20000 },
  { eventId: '2', type: 'VIP', price: 400, count: 80, revenue: 32000 },
  { eventId: '3', type: 'General', price: 180, count: 600, revenue: 108000 },
  { eventId: '3', type: 'VIP', price: 350, count: 300, revenue: 105000 },
  { eventId: '4', type: 'General', price: 150, count: 280, revenue: 42000 },
  { eventId: '5', type: 'General', price: 300, count: 90, revenue: 27000 },
  { eventId: '6', type: 'General', price: 1500, count: 45, revenue: 67500 },
];

const MockCheckIns = [
  { time: '18:00', count: 15 },
  { time: '18:30', count: 35 },
  { time: '19:00', count: 80 },
  { time: '19:30', count: 140 },
  { time: '20:00', count: 95 },
  { time: '20:30', count: 50 },
  { time: '21:00', count: 30 },
  { time: '21:30', count: 20 },
  { time: '22:00', count: 10 },
  { time: '22:30', count: 5 },
  { time: '23:00', count: 3 },
  { time: '23:30', count: 2 },
  { time: '00:00', count: 0 },
];

const MockFeedback = [
  { id: '1', name: 'Mohamed Ali', rating: 5, date: '2026-05-16', text: 'Absolutely fantastic event! The speakers were incredible.', sentiment: 'Positive' },
  { id: '2', name: 'Sarah Hassan', rating: 4, date: '2026-05-17', text: 'Great experience overall, but the venue was a bit crowded.', sentiment: 'Positive' },
  { id: '3', name: 'Ahmed Khaled', rating: 3, date: '2026-05-18', text: 'It was okay. Food could have been better.', sentiment: 'Neutral' },
  { id: '4', name: 'Fatma Mostafa', rating: 5, date: '2026-05-19', text: 'Best tech summit I’ve ever attended in Cairo!', sentiment: 'Positive' },
  { id: '5', name: 'Omar Farouk', rating: 2, date: '2026-05-20', text: 'Disappointed with the organization.', sentiment: 'Negative' },
];

const MockFunnelData = [
  { name: 'Page Views', value: 2500 },
  { name: 'Started Checkout', value: 850 },
  { name: 'Completed Booking', value: 520 },
  { name: 'Attended', value: 480 },
];

const MockTimeSeriesData = (period: number) => {
  const data: Array<{ date: string; revenue: number; attendees: number }> = [];
  const end = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - period);
  let current = new Date(start);
  while (current <= end) {
    data.push({
      date: current.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 5000) + 2000,
      attendees: Math.floor(Math.random() * 100) + 20,
    });
    current.setDate(current.getDate() + 1);
  }
  return data;
};

const CardSkeleton = () => <div className="skeleton h-32 rounded-xl" />;
const ChartSkeleton = ({ height = 300 }: { height?: number }) => <div className="skeleton rounded-xl" style={{ height: `${height}px` }} />;

export default function OrganizerAnalytics() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [revenueFilter, setRevenueFilter] = useState<'all' | '100k' | '250k' | '500k'>('all');
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [visibleMetrics, setVisibleMetrics] = useState({ revenue: true, attendees: true });
  const [selectedEventIds, setSelectedEventIds] = useState(['1', '3']);
  const [sortKey, setSortKey] = useState<'name' | 'category' | 'attendees' | 'capacity' | 'revenue'>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [loadingStates, setLoadingStates] = useState({ kpi1: true, kpi2: true, kpi3: true, kpi4: true, chart1: true, chart2: true, chart3: true, chart4: true });

  useEffect(() => {
    const keys = Object.keys(loadingStates) as Array<keyof typeof loadingStates>;
    keys.forEach((key, index) => {
      window.setTimeout(() => setLoadingStates((prev) => ({ ...prev, [key]: false })), index * 250);
    });
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setLastUpdated(`${Math.floor(Math.random() * 5) + 1} minutes ago`), 60000);
    return () => window.clearInterval(timer);
  }, []);

  const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
  const timeSeriesData = useMemo(() => MockTimeSeriesData(periodDays), [periodDays]);

  const filteredEvents = useMemo(() => {
    return MockOrganizerEvents.filter((event) => {
      const matchesSearch = !searchTerm || event.name.toLowerCase().includes(searchTerm.toLowerCase()) || event.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || event.category === categoryFilter;
      const matchesDate = (!startDate || event.date >= startDate) && (!endDate || event.date <= endDate);
      const matchesRevenue = revenueFilter === 'all' ? true : event.revenue >= Number(revenueFilter.replace('k', '000'));
      return matchesSearch && matchesCategory && matchesDate && matchesRevenue;
    });
  }, [categoryFilter, endDate, revenueFilter, searchTerm, startDate]);

  const filteredTicketTypes = useMemo(() => {
    return MockTicketTypes.filter((ticket) => filteredEvents.some((event) => event.id === ticket.eventId));
  }, [filteredEvents]);

  const filteredTimeSeriesData = useMemo(() => {
    const scale = filteredEvents.length ? filteredEvents.length / MockOrganizerEvents.length : 0.2;
    return timeSeriesData.map((point) => ({ ...point, revenue: Math.round(point.revenue * scale), attendees: Math.round(point.attendees * scale) }));
  }, [filteredEvents.length, timeSeriesData]);

  const filteredTicketRevenueData = useMemo(() => {
    return filteredEvents.map((event) => ({
      event: event.name,
      General: filteredTicketTypes.find((t) => t.eventId === event.id && t.type === 'General')?.revenue || 0,
      VIP: filteredTicketTypes.find((t) => t.eventId === event.id && t.type === 'VIP')?.revenue || 0,
      'Early Bird': filteredTicketTypes.find((t) => t.eventId === event.id && t.type === 'Early Bird')?.revenue || 0,
    }));
  }, [filteredEvents, filteredTicketTypes]);

  const kpiData = useMemo(() => {
    const totalRevenue = filteredEvents.reduce((sum, event) => sum + event.revenue, 0);
    const totalAttendees = filteredEvents.reduce((sum, event) => sum + event.attendees, 0);
    const capacity = filteredEvents.reduce((sum, event) => sum + event.capacity, 0);
    const avgFill = capacity ? Math.round((totalAttendees / capacity) * 100) : 0;
    const repeatRate = filteredEvents.length ? Math.min(100, Math.round((totalAttendees / Math.max(1, filteredEvents.length * 120)) * 100)) : 0;
    const changeRev = filteredEvents.length ? 8 + (filteredEvents.length % 5) * 2 : 0;
    const changeAtt = filteredEvents.length ? 5 + (filteredEvents.length % 4) * 2 : 0;
    const changeFill = filteredEvents.length ? 3 + (filteredEvents.length % 3) : 0;
    const changeRepeat = filteredEvents.length ? 2 + (filteredEvents.length % 4) : 0;
    return { revenue: { current: totalRevenue, change: changeRev }, attendees: { current: totalAttendees, change: changeAtt }, fill: { current: avgFill, change: changeFill }, repeat: { current: repeatRate, change: changeRepeat } };
  }, [filteredEvents]);

  const sortedEvents = useMemo(() => {
    const data = [...filteredEvents];
    data.sort((a, b) => {
      const left = a[sortKey];
      const right = b[sortKey];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (typeof left === 'number' && typeof right === 'number') return (left - right) * modifier;
      return String(left).localeCompare(String(right)) * modifier;
    });
    return data;
  }, [sortDirection, sortKey]);

  const handleExportCSV = () => {
    const rows = [
      ['Metric', 'Current Period', 'Change vs Previous'],
      ['Total Revenue', `EGP ${kpiData.revenue.current.toLocaleString()}`, `${kpiData.revenue.change.toFixed(1)}%`],
      ['Total Attendees', kpiData.attendees.current.toLocaleString(), `${kpiData.attendees.change.toFixed(1)}%`],
      ['Avg Fill Rate', `${kpiData.fill.current}%`, `${kpiData.fill.change.toFixed(1)}%`],
      ['Repeat Rate', `${kpiData.repeat.current}%`, `${kpiData.repeat.change.toFixed(1)}%`],
    ];
    const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `organizer-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleMetric = (key: 'revenue' | 'attendees') => {
    setVisibleMetrics((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleEventSelection = (id: string) => {
    setSelectedEventIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((item) => item !== id);
        return next.length ? next : ['1'];
      }
      return [...prev, id];
    });
  };

  const activeFilters = [searchTerm && `Search: ${searchTerm}`, categoryFilter && `Category: ${categoryFilter}`, revenueFilter !== 'all' && `Revenue ≥ ${revenueFilter}`].filter(Boolean) as string[];

  const FilterChip = () => {
    if (!selectedFilter && !activeFilters.length) return null;
    return (
      <div className="flex flex-wrap items-center gap-2">
        {selectedFilter && (
          <div className="flex items-center gap-2 status-pill status-pill--info px-4 py-2 text-body-sm font-semibold">
            <Filter className="w-4 h-4" />
            {selectedFilter}
            <button onClick={() => setSelectedFilter(null)} className="ml-1 hover:opacity-70 rounded-full p-0.5"><X className="w-4 h-4" /></button>
          </div>
        )}
        {activeFilters.map((filter) => (
          <div key={filter} className="flex items-center gap-2 status-pill status-pill--info px-4 py-2 text-body-sm font-semibold">
            <Filter className="w-4 h-4" />
            {filter}
          </div>
        ))}
      </div>
    );
  };

  const renderStars = (rating: number) => Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />);

  return (
    <div className="dashboard-page--organizer flex w-full min-w-0 flex-col gap-4 sm:gap-6">
      <div className="mb-2 flex flex-col gap-4 sm:mb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="dashboard-role-badge mb-3">Organizer</span>
          <h1 className="text-h1 text-foreground">Organizer Dashboard</h1>
          <p className="text-body-sm text-muted-foreground">Track your event performance and grow your audience</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <span className="text-caption text-muted-foreground">Data as of {lastUpdated}</span>
          <button onClick={handleExportCSV} className="btn-organizer btn-primary flex w-full items-center justify-center gap-2 sm:w-auto"><Download className="w-4 h-4" />Download Report</button>
        </div>
      </div>

      <div className="rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-body-sm font-semibold text-foreground">Quick filter set</h3>
            <p className="text-caption text-muted-foreground">Use these controls to narrow large event sets quickly.</p>
          </div>
          <span className="text-caption text-muted-foreground">Showing {filteredEvents.length} of {MockOrganizerEvents.length} events</span>
        </div>
        <div className="flex flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-center">
          <div className="flex w-full min-w-0 items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-2 xl:min-w-[220px] xl:max-w-[280px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search events" className="w-full border-0 bg-transparent text-sm outline-none" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-base h-10 w-full text-body-sm xl:min-w-[150px] xl:max-w-[180px]">
            <option value="">All categories</option>
            {[...new Set(MockOrganizerEvents.map((event) => event.category))].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={revenueFilter} onChange={(e) => setRevenueFilter(e.target.value as 'all' | '100k' | '250k' | '500k')} className="input-base h-10 w-full text-body-sm xl:min-w-[150px] xl:max-w-[180px]">
            <option value="all">Any revenue</option>
            <option value="100k">EGP 100k+</option>
            <option value="250k">EGP 250k+</option>
            <option value="500k">EGP 500k+</option>
          </select>
          <div className="period-tabs flex flex-wrap gap-1 p-1">
            {(['7d', '30d', '90d', 'all'] as const).map((p) => (
              <button key={p} onClick={() => { setPeriod(p); setStartDate(''); setEndDate(''); }} className={`period-tab ${period === p && !startDate && !endDate ? 'period-tab--active' : ''}`}>
                {p.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" /><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-base h-10 w-full text-body-sm sm:w-auto" /></div>
            <span className="hidden text-muted-foreground text-body-sm sm:block">to</span>
            <div className="flex items-center gap-2"><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-base h-10 w-full text-body-sm sm:w-auto" /></div>
            {(startDate || endDate || searchTerm || categoryFilter || revenueFilter !== 'all') && <button onClick={() => { setStartDate(''); setEndDate(''); setSearchTerm(''); setCategoryFilter(''); setRevenueFilter('all'); }} className="btn-ghost text-body-sm">Reset</button>}
          </div>
        </div>
      </div>

      <FilterChip />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {[
          { label: 'Total Revenue', value: `EGP ${kpiData.revenue.current.toLocaleString()}`, change: kpiData.revenue.change, icon: DollarSign, iconClass: 'icon-box-cyan', loadingKey: 'kpi1' as const },
          { label: 'Total Attendees', value: kpiData.attendees.current.toLocaleString(), change: kpiData.attendees.change, icon: Users, iconClass: 'icon-box-primary', loadingKey: 'kpi2' as const },
          { label: 'Avg Fill Rate', value: `${kpiData.fill.current}%`, change: kpiData.fill.change, icon: TrendingUp, iconClass: 'icon-box-green', loadingKey: 'kpi3' as const },
          { label: 'Repeat Attendee Rate', value: `${kpiData.repeat.current}%`, change: kpiData.repeat.change, icon: Activity, iconClass: 'icon-box-orange', loadingKey: 'kpi4' as const },
        ].map((kpi, index) => (
          <div key={index} className="kpi-card h-full rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">
            {loadingStates[kpi.loadingKey] ? <CardSkeleton /> : (
              <>
                <div className="flex items-center justify-between"><span className="kpi-label">{kpi.label}</span><div className={`icon-box ${kpi.iconClass}`}><kpi.icon className="w-5 h-5" /></div></div>
                <p className="kpi-value">{kpi.value}</p>
                <div className="kpi-trend">{kpi.change > 0 ? <ArrowUp className="w-4 h-4 text-green-600" /> : kpi.change < 0 ? <ArrowDown className="w-4 h-4 text-red-500" /> : null}<span className={kpi.change > 0 ? 'text-green-600' : kpi.change < 0 ? 'text-red-500' : 'text-muted-foreground'}>{Math.abs(kpi.change).toFixed(1)}% vs previous period</span></div>
                {index === 3 && <div className="mt-2"><ResponsiveContainer width="100%" height={40}><AreaChart data={[{ name: 'P1', value: 30 }, { name: 'P2', value: 32 }, { name: 'P3', value: 31 }, { name: 'P4', value: 35 }, { name: 'P5', value: 33 }, { name: 'P6', value: 35 }]}><Area type="monotone" dataKey="value" stroke="#7C5CFF" fill="#7C5CFF" fillOpacity={0.12} strokeWidth={2} /></AreaChart></ResponsiveContainer></div>}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
        <div className="chart-panel rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-h3 font-bold text-foreground">Revenue & Attendance</h3>
              <p className="text-body-sm text-muted-foreground">Interactive trend view with metric toggles and drill-down.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <label className="flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-sm text-muted-foreground"><input type="checkbox" checked={visibleMetrics.revenue} onChange={() => toggleMetric('revenue')} /> Revenue</label>
              <label className="flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-sm text-muted-foreground"><input type="checkbox" checked={visibleMetrics.attendees} onChange={() => toggleMetric('attendees')} /> Registrations</label>
            </div>
          </div>
          {loadingStates.chart1 ? <ChartSkeleton height={300} /> : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={filteredTimeSeriesData} onClick={() => setSelectedFilter('Clicked a day in the overview')}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.32} /><stop offset="95%" stopColor="#7C5CFF" stopOpacity={0.03} /></linearGradient>
                  <linearGradient id="attendeeGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00D4FF" stopOpacity={0.28} /><stop offset="95%" stopColor="#00D4FF" stopOpacity={0.03} /></linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(107,114,128,0.18)" strokeDasharray="4 4" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip cursor={{ stroke: '#7C5CFF', strokeWidth: 1 }} contentStyle={{ borderRadius: 12, borderColor: 'rgba(124,92,255,0.18)', boxShadow: '0 12px 40px rgba(15,23,42,0.12)' }} />
                {visibleMetrics.revenue && <Area type="monotone" dataKey="revenue" stroke="#7C5CFF" fill="url(#revenueGradient)" strokeWidth={2.5} activeDot={{ r: 5 }} onClick={() => setSelectedFilter('Revenue trend')} />}
                {visibleMetrics.attendees && <Area type="monotone" dataKey="attendees" stroke="#00D4FF" fill="url(#attendeeGradient)" strokeWidth={2.5} activeDot={{ r: 5 }} onClick={() => setSelectedFilter('Attendance trend')} />}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-panel rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-6">
          <h3 className="text-h3 font-bold text-foreground mb-4 sm:mb-6">Revenue by Ticket Type</h3>
          {loadingStates.chart2 ? <ChartSkeleton height={300} /> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredTicketRevenueData}>
                <CartesianGrid vertical={false} stroke="rgba(107,114,128,0.18)" strokeDasharray="4 4" />
                <XAxis dataKey="event" tick={{ fontSize: 11 }} stroke="#6b7280" angle={-8} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip cursor={{ fill: 'rgba(124,92,255,0.06)' }} contentStyle={{ borderRadius: 12, borderColor: 'rgba(124,92,255,0.18)', boxShadow: '0 12px 40px rgba(15,23,42,0.12)' }} />
                <Legend />
                <Bar dataKey="General" radius={[8, 8, 0, 0]} fill="#7C5CFF" onClick={() => setSelectedFilter('General')} />
                <Bar dataKey="VIP" radius={[8, 8, 0, 0]} fill="#00D4FF" onClick={() => setSelectedFilter('VIP')} />
                <Bar dataKey="Early Bird" radius={[8, 8, 0, 0]} fill="#FF8A00" onClick={() => setSelectedFilter('Early Bird')} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-panel rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-6">
          <h3 className="text-h3 font-bold text-foreground mb-4 sm:mb-6">Conversion Funnel</h3>
          {loadingStates.chart3 ? <ChartSkeleton height={300} /> : (
            <ResponsiveContainer width="100%" height={300}>
              <FunnelChart>
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: 'rgba(124,92,255,0.18)', boxShadow: '0 12px 40px rgba(15,23,42,0.12)' }} />
                <Funnel data={MockFunnelData} dataKey="value">
                  <LabelList position="right" fill="#1f2937" stroke="none" dataKey="name" />
                  <LabelList position="inside" fill="#fff" stroke="none" dataKey="value" />
                  {MockFunnelData.map((entry, index) => <Cell key={`cell-${index}`} fill={['#7C5CFF', '#00D4FF', '#FF8A00', '#22C55E'][index % 4]} />)}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-panel rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-6">
          <h3 className="text-h3 font-bold text-foreground mb-4 sm:mb-6">Check-in Time Distribution</h3>
          {loadingStates.chart4 ? <ChartSkeleton height={300} /> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={MockCheckIns}>
                <CartesianGrid vertical={false} stroke="rgba(107,114,128,0.18)" strokeDasharray="4 4" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#6b7280" />
                <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                <Tooltip cursor={{ fill: 'rgba(124,92,255,0.06)' }} contentStyle={{ borderRadius: 12, borderColor: 'rgba(124,92,255,0.18)', boxShadow: '0 12px 40px rgba(15,23,42,0.12)' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#7C5CFF">{MockCheckIns.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.time === '19:30' ? '#EF4444' : '#7C5CFF'} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="chart-panel rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h3 className="text-h3 font-bold text-foreground">Per-event comparison</h3>
            <p className="text-body-sm text-muted-foreground">Select two or more events to compare their registration momentum.</p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            {MockOrganizerEvents.map((event) => (
              <label key={event.id} className="flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-sm text-muted-foreground">
                <input type="checkbox" checked={selectedEventIds.includes(event.id)} onChange={() => toggleEventSelection(event.id)} />
                {event.name}
              </label>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={filteredEvents.filter((event) => selectedEventIds.includes(event.id)).map((event) => ({ name: event.name.split(' ')[0], attendees: Math.round(event.attendees * 0.8), revenue: Math.round(event.revenue / 1000) }))}>
            <CartesianGrid vertical={false} stroke="rgba(107,114,128,0.18)" strokeDasharray="4 4" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#6b7280" />
            <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
            <Tooltip contentStyle={{ borderRadius: 12, borderColor: 'rgba(124,92,255,0.18)', boxShadow: '0 12px 40px rgba(15,23,42,0.12)' }} />
            <Area type="monotone" dataKey="attendees" stroke="#7C5CFF" fill="#7C5CFF" fillOpacity={0.16} strokeWidth={2.2} />
            <Area type="monotone" dataKey="revenue" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.16} strokeWidth={2.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-panel rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-h3 font-bold text-foreground">Top-performing events</h3>
            <p className="text-body-sm text-muted-foreground">Click a column to sort the table.</p>
          </div>
        </div>
        <div className="data-table-wrap overflow-x-auto rounded-2xl border border-border/60 bg-background/80">
          <table className="data-table min-w-[720px]">
            <thead>
              <tr>
                {[
                  { key: 'name', label: 'Event' },
                  { key: 'category', label: 'Category' },
                  { key: 'attendees', label: 'Attendees' },
                  { key: 'capacity', label: 'Capacity' },
                  { key: 'revenue', label: 'Revenue' },
                ].map((column) => (
                  <th key={column.key} className="px-3 py-3 sm:px-4 sm:py-3.5">
                    <button className="flex items-center gap-2" onClick={() => { setSortKey(column.key as 'name' | 'category' | 'attendees' | 'capacity' | 'revenue'); setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc'); }}>
                      {column.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((event) => (
                <tr key={event.id} className="cursor-pointer" onClick={() => setSelectedFilter(event.name)}>
                  <td className="px-3 py-3 font-semibold sm:px-4 sm:py-4">{event.name}</td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4">{event.category}</td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4">{event.attendees}</td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4">{event.capacity}</td>
                  <td className="px-3 py-3 sm:px-4 sm:py-4">EGP {event.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-panel rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-6">
        <h3 className="text-h3 font-bold text-foreground mb-4 sm:mb-6">Post-event Feedback</h3>
        <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
          <div className="kpi-card rounded-3xl border border-border/60 bg-background/80 p-4 shadow-sm sm:p-6">
            <div className="kpi-value text-orange-500 mb-2">{(MockFeedback.reduce((sum, f) => sum + f.rating, 0) / MockFeedback.length).toFixed(1)}</div>
            <div className="flex items-center justify-center gap-1">{renderStars(Math.round(MockFeedback.reduce((sum, f) => sum + f.rating, 0) / MockFeedback.length))}</div>
            <p className="text-body-sm text-muted-foreground mt-2">Average Rating</p>
          </div>
          <div className="min-w-0">
            <h4 className="text-body-sm font-semibold text-foreground mb-3">Sentiment Breakdown</h4>
            <div className="space-y-3">
              {[
                { label: 'Positive', value: 65, color: 'bg-green-500' },
                { label: 'Neutral', value: 25, color: 'bg-orange-500' },
                { label: 'Negative', value: 10, color: 'bg-red-500' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="mb-1 flex items-center justify-between"><span className="text-body-sm font-medium text-foreground">{item.label}</span><span className="text-body-sm font-bold text-foreground">{item.value}%</span></div>
                  <div className="h-3 overflow-hidden rounded-full bg-secondary"><div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {MockFeedback.slice(0, 3).map((review) => (
            <div key={review.id} className="activity-item rounded-2xl border border-border/60 bg-background/80 p-4">
              <div className="mb-3 flex w-full items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="font-semibold text-foreground">{review.name}</span><span className="text-caption text-muted-foreground">{review.date}</span></div><div className="flex items-center gap-1">{renderStars(review.rating)}</div></div>
              <p className="text-body-sm text-muted-foreground line-clamp-2">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

