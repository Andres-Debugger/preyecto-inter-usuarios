/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";
import Link from "next/link";
import { useVideo } from "@/context/VideoContext";
import VideoPlayer from "@/components/VideoPlayer";
import FadeIn from "@/components/FadeIn";

export default function VideoShowcase() {
  const { items, loading, activeItem, setActiveVideo } = useVideo();
  const stripRef = useRef<HTMLDivElement>(null);

  const scrollStrip = (direction: 1 | -1) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (el.clientWidth * 0.6), behavior: "smooth" });
  };

  if (loading) {
    return (
      <section className="py-20 md:py-32" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div
            className="w-full animate-pulse"
            style={{ aspectRatio: "16 / 9", backgroundColor: "var(--color-surface)" }}
          />
        </div>
      </section>
    );
  }

  if (!activeItem) {
    return (
      <section className="py-20 md:py-32" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <FadeIn>
            <h2 className="section-title-editorial mb-8">THE FILM</h2>
            <div
              className="border-2 border-dashed p-12 md:p-20 text-center"
              style={{ borderColor: "color-mix(in srgb, var(--color-muted) 40%, transparent)" }}
            >
              <p className="text-sm tracking-[0.2em] uppercase mb-4" style={{ color: "var(--color-muted)" }}>
                No films uploaded yet
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

  return (
    <section id="films" className="py-20 md:py-32" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <FadeIn>
          <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="tracking-[0.25em] uppercase mb-3 font-medium" style={{ fontSize: "var(--size-paragraph)", fontFamily: "var(--font-body)", color: "var(--color-muted)" }}>
                Our Story in Motion
              </p>
              <h2 className="section-title-editorial">THE FILM</h2>
            </div>
            {items.length > 1 && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => scrollStrip(-1)}
                  className="w-11 h-11 flex items-center justify-center border transition-all duration-300 hover:opacity-70"
                  style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
                  aria-label="Previous video"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  onClick={() => scrollStrip(1)}
                  className="w-11 h-11 flex items-center justify-center border transition-all duration-300 hover:opacity-70"
                  style={{ borderColor: "var(--color-muted)", color: "var(--color-text)" }}
                  aria-label="Next video"
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
          <VideoPlayer key={activeItem.id} video={activeItem} />
        </FadeIn>

        {items.length > 1 && (
          <FadeIn delay={200}>
            <div className="mt-8">
              <div
                ref={stripRef}
                className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
                style={{ scrollbarWidth: "thin" }}
              >
                {items.map((item) => {
                  const isActive = item.id === activeItem.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveVideo(item.id)}
                      className="group/shutter shrink-0 text-left transition-opacity duration-300 hover:opacity-90"
                      style={{ width: "13rem" }}
                      aria-label={`Play ${item.title}`}
                      aria-current={isActive}
                    >
                      <div
                        className="relative overflow-hidden border-2 transition-colors duration-300"
                        style={{
                          borderColor: isActive ? "var(--color-accent)" : "transparent",
                          backgroundColor: "var(--color-surface)",
                          aspectRatio: "16 / 9",
                        }}
                      >
                        {item.poster ? (
                          <img
                            src={item.poster.src}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--color-muted)">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        )}
                        <div
                          className="absolute inset-0 transition-colors duration-300"
                          style={{
                            backgroundColor: isActive
                              ? "transparent"
                              : "rgba(0, 0, 0, 0.25)",
                          }}
                        />
                      </div>
                      <p
                        className="mt-2.5 text-xs tracking-[0.12em] uppercase truncate transition-colors duration-300"
                        style={{
                          color: isActive ? "var(--color-accent)" : "var(--color-text)",
                          fontFamily: "var(--font-title)",
                        }}
                      >
                        {item.title}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
