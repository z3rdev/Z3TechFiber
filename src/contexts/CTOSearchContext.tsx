import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { mockCTOs, type CTO } from "@/data/mock-data";

interface CTOSearchContextType {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchResults: CTO[];
  selectCTO: (cto: CTO) => void;
  selectedFromSearch: CTO | null;
  clearSelection: () => void;
}

const CTOSearchContext = createContext<CTOSearchContextType | null>(null);

export function CTOSearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFromSearch, setSelectedFromSearch] = useState<CTO | null>(null);

  const searchResults = searchQuery.trim().length >= 2
    ? mockCTOs.filter(
        (cto) =>
          cto.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cto.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const selectCTO = useCallback((cto: CTO) => {
    setSelectedFromSearch(cto);
    setSearchQuery("");
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedFromSearch(null);
  }, []);

  return (
    <CTOSearchContext.Provider
      value={{ searchQuery, setSearchQuery, searchResults, selectCTO, selectedFromSearch, clearSelection }}
    >
      {children}
    </CTOSearchContext.Provider>
  );
}

export function useCTOSearch() {
  const ctx = useContext(CTOSearchContext);
  if (!ctx) throw new Error("useCTOSearch must be used within CTOSearchProvider");
  return ctx;
}
