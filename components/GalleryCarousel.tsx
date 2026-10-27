/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useGallery } from "@/context/GalleryContext";
import FadeIn from "@/components/FadeIn";

const AUTOPLAY_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD_PX = 50;
const DESKTOP_PER_VIEW = 3;
const MOBILE_PER_VIEW = 1;

export default function GalleryCarousel() {
  const { photos, loading } = useGallery();

  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(DESKTOP_PER_VIEW);
  const [isVisible, setIsVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const dragPointerIdRef = useRef<number | null>(null);

  const maxIndex = Math.max(0, photos.length - perView);

  // Responsive perView
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setPerView(mq.matches ? DESKTOP_PER_VIEW : MOBILE_PER_VIEW);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Visibility
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loading, photos.length]);

  // Clamp index when perView changes
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, photos.length - perView)));
  }, [perView, photos.length]);

  const next = useCallback(() => {
    setIndex((i) => (i >= Math.max(0, photos.length - perView) ? 0 : i + 1));
  }, [photos.length, perView]);

  const prev = useCallback(() => {
    setIndex((i) => (i <= 0 ? Math.max(0, photos.length - perView) : i - 1));
  }, [photos.length, perView]);

  // Autoplay
  useEffect(() => {
    if (
      loading ||
      photos.length <= perView ||
      !isVisible ||
      dragging ||
      userPaused ||
      reduceMotion
    ) {
      return;
    }
    const interval = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setIndex((i) => (i >= Math.max(0, photos.length - perView) ? 0 : i + 1));
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [
    loading,
    photos.length,
    perView,
    isVisible,
    dragging,
    userPaused,
    reduceMotion,
    index,
  ]);

  // Pointer swipe
  const onPointerDown = (e: React.PointerEvent) => {
    if (photos.length <= perView) return;
    dragStartXRef.current = e.clientX;
    dragPointerIdRef.current = e.pointerId;
    setDragging(true);
    setDragOffset(0);
    viewportRef.current?.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || dragPointerIdRef.current !== e.pointerId) return;
    setDragOffset(e.clientX - dragStartXRef.current);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!dragging) return;
    const delta = e.clientX - dragStartXRef.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      if (delta < 0) next();
      else prev();
    }
    setDragging(false);
    setDragOffset(0);
    if (dragPointerIdRef.current !== null) {
      viewportRef.current?.releasePointerCapture?.(dragPointerIdRef.current);
    }
    dragPointerIdRef.current = null;
  };

  const onPointerCancel = (e: React.PointerEvent) => {
    if (dragPointerIdRef.current === e.pointerId) {
      setDragging(false);
      setDragOffset(0);
      dragPointerIdRef.current = null;
    }
  };

  if (loading) {
    return (
      <section className="py-20 md:py-32" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="mb-10 md:mb-14">
            <div className="w-32 h-4 animate-pulse mb-3" style={{ backgroundColor: "var(--color-surface)" }} />
            <div className="w-48 h-10 animate-pulse" style={{ backgroundColor: "var(--color-surface)" }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-full animate-pulse"
                style={{ aspectRatio: "4 / 5", backgroundColor: "var(--color-surface)" }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (photos.length === 0) {
    return (
      <section id="gallery" className="py-20 md:py-32" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <FadeIn>
            <h2 className="section-title-editorial mb-8">THE GALLERY</h2>
            <div
              className="border-2 border-dashed p-12 md:p-20 text-center"
              style={{ borderColor: "color-mix(in srgb, var(--color-muted) 40%, transparent)" }}
            >
              <p className="text-sm tracking-[0.2em] uppercase mb-4" style={{ color: "var(--color-muted)" }}>
                No photos uploaded yet
              </p>
              <Link href="/admin" className="btn-primary">
                Go to Admin
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    );
  }

  const showControls = photos.length > perView;

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="py-20 md:py-32 overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
      aria-roledescription="carousel"
      aria-label="Gallery"
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <FadeIn>
          <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="tracking-[0.25em] uppercase mb-3 font-medium" style={{ fontSize: "var(--size-paragraph)", fontFamily: "var(--font-body)", color: "var(--color-muted)" }}>
                The Collection
              </p>
              <h2 className="section-title-editorial">THE GALLERY</h2>
            </div>
            {showControls && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setUserPaused((p) => !p)}
                  className="w-11 h-11 flex items-center justify-center border transition-all duration-300 hover:opacity-70"
                  style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
                  aria-label={userPaused ? "Resume autoplay" : "Pause autoplay"}
                >
                  {userPaused || reduceMotion ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="6 4 20 12 6 20 6 4" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="5" y="4" width="4.5" height="16" />
                      <rect x="14.5" y="4" width="4.5" height="16" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={prev}
                  className="w-11 h-11 flex items-center justify-center border transition-all duration-300 hover:opacity-70"
                  style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
                  aria-label="Previous photo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="w-11 h-11 flex items-center justify-center border transition-all duration-300 hover:opacity-70"
                  style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
                  aria-label="Next photo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <div
            ref={viewportRef}
            className="overflow-hidden cursor-grab select-none"
            style={{
              touchAction: "pan-y",
              cursor: dragging ? "grabbing" : "grab",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={onPointerCancel}
          >
            <div
              className="flex"
              style={{
                transform: `translateX(calc(${-index * (100 / perView)}% + ${dragOffset}px))`,
                transition: dragging
                  ? "none"
                  : "transform 600ms cubic-bezier(0.25, 0.1, 0.25, 1)",
              }}
            >
              {photos.map((photo, i) => (
                <div
                  key={photo.id}
                  className="shrink-0 px-3"
                  style={{ flexBasis: `${100 / perView}%` }}
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${photos.length}`}
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: "4 / 5", backgroundColor: "var(--color-surface)" }}
                  >
                    <img
                      src={photo.image.src}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  </div>
                  <p
                    className="mt-3 text-xs tracking-[0.12em] uppercase truncate"
                    style={{ color: "var(--color-text)", fontFamily: "var(--font-title)" }}
                  >
                    {photo.title}
                  </p>
                  {photo.description && (
                    <p
                      className="mt-1 text-xs leading-relaxed line-clamp-2"
                      style={{ color: "var(--color-muted)", fontFamily: "var(--font-body)" }}
                    >
                      {photo.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {showControls && (
          <FadeIn delay={200}>
            <div className="mt-6 flex items-center justify-center gap-1.5" role="tablist" aria-label="Gallery pages">
              {Array.from({ length: maxIndex + 1 }, (_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={index === i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className="transition-all duration-300"
                  style={{
                    width: index === i ? 24 : 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor:
                      index === i ? "var(--color-text)" : "var(--color-muted)",
                  }}
                />
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
