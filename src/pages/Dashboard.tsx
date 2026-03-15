import { mockMetrics, mockCTOs } from "@/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusLed } from "@/components/StatusLed";
import {
  Hexagon, Wifi, AlertTriangle, WifiOff,
  Activity, Signal, Server
} from "lucide-react";

const Dashboard = () => {
  const m = mockMetrics;

  const statCards = [
    { label: "CTOs", value: m.totalCTOs, icon: Hexagon, color: "text-primary" },
    { label: "Portas Ativas", value: `${m.activePorts}/${m.totalPorts}`, icon: Server, color: "text-primary" },
    { label: "Online", value: m.onlineClients, icon: Wifi, color: "text-status-online" },
    { label: "Alertas LOS", value: m.losAlerts, icon: AlertTriangle, color: "text-status-los" },
    { label: "Sinal Alto", value: m.highSignalAlerts, icon: Signal, color: "text-status-high-signal" },
    { label: "Offline", value: m.offlineClients, icon: WifiOff, color: "text-status-offline" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da rede</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {statCards.map((card) => (
          <Card key={card.label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <card.icon className={`w-5 h-5 ${card.color}`} />
                <span className="text-2xl font-bold font-mono text-foreground">
                  {card.value}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTO list */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">CTOs Próximas</h2>
        <div className="space-y-2">
          {mockCTOs.map((cto) => {
            const losCount = cto.clients.filter((c) => c.status === "los").length;
            const onlineCount = cto.clients.filter((c) => c.status === "online").length;

            return (
              <Card key={cto.id} className="bg-card border-border">
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Hexagon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">{cto.id}</span>
                      {losCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-status-los/10 text-status-los font-medium">
                          {losCount} LOS
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{cto.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-mono text-sm text-foreground">
                      {cto.clients.length}/{cto.totalPorts}
                    </p>
                    <div className="flex items-center gap-1 justify-end">
                      <StatusLed status="online" />
                      <span className="text-[10px] text-muted-foreground">{onlineCount}</span>
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
