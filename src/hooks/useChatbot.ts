import { useAppStore } from '../store/useAppStore';
import type { Event } from '../data/mockData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: Date;
  chips?: Array<{ intent: string; label: string }>;
}

export type ChatbotRole = 'attendee' | 'organizer' | 'admin';

type ChatActionResult = {
  response: ChatMessage;
  sideEffect?: () => void;
};

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

function getRoleRoute(role: ChatbotRole, target: 'profile' | 'discover' | 'analytics' | 'events' | 'messages' | 'notifications' | 'wallet' | 'community') {
  switch (role) {
    case 'organizer':
      if (target === 'profile') return '/organizer/profile';
      if (target === 'discover') return '/organizer/events';
      if (target === 'analytics') return '/organizer/analytics';
      if (target === 'events') return '/organizer/events';
      if (target === 'messages') return '/organizer/messages';
      if (target === 'notifications') return '/organizer/notifications';
      if (target === 'wallet') return '/organizer/wallet';
      return '/organizer/analytics';
    case 'admin':
      if (target === 'profile') return '/admin/profile';
      if (target === 'discover') return '/admin/analytics';
      if (target === 'analytics') return '/admin/analytics';
      if (target === 'events') return '/admin/events';
      if (target === 'messages') return '/admin/messages';
      if (target === 'notifications') return '/admin/messages';
      if (target === 'wallet') return '/admin/wallet';
      if (target === 'community') return '/admin/community';
      return '/admin/analytics';
    default:
      if (target === 'profile') return '/app/profile';
      if (target === 'discover') return '/app/discover';
      if (target === 'analytics') return '/app/discover';
      if (target === 'events') return '/app/my-events';
      if (target === 'messages') return '/app/messages';
      if (target === 'notifications') return '/app/notifications';
      if (target === 'wallet') return '/app/wallet';
      if (target === 'community') return '/app/community';
      return '/app/discover';
  }
}

function findMatchingEvent(input: string, events: Event[]) {
  const normalized = normalizeText(input);
  if (!normalized) return null;

  const tokens = normalized.split(/\s+/).filter((token) => token.length > 2);
  if (tokens.length === 0) return null;

  return events.find((event) => {
    const haystack = `${event.title} ${event.description} ${event.category} ${event.location}`.toLowerCase();
    return tokens.some((token) => haystack.includes(token));
  }) ?? null;
}

function buildWelcomeMessage(role: ChatbotRole, name?: string): ChatMessage {
  const greeting = name ? `Hi ${name}!` : 'Hi there!';
  const baseText = `${greeting} I’m Eventra AI. I can help you discover events, manage your plans, and navigate the app.`;

  const chips = [
    { intent: 'nav:discover', label: 'Discover events' },
    { intent: 'nav:profile', label: 'View profile' },
  ];

  if (role === 'organizer') {
    chips.unshift({ intent: 'nav:analytics', label: 'Open analytics' });
  }

  if (role === 'admin') {
    chips.unshift({ intent: 'nav:analytics', label: 'Open admin analytics' });
  }

  return {
    id: 'welcome-message',
    role: 'bot',
    text: baseText,
    timestamp: new Date(),
    chips,
  };
}

function buildResponse(input: string, role: ChatbotRole, currentUser: { name?: string; role?: string } | null, state: ReturnType<typeof useAppStore.getState>): ChatActionResult {
  const normalized = normalizeText(input);
  const topic = normalized.replace(/^nav:/, '').trim();
  const store = useAppStore.getState();

  if (normalized.startsWith('nav:')) {
    const route = getRoleRoute(role, (topic as any) || 'discover');
    return {
      response: {
        id: `nav-${Date.now()}`,
        role: 'bot',
        text: `I can take you to ${topic || 'the requested section'}.`,
        timestamp: new Date(),
        chips: [
          { intent: 'nav:discover', label: 'Discover events' },
          { intent: 'nav:profile', label: 'View profile' },
        ],
      },
      sideEffect: () => {
        window.location.assign(route);
      },
    };
  }

  if (['logout', 'sign out', 'log out', 'exit'].some((keyword) => normalized.includes(keyword))) {
    return {
      response: {
        id: `logout-${Date.now()}`,
        role: 'bot',
        text: 'You’re signed out and I’ve sent you back to the login screen.',
        timestamp: new Date(),
      },
      sideEffect: () => {
        store.logout();
        window.location.assign('/login');
      },
    };
  }

  if (['profile', 'my profile', 'account'].some((keyword) => normalized.includes(keyword))) {
    return {
      response: {
        id: `profile-${Date.now()}`,
        role: 'bot',
        text: 'Opening your profile so you can review your details and progress.',
        timestamp: new Date(),
      },
      sideEffect: () => {
        window.location.assign(getRoleRoute(role, 'profile'));
      },
    };
  }

  if (['bookings', 'my events', 'orders', 'rsvps', 'my reservations'].some((keyword) => normalized.includes(keyword))) {
    return {
      response: {
        id: `events-${Date.now()}`,
        role: 'bot',
        text: 'Showing your upcoming plans and bookings.',
        timestamp: new Date(),
      },
      sideEffect: () => {
        window.location.assign(getRoleRoute(role, 'events'));
      },
    };
  }

  if (['message', 'messages', 'inbox'].some((keyword) => normalized.includes(keyword))) {
    return {
      response: {
        id: `messages-${Date.now()}`,
        role: 'bot',
        text: 'Opening your messages and conversations.',
        timestamp: new Date(),
      },
      sideEffect: () => {
        window.location.assign(getRoleRoute(role, 'messages'));
      },
    };
  }

  if (['notification', 'notifications', 'alerts'].some((keyword) => normalized.includes(keyword))) {
    return {
      response: {
        id: `notifications-${Date.now()}`,
        role: 'bot',
        text: 'Opening your notifications.',
        timestamp: new Date(),
      },
      sideEffect: () => {
        window.location.assign(getRoleRoute(role, 'notifications'));
      },
    };
  }

  if (['wallet', 'balance', 'funds'].some((keyword) => normalized.includes(keyword))) {
    return {
      response: {
        id: `wallet-${Date.now()}`,
        role: 'bot',
        text: 'Opening your wallet and payment options.',
        timestamp: new Date(),
      },
      sideEffect: () => {
        window.location.assign(getRoleRoute(role, 'wallet'));
      },
    };
  }

  if (['community', 'communities', 'groups'].some((keyword) => normalized.includes(keyword))) {
    return {
      response: {
        id: `community-${Date.now()}`,
        role: 'bot',
        text: 'Opening the communities area so you can browse and join groups.',
        timestamp: new Date(),
      },
      sideEffect: () => {
        window.location.assign(getRoleRoute(role, 'community'));
      },
    };
  }

  if (['bookmark', 'save for later', 'save it', 'save this'].some((keyword) => normalized.includes(keyword))) {
    const event = findMatchingEvent(normalized.replace(/bookmark|save for later|save it|save this/g, ''), state.events);
    if (event) {
      store.toggleBookmark(event.id);
      return {
        response: {
          id: `bookmark-${Date.now()}`,
          role: 'bot',
          text: `I’ve bookmarked “${event.title}” for you.`,
          timestamp: new Date(),
          chips: [{ intent: 'nav:events', label: 'View my events' }],
        },
      };
    }

    return {
      response: {
        id: `bookmark-${Date.now()}`,
        role: 'bot',
        text: 'I can bookmark an event for you. Tell me the event name and I’ll save it.',
        timestamp: new Date(),
      },
    };
  }

  if (['rsvp', 'join', 'reserve', 'book', 'attend'].some((keyword) => normalized.includes(keyword))) {
    const event = findMatchingEvent(normalized.replace(/rsvp|join|reserve|book|attend/g, ''), state.events);
    if (event) {
      store.rsvpEvent(event.id);
      return {
        response: {
          id: `rsvp-${Date.now()}`,
          role: 'bot',
          text: `You’re now RSVP’d for “${event.title}”.`,
          timestamp: new Date(),
          chips: [{ intent: 'nav:events', label: 'View bookings' }],
        },
      };
    }

    return {
      response: {
        id: `rsvp-${Date.now()}`,
        role: 'bot',
        text: 'I can help you RSVP. Mention the event name and I’ll add it to your plans.',
        timestamp: new Date(),
      },
    };
  }

  if (['xp', 'points', 'level', 'streak'].some((keyword) => normalized.includes(keyword))) {
    const summary = currentUser
      ? `${currentUser.name ?? 'You'} is at level ${state.level} with ${state.xp} XP and ${state.pointsBalance} points.`
      : 'You are not signed in yet.';

    return {
      response: {
        id: `stats-${Date.now()}`,
        role: 'bot',
        text: summary,
        timestamp: new Date(),
        chips: [{ intent: 'nav:profile', label: 'Open profile' }],
      },
    };
  }

  if (normalized.includes('help') || normalized.includes('what can you do') || normalized.includes('assist')) {
    return {
      response: {
        id: `help-${Date.now()}`,
        role: 'bot',
        text: `You can ask me to open your profile, show bookings, browse communities, check your XP, or RSVP/bookmark an event. I also understand phrases like “bookmark the rooftop mixer” or “show my messages”.`,
        timestamp: new Date(),
        chips: [
          { intent: 'nav:discover', label: 'Discover events' },
          { intent: 'nav:profile', label: 'View profile' },
        ],
      },
    };
  }

  if (normalized.includes('event')) {
    return {
      response: {
        id: `event-${Date.now()}`,
        role: 'bot',
        text: 'I can highlight trending events, help you RSVP, and save events for later based on your interests.',
        timestamp: new Date(),
        chips: [{ intent: 'nav:discover', label: 'Open discover' }],
      },
    };
  }

  return {
    response: {
      id: `fallback-${Date.now()}`,
      role: 'bot',
      text: 'I can help with event discovery, profile actions, bookings, wallet, messages, and more. Try saying “show my bookings” or “bookmark the rooftop mixer”.',
      timestamp: new Date(),
      chips: [{ intent: 'nav:discover', label: 'Discover events' }],
    },
  };
}

export function useChatbot() {
  const currentUser = useAppStore((state) => state.currentUser);
  const role: ChatbotRole = (currentUser?.role as ChatbotRole | undefined) ?? 'attendee';

  const getWelcomeMessage = () => buildWelcomeMessage(role, currentUser?.name);

  const processMessage = (input: string) => {
    const state = useAppStore.getState();
    return buildResponse(input, role, currentUser, state);
  };

  return { getWelcomeMessage, processMessage, role, currentUser };
}
