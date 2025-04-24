import express from "express";
import customerRouter from "./src/routes/customers.js";
import productRouter from "./src/routes/products.js";
import orderRouter from "./src/routes/orders.js";
import orderItemRouter from "./src/routes/orderItems.js";
const app = express();

// Middleware
// App can read json
app.use(express.json());

// Routes
app.use("/customers", customerRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/order-items", orderItemRouter);

app.get("/", (req, res) => {
  res.send({ test: "test" });
});

export default app;
