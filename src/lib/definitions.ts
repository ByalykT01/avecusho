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

export interface UserData {
  name: string|undefined,
  email: string|undefined,
  image: string|undefined,
  id: string|undefined,
  role: 'USER'|'ADMIN'
}