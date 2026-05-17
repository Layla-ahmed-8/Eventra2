import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAppStore } from '../../store/useAppStore';

// Fix Leaflet marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export default function MapDiscovery() {
  const { events, userCoordinates } = useAppStore();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const initialCenter: [number, number] = userCoordinates 
      ? [userCoordinates.lat, userCoordinates.lng] 
      : [30.0444, 31.2357];

    mapRef.current = L.map(mapContainerRef.current).setView(initialCenter, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current);

    const defaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    // Add user marker
    if (userCoordinates) {
      L.marker([userCoordinates.lat, userCoordinates.lng], { icon: defaultIcon })
        .addTo(mapRef.current)
        .bindPopup('You are here');
    }

    // Add event markers
    events.filter(e => !e.location.isVirtual).forEach(event => {
      L.marker([event.location.lat, event.location.lng], { icon: defaultIcon })
        .addTo(mapRef.current!)
        .bindPopup(`<b>${event.title}</b><br>${event.location.venue}`);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [events, userCoordinates]);

  return (
    <div className="relative h-[calc(100vh-120px)] w-full rounded-2xl overflow-hidden border border-border bg-card shadow-xl">
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
