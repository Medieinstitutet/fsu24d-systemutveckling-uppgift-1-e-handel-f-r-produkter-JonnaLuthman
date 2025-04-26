import { useState } from "react";
import {
  updateProduct,
  fetchProducts,
  fetchProductById,
  deleteProduct,
  createProduct,
} from "../services/productService";
import { Product } from "../types/Product";

export const useProducts = () => {
  const [error, setError] = useState<string>("");

  const fetchProductsHandler = async () => {
    try {
      const data = await fetchProducts();
      return data;
    } catch (error) {
      setError("Error fetching products");
      throw error;
    } finally {
    }
  };

  const fetchProductByIdHandler = async (id: number) => {
    try {
      const data = await fetchProductById(id);
      return data;
    } catch (error) {
      setError("Error fetching product");
      throw error;
    } finally {
    }
  };

  const deleteProductHandler = async (id: number) => {
    try {
      await deleteProduct(id);
    } catch (error) {
      setError("Error: Could not delete product");
      throw error;
    } finally {
    }
  };

  const updateProductHandler = async (id: number, payload: Product) => {
    try {
      const data = await updateProduct(id, payload);
      return data;
    } catch (error) {
      setError("Error: Could not update product");
      throw error;
    } finally {
    }
  };

  const createProductHandler = async (payload: Product) => {
    try {
      const data = await createProduct(payload);
      return data;
    } catch (error) {
      setError("Error: Could not create product");
      throw error;
    } finally {
    }
  };

  return {
    error,
    fetchProductsHandler,
    deleteProductHandler,
    updateProductHandler,
    fetchProductByIdHandler,
    createProductHandler,
  };
};
