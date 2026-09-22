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
      [0, 150, 0],
      [100, 150, 0],
      [150, 150, 0],
      [150, 150, 0],
      [150, 150, 0],
      [250, 150, 0],
      [300, 150, 0],
    ],
    sizes: [
      [100, 100],
      [50, 50],
      [50, 50],
      [100, 50],
      [150, 50],
      [50, 50],
      [100, 100],
    ],
  },
  {
    id: 92,
    name: "Geometric Form",
    place: [
      [160, 160, 270],
      [160, 80, 0],
      [240, 80, 0],
      [32, 208, 90],
      [40, 120, 90],
      [80, 80, 270],
      [160, 160, 0],
    ],
    sizes: [
      [160, 160],
      [80, 80],
      [80, 80],
      [160, 64],
      [144, 64],
      [80, 80],
      [160, 160],
    ],
  },
  {
    id: 89,
    name: "Framed Triangles",
    place: [
      [155, 95, 270],
      [230, 230, 0],
      [95, 95, 270],
      [155, 170, 0],
      [95, 95, 0],
      [155, 230, 270],
      [95, 170, 0],
    ],
    sizes: [
      [150, 150],
      [75, 75],
      [75, 75],
      [150, 60],
      [135, 75],
      [75, 75],
      [135, 135],
    ],
  },
];

export const DEFAULT_CONFIG: TangramConfig = {
  pieces: DEFAULT_PIECES,
  figures: DEFAULT_FIGURES,
};