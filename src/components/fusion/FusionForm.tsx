import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiberRow } from "./FiberRow";
import { PhotoUploader } from "./PhotoUploader";
import { FusionDiagram } from "./FusionDiagram";
import { DestinationSelector } from "./DestinationSelector";
import { useFusion } from "@/contexts/FusionContext";
import { mockCTOs } from "@/data/mock-data";
import { CABLE_TYPES, getDefaultFibersForCount, type FiberFusion, type FusionPhoto, type FusionDestination } from "@/data/fusion-data";
import { toast } from "sonner";
import { Zap, Save, Eye, Route } from "lucide-react";

export function FusionForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addRecord } = useFusion();

  const preselectedCTO = searchParams.get("cto") || "";

  const [ctoId, setCtoId] = useState(preselectedCTO);
  const [isNewBox, setIsNewBox] = useState(false);
  const [newBoxName, setNewBoxName] = useState("");
  const [techName, setTechName] = useState("");
  const [fiberCount, setFiberCount] = useState(12);
  const [fibers, setFibers] = useState<FiberFusion[]>(getDefaultFibersForCount(12));
  const [photos, setPhotos] = useState<FusionPhoto[]>([]);
  const [notes, setNotes] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [destination, setDestination] = useState<FusionDestination | undefined>();

  const handleFiberCountChange = (count: number) => {
    setFiberCount(count);
    setFibers(getDefaultFibersForCount(count));
  };

  const updateFiber = (index: number, fiber: FiberFusion) => {
    setFibers((prev) => prev.map((f, i) => (i === index ? fiber : f)));
  };

  const selectedCTO = mockCTOs.find((c) => c.id === ctoId);

  const handleSubmit = () => {
    if (!isNewBox && !ctoId) {
      toast.error("Selecione uma CTO");
      return;
    }
    if (!techName.trim()) {
      toast.error("Informe o nome do técnico");
      return;
    }

    const record = {
      id: crypto.randomUUID(),
      ctoId: isNewBox ? `NEW-${Date.now()}` : ctoId,
      ctoName: isNewBox ? newBoxName : selectedCTO?.name || ctoId,
      technicianName: techName,
      date: new Date(),
      fiberCount,
      cableType: `${fiberCount} fibras`,
      fibers,
      photos,
      notes,
      isNewBox,
      destination,
    };

    addRecord(record);
    toast.success("Registro de fusão salvo com sucesso!");
    navigate(`/fusion/report/${record.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Nova Fusão</h1>
          <p className="text-sm text-muted-foreground">Registre os detalhes do fusionamento</p>
        </div>
      </div>

      {/* General info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Informações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Switch checked={isNewBox} onCheckedChange={setIsNewBox} />
            <Label className="text-sm">Caixa nova (não cadastrada)</Label>
          </div>

          {isNewBox ? (
            <div className="space-y-2">
              <Label className="text-xs">Nome da nova caixa</Label>
              <Input
                placeholder="Ex: CTO Nova Rua XV"
                value={newBoxName}
                onChange={(e) => setNewBoxName(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-xs">CTO</Label>
              <Select value={ctoId} onValueChange={setCtoId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a CTO" />
                </SelectTrigger>
                <SelectContent>
                  {mockCTOs.map((cto) => (
                    <SelectItem key={cto.id} value={cto.id}>
                      {cto.id} — {cto.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-xs">Nome do Técnico</Label>
            <Input placeholder="Seu nome" value={techName} onChange={(e) => setTechName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Tipo de cabo</Label>
            <Select value={String(fiberCount)} onValueChange={(v) => handleFiberCountChange(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CABLE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={String(t.value)}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Route / Destination */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-1.5">
            <Route className="w-4 h-4 text-primary" />
            Sentido / Destino da Fibra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DestinationSelector value={destination} onChange={setDestination} label="Para onde vai a fibra?" />
        </CardContent>
      </Card>

      {/* Fiber mapping */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Mapa de Fusionamento</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="gap-1.5 text-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              {showPreview ? "Lista" : "Diagrama"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showPreview ? (
            <FusionDiagram fibers={fibers} />
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2 pb-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                <span className="w-6 text-right">#</span>
                <span className="w-[120px]">Origem</span>
                <span className="w-[80px] text-center">Sentido</span>
                <span className="w-[120px]">Destino</span>
                <span className="w-16">Atten.</span>
              </div>
              {fibers.map((fiber, i) => (
                <FiberRow key={i} fiber={fiber} onChange={(f) => updateFiber(i, f)} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Fotos</CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoUploader photos={photos} onChange={setPhotos} />
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Observações gerais sobre a fusão..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Submit */}
      <Button onClick={handleSubmit} size="lg" className="w-full gap-2">
        <Save className="w-4 h-4" />
        Salvar Registro de Fusão
      </Button>
    </div>
  );
}
