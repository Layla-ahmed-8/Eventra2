import { useEffect } from 'react';
import { createBrowserRouter, createRoutesFromElements, Navigate, Outlet, Route, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAppStore } from '../store/useAppStore';
import SessionTimeoutWarning from '../components/business/SessionTimeoutWarning';
import PrivacyConsentModal from '../components/business/PrivacyConsentModal';
import ErrorBoundary from '../components/business/ErrorBoundary';
import OfflineBanner from '../components/business/OfflineBanner';
import KeyboardShortcutsModal from '../components/business/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

// Layouts
import AttendeeLayout from '../components/layout/AttendeeLayout';
import OrganizerLayout from '../components/layout/OrganizerLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Public Pages
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Signup from '../pages/public/Signup';
import Onboarding from '../pages/public/Onboarding';
import Register from '../pages/public/Register';
import PendingApproval from '../pages/public/PendingApproval';
import ForgotPassword from '../pages/public/ForgotPassword';
import ResetPassword from '../pages/public/ResetPassword';
import VerifyEmail from '../pages/public/VerifyEmail';
import AccountSuspended from '../pages/public/AccountSuspended';

// Attendee Pages
import Discover from '../pages/attendee/Discover';
import EventDetail from '../pages/attendee/EventDetail';
import RSVP from '../pages/attendee/RSVP';
import Calendar from '../pages/attendee/Calendar';
import MyEvents from '../pages/attendee/MyEvents';
import Community from '../pages/attendee/Community';
import CommunityDetail from '../pages/attendee/CommunityDetail';
import Profile from '../pages/attendee/Profile';
import Achievements from '../pages/attendee/Achievements';
import Notifications from '../pages/attendee/Notifications';
import Messages from '../pages/attendee/Messages';
import OrderSummary from '../pages/attendee/OrderSummary';
import RewardStore from '../pages/attendee/RewardStore';

// Organizer Pages
import OrganizerDashboard from '../pages/organizer/OrganizerDashboard';
import OrganizerEvents from '../pages/organizer/OrganizerEvents';
import CreateEvent from '../pages/organizer/CreateEvent';
import ManageEvent from '../pages/organizer/ManageEvent';
import OrganizerAnalytics from '../pages/organizer/OrganizerAnalytics';
import OrganizerMessages from '../pages/organizer/OrganizerMessages';
import OrganizerOnboarding from '../pages/organizer/OrganizerOnboarding';
import OrganizerProfile from '../pages/organizer/OrganizerProfile';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminEvents from '../pages/admin/AdminEvents';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCommunity from '../pages/admin/AdminCommunity';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminModeration from '../pages/admin/AdminModeration';
import AdminOnboarding from '../pages/admin/AdminOnboarding';
import AdminAuditLogs from '../pages/admin/AdminAuditLogs';

// ── Auth guard: redirect to login if not authenticated, or wrong role ────────
function RequireAuth({ children, role }: { children: React.ReactNode; role?: 'attendee' | 'organizer' | 'admin' }) {
  const { isAuthenticated, currentUser } = useAppStore();
  if (!isAuthenticated || !currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) {
    if (currentUser.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (currentUser.role === 'organizer') return <Navigate to="/organizer/dashboard" replace />;
    return <Navigate to="/app/discover" replace />;
  }
  return <>{children}</>;
}

// ── Redirect already-authenticated users away from public pages ──────────────
function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, currentUser } = useAppStore();
  if (isAuthenticated && currentUser) {
    if (currentUser.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (currentUser.role === 'organizer') return <Navigate to="/organizer/dashboard" replace />;
    return <Navigate to="/app/discover" replace />;
  }
  return <>{children}</>;
}

// ── Inner shell — must be rendered inside the router provider to use hooks ──
function AppShell() {
  const { activeModal, setActiveModal } = useAppStore();

  useKeyboardShortcuts({
    'ctrl+k': () => setActiveModal('ai-search'),
    'meta+k': () => setActiveModal('ai-search'),
    '?': () => setActiveModal('keyboard-shortcuts'),
  });

  return (
    <>
      <OfflineBanner />
      <Outlet />

      {/* Global modals — inside Router so they can use useNavigate */}
      <SessionTimeoutWarning />
      <PrivacyConsentModal />
      <KeyboardShortcutsModal
        open={activeModal === 'keyboard-shortcuts'}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<AppShell />}>
      {/* ── Public ── */}
      <Route index element={<Landing />} />
      <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
      <Route path="/register" element={<RedirectIfAuth><Register /></RedirectIfAuth>} />
      <Route path="/register/pending" element={<PendingApproval />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route path="/suspended" element={<AccountSuspended />} />
      <Route path="/signup" element={<Navigate to="/register" replace />} />
      <Route path="/onboarding" element={<Onboarding />} />

      {/* ── Attendee ── */}
      <Route path="/app" element={<Navigate to="/app/discover" replace />} />
      <Route path="/app/discover" element={<RequireAuth role="attendee"><AttendeeLayout><Discover /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/search" element={<Navigate to="/app/discover" replace />} />
      <Route path="/app/events/:id" element={<RequireAuth role="attendee"><AttendeeLayout><EventDetail /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/events/:id/rsvp" element={<RequireAuth role="attendee"><AttendeeLayout><RSVP /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/checkout/:id" element={<RequireAuth role="attendee"><AttendeeLayout><RSVP /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/calendar" element={<RequireAuth role="attendee"><AttendeeLayout><Calendar /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/my-events" element={<RequireAuth role="attendee"><AttendeeLayout><MyEvents /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/my-events/:bookingId/summary" element={<RequireAuth role="attendee"><AttendeeLayout><OrderSummary /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/orders/:id" element={<RequireAuth role="attendee"><AttendeeLayout><OrderSummary /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/community" element={<RequireAuth role="attendee"><AttendeeLayout><Community /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/community/:id" element={<RequireAuth role="attendee"><AttendeeLayout><CommunityDetail /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/rewards" element={<Navigate to="/app/profile/achievements" replace />} />
      <Route path="/app/profile" element={<RequireAuth role="attendee"><AttendeeLayout><Profile /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/settings" element={<Navigate to="/app/profile" replace />} />
      <Route path="/app/profile/achievements" element={<RequireAuth role="attendee"><AttendeeLayout><Achievements /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/notifications" element={<RequireAuth role="attendee"><AttendeeLayout><Notifications /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/messages" element={<RequireAuth role="attendee"><AttendeeLayout><Messages /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/rewards/store" element={<RequireAuth role="attendee"><AttendeeLayout><RewardStore /></AttendeeLayout></RequireAuth>} />

      {/* ── Organizer ── */}
      <Route path="/organizer" element={<Navigate to="/organizer/dashboard" replace />} />
      <Route path="/organizer/onboarding" element={<OrganizerLayout><OrganizerOnboarding /></OrganizerLayout>} />
      <Route path="/organizer/dashboard" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerDashboard /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/events" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerEvents /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/events/create" element={<RequireAuth role="organizer"><OrganizerLayout><CreateEvent /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/events/:id/manage" element={<RequireAuth role="organizer"><OrganizerLayout><ManageEvent /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/analytics" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerAnalytics /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/messages" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerMessages /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/reports" element={<Navigate to="/organizer/analytics" replace />} />
      <Route path="/organizer/profile" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerProfile /></OrganizerLayout></RequireAuth>} />

      {/* ── Admin ── */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/onboarding" element={<AdminLayout><AdminOnboarding /></AdminLayout>} />
      <Route path="/admin/dashboard" element={<RequireAuth role="admin"><AdminLayout><AdminDashboard /></AdminLayout></RequireAuth>} />
      <Route path="/admin/events" element={<RequireAuth role="admin"><AdminLayout><AdminEvents /></AdminLayout></RequireAuth>} />
      <Route path="/admin/users" element={<RequireAuth role="admin"><AdminLayout><AdminUsers /></AdminLayout></RequireAuth>} />
      <Route path="/admin/community" element={<RequireAuth role="admin"><AdminLayout><AdminCommunity /></AdminLayout></RequireAuth>} />
      <Route path="/admin/moderation" element={<RequireAuth role="admin"><AdminLayout><AdminModeration /></AdminLayout></RequireAuth>} />
      <Route path="/admin/analytics" element={<RequireAuth role="admin"><AdminLayout><AdminAnalytics /></AdminLayout></RequireAuth>} />
      <Route path="/admin/settings" element={<RequireAuth role="admin"><AdminLayout><AdminSettings /></AdminLayout></RequireAuth>} />
      <Route path="/admin/audit-logs" element={<RequireAuth role="admin"><AdminLayout><AdminAuditLogs /></AdminLayout></RequireAuth>} />
      <Route path="/admin/audit-log" element={<Navigate to="/admin/audit-logs" replace />} />
      <Route path="/admin/fraud" element={<Navigate to="/admin/users" replace />} />
      <Route path="/admin/ai-health" element={<Navigate to="/admin/analytics" replace />} />
      <Route path="/admin/profile" element={<RequireAuth role="admin"><AdminLayout><Profile /></AdminLayout></RequireAuth>} />

      {/* ── Catch all ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>,
  ),
);

export default function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ErrorBoundary>
      <div className={theme === 'dark' ? 'dark' : undefined}>
        <div className="min-h-screen bg-background text-foreground">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] btn-primary"
          >
            Skip to main content
          </a>
          <Toaster richColors position="top-center" theme={theme === 'dark' ? 'dark' : 'light'} />
          <RouterProvider router={router} />
        </div>
      </div>
    </ErrorBoundary>
  );
}
