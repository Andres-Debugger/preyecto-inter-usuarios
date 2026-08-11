"use client";

import { useEffect, useRef, useState } from "react";

function FadeIn({ children, className = "", delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

const products: Product[] = [
  { id: 1, name: "Eternal Band Ring", description: "14k yellow gold", price: "$320", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80" },
  { id: 2, name: "Spire Chain Necklace", description: "14k yellow gold", price: "$280", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80" },
  { id: 3, name: "Celestial Spark Pendant", description: "14k yellow gold with cubic zirconia", price: "$250", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500&q=80" },
  { id: 4, name: "Pearl Halo Pendant", description: "14k yellow gold", price: "$480", image: "https://images.unsplash.com/photo-1762505464446-c0760d740aee?w=500&q=80" },
  { id: 5, name: "Hexa Gold Ring", description: "18k yellow gold", price: "$450", image: "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=500&q=80" },
  { id: 6, name: "Solar Radiance Earrings", description: "14k yellow gold", price: "$680", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80" },
  { id: 7, name: "Golden Raindrop Necklace", description: "14k yellow gold", price: "$920", image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500&q=80" },
  { id: 8, name: "Ornate Twist Ring", description: "14k yellow gold", price: "$520", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80" },
];

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
          <p className="text-[11px] mb-1.5 font-sans" style={{ color: "var(--color-muted)" }}>{product.description}</p>
          <p className="text-[13px] font-medium font-sans" style={{ color: "var(--color-text)" }}>{product.price}</p>
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
