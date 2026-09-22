export interface TangramPieceConfig {
  id: number;
  name: string;
  w: number;
  h: number;
  clipPath: string;
  visible: boolean;
}

export interface TangramFigureConfig {
  id: number;
  name: string;
  place: ([number, number] | null)[];
}

export interface TangramConfig {
  pieces: TangramPieceConfig[];
  figures: TangramFigureConfig[];
}

export const DEFAULT_PIECES: TangramPieceConfig[] = [
  {
    id: 0, name: "Pilar Izquierdo",
    w: 60, h: 60,
    clipPath: "polygon(0% 100%, 100% 0%, 100% 100%)",
    visible: true,
  },
  {
    id: 1, name: "Conector base",
    w: 30, h: 30,
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    visible: true,
  },
  {
    id: 2, name: "Techo izquierdo",
    w: 30, h: 30,
    clipPath: "polygon(0% 0%, 100% 0%, 0% 100%)",
    visible: true,
  },
  {
    id: 3, name: "Triángulo Mediano",
    w: 60, h: 30,
    clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
    visible: true,
  },
  {
    id: 4, name: "Paralelogramo",
    w: 90, h: 30,
    clipPath: "polygon(33.3% 0%, 100% 0%, 66.7% 100%, 0% 100%)",
    visible: true,
  },
  {
    id: 5, name: "Triángulo Pequeño 2",
    w: 30, h: 30,
    clipPath: "polygon(0% 100%, 100% 100%, 100% 0%)",
    visible: true,
  },
  {
    id: 6, name: "Pilar Derecho",
    w: 60, h: 60,
    clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
    visible: true,
  },
];

export const DEFAULT_FIGURES: TangramFigureConfig[] = [
  {
    id: 25, name: "Bridge",
    place: [
      [50, 90], [110, 90], [140, 90], [140, 90],
      [140, 90], [200, 90], [230, 90],
    ],
  },
  {
    id: 92, name: "Geometric Form",
    place: [null, null, null, null, null, null, null],
  },
  {
    id: 89, name: "Framed Triangles",
    place: [null, null, null, null, null, null, null],
  },
];

export const DEFAULT_CONFIG: TangramConfig = {
  pieces: DEFAULT_PIECES,
  figures: DEFAULT_FIGURES,
};
