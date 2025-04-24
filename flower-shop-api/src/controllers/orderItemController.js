import { OrderItem } from "../models/OrderItem.js";

const orderItemModel = new OrderItem();

export const createOrderItem = async (req, res) => {
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
    const result = await orderItemModel.create(newOrderItem);
    res.send({ message: "Order item created", id: result.insertedId });
  } catch (error) {
    console.error("Error creating order item:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const updateOrderItem = async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  const { quantity } = updateData

  try {
    const result = await orderItemModel.update(id, updateData);
    const orderItem = await orderItemModel.findById(id);

    if (typeof quantity !== "number" || quantity < 0) {
      return res
        .status(400)
        .send({ error: "Quantity must be a non-negative number" });
    }

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Order item not found" });
    }

    res.send({ "Quantity updated": orderItem });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const deleteOrderItem = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await orderItemModel.delete(id);

    if (result.deletedCount === 0) {
      return res.status(400).send({ error: "Could not find order item" });
    }
    res.send({ "Order item deleted": result });
  } catch (error) {
    console.error("Error creating order item:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
