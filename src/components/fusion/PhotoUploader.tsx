import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import type { FusionPhoto } from "@/data/fusion-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PhotoUploaderProps {
  photos: FusionPhoto[];
  onChange: (photos: FusionPhoto[]) => void;
}

export function PhotoUploader({ photos, onChange }: PhotoUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const addPhoto = (file: File, label: FusionPhoto["label"]) => {
    const url = URL.createObjectURL(file);
    const photo: FusionPhoto = {
      id: crypto.randomUUID(),
      url,
      label,
      timestamp: new Date(),
    };
    onChange([...photos, photo]);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) addPhoto(file, "outra");
    e.target.value = "";
  };

  const removePhoto = (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (photo) URL.revokeObjectURL(photo.url);
    onChange(photos.filter((p) => p.id !== id));
  };

  const updateLabel = (id: string, label: FusionPhoto["label"]) => {
    onChange(photos.map((p) => (p.id === id ? { ...p, label } : p)));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-1.5">
          <Upload className="w-3.5 h-3.5" /> Enviar foto
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => cameraRef.current?.click()} className="gap-1.5">
          <Camera className="w-3.5 h-3.5" /> Câmera
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group rounded-lg border border-border overflow-hidden bg-secondary/30">
              <img src={photo.url} alt={photo.label} className="w-full h-28 object-cover" />
              <button
                onClick={() => removePhoto(photo.id)}
                className="absolute top-1 right-1 w-6 h-6 bg-background/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5 text-destructive" />
              </button>
              <div className="p-1.5">
                <Select value={photo.label} onValueChange={(v) => updateLabel(photo.id, v as FusionPhoto["label"])}>
                  <SelectTrigger className="h-6 text-[10px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="caixa">Caixa</SelectItem>
                    <SelectItem value="fusao">Fusão</SelectItem>
                    <SelectItem value="outra">Outra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}

      {photos.length === 0 && (
        <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 text-muted-foreground">
          <ImageIcon className="w-8 h-8 opacity-40" />
          <p className="text-xs">Nenhuma foto adicionada</p>
        </div>
      )}
    </div>
  );
}
