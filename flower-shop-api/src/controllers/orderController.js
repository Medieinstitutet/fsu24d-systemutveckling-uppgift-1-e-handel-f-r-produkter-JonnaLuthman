import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";
import { addTimestamps, updateTimestamp } from "../utils/timeStamps.js";

const orderModel = new Order();

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.findAllWithDetails();
    console.log(orders);
    if (!orders) {
      return res.status(404).send({ error: "Could not fetch orders" });
    }
    res.send(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getOrderById = async (req, res) => {
  const id = req.params.id;
  try {
    const order = await orderModel.findByIdWithDetails(id);

    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }

    res.send(order);
  } catch (error) {
    console.error("Error");
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getOrderItemsByOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const order_items = await orderModel.findOrderItemsByOrder(id);
    res.send(order_items);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const orderItemModel = new OrderItem();
export const createOrder = async (req, res) => {
  const {
    customer_id,
    total_price,
    payment_status,
    order_status,
    order_items,
  } = req.body;

  if (
    !customer_id ||
    !total_price ||
    !payment_status ||
    !order_status ||
    !order_items ||
    !Array.isArray(order_items) ||
    order_items.length === 0
  ) {
    return res.status(400).send({
      error: "All fields are required, including at least one order item.",
    });
  }

  const newOrder = addTimestamps({
    customer_id,
    total_price,
    payment_status,
    order_status,
  });

  try {

    const result = await orderModel.create(newOrder);
    const orderId = result.insertedId;

    if (result.insertedId) {
      const orderItemsData = order_items.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
      }));
      await orderItemModel.createMany(orderItemsData);
    }

    res.send({
      message: "Order and order items created successfully",
      orderId,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const deleteOrder = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await orderModel.delete(id);

    if (result.deletedCount === 0) {
      return res.status(400).send({ error: "Could not find order" });
    }
    res.send({ "Order deleted": result });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const updateOrder = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const orderData = updateTimestamp(data);

  try {
    const result = await orderModel.update(id, orderData);
    const updatedOrder = await orderModel.findById(id);

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Order not found" });
    }

    res.send({ "Order updated": updatedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
