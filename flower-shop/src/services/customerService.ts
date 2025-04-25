import axios from "axios";
import { Customer, CustomerCreate, CustomerPublic } from "../types/Customer";

const CUSTOMER_URL = "https://localhost:4000/customers";

export const fetchCustomers = async (): Promise<Customer[]> => {
    try {
        const response = await axios.get<Customer[]>(CUSTOMER_URL);
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const fetchCustomerById = async (id: number): Promise<Customer> => {
    try {
        const response = await axios.get(`${CUSTOMER_URL}/${id}`)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const createCustomer = async (payload: CustomerCreate | CustomerPublic): Promise<Customer> => {
    try {
        const response = await axios.post(CUSTOMER_URL, payload);
        return response.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}


export const updateCustomer = async (id: number, payload: Customer) => {
    try {
        const response = await axios.patch(`${CUSTOMER_URL}/${id}`, payload)
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}
