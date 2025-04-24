// Old API logic saved here for reference while refactoring to models/controllers/routes structure.
// Do not run this file directly.

//   Customers API endpoints
const customersCollection = await database.collection("customers");
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

  try {
    const result = await customersCollection.updateOne(filter, updatedcustomer);
    const customer = await customersCollection.findOne(filter);

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Customer not found" });
    }

    res.send({ "Customer updated": customer });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Orders API endpoints
const ordersCollection = await database.collection("orders");
app.get("/orders", async (req, res) => {
  try {
    const orders = await ordersCollection
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
  const orderId = req.params.id;

  try {
    const order = await ordersCollection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(orderId),
          },
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

    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    res.send(order[0]);
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

  try {
    const result = await ordersCollection.updateOne(filter, updatedOrder);
    const order = await ordersCollection.findOne(filter);

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Order not found" });
    }

    res.send({ "Order updated": order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Products API endpoints
const productsCollection = await database.collection("products");
app.get("/products", async (req, res) => {
  try {
    const products = await productsCollection.find().toArray();

    if (!products) {
      return res.status(404).send({ error: "Could not fetch products" });
    }
    res.send(products);
  } catch (error) {
    console.error("Error");
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.get("/products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await productsCollection.findOne({
      _id: new ObjectId(productId),
    });

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.send(product);
  } catch (error) {
    console.error("Error");
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/products", async (req, res) => {
  const { title, stock, description, price } = req.body;

  if (!title || !stock || !description || !price) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const newProduct = {
    title,
    stock,
    description,
    price,
  };

  try {
    const result = await productsCollection.insertOne(newProduct);
    res.send({ message: "Product created", id: result.insertedId });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.delete("/products/:id", async (req, res) => {
  const productId = req.params.id;

  try {
    const result = await productsCollection.deleteOne({
      _id: new ObjectId(productId),
    });

    if (result.deletedCount === 0) {
      return res.status(400).send({ error: "Could not find product" });
    }
    res.send({ "Product deleted": result });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.patch("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const filter = { _id: new ObjectId(productId) };

  const { stock } = req.body;

  const updatedStock = {
    $set: { stock },
  };

  try {
    const result = await productsCollection.updateOne(filter, updatedStock);
    const product = await productsCollection.findOne(filter);

    if (typeof stock !== "number" || stock < 0) {
      return res
        .status(400)
        .send({ error: "Stock must be a non-negative number" });
    }

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Product not found" });
    }

    res.send({ "Stock updated": product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Order items API endpoints
const orderItemsCollection = await database.collection("order_items");
app.get("/orders/:id/items", async (req, res) => {
  const orderId = req.params.id;

  console.log(orderId);

  try {
    const items = await ordersCollection
      .aggregate([
        {
          $match: {
            _id: new ObjectId(orderId),
          },
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

    console.log(items);

    res.send(items);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.post("/order-items", async (req, res) => {
  const { order_id, product_id, quantity } = req.body;

  if (!order_id || !product_id || !quantity) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const newOrderItem = {
    order_id,
    product_id,
    quantity,
  };

  try {
    const result = await orderItemsCollection.insertOne(newOrderItem);
    res.send({ message: "Order item created", id: result.insertedId });
  } catch (error) {
    console.error("Error creating order item:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.patch("/order-items/:id", async (req, res) => {
  const orderItemId = req.params.id;
  const filter = { _id: new ObjectId(orderItemId) };

  const { quantity } = req.body;

  const updatedQuantity = {
    $set: { quantity },
  };

  try {
    const result = await orderItemsCollection.updateOne(
      filter,
      updatedQuantity
    );
    const orderItem = await orderItemsCollection.findOne(filter);

    if (typeof quantity !== "number" || quantity < 0) {
      return res
        .status(400)
        .send({ error: "Quantity must be a non-negative number" });
    }

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Order iten not found" });
    }

    res.send({ "Quantity updated": orderItem });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.delete("/order-items/:id", async (req, res) => {
  const orderItemId = req.params.id;

  try {
    const result = await orderItemsCollection.deleteOne({
      _id: new ObjectId(orderItemId),
    });

    if (result.deletedCount === 0) {
      return res.status(400).send({ error: "Could not find order item" });
    }
    res.send({ "Order item deleted": result });
  } catch (error) {
    console.error("Error creating order item:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});
