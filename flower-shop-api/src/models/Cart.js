import { BaseModel } from "./BaseModel.js";
import { BaseOrder } from "./BaseOrder.js";

export class Cart extends BaseModel {
  constructor(cartData) {
    super("cart");
    this.itemsLogic = new BaseOrder(cartData?.cartItems || []);
  }

  async createEmptyCart() {
    const newCart = {
      cartItems: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await this.collection.insertOne(newCart);
    return result.insertedId;
  }

  addItemToCart(productId, price, quantity) {
    this.itemsLogic.addItem(productId, price, quantity);
  }

  removeItemFromCart(productId) {
    this.itemsLogic.removeItem(productId);
  }

  updateItemQuantity(productId, quantity) {
    this.itemsLogic.updateQuantity(productId, quantity);
  }

  getItemLogic(cartItems) {
    return new BaseOrder(cartItems);
  }
}
