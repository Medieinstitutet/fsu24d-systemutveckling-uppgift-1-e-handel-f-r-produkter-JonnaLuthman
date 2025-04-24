import { Database } from "../db/DataBase.js";
import { toObjectId } from "../utils/toObjectId.js";

export class BaseModel {
  constructor(collectionName) {
    const dbInstance = new Database();
    dbInstance.connect().then((db) => {
      this.collection = db.collection(collectionName);
    });
  }

  async findAll() {
    return await this.collection.find().toArray();
  }

  async findById(id) {
    return await this.collection.findOne({ _id: toObjectId(id) });
  }

  async create(data) {
    return await this.collection.insertOne(data);
  }

  async delete(id) {
    return await this.collection.deleteOne({ _id: toObjectId(id) });
  }

  async update(id, data) {
    return await this.collection.updateOne(
      { _id: toObjectId(id) },
      { $set: data }
    );
  }
}
