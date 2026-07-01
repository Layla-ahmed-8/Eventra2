
import React, { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, AlertTriangle, ArrowUp, CheckCircle, ChevronDown, ChevronUp, Clock, Filter, Search, Star, TrendingUp, Users, X } from 'lucide-react';

const ADMIN_COLORS = ['#7C5CFF', '#00D4FF', '#FF9B3D', '#22C55E', '#EF4444'];

const MockOrganizers = [
  { id: '1', name: 'Nile Events', category: 'Tech', eventsHosted: 12, avgAttendance: 85, avgRating: 4.8, revenue: 1200000, cancellationRate: 5 },
  { id: '2', name: 'Cairo Music', category: 'Music', eventsHosted: 25, avgAttendance: 90, avgRating: 4.6, revenue: 2500000, cancellationRate: 8 },
  { id: '3', name: 'Tech Summit EG', category: 'Tech', eventsHosted: 8, avgAttendance: 95, avgRating: 4.9, revenue: 1800000, cancellationRate: 3 },
  { id: '4', name: 'Alexandria Arts', category: 'Culture', eventsHosted: 15, avgAttendance: 75, avgRating: 4.5, revenue: 900000, cancellationRate: 10 },
  { id: '5', name: 'Giza Sports', category: 'Sports', eventsHosted: 10, avgAttendance: 88, avgRating: 4.7, revenue: 1100000, cancellationRate: 6 },
];

const MockCategoryTrends = [
  { month: 'Jan', Tech: 12, Art: 8, Music: 20, Sports: 10, Business: 5, Workshop: 4 },
  { month: 'Feb', Tech: 15, Art: 10, Music: 25, Sports: 12, Business: 6, Workshop: 5 },
  { month: 'Mar', Tech: 18, Art: 12, Music: 22, Sports: 15, Business: 8, Workshop: 6 },
  { month: 'Apr', Tech: 20, Art: 15, Music: 28, Sports: 18, Business: 10, Workshop: 8 },
  { month: 'May', Tech: 25, Art: 18, Music: 30, Sports: 20, Business: 12, Workshop: 10 },
  { month: 'Jun', Tech: 28, Art: 20, Music: 32, Sports: 22, Business: 15, Workshop: 12 },
];

const MockRetentionCohorts = [
  { cohort: 'Week 1', W0: 100, W1: 75, W2: 60, W3: 50, W4: 45, W5: 40 },
  { cohort: 'Week 2', W0: 100, W1: 72, W2: 58, W3: 48, W4: 42, W5: 38 },
  { cohort: 'Week 3', W0: 100, W1: 78, W2: 65, W3: 55, W4: 50, W5: 45 },
  { cohort: 'Week 4', W0: 100, W1: 70, W2: 55, W3: 45, W4: 40, W5: 35 },
  { cohort: 'Week 5', W0: 100, W1: 80, W2: 68, W3: 58, W4: 52, W5: 48 },
  { cohort: 'Week 6', W0: 100, W1: 85, W2: 72, W3: 65, W4: 60, W5: 55 },
];

const MockRejectionReasons = [
  { name: 'Incomplete Info', count: 45 },
  { name: 'Policy Violation', count: 25 },
  { name: 'Duplicate Event', count: 15 },
  { name: 'Low Quality', count: 10 },
  { name: 'Other', count: 5 },
];

const MockAdminTimeSeries = [
  { month: 'Jan', users: 1200, revenue: 50000 },
  { month: 'Feb', users: 1400, revenue: 60000 },
  { month: 'Mar', users: 1600, revenue: 75000 },
  { month: 'Apr', users: 1900, revenue: 85000 },
  { month: 'May', users: 2200, revenue: 100000 },
  { month: 'Jun', users: 2500, revenue: 120000 },
];

const MockAnomalies = [
  { id: '1', type: 'high_cancellation', organizer: 'Alexandria Arts', message: 'Cancellation rate > 30%', icon: AlertTriangle },
  { id: '2', type: 'low_bookings', event: 'Desert Safari', message: '0 bookings within 48h of start', icon: AlertTriangle },
  { id: '3', type: 'pending_review', count: 5, message: 'Events pending review >24h', icon: Clock },
];

const AdminCardSkeleton = () => <div className="skeleton h-32 rounded-xl" />;
const AdminChartSkeleton = ({ height = 300 }: { height?: number }) => <div className="skeleton rounded-xl" style={{ height: `${height}px` }} />;

export default function AdminAnalytics() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('90d');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [revenueFilter, setRevenueFilter] = useState<'all' | '250k' | '1M' | '2M'>('all');
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [loadingStates, setLoadingStates] = useState({ health: true, kpi1: true, kpi2: true, kpi3: true, chart1: true, chart2: true, chart3: true, chart4: true });

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

  const filteredOrganizers = useMemo(() => {
    return MockOrganizers.filter((organizer) => {
      const matchesSearch = !searchTerm || organizer.name.toLowerCase().includes(searchTerm.toLowerCase()) || organizer.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || organizer.category === categoryFilter;
      const matchesRevenue = revenueFilter === 'all' ? true : organizer.revenue >= Number(revenueFilter.replace('k', '000').replace('M', '000000'));
      const matchesFlag = !showFlaggedOnly || organizer.cancellationRate > 8 || organizer.avgAttendance < 80;
      return matchesSearch && matchesCategory && matchesRevenue && matchesFlag;
    });
  }, [categoryFilter, revenueFilter, searchTerm, showFlaggedOnly]);

  const sortedOrganizers = useMemo(() => [...filteredOrganizers].sort((a, b) => {
    const aVal = a[sortBy as keyof typeof a];
    const bVal = b[sortBy as keyof typeof b];
    if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  }), [filteredOrganizers, sortBy, sortOrder]);

  const healthScore = useMemo(() => {
    if (!filteredOrganizers.length) return 0;
    const avgAttendance = filteredOrganizers.reduce((sum, organizer) => sum + organizer.avgAttendance, 0) / filteredOrganizers.length;
    const avgRating = filteredOrganizers.reduce((sum, organizer) => sum + organizer.avgRating, 0) / filteredOrganizers.length;
    const approval = Math.max(0, 100 - filteredOrganizers.reduce((sum, organizer) => sum + organizer.cancellationRate, 0) / filteredOrganizers.length);
    const score = (avgAttendance / 100) * 30 + (avgRating / 5) * 25 + (approval / 100) * 25 + (filteredOrganizers.length / MockOrganizers.length) * 20;
    return Math.min(100, Math.max(0, Math.round(score * 100)));
  }, [filteredOrganizers]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const activeFilters = [searchTerm && `Search: ${searchTerm}`, categoryFilter && `Category: ${categoryFilter}`, revenueFilter !== 'all' && `Revenue ≥ ${revenueFilter}`, showFlaggedOnly && 'Flagged only'].filter(Boolean) as string[];

  const FilterChip = () => {
    if (!selectedFilter && !activeFilters.length) return null;
    return (
      <div className="flex flex-wrap items-center gap-2">
        {selectedFilter && (
          <div className="flex items-center gap-2 status-pill status-pill--danger px-4 py-2 text-body-sm font-semibold">
            <Filter className="w-4 h-4" />
            {selectedFilter}
            <button onClick={() => setSelectedFilter(null)} className="ml-1 hover:opacity-70 rounded-full p-0.5"><X className="w-4 h-4" /></button>
          </div>
        )}
        {activeFilters.map((filter) => (
          <div key={filter} className="flex items-center gap-2 status-pill status-pill--danger px-4 py-2 text-body-sm font-semibold">
            <Filter className="w-4 h-4" />
            {filter}
          </div>
        ))}
      </div>
    );
  };

  const renderStars = (rating: number) => Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />);

  return (
    <div className="dashboard-page--admin flex w-full min-w-0 flex-col gap-4 sm:gap-6">
      <div className="mb-2 flex flex-col gap-4 sm:mb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="dashboard-role-badge mb-3">Administrator</span>
          <h1 className="text-h1 text-foreground">Admin Dashboard</h1>
          <p className="text-body-sm text-muted-foreground">Platform-wide analytics and insights</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <span className="live-indicator"><span className="live-dot" /> Data as of {lastUpdated}</span>
        </div>
      </div>

      <div className="rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-body-sm font-semibold text-foreground">Advanced filters</h3>
            <p className="text-caption text-muted-foreground">Refine the leaderboard and risk views without losing context.</p>
          </div>
          <span className="text-caption text-muted-foreground">Showing {filteredOrganizers.length} of {MockOrganizers.length} organizers</span>
        </div>
        <div className="flex flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-center">
          <div className="flex w-full min-w-0 items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-2 xl:min-w-[220px] xl:max-w-[280px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search organizers" className="w-full border-0 bg-transparent text-sm outline-none" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="input-base h-10 w-full text-body-sm xl:min-w-[150px] xl:max-w-[180px]">
            <option value="">All segments</option>
            {[...new Set(MockOrganizers.map((organizer) => organizer.category))].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={revenueFilter} onChange={(e) => setRevenueFilter(e.target.value as 'all' | '250k' | '1M' | '2M')} className="input-base h-10 w-full text-body-sm xl:min-w-[150px] xl:max-w-[180px]">
            <option value="all">Any revenue</option>
            <option value="250k">EGP 250k+</option>
            <option value="1M">EGP 1M+</option>
            <option value="2M">EGP 2M+</option>
          </select>
          <label className="flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={showFlaggedOnly} onChange={() => setShowFlaggedOnly((prev) => !prev)} />
            Flagged only
          </label>
          <div className="period-tabs flex flex-wrap gap-1 p-1">
            {['7d', '30d', '90d', 'all'].map((p) => (
              <button key={p} onClick={() => setPeriod(p as '7d' | '30d' | '90d' | 'all')} className={`period-tab ${period === p ? 'period-tab--active' : ''}`}>
                {p.toUpperCase()}
              </button>
            ))}
          </div>
          {(searchTerm || categoryFilter || revenueFilter !== 'all' || showFlaggedOnly) && <button onClick={() => { setSearchTerm(''); setCategoryFilter(''); setRevenueFilter('all'); setShowFlaggedOnly(false); }} className="btn-ghost w-full text-body-sm sm:w-auto">Reset</button>}
        </div>
      </div>

      <FilterChip />

      <div className="rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-6 lg:p-8">
        {loadingStates.health ? <div className="skeleton h-64 rounded-xl" /> : (
          <div className="flex flex-col items-center gap-6 xl:flex-row xl:gap-8">
            <div className="w-full flex-1 min-w-0">
              <h2 className="text-h2 text-foreground mb-2">Platform Health Score</h2>
              <p className="text-body-sm text-muted-foreground mb-4 sm:mb-6">Composite score of platform health metrics</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
                {[
                  { label: 'DAU/MAU Ratio', value: '45%', weight: '30%' },
                  { label: 'Booking Conversion', value: '32%', weight: '25%' },
                  { label: 'Avg Event Rating', value: '4.4/5', weight: '25%' },
                  { label: 'Organizer Approval', value: '88%', weight: '20%' },
                ].map((item, i) => (
                  <div key={i} className="dashboard-stat-item flex min-h-[6.5rem] flex-col justify-center gap-2 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm sm:p-6">
                    <p className="dashboard-stat-label">{item.label}</p>
                    <p className="dashboard-stat-value">{item.value}</p>
                    <p className="dashboard-stat-hint">Weight: {item.weight}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-56 w-full max-w-[16rem] sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ value: healthScore }]} startAngle={180} endAngle={0}>
                  <RadialBar background dataKey="value" cornerRadius={10} fill="url(#healthGradient)" />
                  <defs>
                    <linearGradient id="healthGradient" x1="0" y1="0" x2="100%" y2="0%">
                      {healthScore >= 70 ? <><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#059669" /></> : healthScore >= 40 ? <><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#d97706" /></> : <><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#dc2626" /></>}
                    </linearGradient>
                  </defs>
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-h1 font-black text-foreground">{healthScore}</p>
                <p className="text-caption text-muted-foreground">out of 100</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
        <div className="space-y-4 sm:space-y-6 xl:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
            {[
              { label: 'Total Users', value: '2,547', change: 12, icon: Users, iconClass: 'icon-box-primary', loadingKey: 'kpi1' as const },
              { label: 'Total Revenue', value: 'EGP 4,900,000', change: 18, icon: TrendingUp, iconClass: 'icon-box-green', loadingKey: 'kpi2' as const },
              { label: 'Events Hosted', value: '128', change: 22, icon: Activity, iconClass: 'icon-box-cyan', loadingKey: 'kpi3' as const },
            ].map((kpi, index) => (
              <div key={index} className="kpi-card h-full rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">
                {loadingStates[kpi.loadingKey] ? <AdminCardSkeleton /> : (
                  <>
                    <div className="flex items-center justify-between"><span className="kpi-label">{kpi.label}</span><div className={`icon-box ${kpi.iconClass}`}><kpi.icon className="w-5 h-5" /></div></div>
                    <p className="kpi-value">{kpi.value}</p>
                    <div className="kpi-trend text-green-600"><ArrowUp className="w-4 h-4" /><span>+{kpi.change}% vs previous period</span></div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="chart-panel rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-6">
            <h3 className="text-h3 font-bold text-foreground mb-4 sm:mb-6">User Growth & Revenue</h3>
            {loadingStates.chart1 ? <AdminChartSkeleton height={300} /> : (
              <ResponsiveContainer width="100%" height={300}><LineChart data={MockAdminTimeSeries}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" /><YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#6b7280" /><YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#6b7280" /><Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#1f2937' }} /><Legend /><Line yAxisId="left" type="monotone" dataKey="users" stroke="#7C5CFF" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Total Users" /><Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#00D4FF" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Revenue (EGP)" /></LineChart></ResponsiveContainer>
            )}
          </div>

          <div className="chart-panel rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-6">
            <h3 className="text-h3 font-bold text-foreground mb-4 sm:mb-6">Category Trends</h3>
            {loadingStates.chart2 ? <AdminChartSkeleton height={300} /> : (
              <ResponsiveContainer width="100%" height={300}><LineChart data={MockCategoryTrends}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" /><YAxis tick={{ fontSize: 12 }} stroke="#6b7280" /><Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#1f2937' }} /><Legend />{['Tech', 'Art', 'Music', 'Sports', 'Business'].map((category, index) => <Line key={category} type="monotone" dataKey={category} stroke={ADMIN_COLORS[index % ADMIN_COLORS.length]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} onClick={() => setSelectedFilter(category)} />)}</LineChart></ResponsiveContainer>
            )}
          </div>

          <div className="chart-panel rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-6">
            <h3 className="text-h3 font-bold text-foreground mb-4 sm:mb-6">Organizer Performance Leaderboard</h3>
            <div className="data-table-wrap overflow-x-auto rounded-2xl border border-border/60 bg-background/80">
              <table className="data-table min-w-[640px] sm:min-w-[800px]">
                <thead>
                  <tr>
                    {[
                      { key: 'rank', label: 'Rank', sortable: false },
                      { key: 'name', label: 'Organizer Name', sortable: true },
                      { key: 'eventsHosted', label: 'Events Hosted', sortable: true },
                      { key: 'avgAttendance', label: 'Avg Attendance', sortable: true },
                      { key: 'avgRating', label: 'Avg Rating', sortable: true },
                      { key: 'revenue', label: 'Revenue Generated', sortable: true },
                      { key: 'cancellationRate', label: 'Cancellation Rate', sortable: true },
                    ].map((col) => (
                      <th key={col.key} className="whitespace-nowrap px-3 py-3 sm:px-4 sm:py-3.5">
                        {col.sortable ? <button onClick={() => handleSort(col.key)} className="flex items-center gap-2">{col.label}{sortBy === col.key && (sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}</button> : col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedOrganizers.map((org, index) => (
                    <tr key={org.id} className="cursor-pointer" onClick={() => setSelectedFilter(org.name)}>
                      <td className="px-3 py-3 font-semibold sm:px-4 sm:py-4">#{index + 1}</td>
                      <td className="px-3 py-3 font-medium sm:px-4 sm:py-4">{org.name}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4">{org.eventsHosted}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4">{org.avgAttendance}%</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4">{renderStars(org.avgRating)}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4">EGP {org.revenue.toLocaleString()}</td>
                      <td className="px-3 py-3 sm:px-4 sm:py-4"><span className={`font-semibold ${org.cancellationRate > 10 ? 'text-red-500' : 'text-green-600'}`}>{org.cancellationRate}%</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="chart-panel overflow-hidden rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-6">
            <h3 className="text-h3 font-bold text-foreground mb-4 sm:mb-6">Event Approval Funnel</h3>
            <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-3 sm:gap-4">
              <div className="dashboard-stat-item flex flex-col items-center justify-center gap-1 p-4 text-center sm:p-6"><p className="dashboard-stat-value">12</p><p className="dashboard-stat-hint">Avg Approval (hrs)</p></div>
              <div className="dashboard-stat-item flex flex-col items-center justify-center gap-1 p-4 text-center sm:p-6"><p className="dashboard-stat-value">88%</p><p className="dashboard-stat-hint">Approval Rate</p></div>
              <div className="dashboard-stat-item flex flex-col items-center justify-center gap-1 p-4 text-center sm:p-6"><p className="dashboard-stat-value text-base">Incomplete Info</p><p className="dashboard-stat-hint">Top Rejection</p></div>
            </div>
            <ResponsiveContainer width="100%" height={200}><BarChart data={MockRejectionReasons} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis type="number" tick={{ fontSize: 12 }} stroke="#6b7280" /><YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} stroke="#6b7280" /><Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#1f2937' }} /><Bar dataKey="count" fill="#7C5CFF" /></BarChart></ResponsiveContainer>
          </div>

          <div className="chart-panel overflow-hidden rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-6">
            <h3 className="text-h3 font-bold text-foreground mb-4 sm:mb-6">Needs Attention</h3>
            {MockAnomalies.length === 0 ? <div className="py-12 text-center"><CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" /><p className="text-h3 font-semibold text-green-600">All systems healthy</p></div> : <div className="space-y-4">{MockAnomalies.map((anomaly) => <div key={anomaly.id} className="pending-action-card flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"><div className="flex flex-1 items-start gap-3"><div className="icon-box icon-box-red"><anomaly.icon className="w-5 h-5" /></div><div className="flex-1"><p className="font-semibold text-foreground">{anomaly.message}</p><p className="mt-1 text-body-sm text-muted-foreground">{anomaly.organizer && `Organizer: ${anomaly.organizer}`}{anomaly.event && `Event: ${anomaly.event}`}{anomaly.count && `Count: ${anomaly.count}`}</p></div></div><button className="btn-destructive px-4 py-2 text-body-sm">Review</button></div>)}</div>}
          </div>

          <div className="chart-panel overflow-hidden rounded-3xl border border-border/60 bg-background/90 p-4 shadow-sm sm:p-6">
            <h3 className="text-h3 font-bold text-foreground mb-4 sm:mb-6">Cohort Retention</h3>
            <div className="data-table-wrap overflow-x-auto rounded-2xl border border-border/60 bg-background/80">
              <table className="data-table min-w-[480px]">
                <thead>
                  <tr>
                    <th className="px-3 py-3 sm:px-4 sm:py-3.5">Cohort</th>
                    {['W0', 'W1', 'W2', 'W3', 'W4', 'W5'].map((week) => <th key={week} className="px-2 py-3 text-center sm:px-3 sm:py-3.5">{week}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {MockRetentionCohorts.map((cohort) => (
                    <tr key={cohort.cohort}>
                      <td className="px-3 py-3 font-semibold sm:px-4 sm:py-3">{cohort.cohort}</td>
                      {['W0', 'W1', 'W2', 'W3', 'W4', 'W5'].map((week) => {
                        const val = cohort[week as keyof typeof cohort];
                        const opacity = Math.max(0.1, val / 100);
                        return <td key={week} className="px-1 py-2 text-center sm:px-2 sm:py-3"><div className="rounded-lg px-1 py-2 text-xs font-semibold sm:text-sm" style={{ backgroundColor: `rgba(124, 92, 255, ${opacity})`, color: val > 70 ? '#fff' : 'var(--foreground)' }}>{val}%</div></td>;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

