import express from "express";

const app = express();

// Middleware
// App can read json
app.use(express.json());

// Routes
// app.use("/customers", customerRoutes)

app.get("/", (req, res) => {
  res.send({ test: "test" });
});

export default app;
