import { FIBER_COLORS, type FiberFusion, type FiberColorId, type FusionDirection } from "@/data/fusion-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft } from "lucide-react";

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

export function FiberRow({ fiber, onChange }: FiberRowProps) {
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
        <SelectTrigger className="h-8 w-[120px] text-xs">
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

      {/* Direction */}
      <button
        onClick={() => onChange({ ...fiber, direction: fiber.direction === "A→B" ? "B→A" : "A→B" })}
        className="flex items-center gap-1 px-2 h-8 rounded border border-border text-xs font-mono hover:bg-secondary transition-colors flex-shrink-0"
        title="Alternar sentido"
      >
        {fiber.direction === "A→B" ? (
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
        ) : (
          <ArrowLeft className="w-3.5 h-3.5 text-primary" />
        )}
        <span className="text-muted-foreground">{fiber.direction}</span>
      </button>

      {/* Destination color */}
      <Select
        value={fiber.destinationColor}
        onValueChange={(v) => onChange({ ...fiber, destinationColor: v as FiberColorId })}
      >
        <SelectTrigger className="h-8 w-[120px] text-xs">
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
