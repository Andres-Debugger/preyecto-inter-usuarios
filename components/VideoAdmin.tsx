/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { useVideo } from "@/context/VideoContext";
import { useToast } from "@/components/Toast";
import ImageCropperModal from "@/components/ImageCropperModal";
import type {
  StoredImage,
  StoredSource,
  StoredVideoRecord,
  VideoLang,
  VideoSavePayload,
} from "@/types/video";

interface CropState {
  blob: Blob;
  width: number;
  height: number;
  previewUrl: string;
}

interface FileFieldState {
  file: File | null;
  fileName: string | null;
  url: string;
}

function emptyField(): FileFieldState {
  return { file: null, fileName: null, url: "" };
}

const MEDIA_EXTS: Record<string, string[]> = {
  video: ["mp4", "webm", "mov", "m4v", "ogv"],
  audio: ["mp3", "wav", "ogg", "m4a", "aac", "flac", "opus"],
  subtitle: ["vtt", "srt"],
  image: ["jpg", "jpeg", "png", "gif", "webp", "avif"],
};

type MediaKind = keyof typeof MEDIA_EXTS;

function validateMediaUrl(
  url: string,
  kind: MediaKind
): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return "Enter a valid URL (https://…)";
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return "Only http(s) URLs are supported";
  }
  if (parsed.hostname === "gist.github.com") {
    return "This is a webpage. Use the raw file link instead (gist.githubusercontent.com/…/raw/…).";
  }
  const path = parsed.pathname.toLowerCase();
  const lastSeg = path.split("/").pop() ?? "";
  if (lastSeg.includes(".")) {
    const ext = lastSeg.split(".").pop() ?? "";
    if (!MEDIA_EXTS[kind].includes(ext)) {
      return `Expected a ${kind} file (${MEDIA_EXTS[kind].slice(0, 3).join(", ")})`;
    }
  }
  return null;
}

function fieldFromRecord(source?: StoredSource): FileFieldState {
  if (!source) return emptyField();
  if (source.kind === "url") return { file: null, fileName: null, url: source.value };
  return { file: null, fileName: source.name ?? "existing file", url: "" };
}

function FileUrlRow({
  label,
  hint,
  accept,
  field,
  urlKind,
  onFile,
  onUrl,
}: {
  label: string;
  hint: string;
  accept: string;
  field: FileFieldState;
  urlKind: MediaKind;
  onFile: (file: File | null) => void;
  onUrl: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const urlError = field.url.trim() ? validateMediaUrl(field.url, urlKind) : null;

  return (
    <div className="p-4 border" style={{ borderColor: "color-mix(in srgb, var(--color-muted) 25%, transparent)" }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="text-xs tracking-[0.12em] uppercase font-medium" style={{ color: "var(--color-text)" }}>
            {label}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: "var(--color-muted)" }}>
            {hint}
          </p>
        </div>
        {(field.file || field.fileName) && (
          <button
            onClick={() => onFile(null)}
            className="text-[10px] tracking-wider uppercase shrink-0 transition-opacity hover:opacity-60"
            style={{ color: "var(--color-muted)" }}
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          onFile(file);
          e.target.value = "";
        }}
      />

      <button
        onClick={() => inputRef.current?.click()}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm border-2 border-dashed transition-all duration-200 hover:border-[var(--color-accent)] hover:bg-[color-mix(in_srgb,var(--color-accent)_5%,transparent)]"
        style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-accent)" }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span className="text-left truncate">
          {field.file
            ? field.file.name
            : field.fileName
            ? `${field.fileName} (saved)`
            : "Select file"}
        </span>
      </button>

      <div className="mt-3">
        <input
          type="url"
          value={field.url}
          onChange={(e) => onUrl(e.target.value)}
          placeholder="…or paste a URL"
          className="w-full px-3 py-2 text-xs bg-transparent outline-none border"
          style={{
            borderColor: urlError
              ? "#b91c1c"
              : "color-mix(in srgb, var(--color-muted) 30%, transparent)",
            color: "var(--color-text)",
          }}
        />
        {urlError && (
          <p className="mt-1.5 text-[11px] leading-snug" style={{ color: "#f87171" }}>
            {urlError}
          </p>
        )}
      </div>
    </div>
  );
}

export default function VideoAdmin() {
  const { items, records, activeId, saveVideo, removeVideo, setActiveVideo } = useVideo();
  const { addToast } = useToast();

  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState<FileFieldState>(emptyField());
  const [posterField, setPosterField] = useState<FileFieldState>(emptyField());
  const [posterCrop, setPosterCrop] = useState<CropState | null>(null);
  const [subs, setSubs] = useState<Record<VideoLang, FileFieldState>>({
    en: emptyField(),
    es: emptyField(),
  });
  const [audio, setAudio] = useState<Record<VideoLang, FileFieldState>>({
    en: emptyField(),
    es: emptyField(),
  });
  const [thumbCrops, setThumbCrops] = useState<CropState[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDelete, setShowDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [posterCropSrc, setPosterCropSrc] = useState<string | null>(null);
  const [thumbCropQueue, setThumbCropQueue] = useState<string[]>([]);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const editingItem = items.find((i) => i.id === editingId) ?? null;

  const resetForm = () => {
    setTitle("");
    setVideoFile(emptyField());
    setPosterField(emptyField());
    setPosterCrop(null);
    setSubs({ en: emptyField(), es: emptyField() });
    setAudio({ en: emptyField(), es: emptyField() });
    setThumbCrops([]);
    setEditingId(null);
  };

  const startEdit = (record: StoredVideoRecord) => {
    setEditingId(record.id);
    setTitle(record.title);
    setVideoFile(fieldFromRecord(record.video));
    setPosterField(fieldFromRecord(record.poster));
    setPosterCrop(null);
    setSubs({
      en: fieldFromRecord(record.subtitles.en),
      es: fieldFromRecord(record.subtitles.es),
    });
    setAudio({
      en: fieldFromRecord(record.audio.en),
      es: fieldFromRecord(record.audio.es),
    });
    setThumbCrops([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePosterFile = (file: File | null) => {
    if (!file) {
      setPosterField((f) => ({ ...f, file: null, fileName: null }));
      setPosterCrop(null);
      return;
    }
    setPosterField((f) => ({ ...f, file, fileName: file.name }));
    setPosterCropSrc(URL.createObjectURL(file));
  };

  const handleThumbsFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setThumbCropQueue((q) => [...q, ...urls]);
    if (thumbInputRef.current) thumbInputRef.current.value = "";
  };

  const buildSource = (
    field: FileFieldState,
    name?: string
  ): StoredSource | undefined => {
    if (field.file) return { kind: "file", blob: field.file, name: field.file.name };
    if (field.url.trim()) return { kind: "url", value: field.url.trim() };
    if (name) return undefined;
    return undefined;
  };

  const validate = (): string | null => {
    if (!title.trim()) return "Please enter a title";
    if (!videoFile.file && !videoFile.url.trim() && !editingId) {
      return "Please upload a video file or paste a URL";
    }
    const checks: [string, FileFieldState, MediaKind][] = [
      ["Video", videoFile, "video"],
      ["Poster", posterField, "image"],
      ["Subtitles EN", subs.en, "subtitle"],
      ["Subtitles ES", subs.es, "subtitle"],
      ["Audio EN", audio.en, "audio"],
      ["Audio ES", audio.es, "audio"],
    ];
    for (const [label, field, kind] of checks) {
      const err = validateMediaUrl(field.url, kind);
      if (err) return `${label}: ${err}`;
    }
    for (const lang of ["en", "es"] as VideoLang[]) {
      const hasSub = subs[lang].file || subs[lang].url.trim() || editingItem?.subtitles.some((t) => t.lang === lang);
      if (!hasSub) return `Subtitles for ${lang.toUpperCase()} are required`;
      const hasAudio = audio[lang].file || audio[lang].url.trim() || editingItem?.audioTracks.some((t) => t.lang === lang);
      if (!hasAudio) return `Audio track for ${lang.toUpperCase()} is required`;
    }
    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) {
      addToast(error, "error");
      return;
    }
    setSaving(true);
    try {
      const payload: VideoSavePayload = {
        title: title.trim(),
        video: buildSource(videoFile),
        poster: posterCrop
          ? {
              kind: "file",
              blob: posterCrop.blob,
              name: "poster.jpg",
              width: posterCrop.width,
              height: posterCrop.height,
            }
          : posterField.url.trim()
          ? { kind: "url", value: posterField.url.trim() }
          : editingId
          ? undefined
          : null,
        subtitles: {
          en: buildSource(subs.en),
          es: buildSource(subs.es),
        },
        audio: {
          en: buildSource(audio.en),
          es: buildSource(audio.es),
        },
        manualThumbs:
          thumbCrops.length > 0
            ? thumbCrops.map((crop, i) => ({
                kind: "file" as const,
                blob: crop.blob,
                name: `thumb-${i + 1}.jpg`,
                width: crop.width,
                height: crop.height,
              }))
            : undefined,
      };
      await saveVideo(payload, editingId ?? undefined);
      addToast(editingId ? "Video updated" : "Video saved", "success");
      resetForm();
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to save video", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await removeVideo(id);
      if (editingId === id) resetForm();
      setShowDelete(null);
      addToast(`"${name}" deleted`, "info");
    } catch {
      addToast("Failed to delete video", "error");
    }
  };

  const inputStyle = {
    backgroundColor: "color-mix(in srgb, var(--color-bg) 60%, var(--color-text))",
    color: "var(--color-text)",
    border: "1px solid color-mix(in srgb, var(--color-muted) 30%, transparent)",
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-muted)]/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
                  {editingId ? "Edit video" : "Upload video"}
                </h2>
                <p className="text-xs tracking-[0.15em] uppercase mt-0.5" style={{ color: "var(--color-muted)" }}>
                  Video details
                </p>
              </div>
              {editingId && (
                <button
                  onClick={resetForm}
                  className="text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all hover:opacity-80"
                  style={{ borderColor: "var(--color-muted)", color: "var(--color-muted)" }}
                >
                  Cancel edit
                </button>
              )}
            </div>

            <label className="block text-xs tracking-[0.12em] uppercase mb-2" style={{ color: "var(--color-muted)" }}>
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. The Light of Dawn"
              className="w-full px-4 py-3 text-sm bg-transparent outline-none border transition-colors focus:border-[var(--color-accent)]"
              style={{ ...inputStyle, fontFamily: "var(--font-title)" }}
            />
          </div>

          {/* Video */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-muted)]/20 p-6">
            <p className="text-xs tracking-[0.2em] uppercase mb-4 font-semibold" style={{ color: "var(--color-accent)" }}>
              Video
            </p>
            <FileUrlRow
              label="Video file"
              hint=".mp4, .webm or similar"
              accept="video/*"
              field={videoFile}
              urlKind="video"
              onFile={(file) =>
                setVideoFile((f) => ({ ...f, file, fileName: file ? file.name : null }))
              }
              onUrl={(url) => setVideoFile((f) => ({ ...f, url }))}
            />
          </div>

          {/* Poster */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-muted)]/20 p-6">
            <p className="text-xs tracking-[0.2em] uppercase mb-4 font-semibold" style={{ color: "var(--color-accent)" }}>
              Poster image
            </p>
            <FileUrlRow
              label="Thumbnail"
              hint="Shown before playback — upload to crop it freely"
              accept="image/*"
              field={posterField}
              urlKind="image"
              onFile={handlePosterFile}
              onUrl={(url) => setPosterField((f) => ({ ...f, url }))}
            />
            <div className="mt-4">
              <p className="text-[11px] tracking-[0.12em] uppercase mb-2" style={{ color: "var(--color-muted)" }}>
                Preview
              </p>
              <div
                className="w-full max-w-xs border overflow-hidden flex items-center justify-center"
                style={{
                  borderColor: "color-mix(in srgb, var(--color-muted) 25%, transparent)",
                  backgroundColor: "color-mix(in srgb, var(--color-bg) 40%, var(--color-text))",
                  aspectRatio: "16 / 9",
                }}
              >
                {posterCrop ? (
                  <img src={posterCrop.previewUrl} alt="Cropped poster" className="w-full h-full object-cover" />
                ) : posterField.url.trim() ? (
                  <img src={posterField.url.trim()} alt="Poster" className="w-full h-full object-cover" />
                ) : editingItem?.poster ? (
                  <img src={editingItem.poster.src} alt="Current poster" className="w-full h-full object-cover" />
                ) : (
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                    No poster
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Subtitles */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-muted)]/20 p-6">
            <p className="text-xs tracking-[0.2em] uppercase mb-1 font-semibold" style={{ color: "var(--color-accent)" }}>
              Subtitles
            </p>
            <p className="text-[11px] mb-4" style={{ color: "var(--color-muted)" }}>
              Minimum 2 languages (English and Spanish) — .vtt files
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUrlRow
                label="English"
                hint="Subtitles EN (.vtt)"
                accept=".vtt,text/vtt"
                field={subs.en}
                urlKind="subtitle"
                onFile={(file) =>
                  setSubs((s) => ({ ...s, en: { ...s.en, file, fileName: file ? file.name : null } }))
                }
                onUrl={(url) => setSubs((s) => ({ ...s, en: { ...s.en, url } }))}
              />
              <FileUrlRow
                label="Español"
                hint="Subtitles ES (.vtt)"
                accept=".vtt,text/vtt"
                field={subs.es}
                urlKind="subtitle"
                onFile={(file) =>
                  setSubs((s) => ({ ...s, es: { ...s.es, file, fileName: file ? file.name : null } }))
                }
                onUrl={(url) => setSubs((s) => ({ ...s, es: { ...s.es, url } }))}
              />
            </div>
          </div>

          {/* Audio */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-muted)]/20 p-6">
            <p className="text-xs tracking-[0.2em] uppercase mb-1 font-semibold" style={{ color: "var(--color-accent)" }}>
              Audio tracks
            </p>
            <p className="text-[11px] mb-4" style={{ color: "var(--color-muted)" }}>
              Minimum 2 tracks — switching keeps the video position
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUrlRow
                label="English"
                hint="Audio EN (.mp3, .wav or similar)"
                accept="audio/*"
                field={audio.en}
                urlKind="audio"
                onFile={(file) =>
                  setAudio((a) => ({ ...a, en: { ...a.en, file, fileName: file ? file.name : null } }))
                }
                onUrl={(url) => setAudio((a) => ({ ...a, en: { ...a.en, url } }))}
              />
              <FileUrlRow
                label="Español"
                hint="Audio ES (.mp3, .wav or similar)"
                accept="audio/*"
                field={audio.es}
                urlKind="audio"
                onFile={(file) =>
                  setAudio((a) => ({ ...a, es: { ...a.es, file, fileName: file ? file.name : null } }))
                }
                onUrl={(url) => setAudio((a) => ({ ...a, es: { ...a.es, url } }))}
              />
            </div>
          </div>

          {/* Playback thumbnails */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-muted)]/20 p-6">
            <p className="text-xs tracking-[0.2em] uppercase mb-1 font-semibold" style={{ color: "var(--color-accent)" }}>
              Playback thumbnails
            </p>
            <p className="text-[11px] mb-4" style={{ color: "var(--color-muted)" }}>
              Hover previews are extracted automatically from the video. Upload images here as a fallback — each one is cropped freely and spread across the timeline.
            </p>

            <input
              ref={thumbInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleThumbsFiles(e.target.files)}
            />
            <button
              onClick={() => thumbInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm border-2 border-dashed transition-all duration-200 hover:border-[var(--color-accent)] hover:bg-[color-mix(in_srgb,var(--color-accent)_5%,transparent)]"
              style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-accent)" }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Select images (multiple)</span>
            </button>

            {(thumbCrops.length > 0 || (editingItem && editingItem.manualThumbs.length > 0)) && (
              <div className="mt-4 flex flex-wrap gap-3">
                {editingItem?.manualThumbs.map((thumb, i) => (
                  <div key={`existing-${i}`} className="relative">
                    <img
                      src={thumb.src}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-28 border"
                      style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
                    />
                    <span
                      className="absolute bottom-0.5 right-1 text-[9px] px-1"
                      style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#fff" }}
                    >
                      saved
                    </span>
                  </div>
                ))}
                {thumbCrops.map((crop, i) => (
                  <div key={`crop-${i}`} className="relative group/thumb">
                    <img
                      src={crop.previewUrl}
                      alt={`New thumbnail ${i + 1}`}
                      className="w-28 border"
                      style={{ aspectRatio: "16 / 9", objectFit: "cover", borderColor: "var(--color-accent)" }}
                    />
                    <button
                      onClick={() => {
                        URL.revokeObjectURL(crop.previewUrl);
                        setThumbCrops((c) => c.filter((_, idx) => idx !== i));
                      }}
                      className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-white opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                      style={{ backgroundColor: "#b91c1c" }}
                      aria-label="Remove thumbnail"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <line x1="6" y1="6" x2="18" y2="18" />
                        <line x1="6" y1="18" x2="18" y2="6" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary disabled:opacity-40"
            >
              {saving ? "Saving…" : editingId ? "Save changes" : "Save video"}
            </button>
            {(title || posterCrop || thumbCrops.length > 0) && (
              <button
                onClick={resetForm}
                className="text-xs tracking-[0.15em] uppercase px-6 py-3.5 border transition-all hover:opacity-80"
                style={{ borderColor: "var(--color-muted)", color: "var(--color-muted)" }}
              >
                Discard
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="text-lg font-semibold mb-6" style={{ color: "var(--color-text)" }}>
              Your videos
            </h3>
            <div className="space-y-3">
              {items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 border transition-all"
                    style={{
                      borderColor: isActive ? "var(--color-accent)" : "color-mix(in srgb, var(--color-muted) 25%, transparent)",
                      backgroundColor: isActive ? "color-mix(in srgb, var(--color-accent) 6%, transparent)" : "transparent",
                    }}
                  >
                    <div
                      className="w-24 shrink-0 overflow-hidden"
                      style={{ aspectRatio: "16 / 9", backgroundColor: "var(--color-surface)" }}
                    >
                      {item.poster ? (
                        <img src={item.poster.src} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-muted)">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>
                          {item.title}
                        </p>
                        {isActive && (
                          <span className="text-[9px] tracking-wider uppercase px-1.5 py-0.5 shrink-0" style={{ backgroundColor: "var(--color-accent)", color: "var(--color-bg)" }}>
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                        {item.subtitles.length} subtitle{item.subtitles.length === 1 ? "" : "s"} · {item.audioTracks.length} audio track{item.audioTracks.length === 1 ? "" : "s"}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {!isActive && (
                          <button
                            onClick={() => {
                              setActiveVideo(item.id);
                              addToast(`"${item.title}" is now active`, "success");
                            }}
                            className="text-[10px] tracking-wider uppercase px-2 py-1 transition-all hover:opacity-70"
                            style={{ backgroundColor: "var(--color-text)", color: "var(--color-bg)" }}
                          >
                            Set active
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const record = records.find((r) => r.id === item.id);
                            if (record) startEdit(record);
                          }}
                          className="text-[10px] tracking-wider uppercase px-2 py-1 border transition-all hover:opacity-80"
                          style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
                        >
                          Edit
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setShowDelete(showDelete === item.id ? null : item.id)}
                            className="text-[10px] tracking-wider uppercase px-2 py-1 transition-all hover:opacity-70"
                            style={{ color: "var(--color-muted)" }}
                            aria-label="Delete video"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                          {showDelete === item.id && (
                            <div
                              className="absolute right-0 top-full mt-1 p-3 border shadow-lg z-10 animate-slide-up"
                              style={{ borderColor: "var(--color-muted)", backgroundColor: "var(--color-bg)" }}
                            >
                              <p className="text-[11px] mb-2 whitespace-nowrap" style={{ color: "var(--color-text)" }}>
                                Delete &quot;{item.title}&quot;?
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleDelete(item.id, item.title)}
                                  className="text-[10px] px-2 py-1 bg-red-600 text-white hover:bg-red-700 transition-colors"
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
                      </div>
                    </div>
                  </div>
                );
              })}
              {items.length === 0 && (
                <p className="text-sm py-8 text-center" style={{ color: "var(--color-muted)" }}>
                  No videos yet. Upload your first film above.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Poster cropper */}
      {posterCropSrc && (
        <ImageCropperModal
          src={posterCropSrc}
          open
          title="Crop poster image"
          onCancel={() => {
            URL.revokeObjectURL(posterCropSrc);
            setPosterCropSrc(null);
            setPosterField((f) => ({ ...f, file: null, fileName: null }));
          }}
          onConfirm={(blob, width, height) => {
            URL.revokeObjectURL(posterCropSrc);
            setPosterCrop({
              blob,
              width,
              height,
              previewUrl: URL.createObjectURL(blob),
            });
            setPosterCropSrc(null);
          }}
        />
      )}

      {/* Thumbnail cropper queue */}
      {thumbCropQueue.length > 0 && (
        <ImageCropperModal
          src={thumbCropQueue[0]}
          open
          title={`Crop thumbnail ${thumbCrops.length + 1}`}
          onCancel={() => {
            URL.revokeObjectURL(thumbCropQueue[0]);
            setThumbCropQueue((q) => q.slice(1));
          }}
          onConfirm={(blob, width, height) => {
            URL.revokeObjectURL(thumbCropQueue[0]);
            setThumbCrops((c) => [
              ...c,
              { blob, width, height, previewUrl: URL.createObjectURL(blob) },
            ]);
            setThumbCropQueue((q) => q.slice(1));
          }}
        />
      )}
    </>
  );
}
