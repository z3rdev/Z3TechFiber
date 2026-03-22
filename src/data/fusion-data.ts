export const FIBER_COLORS = [
  { name: "Azul", hex: "#0066FF", id: "blue" },
  { name: "Laranja", hex: "#FF6600", id: "orange" },
  { name: "Verde", hex: "#00CC44", id: "green" },
  { name: "Marrom", hex: "#8B4513", id: "brown" },
  { name: "Cinza", hex: "#708090", id: "slate" },
  { name: "Branco", hex: "#F0F0F0", id: "white" },
  { name: "Vermelho", hex: "#CC0000", id: "red" },
  { name: "Preto", hex: "#1A1A1A", id: "black" },
  { name: "Amarelo", hex: "#FFD700", id: "yellow" },
  { name: "Violeta", hex: "#8B00FF", id: "violet" },
  { name: "Rosa", hex: "#FF69B4", id: "rose" },
  { name: "Aqua", hex: "#00CED1", id: "aqua" },
] as const;

export type FiberColorId = (typeof FIBER_COLORS)[number]["id"];
export type FusionDirection = "A→B" | "B→A";

export type DestinationType = "cto" | "reference" | "location";

export interface FusionDestination {
  type: DestinationType;
  ctoId?: string;
  ctoName?: string;
  label?: string;
  lat?: number;
  lng?: number;
}

export interface FiberFusion {
  fiberIndex: number;
  originColor: FiberColorId;
  destinationColor: FiberColorId;
  direction: FusionDirection;
  spliceAttenuation?: number; // dB
  destinationOverride?: FusionDestination; // per-fiber override
  notes?: string;
}

export interface FusionPhoto {
  id: string;
  url: string; // object URL or data URL
  label: "caixa" | "fusao" | "outra";
  timestamp: Date;
}

export interface FusionRecord {
  id: string;
  ctoId: string;
  ctoName: string;
  technicianName: string;
  date: Date;
  fiberCount: number;
  cableType: string;
  fibers: FiberFusion[];
  photos: FusionPhoto[];
  notes: string;
  isNewBox: boolean;
}

export const CABLE_TYPES = [
  { label: "6 fibras", value: 6 },
  { label: "12 fibras", value: 12 },
  { label: "24 fibras", value: 24 },
  { label: "36 fibras", value: 36 },
  { label: "48 fibras", value: 48 },
];

export function getFiberColor(id: FiberColorId) {
  return FIBER_COLORS.find((c) => c.id === id)!;
}

export function getDefaultFibersForCount(count: number): FiberFusion[] {
  const fibers: FiberFusion[] = [];
  for (let i = 0; i < count; i++) {
    const colorIndex = i % FIBER_COLORS.length;
    fibers.push({
      fiberIndex: i + 1,
      originColor: FIBER_COLORS[colorIndex].id,
      destinationColor: FIBER_COLORS[colorIndex].id,
      direction: "A→B",
    });
  }
  return fibers;
}
