import { CartItem } from "../types/CartItem";

export const calculateCartTotal = (cart: CartItem[]) => {
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return cartTotal;
};
