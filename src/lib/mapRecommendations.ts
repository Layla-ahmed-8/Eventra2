import type { Event } from '../data/mockData';

export interface MapRecommendation {
  event: Event;
  score: number;
  distanceKm: number;
  reasons: string[];
}

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function scoreNearbyEvents(
  events: Event[],
  userLat: number,
  userLng: number,
  opts?: { interests?: string[]; maxDistanceKm?: number },
): MapRecommendation[] {
  const maxDist = opts?.maxDistanceKm ?? 50;
  const interests = opts?.interests ?? [];

  return events
    .filter((e) => !e.location.isVirtual && e.location.lat && e.location.lng)
    .map((event) => {
      const distanceKm = haversineKm(userLat, userLng, event.location.lat, event.location.lng);
      const reasons: string[] = [];
      let score = 50;

      if (distanceKm < 2) {
        score += 30;
        reasons.push('Very close to you');
      } else if (distanceKm < 10) {
        score += 20;
        reasons.push('Within easy travel distance');
      } else if (distanceKm < 25) {
        score += 10;
        reasons.push('In your area');
      }

      const matchingTags = event.tags.filter((t) => interests.includes(t));
      if (matchingTags.length > 0) {
        score += matchingTags.length * 8;
        reasons.push(`Matches your interests: ${matchingTags.slice(0, 2).join(', ')}`);
      }

      if (event.rsvpCount > 50) {
        score += 10;
        reasons.push('Popular event');
      }

      if (event.relevanceScore > 0.7) {
        score += 15;
        reasons.push('High AI match for you');
      }

      return { event, score: Math.min(100, score), distanceKm, reasons };
    })
    .filter((r) => r.distanceKm <= maxDist)
    .sort((a, b) => b.score - a.score);
}

export function buildNearMeInsight(recommendations: MapRecommendation[]): string {
  if (recommendations.length === 0) {
    return 'No in-person events found near your location. Try expanding your search or check back later.';
  }
  const top = recommendations[0];
  const count = recommendations.length;
  const dist = top.distanceKm < 1 ? 'less than 1 km' : `${top.distanceKm.toFixed(1)} km`;
  return `Found ${count} event${count > 1 ? 's' : ''} near you. Top pick: "${top.event.title}" (${dist} away)${top.reasons[0] ? ` — ${top.reasons[0]}` : ''}.`;
}
