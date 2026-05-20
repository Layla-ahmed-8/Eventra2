import { Navigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import AttendeeProfile from './AttendeeProfile';
import OrganizerProfile from '../organizer/OrganizerProfile';
import AdminProfile from '../admin/AdminProfile';

/**
 * Smart profile router — renders the correct profile UI based on the
 * logged-in user's role. All three roles share the /app/profile route
 * so the layout wrapper stays consistent, but each gets a fully
 * distinct experience.
 */
export default function Profile() {
  const { currentUser } = useAppStore();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role === 'organizer') return <OrganizerProfile />;
  if (currentUser.role === 'admin') return <AdminProfile />;
  return <AttendeeProfile />;
}
