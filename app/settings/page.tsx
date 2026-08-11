"use client";

import { useState } from "react";
import { usePalette, Palette, PALETTE_ROLES } from "@/context/PaletteContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ROLE_LABELS: Record<string, string> = {
  background: "Background",
  text: "Text",
  accent: "Accent",
  surface: "Surface",
  muted: "Muted",
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  background: "Main page background",
  text: "Headings and body text",
  accent: "Highlights, hover states, selections",
  surface: "Cards, product images, inputs",
  muted: "Borders, secondary text, subtle elements",
};

const PRESET_PALETTES: { name: string; colors: [string, string, string, string, string] }[] = [
  { name: "Brillo & Co Default", colors: ["#F5F0E8", "#1C1917", "#B8956A", "#E8E2D8", "#78716C"] },
  { name: "Midnight Gold", colors: ["#1A1A2E", "#E8D5B7", "#D4AF37", "#16213E", "#8B7355"] },
  { name: "Rose Quartz", colors: ["#F8EDEB", "#3D405B", "#E07A5F", "#FFF1E6", "#81B29A"] },
  { name: "Nordic Frost", colors: ["#F0F4F8", "#2D3748", "#4FD1C5", "#EDF2F7", "#718096"] },
  { name: "Earth Tone", colors: ["#F5E6D3", "#5C4033", "#C17817", "#E8D5B7", "#8B6914"] },
  { name: "Sakura", colors: ["#FFF0F5", "#4A2040", "#FF69B4", "#FFE4E1", "#C71585"] },
  { name: "Forest", colors: ["#F0FFF0", "#1B4332", "#52B788", "#D8F3DC", "#2D6A4F"] },
  { name: "Ocean", colors: ["#F0F8FF", "#1B2838", "#0077B6", "#CAF0F8", "#023E8A"] },
  { name: "Christmas", colors: ["#FFF5F5", "#1A1A1A", "#C41E3A", "#F0F0F0", "#228B22"] },
  { name: "Halloween", colors: ["#1A1A1A", "#FF6600", "#8B0000", "#2D2D2D", "#FFD700"] },
];

function PaletteCreator({ onCreated }: { onCreated: () => void }) {
  const { savePalette } = usePalette();
  const [name, setName] = useState("");
  const [colors, setColors] = useState<[string, string, string, string, string]>([
    "#F5F0E8", "#1C1917", "#B8956A", "#E8E2D8", "#78716C",
  ]);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      setError("Please enter a name for this palette");
      return;
    }
    if (colors.some((c) => !/^#[0-9A-Fa-f]{6}$/.test(c))) {
      setError("All colors must be valid hex codes");
      return;
    }
    savePalette(name.trim(), colors);
    setName("");
    setError("");
    onCreated();
  };

  const loadPreset = (preset: typeof PRESET_PALETTES[0]) => {
    setColors(preset.colors);
    setName(preset.name);
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-[var(--color-muted)]/20 p-6 md:p-8">
      <h3 className="font-serif text-2xl mb-6" style={{ color: "var(--color-text)" }}>
        Create New Palette
      </h3>

      {/* Preset palettes */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.15em] uppercase mb-3" style={{ color: "var(--color-muted)" }}>
          Quick start from presets
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_PALETTES.map((preset) => (
            <button
              key={preset.name}
              onClick={() => loadPreset(preset)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-wider uppercase border transition-all duration-200 hover:scale-105"
              style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
            >
              {preset.colors.map((c, i) => (
                <span
                  key={i}
                  className="w-3 h-3 rounded-full border border-black/10"
                  style={{ backgroundColor: c }}
                />
              ))}
              <span className="ml-1">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Palette name */}
      <div className="mb-6">
        <label className="block text-xs tracking-[0.15em] uppercase mb-2" style={{ color: "var(--color-muted)" }}>
          Palette Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setError(""); }}
          placeholder="e.g. Christmas 2025"
          className="w-full px-4 py-3 text-sm border bg-transparent outline-none transition-colors duration-200 focus:border-[var(--color-accent)]"
          style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
        />
      </div>

      {/* 5 Color pickers */}
      <div className="mb-6">
        <label className="block text-xs tracking-[0.15em] uppercase mb-3" style={{ color: "var(--color-muted)" }}>
          Colors (exactly 5)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          {PALETTE_ROLES.map((role, i) => (
            <div key={role} className="flex flex-col items-center gap-2">
              <label
                htmlFor={`color-${role}`}
                className="text-[10px] tracking-[0.1em] uppercase font-medium"
                style={{ color: "var(--color-text)" }}
              >
                {ROLE_LABELS[role]}
              </label>
              <p className="text-[9px]" style={{ color: "var(--color-muted)" }}>
                {ROLE_DESCRIPTIONS[role]}
              </p>
              <div className="relative">
                <input
                  id={`color-${role}`}
                  type="color"
                  value={colors[i]}
                  onChange={(e) => {
                    const next = [...colors] as [string, string, string, string, string];
                    next[i] = e.target.value;
                    setColors(next);
                  }}
                  className="w-16 h-16 cursor-pointer border-2 border-black/10 rounded-lg"
                />
              </div>
              <input
                type="text"
                value={colors[i]}
                onChange={(e) => {
                  const next = [...colors] as [string, string, string, string, string];
                  next[i] = e.target.value;
                  setColors(next);
                }}
                className="w-24 text-center text-[11px] font-mono px-2 py-1 border bg-transparent outline-none"
                style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
              />
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-xs mb-4">{error}</p>
      )}

      <button
        onClick={handleSave}
        className="btn-primary"
      >
        SAVE PALETTE
      </button>
    </div>
  );
}

function PaletteList() {
  const { palettes, activePalette, activatePalette, deletePalette, searchPalettes, previewPalette, setPreviewPalette } = usePalette();
  const [search, setSearch] = useState("");
  const [showDelete, setShowDelete] = useState<string | null>(null);

  const filtered = search.trim() ? searchPalettes(search) : palettes;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl" style={{ color: "var(--color-text)" }}>
          Saved Palettes
        </h3>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search palettes..."
            className="pl-8 pr-4 py-2 text-xs border bg-transparent outline-none w-48"
            style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
          />
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-muted)" }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((palette) => {
          const isActive = activePalette.id === palette.id;
          const isPreview = previewPalette?.id === palette.id;

          return (
            <div
              key={palette.id}
              className={`flex items-center gap-4 p-4 border transition-all duration-200 ${
                isActive ? "ring-2" : ""
              }`}
              style={{
                borderColor: isActive ? "var(--color-accent)" : "var(--color-muted)",
                backgroundColor: isActive ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : "transparent",
              }}
            >
              {/* Color swatches */}
              <div className="flex gap-1">
                {palette.colors.map((c, i) => (
                  <span
                    key={i}
                    className="w-6 h-6 rounded-full border border-black/10"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              {/* Name + status */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>
                  {palette.name}
                </p>
                {isActive && (
                  <p className="text-[10px] tracking-wider uppercase" style={{ color: "var(--color-accent)" }}>
                    Active
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewPalette(isPreview ? null : palette)}
                  className="text-[10px] tracking-wider uppercase px-3 py-1.5 border transition-all duration-200"
                  style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
                >
                  {isPreview ? "Exit Preview" : "Preview"}
                </button>

                {!isActive && (
                  <button
                    onClick={() => activatePalette(palette.id)}
                    className="text-[10px] tracking-wider uppercase px-3 py-1.5 transition-all duration-200"
                    style={{ backgroundColor: "var(--color-text)", color: "var(--color-bg)" }}
                  >
                    Activate
                  </button>
                )}

                {palette.id !== "default" && (
                  <div className="relative">
                    <button
                      onClick={() => setShowDelete(showDelete === palette.id ? null : palette.id)}
                      className="text-[10px] tracking-wider uppercase px-2 py-1.5 transition-all duration-200 hover:opacity-70"
                      style={{ color: "var(--color-muted)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                    {showDelete === palette.id && (
                      <div
                        className="absolute right-0 top-full mt-1 p-3 border shadow-lg z-10 bg-white"
                        style={{ borderColor: "var(--color-muted)" }}
                      >
                        <p className="text-[11px] mb-2 whitespace-nowrap" style={{ color: "var(--color-text)" }}>
                          Delete &quot;{palette.name}&quot;?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { deletePalette(palette.id); setShowDelete(null); }}
                            className="text-[10px] px-2 py-1 bg-red-500 text-white"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setShowDelete(null)}
                            className="text-[10px] px-2 py-1 border"
                            style={{ borderColor: "var(--color-muted)" }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-sm py-8 text-center" style={{ color: "var(--color-muted)" }}>
            No palettes found. Create one above!
          </p>
        )}
      </div>
    </div>
  );
}

function LivePreview() {
  const { previewPalette, activePalette } = usePalette();
  const p = previewPalette || activePalette;

  return (
    <div className="border p-6" style={{ borderColor: "var(--color-muted)" }}>
      <h3 className="font-serif text-xl mb-4" style={{ color: "var(--color-text)" }}>
        Live Preview
      </h3>
      {previewPalette && (
        <p className="text-[10px] tracking-wider uppercase mb-4" style={{ color: "var(--color-accent)" }}>
          Previewing: {previewPalette.name}
        </p>
      )}

      <div
        className="rounded-lg overflow-hidden border"
        style={{ backgroundColor: p.colors[0], borderColor: `${p.colors[4]}30` }}
      >
        {/* Mini header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: `${p.colors[0]}E6` }}>
          <span className="text-[8px] tracking-[0.15em] uppercase" style={{ color: p.colors[1] }}>
            Menu
          </span>
          <span className="font-serif text-sm tracking-[0.1em]" style={{ color: p.colors[1] }}>
            BRILLO &amp; CO
          </span>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.colors[1] }} />
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.colors[1] }} />
          </div>
        </div>

        {/* Mini hero */}
        <div className="relative h-32 flex items-end p-4">
          <div className="absolute inset-0 bg-gradient-to-br opacity-20" style={{ backgroundImage: `linear-gradient(135deg, ${p.colors[2]}, ${p.colors[4]})` }} />
          <div className="relative z-10">
            <p className="text-[7px] tracking-[0.2em] uppercase mb-1" style={{ color: p.colors[4] }}>
              Collection
            </p>
            <p className="font-serif text-2xl leading-none mb-2" style={{ color: p.colors[1] }}>
              2025
            </p>
            <div
              className="inline-flex items-center gap-1 px-3 py-1 text-[7px] tracking-wider uppercase"
              style={{ backgroundColor: p.colors[1], color: p.colors[0] }}
            >
              Discover
            </div>
          </div>
        </div>

        {/* Mini categories */}
        <div className="grid grid-cols-2 gap-1 p-2">
          {["Rings", "Earrings", "Necklaces", "Bracelets"].map((cat) => (
            <div
              key={cat}
              className="p-2 text-center text-[7px] tracking-wider uppercase"
              style={{ backgroundColor: p.colors[3], color: p.colors[1] }}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Mini products */}
        <div className="grid grid-cols-4 gap-1 p-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="aspect-square rounded" style={{ backgroundColor: p.colors[3] }} />
              <p className="text-[6px] mt-1 font-serif" style={{ color: p.colors[1] }}>Product {i}</p>
              <p className="text-[6px]" style={{ color: p.colors[4] }}>$280</p>
            </div>
          ))}
        </div>

        {/* Mini footer */}
        <div className="p-3 text-center" style={{ backgroundColor: p.colors[1] }}>
          <p className="text-[7px] tracking-[0.1em]" style={{ color: p.colors[0] }}>
            BRILLO &amp; CO
          </p>
        </div>
      </div>

      {/* Color legend */}
      <div className="mt-4 space-y-1.5">
        {PALETTE_ROLES.map((role, i) => (
          <div key={role} className="flex items-center gap-2">
            <span className="w-4 h-4 rounded border border-black/10" style={{ backgroundColor: p.colors[i] }} />
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
              {ROLE_LABELS[role]}: {p.colors[i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [, setRefreshKey] = useState(0);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <h1 className="font-serif text-[clamp(2rem,4vw,3.5rem)] mb-2" style={{ color: "var(--color-text)" }}>
            Palette Settings
          </h1>
          <p className="text-sm mb-12" style={{ color: "var(--color-muted)" }}>
            Create, manage, and preview color palettes for your store.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Creator + List */}
            <div className="lg:col-span-2 space-y-8">
              <PaletteCreator onCreated={() => setRefreshKey((k) => k + 1)} />
              <PaletteList />
            </div>

            {/* Right: Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <LivePreview />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
