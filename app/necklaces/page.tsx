import CategoryPage from "@/components/CategoryPage";

const products = [
  { id: 1, name: "Spire Chain Necklace", description: "14k yellow gold", price: "$280", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80" },
  { id: 2, name: "Celestial Spark Pendant", description: "14k yellow gold with cubic zirconia", price: "$250", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500&q=80" },
  { id: 3, name: "Pearl Halo Pendant", description: "14k yellow gold", price: "$480", image: "https://images.unsplash.com/photo-1762505464446-c0760d740aee?w=500&q=80" },
  { id: 4, name: "Golden Raindrop Necklace", description: "14k yellow gold", price: "$920", image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500&q=80" },
  { id: 5, name: "Aureate Chain Necklace", description: "14k yellow gold", price: "$360", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80" },
  { id: 6, name: "Twilight Locket", description: "18k yellow gold", price: "$540", image: "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=500&q=80" },
  { id: 7, name: "Orbital Pendant", description: "14k yellow gold", price: "$310", image: "https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=500&q=80" },
  { id: 8, name: "Celestial Moon Necklace", description: "14k yellow gold with pearl", price: "$430", image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&q=80" },
];

export default function NecklacesPage() {
  return (
    <CategoryPage
      title="Necklaces"
      subtitle="Our Collections"
      heroImage="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=85"
      products={products}
    />
  );
}
