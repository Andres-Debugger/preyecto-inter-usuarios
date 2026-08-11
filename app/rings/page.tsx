import CategoryPage from "@/components/CategoryPage";

const products = [
  { id: 1, name: "Eternal Band Ring", description: "14k yellow gold", price: "$320", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80" },
  { id: 2, name: "Hexa Gold Ring", description: "18k yellow gold", price: "$450", image: "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=500&q=80" },
  { id: 3, name: "Ornate Twist Ring", description: "14k yellow gold", price: "$520", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80" },
  { id: 4, name: "Celestial Spark Ring", description: "14k yellow gold with cubic zirconia", price: "$380", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500&q=80" },
  { id: 5, name: "Golden Crescent Ring", description: "14k yellow gold", price: "$290", image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=500&q=80" },
  { id: 6, name: "Spiral Grace Ring", description: "18k yellow gold", price: "$560", image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&q=80" },
  { id: 7, name: "Aureate Band Ring", description: "14k yellow gold", price: "$340", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&q=80" },
  { id: 8, name: "Petal Stack Ring", description: "14k yellow gold", price: "$270", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80" },
];

export default function RingsPage() {
  return (
    <CategoryPage
      title="Rings"
      subtitle="Our Collections"
      heroImage="https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=85"
      products={products}
    />
  );
}
