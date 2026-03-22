import { useState } from "react";
import { FIBER_COLORS, type FiberFusion, type FiberColorId, type FusionDestination } from "@/data/fusion-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mockCTOs } from "@/data/mock-data";
import { ArrowRight, ArrowLeft, MapPin, Building2, Navigation, X } from "lucide-react";

interface FiberRowProps {
  fiber: FiberFusion;
  onChange: (fiber: FiberFusion) => void;
}

function ColorDot({ colorId }: { colorId: FiberColorId }) {
  const color = FIBER_COLORS.find((c) => c.id === colorId);
  return (
    <span
      className="inline-block w-3.5 h-3.5 rounded-full border border-border flex-shrink-0"
      style={{ backgroundColor: color?.hex }}
    />
  );
}

function DestinationLabel({ dest }: { dest?: FusionDestination }) {
  if (!dest) return null;
  const label =
    dest.type === "cto"
      ? dest.ctoName || dest.ctoId || "CTO"
      : dest.type === "reference"
        ? dest.label || "Ref."
        : dest.lat && dest.lng
          ? `${dest.lat.toFixed(3)}…`
          : "GPS";
  return (
    <span className="text-[9px] text-primary truncate max-w-[80px] block leading-tight">{label}</span>
  );
}

export function FiberRow({ fiber, onChange }: FiberRowProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const setDestOverride = (dest: FusionDestination | undefined) => {
    onChange({ ...fiber, destinationOverride: dest });
    setPopoverOpen(false);
  };

  const handleCTOSelect = (ctoId: string) => {
    const cto = mockCTOs.find((c) => c.id === ctoId);
    setDestOverride({ type: "cto", ctoId, ctoName: cto?.name, lat: cto?.lat, lng: cto?.lng });
  };

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors">
      <span className="text-xs font-mono text-muted-foreground w-6 text-right flex-shrink-0">
        {fiber.fiberIndex}
      </span>

      {/* Origin color */}
      <Select
        value={fiber.originColor}
        onValueChange={(v) => onChange({ ...fiber, originColor: v as FiberColorId })}
      >
        <SelectTrigger className="h-8 w-[100px] text-xs">
          <div className="flex items-center gap-1.5">
            <ColorDot colorId={fiber.originColor} />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {FIBER_COLORS.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                {c.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Direction toggle */}
      <button
        onClick={() => onChange({ ...fiber, direction: fiber.direction === "A→B" ? "B→A" : "A→B" })}
        className="flex items-center gap-1 px-1.5 h-8 rounded border border-border text-xs font-mono hover:bg-secondary transition-colors flex-shrink-0"
        title="Alternar sentido"
      >
        {fiber.direction === "A→B" ? (
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
        ) : (
          <ArrowLeft className="w-3.5 h-3.5 text-primary" />
        )}
      </button>

      {/* Destination color */}
      <Select
        value={fiber.destinationColor}
        onValueChange={(v) => onChange({ ...fiber, destinationColor: v as FiberColorId })}
      >
        <SelectTrigger className="h-8 w-[100px] text-xs">
          <div className="flex items-center gap-1.5">
            <ColorDot colorId={fiber.destinationColor} />
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {FIBER_COLORS.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                {c.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Per-fiber destination */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            className={`flex items-center gap-1 h-8 px-1.5 rounded border text-xs transition-colors flex-shrink-0 min-w-[32px] ${
              fiber.destinationOverride
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border hover:bg-secondary text-muted-foreground"
            }`}
            title="Definir destino desta fibra"
          >
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {fiber.destinationOverride ? (
              <DestinationLabel dest={fiber.destinationOverride} />
            ) : null}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2 space-y-2" align="end">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium px-1">
            Destino da fibra {fiber.fiberIndex}
          </p>

          {/* Quick CTO select */}
          <Select value={fiber.destinationOverride?.ctoId || ""} onValueChange={handleCTOSelect}>
            <SelectTrigger className="h-8 text-xs">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3 h-3" />
                <SelectValue placeholder="Selecionar CTO" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {mockCTOs.map((cto) => (
                <SelectItem key={cto.id} value={cto.id}>
                  {cto.id} — {cto.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reference point */}
          <div className="flex items-center gap-1.5">
            <Navigation className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <Input
              placeholder="Ponto de referência..."
              className="h-7 text-xs"
              value={fiber.destinationOverride?.type === "reference" ? fiber.destinationOverride.label || "" : ""}
              onChange={(e) =>
                setDestOverride({ type: "reference", label: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && setPopoverOpen(false)}
            />
          </div>

          {/* GPS */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full text-xs h-7 gap-1.5"
            onClick={() => {
              navigator.geolocation?.getCurrentPosition(
                (pos) =>
                  setDestOverride({
                    type: "location",
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                  }),
                () => {},
                { enableHighAccuracy: true }
              );
            }}
          >
            <MapPin className="w-3 h-3" /> Usar GPS
          </Button>

          {/* Clear */}
          {fiber.destinationOverride && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full text-xs h-7 text-destructive gap-1.5"
              onClick={() => setDestOverride(undefined)}
            >
              <X className="w-3 h-3" /> Remover destino
            </Button>
          )}
        </PopoverContent>
      </Popover>

      {/* Attenuation */}
      <Input
        type="number"
        step="0.01"
        placeholder="dB"
        value={fiber.spliceAttenuation ?? ""}
        onChange={(e) => onChange({ ...fiber, spliceAttenuation: e.target.value ? parseFloat(e.target.value) : undefined })}
        className="h-8 w-16 text-xs font-mono"
      />
    </div>
  );
}
