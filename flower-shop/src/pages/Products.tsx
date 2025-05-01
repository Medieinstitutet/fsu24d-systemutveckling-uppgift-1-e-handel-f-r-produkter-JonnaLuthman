import { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts";
import { Product } from "../types/Product";
import { addToCart } from "../services/cartService";
import { CartItemCreate } from "../types/CartItem";
import { useCart } from "../hooks/useCart";

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");
  const { fetchProductsHandler } = useProducts();
  const { handleAddToCart } = useCart();

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

  const handleClick = async (
    productId: string,
    price: number,
    quantity = 1
  ) => {
    const payload: CartItemCreate = {
      productId: productId,
      price: price,
      quantity: quantity,
    };
    await handleAddToCart(payload);
  };

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
              <button
                onClick={() => {
                  handleClick(product._id, product.price);
                }}
              >
                Add to cart
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
