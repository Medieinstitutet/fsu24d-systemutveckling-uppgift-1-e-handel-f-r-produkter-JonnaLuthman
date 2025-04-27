import { Link } from 'react-router';
import '../styles/footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-column">
        <h4>Links</h4>
        <ul>
          <li><Link to="/contact-us">Contact us</Link></li>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
      </div>

      <div className="footer-column">
        <h4>About the Company</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      <div className="footer-column">
        <h4>Address</h4>
        <p>123 Business Street<br />12345 Cityville<br />Country</p>
      </div>
    </footer>
  );
};

