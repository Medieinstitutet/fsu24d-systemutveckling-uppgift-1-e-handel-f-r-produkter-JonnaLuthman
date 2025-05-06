import { CartItemWithDetails } from "../types/CartItem";

export const calculateCartTotal = (cart: CartItemWithDetails[]) => {
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return cartTotal;
};
