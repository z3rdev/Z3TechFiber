import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortGrid } from "@/components/PortGrid";
import { StatusLed } from "@/components/StatusLed";
import type { CTO } from "@/data/mock-data";
import { Hexagon, Navigation } from "lucide-react";

interface CTODrawerProps {
  cto: CTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (cto: CTO) => void;
  onNavigate?: (cto: CTO) => void;
  hasUserLocation?: boolean;
}

export function CTODrawer({ cto, open, onOpenChange, onUpdate, onNavigate, hasUserLocation }: CTODrawerProps) {
  if (!cto) return null;

  const activePorts = cto.clients.length;
  const freePorts = cto.totalPorts - activePorts;
  const losCount = cto.clients.filter((c) => c.status === "los").length;
  const onlineCount = cto.clients.filter((c) => c.status === "online").length;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Hexagon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <DrawerTitle className="text-foreground">{cto.id}</DrawerTitle>
              <DrawerDescription className="text-muted-foreground">{cto.name}</DrawerDescription>
            </div>
            <Button
              size="sm"
              onClick={() => onNavigate?.(cto)}
              disabled={!hasUserLocation}
              className="gap-1.5"
            >
              <Navigation className="w-4 h-4" />
              Ir até
            </Button>
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <Badge variant="outline" className="font-mono text-xs border-border">
              {activePorts}/{cto.totalPorts} Portas
            </Badge>
            <div className="flex items-center gap-1.5">
              <StatusLed status="online" />
              <span className="text-xs text-muted-foreground">{onlineCount}</span>
            </div>
            {losCount > 0 && (
              <div className="flex items-center gap-1.5">
                <StatusLed status="los" />
                <span className="text-xs text-destructive">{losCount} LOS</span>
              </div>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {freePorts} livre{freePorts !== 1 ? "s" : ""}
            </span>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-6 overflow-y-auto">
          <PortGrid cto={cto} onUpdate={onUpdate} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
