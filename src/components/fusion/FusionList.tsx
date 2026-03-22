import { useNavigate } from "react-router-dom";
import { useFusion } from "@/contexts/FusionContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Zap, FileText, Trash2 } from "lucide-react";
import { format } from "date-fns";

export function FusionList() {
  const navigate = useNavigate();
  const { records, deleteRecord } = useFusion();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Z3 Tech Fusion</h1>
            <p className="text-sm text-muted-foreground">Registros de fusionamento</p>
          </div>
        </div>
        <Button onClick={() => navigate("/fusion/new")} className="gap-1.5">
          <Plus className="w-4 h-4" /> Nova Fusão
        </Button>
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
            <Zap className="w-10 h-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Nenhum registro de fusão</p>
            <Button variant="outline" size="sm" onClick={() => navigate("/fusion/new")} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Criar primeiro registro
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {records.map((record) => (
            <Card
              key={record.id}
              className="cursor-pointer hover:bg-secondary/30 transition-colors"
              onClick={() => navigate(`/fusion/report/${record.id}`)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{record.ctoName}</p>
                  <p className="text-xs text-muted-foreground">
                    {record.technicianName} · {format(new Date(record.date), "dd/MM/yyyy HH:mm")} · {record.cableType}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant={record.isNewBox ? "default" : "outline"} className="text-[10px]">
                    {record.isNewBox ? "Nova" : record.ctoId}
                  </Badge>
                  {record.photos.length > 0 && (
                    <Badge variant="secondary" className="text-[10px]">
                      {record.photos.length} foto{record.photos.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRecord(record.id);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
