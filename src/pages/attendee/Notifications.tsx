import NotificationHub from '../../components/business/NotificationHub';

export default function Notifications() {
  return (
    <NotificationHub
      role="attendee"
      backTo="/app/discover"
      backLabel="Discover"
      settingsTo="/app/profile"
    />
  );
}
