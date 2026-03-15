import { createContext, useContext, useState, type ReactNode } from "react";

interface SettingsContextType {
  performanceMode: boolean;
  setPerformanceMode: (v: boolean) => void;
  performanceRadius: number; // em metros
  setPerformanceRadius: (v: number) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [performanceMode, setPerformanceMode] = useState(false);
  const [performanceRadius, setPerformanceRadius] = useState(100);

  return (
    <SettingsContext.Provider
      value={{ performanceMode, setPerformanceMode, performanceRadius, setPerformanceRadius }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
