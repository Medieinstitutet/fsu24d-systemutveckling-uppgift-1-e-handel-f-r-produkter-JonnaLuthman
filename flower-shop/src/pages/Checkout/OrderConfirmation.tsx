import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { OrderWithDetails } from "../../types/Order.js";
import { useOrders } from "../../hooks/useOrders";

export const OrderConfirmation = () => {
  const location = useLocation();
  const { fetchOrderByIdHandler } = useOrders();
  const orderId = location.state.orderId;

  const [order, setOrder] = useState<OrderWithDetails | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const fetchedOrder = await fetchOrderByIdHandler(orderId);
        setOrder(fetchedOrder);
      } catch (error) {
        console.log("Could not fetch order in Order confirmation");
      }
    };
    
    if (orderId) fetchOrder();
  }, []);
  
  console.log(order)
  if (!order) return <p>Loading order information...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1>Order confirmation</h1>
      <h2>Thank you for your order!</h2>
      <hr style={{ margin: "1rem 0" }} />
      <p>
        <strong>Order number:</strong> {order._id}
      </p>
      <p>
        <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}
      </p>
      <p>
        <strong>Status:</strong> {order.order_status}
      </p>
      <p>
        <strong>Payment:</strong> {order.payment_status}
      </p>

      <hr style={{ margin: "1rem 0" }} />

      <h2>Customer</h2>
      <p> {order.customer.last_name}</p>
      <p>{order.customer.email}</p>
      <p>{order.customer.street_address}, {order.customer.zip_code} {order.customer.city}</p>

      <hr style={{ margin: "1rem 0" }} />

      <h2>Products</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                textAlign: "left",
                padding: "8px",
                borderBottom: "1px solid #ccc",
              }}
            >
              Product
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "8px",
                borderBottom: "1px solid #ccc",
              }}
            >
              Quantity
            </th>
            <th
              style={{
                textAlign: "left",
                padding: "8px",
                borderBottom: "1px solid #ccc",
              }}
            >
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {order.order_items.map((item) => (
            <tr key={item.product._id}>
              <td style={{ padding: "8px" }}>{item.product.title}</td>
              <td style={{ padding: "8px" }}>{item.quantity}</td>
              <td style={{ padding: "8px" }}>{item.product.price} kr</td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr style={{ margin: "1rem 0" }} />

      <h3 style={{ marginTop: "1.5rem" }}>Total: {order.total_price} kr</h3>
    </div>
  );
};
