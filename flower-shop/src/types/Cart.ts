import {  CartItemWithDetails } from "./CartItem";

export type Cart = {
  _id: string;
  cartItems: CartItemWithDetails[];
  updatedAt?: string;
  createdAt: string;
};

export type CartUpdate = {
  message: string;
  cartItems: CartItemWithDetails[];
};
