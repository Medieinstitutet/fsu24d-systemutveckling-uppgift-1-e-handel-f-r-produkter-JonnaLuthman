import { MongoClient } from "mongodb";

// const MONGO_DB_URL =
//   "mongodb+srv://jonnaluthman:zob0SQdGczamZl1x@cluster0.h21qcz9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const LOCALHOST_DB_URL = "mongodb://localhost:27017/";
const DB_NAME = "flower-shop";

export class Database {
  constructor() {
    this.client = new MongoClient(LOCALHOST_DB_URL);
    this.db = null;
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(DB_NAME);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }

    return this.db;
  }
}
