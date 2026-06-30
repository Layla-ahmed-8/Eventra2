import NotificationHub from '../../components/business/NotificationHub';

export default function OrganizerNotifications() {
  return (
    <NotificationHub
      role="organizer"
      title="Notifications"
      subtitle="Bookings, payouts, event decisions, and attendee messages."
      settingsTo="/organizer/profile"
    />
  );
}
