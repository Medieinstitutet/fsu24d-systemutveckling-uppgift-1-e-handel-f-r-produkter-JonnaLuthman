import axios from "axios";
import { Product, ProductCreate } from "../types/Product";

const PRODUCT_URL = "/api/products";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${PRODUCT_URL}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const fetchProductById = async (id: string): Promise<Product> => {
  try {
    const response = await axios.get(`${PRODUCT_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${PRODUCT_URL}/${id}/delete`);
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const createProduct = async (payload: ProductCreate): Promise<Product> => {
  try {
    console.log("payload", payload)
    const response = await axios.post(`${PRODUCT_URL}/add`, payload);
    return response.data
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const updateProduct = async (id: string, payload: Product): Promise<Product> => {
  try {
    const response = await axios.patch(`${PRODUCT_URL}/${id}/update`, payload);
    return response.data
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};
