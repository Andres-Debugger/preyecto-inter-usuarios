/**
 * Tangram definitions: 7 pieces with FIXED shapes and sizes.
 * Each piece's clip-path and dimensions NEVER change.
 * Only the position (left%, top%) changes between figures.
 *
 * Figure 25 extracted from exact SVG: viewBox 0 0 400 200
 */

export interface TangramPiece {
  w: number;
  h: number;
  clipPath: string;
}

export interface TangramFigure {
  id: number;
  name: string;
  place: ([number, number] | null)[];
}

/**
 * 7 pieces — exact shapes from Figure 25 SVG.
 * clip-path is % of each piece's own w×h.
 */
export const PIECES: TangramPiece[] = [
  // 0: Pilar Izquierdo — right triangle 60×60
  //    SVG: (50,150)(110,90)(110,150)
  {
    w: 60, h: 60,
    clipPath: "polygon(0% 100%, 100% 0%, 100% 100%)",
  },
  // 1: Conector base — square 30×30
  //    SVG: (110,90)(140,90)(140,120)(110,120)
  {
    w: 30, h: 30,
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },
  // 2: Techo izquierdo — right triangle 30×30
  //    SVG: (140,90)(170,90)(140,120)
  {
    w: 30, h: 30,
    clipPath: "polygon(0% 0%, 100% 0%, 0% 100%)",
  },
  // 3: Triángulo Mediano — isosceles 60×30
  //    SVG: (140,120)(170,90)(200,120)
  {
    w: 60, h: 30,
    clipPath: "polygon(0% 100%, 50% 0%, 100% 100%)",
  },
  // 4: Paralelogramo — 90×30
  //    SVG: (170,90)(230,90)(200,120)(140,120)
  {
    w: 90, h: 30,
    clipPath: "polygon(33.3% 0%, 100% 0%, 66.7% 100%, 0% 100%)",
  },
  // 5: Triángulo Pequeño 2 — right triangle 30×30
  //    SVG: (200,120)(230,120)(230,90)
  {
    w: 30, h: 30,
    clipPath: "polygon(0% 100%, 100% 100%, 100% 0%)",
  },
  // 6: Pilar Derecho — right triangle 60×60
  //    SVG: (230,90)(290,150)(230,150)
  {
    w: 60, h: 60,
    clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
  },
];

export const FIGURES: TangramFigure[] = [
  {
    id: 25,
    name: "Bridge",
    place: [
      [50, 90],    // 0: Pilar Izquierdo   (50, 90)
      [110, 90],   // 1: Conector base      (110, 90)
      [140, 90],   // 2: Techo izquierdo     (140, 90)
      [140, 90],   // 3: Triángulo Mediano   (140, 90)
      [140, 90],   // 4: Paralelogramo       (140, 90)
      [200, 90],   // 5: Triángulo Peq Der   (200, 90)
      [230, 90],   // 6: Pilar Derecho       (230, 90)
    ],
  },
  {
    id: 92,
    name: "Geometric Form",
    place: [
      null, null, null, null, null, null, null,
    ],
  },
  {
    id: 89,
    name: "Framed Triangles",
    place: [
      null, null, null, null, null, null, null,
    ],
  },
];
