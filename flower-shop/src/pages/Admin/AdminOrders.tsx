import { useEffect, useState } from "react";
import { OrderWithDetails } from "../../types/Order";
import { useOrders } from "../../hooks/useOrders";

export const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [error, setError] = useState<string>("");
  const { fetchOrdersHandler } = useOrders();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrdersHandler();
        console.log(data)
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
              <li> Customer: {order.customer.first_name} - 
              Total price: {order.total_price}</li>
              {order.order_items.map((item) => (
                <p key={item.product._id}>Order items: {item.product.description}</p>
              ))}
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};
