import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockCTOs } from "@/data/mock-data";
import type { FusionDestination, DestinationType } from "@/data/fusion-data";
import { MapPin, Building2, Navigation, X } from "lucide-react";

interface DestinationSelectorProps {
  value?: FusionDestination;
  onChange: (dest: FusionDestination | undefined) => void;
  label?: string;
  compact?: boolean;
}

const DEST_TYPES: { type: DestinationType; label: string; icon: typeof MapPin }[] = [
  { type: "cto", label: "CTO", icon: Building2 },
  { type: "reference", label: "Referência", icon: Navigation },
  { type: "location", label: "Coordenadas", icon: MapPin },
];

export function DestinationSelector({ value, onChange, label = "Destino / Sentido", compact }: DestinationSelectorProps) {
  const [destType, setDestType] = useState<DestinationType>(value?.type || "cto");

  const handleTypeChange = (type: DestinationType) => {
    setDestType(type);
    onChange({ type });
  };

  const handleCTOSelect = (ctoId: string) => {
    const cto = mockCTOs.find((c) => c.id === ctoId);
    onChange({
      type: "cto",
      ctoId,
      ctoName: cto?.name,
      lat: cto?.lat,
      lng: cto?.lng,
    });
  };

  const handleReferenceChange = (text: string) => {
    onChange({
      type: "reference",
      label: text,
      lat: value?.lat,
      lng: value?.lng,
    });
  };

  const handleLatChange = (lat: string) => {
    onChange({
      ...value,
      type: destType,
      lat: lat ? parseFloat(lat) : undefined,
    } as FusionDestination);
  };

  const handleLngChange = (lng: string) => {
    onChange({
      ...value,
      type: destType,
      lng: lng ? parseFloat(lng) : undefined,
    } as FusionDestination);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          ...value,
          type: destType,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        } as FusionDestination);
      },
      () => {},
      { enableHighAccuracy: true }
    );
  };

  const getDestinationLabel = () => {
    if (!value) return null;
    if (value.type === "cto" && value.ctoName) return `${value.ctoId} — ${value.ctoName}`;
    if (value.type === "reference" && value.label) return value.label;
    if (value.type === "location" && value.lat && value.lng)
      return `${value.lat.toFixed(6)}, ${value.lng.toFixed(6)}`;
    return null;
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</Label>
          {getDestinationLabel() && (
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4">
              {getDestinationLabel()}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="text-xs font-medium">{label}</Label>

      {/* Type selector */}
      <div className="flex gap-1.5">
        {DEST_TYPES.map(({ type, label: tLabel, icon: Icon }) => (
          <Button
            key={type}
            type="button"
            variant={destType === type ? "default" : "outline"}
            size="sm"
            className="flex-1 gap-1.5 text-xs h-8"
            onClick={() => handleTypeChange(type)}
          >
            <Icon className="w-3.5 h-3.5" />
            {tLabel}
          </Button>
        ))}
      </div>

      {/* Type-specific fields */}
      {destType === "cto" && (
        <Select value={value?.ctoId || ""} onValueChange={handleCTOSelect}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue placeholder="Selecione a CTO de destino" />
          </SelectTrigger>
          <SelectContent>
            {mockCTOs.map((cto) => (
              <SelectItem key={cto.id} value={cto.id}>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3 h-3 text-muted-foreground" />
                  <span className="font-mono text-xs">{cto.id}</span>
                  <span className="text-muted-foreground">— {cto.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {destType === "reference" && (
        <div className="space-y-2">
          <Input
            placeholder="Ex: Prédio Comercial XYZ, Poste #42..."
            value={value?.label || ""}
            onChange={(e) => handleReferenceChange(e.target.value)}
            className="h-9 text-xs"
          />
          <div className="flex gap-2">
            <Input
              type="number"
              step="any"
              placeholder="Latitude (opcional)"
              value={value?.lat ?? ""}
              onChange={(e) => handleLatChange(e.target.value)}
              className="h-8 text-xs font-mono flex-1"
            />
            <Input
              type="number"
              step="any"
              placeholder="Longitude (opcional)"
              value={value?.lng ?? ""}
              onChange={(e) => handleLngChange(e.target.value)}
              className="h-8 text-xs font-mono flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleGetLocation} className="h-8 px-2" title="Usar GPS">
              <MapPin className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}

      {destType === "location" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="number"
              step="any"
              placeholder="Latitude"
              value={value?.lat ?? ""}
              onChange={(e) => handleLatChange(e.target.value)}
              className="h-9 text-xs font-mono flex-1"
            />
            <Input
              type="number"
              step="any"
              placeholder="Longitude"
              value={value?.lng ?? ""}
              onChange={(e) => handleLngChange(e.target.value)}
              className="h-9 text-xs font-mono flex-1"
            />
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleGetLocation} className="w-full gap-1.5 text-xs h-8">
            <MapPin className="w-3.5 h-3.5" />
            Capturar localização atual (GPS)
          </Button>
          <Input
            placeholder="Nome do local (opcional)"
            value={value?.label || ""}
            onChange={(e) => onChange({ ...value!, label: e.target.value })}
            className="h-8 text-xs"
          />
        </div>
      )}

      {/* Clear */}
      {value && getDestinationLabel() && (
        <div className="flex items-center gap-2 p-2 rounded-md bg-primary/5 border border-primary/10">
          <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span className="text-xs text-foreground flex-1 truncate">{getDestinationLabel()}</span>
          <Button type="button" variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => onChange(undefined)}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function getDestinationDisplayName(dest?: FusionDestination): string {
  if (!dest) return "—";
  if (dest.type === "cto") return dest.ctoName ? `${dest.ctoId} — ${dest.ctoName}` : dest.ctoId || "CTO";
  if (dest.type === "reference") return dest.label || "Referência";
  if (dest.type === "location") {
    if (dest.label) return dest.label;
    if (dest.lat && dest.lng) return `${dest.lat.toFixed(5)}, ${dest.lng.toFixed(5)}`;
    return "Localização";
  }
  return "—";
}
