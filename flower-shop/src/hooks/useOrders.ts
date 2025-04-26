import { useState } from "react";
import { fetchOrders, fetchOrderById, createOrder } from "../services/orderService";
import { OrderCreate } from "../types/Order";

export const useOrders = () => {
    const [error, setError] = useState<string>("");

  
    const fetchOrdersHandler = async () => {
      try {
        const data = await fetchOrders();
        return data;
      } catch (error) {
        setError("Error: Failed to get orders");
        throw error;
      } finally {
      }
    };
  
    const fetchOrderByIdHandler = async (id: number) => {
      try {
        const data = await fetchOrderById(id);
        return data;
      } catch (error) {
        setError("Error: Failed to get order");
        throw error;
      } finally {
      }
    };
  
    const createOrderHandler = async (payload: OrderCreate) => {
      try {
        const data = await createOrder(payload);
        return data;
      } catch (error) {
        setError("Error: Failed to create order");
        throw error;
      } finally {
      }
    };

    return {
      error,
      fetchOrdersHandler,
      fetchOrderByIdHandler,
      createOrderHandler,
    };
  };
  