import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

export interface RouteInfo {
  distanceKm: number;
  durationMin: number;
  streetName: string;
}

interface RoutingControlProps {
  from: [number, number];
  to: [number, number];
  onClear: () => void;
  onRouteFound?: (info: RouteInfo) => void;
}

export function RoutingControl({ from, to, onClear, onRouteFound }: RoutingControlProps) {
  const map = useMap();
  const routingRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map || !from || !to) return;

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
        styles: [{ color: "#059669", weight: 5, opacity: 0.8 }],
        extendToWaypoints: true,
        missingRouteTolerance: 10,
      },
      show: false,
      // @ts-ignore
      createMarker: () => null,
    });

    control.on("routesfound", (e: any) => {
      const route = e.routes?.[0];
      if (route && onRouteFound) {
        const distanceKm = Math.round((route.summary.totalDistance / 1000) * 10) / 10;
        const durationMin = Math.round(route.summary.totalTime / 60);

        // Get the first meaningful street name from instructions
        let streetName = "";
        if (route.instructions && route.instructions.length > 0) {
          for (const inst of route.instructions) {
            if (inst.road && inst.road.trim()) {
              streetName = inst.road.trim();
              break;
            }
          }
        }

        onRouteFound({ distanceKm, durationMin, streetName });
      }
    });

    control.addTo(map);
    routingRef.current = control;

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
