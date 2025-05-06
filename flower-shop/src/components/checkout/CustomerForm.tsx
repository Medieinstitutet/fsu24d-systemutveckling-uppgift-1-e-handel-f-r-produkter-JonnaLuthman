import { useState } from "react";
import { createCustomer } from "../../services/customerService.js";
import { CustomerCreate } from "../../types/Customer.js";
import "../../styles/customerForm.css";

interface Props {
  onCustomerCreated: (customer_id: string) => void;
}

export const CustomerForm = ({ onCustomerCreated }: Props) => {
  const [formData, setFormData] = useState<CustomerCreate>({
    first_name: "",
    last_name: "",
    email: "",
    street_address: "",
    zip_code: "",
    city: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // TODO - check if customer already exists.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await createCustomer(formData);
      const customer_id = response.id;

      if (customer_id) {
        console.log("customer_id", customer_id)
        onCustomerCreated(customer_id);
      } else {
        console.error("Response missing customer_id");
      }
    } catch (err) {
      console.error("Error creating customer:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <h2>Billing information</h2>

      <label>
        First name
        <input
          name="first_name"
          placeholder="First name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Last name
        <input
          name="last_name"
          placeholder="Last name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Email
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Street address
        <input
          name="street_address"
          placeholder="Street address"
          value={formData.street_address}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        ZIP code
        <input
          name="zip_code"
          placeholder="ZIP code"
          value={formData.zip_code}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        City
        <input
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </label>

      <button type="submit">Proceed to checkout</button>
    </form>
  );
};
