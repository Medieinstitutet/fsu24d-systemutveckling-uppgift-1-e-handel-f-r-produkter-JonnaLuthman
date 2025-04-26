import { BaseModel } from "./BaseModel.js";

export class OrderItem extends BaseModel {
    constructor() {
        super("order_items")
    }

    async createMany(items) {
        return await this.collection.insertMany(items);
      }
      
}