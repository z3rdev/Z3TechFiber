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
        if (getClient(port)) setSelectedPort(port);
        return;
      }

      if (selectedPort === port) {
        setSelectedPort(null);
        return;
      }

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
          const idx = updatedClients.findIndex((c) => c.id === sourceClient.id);
          updatedClients[idx] = { ...sourceClient, port };
          toast.success(`${sourceClient.name} movido para porta ${String(port).padStart(2, "0")}`);
        } else {
          const srcIdx = updatedClients.findIndex((c) => c.id === sourceClient.id);
          const destIdx = updatedClients.findIndex((c) => c.id === destClient.id);
          updatedClients[srcIdx] = { ...sourceClient, port };
          updatedClients[destIdx] = { ...destClient, port: selectedPort };
          toast.success(
            `Swap: ${sourceClient.name} ↔ ${destClient.name}`
          );
        }

        onUpdate({ ...cto, clients: updatedClients });
        setSelectedPort(null);
        setSwapping(false);
      }, 600);
    },
    [selectedPort, cto, swapping, onUpdate]
  );

  return (
    <div className="space-y-3">
      {selectedPort && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/8 border border-primary/20 text-xs"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-primary" />
          <span className="text-foreground">
            Porta <span className="font-mono font-semibold">{String(selectedPort).padStart(2, "0")}</span> selecionada — toque no destino
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-2">
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
                  "relative flex flex-col p-3 rounded-md border text-left transition-all",
                  "bg-secondary/50 hover:bg-secondary/80",
                  isEmpty && "border-border/40 opacity-50",
                  !isEmpty && "border-border",
                  isSelected && "border-primary bg-primary/5 shadow-sm",
                  isSwapTarget && !isEmpty && "border-border hover:border-primary/40",
                  isSwapTarget && isEmpty && "border-dashed border-primary/30 hover:border-primary/50 opacity-100",
                  swapping && isSelected && "animate-swap-pulse"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] font-medium text-muted-foreground">
                    P{String(port).padStart(2, "0")}
                  </span>
                  {client && <StatusLed status={client.status} />}
                </div>

                {client ? (
                  <>
                    <span className="text-xs font-medium text-foreground truncate leading-tight">
                      {client.name}
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {client.signal !== 0 ? `${client.signal} dBm` : "—"}
                      </span>
                      <span className="font-mono text-[9px] text-muted-foreground/50">
                        {client.id}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-[11px] text-muted-foreground/40">Livre</span>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
