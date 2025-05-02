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
import { getFromLocalStorage } from "../../utils/localStorage";
import { useNavigate } from "react-router";

interface ICartProps {
  cart: CartItem[] | null;
}

export const Paypal = ({ cart }: ICartProps) => {
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
          const totalAmount = cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );

          const payload = {
            cart: cart.map((item) => ({
              product_id: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
            amount: totalAmount.toFixed(2),
          };

          try {
            const response = await axios.post(
              "/api/orders/paypal",
              payload
            );
            const orderData = response.data;

            console.log(orderData);
            if (orderData.jsonResponse.id) {
              return orderData.jsonResponse.id;
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
              `/api/orders/${data.orderID}/capture`
            );
            const orderData = response.data;

            const payload: OrderCreate = {
              cart_id: await getFromLocalStorage("cartId"),
              customer_id: "Jonna",
              payment_status: "Paid",
              order_status: "Created",
            };

            const result = await createOrderHandler(payload);
            console.log(result);

            const transaction =
              orderData?.purchase_units?.[0]?.payments?.captures?.[0];

            if (transaction) {
              alert(`Tack! Betalning ${transaction.status}: ${transaction.id}`);
              navigate("/order-confirmation", {
                state: { orderId: result._id },
              });
            } else {
              alert("Något gick fel.");
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
      <div ref={paypal}></div>
    </div>
  );
};
