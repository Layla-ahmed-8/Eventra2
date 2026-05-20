/**
 * Generates a Google Calendar URL for an event.
 */
export function generateGoogleCalendarUrl(event: {
  title: string;
  description: string;
  date: string;
  endDate: string;
  location: {
    venue: string | null;
    address: string | null;
    city: string | null;
    isVirtual: boolean;
  };
}): string {
  const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const start = formatDate(event.date);
  const end = formatDate(event.endDate);
  
  const locationStr = event.location.isVirtual 
    ? 'Virtual Event' 
    : `${event.location.venue || ''}, ${event.location.address || ''}, ${event.location.city || ''}`;

  const params = new URLSearchParams({
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description,
    location: locationStr,
    sf: 'true',
    output: 'xml'
  });

  return `${baseUrl}&${params.toString()}`;
}
