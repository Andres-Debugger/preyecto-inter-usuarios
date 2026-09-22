"use client";

import { useState } from "react";
import { useTangram } from "@/context/TangramContext";
import { usePalette } from "@/context/PaletteContext";
import { DEFAULT_CONFIG } from "@/types/tangram";

const SVG_W = 400;
const SVG_H = 200;

export default function TangramConfig() {
  const { config, updatePiece, togglePiece, resetConfig, resetPiece } = useTangram();
  const { activePalette } = usePalette();
  const [selectedId, setSelectedId] = useState(0);

  const selected = config.pieces.find((p) => p.id === selectedId);
  const colors = activePalette.colors;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Left: Piece list + editor */}
      <div className="space-y-6">
        {/* Piece list */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-bg) 90%, var(--color-text))" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-sm font-semibold tracking-wide uppercase"
              style={{ color: "var(--color-muted)" }}
            >
              Pieces
            </h3>
            <button
              onClick={resetConfig}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{
                color: "var(--color-accent)",
                backgroundColor: "color-mix(in srgb, var(--color-accent) 10%, transparent)",
              }}
            >
              Reset All
            </button>
          </div>

          <div className="space-y-2">
            {config.pieces.map((piece, i) => (
              <div
                key={piece.id}
                className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all"
                style={{
                  backgroundColor:
                    selectedId === piece.id
                      ? "color-mix(in srgb, var(--color-accent) 15%, transparent)"
                      : "transparent",
                  borderLeft: selectedId === piece.id ? "3px solid var(--color-accent)" : "3px solid transparent",
                }}
                onClick={() => setSelectedId(piece.id)}
              >
                {/* Color preview */}
                <div
                  className="w-8 h-8 rounded flex-shrink-0"
                  style={{ backgroundColor: colors[i] }}
                />

                {/* Name + dimensions */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{ color: "var(--color-text)" }}
                  >
                    {piece.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {piece.w}×{piece.h}
                  </p>
                </div>

                {/* Visibility toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePiece(piece.id);
                  }}
                  className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
                  style={{
                    backgroundColor: piece.visible
                      ? "var(--color-accent)"
                      : "color-mix(in srgb, var(--color-muted) 40%, transparent)",
                  }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                    style={{
                      left: piece.visible ? "22px" : "2px",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        {selected && (
          <div
            className="rounded-xl p-5 space-y-5"
            style={{ backgroundColor: "color-mix(in srgb, var(--color-bg) 90%, var(--color-text))" }}
          >
            <div className="flex items-center justify-between">
              <h3
                className="text-sm font-semibold tracking-wide uppercase"
                style={{ color: "var(--color-muted)" }}
              >
                Edit: {selected.name}
              </h3>
              <button
                onClick={() => resetPiece(selected.id)}
                className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  color: "var(--color-accent)",
                  backgroundColor: "color-mix(in srgb, var(--color-accent) 10%, transparent)",
                }}
              >
                Reset Piece
              </button>
            </div>

            {/* Width & Height */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--color-muted)" }}
                >
                  Width (px)
                </label>
                <input
                  type="number"
                  min={5}
                  max={400}
                  value={selected.w}
                  onChange={(e) =>
                    updatePiece(selected.id, {
                      w: Math.max(5, parseInt(e.target.value) || 5),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--color-bg) 60%, var(--color-text))",
                    color: "var(--color-text)",
                    border: "1px solid color-mix(in srgb, var(--color-muted) 30%, transparent)",
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--color-muted)" }}
                >
                  Height (px)
                </label>
                <input
                  type="number"
                  min={5}
                  max={400}
                  value={selected.h}
                  onChange={(e) =>
                    updatePiece(selected.id, {
                      h: Math.max(5, parseInt(e.target.value) || 5),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--color-bg) 60%, var(--color-text))",
                    color: "var(--color-text)",
                    border: "1px solid color-mix(in srgb, var(--color-muted) 30%, transparent)",
                  }}
                />
              </div>
            </div>

            {/* Clip Path */}
            <div>
              <label
                className="block text-xs font-medium mb-1.5"
                style={{ color: "var(--color-muted)" }}
              >
                Clip Path (polygon)
              </label>
              <textarea
                rows={3}
                value={selected.clipPath}
                onChange={(e) =>
                  updatePiece(selected.id, { clipPath: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none font-mono"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-bg) 60%, var(--color-text))",
                  color: "var(--color-text)",
                  border: "1px solid color-mix(in srgb, var(--color-muted) 30%, transparent)",
                }}
              />
              <p
                className="text-xs mt-1"
                style={{ color: "var(--color-muted)" }}
              >
                Example: polygon(0% 0%, 100% 0%, 50% 100%)
              </p>
            </div>

            {/* Piece preview */}
            <div>
              <label
                className="block text-xs font-medium mb-2"
                style={{ color: "var(--color-muted)" }}
              >
                Preview
              </label>
              <div
                className="w-full h-24 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-bg) 40%, var(--color-text))",
                  border: "1px solid color-mix(in srgb, var(--color-muted) 20%, transparent)",
                }}
              >
                <div
                  style={{
                    width: Math.min(selected.w, 120),
                    height: Math.min(selected.h, 80),
                    clipPath: selected.clipPath,
                    backgroundColor: colors[selected.id],
                    transition: "all 0.3s ease",
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Live tangram preview */}
      <div className="space-y-6">
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-bg) 90%, var(--color-text))" }}
        >
          <h3
            className="text-sm font-semibold tracking-wide uppercase mb-4"
            style={{ color: "var(--color-muted)" }}
          >
            Live Preview
          </h3>

          <div
            className="w-full rounded-lg overflow-hidden flex items-center justify-center p-8"
            style={{
              backgroundColor: "color-mix(in srgb, var(--color-text) 8%, var(--color-bg))",
              aspectRatio: "2 / 1",
            }}
          >
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-full">
              {config.pieces.map((piece, i) => {
                if (!piece.visible) return null;
                const fig = config.figures[0];
                const pos = fig?.place[i];
                if (!pos) return null;

                return (
                  <foreignObject
                    key={piece.id}
                    x={pos[0]}
                    y={pos[1]}
                    width={piece.w}
                    height={piece.h}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        clipPath: piece.clipPath,
                        backgroundColor: colors[i],
                      }}
                    />
                  </foreignObject>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Tips */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-bg) 90%, var(--color-text))" }}
        >
          <h3
            className="text-sm font-semibold tracking-wide uppercase mb-3"
            style={{ color: "var(--color-muted)" }}
          >
            How to Edit
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: "var(--color-muted)" }}>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Toggle visibility</strong> — hide/show pieces using the switch
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Resize</strong> — change width and height in pixels
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Reshape</strong> — edit the polygon clip-path to change the piece&apos;s shape
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Reset</strong> — restore original SVG values per piece or all at once
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
