import axios from "axios";
import { useEffect, useRef } from "react";

// Declare a custom type for window.paypal
declare global {
  interface Window {
    paypal: any;
  }
}
import { CartItem } from "../../types/CartItem";
import { useOrders } from "../../hooks/useOrders";
import { OrderCreate } from "../../types/Order";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
} from "../../utils/localStorage";
import { useNavigate } from "react-router";
import { calculateCartTotal } from "../../utils/calculateCartTotal";

interface ICartProps {
  cart: CartItem[] | null;
  customerId: string;
}

export const PaypalCheckoutButton = ({ cart, customerId }: ICartProps) => {
  const paypal = useRef(null);
  const { createOrderHandler } = useOrders();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cart || cart.length === 0) return;

    window.paypal
      .Buttons({
        style: {
          shape: "rect",
          layout: "vertical",
          color: "white",
          label: "checkout",
        },
        async createOrder() {
          const totalAmount = calculateCartTotal(cart);
          
          const payload = {
            cart: cart.map((item) => ({
              product_id: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
            amount: totalAmount.toFixed(2),
          };

          try {
            const response = await axios.post("/api/paypal/orders", payload);
            const orderData = response.data;
            if (orderData.id) {
              return orderData.id;
            }

            const errorDetail = orderData?.details?.[0];
            const errorMessage = errorDetail
              ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
              : JSON.stringify(orderData);

            throw new Error(errorMessage);
          } catch (error) {
            console.error("Error creating PayPal order:", error);
          }
        },
        async onApprove(data) {
          try {
            const response = await axios.post(
              `/api/paypal/${data.orderID}/capture`
            );

            const orderData = response.data;
            const payload: OrderCreate = {
              cart_id: await getFromLocalStorage("cartId"),
              customer_id: customerId,
              payment_status: "Paid",
              order_status: "Created",
            };

            try {
              const result = await createOrderHandler(payload);
              console.log("result", result);
              const transaction =
                orderData?.purchase_units?.[0]?.payments?.captures?.[0];

              if (transaction)
                navigate("/order-confirmation", {
                  state: { orderId: result.orderId },
                });
              await removeFromLocalStorage("cartId");
            } catch (error) {
              console.log(error);
              throw new Error();
            }
          } catch (error) {
            console.error("Error capturing PayPal order:", error);
          }
        },
        onError(error: unknown) {
          console.error("PayPal-fel:", error);
        },
      })
      .render(paypal.current);
  }, [cart, createOrderHandler]);

  return (
    <div>

<h2>This is your order</h2>

<ul>
  {cart?.map((item) => (
    <li key={item._id}>
      <p><strong>{item.productId}</strong></p>
      <p>Quantity: {item.quantity}</p>
      <p>Price per item: {item.price} kr</p>
      <p>Subtotal: {item.price * item.quantity} kr</p>
      <hr />
    </li>
  ))}

  <li>
    <p><strong>Total:</strong> {cart?.reduce((total, item) => total + item.price * item.quantity, 0)} kr</p>
  </li>
</ul>
      <div ref={paypal}></div>
    </div>
  );
};
