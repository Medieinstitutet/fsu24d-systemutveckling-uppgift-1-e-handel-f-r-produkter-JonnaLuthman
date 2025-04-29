import express from "express";
import cors from 'cors';
import customerRouter from "./src/routes/customers.js";
import productRouter from "./src/routes/products.js";
import orderRouter from "./src/routes/orders.js";
import orderItemRouter from "./src/routes/orderItems.js";
import cartRouter from "./src/routes/cart.js"
const app = express();

// Middleware
// App can read json
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Routes
app.use("/customers", customerRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/order-items", orderItemRouter);
app.use("/cart", cartRouter);

app.get("/", (req, res) => {
  res.send({ test: "test" });
});

export default app;
