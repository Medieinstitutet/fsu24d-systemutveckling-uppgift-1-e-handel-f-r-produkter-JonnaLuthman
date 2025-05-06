import { Link } from "react-router";
import "../../styles/adminGeneral.css"

export const Admin = () => {
  return (
    <div>
      <h2>Admin managemant</h2>
      <p>This is where you can see orders and manage products on your website.</p>
      <button className="admin-button">
        <Link to={"/admin/orders"}>Orders</Link>
      </button>
      <button className="admin-button">
        <Link to={"/admin/products"}>Products</Link>
      </button>
    </div>
  );
};
