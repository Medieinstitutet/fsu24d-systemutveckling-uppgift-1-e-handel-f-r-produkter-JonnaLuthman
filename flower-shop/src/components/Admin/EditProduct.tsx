import { useEffect, useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { Product, ProductCreate } from "../../types/Product";

export default function AdminProductPage() {
  const {
    fetchProductsHandler,
    updateProductHandler,
    createProductHandler,
    deleteProductHandler,
    error,
  } = useProducts();

  const [products, setProducts] = useState<Product[]>([]);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<ProductCreate>({
    title: "", price: 0, stock: 0, description: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProductsHandler();
      setProducts(data);
    };
    fetchData();
  }, []);

  const handleUpdate = async () => {
    if (!editProduct) return;
    const updated = await updateProductHandler(editProduct._id, editProduct);
    setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
    setEditProduct(null);
  };

  const handleCreate = async () => {
    const created = await createProductHandler(newProduct);
    setProducts(prev => [...prev, created]);
    setNewProduct({ _id: "", title: "", price: 0, stock: 0, description: "" });
  };

  return (
    <div>
      <h1>Admin - Products</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>All Products</h2>
      {products.map(product => (
        <div key={product._id}>
          {editProduct?._id === product._id ? (
            <div>
              <input
                value={editProduct.title}
                onChange={e => setEditProduct({ ...editProduct, title: e.target.value })}
              />
              <input
                type="number"
                value={editProduct.price}
                onChange={e => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
              />
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEditProduct(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>{product.title} - {product.price} kr</p>
              <button onClick={() => setEditProduct(product)}>Edit</button>
              <button onClick={() => deleteProductHandler(product._id)}>Delete</button>
            </div>
          )}
        </div>
      ))}

      <h2>Create new product</h2>
      <input
        placeholder="Title"
        value={newProduct.title}
        onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
      />
      <input
        type="number"
        placeholder="Price"
        value={newProduct.price}
        onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
      />
      <input
        type="number"
        placeholder="Stock"
        value={newProduct.stock}
        onChange={e => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
      />
      <textarea
        placeholder="Description"
        value={newProduct.description}
        onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
      />
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}

