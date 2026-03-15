import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface RouteAnimationProps {
  coordinates: [number, number][];
}

const movingIcon = L.divIcon({
  className: "moving-marker",
  html: `
    <div style="width: 20px; height: 20px; position: relative;">
      <div style="
        width: 20px; height: 20px; border-radius: 50%;
        background: #059669; border: 3px solid #ffffff;
        box-shadow: 0 0 12px rgba(5,150,105,0.5), 0 0 24px rgba(5,150,105,0.2);
      "></div>
      <div style="
        position: absolute; inset: -6px; border-radius: 50%;
        border: 2px solid rgba(5,150,105,0.3);
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export function RouteAnimation({ coordinates }: RouteAnimationProps) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!map || coordinates.length < 2) return;

    const marker = L.marker(coordinates[0], { icon: movingIcon }).addTo(map);
    markerRef.current = marker;

    let currentIndex = 0;
    const totalPoints = coordinates.length;
    const duration = 8000; // 8 seconds total
    const intervalMs = duration / totalPoints;

    const animate = () => {
      if (currentIndex >= totalPoints) {
        currentIndex = 0; // loop
      }
      marker.setLatLng(coordinates[currentIndex]);
      currentIndex++;
      animationRef.current = window.setTimeout(animate, intervalMs);
    };

    animate();

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
      if (markerRef.current) map.removeLayer(markerRef.current);
    };
  }, [map, coordinates]);

  return null;
}
