import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { OrderWithDetails } from "../../types/Order.js";
import { useOrders } from "../../hooks/useOrders";

export const OrderConfirmation = () => {
  const location = useLocation();
  const { fetchOrderByIdHandler } = useOrders()
  const orderId = location.state.orderId;

  const [order, setOrder] = useState<OrderWithDetails | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const fetchedOrder = await fetchOrderByIdHandler(orderId);
        console.log(fetchedOrder)
        console.log(orderId)
        setOrder(fetchedOrder);
      } catch (error) {
        console.log("Could not fetch order in Order confirmation");
      }
    };

    if (orderId) fetchOrder();
  }, []);

  if (!order) return <p>Laddar orderinformation...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1>Orderbekräftelse</h1>
      <p><strong>Ordernummer:</strong> {order._id}</p>
      <p><strong>Datum:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {order.order_status}</p>
      <p><strong>Betalning:</strong> {order.payment_status}</p>

      <hr style={{ margin: "1rem 0" }} />

      <h2>Kunduppgifter</h2>
      {/* <p> {order.customer.last_name}</p>
      <p>{order.customer.email}</p>
      <p>{order.customer.street_address}, {order.customer.zip_code} {order.customer.city}</p> */}

      <hr style={{ margin: "1rem 0" }} />

      <h2>Produkter</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ccc" }}>Produkt</th>
            <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ccc" }}>Antal</th>
            <th style={{ textAlign: "left", padding: "8px", borderBottom: "1px solid #ccc" }}>Pris</th>
          </tr>
        </thead>
        <tbody>
          {order.order_items.map((item) => (
            <tr key={item.product._id}>
              <td style={{ padding: "8px" }}>{item.product.title}</td>
              <td style={{ padding: "8px" }}>{item.quantity}</td>
              <td style={{ padding: "8px" }}>{item.price} kr</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: "1.5rem" }}>Total: {order.total_price} kr</h3>
    </div>
  );
};


