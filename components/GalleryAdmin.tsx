/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import { useGallery } from "@/context/GalleryContext";
import { useToast } from "@/components/Toast";
import ImageCropperModal from "@/components/ImageCropperModal";
import type { StoredImage } from "@/types/video";
import {
  GALLERY_IMAGE_WIDTH,
  GALLERY_IMAGE_HEIGHT,
} from "@/utils/galleryStorage";

const GALLERY_ASPECT = GALLERY_IMAGE_WIDTH / GALLERY_IMAGE_HEIGHT;

interface CropState {
  blob: Blob;
  width: number;
  height: number;
  previewUrl: string;
}

export default function GalleryAdmin() {
  const { photos, loading, savePhoto, removePhoto, reorderPhotos } =
    useGallery();
  const { addToast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropState | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState<string | null>(null);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const editingPhoto = editingId
    ? photos.find((p) => p.id === editingId) ?? null
    : null;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingId(null);
    setFile(null);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
    if (crop) URL.revokeObjectURL(crop.previewUrl);
    setCrop(null);
    setCropperOpen(false);
  };

  const handleEdit = (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (!photo) return;
    setEditingId(id);
    setTitle(photo.title);
    setDescription(photo.description);
    setFile(null);
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
    if (crop) URL.revokeObjectURL(crop.previewUrl);
    setCrop(null);
    setCropperOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileSelect = (selected: File | null) => {
    if (!selected) {
      setFile(null);
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
      return;
    }
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setFilePreviewUrl(url);
    setCropperOpen(true);
  };

  const handleCropConfirm = (blob: Blob, width: number, height: number) => {
    if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    setFilePreviewUrl(null);
    if (crop) URL.revokeObjectURL(crop.previewUrl);
    setCrop({ blob, width, height, previewUrl: URL.createObjectURL(blob) });
    setCropperOpen(false);
  };

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed) {
      addToast("A title is required", "error");
      return;
    }
    if (!crop && !editingId) {
      addToast("An image is required", "error");
      return;
    }
    if (!crop && editingId && !editingPhoto) {
      addToast("Photo not found", "error");
      return;
    }
    try {
      setSaving(true);
      const image: StoredImage | undefined = crop
        ? {
            kind: "file",
            blob: crop.blob,
            name: file?.name ?? "photo.jpg",
            width: crop.width,
            height: crop.height,
          }
        : undefined;
      await savePhoto(
        { title: trimmed, description: description.trim(), image },
        editingId ?? undefined
      );
      addToast(editingId ? "Photo updated" : "Photo saved", "success");
      resetForm();
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to save photo", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await removePhoto(id);
      if (editingId === id) resetForm();
      setShowDelete(null);
      addToast(`"${name}" deleted`, "info");
    } catch {
      addToast("Failed to delete photo", "error");
    }
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = async (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      return;
    }
    const ordered = photos.map((p) => p.id);
    const [moved] = ordered.splice(dragIndex, 1);
    ordered.splice(index, 0, moved);
    setDragIndex(null);
    try {
      await reorderPhotos(ordered);
      addToast("Order saved", "success");
    } catch {
      addToast("Failed to reorder photos", "error");
    }
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const inputStyle = {
    backgroundColor: "color-mix(in srgb, var(--color-bg) 60%, var(--color-text))",
    color: "var(--color-text)",
    border: "1px solid color-mix(in srgb, var(--color-muted) 30%, transparent)",
  };

  const previewSrc =
    crop?.previewUrl ??
    (editingPhoto ? editingPhoto.image.src : null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Header card */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-muted)]/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
                {editingId ? "Edit photo" : "Upload photo"}
              </h2>
              <p className="text-xs tracking-[0.15em] uppercase mt-0.5" style={{ color: "var(--color-muted)" }}>
                Photo details
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
            placeholder="e.g. Eternal Band Ring"
            className="w-full px-4 py-3 text-sm bg-transparent outline-none border transition-colors focus:border-[var(--color-accent)]"
            style={{ ...inputStyle, fontFamily: "var(--font-title)" }}
          />

          <label className="block text-xs tracking-[0.12em] uppercase mt-5 mb-2" style={{ color: "var(--color-muted)" }}>
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. 14k yellow gold with a hand-set diamond"
            rows={3}
            className="w-full px-4 py-3 text-sm bg-transparent outline-none border transition-colors focus:border-[var(--color-accent)] resize-y"
            style={{ ...inputStyle, fontFamily: "var(--font-body)" }}
          />
        </div>

        {/* Image */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-muted)]/20 p-6">
          <p className="text-xs tracking-[0.2em] uppercase mb-4 font-semibold" style={{ color: "var(--color-accent)" }}>
            Photo
          </p>
          <p className="text-[11px] mb-3" style={{ color: "var(--color-muted)" }}>
            Upload an image file — it will be cropped to 4:5 (1200×1500)
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs tracking-[0.15em] uppercase px-5 py-2.5 border transition-all hover:opacity-80"
              style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
            >
              Choose image
            </button>
            {(crop || (editingId && editingPhoto)) && (
              <button
                onClick={() => {
                  if (crop) URL.revokeObjectURL(crop.previewUrl);
                  setCrop(null);
                  setFile(null);
                }}
                className="text-[10px] tracking-wider uppercase transition-opacity hover:opacity-60"
                style={{ color: "var(--color-muted)" }}
              >
                Clear image
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              tabIndex={-1}
              aria-hidden="true"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                e.target.value = "";
                if (!f) return;
                handleFileSelect(f);
              }}
            />
          </div>

          <div className="mt-5">
            <p className="text-[11px] tracking-[0.12em] uppercase mb-2" style={{ color: "var(--color-muted)" }}>
              Preview
            </p>
            <div
              className="w-full max-w-xs border overflow-hidden flex items-center justify-center"
              style={{
                borderColor: "color-mix(in srgb, var(--color-muted) 25%, transparent)",
                backgroundColor: "color-mix(in srgb, var(--color-bg) 40%, var(--color-text))",
                aspectRatio: "4 / 5",
              }}
            >
              {previewSrc ? (
                <img src={previewSrc} alt="Photo preview" className="w-full h-full object-cover" />
              ) : (
                <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                  No photo
                </p>
              )}
            </div>
            {crop && (
              <p className="text-[11px] mt-2" style={{ color: "var(--color-muted)" }}>
                Cropped to {crop.width}×{crop.height}px
              </p>
            )}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="btn-primary disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Save changes" : "Save photo"}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-muted)]/20 p-6">
        <p className="text-xs tracking-[0.2em] uppercase mb-1 font-semibold" style={{ color: "var(--color-accent)" }}>
          Photos
        </p>
        <p className="text-[11px] mb-4" style={{ color: "var(--color-muted)" }}>
          Drag to reorder the carousel
        </p>

        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-full animate-pulse"
                style={{ aspectRatio: "4 / 5", backgroundColor: "var(--color-bg)" }}
              />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div
            className="border-2 border-dashed p-8 text-center"
            style={{ borderColor: "color-mix(in srgb, var(--color-muted) 40%, transparent)" }}
          >
            <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--color-muted)" }}>
              No photos yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`p-3 border flex items-center gap-3 cursor-grab transition-colors ${
                  dragIndex === index ? "opacity-50" : ""
                } ${
                  dragOverIndex === index
                    ? "border-[var(--color-accent)]"
                    : ""
                }`}
                style={{
                  borderColor:
                    dragOverIndex === index
                      ? "var(--color-accent)"
                      : "color-mix(in srgb, var(--color-muted) 25%, transparent)",
                  backgroundColor: "color-mix(in srgb, var(--color-bg) 80%, transparent)",
                }}
              >
                <div className="shrink-0" aria-hidden="true">
                  <svg width="12" height="16" viewBox="0 0 12 16" fill="var(--color-muted)">
                    <circle cx="3" cy="3" r="1.4" />
                    <circle cx="9" cy="3" r="1.4" />
                    <circle cx="3" cy="8" r="1.4" />
                    <circle cx="9" cy="8" r="1.4" />
                    <circle cx="3" cy="13" r="1.4" />
                    <circle cx="9" cy="13" r="1.4" />
                  </svg>
                </div>
                <div
                  className="shrink-0 overflow-hidden border"
                  style={{
                    width: 44,
                    aspectRatio: "4 / 5",
                    borderColor: "color-mix(in srgb, var(--color-muted) 25%, transparent)",
                    backgroundColor: "var(--color-bg)",
                  }}
                >
                  <img src={photo.image.src} alt={photo.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs tracking-[0.08em] uppercase truncate"
                    style={{ color: "var(--color-text)", fontFamily: "var(--font-title)" }}
                  >
                    {photo.title}
                  </p>
                  {photo.description && (
                    <p className="text-[10px] mt-0.5 truncate" style={{ color: "var(--color-muted)" }}>
                      {photo.description}
                    </p>
                  )}
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--color-muted)" }}>
                    {photo.image.width && photo.image.height
                      ? `${photo.image.width}×${photo.image.height}`
                      : "4:5"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(photo.id)}
                    className="text-[10px] tracking-wider uppercase transition-opacity hover:opacity-60"
                    style={{ color: "var(--color-accent)" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDelete(photo.id)}
                    className="text-[10px] tracking-wider uppercase transition-opacity hover:opacity-60"
                    style={{ color: "var(--color-muted)" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete confirm */}
        {showDelete && (
          <div
            className="mt-4 p-4 border"
            style={{ borderColor: "color-mix(in srgb, var(--color-muted) 40%, transparent)" }}
          >
            <p className="text-xs mb-3" style={{ color: "var(--color-text)" }}>
              Delete this photo?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const photo = photos.find((p) => p.id === showDelete);
                  if (photo) handleDelete(photo.id, photo.title);
                }}
                className="text-[10px] tracking-[0.15em] uppercase px-4 py-2 transition-all hover:opacity-85"
                style={{ backgroundColor: "var(--color-text)", color: "var(--color-bg)" }}
              >
                Delete
              </button>
              <button
                onClick={() => setShowDelete(null)}
                className="text-[10px] tracking-[0.15em] uppercase px-4 py-2 border transition-all hover:opacity-80"
                style={{ borderColor: "var(--color-muted)", color: "var(--color-muted)" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cropper modal */}
      {filePreviewUrl && (
        <ImageCropperModal
          src={filePreviewUrl}
          open={cropperOpen}
          title="Crop photo"
          hint="Drag the area and resize it — the output is fixed at 4:5 (1200×1500)."
          aspectRatio={GALLERY_ASPECT}
          lockAspect
          outputWidth={GALLERY_IMAGE_WIDTH}
          outputHeight={GALLERY_IMAGE_HEIGHT}
          onCancel={() => {
            setCropperOpen(false);
            if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
            setFilePreviewUrl(null);
            setFile(null);
          }}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
}
