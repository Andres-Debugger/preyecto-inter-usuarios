/**
 * Tangram figure definitions.
 * Each piece is defined by a CSS clip-path polygon() and a color.
 * Coordinates are percentages (0-100) of the container.
 */

export interface TangramPiece {
  id: string;
  type: "triangle" | "square" | "rectangle" | "parallelogram";
  clipPath: string;
  color: string;
  label: string;
}

export interface TangramFigure {
  id: number;
  name: string;
  pieces: TangramPiece[];
}

const PIECE_COLORS = {
  dark: "var(--color-bg)",
  medium: "color-mix(in srgb, var(--color-bg) 70%, transparent)",
  light: "color-mix(in srgb, var(--color-bg) 40%, transparent)",
  white: "var(--color-accent)",
};

/**
 * Figure 25 - Bridge / Arch
 * Two triangular supports with a thin rectangular beam connecting them.
 * Reference: etc.usf.edu/clipart/64500/64502/64502_arch02_sa_md.gif
 */
const FIGURE_25: TangramFigure = {
  id: 25,
  name: "Bridge",
  pieces: [
    {
      id: "25-1",
      type: "triangle",
      clipPath: "polygon(0% 100%, 45% 25%, 50% 100%)",
      color: PIECE_COLORS.dark,
      label: "Left support",
    },
    {
      id: "25-2",
      type: "triangle",
      clipPath: "polygon(50% 100%, 55% 25%, 100% 100%)",
      color: PIECE_COLORS.dark,
      label: "Right support",
    },
    {
      id: "25-3",
      type: "rectangle",
      clipPath: "polygon(30% 20%, 70% 20%, 70% 30%, 30% 30%)",
      color: PIECE_COLORS.dark,
      label: "Top beam",
    },
    {
      id: "25-4",
      type: "triangle",
      clipPath: "polygon(30% 30%, 45% 25%, 50% 30%)",
      color: PIECE_COLORS.medium,
      label: "Left brace",
    },
    {
      id: "25-5",
      type: "triangle",
      clipPath: "polygon(50% 30%, 55% 25%, 70% 30%)",
      color: PIECE_COLORS.medium,
      label: "Right brace",
    },
  ],
};

/**
 * Figure 92 - Geometric Form
 * Exact coordinates from user-provided SVG (viewBox 0 0 200 200)
 * Coordinates divided by 2 to get percentages.
 */
const FIGURE_92: TangramFigure = {
  id: 92,
  name: "Geometric Form",
  pieces: [
    {
      id: "92-1",
      type: "triangle",
      clipPath: "polygon(35% 35%, 85% 35%, 85% 85%)",
      color: PIECE_COLORS.dark,
      label: "Triangle large 1",
    },
    {
      id: "92-2",
      type: "triangle",
      clipPath: "polygon(35% 35%, 85% 85%, 35% 85%)",
      color: PIECE_COLORS.dark,
      label: "Triangle large 2",
    },
    {
      id: "92-3",
      type: "square",
      clipPath: "polygon(35% 10%, 60% 10%, 60% 35%, 35% 35%)",
      color: PIECE_COLORS.dark,
      label: "Square medium",
    },
    {
      id: "92-4",
      type: "triangle",
      clipPath: "polygon(60% 10%, 85% 10%, 60% 35%)",
      color: PIECE_COLORS.dark,
      label: "Triangle small 1",
    },
    {
      id: "92-5",
      type: "triangle",
      clipPath: "polygon(10% 10%, 35% 10%, 35% 35%)",
      color: PIECE_COLORS.dark,
      label: "Triangle medium",
    },
    {
      id: "92-6",
      type: "parallelogram",
      clipPath: "polygon(10% 10%, 35% 35%, 35% 55%, 10% 30%)",
      color: PIECE_COLORS.dark,
      label: "Parallelogram",
    },
    {
      id: "92-7",
      type: "triangle",
      clipPath: "polygon(10% 30%, 35% 55%, 10% 80%)",
      color: PIECE_COLORS.dark,
      label: "Triangle small 2",
    },
  ],
};

/**
 * Figure 89 - Framed Triangles
 * Exact coordinates from user-provided SVG (viewBox 0 0 400 400)
 * Coordinates divided by 4 to get percentages.
 * One piece is white (the medium triangle).
 */
const FIGURE_89: TangramFigure = {
  id: 89,
  name: "Framed Triangles",
  pieces: [
    {
      id: "89-1",
      type: "triangle",
      clipPath: "polygon(100% 0%, 100% 100%, 0% 0%)",
      color: PIECE_COLORS.dark,
      label: "Triangle large",
    },
    {
      id: "89-2",
      type: "triangle",
      clipPath: "polygon(0% 50%, 50% 50%, 25% 25%)",
      color: PIECE_COLORS.white,
      label: "Triangle medium (white)",
    },
    {
      id: "89-3",
      type: "triangle",
      clipPath: "polygon(0% 0%, 0% 50%, 25% 25%)",
      color: PIECE_COLORS.dark,
      label: "Triangle small 1",
    },
    {
      id: "89-4",
      type: "triangle",
      clipPath: "polygon(50% 50%, 50% 100%, 75% 75%)",
      color: PIECE_COLORS.dark,
      label: "Triangle small 2",
    },
    {
      id: "89-5",
      type: "square",
      clipPath: "polygon(25% 75%, 50% 50%, 75% 75%, 50% 100%)",
      color: PIECE_COLORS.dark,
      label: "Square small",
    },
    {
      id: "89-6",
      type: "parallelogram",
      clipPath: "polygon(0% 100%, 0% 50%, 25% 75%, 50% 100%)",
      color: PIECE_COLORS.dark,
      label: "Parallelogram",
    },
  ],
};

export const TANGRAM_FIGURES: TangramFigure[] = [FIGURE_25, FIGURE_92, FIGURE_89];
