export type CartItem = {
  _id: string;
  order_id: string;
  productId: string;
  quantity: number;
  price: number;
};

export type CartItemCreate = Omit<CartItem, "_id" | "order_id">;

export type CartItemUpdate = Pick<CartItem, "productId" | "quantity">;

export type AddToCartResponse = {
  cartItems: CartItem[];
  cartId: string;
  message: string;
};



