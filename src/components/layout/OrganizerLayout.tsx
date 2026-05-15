import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Plus, BarChart3, MessageSquare, Settings, ChevronLeft, Menu, X, Moon, Sun, Crown, LogOut } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';
import Logo from '../Logo';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, theme, toggleTheme, logout } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/organizer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/organizer/events', icon: Calendar, label: 'My Events' },
    { path: '/organizer/events/create', icon: Plus, label: 'Create Event' },
    { path: '/organizer/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/organizer/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/organizer/profile', icon: Crown, label: 'My Profile' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col bg-sidebar backdrop-blur-xl border-r border-sidebar-border transition-all duration-300 relative z-30 ${
          sidebarOpen ? 'w-72' : 'w-24'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-sidebar-border/50">
          {sidebarOpen ? (
            <Link to="/organizer/dashboard" className="flex items-center min-w-0 animate-in fade-in duration-500">
              <Logo variant="horizontal" className="h-8 w-auto" />
            </Link>
          ) : (
            <Link to="/organizer/dashboard" className="flex items-center justify-center w-full animate-in zoom-in duration-500">
              <Logo variant="small" className="h-10 w-auto" />
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 translate-x-1'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-1'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                {sidebarOpen && <span className="font-bold text-body-sm tracking-wide">{item.label}</span>}
                {!sidebarOpen && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-sidebar-accent border border-sidebar-border text-sidebar-foreground text-caption font-bold rounded-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                    {item.label}
                  </div>
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full ml-1" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 space-y-4 border-t border-sidebar-border/50 bg-sidebar/50">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 h-12 rounded-2xl bg-sidebar-accent flex items-center justify-center border border-sidebar-border/50 hover:bg-sidebar-accent/80 transition-all active:scale-95 group"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-sidebar-foreground group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-sidebar-foreground group-hover:-rotate-12 transition-transform" />
              )}
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-12 h-12 rounded-2xl bg-sidebar-accent flex items-center justify-center border border-sidebar-border/50 hover:bg-sidebar-accent/80 transition-all active:scale-95"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <ChevronLeft className={`w-5 h-5 text-sidebar-foreground transition-transform duration-500 ${!sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <Link
            to="/organizer/profile"
            className={`flex items-center gap-3 p-3 rounded-2xl hover:bg-sidebar-accent transition-all group ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=33'}
                alt={currentUser?.name}
                className="w-11 h-11 rounded-xl ring-2 ring-cyan-500/20 group-hover:ring-cyan-500/40 transition-all object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
                <Crown className="w-3 h-3 text-white" />
              </div>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-body-sm font-bold text-sidebar-foreground truncate">{currentUser?.name}</p>
                <p className="text-micro font-bold text-muted-foreground uppercase tracking-widest">Organizer</p>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all group ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            {sidebarOpen && <span className="text-body-sm font-bold">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-night-0/80 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)}></div>
          <aside className="absolute left-0 top-0 bottom-0 w-80 bg-sidebar shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="h-20 flex items-center justify-between px-6 border-b border-sidebar-border/50">
              <Logo variant="horizontal" className="h-7 w-auto" />
              <button onClick={() => setMobileMenuOpen(false)} className="w-10 h-10 rounded-xl bg-sidebar-accent flex items-center justify-center text-sidebar-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-2 pb-20 overflow-y-auto max-h-[calc(100vh-200px)]">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                      isActive
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-bold text-body tracking-wide">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-sidebar-border/50 bg-sidebar/95 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=33'}
                  alt={currentUser?.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-cyan-500/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-body font-bold text-sidebar-foreground truncate">{currentUser?.name}</p>
                  <p className="text-caption font-bold text-muted-foreground uppercase tracking-widest">Organizer</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={toggleTheme}
                  className="flex-1 h-12 rounded-xl bg-sidebar-accent flex items-center justify-center border border-sidebar-border/50"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="flex-[2] h-12 rounded-xl bg-red-500/10 text-red-500 font-bold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
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
        <div className="lg:hidden h-16 bg-sidebar/80 backdrop-blur-md border-b border-sidebar-border/50 flex items-center justify-between px-4 sticky top-0 z-40">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-11 h-11 rounded-xl bg-sidebar-accent flex items-center justify-center text-sidebar-foreground border border-sidebar-border/50"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Logo variant="horizontal" className="h-6 w-auto" />
          <Link to="/organizer/profile">
            <img
              src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=33'}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-cyan-500/20"
            />
          </Link>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 xl:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}
