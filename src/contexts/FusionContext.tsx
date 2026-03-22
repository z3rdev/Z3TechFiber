import { createContext, useContext, useState, type ReactNode } from "react";
import type { FusionRecord } from "@/data/fusion-data";

interface FusionContextType {
  records: FusionRecord[];
  addRecord: (record: FusionRecord) => void;
  getRecordsByCTO: (ctoId: string) => FusionRecord[];
  getRecord: (id: string) => FusionRecord | undefined;
  deleteRecord: (id: string) => void;
}

const FusionContext = createContext<FusionContextType | null>(null);

export function FusionProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<FusionRecord[]>([]);

  const addRecord = (record: FusionRecord) => {
    setRecords((prev) => [record, ...prev]);
  };

  const getRecordsByCTO = (ctoId: string) =>
    records.filter((r) => r.ctoId === ctoId);

  const getRecord = (id: string) => records.find((r) => r.id === id);

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <FusionContext.Provider value={{ records, addRecord, getRecordsByCTO, getRecord, deleteRecord }}>
      {children}
    </FusionContext.Provider>
  );
}

export function useFusion() {
  const ctx = useContext(FusionContext);
  if (!ctx) throw new Error("useFusion must be used within FusionProvider");
  return ctx;
}
