import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "./../utils/localStorage";
import { useState } from "react";
import { addToCart, fetchCart, updateCartItem } from "../services/cartService.ts";
import { CartItemCreate, CartItemUpdate } from "../types/CartItem.ts";

export const useCart = () => {
  const [cartId, setCartId] = useState<string | null>(() => {
    return getFromLocalStorage("cartID");
  });

  const handleAddToCart = async (payload: CartItemCreate) => {
    try {
      const data = await addToCart(cartId, payload);
      if (!cartId && data.cartId) {
        setCartId(data.cartId);
      }

      saveToLocalStorage("cartId", cartId);

      return data.cartId;
    } catch (error) {
      throw error;
    }
  };

  const handleFetchCart = async (cartId: string) => {
    try {
      const data = await fetchCart(cartId);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateCartItem = async (cartId: string, item: CartItemUpdate) => {
    try {
      const data = await updateCartItem(cartId, item);
      return data;
    } catch (error) {
      throw error;
    }
  };

  return {
    handleAddToCart,
    handleFetchCart,
    handleUpdateCartItem,
  };
};
