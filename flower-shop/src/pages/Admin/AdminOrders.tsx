import { useEffect, useState } from "react";
import { OrderWithDetails } from "../../types/Order";
import { useOrders } from "../../hooks/useOrders";
import "../../styles/adminOrdersPage.css";

export const AdminOrders = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [error, setError] = useState<string>("");
  const { fetchOrdersHandler } = useOrders();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrdersHandler();
        console.log(data);
        setOrders(data);
      } catch (error) {
        setError("Failed to load orders");
        console.error(error);
      }
    };

    getOrders();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="admin-orders">
      <h1>All Orders</h1>

      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <hr style={{ margin: "1rem 0" }} />
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>Date:</strong> {new Date(order.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Customer:</strong> {order.customer.first_name}{" "}
            {order.customer.last_name} ({order.customer.email})
          </p>

          <div className="order-items">
            <p>
              <strong>Items:</strong>
            </p>
            <ul>
              {order.order_items.map((item, index) => (
                <li key={index}>
                  {item.product.title} — Qty: {item.quantity} —{" "}
                  {item.product.price} kr/st
                </li>
              ))}
            </ul>
          </div>

          <p>
            <strong>Total:</strong> {order.total_price} kr
          </p>
          <p>
            <strong>Order Status:</strong> {order.order_status}
          </p>
          <p>
            <strong>Payment Status:</strong> {order.payment_status}
          </p>
        </div>
      ))}
    </div>
  );
};
