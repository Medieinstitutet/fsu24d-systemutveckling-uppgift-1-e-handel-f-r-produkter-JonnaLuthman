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

  getCartAggregation(cartId) {
    return [
      {
        $unwind: {
          path: "$cartItems",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "cartItems.productId",
          foreignField: "_id",
          as: "cartItems.product",
        },
      },
      {
        $unwind: {
          path: "$cartItems.product",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          cartItems: {
            $push: "$cartItems",
          },
          updated_at: {
            $first: "$updatedAt",
          },
          created_at: {
            $first: "$createdAt",
          },
        },
      },
    ];
  }

  async getCartWithDetails(cartId) {
    const pipeline = this.getCartAggregation(cartId);
    try {
      const result = await this.collection.aggregate(pipeline).toArray();
      return result[0] || null;
    } catch (error) {
      console.error("Aggregation failed:", error);
      throw error;
    }
  }
}
