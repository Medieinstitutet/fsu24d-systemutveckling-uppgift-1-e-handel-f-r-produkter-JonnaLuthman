import { useEffect, useState } from "react";
import { useProducts } from "../../hooks/useProducts";
import { Product, ProductCreate } from "../../types/Product";
import "../../styles/adminGeneral.css";

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
    title: "",
    price: 0,
    stock: 0,
    description: "",
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
    setProducts((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );
    setEditProduct(null);
    setProducts((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );
  };

  const handleCreate = async () => {
    const created = await createProductHandler(newProduct);
    setProducts((prev) => [...prev, created]);
    setNewProduct({ title: "", price: 0, stock: 0, description: "" });
  };

  const handleDelete = async (id: string) => {
    await deleteProductHandler(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="admin-container">
      <h1>Admin</h1>
      <h2>Product Management</h2>
      {error && <p className="error">{error}</p>}

      <h2>All Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <hr style={{ margin: "1rem 0" }} />
            {editProduct?._id === product._id ? (
              <div className="edit-form">
                <label>
                  Title
                  <input
                    required
                    value={editProduct.title}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, title: e.target.value })
                    }
                  />
                </label>
                <label>
                  Price
                  <input
                    required
                    type="number"
                    value={editProduct.price}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Stock
                  <input
                    required
                    type="number"
                    value={editProduct.stock}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        stock: Number(e.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Description
                  <textarea
                    required
                    value={editProduct.description}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        description: e.target.value,
                      })
                    }
                  />
                </label>
                <button className="admin-button" onClick={handleUpdate}>Save</button>
                <button className="admin-button" onClick={() => setEditProduct(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>
                  <strong>{product.title}</strong>
                </p>
                <p>{product.description}</p>
                <p>
                  {product.price} kr | Stock: {product.stock}
                </p>
                <button className="admin-button" onClick={() => setEditProduct(product)}>Edit</button>
                <button className="admin-button" onClick={() => handleDelete(product._id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <h2>Create New Product</h2>
      <div className="create-form">
        <label>
          Title
          <input
            placeholder="tile"
            value={newProduct.title}
            onChange={(e) =>
              setNewProduct({ ...newProduct, title: e.target.value })
            }
          />
        </label>
        <label>
          Price
          <input
            placeholder="price"
            type="number"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: Number(e.target.value) })
            }
          />
        </label>
        <label>
          Stock
          <input
            placeholder="stock"
            type="number"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: Number(e.target.value) })
            }
          />
        </label>
        <label>
          Description
          <textarea
            placeholder="description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
        </label>
        <button onClick={handleCreate}>Create Product</button>
      </div>
    </div>
  );
}
