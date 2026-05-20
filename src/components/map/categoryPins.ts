import L from 'leaflet';

// Category → color map
const CATEGORY_COLORS: Record<string, { bg: string; glow: string }> = {
  Music:             { bg: '#6C4CF1', glow: 'rgba(108,76,241,0.5)' },
  Tech:              { bg: '#378ADD', glow: 'rgba(55,138,221,0.5)' },
  Business:          { bg: '#378ADD', glow: 'rgba(55,138,221,0.5)' },
  'Food & Drink':    { bg: '#F97316', glow: 'rgba(249,115,22,0.5)' },
  Art:               { bg: '#EC4899', glow: 'rgba(236,72,153,0.5)' },
  Sports:            { bg: '#22C55E', glow: 'rgba(34,197,94,0.5)' },
  'Health & Wellness': { bg: '#22C55E', glow: 'rgba(34,197,94,0.5)' },
  Gaming:            { bg: '#A855F7', glow: 'rgba(168,85,247,0.5)' },
  Film:              { bg: '#EF4444', glow: 'rgba(239,68,68,0.5)' },
  Fashion:           { bg: '#F472B6', glow: 'rgba(244,114,182,0.5)' },
  Science:           { bg: '#06B6D4', glow: 'rgba(6,182,212,0.5)' },
  Community:         { bg: '#F59E0B', glow: 'rgba(245,158,11,0.5)' },
};

const DEFAULT_COLOR = { bg: '#6C4CF1', glow: 'rgba(108,76,241,0.5)' };

export function getCategoryPin(category: string, isLive = false, crowdLevel: 'low' | 'medium' | 'high' = 'low'): L.DivIcon {
  const { bg, glow } = CATEGORY_COLORS[category] ?? DEFAULT_COLOR;

  const ringSize = crowdLevel === 'high' ? 44 : crowdLevel === 'medium' ? 38 : 32;
  const ringOpacity = crowdLevel === 'high' ? 0.5 : crowdLevel === 'medium' ? 0.35 : 0.2;
  const pulseAnim = isLive ? `animation:evPulse 1.8s ease-in-out infinite;` : '';

  return L.divIcon({
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
    html: `
      <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
        <!-- outer glow ring -->
        <div style="
          position:absolute;
          width:${ringSize}px;height:${ringSize}px;
          border-radius:50%;
          background:${bg};
          opacity:${ringOpacity};
          ${pulseAnim}
        "></div>
        <!-- pin body -->
        <div style="
          width:24px;height:24px;border-radius:50%;
          background:${bg};
          border:2.5px solid white;
          box-shadow:0 2px 8px ${glow};
          position:relative;z-index:1;
          display:flex;align-items:center;justify-content:center;
        ">
          ${isLive ? `<div style="width:6px;height:6px;border-radius:50%;background:white;opacity:0.9;"></div>` : ''}
        </div>
      </div>
    `,
  });
}

export function getUserLocationPin(): L.DivIcon {
  return L.divIcon({
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: `
      <div style="position:relative;width:20px;height:20px;display:flex;align-items:center;justify-content:center;">
        <div style="
          position:absolute;
          width:36px;height:36px;border-radius:50%;
          background:rgba(55,138,221,0.2);
          animation:evPulse 2s ease-in-out infinite;
        "></div>
        <div style="
          width:14px;height:14px;border-radius:50%;
          background:#378ADD;
          border:2.5px solid white;
          box-shadow:0 0 0 3px rgba(55,138,221,0.3);
          position:relative;z-index:1;
        "></div>
      </div>
    `,
  });
}

// Inject keyframe animation once
if (typeof document !== 'undefined') {
  const styleId = 'eventra-map-keyframes';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes evPulse {
        0%,100% { transform: scale(1); opacity: 0.5; }
        50%      { transform: scale(1.4); opacity: 0.15; }
      }
    `;
    document.head.appendChild(style);
  }
}
