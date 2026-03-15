import { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockCTOs, type CTO } from "@/data/mock-data";
import { CTODrawer } from "@/components/CTODrawer";

// Fix leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Custom CTO marker icon
function createCTOIcon(activePorts: number, totalPorts: number, hasLOS: boolean) {
  const ratio = activePorts / totalPorts;
  const color = hasLOS ? "#ef4444" : ratio > 0.8 ? "#f59e0b" : "#00ffff";

  return L.divIcon({
    className: "cto-marker",
    html: `
      <div style="
        width: 40px; height: 46px; position: relative; cursor: pointer;
        filter: drop-shadow(0 0 6px ${color}40);
      ">
        <svg viewBox="0 0 40 46" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2 L36 12 L36 32 L20 42 L4 32 L4 12 Z" 
                fill="#0a0a0b" stroke="${color}" stroke-width="2"/>
        </svg>
        <div style="
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; padding-top: 2px;
        ">
          <span style="font-size: 10px; font-weight: 700; color: ${color}; font-family: 'IBM Plex Mono', monospace;">
            ${activePorts}/${totalPorts}
          </span>
        </div>
      </div>
    `,
    iconSize: [40, 46],
    iconAnchor: [20, 23],
  });
}

// User location marker
const userIcon = L.divIcon({
  className: "user-marker",
  html: `
    <div style="width: 20px; height: 20px; position: relative;">
      <div style="
        width: 20px; height: 20px; border-radius: 50%;
        background: #00ffff; border: 3px solid #0a0a0b;
        box-shadow: 0 0 12px #00ffff80;
      "></div>
      <div style="
        position: absolute; inset: -8px; border-radius: 50%;
        border: 2px solid #00ffff30;
        animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function LocationFinder({ onLocationFound }: { onLocationFound: (lat: number, lng: number) => void }) {
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
    map.on("locationfound", (e) => {
      onLocationFound(e.latlng.lat, e.latlng.lng);
    });
    map.on("locationerror", () => {
      // Fallback to São Paulo center
      map.setView([-23.5505, -46.6333], 15);
    });
  }, [map, onLocationFound]);

  return null;
}

const MapView = () => {
  const [ctos, setCTOs] = useState<CTO[]>(mockCTOs);
  const [selectedCTO, setSelectedCTO] = useState<CTO | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

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

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[-23.5505, -46.6333]}
        zoom={15}
        className="h-full w-full z-0"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <LocationFinder onLocationFound={handleLocationFound} />

        {userLocation && (
          <Marker position={userLocation} icon={userIcon} />
        )}

        {ctos.map((cto) => {
          const hasLOS = cto.clients.some((c) => c.status === "los");
          const icon = createCTOIcon(cto.clients.length, cto.totalPorts, hasLOS);

          return (
            <Marker
              key={cto.id}
              position={[cto.lat, cto.lng]}
              icon={icon}
              eventHandlers={{
                click: () => handleCTOClick(cto),
              }}
            />
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 space-y-1.5">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Legenda</p>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-status-high-signal" />
          <span className="text-xs text-muted-foreground">&gt;80% ocupada</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-status-los" />
          <span className="text-xs text-muted-foreground">Com LOS</span>
        </div>
      </div>

      <CTODrawer
        cto={selectedCTO}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onUpdate={handleCTOUpdate}
      />
    </div>
  );
};

export default MapView;
