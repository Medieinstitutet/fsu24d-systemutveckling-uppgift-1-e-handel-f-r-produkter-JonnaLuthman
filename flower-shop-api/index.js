import { MongoClient, ObjectId } from "mongodb";
import express from "express";

// const MONGO_DB_URL =
//   "mongodb+srv://jonnaluthman:zob0SQdGczamZl1x@cluster0.h21qcz9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const LOCALHOST_DB_URL = "mongodb://localhost:27017/";

let client = new MongoClient(LOCALHOST_DB_URL);

const database = client.db("flower-shop");

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to db");
  } catch (error) {
    console.log("Error connecting to DB", error);
  }

  const app = express();
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send({ test: "test" });
  });

  const customersCollection = await database.collection("customers");

  //   Customers API endpoints
  app.get("/customers", async (req, res) => {
    try {
      const customers = await customersCollection.find().toArray();

      if (!customers) {
        return res.status(404).send({ error: "Could not fetch customers" });
      }
      res.send(customers);
    } catch (error) {
      console.error("Error");
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  app.get("/customers/:id", async (req, res) => {
    const customersId = req.params.id;

    try {
      const customer = await customersCollection.findOne({
        _id: new ObjectId(customersId),
      });

      if (!customer) {
        return res.status(404).send({ error: "Customer not found" });
      }

      res.send(customer);
    } catch (error) {
      console.error("Error");
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  app.post("/customers", async (req, res) => {
    const { first_name, last_name, email, street_address, zip_code, city } =
      req.body;

    if (
      !first_name ||
      !last_name ||
      !email ||
      !street_address ||
      !zip_code ||
      !city
    ) {
      return res.status(400).send({ error: "All fields are required" });
    }

    const newCustomer = {
      first_name,
      last_name,
      email,
      street_address,
      zip_code,
      city,
    };

    try {
      const result = await customersCollection.insertOne(newCustomer);
      res.send({ message: "Customer created", id: result.insertedId });
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  app.delete("/customers/:id", async (req, res) => {
    const customersId = req.params.id;

    try {
      const result = await customersCollection.deleteOne({
        _id: new ObjectId(customersId),
      });

      if (result.deletedCount === 0) {
        return res.status(400).send({ error: "Could not find customer" });
      }
      res.send({ "User deleted": result });
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  app.patch("/customers/:id", async (req, res) => {
    const customerId = req.params.id;
    const filter = { _id: new ObjectId(customerId) };

    const customerProperties = req.body;

    const updatedcustomer = {
      $set: customerProperties,
    };

    const result = await customersCollection.updateOne(filter, updatedcustomer);
    const customer = await customersCollection.findOne(filter);

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Customer not found" });
    }

    res.send({ "Customer updated": customer });
  });

  app.listen(4000, () => {
    console.log("Server started");
  });
};

connectDB();
