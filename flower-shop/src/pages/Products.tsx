import { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../types/Product";

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const { fetchProductsHandler } = useProducts();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProductsHandler();
        setProducts(data);
      } catch (error) {
        setError("Failed to load products");
        console.error(error);
      }
    };

    loadProducts();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Products</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <strong>{product.title}</strong> – ${product.price} <br />
              Stock: {product.stock} <br />
              {product.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
