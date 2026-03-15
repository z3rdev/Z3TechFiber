export type ClientStatus = "online" | "los" | "high-signal" | "offline";

export interface CTOClient {
  id: string;
  name: string;
  port: number;
  status: ClientStatus;
  signal: number; // dBm
  contract: string;
}

export interface CTO {
  id: string;
  name: string;
  lat: number;
  lng: number;
  totalPorts: number;
  clients: CTOClient[];
}

// Centro de São Paulo como referência
const BASE_LAT = -23.5505;
const BASE_LNG = -46.6333;

const randomSignal = (status: ClientStatus): number => {
  switch (status) {
    case "online": return -(Math.random() * 5 + 18); // -18 to -23
    case "high-signal": return -(Math.random() * 3 + 10); // -10 to -13
    case "los": return -40;
    case "offline": return 0;
  }
};

const firstNames = ["Carlos", "Ana", "João", "Maria", "Pedro", "Lucia", "Rafael", "Julia", "Bruno", "Fernanda", "Lucas", "Camila", "Diego", "Patricia", "Marcos", "Sandra"];
const lastNames = ["Silva", "Santos", "Oliveira", "Souza", "Costa", "Pereira", "Lima", "Almeida", "Ferreira", "Rodrigues", "Nascimento", "Araujo", "Melo", "Barbosa", "Ribeiro", "Carvalho"];

const statuses: ClientStatus[] = ["online", "online", "online", "online", "online", "online", "high-signal", "los", "offline", "online"];

function generateClients(count: number): CTOClient[] {
  const clients: CTOClient[] = [];
  for (let i = 0; i < count; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    clients.push({
      id: `CLI-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      name: `${firstName} ${lastName}`,
      port: i + 1,
      status,
      signal: Math.round(randomSignal(status) * 10) / 10,
      contract: `CTR-${String(Math.floor(Math.random() * 90000) + 10000)}`,
    });
  }
  return clients;
}

export const mockCTOs: CTO[] = [
  {
    id: "CTO-001",
    name: "CTO Paulista 01",
    lat: BASE_LAT + 0.002,
    lng: BASE_LNG + 0.001,
    totalPorts: 16,
    clients: generateClients(12),
  },
  {
    id: "CTO-002",
    name: "CTO Augusta 02",
    lat: BASE_LAT - 0.001,
    lng: BASE_LNG + 0.003,
    totalPorts: 16,
    clients: generateClients(15),
  },
  {
    id: "CTO-003",
    name: "CTO Consolação 03",
    lat: BASE_LAT + 0.003,
    lng: BASE_LNG - 0.002,
    totalPorts: 8,
    clients: generateClients(6),
  },
  {
    id: "CTO-004",
    name: "CTO República 04",
    lat: BASE_LAT - 0.002,
    lng: BASE_LNG - 0.001,
    totalPorts: 16,
    clients: generateClients(14),
  },
  {
    id: "CTO-005",
    name: "CTO Liberdade 05",
    lat: BASE_LAT - 0.004,
    lng: BASE_LNG + 0.002,
    totalPorts: 8,
    clients: generateClients(8),
  },
  {
    id: "CTO-006",
    name: "CTO Sé 06",
    lat: BASE_LAT + 0.001,
    lng: BASE_LNG - 0.004,
    totalPorts: 16,
    clients: generateClients(10),
  },
  {
    id: "CTO-007",
    name: "CTO Bela Vista 07",
    lat: BASE_LAT - 0.003,
    lng: BASE_LNG - 0.003,
    totalPorts: 16,
    clients: generateClients(16),
  },
  {
    id: "CTO-008",
    name: "CTO Higienópolis 08",
    lat: BASE_LAT + 0.005,
    lng: BASE_LNG + 0.004,
    totalPorts: 8,
    clients: generateClients(5),
  },
];

// Dashboard metrics
export const mockMetrics = {
  totalCTOs: mockCTOs.length,
  totalPorts: mockCTOs.reduce((acc, cto) => acc + cto.totalPorts, 0),
  activePorts: mockCTOs.reduce((acc, cto) => acc + cto.clients.length, 0),
  onlineClients: mockCTOs.reduce((acc, cto) => acc + cto.clients.filter(c => c.status === "online").length, 0),
  losAlerts: mockCTOs.reduce((acc, cto) => acc + cto.clients.filter(c => c.status === "los").length, 0),
  highSignalAlerts: mockCTOs.reduce((acc, cto) => acc + cto.clients.filter(c => c.status === "high-signal").length, 0),
  offlineClients: mockCTOs.reduce((acc, cto) => acc + cto.clients.filter(c => c.status === "offline").length, 0),
};
