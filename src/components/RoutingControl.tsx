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
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  onRouteFound?: (info: RouteInfo) => void;
  onRouteCoordinates?: (coords: [number, number][]) => void;
}

export function RoutingControl({ fromLat, fromLng, toLat, toLng, onRouteFound, onRouteCoordinates }: RoutingControlProps) {
  const map = useMap();
  const routingRef = useRef<L.Routing.Control | null>(null);
  const onRouteFoundRef = useRef(onRouteFound);
  const onRouteCoordsRef = useRef(onRouteCoordinates);
  onRouteFoundRef.current = onRouteFound;
  onRouteCoordsRef.current = onRouteCoordinates;

  useEffect(() => {
    if (!map) return;

    if (routingRef.current) {
      map.removeControl(routingRef.current);
      routingRef.current = null;
    }

    const control = L.Routing.control({
      waypoints: [L.latLng(fromLat, fromLng), L.latLng(toLat, toLng)],
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
      if (route) {
        if (onRouteFoundRef.current) {
          const distanceKm = Math.round((route.summary.totalDistance / 1000) * 10) / 10;
          const durationMin = Math.round(route.summary.totalTime / 60);

          let streetName = "";
          if (route.instructions && route.instructions.length > 0) {
            for (const inst of route.instructions) {
              if (inst.road && inst.road.trim()) {
                streetName = inst.road.trim();
                break;
              }
            }
          }

          onRouteFoundRef.current({ distanceKm, durationMin, streetName });
        }

        if (onRouteCoordsRef.current && route.coordinates) {
          const coords: [number, number][] = route.coordinates.map((c: any) => [c.lat, c.lng]);
          onRouteCoordsRef.current(coords);
        }
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
  }, [map, fromLat, fromLng, toLat, toLng]);

  return null;
}
