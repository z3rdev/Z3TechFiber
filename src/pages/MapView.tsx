import { useEffect, useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockCTOs, type CTO } from "@/data/mock-data";
import { CTODrawer } from "@/components/CTODrawer";
import { RoutingControl, type RouteInfo } from "@/components/RoutingControl";
import { RouteAnimation } from "@/components/RouteAnimation";
import { OnboardingModal } from "@/components/OnboardingModal";
import { useCTOSearch } from "@/contexts/CTOSearchContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { X, MapPin, Clock, Route, Zap } from "lucide-react";
import { toast } from "sonner";

function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

delete (L.Icon.Default.prototype as any)._getIconUrl;

function createCTOIcon(activePorts: number, totalPorts: number, hasLOS: boolean) {
  const color = hasLOS ? "#c53030" : activePorts / totalPorts > 0.8 ? "#d69e2e" : "#059669";
  return L.divIcon({
    className: "cto-marker",
    html: `
      <div style="
        width: 36px; height: 42px; position: relative; cursor: pointer;
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.15));
      ">
        <svg viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2 L32 11 L32 29 L18 38 L4 29 L4 11 Z" 
                fill="#ffffff" stroke="${color}" stroke-width="1.5" opacity="0.97"/>
        </svg>
        <div style="
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; padding-top: 1px;
        ">
          <span style="font-size: 9px; font-weight: 600; color: ${color}; font-family: 'JetBrains Mono', monospace; letter-spacing: -0.5px;">
            ${activePorts}/${totalPorts}
          </span>
        </div>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 21],
  });
}

const userIcon = L.divIcon({
  className: "user-marker",
  html: `
    <div style="width: 16px; height: 16px; position: relative;">
      <div style="
        width: 16px; height: 16px; border-radius: 50%;
        background: #059669; border: 2.5px solid #ffffff;
        box-shadow: 0 0 6px rgba(5,150,105,0.3);
      "></div>
    </div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function LocationFinder({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
    map.on("locationfound", (e) => onLocationFound(e.latlng.lat, e.latlng.lng));
    map.on("locationerror", () => map.setView([-23.5505, -46.6333], 15));
  }, [map, onLocationFound]);
  return null;
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 17, { duration: 1 });
  }, [map, lat, lng]);
  return null;
}

const MapView = () => {
  const [ctos, setCTOs] = useState<CTO[]>(mockCTOs);
  const [selectedCTO, setSelectedCTO] = useState<CTO | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [routeTarget, setRouteTarget] = useState<CTO | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(
    () => !localStorage.getItem("tech-fiber-onboarded")
  );
  const { selectedFromSearch, clearSelection } = useCTOSearch();
  const { performanceMode, performanceRadius } = useSettings();

  // Filter CTOs based on performance mode
  const visibleCTOs = useMemo(() => {
    if (!performanceMode || !userLocation) return ctos;
    return ctos.filter(
      (cto) => getDistanceMeters(userLocation[0], userLocation[1], cto.lat, cto.lng) <= performanceRadius
    );
  }, [ctos, performanceMode, performanceRadius, userLocation]);

  // React to search selection
  useEffect(() => {
    if (selectedFromSearch) {
      setSelectedCTO(selectedFromSearch);
      setDrawerOpen(true);
      setFlyTarget({ lat: selectedFromSearch.lat, lng: selectedFromSearch.lng });
      clearSelection();
    }
  }, [selectedFromSearch, clearSelection]);

  const handleLocationFound = useCallback((lat: number, lng: number) => {
    setUserLocation([lat, lng]);
  }, []);

  const handleCTOClick = (cto: CTO) => {
    setSelectedCTO(cto);
    setDrawerOpen(true);
  };

  const handleCTOUpdate = (updated: CTO) => {
    setCTOs((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setSelectedCTO(updated);
  };

  const handleNavigate = (cto: CTO) => {
    if (!userLocation) {
      toast.error("Localização não disponível. Ative o GPS.");
      return;
    }
    setRouteTarget(cto);
    setRouteInfo(null);
    setDrawerOpen(false);
    toast.success(`Rota traçada até ${cto.name}`);
  };

  const handleClearRoute = () => {
    setRouteTarget(null);
    setRouteInfo(null);
    setRouteCoords([]);
  };

  return (
    <div className="absolute inset-0">
      <MapContainer
        center={[-23.5505, -46.6333]}
        zoom={15}
        className="h-full w-full z-0"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <LocationFinder onLocationFound={handleLocationFound} />
        {flyTarget && <FlyTo lat={flyTarget.lat} lng={flyTarget.lng} />}
        {userLocation && <Marker position={userLocation} icon={userIcon} />}

        {/* Performance mode radius circle */}
        {performanceMode && userLocation && (
          <Circle
            center={userLocation}
            radius={performanceRadius}
            pathOptions={{
              color: "#059669",
              fillColor: "#059669",
              fillOpacity: 0.06,
              weight: 1.5,
              dashArray: "6 4",
            }}
          />
        )}

        {visibleCTOs.map((cto) => {
          const hasLOS = cto.clients.some((c) => c.status === "los");
          return (
            <Marker
              key={cto.id}
              position={[cto.lat, cto.lng]}
              icon={createCTOIcon(cto.clients.length, cto.totalPorts, hasLOS)}
              eventHandlers={{ click: () => handleCTOClick(cto) }}
            />
          );
        })}

        {/* Routing */}
        {routeTarget && userLocation && (
          <RoutingControl
            fromLat={userLocation[0]}
            fromLng={userLocation[1]}
            toLat={routeTarget.lat}
            toLng={routeTarget.lng}
           onRouteFound={setRouteInfo}
            onRouteCoordinates={setRouteCoords}
          />
        )}

        {/* Animated marker on route */}
        {routeCoords.length > 1 && <RouteAnimation coordinates={routeCoords} />}
      </MapContainer>

      {/* Route info bar */}
      {routeTarget && (
        <div className="absolute top-4 left-4 right-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-sm space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                Navegando até {routeTarget.name}
              </p>
              <p className="text-xs text-muted-foreground font-mono">{routeTarget.id}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearRoute}
              className="gap-1.5 flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              Cancelar
            </Button>
          </div>

          {routeInfo && (
            <div className="flex items-center gap-4 pt-1 border-t border-border">
              {routeInfo.streetName && (
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="text-xs text-foreground truncate">{routeInfo.streetName}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Route className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-xs font-mono text-foreground">{routeInfo.distanceKm} km</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span className="text-xs font-mono text-foreground">
                  {routeInfo.durationMin >= 60
                    ? `${Math.floor(routeInfo.durationMin / 60)}h ${routeInfo.durationMin % 60}min`
                    : routeInfo.durationMin < 1
                      ? "<1 min"
                      : `${routeInfo.durationMin} min`}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance mode badge */}
      {performanceMode && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-primary/10 border border-primary/30 rounded-md px-3 py-1.5 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">
            Desempenho · {performanceRadius}m · {visibleCTOs.length}/{ctos.length} CTOs
          </span>
        </div>
      )}

      <CTODrawer
        cto={selectedCTO}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onUpdate={handleCTOUpdate}
        onNavigate={handleNavigate}
        hasUserLocation={!!userLocation}
      />

      <OnboardingModal open={showOnboarding} onOpenChange={setShowOnboarding} />
    </div>
  );
};

export default MapView;
