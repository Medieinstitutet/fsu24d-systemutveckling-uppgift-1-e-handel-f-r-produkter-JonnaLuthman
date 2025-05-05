import { toObjectId } from "../utils/toObjectId.js";
import { BaseModel } from "./BaseModel.js"

export class Order extends BaseModel {
  constructor() {
    super("orders");
  }

  getOrderAggregation(orderId = null) {
    const pipeline = [];

    if (orderId) {
      pipeline.push({
        $match: { _id: toObjectId(orderId) },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "order_items",
          localField: "_id",
          foreignField: "order_id",
          as: "order_items",
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customer_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $unwind: {
          path: "$customer",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          order_items: {
            $map: {
              input: "$order_items",
              as: "item",
              in: {
                $mergeObjects: [
                  "$$item",
                  { product_id: { $toObjectId: "$$item.product_id" } },
                ],
              },
            },
          },
        },
      },
      {
        $unwind: {
          path: "$order_items",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "order_items.product_id",
          foreignField: "_id",
          as: "order_items.product",
        },
      },
      {
        $unwind: {
          path: "$order_items.product",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          customer: { $first: "$customer" },
          total_price: { $first: "$total_price" },
          payment_status: { $first: "$payment_status" },
          order_status: { $first: "$order_status" },
          created_at: { $first: "$created_at" },
          order_items: {
            $push: {
              quantity: "$order_items.quantity",
              product: "$order_items.product",
            },
          },
        },
      }
    );

    return pipeline;
  }

  async findAllWithDetails() {
    return await this.collection
      .aggregate(this.getOrderAggregation())
      .toArray();
  }

  async findByIdWithDetails(orderId) {
    const result = await this.collection
      .aggregate(this.getOrderAggregation(orderId))
      .toArray();
    return result[0] || null;
  }
}
