"use client";

import FadeIn from "@/components/FadeIn";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "var(--color-surface)" }}>
      {/* Background */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1657183421958-bd3b992cd15a?q=80&w=1200&auto=format&fit=crop"
          alt="Mano con anillos de oro"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface)]/60 via-transparent to-[var(--color-surface)]/30" />
      </div>

      {/* Large BRILLO & CO text */}
      <div className="relative z-10 pt-20 md:pt-24 px-4 md:px-8">
        <FadeIn>
          <h1
            className="leading-[0.85] tracking-[0.02em] text-white/90 text-center select-none drop-shadow-[0_2px_20px_rgba(0,0,0,0.15)]"
            style={{ fontFamily: "var(--font-title)", fontSize: "clamp(4rem, 14vw, 12rem)" }}
          >
            B<span className="relative inline-block">R<span className="absolute -top-[8%] left-1/2 -translate-x-1/2 text-[12%] drop-shadow-none">✦</span></span>ILLO &amp; C<span className="relative inline-block">O<span className="absolute -top-[8%] left-1/2 -translate-x-1/2 text-[12%] drop-shadow-none">✦</span></span>
          </h1>
        </FadeIn>
      </div>

      {/* Middle content */}
      <div className="relative z-10 flex-1 flex items-end pb-0">
        <div className="w-full max-w-7xl mx-auto px-8 md:px-16 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
            {/* Left: Collection text */}
            <FadeIn delay={200} className="max-w-md">
              <p className="tracking-[0.25em] uppercase mb-3 font-medium" style={{ fontSize: "var(--size-paragraph)", fontFamily: "var(--font-body)", color: "var(--color-text)" }}>
                Collection
              </p>
              <h2
                className="leading-[0.85] tracking-tight mb-6"
                style={{ fontFamily: "var(--font-title)", fontSize: "clamp(3rem, 6vw, 5.5rem)", color: "var(--color-text)" }}
              >
                2025
              </h2>
              <p className="max-w-sm leading-relaxed mb-8 text-balance" style={{ fontSize: "var(--size-paragraph)", fontFamily: "var(--font-body)", color: "var(--color-text)" }}>
                Descubre joyas exquisitas inspiradas en la belleza de los cielos.
                Cada pieza esta creada para aportar elegancia y gracia
                a tus momentos mas preciados.
              </p>
              <a href="#discover" className="btn-primary">
                DESCUBRIR
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </FadeIn>

            {/* Right: Tagline + category links */}
            <FadeIn delay={400} className="text-right hidden md:block">
              <p
                className="leading-snug tracking-wide mb-8"
                style={{ fontFamily: "var(--font-title)", fontSize: "clamp(1rem, 2vw, 1.6rem)", color: "var(--color-text)" }}
              >
                UN TOQUE DE ELEGANCIA<br />PARA MOMENTOS ATemporales
              </p>
              <nav className="flex flex-col gap-4 items-end">
                {["Rings", "Earrings", "Necklaces", "Bracelets"].map((category, i) => (
                  <a
                    key={category}
                    href={`/${category.toLowerCase()}`}
                    className="category-link hover:opacity-60 transition-opacity duration-300"
                    style={{ color: "var(--color-text)", transitionDelay: `${i * 50}ms` }}
                  >
                    {category}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                ))}
              </nav>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
