import { ChangeEvent, useState } from "react";
import { CustomerCreate } from "../types/Customer";

export const CustomerForm = () => {
  const [customer, setCustomer] = useState<CustomerCreate>({
    first_name: "",
    last_name: "",
    email: "",
    street_address: "",
    zip_code: "",
    city: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {

  }

  return (
    <div className="container">
      <form action="onSubmit">
        <div className="row">
          <h3>Billing Address</h3>
          <label htmlFor="fname">First name</label>
          <input
            required
            onChange={handleChange}
            type="text"
            id="fname"
            name="first_name"
            placeholder="First name"
          />
          <label htmlFor="lname">Last name</label>
          <input
            required
            onChange={handleChange}
            type="text"
            id="lname"
            name="last_name"
            placeholder="Last name"
          />
          <label htmlFor="email">Email</label>
          <input
            required
            onChange={handleChange}
            type="text"
            id="email"
            name="email"
            placeholder="Email"
          />
          <label htmlFor="adr">Address</label>
          <input
            required
            onChange={handleChange}
            type="text"
            id="adr"
            name="street_address"
            placeholder="Address"
          />
          <label htmlFor="zip">Zip</label>
          <input
            required
            onChange={handleChange}
            type="text"
            id="zip"
            name="zip_code"
            placeholder="Zip code"
          />
          <label htmlFor="city">City</label>
          <input
            required
            onChange={handleChange}
            type="text"
            id="city"
            name="city"
            placeholder="City"
          />
        </div>
        <button type="submit" onClick={(e) => handleSubmit(e)}>Continue checkout</button>
      </form>
    </div>
  );
};
