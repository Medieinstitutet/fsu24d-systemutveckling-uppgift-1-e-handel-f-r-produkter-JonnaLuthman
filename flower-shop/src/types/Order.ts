import { CartItem } from "./CartItem.js";

export type Order = {
  _id: string;
  customer_id: string;
  total_price: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  order_items: CartItem[];
};

export type OrderCreate = {
  cart_id: string,
  customer_id: string,
  payment_status: string,
  order_status: string,
};
