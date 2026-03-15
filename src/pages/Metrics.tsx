import { mockMetrics } from "@/data/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Metrics = () => {
  const m = mockMetrics;
  const occupancyRate = Math.round((m.activePorts / m.totalPorts) * 100);
  const onlineRate = Math.round((m.onlineClients / m.activePorts) * 100);

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-xl font-bold text-foreground">Métricas</h1>
        <p className="text-sm text-muted-foreground">Performance da rede</p>
      </div>

      <div className="space-y-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Taxa de Ocupação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold font-mono text-foreground">{occupancyRate}%</span>
              <span className="text-xs text-muted-foreground mb-1">{m.activePorts} de {m.totalPorts} portas</span>
            </div>
            <Progress value={occupancyRate} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Clientes Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold font-mono text-status-online">{onlineRate}%</span>
              <span className="text-xs text-muted-foreground mb-1">{m.onlineClients} de {m.activePorts}</span>
            </div>
            <Progress value={onlineRate} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Alertas Ativos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">LOS (Perda de Sinal)</span>
              <span className="font-mono font-semibold text-status-los">{m.losAlerts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sinal Alto</span>
              <span className="font-mono font-semibold text-status-high-signal">{m.highSignalAlerts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Offline</span>
              <span className="font-mono font-semibold text-status-offline">{m.offlineClients}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Metrics;
