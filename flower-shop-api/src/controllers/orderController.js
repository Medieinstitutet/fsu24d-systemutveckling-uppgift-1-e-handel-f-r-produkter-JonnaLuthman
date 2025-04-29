import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";
import { Cart } from "../models/Cart.js";
import { addTimestamps, updateTimestamp } from "../utils/timeStamps.js";

const orderModel = new Order();
const orderItemModel = new OrderItem();
const cartModel = new Cart();

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

export const createOrder = async (req, res) => {
  const { cart_id, customer_id, payment_status, order_status } = req.body;

  if (!cart_id || !customer_id || !payment_status || !order_status) {
    return res.status(400).send({
      error:
        "Cart ID, customer ID, payment status, and order status are required.",
    });
  }

  try {
    const cart = await cartModel.findById(cart_id);
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      return res.status(404).send({ error: "Cart not found or empty" });
    }



    const total_price = cart.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = addTimestamps({
      customer_id,
      total_price,
      payment_status,
      order_status,
    });

    await orderModel.save(null, newOrder);

    const orderId = orderModel.id;
    const orderItemsData = cart.cartItems.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    console.log(orderItemsData)

    const result = await orderItemModel.createItems(orderItemsData);
    console.log(result)

    // await cartModel.delete(cart_id);

    res.send({
      message: "Order created successfully",
      orderId,
      result,
    });
  } catch (error) {
    console.error("Error creating order from cart:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const updateOrder = async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const orderData = updateTimestamp(data);

  try {
    await orderModel.save(id, orderData);
    const updatedOrder = await orderModel.findById(id);

    if (!updateOrder) {
      return res.status(404).send({ error: "Order not found" });
    }

    res.send({ "Order updated": updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
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
