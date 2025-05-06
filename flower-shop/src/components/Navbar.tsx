import { Link } from 'react-router';
import "../styles/navbar.css"

export const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/contact-us">Contact us</Link></li>
        <li className="dropdown">
          <Link to="/admin" className="dropdown-toggle">Admin ▼</Link>
            <ul className="dropdown-content">
              <li><Link to="/admin/orders">Orders</Link></li>
              <li><Link to="/admin/products">Products</Link></li>
            </ul>
        </li>

        <li className='cart-link'><Link to="/checkout">Cart</Link></li>
      </ul>
    </nav>
  );
};
