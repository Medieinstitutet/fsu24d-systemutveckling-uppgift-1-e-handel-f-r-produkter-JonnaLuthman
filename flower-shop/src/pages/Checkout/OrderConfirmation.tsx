import { useEffect } from "react";
import { useLocation } from "react-router";
import { fetchOrderById } from "../../services/orderService";

export const OrderConfirmation = () => {
  const location = useLocation();
  const orderId = location.state.orderId;

  useEffect(() => {
    try {
      const fetchOrder = async (orderId: string) => {
        const order = await fetchOrderById(orderId);
        return order;
      };
      fetchOrder(orderId);
    } catch (error) {
      console.log("Could not fetch order in Order confirmation");
    }
  }, []);

  return <div>
    Order confiamtion page
  </div>;
};
