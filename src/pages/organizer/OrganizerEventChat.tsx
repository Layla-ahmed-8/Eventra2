import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import EventChatComponent from '../../components/business/EventChat';

export default function OrganizerEventChat() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const event = useAppStore((s) => s.events.find((e) => e.id === id));

  return (
    <div className="space-y-0">
      <EventChatComponent
        eventId={id!}
        eventName={event?.title ?? 'Event Chat'}
        userRole="organizer"
        onBack={() => navigate(`/organizer/events/${id}/manage`)}
      />
    </div>
  );
}
