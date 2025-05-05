import { toObjectId } from "../utils/toObjectId.js";
import { ObjectId } from "mongodb";
import { Cart } from "../models/Cart.js";

const cartModel = new Cart();

export async function getCart(req, res) {
  try {
    const cart = await cartModel.getCartWithDetails(req.params.cartId);

    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cart" });
  }
}

export const addToCart = async (req, res) => {
  const { cartId } = req.params;
  const { productId, price, quantity } = req.body;

  if (!productId || !price || !quantity) {
    return res
      .status(400)
      .json({ error: "ProductId, price and quantity are required." });
  }

  try {
    let cart;

    if (cartId) {
      cart = await cartModel.getCartWithDetails(cartId);
    }

    if (!cart) {
      const newCartId = await cartModel.createEmptyCart();
      cart = await cartModel.getCartWithDetails(newCartId);
    }

    const cartLogic = await cartModel.getItemLogic(cart.cartItems);

    const objectId = toObjectId(productId);

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId format" });
    }

    cartLogic.addItem(objectId, price, quantity);

    await cartModel.save(cart._id, {
      cartItems: cartLogic.items,
      updatedAt: new Date(),
    });

    res.json({
      message: "Product added to cart",
      cartId: cart._id,
      cartItems: cartLogic.items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding to cart" });
  }
};

export async function updateCartItem(req, res) {
  const { cartId } = req.params;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ error: "ProductId and quantity are required." });
  }

  try {
    const cart = await cartModel.getCartWithDetails(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const logic = cartModel.getItemLogic(cart.cartItems);
    console.log(logic);
    logic.updateQuantity(toObjectId(productId), quantity);

    await cartModel.updateItemQuantity(
      { _id: toObjectId(cartId) },
      { $set: { cartItems: logic.items } }
    );

    res.json({ message: "Cart item updated", cartItems: logic.items });
  } catch (err) {
    res.status(500).json({ error: "Error updating cart item" });
  }
}

export async function removeFromCart(req, res) {
  const { cartId } = req.params;
  const { productId } = req.body;

  try {
    const cart = await cartModel.getCartWithDetails(cartId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const logic = cartModel.getItemLogic(cart.cartItems);
    logic.removeItem(toObjectId(productId));

    await cartModel.save(cart._id, {
      cartItems: logic.items,
      updatedAt: new Date(),
    });

    res.json({ message: "Item removed from cart", cartItems: logic.items });
  } catch (err) {
    res.status(500).json({ error: "Error removing cart item" });
  }
}
