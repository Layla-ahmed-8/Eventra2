import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Plus, BarChart3, MessageSquare, Settings, ChevronLeft, Menu, X, Moon, Sun, Crown } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useState } from 'react';
import Logo from '../Logo';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { currentUser, theme, toggleTheme } = useAppStore();
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
        className={`hidden lg:flex flex-col bg-sidebar backdrop-blur-xl border-r border-sidebar-border transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-[52px] flex items-center justify-between px-4 border-b border-sidebar-border">
          {sidebarOpen && (
            <Link to="/organizer/dashboard" className="flex items-center">
              <Logo variant="horizontal" className="h-8 w-auto" />
            </Link>
          )}
          {!sidebarOpen && (
            <Link to="/organizer/dashboard" className="flex items-center justify-center w-full">
              <Logo variant="small" className="h-8 w-auto" />
            </Link>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-sidebar-accent rounded-lg transition"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-sidebar-foreground" /> : <Moon className="w-5 h-5 text-sidebar-foreground" />}
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-sidebar-accent rounded-lg transition"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <ChevronLeft className={`w-5 h-5 text-sidebar-foreground transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#6C4CF1]/10 via-[#C084FC]/08 to-[#C084FC]/06 text-[#6C4CF1] font-semibold border-l-2 border-[#6C4CF1]'
                    : 'text-sidebar-foreground hover:bg-[#6C4CF1]/8 hover:text-[#6C4CF1]'
                }`}
                title={!sidebarOpen ? item.label : ''}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
                {!sidebarOpen && isActive && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-primary text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border">
          <Link
            to="/organizer/profile"
            className={`flex items-center gap-3 p-3 rounded-xl hover:bg-sidebar-accent transition ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=33'}
                alt={currentUser?.name}
                className="w-10 h-10 rounded-full ring-2 ring-primary/20"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">{currentUser?.name}</p>
                <p className="text-xs text-muted-foreground">Organizer</p>
              </div>
            )}
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-sidebar shadow-2xl">
            <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
              <Link to="/organizer/dashboard" className="flex items-center">
                <Logo variant="horizontal" className="h-8 w-auto" />
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-sidebar-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      isActive
                        ? 'bg-gradient-to-r from-[#6C4CF1] to-[#5739D4] text-white'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile User Profile */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar">
              <Link
                to="/organizer/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-sidebar-accent transition"
              >
                <div className="relative">
                  <img
                    src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=33'}
                    alt={currentUser?.name}
                    className="w-10 h-10 rounded-full ring-2 ring-primary/20"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-sidebar-foreground">{currentUser?.name}</p>
                  <p className="text-xs text-muted-foreground">Organizer</p>
                </div>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar - Mobile */}
        <div className="lg:hidden h-[52px] bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-sidebar-foreground">
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Logo variant="horizontal" className="h-7 w-auto" />
          </div>
          <Link to="/organizer/profile">
            <img
              src={currentUser?.avatar || 'https://i.pravatar.cc/150?img=33'}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full"
            />
          </Link>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6 xl:px-8">{children}</main>
      </div>
    </div>
  );
}
