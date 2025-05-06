import { useState, useEffect } from "react";
import { useProducts } from "../hooks/useProducts.ts";
import { Product } from "../types/Product.ts";
import { CartItemCreate } from "../types/CartItem.ts";
import { useCart } from "../hooks/useCart.ts";
import "../styles/productsPage.css"

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
  }, [products]);
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
    <div className="product-list">
      <h1>Products</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul className="product-grid">
          {products.map((product) => (
            <li key={product._id} className="product-card">
              <img
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.title}</h3>
                <p>{product.price} sek</p>
                <p>Stock: {product.stock}</p>
                <p className="product-description">{product.description}</p>
                <button onClick={() => handleClick(product._id, product.price)}>
                  Add to cart
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
