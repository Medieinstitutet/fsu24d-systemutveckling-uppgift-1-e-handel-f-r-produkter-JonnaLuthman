import { Customer } from "../models/Customer.js";

const customerModel = new Customer();

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerModel.findAll();

    if (!customers) {
      return res.status(404).send({ error: "Could not fetch customers" });
    }
    res.send(customers);
  } catch (error) {
    console.error("Error");
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getCustomerById = async (req, res) => {
  const customerId = req.params.id;

  try {
    const customer = await customerModel.findById(customerId);

    if (!customer) {
      return res.status(404).send({ error: "Customer not found" });
    }

    res.send(customer);
  } catch (error) {
    console.error("Error");
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const createCustomer = async (req, res) => {
  const { first_name, last_name, email, street_address, zip_code, city } =
    req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !street_address ||
    !zip_code ||
    !city
  ) {
    return res.status(400).send({ error: "All fields are required" });
  }

  const newCustomer = {
    first_name,
    last_name,
    email,
    street_address,
    zip_code,
    city
  };

  try {
    const result = await customerModel.create(newCustomer);
    res.send({ message: "Customer created", id: result.insertedId });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const deleteCustomer = async (req, res) => {
  const customersId = req.params.id;

  try {
    const result = await customerModel.delete(customersId);

    if (result.deletedCount === 0) {
      return res.status(400).send({ error: "Could not find customer" });
    }
    res.send({ "User deleted": result });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const updateCustomer = async (req, res) => {
  const customerId = req.params.id;
  const updateData = req.body;

  try {
    const result = await customerModel.update(customerId, updateData);
    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Customer not found" });
    }

    const updateCustomer = await customerModel.findById(customerId);

    res.send({ "Customer updated": updateCustomer });
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
