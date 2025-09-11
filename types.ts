export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  rating: number;
  imageUrl: string;
  tag?: {
    text: string;
    bgColor: string;
  };
}