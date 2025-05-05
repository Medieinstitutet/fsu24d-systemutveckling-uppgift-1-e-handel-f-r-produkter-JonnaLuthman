import { useState } from "react";
import { CartSummary } from "../../components/Checkout/CartSummary.tsx";
import { CustomerForm } from "../../components/Checkout/CustomerForm.tsx";
import { CartItemWithDetails } from "../../types/CartItem.ts";
import { PaypalCheckoutButton } from "../../components/Checkout/PaypalCheckoutButton.tsx";

export const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerCreated, setCustomerCreated] = useState(false);

  const handleCustomerCreated = (id: string) => {
    setCustomerId(id);
    setCustomerCreated(true);
  };

  return (
    <div>
      <h1>Checkout</h1>

      {!customerCreated && (
        <>
          <CartSummary onCartReady={setCartItems} />
          <CustomerForm onCustomerCreated={handleCustomerCreated} />
        </>
      )}

      {cartItems.length > 0 && customerId && customerCreated && (
        <PaypalCheckoutButton customerId={customerId} cart={cartItems} />
      )}
    </div>
  );
};
