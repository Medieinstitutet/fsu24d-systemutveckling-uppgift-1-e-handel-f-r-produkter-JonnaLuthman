import axios from "axios";
import { useEffect, useRef } from "react";

// Declare a custom type for window.paypal
declare global {
  interface Window {
    paypal: any;
  }
}
import { CartItemWithDetails } from "../../types/CartItem";
import { useOrders } from "../../hooks/useOrders";
import { OrderCreate } from "../../types/Order";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
} from "../../utils/localStorage";
import { useNavigate } from "react-router";
import { calculateCartTotal } from "../../utils/calculateCartTotal";
import { PaypalResponse } from "../../types/ApiResponse";

interface ICartProps {
  cart: CartItemWithDetails[] | null;
  customer_id: string;
}

export const PaypalCheckoutButton = ({ cart, customer_id }: ICartProps) => {
  const paypal = useRef(null);
  const { createOrderHandler } = useOrders();
  const navigate = useNavigate();

  console.log("customer_id", customer_id, "cart", cart);
  console.log("Paypal button init", { cart, customer_id });

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
        async onApprove(data: PaypalResponse) {
          console.log("onApprove data", data);
          try {
            const response = await axios.post(
              `/api/paypal/${data.orderID}/capture`
            );

            const orderData = response.data;
            const payload: OrderCreate = {
              cart_id: await getFromLocalStorage("cartId"),
              customer_id: customer_id,
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
  }, [cart, , customer_id, createOrderHandler]);

  return <div ref={paypal}></div>;
};
