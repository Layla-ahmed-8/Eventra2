import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

// Layouts
import AttendeeLayout from '../components/layout/AttendeeLayout';
import OrganizerLayout from '../components/layout/OrganizerLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Public Pages
import Landing from '../pages/public/Landing';
import Login from '../pages/public/Login';
import Signup from '../pages/public/Signup';
import Onboarding from '../pages/public/Onboarding';

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

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminEvents from '../pages/admin/AdminEvents';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCommunity from '../pages/admin/AdminCommunity';
import AdminAnalytics from '../pages/admin/AdminAnalytics';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminModeration from '../pages/admin/AdminModeration';
import AdminOnboarding from '../pages/admin/AdminOnboarding';

export default function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground">
        <BrowserRouter>
          <Routes>
            {/* ── Public Routes ── */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* ── Attendee Routes ── */}
            <Route path="/app" element={<AttendeeLayout><Discover /></AttendeeLayout>}>
              <Route index element={<Navigate to="/app/discover" />} />
            </Route>
            <Route path="/app/discover"                    element={<AttendeeLayout><Discover /></AttendeeLayout>} />
            <Route path="/app/search"                      element={<AttendeeLayout><Discover /></AttendeeLayout>} />
            <Route path="/app/events/:id"                  element={<AttendeeLayout><EventDetail /></AttendeeLayout>} />
            <Route path="/app/events/:id/rsvp"             element={<AttendeeLayout><RSVP /></AttendeeLayout>} />
            <Route path="/app/checkout"                    element={<AttendeeLayout><RSVP /></AttendeeLayout>} />
            <Route path="/app/calendar"                    element={<AttendeeLayout><Calendar /></AttendeeLayout>} />
            <Route path="/app/my-events"                   element={<AttendeeLayout><MyEvents /></AttendeeLayout>} />
            <Route path="/app/my-events/:bookingId/summary" element={<AttendeeLayout><OrderSummary /></AttendeeLayout>} />
            <Route path="/app/orders/:id"                  element={<AttendeeLayout><OrderSummary /></AttendeeLayout>} />
            <Route path="/app/community"                   element={<AttendeeLayout><Community /></AttendeeLayout>} />
            <Route path="/app/community/:id"               element={<AttendeeLayout><CommunityDetail /></AttendeeLayout>} />
            <Route path="/app/rewards"                     element={<AttendeeLayout><Achievements /></AttendeeLayout>} />
            {/* Profile — smart router renders role-specific UI */}
            <Route path="/app/profile"                     element={<AttendeeLayout><Profile /></AttendeeLayout>} />
            <Route path="/app/settings"                    element={<AttendeeLayout><Profile /></AttendeeLayout>} />
            <Route path="/app/profile/achievements"        element={<AttendeeLayout><Achievements /></AttendeeLayout>} />
            <Route path="/app/notifications"               element={<AttendeeLayout><Notifications /></AttendeeLayout>} />
            <Route path="/app/messages"                    element={<AttendeeLayout><Messages /></AttendeeLayout>} />
            <Route path="/app/rewards/store"               element={<AttendeeLayout><RewardStore /></AttendeeLayout>} />

            {/* ── Organizer Routes ── */}
            <Route path="/organizer"                       element={<Navigate to="/organizer/dashboard" />} />
            <Route path="/organizer/onboarding"            element={<OrganizerLayout><OrganizerOnboarding /></OrganizerLayout>} />
            <Route path="/organizer/dashboard"             element={<OrganizerLayout><OrganizerDashboard /></OrganizerLayout>} />
            <Route path="/organizer/events"                element={<OrganizerLayout><OrganizerEvents /></OrganizerLayout>} />
            <Route path="/organizer/events/create"         element={<OrganizerLayout><CreateEvent /></OrganizerLayout>} />
            <Route path="/organizer/events/:id/manage"     element={<OrganizerLayout><ManageEvent /></OrganizerLayout>} />
            <Route path="/organizer/analytics"             element={<OrganizerLayout><OrganizerAnalytics /></OrganizerLayout>} />
            <Route path="/organizer/messages"              element={<OrganizerLayout><OrganizerMessages /></OrganizerLayout>} />
            <Route path="/organizer/reports"               element={<OrganizerLayout><OrganizerAnalytics /></OrganizerLayout>} />
            {/* Organizer profile via shared /app/profile route */}
            <Route path="/organizer/profile"               element={<OrganizerLayout><Profile /></OrganizerLayout>} />

            {/* ── Admin Routes ── */}
            <Route path="/admin"                           element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/onboarding"                element={<AdminLayout><AdminOnboarding /></AdminLayout>} />
            <Route path="/admin/dashboard"                 element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/events"                    element={<AdminLayout><AdminEvents /></AdminLayout>} />
            <Route path="/admin/users"                     element={<AdminLayout><AdminUsers /></AdminLayout>} />
            <Route path="/admin/community"                 element={<AdminLayout><AdminCommunity /></AdminLayout>} />
            <Route path="/admin/moderation"                element={<AdminLayout><AdminModeration /></AdminLayout>} />
            <Route path="/admin/fraud"                     element={<AdminLayout><AdminUsers /></AdminLayout>} />
            <Route path="/admin/ai-health"                 element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
            <Route path="/admin/analytics"                 element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
            <Route path="/admin/audit-log"                 element={<AdminLayout><AdminSettings /></AdminLayout>} />
            <Route path="/admin/settings"                  element={<AdminLayout><AdminSettings /></AdminLayout>} />
            {/* Admin profile via shared /app/profile route */}
            <Route path="/admin/profile"                   element={<AdminLayout><Profile /></AdminLayout>} />

            {/* ── Catch all ── */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
