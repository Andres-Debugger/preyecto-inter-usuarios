import CategoryPage from "@/components/CategoryPage";

const products = [
  { id: 1, name: "Solar Radiance Earrings", description: "14k yellow gold", price: "$680", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80" },
  { id: 2, name: "Celestial Drop Earrings", description: "14k yellow gold", price: "$420", image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=500&q=80" },
  { id: 3, name: "Golden Hoop Earrings", description: "14k yellow gold", price: "$350", image: "https://images.unsplash.com/photo-1666060519824-796d5638d809?w=500&q=80" },
  { id: 4, name: "Twilight Stud Earrings", description: "14k yellow gold with diamond", price: "$520", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80" },
  { id: 5, name: "Orbital Drop Earrings", description: "18k yellow gold", price: "$740", image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500&q=80" },
  { id: 6, name: "Dawn Pearl Earrings", description: "14k yellow gold with pearl", price: "$480", image: "https://images.unsplash.com/photo-1758974504517-d2be41d62f63?w=500&q=80" },
  { id: 7, name: "Woven Gold Earrings", description: "14k yellow gold", price: "$390", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80" },
  { id: 8, name: "Lumina Chandelier", description: "14k yellow gold with zirconia", price: "$620", image: "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=500&q=80" },
];

export default function EarringsPage() {
  return (
    <CategoryPage
      title="Earrings"
      subtitle="Our Collections"
      heroImage="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1600&q=85"
      products={products}
    />
  );
}
