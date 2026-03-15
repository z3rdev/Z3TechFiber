import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { OnboardingModal } from "@/components/OnboardingModal";
import { User, Shield, Zap, BookOpen } from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const { performanceMode, setPerformanceMode, performanceRadius, setPerformanceRadius } = useSettings();
  const [showOnboarding, setShowOnboarding] = useState(false);

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h1 className="text-xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Preferências do sistema</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-foreground">
            <User className="w-4 h-4 text-primary" />
            Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Nome</span>
            <span className="text-sm font-medium text-foreground">{user?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm font-medium text-foreground">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Função</span>
            <span className="text-sm font-medium text-foreground capitalize">{user?.role}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-foreground">
            <Zap className="w-4 h-4 text-primary" />
            Modo Desempenho
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium text-foreground">Ativar modo desempenho</Label>
              <p className="text-xs text-muted-foreground">
                Renderiza apenas CTOs próximas à sua localização
              </p>
            </div>
            <Switch checked={performanceMode} onCheckedChange={setPerformanceMode} />
          </div>

          {performanceMode && (
            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-foreground">Raio de visibilidade</Label>
                <span className="text-sm font-mono font-medium text-primary">{performanceRadius}m</span>
              </div>
              <Slider
                value={[performanceRadius]}
                onValueChange={([v]) => setPerformanceRadius(v)}
                min={50}
                max={500}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>50m</span>
                <span>250m</span>
                <span>500m</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-foreground">
            <Shield className="w-4 h-4 text-primary" />
            Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Versão 1.0.0 — Dados mock ativados
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowOnboarding(true)}
          >
            <BookOpen className="w-4 h-4" />
            Ver tutorial de apresentação
          </Button>
        </CardContent>
      </Card>

      <OnboardingModal open={showOnboarding} onOpenChange={setShowOnboarding} />
    </div>
  );
};

export default Settings;
