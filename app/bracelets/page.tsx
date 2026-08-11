import CategoryPage from "@/components/CategoryPage";

const products = [
  { id: 1, name: "Golden Cuff Bracelet", description: "14k yellow gold", price: "$580", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&q=80" },
  { id: 2, name: "Twisted Bangle", description: "14k yellow gold", price: "$420", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500&q=80" },
  { id: 3, name: "Chain Link Bracelet", description: "18k yellow gold", price: "$640", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80" },
  { id: 4, name: "Pearl Bracelet", description: "14k yellow gold with pearl", price: "$520", image: "https://images.unsplash.com/photo-1645035959536-1516ba7d43c8?w=500&q=80" },
  { id: 5, name: "Hammered Bangle", description: "14k yellow gold", price: "$380", image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500&q=80" },
  { id: 6, name: "Woven Bracelet", description: "14k yellow gold", price: "$460", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80" },
  { id: 7, name: "Rope Chain Bracelet", description: "18k yellow gold", price: "$720", image: "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=500&q=80" },
  { id: 8, name: "Infinity Bangle", description: "14k yellow gold", price: "$350", image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=500&q=80" },
];

export default function BraceletsPage() {
  return (
    <CategoryPage
      title="Bracelets"
      subtitle="Our Collections"
      heroImage="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1600&q=85"
      products={products}
    />
  );
}
