import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Map, Search, Navigation, Zap, Hexagon,
  ArrowRight, ArrowLeft, X, Sparkles
} from "lucide-react";

const steps = [
  {
    icon: Map,
    title: "Mapa Interativo",
    description: "Visualize todas as CTOs da sua rede em tempo real. Cada marcador mostra a ocupação e o status das portas.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    tip: "Toque em qualquer CTO no mapa para ver os detalhes completos.",
  },
  {
    icon: Search,
    title: "Busca Rápida",
    description: "Use a barra de busca no menu lateral para encontrar qualquer CTO pelo nome ou código. Resultados aparecem instantaneamente.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    tip: "Digite pelo menos 2 caracteres para ver os resultados.",
  },
  {
    icon: Navigation,
    title: "Rota até a CTO",
    description: "Ao selecionar uma CTO, clique em \"Ir até\" para traçar a rota. Veja a distância, tempo estimado e o nome da rua.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    tip: "A animação mostra o caminho que você vai percorrer.",
  },
  {
    icon: Hexagon,
    title: "Gestão de Portas",
    description: "Visualize a grade de portas, veja o status de cada cliente e faça trocas de porta (Smart Swap) quando necessário.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    tip: "Portas verdes = online, vermelhas = LOS, amarelas = sinal alto.",
  },
  {
    icon: Zap,
    title: "Modo Desempenho",
    description: "Ative nas Configurações para renderizar apenas CTOs próximas. Ajuste o raio de 50m até 500m para otimizar a performance.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    tip: "Ideal para áreas com muitas CTOs concentradas.",
  },
];

interface OnboardingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingModal({ open, onOpenChange }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;

  const handleNext = () => {
    if (isLast) {
      onOpenChange(false);
      setCurrentStep(0);
      localStorage.setItem("tech-fiber-onboarded", "true");
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStep((s) => s - 1);
  };

  const handleSkip = () => {
    onOpenChange(false);
    setCurrentStep(0);
    localStorage.setItem("tech-fiber-onboarded", "true");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden border-border">
        {/* Header with icon */}
        <div className="relative px-6 pt-8 pb-6 text-center">
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div
            className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center mx-auto mb-4 animate-scale-in`}
            key={currentStep}
          >
            <step.icon className={`w-8 h-8 ${step.color}`} />
          </div>

          <h2
            className="text-lg font-semibold text-foreground animate-fade-in"
            key={`title-${currentStep}`}
          >
            {step.title}
          </h2>

          <p
            className="text-sm text-muted-foreground mt-2 leading-relaxed animate-fade-in"
            key={`desc-${currentStep}`}
          >
            {step.description}
          </p>

          {/* Tip box */}
          <div
            className="mt-4 bg-accent/50 border border-accent rounded-lg px-4 py-2.5 animate-fade-in"
            key={`tip-${currentStep}`}
          >
            <div className="flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-accent-foreground text-left">{step.tip}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 space-y-4">
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? "w-6 bg-primary"
                    : i < currentStep
                      ? "w-1.5 bg-primary/40"
                      : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button variant="outline" size="sm" onClick={handlePrev} className="gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                Anterior
              </Button>
            )}
            <div className="flex-1" />
            <Button size="sm" onClick={handleNext} className="gap-1.5">
              {isLast ? (
                <>
                  Começar
                  <Sparkles className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  Próximo
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
