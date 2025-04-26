import axios from "axios";
import { Product } from "../types/Product";

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

export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const response = await axios.get(`${PRODUCT_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${PRODUCT_URL}/${id}`);
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const createProduct = async (payload: Product): Promise<Product> => {
  try {
    const response = await axios.post(`${PRODUCT_URL}`, payload);
    return response.data
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

export const updateProduct = async (id: number, payload: Product): Promise<Product> => {
  try {
    const response = await axios.patch(`${PRODUCT_URL}/${id}`, payload);
    return response.data
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};
