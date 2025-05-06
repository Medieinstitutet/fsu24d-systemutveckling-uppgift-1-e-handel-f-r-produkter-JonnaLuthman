import { Link } from "react-router";
import "../styles/homepage.css"

export const Homepage = () => {
  return <div className="homepage">
  <h1>Welcome to Flower</h1>
  <p>Discover our beautiful products and make your home bloom!</p>

  <div className="homepage-actions">
    <Link to="/products">
      <button>Browse Products</button>
    </Link>
  </div>
</div>
};
