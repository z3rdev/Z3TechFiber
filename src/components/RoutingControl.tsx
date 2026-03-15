import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface RoutingControlProps {
  from: [number, number];
  to: [number, number];
  onClear: () => void;
}

export function RoutingControl({ from, to, onClear }: RoutingControlProps) {
  const map = useMap();
  const routingRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map || !from || !to) return;

    // Clean previous route
    if (routingRef.current) {
      map.removeControl(routingRef.current);
    }

    const control = L.Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [
          { color: "#059669", weight: 5, opacity: 0.8 },
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 10,
      },
      show: false, // hide text instructions
      // @ts-ignore
      createMarker: () => null, // don't create default markers
    });

    control.addTo(map);
    routingRef.current = control;

    // Hide the routing container that may appear
    const containers = document.querySelectorAll(".leaflet-routing-container");
    containers.forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });

    return () => {
      if (routingRef.current) {
        map.removeControl(routingRef.current);
        routingRef.current = null;
      }
    };
  }, [map, from, to]);

  return null;
}
