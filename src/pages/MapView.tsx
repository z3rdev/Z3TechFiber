import { useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockCTOs, type CTO } from "@/data/mock-data";
import { CTODrawer } from "@/components/CTODrawer";

delete (L.Icon.Default.prototype as any)._getIconUrl;

function createCTOIcon(activePorts: number, totalPorts: number, hasLOS: boolean) {
  const color = hasLOS ? "#c53030" : activePorts / totalPorts > 0.8 ? "#d69e2e" : "#059669";
  return L.divIcon({
    className: "cto-marker",
    html: `
      <div style="
        width: 36px; height: 42px; position: relative; cursor: pointer;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      ">
        <svg viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2 L32 11 L32 29 L18 38 L4 29 L4 11 Z" 
                fill="#1a202c" stroke="${color}" stroke-width="1.5" opacity="0.95"/>
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
        background: #059669; border: 2.5px solid #1a202c;
        box-shadow: 0 0 8px rgba(5,150,105,0.4);
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
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <LocationFinder onLocationFound={handleLocationFound} />
        {userLocation && <Marker position={userLocation} icon={userIcon} />}
        {ctos.map((cto) => {
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
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-card/95 backdrop-blur-sm border border-border rounded-md p-2.5 space-y-1.5">
        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Legenda</p>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-[11px] text-muted-foreground">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-status-high-signal" />
          <span className="text-[11px] text-muted-foreground">&gt;80% ocupada</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-status-los" />
          <span className="text-[11px] text-muted-foreground">Com LOS</span>
        </div>
      </div>

      <CTODrawer cto={selectedCTO} open={drawerOpen} onOpenChange={setDrawerOpen} onUpdate={handleCTOUpdate} />
    </div>
  );
};

export default MapView;
