import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";
import { Cart } from "../models/Cart.js";
import { addTimestamps, updateTimestamp } from "../utils/timeStamps.js";
import {
  ApiError,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import { toObjectId } from "../utils/toObjectId.js";

const orderModel = new Order();
const orderItemModel = new OrderItem();
const cartModel = new Cart();

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.findAllWithDetails();
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
    console.log("order in fetchOrderbyID", order)
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
  console.log("createOrder running1 ")
  const { cart_id, customer_id, payment_status, order_status } = req.body;

  console.log("createOrder running2 req body ", req.body)

  if (!cart_id || !customer_id || !payment_status || !order_status) {
    return res.status(400).send({
      error:
        "Cart ID, customer ID, payment status, and order status are required.",
    });
  }
  console.log("createOrder running 3 ")
  try {
    const cart = await cartModel.findById(cart_id);
    if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
      return res.status(404).send({ error: "Cart not found or empty" });
    }

    const total_price = cart.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const customerObjectId = toObjectId(customer_id)

      console.log("createOrder running1 customer_id", customer_id)
    const newOrder = addTimestamps({
      customer_id: customerObjectId,
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

    const result = await orderItemModel.createItems(orderItemsData);

    await cartModel.delete(cart_id);

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

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID,
    oAuthClientSecret: PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

const ordersController = new OrdersController(client);

export const createOrder_paypal = async (cart, amount) => {
  const collect = {
    body: {
      intent: "CAPTURE",
      purchaseUnits: [
        {
          amount: {
            currencyCode: "SEK",
            value: amount,
            breakdown: {
              itemTotal: {
                currencyCode: "SEK",
                value: amount,
              },
            },
          },
          items: cart.map((item) => ({
            name: item.product_id,
            quantity: item.quantity.toString(),
            unitAmount: {
              currencyCode: "SEK",
              value: item.price.toFixed(2),
            },
          })),
        },
      ],
    },
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } = await ordersController.createOrder(
      collect
    );
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
  }
};

export const captureOrder_paypal = async (orderID) => {
  const collect = {
    id: orderID,
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } = await ordersController.captureOrder(
      collect
    );
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
  }
};
