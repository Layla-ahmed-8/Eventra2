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
import EventChat from '../pages/attendee/EventChat';
import RSVP from '../pages/attendee/RSVP';
import Calendar from '../pages/attendee/Calendar';
import MyEvents from '../pages/attendee/MyEvents';
import Community from '../pages/attendee/Community';
import CommunityDetail from '../pages/attendee/CommunityDetail';
import Profile from '../pages/attendee/Profile';
import Notifications from '../pages/attendee/Notifications';
import Messages from '../pages/attendee/Messages';
import OrderSummary from '../pages/attendee/OrderSummary';
import RewardsHub from '../pages/attendee/RewardsHub';
import AttendeeWallet from '../pages/attendee/wallet/AttendeeWallet';
import WalletTransactions from '../pages/attendee/wallet/WalletTransactions';
import WalletDeposit from '../pages/attendee/wallet/WalletDeposit';
import WalletWithdraw from '../pages/attendee/wallet/WalletWithdraw';
import WalletMethods from '../pages/attendee/wallet/WalletMethods';

// Organizer Pages
import OrganizerEvents from '../pages/organizer/OrganizerEvents';
import CreateEvent from '../pages/organizer/CreateEvent';
import ManageEvent from '../pages/organizer/ManageEvent';
import OrganizerEventChat from '../pages/organizer/OrganizerEventChat';
import OrganizerAnalytics from '../pages/organizer/OrganizerAnalytics';
import OrganizerMessages from '../pages/organizer/OrganizerMessages';
import OrganizerNotifications from '../pages/organizer/OrganizerNotifications';
import OrganizerOnboarding from '../pages/organizer/OrganizerOnboarding';
import OrganizerProfile from '../pages/organizer/OrganizerProfile';
import OrganizerWallet from '../pages/organizer/wallet/OrganizerWallet';
import OrganizerWalletWithdraw from '../pages/organizer/wallet/OrganizerWalletWithdraw';
import OrganizerWalletTransactions from '../pages/organizer/wallet/OrganizerWalletTransactions';
import OrganizerWalletMethods from '../pages/organizer/wallet/OrganizerWalletMethods';

// Admin Pages
import AdminEvents from '../pages/admin/AdminEvents';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCommunity from '../pages/admin/AdminCommunity';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminModeration from '../pages/admin/AdminModeration';
import AdminOnboarding from '../pages/admin/AdminOnboarding';
import AdminAuditLogs from '../pages/admin/AdminAuditLogs';
import AdminMessages from '../pages/admin/AdminMessages';
import AdminWallet from '../pages/admin/wallet/AdminWallet';
import AdminWalletPayouts from '../pages/admin/wallet/AdminWalletPayouts';

// ── Auth guard: redirect to login if not authenticated, or wrong role ────────
function RequireAuth({
  children,
  role,
  skipOnboardingCheck = false,
}: {
  children: React.ReactNode;
  role?: 'attendee' | 'organizer' | 'admin';
  skipOnboardingCheck?: boolean;
}) {
  const { isAuthenticated, currentUser, onboardingCompleted } = useAppStore();
  if (!isAuthenticated || !currentUser) return <Navigate to="/login" replace />;
  if (role && currentUser.role !== role) {
    if (currentUser.role === 'admin') return <Navigate to="/admin/analytics" replace />;
    if (currentUser.role === 'organizer') return <Navigate to="/organizer/analytics" replace />;
    return <Navigate to="/app/discover" replace />;
  }
  if (!skipOnboardingCheck && !onboardingCompleted) {
    if (currentUser.role === 'organizer') return <Navigate to="/organizer/onboarding" replace />;
    if (currentUser.role === 'attendee') return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

// ── Redirect already-authenticated users away from public pages ──────────────
function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, currentUser } = useAppStore();
  if (isAuthenticated && currentUser) {
    if (currentUser.role === 'admin') return <Navigate to="/admin/analytics" replace />;
    if (currentUser.role === 'organizer') return <Navigate to="/organizer/analytics" replace />;
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
      <Route path="/onboarding" element={<RequireAuth role="attendee" skipOnboardingCheck><Onboarding /></RequireAuth>} />

      {/* ── Attendee ── */}
      <Route path="/app" element={<Navigate to="/app/discover" replace />} />
      <Route path="/app/discover" element={<RequireAuth role="attendee"><AttendeeLayout><Discover /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/search" element={<Navigate to="/app/discover" replace />} />
      <Route path="/app/events/:id" element={<RequireAuth role="attendee"><AttendeeLayout><EventDetail /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/events/:id/chat" element={<RequireAuth role="attendee"><AttendeeLayout><EventChat /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/events/:id/rsvp" element={<RequireAuth role="attendee"><AttendeeLayout><RSVP /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/checkout/:id" element={<RequireAuth role="attendee"><AttendeeLayout><RSVP /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/calendar" element={<RequireAuth role="attendee"><AttendeeLayout><Calendar /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/my-events" element={<RequireAuth role="attendee"><AttendeeLayout><MyEvents /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/my-events/:bookingId/summary" element={<RequireAuth role="attendee"><AttendeeLayout><OrderSummary /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/orders/:id" element={<RequireAuth role="attendee"><AttendeeLayout><OrderSummary /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/community" element={<RequireAuth role="attendee"><AttendeeLayout><Community /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/community/:id" element={<RequireAuth role="attendee"><AttendeeLayout><CommunityDetail /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/rewards" element={<Navigate to="/app/rewards/hub" replace />} />
      <Route path="/app/rewards/hub" element={<RequireAuth role="attendee"><AttendeeLayout><RewardsHub /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/rewards/store" element={<Navigate to="/app/rewards/hub" replace />} />
      <Route path="/app/profile/achievements" element={<Navigate to="/app/rewards/hub" replace />} />
      <Route path="/app/profile" element={<RequireAuth role="attendee"><AttendeeLayout><Profile /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/settings" element={<Navigate to="/app/profile" replace />} />
      <Route path="/app/notifications" element={<RequireAuth role="attendee"><AttendeeLayout><Notifications /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/messages" element={<RequireAuth role="attendee"><AttendeeLayout><Messages /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/wallet" element={<RequireAuth role="attendee"><AttendeeLayout><AttendeeWallet /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/wallet/transactions" element={<RequireAuth role="attendee"><AttendeeLayout><WalletTransactions /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/wallet/deposit" element={<RequireAuth role="attendee"><AttendeeLayout><WalletDeposit /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/wallet/withdraw" element={<RequireAuth role="attendee"><AttendeeLayout><WalletWithdraw /></AttendeeLayout></RequireAuth>} />
      <Route path="/app/wallet/methods" element={<RequireAuth role="attendee"><AttendeeLayout><WalletMethods /></AttendeeLayout></RequireAuth>} />

      {/* ── Organizer ── */}
      <Route path="/organizer" element={<Navigate to="/organizer/analytics" replace />} />
      <Route path="/organizer/dashboard" element={<Navigate to="/organizer/analytics" replace />} />
      <Route path="/organizer/onboarding" element={<RequireAuth role="organizer" skipOnboardingCheck><OrganizerOnboarding /></RequireAuth>} />
      <Route path="/organizer/events" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerEvents /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/events/create" element={<RequireAuth role="organizer"><OrganizerLayout><CreateEvent /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/events/:id/manage" element={<RequireAuth role="organizer"><OrganizerLayout><ManageEvent /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/events/:id/chat" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerEventChat /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/analytics" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerAnalytics /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/messages" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerMessages /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/notifications" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerNotifications /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/reports" element={<Navigate to="/organizer/analytics" replace />} />
      <Route path="/organizer/profile" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerProfile /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/wallet" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerWallet /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/wallet/withdraw" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerWalletWithdraw /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/wallet/transactions" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerWalletTransactions /></OrganizerLayout></RequireAuth>} />
      <Route path="/organizer/wallet/methods" element={<RequireAuth role="organizer"><OrganizerLayout><OrganizerWalletMethods /></OrganizerLayout></RequireAuth>} />

      {/* ── Admin ── */}
      <Route path="/admin" element={<Navigate to="/admin/analytics" replace />} />
      <Route path="/admin/dashboard" element={<Navigate to="/admin/analytics" replace />} />
      <Route path="/admin/onboarding" element={<AdminLayout><AdminOnboarding /></AdminLayout>} />
      <Route path="/admin/events" element={<RequireAuth role="admin"><AdminLayout><AdminEvents /></AdminLayout></RequireAuth>} />
      <Route path="/admin/users" element={<RequireAuth role="admin"><AdminLayout><AdminUsers /></AdminLayout></RequireAuth>} />
      <Route path="/admin/community" element={<RequireAuth role="admin"><AdminLayout><AdminCommunity /></AdminLayout></RequireAuth>} />
      <Route path="/admin/moderation" element={<RequireAuth role="admin"><AdminLayout><AdminModeration /></AdminLayout></RequireAuth>} />
      <Route path="/admin/analytics" element={<RequireAuth role="admin"><AdminLayout><AdminAnalytics /></AdminLayout></RequireAuth>} />
      <Route path="/admin/settings" element={<RequireAuth role="admin"><AdminLayout><AdminSettings /></AdminLayout></RequireAuth>} />
      <Route path="/admin/audit-logs" element={<RequireAuth role="admin"><AdminLayout><AdminAuditLogs /></AdminLayout></RequireAuth>} />
      <Route path="/admin/messages" element={<RequireAuth role="admin"><AdminLayout><AdminMessages /></AdminLayout></RequireAuth>} />
      <Route path="/admin/wallet" element={<RequireAuth role="admin"><AdminLayout><AdminWallet /></AdminLayout></RequireAuth>} />
      <Route path="/admin/wallet/payouts" element={<RequireAuth role="admin"><AdminLayout><AdminWalletPayouts /></AdminLayout></RequireAuth>} />
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
