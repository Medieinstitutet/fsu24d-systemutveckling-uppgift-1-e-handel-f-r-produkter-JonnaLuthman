import { ObjectId } from "mongodb";

export const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    throw new Error("Invalid ID format. Must be a valid ObjectId.");
  }
};
