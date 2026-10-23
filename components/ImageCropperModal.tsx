/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import type Cropper from "cropperjs";

interface ImageCropperModalProps {
  src: string;
  open: boolean;
  title?: string;
  hint?: string;
  aspectRatio?: number;
  lockAspect?: boolean;
  outputWidth?: number;
  outputHeight?: number;
  onCancel: () => void;
  onConfirm: (blob: Blob, width: number, height: number) => void;
  exportMaxWidth?: number;
}

export default function ImageCropperModal({
  src,
  open,
  title = "Crop image",
  hint = "Free selection — drag the area, resize it with the corners, zoom to taste.",
  aspectRatio = NaN,
  lockAspect = false,
  outputWidth,
  outputHeight,
  onCancel,
  onConfirm,
  exportMaxWidth = 1600,
}: ImageCropperModalProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!open || !src) return;
    let cancelled = false;

    (async () => {
      const mod = await import("cropperjs");
      if (cancelled || !imgRef.current) return;
      const CropperCtor = mod.default;
      cropperRef.current = new CropperCtor(imgRef.current, {
        viewMode: 1,
        dragMode: "crop",
        autoCropArea: 0.8,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        background: false,
        aspectRatio: lockAspect && !Number.isNaN(aspectRatio) ? aspectRatio : NaN,
        toggleDragModeOnDblclick: false,
      });
    })().catch((error) => {
      console.error("Failed to init cropper:", error);
    });

    return () => {
      cancelled = true;
      cropperRef.current?.destroy();
      cropperRef.current = null;
      setZoom(1);
    };
  }, [open, src, aspectRatio, lockAspect]);

  const handleZoom = (value: number) => {
    setZoom(value);
    cropperRef.current?.zoomTo(value);
  };

  const handleConfirm = () => {
    const cropper = cropperRef.current;
    if (!cropper) return;
    const canvas = outputWidth && outputHeight
      ? cropper.getCroppedCanvas({
          width: outputWidth,
          height: outputHeight,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: "high",
        })
      : cropper.getCroppedCanvas({
          maxWidth: exportMaxWidth,
          maxHeight: exportMaxWidth,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: "high",
        });
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        onConfirm(blob, canvas.width, canvas.height);
      },
      "image/jpeg",
      0.9
    );
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="w-full max-w-3xl flex flex-col border"
        style={{
          backgroundColor: "var(--color-bg)",
          borderColor: "color-mix(in srgb, var(--color-muted) 30%, transparent)",
          maxHeight: "90vh",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "color-mix(in srgb, var(--color-muted) 25%, transparent)" }}>
          <div>
            <h3 className="text-sm font-semibold tracking-[0.15em] uppercase" style={{ color: "var(--color-text)" }}>
              {title}
            </h3>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--color-muted)" }}>
              {hint}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 transition-opacity hover:opacity-60"
            style={{ color: "var(--color-text)" }}
            aria-label="Close cropper"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-auto" style={{ minHeight: 0 }}>
          <div className="max-h-[50vh] flex items-center justify-center bg-black/80">
            <img
              ref={imgRef}
              src={src}
              alt="Crop preview"
              className="max-w-full max-h-[50vh]"
              style={{ display: "block" }}
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t space-y-3" style={{ borderColor: "color-mix(in srgb, var(--color-muted) 25%, transparent)" }}>
          <div className="flex flex-wrap items-center gap-3">
            {lockAspect ? (
              <span
                className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border"
                style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
              >
                {outputWidth && outputHeight
                  ? `${outputWidth}×${outputHeight}`
                  : "Locked ratio"}
              </span>
            ) : (
              <>
                <button
                  onClick={() => cropperRef.current?.setAspectRatio(NaN)}
                  className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-all hover:opacity-80"
                  style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
                >
                  Free
                </button>
                <button
                  onClick={() => cropperRef.current?.setAspectRatio(1)}
                  className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-all hover:opacity-80"
                  style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
                >
                  Square 1:1
                </button>
              </>
            )}
            <button
              onClick={() => cropperRef.current?.rotate(-90)}
              className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-all hover:opacity-80"
              style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
              aria-label="Rotate left"
            >
              Rotate ↺
            </button>
            <button
              onClick={() => cropperRef.current?.rotate(90)}
              className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-all hover:opacity-80"
              style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
              aria-label="Rotate right"
            >
              Rotate ↻
            </button>
            <button
              onClick={() => {
                cropperRef.current?.reset();
                setZoom(1);
              }}
              className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 border transition-all hover:opacity-80"
              style={{ borderColor: "var(--color-muted)", color: "var(--color-muted)" }}
            >
              Reset
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "var(--color-muted)" }}>
              Zoom
            </label>
            <input
              type="range"
              min={0.1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => handleZoom(Number(e.target.value))}
              className="flex-1"
              style={{ accentColor: "var(--color-accent)" }}
              aria-label="Zoom"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              onClick={onCancel}
              className="text-xs tracking-[0.15em] uppercase px-5 py-2.5 border transition-all hover:opacity-80"
              style={{ borderColor: "var(--color-muted)", color: "var(--color-muted)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="text-xs tracking-[0.15em] uppercase px-5 py-2.5 transition-all hover:opacity-85"
              style={{ backgroundColor: "var(--color-text)", color: "var(--color-bg)" }}
            >
              Use crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
