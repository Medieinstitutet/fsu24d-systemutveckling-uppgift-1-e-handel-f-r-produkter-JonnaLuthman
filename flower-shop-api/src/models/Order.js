import { toObjectId } from "../utils/toObjectId.js";
import { BaseModel } from "./BaseModel.js";

export class Order extends BaseModel {
  constructor() {
    super("orders");
  }

  async findAllWithItems() {
    return await this.collection
      .aggregate([
        {
          $lookup: {
            from: "order_items",
            localField: "_id",
            foreignField: "order_id",
            as: "order_items",
          },
        },
      ])
      .toArray();
  }

  async findByIdwithItems(orderId) {
    return await this.collection
      .aggregate([
        {
          $match: { _id: toObjectId(orderId) },
        },
        {
          $lookup: {
            from: "order_items",
            localField: "_id",
            foreignField: "order_id",
            as: "order_items",
          },
        },
      ])
      .toArray();
  }

  async findOrderItemsByOrder(orderId) {
    return await this.collection
      .aggregate([
        {
          $match: { _id: toObjectId(orderId) },
        },

        {
          $lookup: {
            from: "order_items",
            localField: "_id",
            foreignField: "order_id",
            as: "order_item",
          },
        },
        {
          $unwind: {
            path: "$order_item",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "order_item.product_id",
            foreignField: "_id",
            as: "order_item.product",
          },
        },
        {
          $unwind: "$order_item.product",
        },
        {
          $project: {
            _id: 0,
            order_item_id: "$order_item._id",
            quantity: "$order_item.quantity",
            product_id: "$order_item.product_id",
            title: "$order_item.product.title",
            description: "$order_item.product.description",
            product_price: "$order_item.product.price",
          },
        },
      ])
      .toArray();
  }
}
