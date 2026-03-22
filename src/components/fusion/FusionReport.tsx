import { useParams, useNavigate } from "react-router-dom";
import { useFusion } from "@/contexts/FusionContext";
import { FusionDiagram } from "./FusionDiagram";
import { getFiberColor } from "@/data/fusion-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Zap, User, Calendar, Cable, FileText } from "lucide-react";
import { format } from "date-fns";
import { useRef } from "react";

export function FusionReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecord } = useFusion();
  const printRef = useRef<HTMLDivElement>(null);

  const record = getRecord(id!);

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <p className="text-muted-foreground">Registro não encontrado</p>
        <Button variant="outline" onClick={() => navigate("/fusion")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const avgAttenuation =
    record.fibers.filter((f) => f.spliceAttenuation !== undefined).length > 0
      ? (
          record.fibers
            .filter((f) => f.spliceAttenuation !== undefined)
            .reduce((sum, f) => sum + (f.spliceAttenuation || 0), 0) /
          record.fibers.filter((f) => f.spliceAttenuation !== undefined).length
        ).toFixed(3)
      : null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate("/fusion")} className="gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
          <Download className="w-4 h-4" /> Exportar PDF
        </Button>
      </div>

      <div ref={printRef} className="space-y-6 print:p-4">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">Relatório de Fusão</h1>
            <p className="text-sm text-muted-foreground font-mono">{record.ctoName}</p>
          </div>
          <Badge variant={record.isNewBox ? "default" : "outline"}>
            {record.isNewBox ? "Caixa Nova" : record.ctoId}
          </Badge>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-3 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Técnico</p>
                <p className="text-sm font-medium text-foreground">{record.technicianName}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Data</p>
                <p className="text-sm font-medium text-foreground">{format(new Date(record.date), "dd/MM/yyyy HH:mm")}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 flex items-center gap-2">
              <Cable className="w-4 h-4 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Cabo</p>
                <p className="text-sm font-medium text-foreground">{record.cableType}</p>
              </div>
            </CardContent>
          </Card>
          {avgAttenuation && (
            <Card>
              <CardContent className="p-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Média dB</p>
                  <p className="text-sm font-mono font-medium text-foreground">{avgAttenuation} dB</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Fusion diagram */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Diagrama de Fusionamento</CardTitle>
          </CardHeader>
          <CardContent>
            <FusionDiagram fibers={record.fibers} />
          </CardContent>
        </Card>

        {/* Fiber table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Tabela de Fibras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">Fibra</th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">Cor Origem</th>
                    <th className="text-center py-2 px-2 text-muted-foreground font-medium">Sentido</th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">Cor Destino</th>
                    <th className="text-right py-2 px-2 text-muted-foreground font-medium">Atenuação</th>
                  </tr>
                </thead>
                <tbody>
                  {record.fibers.map((fiber) => {
                    const origin = getFiberColor(fiber.originColor);
                    const dest = getFiberColor(fiber.destinationColor);
                    return (
                      <tr key={fiber.fiberIndex} className="border-b border-border/50">
                        <td className="py-2 px-2 font-mono">{fiber.fiberIndex}</td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: origin.hex }} />
                            {origin.name}
                          </div>
                        </td>
                        <td className="py-2 px-2 text-center font-mono">{fiber.direction}</td>
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: dest.hex }} />
                            {dest.name}
                          </div>
                        </td>
                        <td className="py-2 px-2 text-right font-mono">
                          {fiber.spliceAttenuation !== undefined ? `${fiber.spliceAttenuation.toFixed(2)} dB` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        {record.photos.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Fotos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {record.photos.map((photo) => (
                  <div key={photo.id} className="rounded-lg border border-border overflow-hidden">
                    <img src={photo.url} alt={photo.label} className="w-full h-32 object-cover" />
                    <div className="p-1.5">
                      <Badge variant="outline" className="text-[10px]">
                        {photo.label === "caixa" ? "Caixa" : photo.label === "fusao" ? "Fusão" : "Outra"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {record.notes && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <FileText className="w-4 h-4" /> Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground whitespace-pre-wrap">{record.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
