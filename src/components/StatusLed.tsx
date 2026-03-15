import { cn } from "@/lib/utils";
import type { ClientStatus } from "@/data/mock-data";

const ledClass: Record<ClientStatus, string> = {
  online: "status-led-online",
  los: "status-led-los",
  "high-signal": "status-led-high-signal",
  offline: "status-led-offline",
};

const labelMap: Record<ClientStatus, string> = {
  online: "Online",
  los: "LOS",
  "high-signal": "Sinal Alto",
  offline: "Offline",
};

interface StatusLedProps {
  status: ClientStatus;
  showLabel?: boolean;
  className?: string;
}

export function StatusLed({ status, showLabel = false, className }: StatusLedProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span className={cn("status-led", ledClass[status])} />
      {showLabel && (
        <span className="text-xs text-muted-foreground">{labelMap[status]}</span>
      )}
    </div>
  );
}
