"use client";

import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

const categories = [
  {
    name: "Rings",
    href: "/rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    alt: "Gold rings on natural stone",
  },
  {
    name: "Earrings",
    href: "/earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    alt: "Gold earrings on natural stone",
  },
  {
    name: "Necklaces",
    href: "/necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    alt: "Gold necklace on natural stone",
  },
  {
    name: "Bracelets",
    href: "/bracelets",
    image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
    alt: "Gold bracelet on natural stone",
  },
];

export default function Categories() {
  return (
    <section id="categories" className="py-20 md:py-32" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <FadeIn>
          <h2 className="section-title-editorial mb-12 md:mb-20">
            OUR PRODUCTS
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {categories.map((category, i) => (
            <FadeIn key={category.name} delay={i * 100}>
              <Link
                href={category.href}
                className="group relative block aspect-[4/5] overflow-hidden"
                style={{ backgroundColor: "var(--color-surface)" }}
              >
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-500" />
                <div className="absolute top-5 left-5 flex items-center gap-3">
                  <span className="font-medium tracking-[0.2em] uppercase drop-shadow-sm" style={{ fontSize: "var(--size-paragraph)", color: "var(--color-text)" }}>
                    {category.name}
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-text)" }} className="transition-transform duration-300 group-hover:translate-x-1">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
