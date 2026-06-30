export type VoucherDiscountType = 'percent' | 'fixed' | 'free_ticket';

export interface PromoCodeDef {
  code: string;
  label: string;
  type: VoucherDiscountType;
  value: number;
  /** VIP-only promos apply only when cart includes a VIP ticket */
  vipOnly?: boolean;
}

export interface RewardVoucherDef {
  rewardId: string;
  code: string;
  label: string;
  type: VoucherDiscountType;
  value: number;
  description: string;
}

export const PROMO_CODES: PromoCodeDef[] = [
  { code: 'EVENTRA20', label: '20% off your order', type: 'percent', value: 20 },
  { code: 'WELCOME10', label: '10% welcome discount', type: 'percent', value: 10 },
  { code: 'VIP50', label: '50% off VIP tickets', type: 'percent', value: 50, vipOnly: true },
];

export const REWARD_VOUCHERS: RewardVoucherDef[] = [
  {
    rewardId: 'reward-001',
    code: 'EVTRA-FREE-TICKET',
    label: 'Free Event Ticket',
    type: 'free_ticket',
    value: 100,
    description: 'Covers one general admission ticket (fees may still apply).',
  },
  {
    rewardId: 'reward-002',
    code: 'EVTRA-VIP-2026',
    label: 'VIP Lounge Access',
    type: 'percent',
    value: 50,
    description: '50% off VIP or premium ticket types.',
  },
  {
    rewardId: 'reward-004',
    code: 'EVTRA-FOOD-500',
    label: 'Partner Discount',
    type: 'fixed',
    value: 500,
    description: 'EGP 500 off your order total.',
  },
];

export function getRewardVoucherByCode(code: string): RewardVoucherDef | undefined {
  const normalized = code.trim().toUpperCase();
  return REWARD_VOUCHERS.find((v) => v.code.toUpperCase() === normalized);
}

export function getPromoByCode(code: string): PromoCodeDef | undefined {
  const normalized = code.trim().toUpperCase();
  return PROMO_CODES.find((p) => p.code.toUpperCase() === normalized);
}

export interface DiscountInput {
  subtotal: number;
  serviceFee: number;
  ticketLines: Array<{ type: string; qty: number; unitPrice: number }>;
}

export function calculateDiscount(
  def: PromoCodeDef | RewardVoucherDef,
  input: DiscountInput,
): number {
  const { subtotal, ticketLines } = input;
  if (subtotal <= 0) return 0;

  if ('vipOnly' in def && def.vipOnly) {
    const vipSubtotal = ticketLines
      .filter((t) => /vip|premium/i.test(t.type))
      .reduce((sum, t) => sum + t.unitPrice * t.qty, 0);
    if (vipSubtotal <= 0) return 0;
    return Number(((vipSubtotal * def.value) / 100).toFixed(2));
  }

  if (def.type === 'percent') {
    return Number(((subtotal * def.value) / 100).toFixed(2));
  }

  if (def.type === 'fixed') {
    return Math.min(subtotal, def.value);
  }

  if (def.type === 'free_ticket') {
    const cheapest = ticketLines
      .filter((t) => t.qty > 0)
      .map((t) => t.unitPrice)
      .sort((a, b) => a - b)[0];
    return cheapest ?? 0;
  }

  return 0;
}
