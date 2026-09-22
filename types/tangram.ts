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
  place: ([number, number, number] | null)[];
  sizes?: ([number, number] | null)[];
}

export interface TangramConfig {
  pieces: TangramPieceConfig[];
  figures: TangramFigureConfig[];
}

export const DEFAULT_PIECES: TangramPieceConfig[] = [
  { id: 0, name: "Large Triangle A", w: 60, h: 60, clipPath: "polygon(0% 100%, 100% 0%, 100% 100%)", visible: true },
  { id: 1, name: "Square", w: 30, h: 30, clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", visible: true },
  { id: 2, name: "Small Triangle A", w: 30, h: 30, clipPath: "polygon(0% 0%, 100% 0%, 0% 100%)", visible: true },
  { id: 3, name: "Medium Triangle", w: 60, h: 30, clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)", visible: true },
  { id: 4, name: "Parallelogram", w: 90, h: 30, clipPath: "polygon(33.3% 0%, 100% 0%, 66.7% 100%, 0% 100%)", visible: true },
  { id: 5, name: "Small Triangle B", w: 30, h: 30, clipPath: "polygon(0% 100%, 100% 100%, 100% 0%)", visible: true },
  { id: 6, name: "Large Triangle B", w: 60, h: 60, clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)", visible: true },
];

export const DEFAULT_FIGURES: TangramFigureConfig[] = [
  {
    id: 25,
    name: "Bridge",
    place: [
      [50, 90, 0],
      [110, 90, 0],
      [140, 90, 0],
      [140, 90, 0],
      [140, 90, 0],
      [200, 90, 0],
      [230, 90, 0],
    ],
  },
  {
    id: 92,
    name: "Geometric Form",
    place: [
      [160, 160, 270],
      [160, 60, 0],
      [260, 60, 0],
      [0, 220, 90],
      [10, 110, 90],
      [60, 60, 270],
      [160, 160, 0],
    ],
    sizes: [
      [200, 200],
      [100, 100],
      [100, 100],
      [200, 80],
      [180, 80],
      [100, 100],
      [200, 200],
    ],
  },
  {
    id: 89,
    name: "Framed Triangles",
    place: [
      [125, 25, 270],
      [250, 250, 0],
      [25, 25, 270],
      [125, 150, 0],
      [25, 25, 0],
      [125, 250, 270],
      [25, 150, 0],
    ],
    sizes: [
      [250, 250],
      [125, 125],
      [125, 125],
      [250, 100],
      [225, 125],
      [125, 125],
      [225, 225],
    ],
  },
];

export const DEFAULT_CONFIG: TangramConfig = {
  pieces: DEFAULT_PIECES,
  figures: DEFAULT_FIGURES,
};