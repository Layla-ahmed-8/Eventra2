/**
 * AI Recommendation Engine for Eventra
 * Implements scoring, ranking, and reasoning based on user context and event signals.
 */

export interface UserContext {
  user: {
    id: string;
    name?: string; // Optional but used in reasoning
    profile: {
      interests: string[];
      preferredCategories: string[];
      preferredTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'any';
      maxDistanceKm: number;
      pricePreference: 'free' | 'paid' | 'any';
    };
    history: Array<{
      eventId: string;
      category: string;
      attendedAt: string; // ISO date string
      rating: number | null; // 1–5
    }>;
    social: {
      friendsAttending: Array<{
        eventId: string;
        friendCount: number;
        friendNames: string[];
      }>;
    };
  };
  context: {
    currentLocation: { lat: number; lng: number } | null;
    currentTime: string; // ISO datetime string
    dayOfWeek: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  };
  events: Array<{
    id: string;
    title: string;
    category: string;
    subcategory?: string;
    date: string; // ISO date string
    startTime: string; // HH:MM
    endTime: string; // HH:MM
    price: number | null; // null = free
    location: {
      lat: number;
      lng: number;
      venue: string;
      distanceKm?: number; // pre-computed haversine distance
    };
    capacity: number | null;
    spotsRemaining: number | null;
    tags: string[];
  }>;
}

export interface RecommendationResponse {
  recommendations: Array<{
    eventId: string;
    score: number;
    topPick: boolean;
    friendHighlight: boolean;
    reason: string | null;
    signals: {
      interestMatch: number;
      pastBehaviour: number;
      social: number;
      proximity: number;
      timeFit: number;
      priceFit: number;
      urgency: number;
    };
  }>;
  meta: {
    topPickCount: number;
    friendHighlightCount: number;
    smartFilterLabel: string;
    promotedDueToLowScores?: boolean;
    skippedEventIds?: string[];
  };
}

/**
 * Calculates Haversine distance between two coordinates in kilometers.
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Main recommendation engine function.
 */
export function getRecommendations(input: UserContext): RecommendationResponse {
  const { user, context, events } = input;
  const skippedEventIds: string[] = [];
  
  // Edge Case: Cold Start (no history, no social)
  const isColdStart = user.history.length === 0 && user.social.friendsAttending.length === 0;
  
  // Edge Case: Stale History (all past events > 6 months ago)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const isStaleHistory = user.history.length > 0 && user.history.every(h => new Date(h.attendedAt) < sixMonthsAgo);

  const processedEvents = events
    .filter(event => {
      if (!event.id || !event.location || !event.category) {
        if (event.id) skippedEventIds.push(event.id);
        return false;
      }
      return true;
    })
    .map(event => {
      const signals = {
        interestMatch: 0,
        pastBehaviour: 0,
        social: 0,
        proximity: 0,
        timeFit: 0,
        priceFit: 0,
        urgency: 0,
      };

      // 1. INTEREST MATCH (max 30 pts)
      const interestMatch = user.profile.interests.includes(event.category) || 
                           user.profile.preferredCategories.includes(event.category) ||
                           event.tags.some(tag => user.profile.interests.includes(tag));
      
      const partialMatch = event.subcategory && (user.profile.interests.includes(event.subcategory) || user.profile.preferredCategories.includes(event.subcategory)) ||
                          event.tags.some(tag => user.profile.interests.includes(tag));

      if (interestMatch) {
        signals.interestMatch = 30;
      } else if (partialMatch) {
        signals.interestMatch = 15;
      }

      if (isColdStart) signals.interestMatch *= 1.5;

      // 2. PAST BEHAVIOUR (max 20 pts)
      const categoryEvents = user.history.filter(h => h.category === event.category);
      const avgRating = categoryEvents.length > 0 
        ? categoryEvents.reduce((acc, curr) => acc + (curr.rating || 0), 0) / categoryEvents.length 
        : 0;

      if (categoryEvents.length >= 2 && avgRating >= 4) {
        signals.pastBehaviour = 20;
      } else if (categoryEvents.length >= 1) {
        signals.pastBehaviour = 12;
      } else {
        // Similar category logic (simplified for now: just checks if any history exists)
        if (user.history.length > 0) signals.pastBehaviour = 6;
      }

      // Penalty for low ratings
      if (categoryEvents.length > 0 && avgRating <= 2) {
        signals.pastBehaviour -= 10;
      }

      if (isStaleHistory) signals.pastBehaviour *= 0.7;

      // 3. SOCIAL SIGNAL (max 20 pts)
      const socialEvent = user.social.friendsAttending.find(f => f.eventId === event.id);
      if (socialEvent) {
        if (socialEvent.friendCount >= 3) signals.social = 20;
        else if (socialEvent.friendCount === 2) signals.social = 14;
        else if (socialEvent.friendCount === 1) signals.social = 8;
      }

      // 4. PROXIMITY (max 15 pts)
      if (context.currentLocation) {
        const distance = event.location.distanceKm ?? calculateDistance(
          context.currentLocation.lat,
          context.currentLocation.lng,
          event.location.lat,
          event.location.lng
        );

        if (distance <= 1) signals.proximity = 15;
        else if (distance <= 3) signals.proximity = 10;
        else if (distance <= 5) signals.proximity = 6;
        else if (distance <= 10) signals.proximity = 2;

        if (distance > user.profile.maxDistanceKm) {
          signals.proximity -= 20;
        }
        
        if (isColdStart) signals.proximity *= 1.5;
      }

      // 5. TIME FIT (max 10 pts)
      // Note: This is a simplified time match logic
      const eventHour = parseInt(event.startTime.split(':')[0]);
      let eventTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' = 'night';
      if (eventHour >= 5 && eventHour < 12) eventTimeOfDay = 'morning';
      else if (eventHour >= 12 && eventHour < 17) eventTimeOfDay = 'afternoon';
      else if (eventHour >= 17 && eventHour < 21) eventTimeOfDay = 'evening';

      if (eventTimeOfDay === user.profile.preferredTimeOfDay || user.profile.preferredTimeOfDay === 'any') {
        signals.timeFit += 10;
      }

      const eventDate = new Date(event.date);
      const currentDate = new Date(context.currentTime);
      const isToday = eventDate.toDateString() === currentDate.toDateString();
      const hoursUntilEvent = (eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);

      if (isToday && hoursUntilEvent > 0 && hoursUntilEvent <= 4) {
        signals.timeFit += 5;
      }

      // 6. PRICE FIT (max 5 pts)
      const isFree = event.price === null || event.price === 0;
      if (isFree && (user.profile.pricePreference === 'free' || user.profile.pricePreference === 'any')) {
        signals.priceFit = 5;
      } else if (!isFree && (user.profile.pricePreference === 'paid' || user.profile.pricePreference === 'any')) {
        signals.priceFit = 3;
      }

      // 7. URGENCY BONUS (max 5 pts)
      if (event.spotsRemaining !== null) {
        if (event.spotsRemaining <= 5) signals.urgency = 5;
        else if (event.spotsRemaining <= 20) signals.urgency = 2;
      }

      // Final Score Calculation
      let score = Object.values(signals).reduce((acc, curr) => acc + curr, 0);
      
      // Edge Case: Past Negative Signal Guardrail
      if (categoryEvents.length > 0 && avgRating <= 2 && score > 25) {
        // If it's only supported by one signal (e.g. proximity), cap it
        const nonZeroSignals = Object.entries(signals).filter(([_, val]) => val !== 0);
        if (nonZeroSignals.length <= 2) {
           score = 25;
        }
      }

      score = Math.round(Math.max(0, Math.min(100, score)));

      // Reasoning
      let reason: string | null = null;
      if (score >= 70 || (score >= 55 && score < 70)) { // Simplified for now, will refine
        const sortedSignals = Object.entries(signals).sort((a, b) => b[1] - a[1]);
        const topSignal = sortedSignals[0];
        const secondSignal = sortedSignals[1];

        const userName = user.name ? user.name.split(' ')[0] : 'Ahmed'; // Fallback to Ahmed as per spec

        if (topSignal[0] === 'social' && topSignal[1] > 0) {
          const friendCount = socialEvent?.friendCount || 0;
          const friendName = socialEvent?.friendNames[0] || 'A friend';
          reason = friendCount > 1 
            ? `${userName}, ${friendName} and ${friendCount - 1} others are going`
            : `${userName}, ${friendName} is going to this`;
        } else if (topSignal[0] === 'interestMatch') {
          reason = `Matches your interest in ${event.category}`;
        } else if (topSignal[0] === 'pastBehaviour') {
          reason = `You've loved ${event.category} events before`;
        } else if (topSignal[0] === 'proximity') {
          reason = `Just a short distance from you`;
        } else if (topSignal[0] === 'timeFit') {
          reason = `Fits perfectly into your ${eventTimeOfDay} schedule`;
        } else if (topSignal[0] === 'priceFit' && isFree) {
          reason = `Free entry, right up your street`;
        } else if (topSignal[0] === 'urgency') {
          reason = `Starts soon — limited spots left`;
        }

        // Blend top 2 if they are close
        if (secondSignal && secondSignal[1] > 10 && reason && reason.length < 40) {
          if (secondSignal[0] === 'priceFit' && isFree) {
            reason += " and it's free";
          }
        }
      }
      
      // Enforce 12 word limit
      if (reason && reason.split(' ').length > 12) {
        reason = reason.split(' ').slice(0, 12).join(' ');
      }

      return {
        eventId: event.id,
        score,
        topPick: score >= 70,
        friendHighlight: score >= 85 && (socialEvent?.friendCount || 0) >= 1,
        reason: score >= 70 ? reason : (score >= 55 ? reason : null),
        signals
      };
    });

  // Sort by score descending
  processedEvents.sort((a, b) => b.score - a.score);

  // Edge Case: All events score < 70
  let promotedDueToLowScores = false;
  if (processedEvents.length > 0 && !processedEvents.some(e => e.topPick)) {
    promotedDueToLowScores = true;
    for (let i = 0; i < Math.min(3, processedEvents.length); i++) {
      processedEvents[i].topPick = true;
    }
  }

  // Meta information
  const topPickCount = processedEvents.filter(e => e.topPick).length;
  const friendHighlightCount = processedEvents.filter(e => e.friendHighlight).length;

  // Smart Filter Label
  let smartFilterLabel = "Picked for you";
  if (!context.currentLocation) {
    smartFilterLabel = "Picked for you";
  } else if (processedEvents.some(e => e.friendHighlight)) {
    smartFilterLabel = "Friends are going";
  } else if (context.timeOfDay === 'night' || context.timeOfDay === 'evening') {
    smartFilterLabel = "For you tonight";
  } else if (isColdStart) {
    smartFilterLabel = "Near you now";
  }

  return {
    recommendations: processedEvents,
    meta: {
      topPickCount,
      friendHighlightCount,
      smartFilterLabel,
      promotedDueToLowScores,
      skippedEventIds
    }
  };
}
