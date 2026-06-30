import NotificationHub from '../../components/business/NotificationHub';

export default function AdminNotifications() {
  return (
    <NotificationHub
      role="admin"
      title="Admin Notifications"
      subtitle="Platform alerts, moderation updates, and system messages."
      settingsTo="/admin/settings"
    />
  );
}
