import { CartItem, CartItemWithDetails } from "./CartItem.js";
import { Customer } from "./Customer.js";

export type Order = {
  _id: string;
  customer_id: string;
  total_price: number;
  payment_status: string;
  order_status: string;
  created_at: string;
  order_items: CartItem[];
};

export type OrderWithDetails = {
  created_at: string;
  customer: Customer;
  order_items: CartItemWithDetails[];
  order_status: string;
  payment_status: string;
  total_price: number;
  _id: string;
};

export type OrderCreate = {
  cart_id: string,
  customer_id: string,
  payment_status: string,
  order_status: string,
};

export type OrderResponse = {
  orderId: string,
  message: string,
  result: {}
}