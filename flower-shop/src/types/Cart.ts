import { CartItem, CartItemWithDetails } from "./CartItem";

export type Cart = {
  _id: string;
  cartItems: CartItem[];
  updatedAt?: string;
  createdAt: string;
};

export type CartUpdate = {
  message: string;
  cartItems: CartItemWithDetails[];
};
