export {};

declare global {
  interface Product {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    discount: number;
    createdAt: string;
    updatedAt: string;
  }

  interface List<T> {
    data: Array<T>;
    nextCursor: string | null;
  }

  interface User {
    id: string;
    username: string;
    avatarUrl?: string;
  }

  interface CartItem {
    _id: string;
    product: Product;
    quantity: number;
  }

  interface CheckoutData {
    items: Array<CartItem & { amount: string }>;
    total: string;
  }

  interface Order {
    _id: string;
    items: Array<CartItem & { amount: string }>;
    total: number;
    address: string;
    createdAt: string;
    updatedAt: string;
  }
}
