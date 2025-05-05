import axios from "axios";
import {
  Order,
  OrderCreate,
  OrderResponse,
  OrderWithDetails,
} from "../types/Order";

const ORDER_URL = "/api/orders";

export const fetchOrders = async (): Promise<OrderWithDetails[]> => {
  try {
    const response = await axios.get(`${ORDER_URL}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const fetchOrderById = async (id: string): Promise<OrderWithDetails> => {
  try {
    const response = await axios.get(`${ORDER_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const deleteOrder = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${ORDER_URL}/${id}`);
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const updateOrder = async (
  id: string,
  payload: Order
): Promise<Order> => {
  try {
    const response = await axios.patch(`${ORDER_URL}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const createOrder = async (
  payload: OrderCreate
): Promise<OrderResponse> => {
  try {
    const response = await axios.post(`${ORDER_URL}/add`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};
