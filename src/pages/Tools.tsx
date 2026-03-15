import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Search, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Tools = () => {
  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-xl font-bold text-foreground">Ferramentas</h1>
        <p className="text-sm text-muted-foreground">Utilitários do técnico</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Buscar Cliente</h3>
              <p className="text-xs text-muted-foreground">Localizar cliente por nome ou contrato</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => toast.info("Em breve!")}>
              Abrir
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Sincronizar Dados</h3>
              <p className="text-xs text-muted-foreground">Atualizar cache local com servidor</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => toast.success("Dados sincronizados!")}>
              Sync
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">Teste de Sinal</h3>
              <p className="text-xs text-muted-foreground">Testar potência óptica da porta</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => toast.info("Em breve!")}>
              Testar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tools;
