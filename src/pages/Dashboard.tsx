import { mockMetrics, mockCTOs } from "@/data/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { StatusLed } from "@/components/StatusLed";
import {
  Hexagon, Wifi, AlertTriangle, WifiOff,
  Signal, Server
} from "lucide-react";

const Dashboard = () => {
  const m = mockMetrics;

  const statCards = [
    { label: "Total de CTOs", value: m.totalCTOs, icon: Hexagon, accent: "text-primary" },
    { label: "Portas Ativas", value: `${m.activePorts}/${m.totalPorts}`, icon: Server, accent: "text-primary" },
    { label: "Clientes Online", value: m.onlineClients, icon: Wifi, accent: "text-status-online" },
    { label: "Alertas LOS", value: m.losAlerts, icon: AlertTriangle, accent: "text-status-los" },
    { label: "Sinal Alto", value: m.highSignalAlerts, icon: Signal, accent: "text-status-high-signal" },
    { label: "Clientes Offline", value: m.offlineClients, icon: WifiOff, accent: "text-status-offline" },
  ];

  return (
    <div className="p-5 md:p-8 space-y-8 overflow-y-auto h-full">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da rede de fibra óptica</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <card.icon className={`w-4 h-4 ${card.accent}`} />
                </div>
                <span className="text-2xl font-semibold font-mono text-foreground">
                  {card.value}
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTO list */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-4">CTOs da Região</h2>
        <div className="space-y-2">
          {mockCTOs.map((cto) => {
            const losCount = cto.clients.filter((c) => c.status === "los").length;
            const onlineCount = cto.clients.filter((c) => c.status === "online").length;
            const occupancy = Math.round((cto.clients.length / cto.totalPorts) * 100);

            return (
              <Card key={cto.id} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <Hexagon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-foreground">{cto.id}</span>
                      {losCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-destructive/10 text-destructive font-medium">
                          {losCount} LOS
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{cto.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0 space-y-1">
                    <p className="font-mono text-sm font-medium text-foreground">
                      {cto.clients.length}/{cto.totalPorts}
                    </p>
                    <div className="flex items-center gap-1.5 justify-end">
                      <StatusLed status="online" />
                      <span className="text-[11px] text-muted-foreground">{onlineCount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
