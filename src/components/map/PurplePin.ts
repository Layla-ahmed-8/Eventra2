import L from 'leaflet';

/**
 * Branded venue pin — violet SVG teardrop shape.
 * Used for all event venue markers across the app.
 */
export const purplePin = L.divIcon({
  className: '',
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -38],
  html: `
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#6C4CF1"/>
      <circle cx="14" cy="14" r="6" fill="white"/>
    </svg>
  `,
});

/**
 * Small blue dot representing the user's current position.
 * Blue is universally understood as "you are here".
 */
export const userDot = L.divIcon({
  className: '',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  html: `
    <div style="
      width:14px;height:14px;border-radius:50%;
      background:#378ADD;
      border:2.5px solid white;
      box-shadow:0 0 0 3px rgba(55,138,221,0.3);
    "></div>
  `,
});
