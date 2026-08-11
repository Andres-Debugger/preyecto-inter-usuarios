"use client";

import { useState, useRef } from "react";
import { usePalette, Palette, PALETTE_ROLES } from "@/context/PaletteContext";
import { useTypography } from "@/context/TypographyContext";
import { useToast } from "@/components/Toast";
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

const PRESET_PALETTES: { name: string; colors: [string, string, string, string, string]; mode: "light" | "dark" }[] = [
  { name: "Brillo & Co Default", colors: ["#F5F0E8", "#1C1917", "#B8956A", "#E8E2D8", "#78716C"], mode: "light" },
  { name: "Midnight Gold", colors: ["#1A1A2E", "#E8D5B7", "#D4AF37", "#16213E", "#8B7355"], mode: "dark" },
  { name: "Rose Quartz", colors: ["#F8EDEB", "#3D405B", "#E07A5F", "#FFF1E6", "#81B29A"], mode: "light" },
  { name: "Nordic Frost", colors: ["#F0F4F8", "#2D3748", "#4FD1C5", "#EDF2F7", "#718096"], mode: "light" },
  { name: "Earth Tone", colors: ["#F5E6D3", "#5C4033", "#C17817", "#E8D5B7", "#8B6914"], mode: "light" },
  { name: "Sakura", colors: ["#FFF0F5", "#4A2040", "#FF69B4", "#FFE4E1", "#C71585"], mode: "light" },
  { name: "Forest", colors: ["#F0FFF0", "#1B4332", "#52B788", "#D8F3DC", "#2D6A4F"], mode: "light" },
  { name: "Ocean", colors: ["#F0F8FF", "#1B2838", "#0077B6", "#CAF0F8", "#023E8A"], mode: "light" },
  { name: "Christmas", colors: ["#FFF5F5", "#1A1A1A", "#C41E3A", "#F0F0F0", "#228B22"], mode: "light" },
  { name: "Halloween", colors: ["#1A1A1A", "#FF6600", "#8B0000", "#2D2D2D", "#FFD700"], mode: "dark" },
];

function TypographyConfigurator() {
  const { config, activePreset, updateTitleFont, updateBodyFont, updateSizes, savePreset } = useTypography();
  const { addToast } = useToast();
  const titleInputRef = useRef<HTMLInputElement>(null);
  const bodyInputRef = useRef<HTMLInputElement>(null);
  const [titleName, setTitleName] = useState(config.titleFontName);
  const [bodyName, setBodyName] = useState(config.bodyFontName);
  const [sizes, setSizes] = useState({
    title: config.titleSize,
    subtitle: config.subtitleSize,
    paragraph: config.paragraphSize,
  });
  const [showSave, setShowSave] = useState(false);
  const [presetName, setPresetName] = useState("");

  const handleFontUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "title" | "body"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".ttf")) {
      addToast("Only .ttf files are allowed", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      if (type === "title") {
        setTitleName(file.name.replace(".ttf", ""));
        updateTitleFont(file.name.replace(".ttf", ""), base64);
        addToast("Title font loaded successfully", "success");
      } else {
        setBodyName(file.name.replace(".ttf", ""));
        updateBodyFont(file.name.replace(".ttf", ""), base64);
        addToast("Body font loaded successfully", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplySizes = () => {
    updateSizes(sizes.title, sizes.subtitle, sizes.paragraph);
    addToast("Font sizes updated", "success");
  };

  const handleSave = () => {
    if (!presetName.trim()) return;
    savePreset(presetName.trim(), {
      titleFontName: titleName,
      titleFontData: config.titleFontData,
      bodyFontName: bodyName,
      bodyFontData: config.bodyFontData,
      titleSize: sizes.title,
      subtitleSize: sizes.subtitle,
      paragraphSize: sizes.paragraph,
    });
    setPresetName("");
    setShowSave(false);
    addToast(`Preset "${presetName.trim()}" saved`, "success");
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-muted)]/20 p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{ backgroundColor: "var(--color-accent)", color: "var(--color-bg)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7V4h16v3" />
              <path d="M9 20h6" />
              <path d="M12 4v16" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
              Typography Configurator
            </h3>
            <p className="text-xs tracking-wider uppercase mt-0.5" style={{ color: "var(--color-muted)" }}>
              Active preset: {activePreset.name}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowSave(!showSave)}
          className="text-xs tracking-wider uppercase px-4 py-2 border transition-all duration-200 hover:opacity-80"
          style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
        >
          {showSave ? "Cancel" : "Save as Preset"}
        </button>
      </div>

      {showSave && (
        <div className="mb-8 p-4 border animate-slide-up" style={{ borderColor: "var(--color-accent)", backgroundColor: "color-mix(in srgb, var(--color-accent) 5%, transparent)" }}>
          <label className="block text-xs tracking-[0.15em] uppercase mb-2" style={{ color: "var(--color-muted)" }}>
            Preset Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="e.g. Elegance Serif, Modern Clean..."
              className="flex-1 px-4 py-2.5 text-sm border bg-transparent outline-none transition-colors duration-200 focus:border-[var(--color-accent)]"
              style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <button
              onClick={handleSave}
              disabled={!presetName.trim()}
              className="btn-primary disabled:opacity-40"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Font uploads */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.15em] uppercase mb-4" style={{ color: "var(--color-muted)" }}>
          Upload Fonts
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title font */}
          <div>
            <input
              ref={titleInputRef}
              type="file"
              accept=".ttf"
              onChange={(e) => handleFontUpload(e, "title")}
              className="hidden"
            />
            <button
              onClick={() => titleInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-4 text-sm border-2 border-dashed transition-all duration-200 hover:border-[var(--color-accent)] hover:bg-[color-mix(in_srgb,var(--color-accent)_5%,transparent)]"
              style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "color-mix(in srgb, var(--color-accent) 15%, transparent)", color: "var(--color-accent)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs tracking-wider uppercase mb-0.5" style={{ color: "var(--color-muted)" }}>
                  Title Font
                </p>
                {titleName ? (
                  <p className="font-medium text-sm truncate" style={{ color: "var(--color-text)" }}>
                    {titleName}
                  </p>
                ) : (
                  <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                    Select .ttf file
                  </p>
                )}
              </div>
            </button>
          </div>

          {/* Body font */}
          <div>
            <input
              ref={bodyInputRef}
              type="file"
              accept=".ttf"
              onChange={(e) => handleFontUpload(e, "body")}
              className="hidden"
            />
            <button
              onClick={() => bodyInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-4 text-sm border-2 border-dashed transition-all duration-200 hover:border-[var(--color-accent)] hover:bg-[color-mix(in_srgb,var(--color-accent)_5%,transparent)]"
              style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "color-mix(in srgb, var(--color-accent) 15%, transparent)", color: "var(--color-accent)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs tracking-wider uppercase mb-0.5" style={{ color: "var(--color-muted)" }}>
                  Subtitle & Body Font
                </p>
                {bodyName ? (
                  <p className="font-medium text-sm truncate" style={{ color: "var(--color-text)" }}>
                    {bodyName}
                  </p>
                ) : (
                  <p className="text-sm" style={{ color: "var(--color-muted)" }}>
                    Select .ttf file
                  </p>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Font sizes */}
      <div className="mb-8">
        <p className="text-xs tracking-[0.15em] uppercase mb-4" style={{ color: "var(--color-muted)" }}>
          Font Sizes
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text)" }}>
              Title (px)
            </label>
            <input
              type="number"
              value={sizes.title}
              onChange={(e) => setSizes({ ...sizes, title: Number(e.target.value) })}
              className="w-full px-4 py-3 text-sm border bg-transparent outline-none transition-colors duration-200 focus:border-[var(--color-accent)]"
              style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text)" }}>
              Subtitle (px)
            </label>
            <input
              type="number"
              value={sizes.subtitle}
              onChange={(e) => setSizes({ ...sizes, subtitle: Number(e.target.value) })}
              className="w-full px-4 py-3 text-sm border bg-transparent outline-none transition-colors duration-200 focus:border-[var(--color-accent)]"
              style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: "var(--color-text)" }}>
              Paragraph (px)
            </label>
            <input
              type="number"
              value={sizes.paragraph}
              onChange={(e) => setSizes({ ...sizes, paragraph: Number(e.target.value) })}
              className="w-full px-4 py-3 text-sm border bg-transparent outline-none transition-colors duration-200 focus:border-[var(--color-accent)]"
              style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
            />
          </div>
        </div>

        <button
          onClick={handleApplySizes}
          className="w-full mt-6 btn-primary justify-center"
        >
          Apply Changes
        </button>
      </div>

      {/* Live preview */}
      <div className="border-t pt-8" style={{ borderColor: "color-mix(in srgb, var(--color-muted) 30%, transparent)" }}>
        <p className="text-xs tracking-[0.15em] uppercase mb-4 flex items-center gap-2" style={{ color: "var(--color-muted)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Live Preview
        </p>
        <div
          className="p-8 rounded-lg border"
          style={{ backgroundColor: "var(--color-bg)", borderColor: "color-mix(in srgb, var(--color-muted) 20%, transparent)" }}
        >
          <h4
            className="mb-3"
            style={{
              fontFamily: config.titleFontData ? "'CustomTitle', serif" : "Playfair Display, serif",
              fontSize: `${sizes.title}px`,
              color: "var(--color-text)",
              lineHeight: 1.2,
            }}
          >
            Sample Title
          </h4>
          <p
            className="mb-3"
            style={{
              fontFamily: config.bodyFontData ? "'CustomBody', sans-serif" : "Inter, sans-serif",
              fontSize: `${sizes.subtitle}px`,
              color: "var(--color-muted)",
            }}
          >
            Sample Subtitle
          </p>
          <p
            className="mb-6"
            style={{
              fontFamily: config.bodyFontData ? "'CustomBody', sans-serif" : "Inter, sans-serif",
              fontSize: `${sizes.paragraph}px`,
              color: "var(--color-text)",
              lineHeight: 1.6,
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium tracking-wider uppercase"
            style={{ backgroundColor: "var(--color-accent)", color: "var(--color-bg)" }}
          >
            Sample Button
          </button>
        </div>
      </div>
    </div>
  );
}

function TypographyList() {
  const { presets, activePreset, activatePreset, deletePreset, searchPresets, previewPreset, setPreviewPreset } = useTypography();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [showDelete, setShowDelete] = useState<string | null>(null);

  const filtered = search.trim() ? searchPresets(search) : presets;

  const handleDelete = (id: string, name: string) => {
    deletePreset(id);
    setShowDelete(null);
    addToast(`Preset "${name}" deleted`, "info");
  };

  const handleActivate = (id: string, name: string) => {
    activatePreset(id);
    addToast(`Preset "${name}" activated`, "success");
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-muted)]/20 p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
          Saved Typography Presets
        </h3>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-8 pr-4 py-2 text-xs border bg-transparent outline-none w-40 transition-colors duration-200 focus:border-[var(--color-accent)]"
            style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
          />
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-muted)" }}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((preset) => {
          const isActive = activePreset.id === preset.id;
          const isPreview = previewPreset?.id === preset.id;

          return (
            <div
              key={preset.id}
              className={`flex items-center gap-3 p-4 border transition-all duration-200 ${
                isActive ? "ring-1" : ""
              }`}
              style={{
                borderColor: isActive ? "var(--color-accent)" : "color-mix(in srgb, var(--color-muted) 30%, transparent)",
                backgroundColor: isActive ? "color-mix(in srgb, var(--color-accent) 8%, transparent)" : "transparent",
              }}
            >
              {/* Typography preview */}
              <div className="flex-shrink-0 w-12 text-center">
                <p
                  className="text-base font-bold leading-tight"
                  style={{
                    fontFamily: preset.config.titleFontData ? "'CustomTitle', serif" : "serif",
                    color: "var(--color-text)",
                  }}
                >
                  Aa
                </p>
                <p
                  className="text-[8px] leading-tight"
                  style={{
                    fontFamily: preset.config.bodyFontData ? "'CustomBody', sans-serif" : "sans-serif",
                    color: "var(--color-muted)",
                  }}
                >
                  Body
                </p>
              </div>

              {/* Name + info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>
                  {preset.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {isActive && (
                    <span className="text-[9px] tracking-wider uppercase px-1.5 py-0.5" style={{ backgroundColor: "var(--color-accent)", color: "var(--color-bg)" }}>
                      Active
                    </span>
                  )}
                  <span className="text-[9px] tracking-wider" style={{ color: "var(--color-muted)" }}>
                    T:{preset.config.titleSize}px S:{preset.config.subtitleSize}px P:{preset.config.paragraphSize}px
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewPreset(isPreview ? null : preset)}
                  className="text-[10px] tracking-wider uppercase px-3 py-1.5 border transition-all duration-200 hover:opacity-80"
                  style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
                >
                  {isPreview ? "Exit" : "Preview"}
                </button>

                {!isActive && (
                  <button
                    onClick={() => handleActivate(preset.id, preset.name)}
                    className="text-[10px] tracking-wider uppercase px-3 py-1.5 transition-all duration-200 hover:opacity-80"
                    style={{ backgroundColor: "var(--color-text)", color: "var(--color-bg)" }}
                  >
                    Activate
                  </button>
                )}

                {preset.id !== "default" && (
                  <div className="relative">
                    <button
                      onClick={() => setShowDelete(showDelete === preset.id ? null : preset.id)}
                      className="text-[10px] tracking-wider uppercase px-2 py-1.5 transition-all duration-200 hover:opacity-70"
                      style={{ color: "var(--color-muted)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                    {showDelete === preset.id && (
                      <div
                        className="absolute right-0 top-full mt-1 p-3 border shadow-lg z-10 animate-slide-up"
                        style={{ borderColor: "var(--color-muted)", backgroundColor: "var(--color-bg)" }}
                      >
                        <p className="text-[11px] mb-2 whitespace-nowrap" style={{ color: "var(--color-text)" }}>
                          Delete &quot;{preset.name}&quot;?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(preset.id, preset.name)}
                            className="text-[10px] px-2 py-1 bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setShowDelete(null)}
                            className="text-[10px] px-2 py-1 border hover:opacity-80 transition-opacity"
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
            No typography presets found. Create one above!
          </p>
        )}
      </div>
    </div>
  );
}

function PaletteCreator({ onCreated }: { onCreated: () => void }) {
  const { savePalette } = usePalette();
  const { addToast } = useToast();
  const [name, setName] = useState("");
  const [colors, setColors] = useState<[string, string, string, string, string]>([
    "#F5F0E8", "#1C1917", "#B8956A", "#E8E2D8", "#78716C",
  ]);
  const [mode, setMode] = useState<"light" | "dark">("light");
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
    savePalette(name.trim(), colors, mode);
    setName("");
    setError("");
    onCreated();
    addToast(`Palette "${name.trim()}" saved`, "success");
  };

  const loadPreset = (preset: typeof PRESET_PALETTES[0]) => {
    setColors(preset.colors);
    setName(preset.name);
    setMode(preset.mode);
    addToast(`Preset "${preset.name}" loaded`, "info");
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-muted)]/20 p-6 md:p-8">
      <h3 className="text-lg font-semibold mb-6" style={{ color: "var(--color-text)" }}>
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
              <span className="text-[9px] opacity-60 ml-0.5">({preset.mode})</span>
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

      {/* Mode selector */}
      <div className="mb-6">
        <label className="block text-xs tracking-[0.15em] uppercase mb-2" style={{ color: "var(--color-muted)" }}>
          Palette Mode
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setMode("light")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm border-2 transition-all duration-200"
            style={{
              borderColor: mode === "light" ? "var(--color-accent)" : "var(--color-muted)",
              backgroundColor: mode === "light" ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : "transparent",
              color: "var(--color-text)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            Light Mode
          </button>
          <button
            onClick={() => setMode("dark")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm border-2 transition-all duration-200"
            style={{
              borderColor: mode === "dark" ? "var(--color-accent)" : "var(--color-muted)",
              backgroundColor: mode === "dark" ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : "transparent",
              color: "var(--color-text)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            Dark Mode
          </button>
        </div>
      </div>

      {/* 5 Color pickers */}
      <div className="mb-6">
        <label className="block text-xs tracking-[0.15em] uppercase mb-3" style={{ color: "var(--color-muted)" }}>
          Colors (exactly 5)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {PALETTE_ROLES.map((role, i) => (
            <div key={role} className="flex flex-col items-center gap-2">
              <label
                htmlFor={`color-${role}`}
                className="text-[10px] tracking-[0.1em] uppercase font-medium"
                style={{ color: "var(--color-text)" }}
              >
                {ROLE_LABELS[role]}
              </label>
              <p className="text-[9px] text-center" style={{ color: "var(--color-muted)" }}>
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
        Save Palette
      </button>
    </div>
  );
}

function PaletteList() {
  const { palettes, activePalette, activatePalette, deletePalette, searchPalettes, previewPalette, setPreviewPalette } = usePalette();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [showDelete, setShowDelete] = useState<string | null>(null);

  const filtered = search.trim() ? searchPalettes(search) : palettes;

  const handleDelete = (id: string, name: string) => {
    deletePalette(id);
    setShowDelete(null);
    addToast(`Palette "${name}" deleted`, "info");
  };

  const handleActivate = (id: string, name: string) => {
    activatePalette(id);
    addToast(`Palette "${name}" activated`, "success");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
          Saved Palettes
        </h3>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="pl-8 pr-4 py-2 text-xs border bg-transparent outline-none w-40 transition-colors duration-200 focus:border-[var(--color-accent)]"
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
                isActive ? "ring-1" : ""
              }`}
              style={{
                borderColor: isActive ? "var(--color-accent)" : "color-mix(in srgb, var(--color-muted) 30%, transparent)",
                backgroundColor: isActive ? "color-mix(in srgb, var(--color-accent) 8%, transparent)" : "transparent",
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
                <div className="flex items-center gap-2">
                  {isActive && (
                    <span className="text-[9px] tracking-wider uppercase px-1.5 py-0.5" style={{ backgroundColor: "var(--color-accent)", color: "var(--color-bg)" }}>
                      Active
                    </span>
                  )}
                  <span
                    className="text-[9px] tracking-wider uppercase px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: palette.mode === "dark" ? "#333" : "#f0f0f0",
                      color: palette.mode === "dark" ? "#ddd" : "#666",
                    }}
                  >
                    {palette.mode}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewPalette(isPreview ? null : palette)}
                  className="text-[10px] tracking-wider uppercase px-3 py-1.5 border transition-all duration-200 hover:opacity-80"
                  style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
                >
                  {isPreview ? "Exit" : "Preview"}
                </button>

                {!isActive && (
                  <button
                    onClick={() => handleActivate(palette.id, palette.name)}
                    className="text-[10px] tracking-wider uppercase px-3 py-1.5 transition-all duration-200 hover:opacity-80"
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
                        className="absolute right-0 top-full mt-1 p-3 border shadow-lg z-10 animate-slide-up"
                        style={{ borderColor: "var(--color-muted)", backgroundColor: "var(--color-bg)" }}
                      >
                        <p className="text-[11px] mb-2 whitespace-nowrap" style={{ color: "var(--color-text)" }}>
                          Delete &quot;{palette.name}&quot;?
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(palette.id, palette.name)}
                            className="text-[10px] px-2 py-1 bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setShowDelete(null)}
                            className="text-[10px] px-2 py-1 border hover:opacity-80 transition-opacity"
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
  const { config } = useTypography();
  const p = previewPalette || activePalette;
  const [previewDark, setPreviewDark] = useState(false);

  const isDark = previewDark || p.mode === "dark";

  const bg = isDark ? "#1A1A1A" : p.colors[0];
  const text = isDark ? "#F0EBE1" : p.colors[1];
  const accent = isDark ? "#D4AF37" : p.colors[2];
  const surface = isDark ? "#2A2A2A" : p.colors[3];
  const mutedColor = isDark ? "#888888" : p.colors[4];

  const titleFont = config.titleFontData ? "'CustomTitle', serif" : "serif";
  const bodyFont = config.bodyFontData ? "'CustomBody', sans-serif" : "sans-serif";

  return (
    <div className="border p-6" style={{ borderColor: "color-mix(in srgb, var(--color-muted) 30%, transparent)" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
          Live Preview
        </h3>
        {/* Independent dark/light toggle for preview */}
        <button
          onClick={() => setPreviewDark(!previewDark)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-wider uppercase border transition-all duration-200 hover:opacity-80"
          style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
        >
          {previewDark ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              Light
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              Dark
            </>
          )}
        </button>
      </div>

      {previewPalette && (
        <p className="text-[10px] tracking-wider uppercase mb-4" style={{ color: "var(--color-accent)" }}>
          Previewing: {previewPalette.name}
        </p>
      )}

      <div
        className="rounded-lg overflow-hidden border"
        style={{ backgroundColor: bg, borderColor: `${mutedColor}30` }}
      >
        {/* Mini header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: `${bg}E6` }}>
          <span style={{ fontFamily: bodyFont, fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: text }}>
            Menu
          </span>
          <span style={{ fontFamily: titleFont, fontSize: "14px", letterSpacing: "0.1em", color: text }}>
            BRILLO &amp; CO
          </span>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: text }} />
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: text }} />
          </div>
        </div>

        {/* Mini hero */}
        <div className="relative h-32 flex items-end p-4">
          <div className="absolute inset-0 bg-gradient-to-br opacity-20" style={{ backgroundImage: `linear-gradient(135deg, ${accent}, ${mutedColor})` }} />
          <div className="relative z-10">
            <p style={{ fontFamily: bodyFont, fontSize: "7px", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: mutedColor, marginBottom: "4px" }}>
              Collection
            </p>
            <p style={{ fontFamily: titleFont, fontSize: `${Math.min(config.titleSize * 0.5, 28)}px`, lineHeight: 1, color: text, marginBottom: "8px" }}>
              2025
            </p>
            <div
              className="inline-flex items-center gap-1 px-3 py-1"
              style={{ backgroundColor: text, color: bg, fontSize: "7px", letterSpacing: "0.1em", textTransform: "uppercase" as const }}
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
              className="p-2 text-center"
              style={{ backgroundColor: surface, color: text, fontSize: "7px", letterSpacing: "0.1em", textTransform: "uppercase" as const }}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Mini products */}
        <div className="grid grid-cols-4 gap-1 p-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <div className="aspect-square rounded" style={{ backgroundColor: surface }} />
              <p style={{ fontFamily: titleFont, fontSize: "6px", marginTop: "4px", color: text }}>Product {i}</p>
              <p style={{ fontFamily: bodyFont, fontSize: "6px", color: mutedColor }}>$280</p>
            </div>
          ))}
        </div>

        {/* Mini footer */}
        <div className="p-3 text-center" style={{ backgroundColor: text }}>
          <p style={{ fontFamily: titleFont, fontSize: "7px", letterSpacing: "0.1em", color: bg }}>
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
          <h1 className="text-[clamp(2rem,4vw,3.5rem)] mb-2" style={{ fontFamily: "var(--font-title)", color: "var(--color-text)" }}>
            Settings
          </h1>
          <p className="text-sm mb-12" style={{ color: "var(--color-muted)" }}>
            Configure typography, colors, and preview your store&apos;s appearance.
          </p>

          <div className="space-y-16">
            {/* Typography Section */}
            <section>
              <h2 className="text-xs tracking-[0.2em] uppercase mb-6 font-semibold" style={{ color: "var(--color-accent)" }}>
                Typography
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <TypographyConfigurator />
                </div>
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <TypographyList />
                  </div>
                </div>
              </div>
            </section>

            {/* Palettes Section */}
            <section>
              <h2 className="text-xs tracking-[0.2em] uppercase mb-6 font-semibold" style={{ color: "var(--color-accent)" }}>
                Color Palette
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <PaletteCreator onCreated={() => setRefreshKey((k) => k + 1)} />
                  <PaletteList />
                </div>

                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <LivePreview />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
