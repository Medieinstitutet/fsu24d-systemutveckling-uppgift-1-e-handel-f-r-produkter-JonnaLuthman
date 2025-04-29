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

  async delete(id) {
    return await this.collection.deleteOne({ _id: toObjectId(id) });
  }

  async save(id, data) {
    if (id) {
      let result = await this.collection.updateOne(
        { _id: toObjectId(id) },
        { $set: data }
      );
      return result;
    } else {
      let result = await this.collection.insertOne(data);
      this.id = result.insertedId;
      return result;
    }
  }
}
