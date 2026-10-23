"use client";

import FadeIn from "@/components/FadeIn";
import type { Product } from "@/data/products";
import { products } from "@/data/products";

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <FadeIn delay={index * 80}>
      <div className="product-card group">
        <div className="product-card-image aspect-square relative overflow-hidden" style={{ backgroundColor: "var(--color-surface)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="pt-4 pb-2">
          <h3 className="product-name mb-1">{product.name}</h3>
          <p className="mb-1.5" style={{ fontSize: "var(--size-paragraph)", fontFamily: "var(--font-body)", color: "var(--color-muted)" }}>{product.description}</p>
          <p className="font-medium" style={{ fontSize: "var(--size-paragraph)", fontFamily: "var(--font-body)", color: "var(--color-text)" }}>{product.price}</p>
        </div>
      </div>
    </FadeIn>
  );
}

export default function FeaturedProducts() {
  return (
    <section id="products" className="py-20 md:py-32" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <FadeIn>
          <h2 className="section-title-editorial mb-12 md:mb-20">
            OUR MOST<br />LOVED<br />CREATIONS
          </h2>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
