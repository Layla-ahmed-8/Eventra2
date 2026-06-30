export const REWARDS_CATALOG = [
  {
    id: 'reward-001',
    title: 'Free Event Ticket',
    description: 'Redeem 1,000 points for a free ticket to any eligible event.',
    cost: 1000,
    badge: '🎟️',
    category: 'Event',
    code: 'EVTRA-FREE-TICKET',
  },
  {
    id: 'reward-002',
    title: 'VIP Lounge Access',
    description: 'Unlock VIP event lounge access or priority seating for your next booking.',
    cost: 1800,
    badge: '✨',
    category: 'Premium',
    code: 'EVTRA-VIP-2026',
  },
  {
    id: 'reward-003',
    title: 'Profile Highlight',
    description: 'Get featured in the community leaderboard and organizer network.',
    cost: 700,
    badge: '🌟',
    category: 'Community',
  },
  {
    id: 'reward-004',
    title: 'Partner Discount Voucher',
    description: 'Redeem for a sponsored food/drink discount voucher at select events.',
    cost: 500,
    badge: '🍹',
    category: 'Partner',
    code: 'EVTRA-FOOD-500',
  },
] as const;

export function getRewardById(id: string) {
  return REWARDS_CATALOG.find((r) => r.id === id);
}
