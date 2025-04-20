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

  // Orders API endpoints
  const ordersCollection = await database.collection("orders");

  app.get("/orders", async (req, res) => {
    try {
      const orders = await ordersCollection.find().toArray();

      if (!orders) {
        return res.status(404).send({ error: "Could not fetch orders" });
      }
      res.send(orders);
    } catch (error) {
      console.error("Error");
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  app.get("/orders/:id", async (req, res) => {
    const ordersId = req.params.id;

    try {
      const order = await ordersCollection.findOne({
        _id: new ObjectId(ordersId),
      });

      if (!order) {
        return res.status(404).send({ error: "Order not found" });
      }

      res.send(order);
    } catch (error) {
      console.error("Error");
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  app.post("/orders", async (req, res) => {
    const {
      customer_id,
      total_price,
      payment_status,
      order_status,
      order_items,
      created_at,
    } = req.body;

    if (
      !customer_id ||
      !total_price ||
      !payment_status ||
      !order_status ||
      !order_items ||
      !created_at
    ) {
      return res.status(400).send({ error: "All fields are required" });
    }

    const newOrder = {
      customer_id,
      total_price,
      payment_status,
      order_status,
      order_items,
      created_at,
    };

    try {
      const result = await ordersCollection.insertOne(newOrder);
      res.send({ message: "order created", id: result.insertedId });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  app.delete("/orders/:id", async (req, res) => {
    const ordersId = req.params.id;

    try {
      const result = await ordersCollection.deleteOne({
        _id: new ObjectId(ordersId),
      });

      if (result.deletedCount === 0) {
        return res.status(400).send({ error: "Could not find order" });
      }
      res.send({ "Order deleted": result });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).send({ error: "Internal Server Error" });
    }
  });

  app.patch("/orders/:id", async (req, res) => {
    const orderId = req.params.id;
    const filter = { _id: new ObjectId(orderId) };

    const orderProperties = req.body;

    const updatedOrder = {
      $set: orderProperties,
    };

    const result = await ordersCollection.updateOne(filter, updatedOrder);
    const order = await ordersCollection.findOne(filter);

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Order not found" });
    }

    res.send({ "Order updated": order });
  });

  app.listen(4000, () => {
    console.log("Server started");
  });
};

connectDB();
