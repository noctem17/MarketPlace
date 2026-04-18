export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  emoji: string;
  tag: string;
  tagColor: string;
  imageUrl: string;
  description: string;
  colors?: string[];
}

export interface Store {
  id: number;
  name: string;
  ownerName: string;
  whatsapp: string;
  phone: string;
  address: string;
  schedule: string;
  category: string;
  bio: string;
  avatarUrl: string;
  color: string;
  accent: string;
  position: [number, number, number];
  products: Product[];
  rating: number;
  reviews: number;
}