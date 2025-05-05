import axios from "axios";
import { CustomerCreate, Customer } from "../types/Customer";
import { ApiResponse } from "../types/ApiResponse";

const CUSTOMER_URL = "/api/customers";

export const createCustomer = async (
  payload: CustomerCreate
): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${CUSTOMER_URL}/add`, payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

