import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Calendar, Plus, MessageSquare, ChevronLeft, Menu, X, Moon, Sun, Crown, LogOut, Wallet, Bell } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';
import AIChatbot from '../business/AIChatbot';
import Logo from '../Logo';
import MobileBottomNav from './MobileBottomNav';
import WalletBalanceBadge from '../business/WalletBalanceBadge';
import { useBreadcrumbs } from '../../hooks/useBreadcrumbs';
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator,
} from '../../app/components/ui/breadcrumb';

// Treat some nav items as exact-only (do not highlight for child routes)
// Some child routes should NOT highlight their parent nav item.
const excludedChildPathsForParent: Record<string, string[]> = {
  '/organizer/events': ['/organizer/events/create'],
};

const isOrganizerNavActive = (pathname: string, path: string) => {
  if (pathname === path) return true;
  const excluded = excludedChildPathsForParent[path];
  if (excluded && excluded.some((p) => pathname.startsWith(p))) return false;
  return pathname.startsWith(`${path}/`);
};

const bottomNavItems = [
  { icon: BarChart3, label: 'Analytics', path: '/organizer/analytics' },
  { icon: Calendar, label: 'My Events', path: '/organizer/events' },
  { icon: MessageSquare, label: 'Messages', path: '/organizer/messages' },
  { icon: Wallet, label: 'Wallet', path: '/organizer/wallet' },
  { icon: Crown, label: 'Profile', path: '/organizer/profile' },
];

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, theme, toggleTheme, logout, notifications } = useAppStore();
  const unreadCount = notifications.filter((n) => n.userId === currentUser?.id && !n.isRead).length;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const crumbs = useBreadcrumbs();

  const navItems = [
    { path: '/organizer/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/organizer/events', icon: Calendar, label: 'My Events' },
    { path: '/organizer/events/create', icon: Plus, label: 'Create Event' },
    { path: '/organizer/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/organizer/notifications', icon: Bell, label: 'Notifications' },
    { path: '/organizer/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/organizer/profile', icon: Crown, label: 'My Profile' },
  ];

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-r border-purple-100/70 dark:border-slate-800/70 transition-all duration-500 relative z-30 shadow-xl shadow-purple-900/5 dark:shadow-black/40 ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-24 flex items-center justify-between px-6 border-b border-purple-100/50 dark:border-slate-800/50 bg-gradient-to-r from-white/80 to-purple-50/50 dark:from-slate-900/80 dark:to-purple-950/20">
          {sidebarOpen ? (
            <Link to="/organizer/analytics" className="flex items-center min-w-0 animate-in fade-in duration-700">
              <Logo variant="horizontal" className="h-9 w-auto" />
            </Link>
          ) : (
            <Link to="/organizer/analytics" className="flex items-center justify-center w-full animate-in zoom-in duration-700">
              <Logo variant="small" className="h-11 w-auto" />
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 py-8 space-y-3 overflow-y-auto custom-scrollbar">
          {navItems.map((item, index) => {
            const isActive = isOrganizerNavActive(location.pathname, item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group hover:scale-[1.02] ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 translate-x-1'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r from-cyan-50/50 to-blue-50/50 dark:hover:bg-cyan-900/20 hover:translate-x-1'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <item.icon className={`w-6 h-6 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                {sidebarOpen && (
                  <span className="font-bold text-base tracking-wide flex-1">{item.label}</span>
                )}
                {sidebarOpen && item.path === '/organizer/notifications' && unreadCount > 0 && (
                  <span className="ml-auto min-w-[22px] h-5.5 px-2 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-4 px-4 py-2.5 bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold rounded-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 z-50 shadow-2xl">
                    {item.label}
                  </div>
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-full ml-1.5 shadow-md" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-5 space-y-4 border-t border-purple-100/50 dark:border-slate-800/50 bg-gradient-to-t from-purple-50/40 to-white/80 dark:from-purple-950/20 dark:to-slate-900/80">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex-1 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-purple-100 dark:from-slate-800 dark:to-purple-900/30 flex items-center justify-center border border-purple-200/60 dark:border-purple-800/40 hover:scale-[1.02] transition-all active:scale-[0.98] group shadow-sm"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />
              ) : (
                <Moon className="w-6 h-6 text-slate-700 dark:text-slate-300 group-hover:-rotate-12 transition-transform" />
              )}
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-purple-100 dark:from-slate-800 dark:to-purple-900/30 flex items-center justify-center border border-purple-200/60 dark:border-purple-800/40 hover:scale-[1.02] transition-all active:scale-[0.98] shadow-sm"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <ChevronLeft className={`w-6 h-6 text-slate-700 dark:text-slate-300 transition-transform duration-500 ${!sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <Link
            to="/organizer/profile"
            className={`flex items-center gap-4 p-4 rounded-2xl hover:bg-gradient-to-r from-cyan-50/60 to-purple-50/60 dark:hover:bg-cyan-900/20 transition-all group ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=33'}
                alt={currentUser?.name}
                className="w-14 h-14 rounded-2xl ring-4 ring-cyan-400/20 dark:ring-cyan-500/20 group-hover:ring-cyan-400/40 dark:group-hover:ring-cyan-500/40 transition-all object-cover"
              />
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-cyan-500/30">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-slate-900 dark:text-white truncate">{currentUser?.name}</p>
                <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Organizer</p>
                <WalletBalanceBadge colorClass="text-cyan-600 dark:text-cyan-400" />
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-gradient-to-r from-red-500/10 to-orange-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all group ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-6 h-6 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
            {sidebarOpen && <span className="text-base font-bold">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)}></div>
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-slate-900 shadow-2xl animate-in slide-in-from-left duration-500">
            <div className="h-24 flex items-center justify-between px-7 border-b border-purple-100/60 dark:border-slate-800/60 bg-gradient-to-r from-white to-purple-50 dark:from-slate-900 dark:to-purple-950/20">
              <Logo variant="horizontal" className="h-8 w-auto" />
              <button onClick={() => setMobileMenuOpen(false)} className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:scale-105 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-5 space-y-3 pb-24 overflow-y-auto max-h-[calc(100vh-240px)]">
              {navItems.map((item, index) => {
                const isActive = isOrganizerNavActive(location.pathname, item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.01] ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r from-cyan-50/60 to-purple-50/60 dark:hover:bg-cyan-900/20'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="font-bold text-lg tracking-wide">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-7 border-t border-purple-100/60 dark:border-slate-800/60 bg-gradient-to-t from-purple-50/60 to-white/80 dark:from-purple-950/20 dark:to-slate-900/80 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=33'}
                  alt={currentUser?.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-4 ring-cyan-400/20 dark:ring-cyan-500/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-slate-900 dark:text-white truncate">{currentUser?.name}</p>
                  <p className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Organizer</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={toggleTheme}
                  className="flex-1 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-purple-200/50 dark:border-slate-700"
                >
                  {theme === 'dark' ? <Sun className="w-6 h-6 text-amber-400" /> : <Moon className="w-6 h-6 text-slate-700" />}
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="flex-[2] h-14 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-black flex items-center justify-center gap-3 shadow-lg shadow-red-500/20 hover:scale-[1.02] transition-transform"
                >
                  <LogOut className="w-6 h-6" />
                  Sign Out
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Bar - Mobile */}
        <div className="lg:hidden h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-purple-100/60 dark:border-slate-800/60 flex items-center justify-between px-6 sticky top-0 z-40 shadow-lg shadow-purple-900/5 dark:shadow-black/30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-purple-100 dark:from-slate-800 dark:to-purple-900/30 flex items-center justify-center text-slate-700 dark:text-slate-300 border border-purple-200/60 dark:border-slate-700 hover:scale-105 transition-transform"
          >
            <Menu className="w-7 h-7" />
          </button>
          <Logo variant="horizontal" className="h-7 w-auto" />
          <div className="flex items-center gap-3">
            <Link to="/organizer/notifications" className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-purple-100 dark:from-slate-800 dark:to-purple-900/30 flex items-center justify-center border border-purple-200/60 dark:border-slate-700 hover:scale-105 transition-transform">
              <Bell className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none shadow-lg shadow-red-500/30">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <Link to="/organizer/profile">
              <img
                src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=33'}
                alt={currentUser?.name}
                className="w-12 h-12 rounded-2xl object-cover ring-4 ring-cyan-400/20 dark:ring-cyan-500/20 hover:scale-105 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <main id="main-content" className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-28 lg:pb-12 lg:p-10 xl:p-14">
          {crumbs.length > 0 && (
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                {crumbs.map((crumb, i) => (
                  <span key={i} className="inline-flex items-center gap-2">
                    <BreadcrumbItem>
                      {crumb.path
                        ? <BreadcrumbLink asChild><Link to={crumb.path} className="text-sm font-semibold">{crumb.label}</Link></BreadcrumbLink>
                        : <BreadcrumbPage className="text-sm font-bold">{crumb.label}</BreadcrumbPage>
                      }
                    </BreadcrumbItem>
                    {i < crumbs.length - 1 && <BreadcrumbSeparator />}
                  </span>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
          <div className="animate-in fade-in duration-500 slide-in-from-bottom-4">
            {children}
          </div>
        </main>
        <MobileBottomNav items={bottomNavItems} />
      </div>
    </div>
    <AIChatbot />
    </>
  );
}