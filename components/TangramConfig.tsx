"use client";

import { useState } from "react";
import { useTangram } from "@/context/TangramContext";
import { usePalette } from "@/context/PaletteContext";
import { DEFAULT_CONFIG } from "@/types/tangram";
import TangramViewer from "@/components/TangramViewer";

export default function TangramConfig() {
  const { config, updatePiece, updateFigure, togglePiece, resetConfig, resetPiece, resetFigure } = useTangram();
  const { activePalette } = usePalette();
  const [selectedId, setSelectedId] = useState(0);
  const [selectedFigureIdx, setSelectedFigureIdx] = useState(0);

  const selected = config.pieces.find((p) => p.id === selectedId);
  const selectedFigure = config.figures[selectedFigureIdx];
  const colors = activePalette.colors;

  const effectiveSize = (pieceId: number): [number, number] => {
    const figSize = selectedFigure?.sizes?.[pieceId];
    if (figSize) return figSize;
    const p = config.pieces.find((pp) => pp.id === pieceId);
    return p ? [p.w, p.h] : [0, 0];
  };

  const setPlaceValue = (axis: 0 | 1 | 2, value: number) => {
    if (!selectedFigure) return;
    const place = selectedFigure.place.map((p, idx) => {
      if (idx !== selectedId) return p;
      const cur: [number, number, number] = p ? [p[0], p[1], p[2]] : [0, 0, 0];
      cur[axis] = value;
      return cur;
    });
    updateFigure(selectedFigure.id, { place });
  };

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
                <div className="w-8 h-8 rounded flex-shrink-0" style={{ backgroundColor: colors[i] }} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>
                    {piece.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                    {effectiveSize(piece.id)[0]}×{effectiveSize(piece.id)[1]}
                  </p>
                </div>

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
                    style={{ left: piece.visible ? "22px" : "2px" }}
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
              <h3 className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--color-muted)" }}>
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
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-muted)" }}>
                  Width (px)
                </label>
                <input
                  type="number"
                  min={5}
                  max={400}
                  value={effectiveSize(selected.id)[0]}
                  onChange={(e) =>
                    updatePiece(selected.id, { w: Math.max(5, parseInt(e.target.value) || 5) })
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
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-muted)" }}>
                  Height (px)
                </label>
                <input
                  type="number"
                  min={5}
                  max={400}
                  value={effectiveSize(selected.id)[1]}
                  onChange={(e) =>
                    updatePiece(selected.id, { h: Math.max(5, parseInt(e.target.value) || 5) })
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
            <p className="text-xs -mt-3" style={{ color: "var(--color-muted)" }}>
              Size changes apply to all 3 figures
            </p>

            {/* Clip Path (fixed per piece) */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-muted)" }}>
                Clip Path (piece shape)
              </label>
              <input
                type="text"
                value={selected.clipPath}
                onChange={(e) => updatePiece(selected.id, { clipPath: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-xs font-mono outline-none"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-bg) 60%, var(--color-text))",
                  color: "var(--color-text)",
                  border: "1px solid color-mix(in srgb, var(--color-muted) 30%, transparent)",
                }}
              />
              <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                Shape of the piece (fixed across all figures)
              </p>
            </div>

            {/* Figure Position Editor */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-muted)" }}>
                Figure Position
              </label>
              <select
                value={selectedFigureIdx}
                onChange={(e) => setSelectedFigureIdx(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none mb-2"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--color-bg) 60%, var(--color-text))",
                  color: "var(--color-text)",
                  border: "1px solid color-mix(in srgb, var(--color-muted) 30%, transparent)",
                }}
              >
                {config.figures.map((fig, i) => (
                  <option key={fig.id} value={i}>
                    {fig.name} (ID: {fig.id})
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-3 gap-2">
                {(() => {
                  const pos = config.figures[selectedFigureIdx]?.place[selectedId] ?? [0, 0, 0];
                  const [left, top, rotate] = pos;
                  return (
                    <>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-muted)" }}>
                          Left (px)
                        </label>
                        <input
                          type="number"
                          min={-200}
                          max={600}
                          value={left}
                          onChange={(e) => setPlaceValue(0, parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--color-bg) 60%, var(--color-text))",
                            color: "var(--color-text)",
                            border: "1px solid color-mix(in srgb, var(--color-muted) 30%, transparent)",
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-muted)" }}>
                          Top (px)
                        </label>
                        <input
                          type="number"
                          min={-200}
                          max={600}
                          value={top}
                          onChange={(e) => setPlaceValue(1, parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--color-bg) 60%, var(--color-text))",
                            color: "var(--color-text)",
                            border: "1px solid color-mix(in srgb, var(--color-muted) 30%, transparent)",
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--color-muted)" }}>
                          Rotate (deg)
                        </label>
                        <input
                          type="number"
                          min={-360}
                          max={360}
                          value={rotate}
                          onChange={(e) => setPlaceValue(2, parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--color-bg) 60%, var(--color-text))",
                            color: "var(--color-text)",
                            border: "1px solid color-mix(in srgb, var(--color-muted) 30%, transparent)",
                          }}
                        />
                      </div>
                    </>
                  );
                })()}
              </div>

              <button
                onClick={() => selectedFigure && resetFigure(selectedFigure.id)}
                className="mt-3 text-xs px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  color: "var(--color-accent)",
                  backgroundColor: "color-mix(in srgb, var(--color-accent) 10%, transparent)",
                }}
              >
                Reset This Figure
              </button>
            </div>

            {/* Piece preview */}
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-muted)" }}>
                Preview (Figure {selectedFigureIdx + 1})
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
                    width: Math.min(effectiveSize(selected.id)[0], 120),
                    height: Math.min(effectiveSize(selected.id)[1], 80),
                    clipPath: selected.clipPath,
                    backgroundColor: colors[selectedId],
                    transform: `rotate(${config.figures[selectedFigureIdx]?.place[selectedId]?.[2] || 0}deg)`,
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
          <h3 className="text-sm font-semibold tracking-wide uppercase mb-4" style={{ color: "var(--color-muted)" }}>
            Animation Preview
          </h3>

          <div
            className="w-full rounded-lg overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: "color-mix(in srgb, var(--color-text) 8%, var(--color-bg))" }}
          >
            <TangramViewer autoPlay />
          </div>
        </div>

        {/* Tips */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-bg) 90%, var(--color-text))" }}
        >
          <h3 className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: "var(--color-muted)" }}>
            How to Edit
          </h3>
          <ul className="space-y-2 text-sm" style={{ color: "var(--color-muted)" }}>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Toggle visibility</strong> — hide/show pieces
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Resize</strong> — change width/height (applies to all figures)
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Reshape</strong> — edit the polygon clip-path (applies to all figures)
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Position</strong> — set left, top, rotation (per figure)
            </li>
            <li>
              <strong style={{ color: "var(--color-text)" }}>Reset</strong> — restore original values
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}