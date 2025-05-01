import { CartItem } from "./CartItem";

export type Cart = {
  _id: string;
  cartItems: CartItem[];
  updatedAt?: string;
};

export type CartUpdate = {
  message: string;
  cartItems: CartItem[];
};
