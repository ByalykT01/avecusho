export type Item = {
  id: number;
  name: string;
  url: string;
  price: string;
  description: string;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

export interface CartItem {
  id: number;
  cartId: number;
  itemId: number;
  addedAt: Date;
}
