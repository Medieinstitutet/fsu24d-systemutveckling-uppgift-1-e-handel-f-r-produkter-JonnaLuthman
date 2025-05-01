import { Cart, CartUpdate } from "../types/Cart";
import { AddToCartResponse, CartItemCreate, CartItemUpdate } from "./../types/CartItem";
import axios from "axios";

const CART_URL = "http://localhost:5173/api/cart";

export const addToCart = async (
  cartId: string | null,
  payload: CartItemCreate
): Promise<AddToCartResponse> => {
  try {
    // If cart doesn´t exist, use dummyId to create a new cart.
    const realCartId = cartId ?? "000000000000000000000000";
    const response = await axios.post(`${CART_URL}/${realCartId}/add`, payload);
    return response.data
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const fetchCart = async (cartId: string): Promise<Cart> => {
  try {
    const response = await axios.get(`${CART_URL}/${cartId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const updateCartItem = async (cartId: string, payload: CartItemUpdate): Promise<CartUpdate> => {
    try {
        const response = await axios.patch(`${CART_URL}/${cartId}/update`, payload);
        console.log("updateCartItem response.data",response.data)
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error();
      }
}

export const removeCartItem = async (cartId: string, productId: string): Promise<CartUpdate> => {
    try {
        const response = await axios.delete(`${CART_URL}/${cartId}/remove`, { data: { productId } });
        console.log("removeCartItem, cart item deleted", response.data)
        return response.data;
      } catch (error) {
        console.log(error);
        throw new Error();
      }
}
