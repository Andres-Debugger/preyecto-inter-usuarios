export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

export const products: Product[] = [
  { id: 1, name: "Eternal Band Ring", description: "14k yellow gold", price: "$320", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&q=80" },
  { id: 2, name: "Spire Chain Necklace", description: "14k yellow gold", price: "$280", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80" },
  { id: 3, name: "Celestial Spark Pendant", description: "14k yellow gold with cubic zirconia", price: "$250", image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=500&q=80" },
  { id: 4, name: "Pearl Halo Pendant", description: "14k yellow gold", price: "$480", image: "https://images.unsplash.com/photo-1762505464446-c0760d740aee?w=500&q=80" },
  { id: 5, name: "Hexa Gold Ring", description: "18k yellow gold", price: "$450", image: "https://images.unsplash.com/photo-1603561596112-0a132b757442?w=500&q=80" },
  { id: 6, name: "Solar Radiance Earrings", description: "14k yellow gold", price: "$680", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&q=80" },
  { id: 7, name: "Golden Raindrop Necklace", description: "14k yellow gold", price: "$920", image: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=500&q=80" },
  { id: 8, name: "Ornate Twist Ring", description: "14k yellow gold", price: "$520", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80" },
];