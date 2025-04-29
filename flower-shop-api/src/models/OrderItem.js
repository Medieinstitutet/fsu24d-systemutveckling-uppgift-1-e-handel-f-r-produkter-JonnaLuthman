import { BaseModel } from "./BaseModel.js";
import { toObjectId } from "../utils/toObjectId.js";

export class OrderItem extends BaseModel {
  constructor() {
    super("order_items");
  }

  async findByOrderId(orderId) {
    return await this.collection
      .find({ order_id: toObjectId(orderId) })
      .toArray();
  }

  async createItems(items) {
    return await this.collection.insertMany(items);
  }

  async updateQuantity(orderItemId, quantity) {
    return await this.collection.updateOne(
      { _id: toObjectId(orderItemId) },
      { $set: { quantity } }
    );
  }

  async deleteItem(orderItemId) {
    return await this.collection.deleteOne({ _id: toObjectId(orderItemId) });
  }
}
