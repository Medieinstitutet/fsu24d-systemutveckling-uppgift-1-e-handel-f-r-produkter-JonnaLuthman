import { useEffect, useState } from "react";
import { Order } from "../../types/Order";
import { useOrders } from "../../hooks/useOrders";

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string>("");
  const { fetchOrdersHandler } = useOrders();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrdersHandler();
        setOrders(data);
      } catch (error) {
        setError("Failed to load orders");
        console.error(error);
      }
    };

    loadOrders();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <div key={order._id}>
              <li> Customer: {order.customer_id} - 
              Total price: {order.total_price}</li>
              {order.order_items.map((item) => (
                <p key={item._id}>Order items: {item.product_id}</p>
              ))}
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};
