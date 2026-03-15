import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { StatusLed } from "@/components/StatusLed";
import type { CTO, CTOClient } from "@/data/mock-data";
import { toast } from "sonner";
import { ArrowRightLeft } from "lucide-react";

interface PortGridProps {
  cto: CTO;
  onUpdate: (cto: CTO) => void;
}

export function PortGrid({ cto, onUpdate }: PortGridProps) {
  const [selectedPort, setSelectedPort] = useState<number | null>(null);
  const [swapping, setSwapping] = useState(false);

  const getClient = (port: number) => cto.clients.find((c) => c.port === port);

  const handlePortClick = useCallback(
    (port: number) => {
      if (swapping) return;

      if (selectedPort === null) {
        // Only select occupied ports
        if (getClient(port)) {
          setSelectedPort(port);
        }
        return;
      }

      if (selectedPort === port) {
        setSelectedPort(null);
        return;
      }

      // Execute move/swap
      const sourceClient = getClient(selectedPort);
      const destClient = getClient(port);

      if (!sourceClient) {
        setSelectedPort(null);
        return;
      }

      setSwapping(true);

      setTimeout(() => {
        const updatedClients = [...cto.clients];

        if (!destClient) {
          // Move direto — porta livre
          const idx = updatedClients.findIndex((c) => c.id === sourceClient.id);
          updatedClients[idx] = { ...sourceClient, port };
          toast.success(`${sourceClient.name} movido para porta ${String(port).padStart(2, "0")}`);
        } else {
          // Smart Swap
          const srcIdx = updatedClients.findIndex((c) => c.id === sourceClient.id);
          const destIdx = updatedClients.findIndex((c) => c.id === destClient.id);
          updatedClients[srcIdx] = { ...sourceClient, port };
          updatedClients[destIdx] = { ...destClient, port: selectedPort };
          toast.success(
            `Swap: ${sourceClient.name} ↔ ${destClient.name} (portas ${String(selectedPort).padStart(2, "0")} ↔ ${String(port).padStart(2, "0")})`
          );
        }

        onUpdate({ ...cto, clients: updatedClients });
        setSelectedPort(null);
        setSwapping(false);
      }, 800);
    },
    [selectedPort, cto, swapping, onUpdate]
  );

  const cols = cto.totalPorts <= 8 ? 2 : 2;

  return (
    <div className="space-y-3">
      {selectedPort && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-sm"
        >
          <ArrowRightLeft className="w-4 h-4 text-primary" />
          <span className="text-primary">
            Porta {String(selectedPort).padStart(2, "0")} selecionada — toque na porta destino
          </span>
        </motion.div>
      )}

      <div className={`grid grid-cols-${cols} gap-2`}>
        <AnimatePresence mode="popLayout">
          {Array.from({ length: cto.totalPorts }, (_, i) => i + 1).map((port) => {
            const client = getClient(port);
            const isSelected = selectedPort === port;
            const isSwapTarget = selectedPort !== null && selectedPort !== port;
            const isEmpty = !client;

            return (
              <motion.button
                key={port}
                layout
                onClick={() => handlePortClick(port)}
                disabled={swapping}
                className={cn(
                  "relative flex flex-col p-3 rounded-lg border text-left transition-all touch-target",
                  "bg-card hover:bg-card/80",
                  isEmpty && "border-border/50 opacity-60",
                  !isEmpty && "border-border",
                  isSelected && "glow-cyan border-primary bg-primary/5",
                  isSwapTarget && !isEmpty && "border-primary/30 hover:border-primary/60",
                  isSwapTarget && isEmpty && "border-dashed border-primary/40 hover:border-primary/60 opacity-100",
                  swapping && (isSelected || (selectedPort !== null && port === selectedPort)) && "animate-swap-pulse"
                )}
              >
                {/* Port number */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-semibold text-muted-foreground">
                    P{String(port).padStart(2, "0")}
                  </span>
                  {client && <StatusLed status={client.status} />}
                </div>

                {client ? (
                  <>
                    <span className="text-sm font-medium text-foreground truncate">
                      {client.name}
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-xs text-muted-foreground">
                        {client.signal !== 0 ? `${client.signal} dBm` : "—"}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground/60">
                        {client.id}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground/50 italic">Livre</span>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
