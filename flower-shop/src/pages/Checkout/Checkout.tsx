import { useState } from "react";
import { CartSummary } from "../../components/checkout/CartSummary.tsx";
import { CustomerForm } from "../../components/checkout/CustomerForm.tsx";
import { CartItemWithDetails } from "../../types/CartItem.ts";
import { PaypalCheckoutButton } from "../../components/checkout/PaypalCheckoutButton.tsx";

export const Checkout = () => {
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [customer_id, setCustomer_id] = useState<string | null>(null);
  const [customerCreated, setCustomerCreated] = useState(false);

  const handleCustomerCreated = (id: string) => {
    setCustomer_id(id);
    setCustomerCreated(true);
  };

  return (
    <div>
      <h1>Checkout</h1>

      <CartSummary onCartReady={setCartItems} />

      {!customerCreated && (
        <CustomerForm onCustomerCreated={handleCustomerCreated} />
      )}

      {cartItems.length > 0 && customer_id && customerCreated && (
        <PaypalCheckoutButton customer_id={customer_id} cart={cartItems} />
      )}
    </div>
  );
};

